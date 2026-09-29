package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.env.MockEnvironment;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProductionProfileGuardTest {

    @TempDir
    Path tempDir;

    private static ProductionProfileGuard guard(
            boolean microsoftDevMode,
            String rateLimitBackend,
            String datasourceUrl,
            String replicaDatasourceUrl,
            String secretsSource,
            String allowPlainSecret,
            MockEnvironment environment) {
        return guard(
                microsoftDevMode,
                rateLimitBackend,
                datasourceUrl,
                replicaDatasourceUrl,
                secretsSource,
                allowPlainSecret,
                "",
                environment);
    }

    private static ProductionProfileGuard guard(
            boolean microsoftDevMode,
            String rateLimitBackend,
            String datasourceUrl,
            String replicaDatasourceUrl,
            String secretsSource,
            String allowPlainSecret,
            String keysRotatedAt,
            MockEnvironment environment) {
        return new ProductionProfileGuard(
                microsoftDevMode,
                rateLimitBackend,
                datasourceUrl,
                replicaDatasourceUrl,
                secretsSource,
                allowPlainSecret,
                keysRotatedAt,
                environment);
    }

    private static MockEnvironment envWithFileMounts() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("LICENSE_SECRET_KEY_FILE", "/run/secrets/license_secret_key");
        env.setProperty("JWT_SECRET_KEY_FILE", "/run/secrets/jwt_secret_key");
        env.setProperty("BUNDLE_SIGNING_KEY_FILE", "/run/secrets/bundle_signing_key");
        env.setProperty("ADMIN_API_KEY_FILE", "/run/secrets/admin_api_key");
        return env;
    }

    @Test
    @DisplayName("prod accepts Postgres + Redis + external-secrets attestation")
    void safeProductionSettings_pass() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://computerpets-postgres:5432/computerpets",
                "",
                "external-secrets",
                "false",
                new MockEnvironment());

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod accepts a distinct Postgres read replica URL")
    void distinctReplica_passes() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://primary:5432/computerpets",
                "jdbc:postgresql://replica:5432/computerpets",
                "vault-agent",
                "false",
                new MockEnvironment());

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod accepts file source when all critical *_FILE mounts are set")
    void fileSourceWithMounts_passes() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "file",
                "false",
                envWithFileMounts());

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod refuses Microsoft Store dev-mode")
    void microsoftDevMode_failsHard() {
        ProductionProfileGuard g = guard(
                true,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("microsoft.dev-mode");
    }

    @Test
    @DisplayName("prod refuses the in-memory rate-limit store")
    void memoryRateLimit_failsHard() {
        ProductionProfileGuard g = guard(
                false,
                "memory",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("rate-limit.backend");
    }

    @Test
    @DisplayName("prod refuses an H2 datasource URL")
    void h2Datasource_failsHard() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:h2:mem:enterprisepet",
                "",
                "external-secrets",
                "false",
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("PostgreSQL");
    }

    @Test
    @DisplayName("prod refuses a replica URL that matches the primary")
    void sameReplicaUrl_failsHard() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "jdbc:postgresql://db:5432/computerpets",
                "external-secrets",
                "false",
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("must not equal");
    }

    @Test
    @DisplayName("prod refuses a non-Postgres replica URL")
    void nonPostgresReplica_failsHard() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "jdbc:mysql://replica:3306/computerpets",
                "external-secrets",
                "false",
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("replica.url must be PostgreSQL");
    }

    @Test
    @DisplayName("prod refuses unset COMPUTERPETS_SECRETS_SOURCE (plain env Secret)")
    void unsetSecretsSource_failsHard() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "",
                "false",
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("COMPUTERPETS_SECRETS_SOURCE")
                .hasMessageContaining("Plain env Secret");
    }

    @Test
    @DisplayName("prod refuses unknown COMPUTERPETS_SECRETS_SOURCE values")
    void unknownSecretsSource_failsHard() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "env",
                "false",
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not allowed")
                .hasMessageContaining("external-secrets");
    }

    @Test
    @DisplayName("prod refuses file source when a critical *_FILE mount is missing")
    void fileSourceMissingMount_failsHard() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("LICENSE_SECRET_KEY_FILE", "/run/secrets/license_secret_key");
        env.setProperty("JWT_SECRET_KEY_FILE", "/run/secrets/jwt_secret_key");
        env.setProperty("BUNDLE_SIGNING_KEY_FILE", "/run/secrets/bundle_signing_key");
        // ADMIN_API_KEY_FILE intentionally absent

        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "file",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("ADMIN_API_KEY_FILE")
                .hasMessageContaining("COMPUTERPETS_SECRETS_SOURCE=file");
    }

    @Test
    @DisplayName("COMPUTERPETS_ALLOW_PLAIN_SECRET=1 skips operator attestation (local only)")
    void allowPlainSecret_skipsAttestation() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "",
                "1",
                new MockEnvironment());

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod accepts a fresh COMPUTERPETS_KEYS_ROTATED_AT stamp")
    void freshKeysRotatedAt_passes() {
        String stamp = Instant.now().minus(7, ChronoUnit.DAYS).toString();
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                stamp,
                new MockEnvironment());

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod refuses a stale COMPUTERPETS_KEYS_ROTATED_AT stamp")
    void staleKeysRotatedAt_failsHard() {
        String stamp = Instant.now().minus(401, ChronoUnit.DAYS).toString();
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                stamp,
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("COMPUTERPETS_KEYS_ROTATED_AT")
                .hasMessageContaining("400");
    }

    @Test
    @DisplayName("prod accepts the AUTH-less in-cluster Redis when the trio is unset")
    void redisAuthUnset_passes() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                new MockEnvironment());

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod accepts Redis AUTH when password, SSL, and the required flag are set")
    void redisAuthTrio_passes() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("REDIS_AUTH_REQUIRED", "true");
        env.setProperty("REDIS_SSL", "true");
        env.setProperty("REDIS_PASSWORD", "plan-fixture-token");

        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod refuses Redis AUTH when the password is required and missing")
    void redisAuthRequiredWithoutPassword_failsClosed() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("REDIS_AUTH_REQUIRED", "true");
        env.setProperty("REDIS_SSL", "true");

        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("REDIS_PASSWORD")
                .hasMessageContaining("password=missing")
                .hasMessageNotContaining("plan-fixture-token");
    }

    @Test
    @DisplayName("prod refuses a Redis password without TLS")
    void redisPasswordWithoutSsl_failsClosed() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("REDIS_PASSWORD", "plan-fixture-token");

        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("all-or-nothing")
                .hasMessageContaining("password=set")
                .hasMessageNotContaining("plan-fixture-token");
    }

    @Test
    @DisplayName("prod file source requires REDIS_PASSWORD_FILE when AUTH is on")
    void fileSourceAuthWithoutPasswordFile_failsClosed() {
        MockEnvironment env = envWithFileMounts();
        env.setProperty("REDIS_AUTH_REQUIRED", "true");
        env.setProperty("REDIS_SSL", "true");
        env.setProperty("REDIS_PASSWORD", "plan-fixture-token");

        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "file",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("REDIS_PASSWORD_FILE")
                .hasMessageNotContaining("plan-fixture-token");
    }

    @Test
    @DisplayName("prod file source accepts REDIS_PASSWORD_FILE when AUTH is on")
    void fileSourceAuthWithPasswordFile_passes() {
        MockEnvironment env = envWithFileMounts();
        env.setProperty("REDIS_AUTH_REQUIRED", "true");
        env.setProperty("REDIS_SSL", "true");
        env.setProperty("REDIS_PASSWORD", "plan-fixture-token");
        env.setProperty("REDIS_PASSWORD_FILE", "/run/secrets/redis_password");

        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "file",
                "false",
                env);

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod refuses an unparseable COMPUTERPETS_KEYS_ROTATED_AT stamp")
    void unparseableKeysRotatedAt_failsHard() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                "last-tuesday",
                new MockEnvironment());

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("ISO-8601");
    }

    @Test
    @DisplayName("prod refuses Postgres SSL required without sslmode")
    void postgresSslRequiredWithoutMode_failsClosed() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("POSTGRES_SSL_REQUIRED", "true");
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("all-or-nothing")
                .hasMessageContaining("POSTGRES_SSL_REQUIRED");
    }

    @Test
    @DisplayName("prod accepts sslmode=require when Postgres SSL is required")
    void postgresSslRequire_passes() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("POSTGRES_SSL_REQUIRED", "true");
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets?sslmode=require",
                "jdbc:postgresql://replica:5432/computerpets?sslmode=require",
                "external-secrets",
                "false",
                env);

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod accepts verify-full when the CA bundle is a PEM")
    void postgresVerifyFull_passes() throws Exception {
        Path pem = tempDir.resolve("rds-ca.pem");
        Files.writeString(pem, """
                -----BEGIN CERTIFICATE-----
                MIIB
                -----END CERTIFICATE-----
                """);
        MockEnvironment env = new MockEnvironment();
        env.setProperty("POSTGRES_SSL_REQUIRED", "true");
        String cert = PostgresJdbcSslTest.certPath(pem);
        env.setProperty("POSTGRES_SSL_ROOT_CERT", cert);
        String url = "jdbc:postgresql://db:5432/computerpets?sslmode=verify-full&sslrootcert=" + cert;
        ProductionProfileGuard g = guard(
                false,
                "redis",
                url,
                "",
                "external-secrets",
                "false",
                env);

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod accepts an https public origin when API listener TLS is required")
    void apiListenerHttps_passes() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("API_LISTENER_TLS_REQUIRED", "true");
        env.setProperty("API_PUBLIC_BASE_URL", "https://computerpets.example");
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod refuses a cleartext public origin when API listener TLS is required")
    void apiListenerCleartext_failsClosed() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("API_LISTENER_TLS_REQUIRED", "true");
        env.setProperty("API_PUBLIC_BASE_URL", "http://computerpets.example");
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("cleartext")
                .hasMessageContaining("ADR 0077");
    }

    @Test
    @DisplayName("prod refuses a JVM keystore even when the public listener flag is unset")
    void apiListenerKeystore_failsClosed() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("SERVER_SSL_KEY_STORE", "/etc/ssl/api.p12");
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("server.ssl")
                .hasMessageContaining("ADR 0077");
    }

    @Test
    @DisplayName("prod keeps metrics closed when METRICS_SCRAPE_TOKEN is unset")
    void metricsScrapeTokenUnset_passes() {
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                new MockEnvironment());

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod refuses a short METRICS_SCRAPE_TOKEN without echoing it")
    void shortMetricsScrapeToken_failsClosed() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("METRICS_SCRAPE_TOKEN", "short-fixture");
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("METRICS_SCRAPE_TOKEN")
                .hasMessageContaining("ADR 0133")
                .hasMessageNotContaining("short-fixture");
    }

    @Test
    @DisplayName("prod accepts a 32+ char METRICS_SCRAPE_TOKEN")
    void longMetricsScrapeToken_passes() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("metrics.scrape-token", "plan-fixture-scrape-token-0123456789abcdefghijkl");
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "external-secrets",
                "false",
                env);

        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("prod file source requires METRICS_SCRAPE_TOKEN_FILE when a scrape token is set")
    void fileSourceScrapeTokenWithoutFile_failsClosed() {
        MockEnvironment env = envWithFileMounts();
        env.setProperty("METRICS_SCRAPE_TOKEN", "plan-fixture-scrape-token-0123456789abcdefghijkl");
        ProductionProfileGuard g = guard(
                false,
                "redis",
                "jdbc:postgresql://db:5432/computerpets",
                "",
                "file",
                "false",
                env);

        assertThatThrownBy(g::rejectUnsafeProductionSettings)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("METRICS_SCRAPE_TOKEN_FILE")
                .hasMessageNotContaining("plan-fixture-scrape-token");

        env.setProperty("METRICS_SCRAPE_TOKEN_FILE", "/run/secrets/metrics_scrape_token");
        assertThatCode(g::rejectUnsafeProductionSettings).doesNotThrowAnyException();
    }
}
