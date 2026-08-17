package com.enterprisepet.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response containing the signed short-lived CDN download URL for a pet bundle")
public record DownloadResponse(
        @Schema(description = "Pet type key", example = "red_panda")
        String petKey,

        @Schema(description = "Human readable pet name", example = "Red Panda")
        String displayName,

        @Schema(description = "Rarity tier of the pet", example = "COMMON")
        String rarity,

        @Schema(description = "Signed temporary download URL", example = "https://cdn.../red_panda.zip?owner=...&jti=...&exp=...&sig=...")
        String downloadUrl,

        @Schema(description = "ISO-8601 expiration time of the URL", example = "2026-05-23T12:15:00Z")
        String expiresAt,

        @Schema(description = "How long the URL remains valid in seconds", example = "900")
        long ttlSeconds,

        @Schema(description = "License jti bound into the HMAC (present for licenses issued by this backend)",
                example = "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80")
        String jti,

        @Schema(description = "Catalog version when a bundle.catalog row matches; omitted otherwise",
                example = "1.0.0",
                requiredMode = Schema.RequiredMode.NOT_REQUIRED)
        String version,

        @Schema(description = "Catalog platform when a row matches (win, mac, linux, any)",
                example = "win",
                requiredMode = Schema.RequiredMode.NOT_REQUIRED)
        String platform,

        @Schema(description = "Lowercase hex sha256 of the zip, only when a catalog row matches. "
                + "Never invented for an unpublished artifact.",
                example = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
                requiredMode = Schema.RequiredMode.NOT_REQUIRED)
        String sha256,

        @Schema(description = "Object key under bundle.base-url when a catalog row matches",
                example = "red_panda-win-1.0.0.zip",
                requiredMode = Schema.RequiredMode.NOT_REQUIRED)
        String filename
) {}