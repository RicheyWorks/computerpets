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
import static com.github.tomakehurst.wiremock.client.WireMock.containing;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Full /api/verify/epic flow against a WireMock EOS Auth + Ecom v3 API.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class EpicVerifyIntegrationTest {

    private static final String ACCOUNT_ID = "9626f441055349ce8cb7d7d5a483eaa2";
    private static final String SANDBOX_ID = "fn";
    private static final String CATALOG_ITEM_ID = "4fe75bbc5a674f4f9b356b5c90567da5";

    @Autowired
    private TestRestTemplate restTemplate;

    private static WireMockServer wireMockServer;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        wireMockServer = new WireMockServer(WireMockConfiguration.options().dynamicPort());
        wireMockServer.start();

        registry.add("epic.api-base-url", () -> "http://localhost:" + wireMockServer.port());
        registry.add("epic.client-id", () -> "TEST_EPIC_CLIENT_ID");
        registry.add("epic.client-secret", () -> "TEST_EPIC_CLIENT_SECRET");
        registry.add("epic.deployment-id", () -> "TEST_EPIC_DEPLOYMENT_ID");
        registry.add("ownership.providers.epic.enabled", () -> "true");

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
    @DisplayName("POST /api/verify/epic returns granted when Epic reports the catalog item as owned")
    void verifyEpic_withOwnedItem_returnsGranted() {
        stubToken();
        wireMockServer.stubFor(get(urlPathEqualTo(
                "/epic/ecom/v3/platforms/EPIC/identities/" + ACCOUNT_ID + "/ownership"))
                .withQueryParam("nsCatalogItemId", equalTo(SANDBOX_ID + ":" + CATALOG_ITEM_ID))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            [
                              {
                                "namespace": "fn",
                                "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                                "owned": true
                              }
                            ]
                            """)));

        ResponseEntity<Map> response = postVerify(Map.of(
                "accountId", ACCOUNT_ID,
                "sandboxId", SANDBOX_ID,
                "catalogItemId", CATALOG_ITEM_ID,
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("success");
        assertThat(response.getBody().get("provider")).isEqualTo("epic");
        assertThat(response.getBody().get("license")).isNotNull();
        assertThat(response.getBody().get("auth")).isNotNull();
    }

    @Test
    @DisplayName("POST /api/verify/epic returns 403 when Epic reports the item is not owned")
    void verifyEpic_notOwned_returns403() {
        stubToken();
        wireMockServer.stubFor(get(urlPathEqualTo(
                "/epic/ecom/v3/platforms/EPIC/identities/" + ACCOUNT_ID + "/ownership"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            [
                              {
                                "namespace": "fn",
                                "catalogItemId": "4fe75bbc5a674f4f9b356b5c90567da5",
                                "owned": false
                              }
                            ]
                            """)));

        ResponseEntity<Map> response = postVerify(Map.of(
                "accountId", ACCOUNT_ID,
                "sandboxId", SANDBOX_ID,
                "catalogItemId", CATALOG_ITEM_ID,
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody().get("error")).isEqualTo("Epic Games Store ownership not found");
        assertThat(response.getBody().get("provider")).isEqualTo("epic");
    }

    @Test
    @DisplayName("POST /api/verify/epic returns 403 when the catalog item is absent")
    void verifyEpic_missingItem_returns403() {
        stubToken();
        wireMockServer.stubFor(get(urlPathEqualTo(
                "/epic/ecom/v3/platforms/EPIC/identities/" + ACCOUNT_ID + "/ownership"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("[]")));

        ResponseEntity<Map> response = postVerify(Map.of(
                "accountId", ACCOUNT_ID,
                "sandboxId", SANDBOX_ID,
                "catalogItemId", CATALOG_ITEM_ID,
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody().get("error")).isEqualTo("Epic Games Store ownership not found");
    }

    private void stubToken() {
        wireMockServer.stubFor(post(urlPathEqualTo("/epic/oauth/v2/token"))
                .withRequestBody(containing("grant_type=client_credentials"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            {
                              "token_type": "bearer",
                              "access_token": "eg1~test-access-token",
                              "expires_in": 7200
                            }
                            """)));
    }

    private ResponseEntity<Map> postVerify(Map<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForEntity("/api/verify/epic", new HttpEntity<>(body, headers), Map.class);
    }
}
