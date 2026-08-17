package com.enterprisepet.controller;

import com.enterprisepet.license.LicenseService;
import com.enterprisepet.license.LicenseService.LicensePayload;
import com.enterprisepet.license.RevocationIndex;
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

import java.time.Duration;
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

    @Autowired
    private RevocationIndex revocationIndex;

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
        String downloadUrl = String.valueOf(resp.getBody().get("downloadUrl"));
        assertThat(downloadUrl).contains("jti=" + resp.getBody().get("jti"));
        assertThat(downloadUrl).contains("/red_panda.zip?");
        // Empty bundle.catalog: signed URL only — no invented hash.
        assertThat(resp.getBody()).doesNotContainKeys("sha256", "version", "platform", "filename");
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

    @Test
    @DisplayName("POST /api/download/{pet} returns 401 when jti is on the shared deny-list even if Postgres is not yet revoked")
    void download_fails_whenDenyListHasJti_beforeDbRowIsVisible() {
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, null);
        var issuedJwt = jwtService.issue(validOwner, validPet, validProvider);
        String jti = extractJtiFromLicense(enc);

        // Simulate a replica that has the Redis deny but has not seen revokedAt.
        revocationIndex.deny(jti, Duration.ofHours(1));

        HttpEntity<Map<String, String>> dlReq = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), null),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> dlResp = restTemplate.postForEntity(
            "/api/download/" + validPet, dlReq, Map.class);

        assertThat(dlResp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(String.valueOf(dlResp.getBody().get("error"))).contains("license missing, expired, or tampered");
    }

    @Test
    @DisplayName("POST /api/download/{pet} returns 401 when no Authorization header")
    void download_fails_noAuthHeader() {
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, null);

        // No Authorization header at all
        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), null),
            new HttpHeaders() // no auth
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/" + validPet, req, Map.class);

        // Security returns 401 or 403 for unauthenticated request to authenticated path
        assertThat(resp.getStatusCode()).isIn(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("POST /api/download/{pet} returns 403 when license is for a different pet than requested path")
    void download_fails_licensePetMismatch() {
        // License issued for red_panda
        var enc = licenseService.issueLicense(validOwner, "red_panda", validProvider, 1, null);
        var issuedJwt = jwtService.issue(validOwner, "red_panda", validProvider);

        // Request cat
        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), null),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/cat", req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("license is not valid for the requested pet");
    }

    @Test
    @DisplayName("POST /api/download/{pet} succeeds even if hwid is supplied in body when license is not hwid-bound")
    void download_success_hwidSuppliedButLicenseNotBound() {
        // License with no hwid
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, null);
        var issuedJwt = jwtService.issue(validOwner, validPet, validProvider);

        // Supply hwid anyway - should be ignored
        HttpEntity<Map<String, String>> req = new HttpEntity<>(
            licenseBody(enc.ciphertext(), enc.iv(), "some-device"),
            authHeaders(issuedJwt.token())
        );

        ResponseEntity<Map> resp = restTemplate.postForEntity(
            "/api/download/" + validPet, req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    // --- Admin direct edge cases (beyond the revoke-inside-download test) ---

    @Test
    @DisplayName("POST /api/admin/revoke returns 401 when X-Admin-Key header is missing")
    void admin_revoke_missingKey() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> req = new HttpEntity<>(Map.of("jti", "anything"), headers);

        ResponseEntity<Map> resp = restTemplate.postForEntity("/api/admin/revoke", req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("invalid or missing admin key");
    }

    @Test
    @DisplayName("POST /api/admin/revoke returns 401 when X-Admin-Key is wrong")
    void admin_revoke_wrongKey() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Admin-Key", "wrong-key-123");
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> req = new HttpEntity<>(Map.of("jti", "anything"), headers);

        ResponseEntity<Map> resp = restTemplate.postForEntity("/api/admin/revoke", req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("POST /api/admin/revoke returns 400 when jti is missing from body")
    void admin_revoke_missingJti() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Admin-Key", adminKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> req = new HttpEntity<>(Map.of(), headers); // no jti

        ResponseEntity<Map> resp = restTemplate.postForEntity("/api/admin/revoke", req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(String.valueOf(resp.getBody().get("error"))).contains("jti is required");
    }

    @Test
    @DisplayName("POST /api/admin/revoke returns 404 for nonexistent jti")
    void admin_revoke_nonexistentJti() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Admin-Key", adminKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> req = new HttpEntity<>(Map.of("jti", "does-not-exist-uuid"), headers);

        ResponseEntity<Map> resp = restTemplate.postForEntity("/api/admin/revoke", req, Map.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(String.valueOf(resp.getBody().get("reason"))).contains("not found or already revoked");
    }

    @Test
    @DisplayName("POST /api/admin/revoke is idempotent: second revoke of same jti returns 404")
    void admin_revoke_idempotent() {
        var enc = licenseService.issueLicense(validOwner, validPet, validProvider, 1, null);
        String jti = extractJtiFromLicense(enc);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Admin-Key", adminKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // First revoke
        HttpEntity<Map<String, String>> req1 = new HttpEntity<>(Map.of("jti", jti), headers);
        ResponseEntity<Map> r1 = restTemplate.postForEntity("/api/admin/revoke", req1, Map.class);
        assertThat(r1.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(r1.getBody().get("revoked")).isEqualTo(true);

        // Second revoke
        HttpEntity<Map<String, String>> req2 = new HttpEntity<>(Map.of("jti", jti), headers);
        ResponseEntity<Map> r2 = restTemplate.postForEntity("/api/admin/revoke", req2, Map.class);
        assertThat(r2.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    /** Helper: pull the jti out of an issued encrypted license (for revoke tests). */
    private String extractJtiFromLicense(LicenseService.EncryptedLicense enc) {
        var payload = licenseService.validate(enc.ciphertext(), enc.iv());
        return payload.map(LicensePayload::jti).orElseThrow();
    }
}
