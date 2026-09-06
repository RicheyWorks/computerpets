package com.enterprisepet.observability;

import com.enterprisepet.provider.VerificationResult;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.observation.DefaultMeterObservationHandler;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import io.micrometer.observation.ObservationRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class VerificationTelemetryTest {

    private MeterRegistry meters;
    private VerificationTelemetry telemetry;

    @BeforeEach
    void setUp() {
        meters = new SimpleMeterRegistry();
        ObservationRegistry observations = ObservationRegistry.create();
        observations.observationConfig().observationHandler(new DefaultMeterObservationHandler(meters));
        telemetry = new VerificationTelemetry(observations);
    }

    @Test
    @DisplayName("verify records success latency for the provider")
    void verify_success_recordsTimer() {
        VerificationResult result = telemetry.verify("steam", () -> VerificationResult.granted("owner-1"));

        assertThat(result.verified()).isTrue();
        Timer timer = meters.find(VerificationTelemetry.VERIFY)
                .tag("provider", "steam")
                .tag("outcome", "success")
                .timer();
        assertThat(timer).isNotNull();
        assertThat(timer.count()).isEqualTo(1);
        assertThat(timer.totalTime(java.util.concurrent.TimeUnit.NANOSECONDS)).isPositive();
    }

    @Test
    @DisplayName("verify records denied outcome so success rate is computable")
    void verify_denied_recordsOutcome() {
        telemetry.verify("itch", () -> VerificationResult.denied("not owned"));

        Timer denied = meters.find(VerificationTelemetry.VERIFY)
                .tag("provider", "itch")
                .tag("outcome", "denied")
                .timer();
        assertThat(denied).isNotNull();
        assertThat(denied.count()).isEqualTo(1);
        assertThat(meters.find(VerificationTelemetry.VERIFY)
                .tag("provider", "itch")
                .tag("outcome", "success")
                .timer()).isNull();
    }

    @Test
    @DisplayName("verify records error outcome when the provider throws")
    void verify_error_recordsOutcomeAndRethrows() {
        assertThatThrownBy(() -> telemetry.verify("epic", () -> {
            throw new IllegalStateException("boom");
        })).isInstanceOf(IllegalStateException.class);

        Timer error = meters.find(VerificationTelemetry.VERIFY)
                .tag("provider", "epic")
                .tag("outcome", "error")
                .timer();
        assertThat(error).isNotNull();
        assertThat(error.count()).isEqualTo(1);
    }

    @Test
    @DisplayName("download records a timer tagged with the pet")
    void download_recordsTimer() {
        String value = telemetry.download("red_panda", () -> "ok");

        assertThat(value).isEqualTo("ok");
        Timer timer = meters.find(VerificationTelemetry.DOWNLOAD)
                .tag("pet", "red_panda")
                .timer();
        assertThat(timer).isNotNull();
        assertThat(timer.count()).isEqualTo(1);
    }
}
