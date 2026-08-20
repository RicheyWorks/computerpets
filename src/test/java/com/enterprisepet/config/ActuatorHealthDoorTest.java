package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The public health door stays quiet. Unhung optional doors do not take
 * the house down. Compose spiders liveness — the process is up.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ActuatorHealthDoorTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void houseDefaults(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("admin.api-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        // Memory store so Redis is not a house need in this sitting.
        registry.add("rate-limit.backend", () -> "memory");
    }

    @Test
    @DisplayName("public health does not speak the rooms")
    void publicHealth_staysQuiet() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/actuator/health", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).contains("UP");
        assertThat(response.getBody()).doesNotContainIgnoringCase("steam");
        assertThat(response.getBody()).doesNotContainIgnoringCase("ethereum");
        assertThat(response.getBody()).doesNotContainIgnoringCase("disk");
        assertThat(response.getBody()).doesNotContainIgnoringCase("redis");
        assertThat(response.getBody()).doesNotContain("reason");
        assertThat(response.getBody()).doesNotContain("ping");
        assertThat(response.getBody()).doesNotContain("collections");
        assertThat(response.getBody()).doesNotContain("components");
        assertThat(response.getBody()).doesNotContain("not hung");
    }

    @Test
    @DisplayName("unhung Steam does not take liveness down")
    void liveness_staysUpWhenOptionalDoorsAreUnhung() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/actuator/health/liveness", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("UP");
        assertThat(response.getBody()).doesNotContainIgnoringCase("steam");
        assertThat(response.getBody()).doesNotContain("DOWN");
    }

    @Test
    @DisplayName("unhung optional doors do not take the public health door down")
    void publicHealth_staysUpWhenOptionalDoorsAreUnhung() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/actuator/health", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("\"status\":\"UP\"");
        assertThat(response.getBody()).doesNotContain("DOWN");
    }
}
