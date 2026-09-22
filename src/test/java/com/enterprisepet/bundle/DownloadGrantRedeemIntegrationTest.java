package com.enterprisepet.bundle;

import com.enterprisepet.license.LicenseService;
import com.enterprisepet.security.JwtService;
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

import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Phase 2.1 one-time redeem + IP binding on the jti-signed download URL.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DownloadGrantRedeemIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private LicenseService licenseService;

    @Autowired
    private JwtService jwtService;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        String licenseKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        String jwtKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String bundleKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        String adminKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);

        registry.add("license.secret-key", () -> licenseKey);
        registry.add("jwt.secret-key", () -> jwtKey);
        registry.add("bundle.signing-key", () -> bundleKey);
        registry.add("admin.api-key", () -> adminKey);
        registry.add("ownership.providers.steam.enabled", () -> "true");
        registry.add("steam.api-key", () -> "TEST_KEY");
        registry.add("steam.api-base-url", () -> "http://localhost:0");
    }

    @Test
    @DisplayName("POST download issues grant; GET redeem once then already-used")
    void download_thenRedeemOnce_secondDenies() {
        var enc = licenseService.issueLicense("steam:76561198000000000", "red_panda", "steam", 1, null);
        var jwt = jwtService.issue("steam:76561198000000000", "red_panda", "steam");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwt.token());
        headers.set("X-Forwarded-For", "203.0.113.40");

        ResponseEntity<Map> issued = restTemplate.postForEntity(
            "/api/download/red_panda",
            new HttpEntity<>(Map.of("ciphertext", enc.ciphertext(), "iv", enc.iv()), headers),
            Map.class);

        assertThat(issued.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(issued.getBody()).isNotNull();
        String downloadUrl = String.valueOf(issued.getBody().get("downloadUrl"));
        Map<String, String> q = queryParams(downloadUrl);

        HttpHeaders redeemHeaders = new HttpHeaders();
        redeemHeaders.set("X-Forwarded-For", "203.0.113.40");
        URI redeemUri = redeemUri("red_panda", q);

        ResponseEntity<Map> first = restTemplate.exchange(
            redeemUri, org.springframework.http.HttpMethod.GET,
            new HttpEntity<>(redeemHeaders), Map.class);
        assertThat(first.getStatusCode())
            .as("body=%s", first.getBody())
            .isEqualTo(HttpStatus.OK);
        assertThat(first.getBody()).containsEntry("allowed", true);

        ResponseEntity<Map> second = restTemplate.exchange(
            redeemUri, org.springframework.http.HttpMethod.GET,
            new HttpEntity<>(redeemHeaders), Map.class);
        assertThat(second.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(second.getBody()).containsEntry("error", "download grant already used");
        assertThat(String.valueOf(second.getBody().get("hint"))).contains("already used");
    }

    @Test
    @DisplayName("redeem from a different address denies with clear copy")
    void redeem_differentIp_denies() {
        var enc = licenseService.issueLicense("steam:76561198000000001", "red_panda", "steam", 1, null);
        var jwt = jwtService.issue("steam:76561198000000001", "red_panda", "steam");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwt.token());
        headers.set("X-Forwarded-For", "203.0.113.50");

        ResponseEntity<Map> issued = restTemplate.postForEntity(
            "/api/download/red_panda",
            new HttpEntity<>(Map.of("ciphertext", enc.ciphertext(), "iv", enc.iv()), headers),
            Map.class);
        assertThat(issued.getStatusCode()).isEqualTo(HttpStatus.OK);
        Map<String, String> q = queryParams(String.valueOf(issued.getBody().get("downloadUrl")));

        HttpHeaders other = new HttpHeaders();
        other.set("X-Forwarded-For", "198.51.100.50");
        ResponseEntity<Map> mismatch = restTemplate.exchange(
            redeemUri("red_panda", q),
            org.springframework.http.HttpMethod.GET,
            new HttpEntity<>(other), Map.class);

        assertThat(mismatch.getStatusCode())
            .as("body=%s", mismatch.getBody())
            .isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(mismatch.getBody()).containsEntry("error", "download grant address mismatch");
        assertThat(String.valueOf(mismatch.getBody().get("hint"))).containsIgnoringCase("NAT");
    }

    private static URI redeemUri(String petKey, Map<String, String> q) {
        return UriComponentsBuilder.fromPath("/api/bundles/{petKey}/redeem")
            .queryParam("owner", q.get("owner"))
            .queryParam("jti", q.get("jti"))
            .queryParam("exp", q.get("exp"))
            .queryParam("sig", q.get("sig"))
            .buildAndExpand(petKey)
            .encode()
            .toUri();
    }

    private static Map<String, String> queryParams(String url) {
        URI uri = URI.create(url);
        Map<String, String> out = new LinkedHashMap<>();
        for (String part : uri.getRawQuery().split("&")) {
            int eq = part.indexOf('=');
            if (eq > 0) {
                String name = part.substring(0, eq);
                String value = URLDecoder.decode(part.substring(eq + 1), StandardCharsets.UTF_8);
                out.put(name, value);
            }
        }
        return out;
    }
}
