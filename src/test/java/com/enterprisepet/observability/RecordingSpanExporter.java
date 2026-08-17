package com.enterprisepet.observability;

import io.opentelemetry.sdk.common.CompletableResultCode;
import io.opentelemetry.sdk.trace.data.SpanData;
import io.opentelemetry.sdk.trace.export.SpanExporter;

import java.util.Collection;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * In-process OTLP-compatible exporter for tests. SimpleSpanProcessor
 * delivers finished spans immediately — no batch delay, no mocks of the
 * observation API.
 */
final class RecordingSpanExporter implements SpanExporter {

    private final List<SpanData> spans = new CopyOnWriteArrayList<>();

    @Override
    public CompletableResultCode export(Collection<SpanData> batch) {
        spans.addAll(batch);
        return CompletableResultCode.ofSuccess();
    }

    @Override
    public CompletableResultCode flush() {
        return CompletableResultCode.ofSuccess();
    }

    @Override
    public CompletableResultCode shutdown() {
        spans.clear();
        return CompletableResultCode.ofSuccess();
    }

    List<SpanData> spans() {
        return List.copyOf(spans);
    }

    void reset() {
        spans.clear();
    }
}
