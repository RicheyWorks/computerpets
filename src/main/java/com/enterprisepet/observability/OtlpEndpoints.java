package com.enterprisepet.observability;

/**
 * Normalizes the OTLP HTTP traces URL.
 *
 * <p>The OpenTelemetry env var {@code OTEL_EXPORTER_OTLP_ENDPOINT} is a
 * <em>base</em> URL ({@code http://collector:4318}). Spring Boot's
 * {@code management.otlp.tracing.endpoint} wants the traces path
 * ({@code http://collector:4318/v1/traces}). Accept both.
 */
final class OtlpEndpoints {

    private static final String TRACES_PATH = "/v1/traces";

    private OtlpEndpoints() {}

    static boolean isConfigured(String endpoint) {
        return endpoint != null && !endpoint.isBlank();
    }

    static String tracesUrl(String raw) {
        if (!isConfigured(raw)) {
            throw new IllegalArgumentException("OTLP endpoint is not configured");
        }
        String endpoint = raw.trim();
        if (endpoint.endsWith("/")) {
            endpoint = endpoint.substring(0, endpoint.length() - 1);
        }
        if (endpoint.endsWith(TRACES_PATH)) {
            return endpoint;
        }
        return endpoint + TRACES_PATH;
    }
}
