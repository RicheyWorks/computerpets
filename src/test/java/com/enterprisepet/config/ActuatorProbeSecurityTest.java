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
 * Kubernetes probes hit these paths without a JWT. They must stay anonymous.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ActuatorProbeSecurityTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void secrets(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("admin.api-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
    }

    @Test
    @DisplayName("liveness probe is reachable without a JWT")
    void liveness_isPublic() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/actuator/health/liveness", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("UP");
    }

    @Test
    @DisplayName("readiness probe is reachable without a JWT")
    void readiness_isPublic() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/actuator/health/readiness", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("UP");
    }
}
