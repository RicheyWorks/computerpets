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

        @Schema(description = "Signed temporary download URL", example = "https://cdn.../red_panda.zip?owner=...&exp=...&sig=...")
        String downloadUrl,

        @Schema(description = "ISO-8601 expiration time of the URL", example = "2026-05-23T12:15:00Z")
        String expiresAt,

        @Schema(description = "How long the URL remains valid in seconds", example = "900")
        long ttlSeconds
) {}