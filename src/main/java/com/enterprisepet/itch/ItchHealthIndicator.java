package com.enterprisepet.itch;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
    name = "ownership.providers.itch.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class ItchHealthIndicator implements HealthIndicator {

    private final String apiKey;

    public ItchHealthIndicator(@Value("${itch.api-key:}") String apiKey) {
        this.apiKey = apiKey;
    }

    ItchHealthIndicator() {
        this.apiKey = null;
    }

    @Override
    public Health health() {
        if (ItchService.isUnconfiguredApiKey(apiKey)) {
            return Health.up()
                    .withDetail("reason", "Itch door is not hung yet")
                    .build();
        }
        return Health.up()
                .withDetail("status", "Itch door is hung")
                .build();
    }
}
