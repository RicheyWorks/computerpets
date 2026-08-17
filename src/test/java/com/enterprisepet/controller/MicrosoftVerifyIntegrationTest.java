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
import static com.github.tomakehurst.wiremock.client.WireMock.matchingJsonPath;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Full /api/verify/microsoft flow against a WireMock Collections v9 publisherQuery.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MicrosoftVerifyIntegrationTest {

    private static final String PRODUCT_ID = "9N30KZZF4BR9";

    @Autowired
    private TestRestTemplate restTemplate;

    private static WireMockServer wireMockServer;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        wireMockServer = new WireMockServer(WireMockConfiguration.options().dynamicPort());
        wireMockServer.start();

        registry.add("microsoft.collections-url",
                () -> "http://localhost:" + wireMockServer.port() + "/v9.0/collections/publisherQuery");
        registry.add("microsoft.dev-mode", () -> "false");
        registry.add("ownership.providers.microsoft.enabled", () -> "true");

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
    @DisplayName("POST /api/verify/microsoft grants when publisherQuery returns Active product")
    void verifyMicrosoft_activeProduct_returnsGranted() {
        stubPublisherQuery(200, """
                { "items": [ { "productId": "9N30KZZF4BR9", "status": "Active" } ] }
                """);

        ResponseEntity<Map> response = postVerify(Map.of(
                "xstsToken", "test-xsts-token",
                "userHash", "123456789012345",
                "storeProductId", PRODUCT_ID,
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("success");
        assertThat(response.getBody().get("provider")).isEqualTo("microsoft");
        assertThat(response.getBody().get("license")).isNotNull();
        assertThat(response.getBody().get("auth")).isNotNull();

        wireMockServer.verify(postRequestedFor(urlPathEqualTo("/v9.0/collections/publisherQuery"))
                .withHeader("Authorization", equalTo("XBL3.0 x=123456789012345;test-xsts-token"))
                .withHeader("User-Agent", equalTo("ComputerPets/1.0"))
                .withRequestBody(matchingJsonPath("$.productSkuIds[0].productId", equalTo(PRODUCT_ID)))
                .withRequestBody(matchingJsonPath("$.validityType", equalTo("Valid")))
                .withRequestBody(matchingJsonPath("$", containing("productSkuIds"))));
        assertThat(wireMockServer.findAll(postRequestedFor(urlPathEqualTo("/v9.0/collections/publisherQuery"))))
                .allSatisfy(logged -> {
                    String body = logged.getBodyAsString();
                    assertThat(body).doesNotContain("Market");
                    assertThat(body).doesNotContain("Beneficiaries");
                    assertThat(body).doesNotContain("beneficiaries");
                });
    }

    @Test
    @DisplayName("POST /api/verify/microsoft forwards Signature and returns 403 when items are empty")
    void verifyMicrosoft_emptyItems_returns403_andForwardsSignature() {
        wireMockServer.stubFor(post(urlPathEqualTo("/v9.0/collections/publisherQuery"))
                .withHeader("Signature", equalTo("xtoken-sig"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("{ \"items\": [] }")));

        ResponseEntity<Map> response = postVerify(Map.of(
                "xstsToken", "test-xsts-token",
                "userHash", "123456789012345",
                "storeProductId", PRODUCT_ID,
                "signature", "xtoken-sig",
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody().get("error")).isEqualTo("Microsoft Store entitlement not found");
        wireMockServer.verify(postRequestedFor(urlPathEqualTo("/v9.0/collections/publisherQuery"))
                .withHeader("Signature", equalTo("xtoken-sig")));
    }

    @Test
    @DisplayName("POST /api/verify/microsoft denies placeholder storeProductId without calling Collections")
    void verifyMicrosoft_placeholderProduct_returns403_withoutNetwork() {
        ResponseEntity<Map> response = postVerify(Map.of(
                "xstsToken", "test-xsts-token",
                "storeProductId", "CHANGE_ME",
                "petType", "red_panda"
        ));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody().get("error")).asString().contains("placeholder");
        wireMockServer.verify(0, postRequestedFor(urlPathEqualTo("/v9.0/collections/publisherQuery")));
    }

    private void stubPublisherQuery(int status, String body) {
        wireMockServer.stubFor(post(urlPathEqualTo("/v9.0/collections/publisherQuery"))
                .willReturn(aResponse()
                        .withStatus(status)
                        .withHeader("Content-Type", "application/json")
                        .withBody(body)));
    }

    private ResponseEntity<Map> postVerify(Map<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForEntity("/api/verify/microsoft", new HttpEntity<>(body, headers), Map.class);
    }
}
