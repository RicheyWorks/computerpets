package com.enterprisepet.controller;

import com.enterprisepet.license.LicenseService;
import com.enterprisepet.license.LicenseService.LicensePayload;
import com.enterprisepet.security.JwtService;
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

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Full integration tests for the download flow (Phase 2.1 jti + Phase 2.2 hwid).
 * Uses @SpringBootTest (like VerifyControllerIntegrationTest) so the entire
 * security filter chain, JwtAuthenticationFilter, LicenseService, PetBundleService,
 * and persistence are exercised exactly as in production.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DownloadControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private LicenseService licenseService;

    @Autowired
    private JwtService jwtService;

    private static String licenseKey;
    private static String jwtKey;
    private static String bundleKey;
    private static String adminKey;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // All mandatory secrets (random, valid base64)
        licenseKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        jwtKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        bundleKey = java.util.Base64.getEncoder().encodeToString(new byte[48]);
        adminKey = java.util.Base64.getEncoder().encodeToString(new byte[32]);

        registry.add("license.secret-key", () -> licenseKey);
        registry.add("jwt.secret-key", () -> jwtKey);
        registry.add("bundle.signing-key", () -> bundleKey);
        registry.add("admin.api-key", () -> adminKey);

        // Steam provider enabled with dummy values (not used directly in these tests)
        registry.add("ownership.providers.steam.enabled", () -> "true");
        registry.add("steam.api-key", () -> "TEST_KEY");
        registry.add("steam.api-base-url", () -> "http://localhost:0"); // not hit
    }

    private String validOwner = "steam:76561198000000000";
    private String validPet = "red_panda";
    private String validProvider = "steam";

    @BeforeEach
    void setUp() {
        // Nothing global needed; each test issues its own license/JWT
    }

    @AfterEach
    void tearDown() {
        // No static WireMock in this test class
    }

    private HttpHeaders authHeaders(String bearerToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (bearerToken != null) {
            headers.setBearerAuth(bearerToken);
        }
        return headers;
    }

    private Map<String, String> licenseBody(String ciphertext, String iv, String hwid) {
        if (hwid != null) {
            return Map.of("ciphertext", ciphertext, "iv", iv, "hwid", hwid);
        }
        return Map.of("ciphertext", ciphertext, "iv", iv);
    }

    @Test
    @DisplayName("POST /api/download/{pet} succeeds with valid license + matching JWT (jti bound)")
    void download_success_validLicenseAndJwt_returnsManifestWithJti() {
        // Issue a real license (exercises persistence + jti + hwid=null)
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, null);

        // Issue matching JWT
        var issuedJwt = jwtService.issue(validOwner, validPet, validProvider);

        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), null),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/" + validPet, req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).isNotNull();
        assertThat(resp.getBody().get("petKey")).isEqualTo(validPet);
        assertThat(resp.getBody().get("downloadUrl")).isNotNull();
        assertThat(resp.getBody().get("jti")).isNotNull(); // Phase 2.1 binding
        assertThat(resp.getBody().get("expiresAt")).isNotNull();
    }

    @Test
    @DisplayName("POST /api/download/{pet} succeeds when license has hwid and client supplies matching hwid")
    void download_success_withMatchingHwid() {
        String hwid = "device-abc-123";
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, hwid);
        var issuedJwt = jwtService.issue(validOwner, validPet, validProvider);

        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), hwid),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/" + validPet, req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().get("petKey")).isEqualTo(validPet);
    }

    @Test
    @DisplayName("POST /api/download/{pet} returns 403 when hwid-bound license but client supplies wrong hwid")
    void download_fails_hwidMismatch() {
        String realHwid = "device-xyz";
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, realHwid);
        var issuedJwt = jwtService.issue(validOwner, validPet, validProvider);

        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), "wrong-device"),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/" + validPet, req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("hardware binding");
    }

    @Test
    @DisplayName("POST /api/download/{pet} returns 403 when JWT principal does not match license owner/pet")
    void download_fails_jwtPrincipalMismatch() {
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, null);
        // JWT for a different owner/pet
        var badJwt = jwtService.issue("steam:99999999999999999", "cat", validProvider);

        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), null),
            authHeaders(badJwt.token())
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/" + validPet, req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("auth token does not match license");
    }

    @Test
    @DisplayName("POST /api/download/{pet} returns 401 for tampered / missing license")
    void download_fails_invalidLicense() {
        var issuedJwt = jwtService.issue(validOwner, validPet, validProvider);

        // Completely bogus license body
        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            Map.of("ciphertext", "deadbeef", "iv", "cafe"),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/" + validPet, req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("POST /api/download/{pet} returns 400 for unknown pet key")
    void download_fails_unknownPet() {
        var enc = licenseService.issueLicense(validOwner, "red_panda", validProvider, 1, null);
        var issuedJwt = jwtService.issue(validOwner, "red_panda", validProvider);

        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), null),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/nonexistent_pet_xyz123", req, Map.class);  // guaranteed unknown pet

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("unknown petType");
    }

    @Test
    @DisplayName("POST /api/download/{pet} returns 401 after license is revoked via admin")
    void download_fails_afterRevoke() {
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, null);
        var issuedJwt = jwtService.issue(validOwner, validPet, validProvider);

        // First, revoke via admin (requires X-Admin-Key)
        HttpHeaders adminHeaders = new HttpHeaders();
        adminHeaders.set("X-Admin-Key", adminKey);
        adminHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> revokeReq = new HttpEntity<>(
            Map.of("jti", extractJtiFromLicense(enc)), adminHeaders);

        ResponseEntity<Map> revokeResp = restTemplate.postForEntity(
            "/api/admin/revoke", revokeReq, Map.class);
        assertThat(revokeResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(revokeResp.getBody().get("revoked")).isEqualTo(true);

        // Now download should fail
        HttpEntity<Map<String, String>> dlReq = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), null),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> dlResp = restTemplate.postForEntity(
            "/api/download/" + validPet, dlReq, Map.class);

        assertThat(dlResp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    /** Helper: pull the jti out of an issued encrypted license by decrypting (for revoke test). */
    private String extractJtiFromLicense(LicenseService.EncryptedLicense enc) {
        // We don't have a public decrypt in the test scope, so we re-issue and capture via reflection isn't nice.
        // Instead, just use the LicenseService.validate path which we know works.
        var payload = licenseService.validate(enc.ciphertext(), enc.iv());
        return payload.map(LicensePayload::jti).orElseThrow();
    }
}
