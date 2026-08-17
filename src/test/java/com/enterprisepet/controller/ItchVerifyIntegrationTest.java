package com.enterprisepet.controller;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
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

import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Full /api/verify/itch flow against a WireMock itch.io API.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ItchVerifyIntegrationTest {

    private static final String DOWNLOAD_KEY = "YWKse5jeAeuZ8w3a5qO2b2PId1sChw2B9b637w6z";

    @Autowired
    private TestRestTemplate restTemplate;

    private static WireMockServer wireMockServer;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        wireMockServer = new WireMockServer(WireMockConfiguration.options().dynamicPort());
        wireMockServer.start();

        registry.add("itch.api-base-url", () -> "http://localhost:" + wireMockServer.port());
        registry.add("itch.api-key", () -> "TEST_ITCH_API_KEY");
        registry.add("ownership.providers.itch.enabled", () -> "true");

        String licenseKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        String jwtKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String bundleKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String adminKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);

        registry.add("license.secret-key", () -> licenseKey);
        registry.add("jwt.secret-key", () -> jwtKey);
        registry.add("bundle.signing-key", () -> bundleKey);
        registry.add("admin.api-key", () -> adminKey);
    }

    @AfterEach
    void resetStubs() {
        if (wireMockServer != null) {
            wireMockServer.resetAll();
        }
    }

    @AfterAll
    static void stopWireMock() {
        if (wireMockServer != null) {
            wireMockServer.stop();
        }
    }

    @Test
    @DisplayName("POST /api/verify/itch returns granted when itch reports a valid download key")
    void verifyItch_withValidReceipt_returnsGranted() {
        wireMockServer.stubFor(get(urlPathEqualTo("/games/3/download_keys"))
                .withQueryParam("download_key", equalTo(DOWNLOAD_KEY))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            {
                              "download_key": {
                                "id": 124,
                                "game_id": 3,
                                "owner": { "id": 1994, "username": "fasterthanlime" }
                              }
                            }
                            """)));

        ResponseEntity<Map> response = postVerify(Map.of(
                "gameId", "3",
                "downloadKey", DOWNLOAD_KEY,
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("success");
        assertThat(response.getBody().get("provider")).isEqualTo("itch");
        assertThat(response.getBody().get("license")).isNotNull();
        assertThat(response.getBody().get("auth")).isNotNull();
    }

    @Test
    @DisplayName("POST /api/verify/itch returns 403 when the download key is invalid")
    void verifyItch_badToken_returns403() {
        wireMockServer.stubFor(get(urlPathEqualTo("/games/3/download_keys"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            { "errors": ["invalid download key"] }
                            """)));

        ResponseEntity<Map> response = postVerify(Map.of(
                "gameId", "3",
                "downloadKey", "not-a-real-key",
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody().get("error")).isEqualTo("Itch.io ownership not found");
        assertThat(response.getBody().get("provider")).isEqualTo("itch");
    }

    @Test
    @DisplayName("POST /api/verify/itch returns 403 when the buyer does not own the game")
    void verifyItch_notOwned_returns403() {
        wireMockServer.stubFor(get(urlPathEqualTo("/games/3/download_keys"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            { "errors": ["no download key found"] }
                            """)));

        ResponseEntity<Map> response = postVerify(Map.of(
                "gameId", "3",
                "downloadKey", DOWNLOAD_KEY,
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody().get("error")).isEqualTo("Itch.io ownership not found");
    }

    private ResponseEntity<Map> postVerify(Map<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForEntity("/api/verify/itch", new HttpEntity<>(body, headers), Map.class);
    }
}
