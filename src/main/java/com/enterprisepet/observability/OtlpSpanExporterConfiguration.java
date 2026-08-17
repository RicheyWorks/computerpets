package com.enterprisepet.observability;

import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter;
import io.opentelemetry.sdk.common.CompletableResultCode;
import io.opentelemetry.sdk.trace.data.SpanData;
import io.opentelemetry.sdk.trace.export.SpanExporter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.time.Duration;
import java.util.Collection;

/**
 * Registers the OTLP/HTTP span exporter only when a collector URL is set.
 * Boot 3.3's {@code OtlpTracingAutoConfiguration} is excluded because it
 * always dials {@code localhost:4318}; this bean is a no-op otherwise so
 * local/dev starts without a collector.
 *
 * <p>Resolution order: {@code OTEL_EXPORTER_OTLP_TRACES_ENDPOINT},
 * {@code OTEL_EXPORTER_OTLP_ENDPOINT}, then
 * {@code management.otlp.tracing.endpoint}. The property is not bound in
 * {@code application.yml} so an empty default cannot trip Boot's
 * {@code @ConditionalOnProperty} if that auto-config is re-imported in tests.
 */
@Configuration
public class OtlpSpanExporterConfiguration {

    private static final Logger log = LoggerFactory.getLogger(OtlpSpanExporterConfiguration.class);

    @Bean
    SpanExporter otlpSpanExporter(Environment env) {
        String endpoint = firstConfigured(env,
                "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT",
                "OTEL_EXPORTER_OTLP_ENDPOINT",
                "management.otlp.tracing.endpoint");
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

    private static String firstConfigured(Environment env, String... keys) {
        for (String key : keys) {
            String value = env.getProperty(key);
            if (OtlpEndpoints.isConfigured(value)) {
                return value;
            }
        }
        return "";
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
