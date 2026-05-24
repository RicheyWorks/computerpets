package com.enterprisepet.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Encrypted license payload (AES-256-GCM)")
public record LicenseInfo(
        @Schema(description = "Base64-encoded ciphertext of the license", example = "base64ciphertext...")
        String ciphertext,

        @Schema(description = "Base64-encoded initialization vector", example = "base64iv...")
        String iv,

        @Schema(description = "ISO-8601 expiration timestamp of the license", example = "2027-05-23T12:00:00Z")
        String expiresAt
) {}