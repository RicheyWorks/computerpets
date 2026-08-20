package com.enterprisepet.epic;

import org.junit.jupiter.api.Test;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.Status;

import static org.assertj.core.api.Assertions.assertThat;

class EpicHealthIndicatorTest {

    @Test
    void health_up_whenNoCredentialsConfigured() {
        EpicHealthIndicator indicator = new EpicHealthIndicator();
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
        assertThat(health.getDetails().get("reason"))
                .isEqualTo("Epic door is not hung yet");
    }

    @Test
    void health_up_whenPlaceholderCredentials() {
        EpicHealthIndicator indicator = new EpicHealthIndicator(
                EpicService.PLACEHOLDER_CLIENT_ID,
                EpicService.PLACEHOLDER_CLIENT_SECRET,
                EpicService.PLACEHOLDER_DEPLOYMENT_ID);
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
        assertThat(health.getDetails()).containsKey("reason");
    }

    @Test
    void health_up_whenOnlyClientIdIsSet() {
        EpicHealthIndicator indicator = new EpicHealthIndicator(
                "real-client-id",
                EpicService.PLACEHOLDER_CLIENT_SECRET,
                "real-deployment-id");
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
        assertThat(health.getDetails().get("reason"))
                .isEqualTo("Epic door is not hung yet");
    }

    @Test
    void health_up_whenRealCredentialsPresent() {
        EpicHealthIndicator indicator = new EpicHealthIndicator(
                "real-client-id", "real-client-secret", "real-deployment-id");
        Health health = indicator.health();

        assertThat(health.getStatus()).isEqualTo(Status.UP);
        assertThat(health.getDetails().get("status"))
                .isEqualTo("Epic door is hung");
    }
}
