package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Base64;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * When backend=redis and Redis is unreachable, verify fail-closes with 503.
 * Port 1 is never a Redis listener; Lettuce fails fast under the configured timeout.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RateLimitRedisDownIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void redisDown(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("admin.api-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("rate-limit.backend", () -> "redis");
        registry.add("rate-limit.redis.host", () -> "127.0.0.1");
        registry.add("rate-limit.redis.port", () -> "1");
        registry.add("rate-limit.redis.timeout", () -> "100ms");
        registry.add("rate-limit.fail-closed-retry-after-seconds", () -> "5");
    }

    @Test
    @DisplayName("liveness stays the process is up when Redis is down")
    void redisDown_livenessStaysUp() {
        ResponseEntity<String> liveness = restTemplate.getForEntity(
            "/actuator/health/liveness", String.class);

        assertThat(liveness.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(liveness.getBody()).contains("UP");
        assertThat(liveness.getBody()).doesNotContain("DOWN");
    }

    @Test
    @DisplayName("Redis down does not lift the limit — verify returns 503 problem+json")
    void redisDown_verifyIs503() {
        ResponseEntity<Map> response = restTemplate.getForEntity("/api/verify/providers", Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(response.getHeaders().getFirst(HttpHeaders.RETRY_AFTER)).isEqualTo("5");
        assertThat(response.getHeaders().getContentType()).isNotNull();
        assertThat(response.getHeaders().getContentType().isCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(503);
        assertThat(response.getBody().get("title")).isEqualTo("Service Unavailable");
        assertThat((String) response.getBody().get("detail")).contains("Rate limiter unavailable");
        assertThat(response.getBody().get("retryAfterSeconds")).isEqualTo(5);
    }
}
