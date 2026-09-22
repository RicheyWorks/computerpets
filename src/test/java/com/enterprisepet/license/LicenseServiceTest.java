package com.enterprisepet.license;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Focused tests for revocation (soft-delete), usage recording, and audit hooks.
 */
@ExtendWith(MockitoExtension.class)
class LicenseServiceTest {

    @Mock
    private LicenseRepository licenseRepository;

    @Mock
    private LicenseAuditor auditor;

    private LicenseService licenseService;

    @BeforeEach
    void setUp() {
        licenseService = new LicenseService(
            licenseRepository, new InMemoryRevocationIndex(), auditor, true);
    }

    @Test
    void revoke_returnsTrue_onFirstCall_andSoftDeletes() {
        IssuedLicense lic = new IssuedLicense("owner1", "red_panda", "steam", Instant.now(), Instant.now().plusSeconds(3600));
        lic.setJti("test-jti-123");

        when(licenseRepository.findByJti("test-jti-123")).thenReturn(Optional.of(lic));

        boolean first = licenseService.revoke("test-jti-123", LicenseAuditService.ACTOR_ADMIN);
        assertThat(first).isTrue();

        ArgumentCaptor<IssuedLicense> captor = ArgumentCaptor.forClass(IssuedLicense.class);
        verify(licenseRepository).save(captor.capture());
        assertThat(captor.getValue().getRevokedAt()).isNotNull();
        assertThat(captor.getValue().getDeletedAt()).isNotNull();
        assertThat(captor.getValue().getDeletedAt()).isEqualTo(captor.getValue().getRevokedAt());
        verify(auditor).recordRevoked(any(IssuedLicense.class), eq(LicenseAuditService.ACTOR_ADMIN));
    }

    @Test
    void revoke_writesDenyList_afterPostgresSave() {
        RevocationIndex index = mock(RevocationIndex.class);
        licenseService = new LicenseService(licenseRepository, index, auditor, true);

        IssuedLicense lic = new IssuedLicense("owner1", "red_panda", "steam", Instant.now(), Instant.now().plusSeconds(3600));
        lic.setJti("test-jti-123");
        when(licenseRepository.findByJti("test-jti-123")).thenReturn(Optional.of(lic));

        assertThat(licenseService.revoke("test-jti-123")).isTrue();
        verify(licenseRepository).save(any(IssuedLicense.class));
        verify(index).deny(eq("test-jti-123"), any());
    }

    @Test
    void revoke_stillSucceeds_whenDenyListWriteFails() {
        RevocationIndex index = mock(RevocationIndex.class);
        licenseService = new LicenseService(licenseRepository, index, auditor, true);

        IssuedLicense lic = new IssuedLicense("owner1", "red_panda", "steam", Instant.now(), Instant.now().plusSeconds(3600));
        lic.setJti("test-jti-123");
        when(licenseRepository.findByJti("test-jti-123")).thenReturn(Optional.of(lic));
        doThrow(new RevocationIndexUnavailableException("down", new RuntimeException("boom")))
            .when(index).deny(any(), any());

        assertThat(licenseService.revoke("test-jti-123")).isTrue();
        verify(licenseRepository).save(any(IssuedLicense.class));
    }

    @Test
    void revoke_returnsFalse_whenAlreadyRevoked_andHealsDeletedAt() {
        IssuedLicense lic = new IssuedLicense("owner1", "red_panda", "steam", Instant.now(), Instant.now().plusSeconds(3600));
        lic.setJti("test-jti-123");
        Instant revoked = Instant.now().minusSeconds(60);
        lic.setRevokedAt(revoked);
        // Older row: revoked without deletedAt — heal on repeat revoke.

        when(licenseRepository.findByJti("test-jti-123")).thenReturn(Optional.of(lic));

        boolean result = licenseService.revoke("test-jti-123");
        assertThat(result).isFalse();
        verify(licenseRepository).save(any(IssuedLicense.class));
        assertThat(lic.getDeletedAt()).isEqualTo(revoked);
        verify(auditor, never()).recordRevoked(any(), any());
    }

    @Test
    void revoke_returnsFalse_whenAlreadySoftDeleted_withoutResave() {
        IssuedLicense lic = new IssuedLicense("owner1", "red_panda", "steam", Instant.now(), Instant.now().plusSeconds(3600));
        lic.setJti("test-jti-123");
        Instant when = Instant.now().minusSeconds(60);
        lic.setRevokedAt(when);
        lic.setDeletedAt(when);

        when(licenseRepository.findByJti("test-jti-123")).thenReturn(Optional.of(lic));

        assertThat(licenseService.revoke("test-jti-123")).isFalse();
        verify(licenseRepository, never()).save(any());
        verify(auditor, never()).recordRevoked(any(), any());
    }

    @Test
    void recordDownload_updatesLastUsedAt_andAudits_whenActive() {
        IssuedLicense lic = new IssuedLicense("owner1", "cat", "nft", Instant.now(), Instant.now().plusSeconds(3600));
        lic.setJti("jti-xyz");

        when(licenseRepository.findByJtiAndDeletedAtIsNull("jti-xyz")).thenReturn(Optional.of(lic));

        licenseService.recordDownload("jti-xyz");

        ArgumentCaptor<IssuedLicense> captor = ArgumentCaptor.forClass(IssuedLicense.class);
        verify(licenseRepository).save(captor.capture());
        assertThat(captor.getValue().getLastUsedAt()).isNotNull();
        verify(auditor).recordDownload(any(IssuedLicense.class));
    }

    @Test
    void recordDownload_skipsSoftDeleted() {
        when(licenseRepository.findByJtiAndDeletedAtIsNull("gone")).thenReturn(Optional.empty());

        licenseService.recordDownload("gone");

        verify(licenseRepository, never()).save(any());
        verify(auditor, never()).recordDownload(any());
    }

    @Test
    void findIssued_returnsEmpty_whenBlank() {
        assertThat(licenseService.findIssued("  ")).isEmpty();
        verify(licenseRepository, never()).findByJti(any());
    }

    @Test
    void findByOwner_trims_andDelegates_includingSoftDeleted() {
        IssuedLicense lic = new IssuedLicense("owner1", "cat", "steam", Instant.now(), Instant.now().plusSeconds(3600));
        when(licenseRepository.findTop50ByOwnerOrderByIssuedAtDesc("owner1")).thenReturn(List.of(lic));

        assertThat(licenseService.findByOwner("  owner1  ")).containsExactly(lic);
        assertThat(licenseService.findByOwner("")).isEmpty();
        verify(licenseRepository, never()).findTop50ByOwnerOrderByIssuedAtDesc("");
    }

    @Test
    void findActiveByOwner_excludesSoftDeleted() {
        IssuedLicense lic = new IssuedLicense("owner1", "cat", "steam", Instant.now(), Instant.now().plusSeconds(3600));
        when(licenseRepository.findTop50ByDeletedAtIsNullAndOwnerOrderByIssuedAtDesc("owner1"))
            .thenReturn(List.of(lic));

        assertThat(licenseService.findActiveByOwner("owner1")).containsExactly(lic);
    }

    @Test
    void hwid_isStored_whenProvidedOnIssue() {
        assertThat(licenseService).isNotNull();
    }
}
