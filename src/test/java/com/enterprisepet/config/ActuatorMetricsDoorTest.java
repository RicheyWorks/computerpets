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
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * ADR 0133: a customer download JWT does not read house metrics. Only the
 * dedicated scrape bearer opens /actuator/prometheus and /actuator/info.
 * Health and probes stay anonymous.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ActuatorMetricsDoorTest {

    /** Test fixture only (48 chars), not a real credential. */
    static final String SCRAPE_TOKEN = "plan-fixture-scrape-token-0123456789abcdefghijkl";

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
        registry.add("metrics.scrape-token", () -> SCRAPE_TOKEN);
    }

    private ResponseEntity<String> get(String path, String bearer) {
        HttpHeaders headers = new HttpHeaders();
        if (bearer != null) {
            headers.setBearerAuth(bearer);
        }
        return restTemplate.exchange(path, HttpMethod.GET, new HttpEntity<>(headers), String.class);
    }

    private String licenseJwt() {
        return jwtService.issue("steam:76561198000000000", "red_panda", "steam").token();
    }

    @Test
    @DisplayName("a customer download JWT cannot read /actuator/prometheus")
    void licenseJwt_isForbiddenFromPrometheus() {
        ResponseEntity<String> response = get("/actuator/prometheus", licenseJwt());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody() == null ? "" : response.getBody())
            .doesNotContain("jvm_memory")
            .doesNotContain("enterprisepet_");
    }

    @Test
    @DisplayName("a customer download JWT cannot read /actuator/info or the actuator index")
    void licenseJwt_isForbiddenFromInfoAndIndex() {
        String jwt = licenseJwt();
        assertThat(get("/actuator/info", jwt).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(get("/actuator", jwt).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("anonymous and wrong-token scrapes are refused")
    void anonymousAndWrongToken_areRefused() {
        assertThat(get("/actuator/prometheus", null).getStatusCode().value()).isIn(401, 403);
        assertThat(get("/actuator/prometheus", SCRAPE_TOKEN + "x").getStatusCode().value()).isIn(401, 403);
        assertThat(get("/actuator/prometheus", SCRAPE_TOKEN.substring(1)).getStatusCode().value()).isIn(401, 403);
    }

    @Test
    @DisplayName("the scrape bearer reads /actuator/prometheus")
    void scrapeToken_readsPrometheus() {
        ResponseEntity<String> response = get("/actuator/prometheus", SCRAPE_TOKEN);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("jvm_memory");
        assertThat(get("/actuator/info", SCRAPE_TOKEN).getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("the scrape bearer does not open download or other actuator paths")
    void scrapeToken_isNarrow() {
        assertThat(get("/actuator", SCRAPE_TOKEN).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(get("/actuator/env", SCRAPE_TOKEN).getStatusCode().value()).isIn(403, 404);
    }

    @Test
    @DisplayName("health and probes stay anonymous with metrics locked")
    void healthStaysOpen() {
        assertThat(get("/actuator/health", null).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(get("/actuator/health/liveness", null).getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(get("/actuator/health/readiness", null).getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
