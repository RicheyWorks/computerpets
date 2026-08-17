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
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Base64;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * HTTP contract for the in-memory store used by other @SpringBootTest classes:
 * 10/min verify, 429 + Retry-After + application/problem+json.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class RateLimitingFilterIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void secrets(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("admin.api-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("rate-limit.backend", () -> "memory");
    }

    @Test
    @DisplayName("11th verify request in a minute is 429 with Retry-After and problem+json")
    void eleventhVerify_is429() {
        ResponseEntity<String> lastAllowed = null;
        for (int i = 0; i < 10; i++) {
            lastAllowed = restTemplate.getForEntity("/api/verify/providers", String.class);
            assertThat(lastAllowed.getStatusCode())
                .as("request %d should be allowed", i + 1)
                .isEqualTo(HttpStatus.OK);
        }
        assertThat(lastAllowed.getHeaders().getFirst("X-RateLimit-Remaining")).isEqualTo("0");

        ResponseEntity<Map> limited = restTemplate.getForEntity("/api/verify/providers", Map.class);
        assertThat(limited.getStatusCode()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
        assertThat(limited.getHeaders().getFirst(HttpHeaders.RETRY_AFTER)).isNotBlank();
        assertThat(limited.getHeaders().getContentType()).isNotNull();
        assertThat(limited.getHeaders().getContentType().isCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)).isTrue();
        assertThat(limited.getBody()).isNotNull();
        assertThat(limited.getBody().get("status")).isEqualTo(429);
        assertThat(limited.getBody().get("title")).isEqualTo("Too Many Requests");
        assertThat((String) limited.getBody().get("detail")).contains("Rate limit exceeded for verify");
        assertThat(limited.getBody().get("retryAfterSeconds")).isInstanceOf(Number.class);
    }
}
