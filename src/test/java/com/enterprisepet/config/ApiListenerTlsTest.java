package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Public API listener TLS (ADR 0077). The pod stays HTTP. A required public
 * listener must be an https origin. No ACM account is contacted.
 */
class ApiListenerTlsTest {

    @Test
    @DisplayName("flag off keeps local HTTP and still refuses a JVM keystore")
    void flagOffKeepsHttp() {
        assertThatCode(() -> ApiListenerTls.rejectCleartextPublicListener(
                false, "", false, "")).doesNotThrowAnyException();
        assertThatCode(() -> ApiListenerTls.rejectCleartextPublicListener(
                false, "http://127.0.0.1:8081", false, " ")).doesNotThrowAnyException();
        assertThatThrownBy(() -> ApiListenerTls.rejectCleartextPublicListener(
                false, "http://127.0.0.1:8081", true, ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("server.ssl")
                .hasMessageContaining("8081");
        assertThatThrownBy(() -> ApiListenerTls.rejectCleartextPublicListener(
                false, "", false, "/etc/ssl/api.p12"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("keystore");
    }

    @Test
    @DisplayName("required public listener accepts an https origin on 443")
    void httpsOriginPasses() {
        assertThat(ApiListenerTls.publicUrlProblem("https://computerpets.example")).isNull();
        assertThat(ApiListenerTls.publicUrlProblem("https://computerpets.example/")).isNull();
        assertThat(ApiListenerTls.publicUrlProblem("https://computerpets.example:443")).isNull();
        assertThatCode(() -> ApiListenerTls.rejectCleartextPublicListener(
                true, "https://api.computerpets.example", false, "")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("required public listener refuses cleartext and a blank URL")
    void cleartextRefused() {
        assertThatThrownBy(() -> ApiListenerTls.rejectCleartextPublicListener(
                true, "", false, ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("API_LISTENER_TLS_REQUIRED")
                .hasMessageContaining("cleartext");
        assertThatThrownBy(() -> ApiListenerTls.rejectCleartextPublicListener(
                true, "http://computerpets.example", false, ""))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("cleartext");
        assertThat(ApiListenerTls.publicUrlProblem("http://computerpets.example:443"))
                .contains("https");
    }

    @Test
    @DisplayName("required public listener refuses userinfo, a path, a query, and a non-443 port")
    void originShapeRefused() {
        assertThat(ApiListenerTls.publicUrlProblem("https://user:secret@computerpets.example"))
                .contains("userinfo")
                .doesNotContain("secret");
        assertThat(ApiListenerTls.publicUrlProblem("https://computerpets.example/api"))
                .contains("no path");
        assertThat(ApiListenerTls.publicUrlProblem("https://computerpets.example?x=1"))
                .contains("query");
        assertThat(ApiListenerTls.publicUrlProblem("https://computerpets.example#frag"))
                .contains("fragment");
        assertThat(ApiListenerTls.publicUrlProblem("https://computerpets.example:8081"))
                .contains("443");
        assertThat(ApiListenerTls.publicUrlProblem("https://computerpets.example:80"))
                .contains("443");
    }

    @Test
    @DisplayName("required public listener refuses loopback and a single-label host")
    void loopbackRefused() {
        assertThat(ApiListenerTls.publicUrlProblem("https://localhost"))
                .contains("hostname");
        assertThat(ApiListenerTls.publicUrlProblem("https://localhost:443"))
                .contains("hostname");
        assertThat(ApiListenerTls.publicUrlProblem("https://127.0.0.1"))
                .contains("loopback");
        assertThat(ApiListenerTls.publicUrlProblem("https://api.local"))
                .contains("loopback");
        assertThat(ApiListenerTls.publicUrlProblem("https://REPLACE_WITH_PUBLIC_HOST"))
                .contains("hostname");
    }

    @Test
    @DisplayName("a keystore is refused even when the public URL is https")
    void keystoreRefusedWhenUrlIsHttps() {
        assertThatThrownBy(() -> ApiListenerTls.rejectCleartextPublicListener(
                true, "https://computerpets.example", false, "classpath:api.p12"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("keystore")
                .hasMessageContaining("ADR 0077");
    }
}
