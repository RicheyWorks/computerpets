package com.enterprisepet.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * When the itch provider toggle is off, the bean is not registered and
 * {@code POST /api/verify/itch} is an unknown provider (404).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ItchProviderDisabledIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("ownership.providers.itch.enabled", () -> "false");

        String licenseKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        String jwtKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String bundleKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String adminKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);

        registry.add("license.secret-key", () -> licenseKey);
        registry.add("jwt.secret-key", () -> jwtKey);
        registry.add("bundle.signing-key", () -> bundleKey);
        registry.add("admin.api-key", () -> adminKey);
    }

    @Test
    @DisplayName("POST /api/verify/itch returns 404 when the provider is disabled")
    void verifyItch_disabled_returns404() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = Map.of(
                "gameId", "3",
                "downloadKey", "YWKse5jeAeuZ8w3a5qO2b2PId1sChw2B9b637w6z",
                "petType", "red_panda"
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/verify/itch", new HttpEntity<>(body, headers), Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody().get("error")).isEqualTo("unknown provider");
        assertThat(response.getBody().get("provider")).isEqualTo("itch");
        assertThat(String.valueOf(response.getBody().get("validProviders"))).doesNotContain("itch");
    }

    @Test
    @DisplayName("GET /api/verify/providers omits itch when the provider is disabled")
    void providers_omitsItchWhenDisabled() {
        ResponseEntity<List> response = restTemplate.getForEntity("/api/verify/providers", List.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody())
                .extracting(item -> ((Map<?, ?>) item).get("key"))
                .doesNotContain("itch");
    }
}
