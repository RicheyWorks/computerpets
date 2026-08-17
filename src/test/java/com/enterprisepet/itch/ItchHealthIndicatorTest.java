package com.enterprisepet.itch;

import org.junit.jupiter.api.Test;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.Status;

import static org.assertj.core.api.Assertions.assertThat;

class ItchHealthIndicatorTest {

    @Test
    void health_down_whenNoKeyConfigured() {
        ItchHealthIndicator indicator = new ItchHealthIndicator();
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.DOWN);
        assertThat(health.getDetails().get("reason")).isEqualTo("Itch.io API key is not configured");
    }

    @Test
    void health_down_whenPlaceholderKey() {
        ItchHealthIndicator indicator = new ItchHealthIndicator(ItchService.PLACEHOLDER_API_KEY);
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.DOWN);
        assertThat(health.getDetails()).containsKey("reason");
    }

    @Test
    void health_up_whenRealKeyPresent() {
        ItchHealthIndicator indicator = new ItchHealthIndicator("real-itch-key-abc123");
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
        assertThat(health.getDetails().get("status")).isEqualTo("Itch.io API key is configured");
    }
}
