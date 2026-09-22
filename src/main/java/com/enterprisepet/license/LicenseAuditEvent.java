package com.enterprisepet.license;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Append-only audit row for license lifecycle. Never stores ciphertext, keys,
 * JWTs, or hardware fingerprints — only jti / owner / pet / provider stamps.
 */
@Entity
@Table(name = "license_audit_events")
public class LicenseAuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 36)
    private String jti;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 32)
    private LicenseAuditEventType eventType;

    /** Who triggered the event: {@code system}, {@code admin}, etc. Never a secret. */
    @Column(nullable = false, length = 64)
    private String actor;

    @Column(length = 255)
    private String owner;

    @Column(length = 255)
    private String pet;

    @Column(length = 50)
    private String provider;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    /** Short safe note (e.g. {@code hwidBound=true}). Never secret material. */
    @Column(length = 128)
    private String detail;

    public LicenseAuditEvent() {}

    public LicenseAuditEvent(String jti,
                             LicenseAuditEventType eventType,
                             String actor,
                             String owner,
                             String pet,
                             String provider,
                             Instant occurredAt,
                             String detail) {
        this.jti = jti;
        this.eventType = eventType;
        this.actor = actor;
        this.owner = owner;
        this.pet = pet;
        this.provider = provider;
        this.occurredAt = occurredAt;
        this.detail = detail;
    }

    public Long getId() { return id; }

    public String getJti() { return jti; }
    public void setJti(String jti) { this.jti = jti; }

    public LicenseAuditEventType getEventType() { return eventType; }
    public void setEventType(LicenseAuditEventType eventType) { this.eventType = eventType; }

    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public String getPet() { return pet; }
    public void setPet(String pet) { this.pet = pet; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public Instant getOccurredAt() { return occurredAt; }
    public void setOccurredAt(Instant occurredAt) { this.occurredAt = occurredAt; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
}
