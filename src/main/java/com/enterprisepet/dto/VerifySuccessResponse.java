package com.enterprisepet.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Successful response after ownership verification")
public record VerifySuccessResponse(
        @Schema(description = "Status of the verification", example = "success")
        String status,

        @Schema(description = "Provider used for verification", example = "steam")
        String provider,

        @Schema(description = "Encrypted license information")
        LicenseInfo license,

        @Schema(description = "Short-lived JWT for bundle download")
        AuthInfo auth,

        @Schema(description = "Information about the requested pet")
        PetInfo pet,

        @Schema(description = "Human-readable success message", example = "Steam ownership verified. License issued.")
        String message
) {}