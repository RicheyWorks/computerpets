package com.enterprisepet.license;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Redis-then-Postgres validate order, replica-lag deny via a shared index,
 * and Redis-down fallback to the ledger.
 */
@ExtendWith(MockitoExtension.class)
class LicenseServiceRevocationIndexTest {

    @Mock
    private LicenseRepository repoA;

    @Mock
    private LicenseRepository repoB;

    @Mock
    private RevocationIndex index;

    private LicenseService service;
    private byte[] masterKey;

    @BeforeEach
    void setUp() {
        service = new LicenseService(repoA, index, true);
        masterKey = new byte[32];
        new SecureRandom().nextBytes(masterKey);
        ReflectionTestUtils.setField(service, "masterKey", masterKey);
    }

    @Test
    @DisplayName("validate denies a jti on the deny-list without reading Postgres")
    void validate_deniesFromIndex_withoutDbLookup() {
        var issued = issue(service);
        when(index.isDenied(issued.jti())).thenReturn(true);

        assertThat(service.validate(issued.enc().ciphertext(), issued.enc().iv())).isEmpty();
        verify(repoA, never()).findByJti(issued.jti());
    }

    @Test
    @DisplayName("two services sharing a deny-list: replica without revokedAt still denies")
    void twoServices_sharedIndex_replicaWithoutDbRowStillDenies() {
        InMemoryRevocationIndex shared = new InMemoryRevocationIndex();
        LicenseService issuer = keyed(new LicenseService(repoA, shared, true));
        LicenseService replica = keyed(new LicenseService(repoB, shared, true));

        var issued = issue(issuer);

        IssuedLicense stillActive = activeRow(issued.jti(), "dog");
        when(repoA.findByJti(issued.jti())).thenReturn(Optional.of(stillActive));
        assertThat(issuer.revoke(issued.jti())).isTrue();

        assertThat(shared.isDenied(issued.jti())).isTrue();
        assertThat(replica.validate(issued.enc().ciphertext(), issued.enc().iv())).isEmpty();
        verify(repoB, never()).findByJti(any());
    }

    @Test
    @DisplayName("Redis down: validate falls back to Postgres and still denies a revoked jti")
    void validate_indexDown_fallsBackToDb_deniesRevoked() {
        var issued = issue(service);
        when(index.isDenied(issued.jti())).thenThrow(
            new RevocationIndexUnavailableException("down", new RuntimeException("boom")));

        IssuedLicense revoked = activeRow(issued.jti(), "cat");
        revoked.setRevokedAt(Instant.now());
        when(repoA.findByJti(issued.jti())).thenReturn(Optional.of(revoked));

        assertThat(service.validate(issued.enc().ciphertext(), issued.enc().iv())).isEmpty();
    }

    @Test
    @DisplayName("Redis down: validate falls back to Postgres and still accepts an active license")
    void validate_indexDown_fallsBackToDb_acceptsActive() {
        var issued = issue(service);
        when(index.isDenied(issued.jti())).thenThrow(
            new RevocationIndexUnavailableException("down", new RuntimeException("boom")));

        when(repoA.findByJti(issued.jti())).thenReturn(Optional.of(activeRow(issued.jti(), "cat")));

        assertThat(service.validate(issued.enc().ciphertext(), issued.enc().iv()))
            .isPresent()
            .get()
            .extracting(LicenseService.LicensePayload::jti)
            .isEqualTo(issued.jti());
    }

    @Test
    void denyTtl_isRemainingLifePlusSkew() {
        Instant expires = Instant.now().plus(Duration.ofDays(10));
        IssuedLicense lic = new IssuedLicense("o", "cat", "steam", Instant.now(), expires);
        Duration ttl = LicenseService.denyTtl(lic);
        assertThat(ttl).isGreaterThan(Duration.ofDays(10));
        assertThat(ttl).isLessThanOrEqualTo(Duration.ofDays(10).plus(LicenseService.DENY_TTL_SKEW).plusSeconds(2));
    }

    private Issued issue(LicenseService issuer) {
        when(repoA.save(any(IssuedLicense.class))).thenAnswer(inv -> inv.getArgument(0));
        var enc = issuer.issueLicense("owner1", issuer == service ? "red_panda" : "dog", "steam", 1, null);
        ArgumentCaptor<IssuedLicense> captor = ArgumentCaptor.forClass(IssuedLicense.class);
        verify(repoA).save(captor.capture());
        return new Issued(enc, captor.getValue().getJti());
    }

    private static IssuedLicense activeRow(String jti, String pet) {
        IssuedLicense lic = new IssuedLicense("owner1", pet, "steam", Instant.now(), Instant.now().plusSeconds(3600));
        lic.setJti(jti);
        return lic;
    }

    private LicenseService keyed(LicenseService s) {
        ReflectionTestUtils.setField(s, "masterKey", masterKey);
        return s;
    }

    private record Issued(LicenseService.EncryptedLicense enc, String jti) {}
}
