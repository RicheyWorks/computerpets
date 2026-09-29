package com.enterprisepet.config;

import com.enterprisepet.security.MetricsScrapeTokenFilter;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Fail-hard checks that only run when {@code spring.profiles.active} includes
 * {@code prod}. Environment variables outrank {@code application-prod.yml}, so
 * this guard exists to catch {@code MICROSOFT_DEV_MODE=true},
 * {@code RATE_LIMIT_BACKEND=memory}, an H2 {@code SPRING_DATASOURCE_URL},
 * a misconfigured {@code SPRING_DATASOURCE_REPLICA_URL}, a half-configured
 * Postgres TLS pair ([ADR 0076](../../docs/adr/0076-postgres-transit-tls.md)),
 * a JVM keystore or a cleartext public API origin when
 * {@code API_LISTENER_TLS_REQUIRED} is set
 * ([ADR 0077](../../docs/adr/0077-api-listener-tls.md)),
 * plain env {@code Secret} injection without an External Secrets /
 * {@code *_FILE} / Vault-agent operator attestation
 * ([ADR 0064](../../docs/adr/0064-secret-operator-prod-refuses-plain-env.md)),
 * or a stale optional {@code COMPUTERPETS_KEYS_ROTATED_AT} stamp
 * ([ADR 0065](../../docs/adr/0065-secret-rotation-cadence-and-hsm.md)).
 */
@Component
@Profile("prod")
public class ProductionProfileGuard {

    private static final Logger log = LoggerFactory.getLogger(ProductionProfileGuard.class);

    /** Operator attestation values accepted on the prod path (ADR 0064). */
    static final Set<String> ALLOWED_SECRETS_SOURCES = Set.of(
            "file",
            "external-secrets",
            "vault-agent"
    );

    /**
     * When {@code COMPUTERPETS_KEYS_ROTATED_AT} is set on prod, refuse start if
     * the stamp is older than this (license lifetime + buffer). Blank stamp is
     * allowed — operators opt in (ADR 0065).
     */
    static final Duration KEYS_ROTATED_AT_MAX_AGE = Duration.ofDays(400);

    /** Critical house crypto keys that must use {@code *_FILE} when source is {@code file}. */
    static final List<String> CRITICAL_SECRET_ENV_NAMES = List.of(
            "LICENSE_SECRET_KEY",
            "JWT_SECRET_KEY",
            "BUNDLE_SIGNING_KEY",
            "ADMIN_API_KEY"
    );

    private final boolean microsoftDevMode;
    private final String rateLimitBackend;
    private final String datasourceUrl;
    private final String replicaDatasourceUrl;
    private final String secretsSource;
    private final String allowPlainSecret;
    private final String keysRotatedAt;
    private final Environment environment;

    public ProductionProfileGuard(
            @Value("${microsoft.dev-mode:false}") boolean microsoftDevMode,
            @Value("${rate-limit.backend:redis}") String rateLimitBackend,
            @Value("${spring.datasource.url}") String datasourceUrl,
            @Value("${spring.datasource.replica.url:}") String replicaDatasourceUrl,
            @Value("${COMPUTERPETS_SECRETS_SOURCE:}") String secretsSource,
            @Value("${COMPUTERPETS_ALLOW_PLAIN_SECRET:false}") String allowPlainSecret,
            @Value("${COMPUTERPETS_KEYS_ROTATED_AT:}") String keysRotatedAt,
            Environment environment) {
        this.microsoftDevMode = microsoftDevMode;
        this.rateLimitBackend = rateLimitBackend;
        this.datasourceUrl = datasourceUrl;
        this.replicaDatasourceUrl = replicaDatasourceUrl;
        this.secretsSource = secretsSource == null ? "" : secretsSource.trim();
        this.allowPlainSecret = allowPlainSecret == null ? "" : allowPlainSecret.trim();
        this.keysRotatedAt = keysRotatedAt == null ? "" : keysRotatedAt.trim();
        this.environment = environment;
    }

    @PostConstruct
    void rejectUnsafeProductionSettings() {
        if (microsoftDevMode) {
            throw new IllegalStateException(
                "microsoft.dev-mode is true while spring.profiles.active=prod. "
                + "Microsoft Store ownership would be granted without verification. "
                + "Unset MICROSOFT_DEV_MODE.");
        }
        if (!RateLimitProperties.BACKEND_REDIS.equalsIgnoreCase(rateLimitBackend)) {
            throw new IllegalStateException(
                "rate-limit.backend must be redis when spring.profiles.active=prod "
                + "(got '" + rateLimitBackend + "'). memory is not shared across replicas.");
        }
        if (datasourceUrl == null || datasourceUrl.isBlank()
                || datasourceUrl.toLowerCase(Locale.ROOT).contains("jdbc:h2:")) {
            throw new IllegalStateException(
                "spring.datasource.url must be PostgreSQL when spring.profiles.active=prod. "
                + "Set SPRING_DATASOURCE_URL (jdbc:postgresql://...). H2 is not allowed.");
        }
        if (ReplicaRoutingSupport.isConfigured(replicaDatasourceUrl)) {
            ReplicaRoutingSupport.validateDenySafe(datasourceUrl, replicaDatasourceUrl);
            if (!replicaDatasourceUrl.toLowerCase(Locale.ROOT).contains("jdbc:postgresql:")) {
                throw new IllegalStateException(
                    "spring.datasource.replica.url must be PostgreSQL when spring.profiles.active=prod. "
                    + "Unset SPRING_DATASOURCE_REPLICA_URL or point it at a Postgres read replica.");
            }
        }
        rejectUnsafePostgresTls();
        rejectUnsafeApiListenerTls();
        rejectPlainEnvSecrets();
        rejectUnsafeRedisAuth();
        rejectUnsafeMetricsScrapeToken();
        rejectStaleKeysRotatedAt();
        log.info(
                "Production profile guard passed (Postgres ssl={}, API listener tls={}, Redis auth={}, ssl={}, metrics scrape={}, microsoft.dev-mode=false, secrets source={}).",
                postgresSslLabel(),
                apiListenerTlsRequired() ? "required" : "off",
                redisAuthRequired() ? "required" : "off",
                redisSsl() ? "on" : "off",
                metricsScrapeToken().isBlank() ? "closed" : "token",
                plainSecretAllowed() ? "plain-local-override" : secretsSource.toLowerCase(Locale.ROOT));
    }

    /**
     * Prod Postgres TLS is all-or-nothing (ADR 0076). Unset
     * {@code POSTGRES_SSL_REQUIRED} and {@code POSTGRES_SSL_ROOT_CERT}, and a
     * JDBC URL with no {@code sslmode}, keeps in-cluster cleartext. Managed
     * RDS sets the flag and {@code sslmode=require}, or {@code verify-full}
     * when a CA bundle path is set. A mixed pair refuses start. The CA path
     * is never logged.
     */
    void rejectUnsafePostgresTls() {
        PostgresJdbcSsl.rejectHalfConfigured(
                datasourceUrl,
                replicaDatasourceUrl,
                postgresSslRequired(),
                postgresSslRootCert());
    }

    /**
     * Prod API listener TLS (ADR 0077). The JVM never terminates TLS. When
     * {@code API_LISTENER_TLS_REQUIRED} is set, the public origin must be
     * {@code https} on port 443. Unset keeps the in-cluster Service on HTTP.
     * The URL is not logged.
     */
    void rejectUnsafeApiListenerTls() {
        ApiListenerTls.rejectCleartextPublicListener(
                apiListenerTlsRequired(),
                apiPublicBaseUrl(),
                serverSslEnabled(),
                serverSslKeyStore());
    }

    private boolean apiListenerTlsRequired() {
        return flag("api-listener.tls-required", "API_LISTENER_TLS_REQUIRED");
    }

    private String apiPublicBaseUrl() {
        String fromBinding = environment.getProperty("api-listener.public-base-url");
        if (fromBinding != null && !fromBinding.isBlank()) {
            return fromBinding.trim();
        }
        String fromEnv = environment.getProperty("API_PUBLIC_BASE_URL");
        return fromEnv == null ? "" : fromEnv.trim();
    }

    private boolean serverSslEnabled() {
        return flag("server.ssl.enabled", "SERVER_SSL_ENABLED");
    }

    private String serverSslKeyStore() {
        String fromBinding = environment.getProperty("server.ssl.key-store");
        if (fromBinding != null && !fromBinding.isBlank()) {
            return fromBinding.trim();
        }
        String fromEnv = environment.getProperty("SERVER_SSL_KEY_STORE");
        return fromEnv == null ? "" : fromEnv.trim();
    }

    private boolean postgresSslRequired() {
        return flag("spring.datasource.ssl-required", "POSTGRES_SSL_REQUIRED");
    }

    private String postgresSslRootCert() {
        String fromBinding = environment.getProperty("spring.datasource.ssl-root-cert");
        if (fromBinding != null && !fromBinding.isBlank()) {
            return fromBinding.trim();
        }
        String fromEnv = environment.getProperty("POSTGRES_SSL_ROOT_CERT");
        return fromEnv == null ? "" : fromEnv.trim();
    }

    private String postgresSslLabel() {
        if (!postgresSslRequired()) {
            return "off";
        }
        return postgresSslRootCert().isBlank() ? "require" : "verify-full";
    }

    /**
     * Prod Redis AUTH is all-or-nothing (ADR 0075). Unset password, SSL, and
     * {@code REDIS_AUTH_REQUIRED} keeps the AUTH-less in-cluster node. If any
     * one is set, all three must be set. A missing password is fail-closed.
     * File-source prod also requires {@code REDIS_PASSWORD_FILE}. The password
     * value is never logged.
     */
    void rejectUnsafeRedisAuth() {
        if (!RateLimitProperties.BACKEND_REDIS.equalsIgnoreCase(rateLimitBackend)) {
            return;
        }
        boolean authRequired = redisAuthRequired();
        boolean ssl = redisSsl();
        boolean hasPassword = !redisPassword().isBlank();
        if (!authRequired && !ssl && !hasPassword) {
            return;
        }
        if (!authRequired || !ssl || !hasPassword) {
            throw new IllegalStateException(
                    "Redis AUTH on prod is all-or-nothing (ADR 0075). "
                            + "Set REDIS_AUTH_REQUIRED=true, REDIS_SSL=true, and REDIS_PASSWORD "
                            + "(or REDIS_PASSWORD_FILE) together. "
                            + "Leave all three unset for the AUTH-less in-cluster Redis. "
                            + "Refusing a half-configured node (auth-required=" + authRequired
                            + ", ssl=" + ssl + ", password=" + (hasPassword ? "set" : "missing") + ").");
        }
        if ("file".equals(secretsSource.toLowerCase(Locale.ROOT)) && !plainSecretAllowed()) {
            String filePath = environment.getProperty("REDIS_PASSWORD_FILE");
            if (filePath == null || filePath.isBlank()) {
                throw new IllegalStateException(
                        "COMPUTERPETS_SECRETS_SOURCE=file requires REDIS_PASSWORD_FILE on prod "
                                + "when Redis AUTH is on. Mount the token and set the path. "
                                + "Missing path refuses start — do not invent a token (ADR 0075).");
            }
        }
    }

    /**
     * The metrics scrape bearer is optional (ADR 0133). Unset keeps
     * {@code /actuator/prometheus} closed to everyone. If set on prod it must be
     * at least {@link MetricsScrapeTokenFilter#MIN_TOKEN_LENGTH} characters, and
     * file-source prod also requires {@code METRICS_SCRAPE_TOKEN_FILE}. The token
     * value is never logged.
     */
    void rejectUnsafeMetricsScrapeToken() {
        String token = metricsScrapeToken();
        if (token.isBlank()) {
            return;
        }
        if (!MetricsScrapeTokenFilter.usable(token)) {
            throw new IllegalStateException(
                    "METRICS_SCRAPE_TOKEN on prod must be at least "
                            + MetricsScrapeTokenFilter.MIN_TOKEN_LENGTH + " characters (ADR 0133). "
                            + "Generate one with: openssl rand -hex 32. "
                            + "Unset it to keep /actuator/prometheus closed.");
        }
        if ("file".equals(secretsSource.toLowerCase(Locale.ROOT)) && !plainSecretAllowed()) {
            String filePath = environment.getProperty("METRICS_SCRAPE_TOKEN_FILE");
            if (filePath == null || filePath.isBlank()) {
                throw new IllegalStateException(
                        "COMPUTERPETS_SECRETS_SOURCE=file requires METRICS_SCRAPE_TOKEN_FILE on prod "
                                + "when a metrics scrape token is set. Mount the token and set the path (ADR 0133).");
            }
        }
    }

    private String metricsScrapeToken() {
        String fromBinding = environment.getProperty("metrics.scrape-token");
        if (fromBinding != null && !fromBinding.isBlank()) {
            return fromBinding;
        }
        String fromEnv = environment.getProperty("METRICS_SCRAPE_TOKEN");
        return fromEnv == null ? "" : fromEnv;
    }

    private boolean redisAuthRequired() {
        return flag("rate-limit.redis.auth-required", "REDIS_AUTH_REQUIRED");
    }

    private boolean redisSsl() {
        return flag("rate-limit.redis.ssl", "REDIS_SSL");
    }

    private String redisPassword() {
        String fromBinding = environment.getProperty("rate-limit.redis.password");
        if (fromBinding != null && !fromBinding.isBlank()) {
            return fromBinding;
        }
        String fromEnv = environment.getProperty("REDIS_PASSWORD");
        return fromEnv == null ? "" : fromEnv;
    }

    private boolean flag(String primary, String fallback) {
        String value = environment.getProperty(primary);
        if (value == null || value.isBlank()) {
            value = environment.getProperty(fallback);
        }
        return truthy(value);
    }

    private static boolean truthy(String value) {
        if (value == null) {
            return false;
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return "true".equals(normalized)
                || "1".equals(normalized)
                || "yes".equals(normalized)
                || "on".equals(normalized);
    }

    /**
     * Prod refuses hand-filled plain env {@code Secret} unless the operator attests
     * External Secrets, file mounts, or Vault agent — or sets the local-only
     * {@code COMPUTERPETS_ALLOW_PLAIN_SECRET=1} escape (never on the real prod path).
     */
    void rejectPlainEnvSecrets() {
        if (plainSecretAllowed()) {
            log.warn(
                    "COMPUTERPETS_ALLOW_PLAIN_SECRET is set — plain env Secret accepted "
                            + "(local / scaffolding only; never on the real prod path).");
            return;
        }
        String source = secretsSource.toLowerCase(Locale.ROOT);
        if (source.isBlank()) {
            throw new IllegalStateException(
                    "COMPUTERPETS_SECRETS_SOURCE is unset while spring.profiles.active=prod. "
                            + "Plain env Secret / hand-filled secret.yaml is refused on the prod path. "
                            + "Set COMPUTERPETS_SECRETS_SOURCE to external-secrets, file, or vault-agent "
                            + "(ADR 0064). Local scaffolding only: COMPUTERPETS_ALLOW_PLAIN_SECRET=1.");
        }
        if (!ALLOWED_SECRETS_SOURCES.contains(source)) {
            throw new IllegalStateException(
                    "COMPUTERPETS_SECRETS_SOURCE='" + secretsSource + "' is not allowed on prod. "
                            + "Use external-secrets, file, or vault-agent. "
                            + "Plain env / hand-filled Opaque Secret is refused (ADR 0064).");
        }
        if ("file".equals(source)) {
            for (String name : CRITICAL_SECRET_ENV_NAMES) {
                String filePath = environment.getProperty(name + "_FILE");
                if (filePath == null || filePath.isBlank()) {
                    throw new IllegalStateException(
                            "COMPUTERPETS_SECRETS_SOURCE=file requires " + name + "_FILE on prod. "
                                    + "Mount the secret and set the path (Docker secrets / projected volume / "
                                    + "Vault agent). Missing path refuses start — do not invent a secret. "
                                    + "See deploy/k8s/deployment-secrets-file.example.yaml (ADR 0064).");
                }
            }
        }
    }

    /**
     * Optional rotation stamp. When operators set it, refuse a stamp older than
     * {@link #KEYS_ROTATED_AT_MAX_AGE} so mid-flight rotation cannot leave only
     * expired material without an operator refresh (ADR 0065).
     */
    void rejectStaleKeysRotatedAt() {
        if (keysRotatedAt.isBlank()) {
            return;
        }
        Instant rotated;
        try {
            rotated = Instant.parse(keysRotatedAt);
        } catch (DateTimeParseException e) {
            throw new IllegalStateException(
                    "COMPUTERPETS_KEYS_ROTATED_AT='" + keysRotatedAt
                            + "' is not a valid ISO-8601 instant (e.g. 2026-09-22T12:00:00Z). "
                            + "Unset it or set a parseable stamp (ADR 0065).",
                    e);
        }
        Instant now = Instant.now();
        if (rotated.isAfter(now.plus(Duration.ofHours(1)))) {
            throw new IllegalStateException(
                    "COMPUTERPETS_KEYS_ROTATED_AT is in the future. Refusing start (ADR 0065).");
        }
        if (rotated.isBefore(now.minus(KEYS_ROTATED_AT_MAX_AGE))) {
            throw new IllegalStateException(
                    "COMPUTERPETS_KEYS_ROTATED_AT is older than "
                            + KEYS_ROTATED_AT_MAX_AGE.toDays()
                            + " days while spring.profiles.active=prod. "
                            + "Rotate house keys (JWT / bundle / license / admin), refresh the stamp, "
                            + "and keep *_PREVIOUS only for the dual-key window (ADR 0065).");
        }
    }

    private boolean plainSecretAllowed() {
        return "1".equals(allowPlainSecret) || "true".equalsIgnoreCase(allowPlainSecret);
    }
}
