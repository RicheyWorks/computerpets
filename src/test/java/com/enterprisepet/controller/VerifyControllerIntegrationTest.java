package com.enterprisepet.controller;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test that exercises the full /api/verify/steam flow
 * using WireMock to simulate the Steam Web API.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class VerifyControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private static WireMockServer wireMockServer;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Start WireMock on a random port
        wireMockServer = new WireMockServer(WireMockConfiguration.options().dynamicPort());
        wireMockServer.start();

        // Point SteamService to our WireMock instance
        registry.add("steam.api-base-url", () -> "http://localhost:" + wireMockServer.port());
        // Provide a dummy API key so the service doesn't reject the request
        registry.add("steam.api-key", () -> "TEST_STEAM_API_KEY");
        // Enable the Steam provider
        registry.add("ownership.providers.steam.enabled", () -> "true");

        // Provide all mandatory secrets so the application context can start
        // (32-byte keys for license/admin, longer for JWT/bundle). Values are random and valid.
        String licenseKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        String jwtKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String bundleKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String adminKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);

        registry.add("license.secret-key", () -> licenseKey);
        registry.add("jwt.secret-key", () -> jwtKey);
        registry.add("bundle.signing-key", () -> bundleKey);
        registry.add("admin.api-key", () -> adminKey);
    }

    @BeforeEach
    void setUp() {
        // Stub a successful Steam response
        wireMockServer.stubFor(get(urlPathEqualTo("/IPlayerService/GetOwnedGames/v1/"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            {
                              "response": {
                                "game_count": 1,
                                "games": [
                                  { "appid": 123456 }
                                ]
                              }
                            }
                            """)));
    }

    @AfterEach
    void tearDown() {
        if (wireMockServer != null) {
            wireMockServer.stop();
        }
    }

    @Test
    @DisplayName("POST /api/verify/steam returns granted when Steam reports ownership")
    void verifySteam_withValidOwnership_returnsGranted() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of(
                "steamId", "76561198000000000",
                "appId", "123456",
                "petType", "red_panda"
        );

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/verify/steam", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("success");
        assertThat(response.getBody().get("provider")).isEqualTo("steam");
        assertThat(response.getBody().get("license")).isNotNull();
        assertThat(response.getBody().get("auth")).isNotNull();
    }
}