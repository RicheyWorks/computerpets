package com.enterprisepet.observability;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.web.client.RestClient;

/**
 * Builds a {@link RestClient} that participates in Micrometer Observation
 * (and therefore OpenTelemetry spans) the same way Spring Boot's
 * auto-configured {@code RestClient.Builder} does.
 */
public final class ObservedRestClients {

    private ObservedRestClients() {}

    public static RestClient.Builder builder(ObservationRegistry observationRegistry) {
        RestClient.Builder builder = RestClient.builder();
        if (observationRegistry != null) {
            builder.observationRegistry(observationRegistry);
        }
        return builder;
    }
}
