package com.enterprisepet.license;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * Append-only license audit ledger. Logs who / what / when without secret values
 * (no ciphertext, keys, JWTs, or hwid material).
 */
@Service
public class LicenseAuditService implements LicenseAuditor {

    private static final Logger log = LoggerFactory.getLogger(LicenseAuditService.class);

    public static final String ACTOR_SYSTEM = "system";
    public static final String ACTOR_ADMIN = "admin";

    private final LicenseAuditEventRepository auditRepository;

    public LicenseAuditService(LicenseAuditEventRepository auditRepository) {
        this.auditRepository = Objects.requireNonNull(auditRepository, "auditRepository");
    }

    @Override
    public void recordIssued(IssuedLicense lic, boolean hwidBound) {
        record(lic.getJti(), LicenseAuditEventType.ISSUED, ACTOR_SYSTEM,
            lic.getOwner(), lic.getPet(), lic.getProvider(),
            hwidBound ? "hwidBound=true" : null);
    }

    @Override
    public void recordRevoked(IssuedLicense lic, String actor) {
        String safeActor = (actor == null || actor.isBlank()) ? ACTOR_SYSTEM : actor.trim();
        record(lic.getJti(), LicenseAuditEventType.REVOKED, safeActor,
            lic.getOwner(), lic.getPet(), lic.getProvider(), "soft-deleted");
    }

    @Override
    public void recordDownload(IssuedLicense lic) {
        record(lic.getJti(), LicenseAuditEventType.DOWNLOAD, ACTOR_SYSTEM,
            lic.getOwner(), lic.getPet(), lic.getProvider(), null);
    }

    public List<LicenseAuditEvent> recentForJti(String jti) {
        if (jti == null || jti.isBlank()) return List.of();
        return auditRepository.findTop50ByJtiOrderByOccurredAtDesc(jti.trim());
    }

    private void record(String jti,
                        LicenseAuditEventType type,
                        String actor,
                        String owner,
                        String pet,
                        String provider,
                        String detail) {
        Instant when = Instant.now();
        auditRepository.save(new LicenseAuditEvent(
            jti, type, actor, owner, pet, provider, when, detail));
        // Structured info only — never ciphertext, keys, JWT, or hwid values.
        log.info("license.audit type={} jti={} actor={} owner={} pet={} provider={} detail={}",
            type, jti, actor, owner, pet, provider, detail);
    }
}
