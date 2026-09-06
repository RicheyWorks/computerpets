package com.enterprisepet.observability;

import com.enterprisepet.provider.VerificationResult;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

/**
 * Business-level observations for verify and download.
 *
 * <p>Micrometer's meter observation handler turns these into timers
 * ({@code enterprisepet.verify} / {@code enterprisepet.download}); the
 * OpenTelemetry tracing bridge turns the same observations into spans.
 * {@code enterprisepet.verify} is tagged with {@code provider} and
 * {@code outcome} so Prometheus can compute success rate and latency
 * per provider.
 */
@Component
public class VerificationTelemetry {

    public static final String VERIFY = "enterprisepet.verify";
    public static final String DOWNLOAD = "enterprisepet.download";
    public static final String PROVIDER_CALL = "enterprisepet.provider.call";

    private final ObservationRegistry observations;

    public VerificationTelemetry(ObservationRegistry observations) {
        this.observations = observations;
    }

    public VerificationResult verify(String provider, Supplier<VerificationResult> action) {
        Observation observation = Observation.start(VERIFY, observations);
        observation.lowCardinalityKeyValue("provider", safe(provider));
        try (Observation.Scope scope = observation.openScope()) {
            VerificationResult result = action.get();
            observation.lowCardinalityKeyValue("outcome", result.verified() ? "success" : "denied");
            return result;
        } catch (RuntimeException e) {
            observation.lowCardinalityKeyValue("outcome", "error");
            observation.error(e);
            throw e;
        } finally {
            observation.stop();
        }
    }

    public <T> T download(String petKey, Supplier<T> action) {
        Observation observation = Observation.start(DOWNLOAD, observations);
        observation.lowCardinalityKeyValue("pet", safe(petKey));
        try (Observation.Scope scope = observation.openScope()) {
            return action.get();
        } catch (RuntimeException e) {
            observation.error(e);
            throw e;
        } finally {
            observation.stop();
        }
    }

    /**
     * Outbound provider call (NFT JSON-RPC today; HTTP providers use RestClient
     * observation instead). Visible so services can share the same span/meter name.
     */
    public static <T> T observeProviderCall(ObservationRegistry observations,
                                            String provider,
                                            String operation,
                                            CheckedSupplier<T> action) throws Exception {
        Observation observation = Observation.start(PROVIDER_CALL, observations);
        observation.lowCardinalityKeyValue("provider", safe(provider));
        observation.lowCardinalityKeyValue("operation", safe(operation));
        try (Observation.Scope scope = observation.openScope()) {
            return action.get();
        } catch (Exception e) {
            observation.error(e);
            throw e;
        } finally {
            observation.stop();
        }
    }

    private static String safe(String value) {
        if (value == null || value.isBlank()) {
            return "unknown";
        }
        return value.length() > 64 ? value.substring(0, 64) : value;
    }

    @FunctionalInterface
    public interface CheckedSupplier<T> {
        T get() throws Exception;
    }
}
