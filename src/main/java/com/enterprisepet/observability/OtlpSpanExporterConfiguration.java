package com.enterprisepet.observability;

import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
import io.opentelemetry.sdk.common.CompletableResultCode;
import io.opentelemetry.sdk.trace.data.SpanData;
import io.opentelemetry.sdk.trace.export.SpanExporter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Collection;

/**
 * Replaces Boot 3.3's default {@code localhost:4318} OTLP exporter so a
 * collector is not required to start. When
 * {@code management.otlp.tracing.endpoint} is set (mapped from
 * {@code OTEL_EXPORTER_OTLP_ENDPOINT}), spans are exported over OTLP/HTTP.
 */
@Configuration
public class OtlpSpanExporterConfiguration {

    private static final Logger log = LoggerFactory.getLogger(OtlpSpanExporterConfiguration.class);

    /**
     * Bean name must match Spring Boot's {@code otlpHttpSpanExporter} so the
     * auto-config default (always-on localhost:4318) is not also created.
     */
    @Bean(name = "otlpHttpSpanExporter")
    SpanExporter otlpHttpSpanExporter(
            @Value("${management.otlp.tracing.endpoint:}") String endpoint) {
        if (!OtlpEndpoints.isConfigured(endpoint)) {
            log.info("OTLP export disabled (set OTEL_EXPORTER_OTLP_ENDPOINT to enable)");
            return NoopSpanExporter.INSTANCE;
        }
        String tracesUrl = OtlpEndpoints.tracesUrl(endpoint);
        log.info("OTLP export enabled endpoint={}", tracesUrl);
        return OtlpHttpSpanExporter.builder()
                .setEndpoint(tracesUrl)
                .setTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Succeeds immediately. Used when no collector is configured so BatchSpanProcessor
     * does not try to dial localhost:4318.
     */
    enum NoopSpanExporter implements SpanExporter {
        INSTANCE;

        @Override
        public CompletableResultCode export(Collection<SpanData> spans) {
            return CompletableResultCode.ofSuccess();
        }

        @Override
        public CompletableResultCode flush() {
            return CompletableResultCode.ofSuccess();
        }

        @Override
        public CompletableResultCode shutdown() {
            return CompletableResultCode.ofSuccess();
        }
    }
}
