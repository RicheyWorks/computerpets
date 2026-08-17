package com.enterprisepet.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Encrypted license posted to /api/download/{petKey}. " +
        "ciphertext + iv come from a prior /api/verify response; hwid is required only when the license is device-bound.")
public record DownloadRequest(
        @Schema(description = "Base64-encoded AES-256-GCM ciphertext (tag appended)", requiredMode = Schema.RequiredMode.REQUIRED)
        String ciphertext,

        @Schema(description = "Base64-encoded 12-byte GCM IV", requiredMode = Schema.RequiredMode.REQUIRED)
        String iv,

        @Schema(description = "Opaque hardware id; required and must match when the license was issued with hwid",
                example = "device-abc-123")
        String hwid
) {}
