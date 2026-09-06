package com.enterprisepet.controller;

import com.enterprisepet.license.LicenseService;
import com.enterprisepet.license.LicenseService.LicensePayload;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Admin audit reads: GET /api/admin/licenses and GET /api/admin/licenses/{jti}.
 * Same X-Admin-Key gate as POST /api/admin/revoke.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AdminLicenseLookupIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private LicenseService licenseService;

    private static String adminKey;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("license.secret-key",
            () -> java.util.Base64.getEncoder().encodeToString(new byte[32]));
        registry.add("jwt.secret-key",
            () -> java.util.Base64.getEncoder().encodeToString(new byte[48]));
        registry.add("bundle.signing-key",
            () -> java.util.Base64.getEncoder().encodeToString(new byte[48]));
        adminKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        registry.add("admin.api-key", () -> adminKey);
        registry.add("ownership.providers.steam.enabled", () -> "true");
        registry.add("steam.api-key", () -> "TEST_KEY");
        registry.add("steam.api-base-url", () -> "http://localhost:0");
    }

    private static final String OWNER = "steam:76561198000000099";
    private static final String PET = "red_panda";
    private static final String PROVIDER = "steam";

    @Test
    @DisplayName("GET /api/admin/licenses/{jti} returns 401 when X-Admin-Key is missing")
    void getByJti_missingKey() {
        ResponseEntity<Map> resp = restTemplate.exchange(
            "/api/admin/licenses/anything",
            HttpMethod.GET,
            new HttpEntity<>(new HttpHeaders()),
            Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("invalid or missing admin key");
    }

    @Test
    @DisplayName("GET /api/admin/licenses/{jti} returns 401 when X-Admin-Key is wrong")
    void getByJti_wrongKey() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Admin-Key", "wrong-key-123");

        ResponseEntity<Map> resp = restTemplate.exchange(
            "/api/admin/licenses/anything",
            HttpMethod.GET,
            new HttpEntity<>(headers),
            Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("GET /api/admin/licenses/{jti} returns 404 for an unknown jti")
    void getByJti_unknown() {
        ResponseEntity<Map> resp = restTemplate.exchange(
            "/api/admin/licenses/does-not-exist-uuid",
            HttpMethod.GET,
            new HttpEntity<>(adminHeaders()),
            Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("license not found");
    }

    @Test
    @DisplayName("GET /api/admin/licenses/{jti} returns audit fields for an issued license")
    void getByJti_success() {
        var enc = licenseService.issueLicense(OWNER, PET, PROVIDER, 1, "desk-one");
        String jti = extractJti(enc);

        ResponseEntity<Map> resp = restTemplate.exchange(
            "/api/admin/licenses/" + jti,
            HttpMethod.GET,
            new HttpEntity<>(adminHeaders()),
            Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().get("jti")).isEqualTo(jti);
        assertThat(resp.getBody().get("owner")).isEqualTo(OWNER);
        assertThat(resp.getBody().get("pet")).isEqualTo(PET);
        assertThat(resp.getBody().get("provider")).isEqualTo(PROVIDER);
        assertThat(resp.getBody().get("issuedAt")).isNotNull();
        assertThat(resp.getBody().get("expiresAt")).isNotNull();
        assertThat(resp.getBody().get("revoked")).isEqualTo(false);
        assertThat(resp.getBody().get("revokedAt")).isNull();
        assertThat(resp.getBody().get("lastUsedAt")).isNull();
        assertThat(resp.getBody().get("hwidBound")).isEqualTo(true);
    }

    @Test
    @DisplayName("GET /api/admin/licenses/{jti} shows lastUsedAt and revokedAt after use and revoke")
    void getByJti_afterUseAndRevoke() {
        var enc = licenseService.issueLicense(OWNER, PET, PROVIDER, 1, null);
        String jti = extractJti(enc);
        licenseService.recordDownload(jti);
        assertThat(licenseService.revoke(jti)).isTrue();

        ResponseEntity<Map> resp = restTemplate.exchange(
            "/api/admin/licenses/" + jti,
            HttpMethod.GET,
            new HttpEntity<>(adminHeaders()),
            Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().get("revoked")).isEqualTo(true);
        assertThat(resp.getBody().get("revokedAt")).isNotNull();
        assertThat(resp.getBody().get("lastUsedAt")).isNotNull();
        assertThat(resp.getBody().get("hwidBound")).isEqualTo(false);
    }

    @Test
    @DisplayName("GET /api/admin/licenses?owner= returns matching rows and ignores other owners")
    void listByOwner() {
        String other = "steam:76561198000000011";
        String mine = extractJti(licenseService.issueLicense(OWNER, PET, PROVIDER, 1, null));
        String otherJti = extractJti(licenseService.issueLicense(other, "cat", "steam", 1, null));

        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
            "/api/admin/licenses?owner={owner}",
            HttpMethod.GET,
            new HttpEntity<>(adminHeaders()),
            new ParameterizedTypeReference<>() {},
            OWNER);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody())
            .extracting(row -> row.get("jti"))
            .contains(mine)
            .doesNotContain(otherJti);
        assertThat(resp.getBody())
            .allSatisfy(row -> assertThat(row.get("owner")).isEqualTo(OWNER));
    }

    @Test
    @DisplayName("GET /api/admin/licenses?owner= returns an empty list for an unknown owner")
    void listByOwner_empty() {
        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
            "/api/admin/licenses?owner={owner}",
            HttpMethod.GET,
            new HttpEntity<>(adminHeaders()),
            new ParameterizedTypeReference<>() {},
            "nobody-has-this-owner");

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isEmpty();
    }

    @Test
    @DisplayName("GET /api/admin/licenses returns recent licenses and requires the admin key")
    void listRecent_andAuth() {
        String jti = extractJti(licenseService.issueLicense(OWNER, PET, PROVIDER, 1, null));

        ResponseEntity<Map> denied = restTemplate.exchange(
            "/api/admin/licenses",
            HttpMethod.GET,
            new HttpEntity<>(new HttpHeaders()),
            Map.class);
        assertThat(denied.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);

        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
            "/api/admin/licenses",
            HttpMethod.GET,
            new HttpEntity<>(adminHeaders()),
            new ParameterizedTypeReference<>() {});

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody())
            .extracting(row -> row.get("jti"))
            .contains(jti);
    }

    private HttpHeaders adminHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Admin-Key", adminKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private String extractJti(LicenseService.EncryptedLicense enc) {
        return licenseService.validate(enc.ciphertext(), enc.iv())
            .map(LicensePayload::jti)
            .orElseThrow();
    }
}
