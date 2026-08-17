package com.enterprisepet.observability;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class OtlpEndpointsTest {

    @Test
    @DisplayName("blank endpoint is not configured")
    void blank_isNotConfigured() {
        assertThat(OtlpEndpoints.isConfigured(null)).isFalse();
        assertThat(OtlpEndpoints.isConfigured("")).isFalse();
        assertThat(OtlpEndpoints.isConfigured("   ")).isFalse();
    }

    @Test
    @DisplayName("OTEL base URL gets /v1/traces appended")
    void baseUrl_appendsTracesPath() {
        assertThat(OtlpEndpoints.tracesUrl("http://localhost:4318"))
                .isEqualTo("http://localhost:4318/v1/traces");
        assertThat(OtlpEndpoints.tracesUrl("http://otel-collector:4318/"))
                .isEqualTo("http://otel-collector:4318/v1/traces");
    }

    @Test
    @DisplayName("full traces URL is left intact")
    void fullTracesUrl_unchanged() {
        assertThat(OtlpEndpoints.tracesUrl("http://localhost:4318/v1/traces"))
                .isEqualTo("http://localhost:4318/v1/traces");
    }

    @Test
    @DisplayName("blank traces URL is rejected")
    void blank_throws() {
        assertThatThrownBy(() -> OtlpEndpoints.tracesUrl(" "))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
