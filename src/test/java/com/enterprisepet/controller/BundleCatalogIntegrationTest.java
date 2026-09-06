package com.enterprisepet.controller;

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

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * HTTP wiring for {@code bundle.catalog}: discovery is public; download
 * attaches version/platform/sha256 only when a row matches.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BundleCatalogIntegrationTest {

    /** Test fixture only — not a published zip. */
    private static final String TEST_SHA256 =
            "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

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
        registry.add("bundle.default-platform", () -> "win");
        registry.add("bundle.catalog[0].pet-key", () -> "red_panda");
        registry.add("bundle.catalog[0].version", () -> "1.0.0");
        registry.add("bundle.catalog[0].platform", () -> "win");
        registry.add("bundle.catalog[0].sha256", () -> TEST_SHA256);
        registry.add("bundle.catalog[0].path", () -> "red_panda-win-1.0.0.zip");
    }

    @Test
    @DisplayName("GET /api/bundles/{petKey} lists catalog rows without auth")
    void discovery_listsConfiguredRows() {
        ResponseEntity<Map> resp = restTemplate.getForEntity("/api/bundles/red_panda", Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().get("petKey")).isEqualTo("red_panda");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> artifacts = (List<Map<String, Object>>) resp.getBody().get("artifacts");
        assertThat(artifacts).hasSize(1);
        assertThat(artifacts.get(0).get("version")).isEqualTo("1.0.0");
        assertThat(artifacts.get(0).get("platform")).isEqualTo("win");
        assertThat(artifacts.get(0).get("sha256")).isEqualTo(TEST_SHA256);
        assertThat(artifacts.get(0).get("path")).isEqualTo("red_panda-win-1.0.0.zip");
    }

    @Test
    @DisplayName("GET /api/bundles/{petKey} returns empty artifacts when the pet has no rows")
    void discovery_knownPetWithoutRows_isEmpty() {
        ResponseEntity<Map> resp = restTemplate.getForEntity("/api/bundles/cat", Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        @SuppressWarnings("unchecked")
        List<?> artifacts = (List<?>) resp.getBody().get("artifacts");
        assertThat(artifacts).isEmpty();
    }

    @Test
    @DisplayName("GET /api/bundles/{petKey} returns 404 for an unknown pet")
    void discovery_unknownPet_is404() {
        ResponseEntity<Map> resp = restTemplate.getForEntity("/api/bundles/not_a_pet", Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("unknown pet type");
    }

    @Test
    @DisplayName("POST /api/download with platform=win returns catalog metadata and path")
    void download_matchingCatalogRow_includesHashAndPath() {
        var enc = licenseService.issueLicense("steam:owner", "red_panda", "steam", 1, null);
        var jwt = jwtService.issue("steam:owner", "red_panda", "steam");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwt.token());
        HttpEntity<Map<String, String>> req = new HttpEntity<>(
                Map.of("ciphertext", enc.ciphertext(), "iv", enc.iv(), "platform", "win"),
                headers);

        ResponseEntity<Map> resp = restTemplate.postForEntity("/api/download/red_panda", req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().get("version")).isEqualTo("1.0.0");
        assertThat(resp.getBody().get("platform")).isEqualTo("win");
        assertThat(resp.getBody().get("sha256")).isEqualTo(TEST_SHA256);
        assertThat(resp.getBody().get("filename")).isEqualTo("red_panda-win-1.0.0.zip");
        assertThat(String.valueOf(resp.getBody().get("downloadUrl")))
                .contains("/red_panda-win-1.0.0.zip?");
        assertThat(resp.getBody().get("jti")).isNotNull();
    }

    @Test
    @DisplayName("POST /api/download without platform uses default-platform (win)")
    void download_omittedPlatform_usesDefaultWin() {
        var enc = licenseService.issueLicense("steam:owner", "red_panda", "steam", 1, null);
        var jwt = jwtService.issue("steam:owner", "red_panda", "steam");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwt.token());
        HttpEntity<Map<String, String>> req = new HttpEntity<>(
                Map.of("ciphertext", enc.ciphertext(), "iv", enc.iv()),
                headers);

        ResponseEntity<Map> resp = restTemplate.postForEntity("/api/download/red_panda", req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().get("sha256")).isEqualTo(TEST_SHA256);
        assertThat(resp.getBody().get("platform")).isEqualTo("win");
    }

    @Test
    @DisplayName("POST /api/download with a non-matching platform keeps {petKey}.zip and no sha256")
    void download_unmatchedPlatform_omitsHash() {
        var enc = licenseService.issueLicense("steam:owner", "red_panda", "steam", 1, null);
        var jwt = jwtService.issue("steam:owner", "red_panda", "steam");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(jwt.token());
        HttpEntity<Map<String, String>> req = new HttpEntity<>(
                Map.of("ciphertext", enc.ciphertext(), "iv", enc.iv(), "platform", "mac"),
                headers);

        ResponseEntity<Map> resp = restTemplate.postForEntity("/api/download/red_panda", req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(String.valueOf(resp.getBody().get("downloadUrl"))).contains("/red_panda.zip?");
        assertThat(resp.getBody()).doesNotContainKeys("sha256", "version", "platform", "filename");
    }
}
