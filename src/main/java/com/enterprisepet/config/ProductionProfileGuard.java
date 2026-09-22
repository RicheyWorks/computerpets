package com.enterprisepet.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Fail-hard checks that only run when {@code spring.profiles.active} includes
 * {@code prod}. Environment variables outrank {@code application-prod.yml}, so
 * this guard exists to catch {@code MICROSOFT_DEV_MODE=true},
 * {@code RATE_LIMIT_BACKEND=memory}, an H2 {@code SPRING_DATASOURCE_URL},
 * a misconfigured {@code SPRING_DATASOURCE_REPLICA_URL}, or plain env
 * {@code Secret} injection without an External Secrets / {@code *_FILE} /
 * Vault-agent operator attestation ([ADR 0064](../../docs/adr/0064-secret-operator-prod-refuses-plain-env.md)).
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
    private final Environment environment;

    public ProductionProfileGuard(
            @Value("${microsoft.dev-mode:false}") boolean microsoftDevMode,
            @Value("${rate-limit.backend:redis}") String rateLimitBackend,
            @Value("${spring.datasource.url}") String datasourceUrl,
            @Value("${spring.datasource.replica.url:}") String replicaDatasourceUrl,
            @Value("${COMPUTERPETS_SECRETS_SOURCE:}") String secretsSource,
            @Value("${COMPUTERPETS_ALLOW_PLAIN_SECRET:false}") String allowPlainSecret,
            Environment environment) {
        this.microsoftDevMode = microsoftDevMode;
        this.rateLimitBackend = rateLimitBackend;
        this.datasourceUrl = datasourceUrl;
        this.replicaDatasourceUrl = replicaDatasourceUrl;
        this.secretsSource = secretsSource == null ? "" : secretsSource.trim();
        this.allowPlainSecret = allowPlainSecret == null ? "" : allowPlainSecret.trim();
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
        rejectPlainEnvSecrets();
        log.info(
                "Production profile guard passed (Postgres, Redis, microsoft.dev-mode=false, secrets source={}).",
                plainSecretAllowed() ? "plain-local-override" : secretsSource.toLowerCase(Locale.ROOT));
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

    private boolean plainSecretAllowed() {
        return "1".equals(allowPlainSecret) || "true".equalsIgnoreCase(allowPlainSecret);
    }
}
