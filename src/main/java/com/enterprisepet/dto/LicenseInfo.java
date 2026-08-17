package com.enterprisepet.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Encrypted license envelope (AES-256-GCM, no KDF). See docs/CLIENT-CONTRACT.md.")
public record LicenseInfo(
        @Schema(description = "Standard Base64 of AES-GCM ciphertext with 16-byte tag appended", example = "base64ciphertext...")
        String ciphertext,

        @Schema(description = "Standard Base64 of the 12-byte GCM IV (not prepended to ciphertext)", example = "base64iv...")
        String iv,

        @Schema(description = "ISO-8601 expiration timestamp of the license", example = "2027-05-23T12:00:00Z")
        String expiresAt
) {}