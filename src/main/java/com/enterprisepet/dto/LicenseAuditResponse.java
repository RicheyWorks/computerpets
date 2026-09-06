package com.enterprisepet.dto;

import com.enterprisepet.license.IssuedLicense;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Persisted license row for admin lookup, audit, and revocation")
public record LicenseAuditResponse(
        @Schema(description = "Unique license id (jti)", example = "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        String jti,

        @Schema(description = "Owner identifier from the provider", example = "steam:76561198000000000")
        String owner,

        @Schema(description = "Pet key", example = "red_panda")
        String pet,

        @Schema(description = "Ownership provider", example = "steam")
        String provider,

        @Schema(description = "When the license was issued")
        Instant issuedAt,

        @Schema(description = "When the license expires")
        Instant expiresAt,

        @Schema(description = "Last successful download, if any")
        Instant lastUsedAt,

        @Schema(description = "When the license was revoked, if any")
        Instant revokedAt,

        @Schema(description = "True when revokedAt is set")
        boolean revoked,

        @Schema(description = "True when the license was issued with a hardware binding")
        boolean hwidBound
) {
    public static LicenseAuditResponse from(IssuedLicense license) {
        String hwid = license.getHwid();
        return new LicenseAuditResponse(
                license.getJti(),
                license.getOwner(),
                license.getPet(),
                license.getProvider(),
                license.getIssuedAt(),
                license.getExpiresAt(),
                license.getLastUsedAt(),
                license.getRevokedAt(),
                license.isRevoked(),
                hwid != null && !hwid.isBlank()
        );
    }
}
