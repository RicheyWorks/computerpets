package com.enterprisepet.controller;

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
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The keeper card reads this door. It stays quiet. Care routes are not
 * invented. Java is 8081; the desk keeps 8080.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class HeartbeatDoorTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void houseDefaults(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("admin.api-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("rate-limit.backend", () -> "memory");
        registry.add("server.port", () -> "8081");
    }

    @Test
    @DisplayName("public heartbeat speaks status, profile, and uptime")
    void heartbeat_tellsTheTruth() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
            "/api/public/heartbeat", Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("UP");
        assertThat(response.getBody().get("profile")).isInstanceOf(String.class);
        assertThat((String) response.getBody().get("profile")).isNotBlank();
        assertThat(response.getBody().get("uptimeSeconds")).isInstanceOf(Number.class);
        assertThat(((Number) response.getBody().get("uptimeSeconds")).longValue()).isGreaterThanOrEqualTo(0);
        assertThat(response.getBody().get("port")).isInstanceOf(Number.class);
        @SuppressWarnings("unchecked")
        Map<String, Object> care = (Map<String, Object>) response.getBody().get("care");
        assertThat(care.get("feed")).isEqualTo(false);
        assertThat(care.get("play")).isEqualTo(false);
        assertThat(care.get("rest")).isEqualTo(false);
        assertThat(care.get("door")).isEqualTo("local");
    }

    @Test
    @DisplayName("heartbeat stays a door, not a floor plan")
    void heartbeat_staysQuiet() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/api/public/heartbeat", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).doesNotContainIgnoringCase("steam");
        assertThat(response.getBody()).doesNotContainIgnoringCase("ethereum");
        assertThat(response.getBody()).doesNotContainIgnoringCase("redis");
        assertThat(response.getBody()).doesNotContainIgnoringCase("disk");
        assertThat(response.getBody()).doesNotContain("/pet/feed");
        assertThat(response.getBody()).doesNotContain("/pet/play");
        assertThat(response.getBody()).doesNotContain("/pet/rest");
        assertThat(response.getBody()).doesNotContain("components");
    }

    @Test
    @DisplayName("advertised care routes are not a door")
    void advertisedCareRoutes_areNotInvented() {
        assertThat(restTemplate.getForEntity("/pet/feed", String.class).getStatusCode().is2xxSuccessful())
            .isFalse();
        assertThat(restTemplate.getForEntity("/pet/play", String.class).getStatusCode().is2xxSuccessful())
            .isFalse();
        assertThat(restTemplate.getForEntity("/pet/rest", String.class).getStatusCode().is2xxSuccessful())
            .isFalse();
    }
}
