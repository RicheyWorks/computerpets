package com.enterprisepet.steam;

import org.junit.jupiter.api.Test;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.Status;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for the custom Steam health indicator (Phase 1 observability).
 * Uses the package-private test constructor for full testability (no reflection).
 */
class SteamHealthIndicatorTest {

    @Test
    void health_down_whenNoKeyConfigured() {
        SteamHealthIndicator indicator = new SteamHealthIndicator();
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.DOWN);
        assertThat(health.getDetails().get("reason")).isEqualTo("Steam API key is not configured");
    }

    @Test
    void health_down_whenPlaceholderKey() {
        SteamHealthIndicator indicator = new SteamHealthIndicator("YOUR_STEAM_WEB_API_KEY");
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.DOWN);
        assertThat(health.getDetails()).containsKey("reason");
    }

    @Test
    void health_up_whenRealKeyPresent() {
        SteamHealthIndicator indicator = new SteamHealthIndicator("real-key-abc123");
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
        assertThat(health.getDetails().get("status")).isEqualTo("Steam API key is configured");
    }
}