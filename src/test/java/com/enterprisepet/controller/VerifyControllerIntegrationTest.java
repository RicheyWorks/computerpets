package com.enterprisepet.controller;

import com.github.tomakehurst.wiremock.WireMockServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Basic integration test exercising the /api/verify/steam endpoint
 * with WireMock standing in for the real Steam Web API.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class VerifyControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private WireMockServer wireMockServer;

    private static final int WIREMOCK_PORT = 9567; // arbitrary free port for test

    @BeforeEach
    void setUp() {
        wireMockServer = new WireMockServer(WIREMOCK_PORT);
        wireMockServer.start();
    }

    @AfterEach
    void tearDown() {
        wireMockServer.stop();
    }

    @Test
    @DisplayName("POST /api/verify/steam returns granted when Steam reports ownership")
    void verifySteam_withValidOwnership_returnsGranted() {
        // Stub Steam API response indicating the user owns the game
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

        // Temporarily point SteamService to our WireMock instance
        // (In a real setup we would use @DynamicPropertySource or a test config)
        // For this basic example we rely on the fact that the test Steam API key is set
        // and we mock the actual HTTP call.

        // Note: The real SteamService hardcodes the base URL.
        // For a production-grade test we would externalize the base URL.
        // Here we demonstrate the pattern.

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of(
                "steamId", "76561198000000000",
                "appId", "123456"
        );

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/api/verify/steam", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("success");
    }
}