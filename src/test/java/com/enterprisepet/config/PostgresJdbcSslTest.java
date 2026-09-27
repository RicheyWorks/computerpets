package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Managed Postgres JDBC TLS (ADR 0076). Cleartext stays valid for local and
 * in-cluster Postgres. A half-configured prod pair refuses to start.
 */
class PostgresJdbcSslTest {

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("managed URL is sslmode=require when no CA path is set")
    void managedUrlRequiresSsl() {
        assertThat(PostgresJdbcSsl.managedUrl("db.example", "computerpets", ""))
                .isEqualTo("jdbc:postgresql://db.example:5432/computerpets?sslmode=require");
        assertThat(PostgresJdbcSsl.managedUrl("db.example", "computerpets", "   "))
                .isEqualTo("jdbc:postgresql://db.example:5432/computerpets?sslmode=require");
    }

    @Test
    @DisplayName("managed URL is verify-full when a CA path is set")
    void managedUrlVerifyFull() {
        assertThat(PostgresJdbcSsl.managedUrl("db.example", "computerpets", "/etc/ssl/rds-ca.pem"))
                .isEqualTo("jdbc:postgresql://db.example:5432/computerpets?sslmode=verify-full&sslrootcert=/etc/ssl/rds-ca.pem");
    }

    @Test
    @DisplayName("unset flag and no sslmode is the in-cluster shape")
    void cleartextPairPasses() {
        assertThatCode(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://computerpets-postgres:5432/computerpets",
                "",
                false,
                ""))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("explicit sslmode=disable stays cleartext when the flag is off")
    void explicitDisablePasses() {
        assertThatCode(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://localhost:5432/computerpets?sslmode=disable",
                "  ",
                false,
                null))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("sslmode=require without the flag is half-configured")
    void requireWithoutFlagFails() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?sslmode=require",
                "",
                false,
                ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("all-or-nothing")
                .hasMessageContaining("ssl-required=false")
                .hasMessageContaining("sslmode=require");
    }

    @Test
    @DisplayName("the flag without sslmode is half-configured")
    void flagWithoutSslModeFails() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets",
                "",
                true,
                ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("all-or-nothing")
                .hasMessageContaining("sslmode-absent");
    }

    @Test
    @DisplayName("prefer is refused because it can fall back to cleartext")
    void preferIsRefused() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?sslmode=prefer",
                "",
                true,
                ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("sslmode=prefer");
    }

    @Test
    @DisplayName("legacy ssl=true is not a substitute for sslmode")
    void legacySslPropertyIsRefused() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?ssl=true",
                "",
                false,
                ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("legacy-ssl");
    }

    @Test
    @DisplayName("require plus the flag is the managed shape")
    void requireWithFlagPasses() {
        assertThatCode(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db.example:5432/computerpets?sslmode=require",
                "",
                true,
                ""))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("a CA path with only sslmode=require is half-configured")
    void requireWithCaPathFails() throws Exception {
        String pem = certPath(writePem("ca.pem"));

        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?sslmode=require",
                "",
                true,
                pem))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("root-cert=set")
                .hasMessageContaining("sslmode=require")
                .hasMessageNotContaining(pem);
    }

    @Test
    @DisplayName("verify-full without a CA path is half-configured")
    void verifyFullWithoutCaFails() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?sslmode=verify-full",
                "",
                true,
                ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("sslmode=verify-full");
    }

    @Test
    @DisplayName("verify-full accepts a readable PEM and refuses a missing file")
    void verifyFullChecksPem() throws Exception {
        String pem = certPath(writePem("rds-ca.pem"));
        String url = "jdbc:postgresql://db:5432/computerpets?sslmode=verify-full&sslrootcert=" + pem;

        assertThatCode(() -> PostgresJdbcSsl.rejectHalfConfigured(url, "", true, pem))
                .doesNotThrowAnyException();

        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?sslmode=verify-full&sslrootcert=/missing/rds-ca.pem",
                "",
                true,
                "/missing/rds-ca.pem"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("readable CA bundle")
                .hasMessageNotContaining("BEGIN CERTIFICATE");
    }

    @Test
    @DisplayName("verify-full refuses a file that is not a PEM")
    void verifyFullRejectsNonPem() throws Exception {
        Path notes = tempDir.resolve("notes.txt");
        Files.writeString(notes, "not a certificate");
        String text = certPath(notes);
        String url = "jdbc:postgresql://db:5432/computerpets?sslmode=verify-full&sslrootcert=" + text;

        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(url, "", true, text))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("BEGIN CERTIFICATE")
                .hasMessageNotContaining("not a certificate");
    }

    @Test
    @DisplayName("a URL CA path is refused")
    void urlCaPathIsRefused() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?sslmode=verify-full",
                "",
                true,
                "https://example.invalid/ca.pem"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("local CA bundle path");
    }

    @Test
    @DisplayName("replica must use the same mode as the primary")
    void replicaMustMatch() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://primary:5432/computerpets?sslmode=require",
                "jdbc:postgresql://replica:5432/computerpets",
                true,
                ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("replica=sslmode-absent");

        assertThatCode(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://primary:5432/computerpets?sslmode=require",
                "jdbc:postgresql://replica:5432/computerpets?sslmode=Require",
                true,
                ""))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("duplicate sslmode is refused")
    void duplicateSslModeFails() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?sslmode=require&sslmode=disable",
                "",
                true,
                ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("duplicate-ssl-params");
    }

    @Test
    @DisplayName("Terraform forces SSL and emits the same query the helper builds")
    void terraformPairsForceSslAndJdbcMode() throws Exception {
        String hcl = Files.readString(Path.of("deploy/terraform/modules/postgres/main.tf"));
        String vars = Files.readString(Path.of("deploy/terraform/variables.tf"));
        String outputs = Files.readString(Path.of("deploy/terraform/outputs.tf"));
        String yaml = Files.readString(Path.of("src/main/resources/application.yml"));
        String managed = Files.readString(Path.of("deploy/terraform/configmap-managed.example.yaml"));

        assertThat(hcl).contains("postgres-tls ADR 0076");
        assertThat(hcl).contains("rds.force_ssl");
        assertThat(hcl).contains("value        = \"1\"");
        assertThat(hcl).contains("sslmode=require");
        assertThat(hcl).contains("sslmode=verify-full");
        assertThat(hcl).contains("parameter_group_name   = aws_db_parameter_group.postgres[0].name");
        assertThat(vars).contains("variable \"postgres_ssl_root_cert\"");
        assertThat(outputs).contains("output \"postgres_force_ssl\"");
        assertThat(outputs).contains("output \"postgres_sslmode\"");
        assertThat(yaml).contains("ssl-required: ${POSTGRES_SSL_REQUIRED:false}");
        assertThat(yaml).contains("ssl-root-cert: ${POSTGRES_SSL_ROOT_CERT:}");
        assertThat(managed).contains("sslmode=require");
        assertThat(managed).contains("POSTGRES_SSL_REQUIRED: \"true\"");
        assertThat(Files.readString(Path.of("deploy/k8s/configmap.yaml"))).doesNotContain("sslmode=");
        assertThat(Files.readString(Path.of("docker-compose.yml"))).doesNotContain("sslmode=");
        assertThat(Files.readString(Path.of("deploy/terraform/terraform.tfvars.example")))
                .doesNotContain("postgres_ssl_root_cert =");
    }

    /**
     * The CA path as an operator writes it. The gate refuses a backslash (the
     * bundle is a path in the Linux container), so a Windows temp path uses
     * forward slashes, which Windows file APIs accept. Unchanged on Linux and Mac.
     */
    static String certPath(Path path) {
        return path.toAbsolutePath().toString().replace('\\', '/');
    }

    @Test
    @DisplayName("a backslash CA path is refused")
    void backslashCaPathIsRefused() {
        assertThatThrownBy(() -> PostgresJdbcSsl.rejectHalfConfigured(
                "jdbc:postgresql://db:5432/computerpets?sslmode=verify-full",
                "",
                true,
                "C:\\certs\\rds-ca.pem"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("local CA bundle path");
    }

    private Path writePem(String name) throws Exception {
        Path pem = tempDir.resolve(name);
        Files.writeString(pem, """
                -----BEGIN CERTIFICATE-----
                MIIB
                -----END CERTIFICATE-----
                """);
        return pem;
    }
}
