package com.enterprisepet.config;

import com.enterprisepet.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * ADR 0133 default: no METRICS_SCRAPE_TOKEN means nobody scrapes. A valid
 * customer JWT used to be enough; now it is 403. A short token is ignored.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ActuatorMetricsClosedTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JwtService jwtService;

    @DynamicPropertySource
    static void houseDefaults(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key", () -> Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("admin.api-key", () -> Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("rate-limit.backend", () -> "memory");
        // Too short to count: treated as unset.
        registry.add("metrics.scrape-token", () -> "short-fixture");
    }

    private HttpStatus status(String path, String bearer) {
        HttpHeaders headers = new HttpHeaders();
        if (bearer != null) {
            headers.setBearerAuth(bearer);
        }
        return HttpStatus.valueOf(restTemplate.exchange(
            path, HttpMethod.GET, new HttpEntity<>(headers), String.class).getStatusCode().value());
    }

    @Test
    @DisplayName("without a usable scrape token a customer JWT is forbidden from prometheus")
    void noToken_licenseJwtForbidden() {
        String jwt = jwtService.issue("steam:76561198000000000", "red_panda", "steam").token();
        assertThat(status("/actuator/prometheus", jwt)).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(status("/actuator/info", jwt)).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("a short configured token opens nothing")
    void shortToken_opensNothing() {
        assertThat(status("/actuator/prometheus", "short-fixture").value()).isIn(401, 403);
    }

    @Test
    @DisplayName("health stays anonymous when metrics are closed")
    void healthStaysOpen() {
        assertThat(status("/actuator/health/liveness", null)).isEqualTo(HttpStatus.OK);
    }
}
