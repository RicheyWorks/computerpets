package com.enterprisepet.license;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class LicenseAuditServiceTest {

    @Mock
    private LicenseAuditEventRepository auditRepository;

    @Test
    void recordIssued_persistsSafeFields_withoutSecrets() {
        LicenseAuditService service = new LicenseAuditService(auditRepository);
        IssuedLicense lic = new IssuedLicense("steam:1", "red_panda", "steam", Instant.now(), Instant.now().plusSeconds(60));
        lic.setJti("jti-issued");

        service.recordIssued(lic, true);

        ArgumentCaptor<LicenseAuditEvent> captor = ArgumentCaptor.forClass(LicenseAuditEvent.class);
        verify(auditRepository).save(captor.capture());
        LicenseAuditEvent event = captor.getValue();
        assertThat(event.getEventType()).isEqualTo(LicenseAuditEventType.ISSUED);
        assertThat(event.getActor()).isEqualTo(LicenseAuditService.ACTOR_SYSTEM);
        assertThat(event.getJti()).isEqualTo("jti-issued");
        assertThat(event.getOwner()).isEqualTo("steam:1");
        assertThat(event.getPet()).isEqualTo("red_panda");
        assertThat(event.getProvider()).isEqualTo("steam");
        assertThat(event.getDetail()).isEqualTo("hwidBound=true");
        assertThat(event.getDetail()).doesNotContain("secret");
    }

    @Test
    void recordRevoked_usesAdminActor_andSoftDeletedDetail() {
        LicenseAuditService service = new LicenseAuditService(auditRepository);
        IssuedLicense lic = new IssuedLicense("o", "cat", "nft", Instant.now(), Instant.now().plusSeconds(60));
        lic.setJti("jti-rev");

        service.recordRevoked(lic, LicenseAuditService.ACTOR_ADMIN);

        ArgumentCaptor<LicenseAuditEvent> captor = ArgumentCaptor.forClass(LicenseAuditEvent.class);
        verify(auditRepository).save(captor.capture());
        assertThat(captor.getValue().getEventType()).isEqualTo(LicenseAuditEventType.REVOKED);
        assertThat(captor.getValue().getActor()).isEqualTo("admin");
        assertThat(captor.getValue().getDetail()).isEqualTo("soft-deleted");
    }

    @Test
    void recordDownload_isRedeemAdjacentStamp() {
        LicenseAuditService service = new LicenseAuditService(auditRepository);
        IssuedLicense lic = new IssuedLicense("o", "dog", "steam", Instant.now(), Instant.now().plusSeconds(60));
        lic.setJti("jti-dl");

        service.recordDownload(lic);

        ArgumentCaptor<LicenseAuditEvent> captor = ArgumentCaptor.forClass(LicenseAuditEvent.class);
        verify(auditRepository).save(captor.capture());
        assertThat(captor.getValue().getEventType()).isEqualTo(LicenseAuditEventType.DOWNLOAD);
        assertThat(captor.getValue().getActor()).isEqualTo("system");
        assertThat(captor.getValue().getDetail()).isNull();
    }
}
