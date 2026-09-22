package com.enterprisepet.license;

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

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Soft-delete + audit ledger: revoke stamps deletedAt, default lists exclude it,
 * admin still sees revoked rows, and issue/revoke/download leave audit events.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class LicenseSoftDeleteAuditIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private LicenseService licenseService;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private LicenseAuditEventRepository auditEventRepository;

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

    private static final String OWNER = "steam:76561198000000999";
    private static final String PET = "red_panda";
    private static final String PROVIDER = "steam";

    @Test
    @DisplayName("issue writes ISSUED audit; revoke soft-deletes and writes REVOKED; admin still sees row")
    void issueRevokeSoftDeleteAndAudit() {
        var enc = licenseService.issueLicense(OWNER, PET, PROVIDER, 1, "desk-soft");
        String jti = extractJti(enc);

        IssuedLicense before = licenseRepository.findByJti(jti).orElseThrow();
        assertThat(before.getDeletedAt()).isNull();
        assertThat(before.isActive()).isTrue();

        List<LicenseAuditEvent> issuedEvents = auditEventRepository.findTop50ByJtiOrderByOccurredAtDesc(jti);
        assertThat(issuedEvents)
            .extracting(LicenseAuditEvent::getEventType)
            .contains(LicenseAuditEventType.ISSUED);
        assertThat(issuedEvents.getFirst().getDetail()).isEqualTo("hwidBound=true");

        assertThat(licenseService.listActiveRecent())
            .extracting(IssuedLicense::getJti)
            .contains(jti);

        ResponseEntity<Map> revokeResp = restTemplate.exchange(
            "/api/admin/revoke",
            HttpMethod.POST,
            new HttpEntity<>(Map.of("jti", jti), adminHeaders()),
            Map.class);
        assertThat(revokeResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(revokeResp.getBody().get("revoked")).isEqualTo(true);
        assertThat(revokeResp.getBody().get("softDeleted")).isEqualTo(true);

        IssuedLicense after = licenseRepository.findByJti(jti).orElseThrow();
        assertThat(after.getRevokedAt()).isNotNull();
        assertThat(after.getDeletedAt()).isNotNull();
        assertThat(after.isDeleted()).isTrue();
        assertThat(after.isActive()).isFalse();

        // Default active queries exclude soft-deleted.
        assertThat(licenseService.listActiveRecent())
            .extracting(IssuedLicense::getJti)
            .doesNotContain(jti);
        assertThat(licenseService.findActiveByOwner(OWNER))
            .extracting(IssuedLicense::getJti)
            .doesNotContain(jti);

        // Admin list / lookup still see the revoked row with honest copy.
        ResponseEntity<Map> byJti = restTemplate.exchange(
            "/api/admin/licenses/" + jti,
            HttpMethod.GET,
            new HttpEntity<>(adminHeaders()),
            Map.class);
        assertThat(byJti.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(byJti.getBody().get("revoked")).isEqualTo(true);
        assertThat(byJti.getBody().get("deleted")).isEqualTo(true);
        assertThat(byJti.getBody().get("deletedAt")).isNotNull();
        assertThat(byJti.getBody().get("revokedAt")).isNotNull();

        ResponseEntity<List<Map<String, Object>>> list = restTemplate.exchange(
            "/api/admin/licenses?owner={owner}",
            HttpMethod.GET,
            new HttpEntity<>(adminHeaders()),
            new ParameterizedTypeReference<>() {},
            OWNER);
        assertThat(list.getBody())
            .extracting(row -> row.get("jti"))
            .contains(jti);

        List<LicenseAuditEvent> afterRevoke = auditEventRepository.findTop50ByJtiOrderByOccurredAtDesc(jti);
        assertThat(afterRevoke)
            .extracting(LicenseAuditEvent::getEventType)
            .contains(LicenseAuditEventType.ISSUED, LicenseAuditEventType.REVOKED);
        assertThat(afterRevoke.stream()
                .filter(e -> e.getEventType() == LicenseAuditEventType.REVOKED)
                .findFirst())
            .get()
            .satisfies(e -> {
                assertThat(e.getActor()).isEqualTo(LicenseAuditService.ACTOR_ADMIN);
                assertThat(e.getDetail()).isEqualTo("soft-deleted");
            });

        // Soft-deleted licenses no longer validate.
        assertThat(licenseService.validate(enc.ciphertext(), enc.iv())).isEmpty();
    }

    @Test
    @DisplayName("recordDownload writes DOWNLOAD audit and skips soft-deleted rows")
    void downloadAuditAndSkipDeleted() {
        var enc = licenseService.issueLicense(OWNER, "cat", PROVIDER, 1, null);
        String jti = extractJti(enc);

        licenseService.recordDownload(jti);
        IssuedLicense used = licenseRepository.findByJti(jti).orElseThrow();
        assertThat(used.getLastUsedAt()).isNotNull();
        assertThat(auditEventRepository.findTop50ByJtiOrderByOccurredAtDesc(jti))
            .extracting(LicenseAuditEvent::getEventType)
            .contains(LicenseAuditEventType.DOWNLOAD);

        assertThat(licenseService.revoke(jti)).isTrue();
        Instant lastUsed = licenseRepository.findByJti(jti).orElseThrow().getLastUsedAt();

        licenseService.recordDownload(jti);
        IssuedLicense after = licenseRepository.findByJti(jti).orElseThrow();
        assertThat(after.getLastUsedAt()).isEqualTo(lastUsed);
        long downloads = auditEventRepository.findTop50ByJtiOrderByOccurredAtDesc(jti).stream()
            .filter(e -> e.getEventType() == LicenseAuditEventType.DOWNLOAD)
            .count();
        assertThat(downloads).isEqualTo(1);
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
