package com.enterprisepet.license;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "issued_licenses")
public class IssuedLicense {

    @Id
    private String jti;  // Unique license ID (UUID)

    @Column(nullable = false)
    private String owner;  // Owner identifier from the provider (Steam ID, wallet, etc.)

    @Column(nullable = false)
    private String pet;    // Pet key (e.g., "red_panda")

    @Column(nullable = false)
    private String provider; // e.g., "steam", "nft", "microsoft"

    @Column(nullable = false)
    private Instant issuedAt;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column
    private Instant revokedAt;  // null if not revoked

    @Column
    private Instant lastUsedAt;   // set on successful download (Phase 2.1 usage tracking)

    @Column(length = 128)
    private String hwid;          // optional hardware fingerprint (Phase 2.2)

    public IssuedLicense() {}

    public IssuedLicense(String owner, String pet, String provider, Instant issuedAt, Instant expiresAt) {
        this.jti = UUID.randomUUID().toString();
        this.owner = owner;
        this.pet = pet;
        this.provider = provider;
        this.issuedAt = issuedAt;
        this.expiresAt = expiresAt;
    }

    // Getters and setters

    public String getJti() { return jti; }
    public void setJti(String jti) { this.jti = jti; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }

    public String getPet() { return pet; }
    public void setPet(String pet) { this.pet = pet; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public Instant getIssuedAt() { return issuedAt; }
    public void setIssuedAt(Instant issuedAt) { this.issuedAt = issuedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Instant getRevokedAt() { return revokedAt; }
    public void setRevokedAt(Instant revokedAt) { this.revokedAt = revokedAt; }

    public Instant getLastUsedAt() { return lastUsedAt; }
    public void setLastUsedAt(Instant lastUsedAt) { this.lastUsedAt = lastUsedAt; }

    public String getHwid() { return hwid; }
    public void setHwid(String hwid) { this.hwid = hwid; }

    public boolean isRevoked() {
        return revokedAt != null;
    }

    public boolean isExpired() {
        return expiresAt.isBefore(Instant.now());
    }
}