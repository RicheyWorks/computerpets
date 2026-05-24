package com.enterprisepet.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Standard error response format")
public record ErrorResponse(
        @Schema(description = "Error message", example = "ownership not verified")
        String error,

        @Schema(description = "Provider that was used (if applicable)", example = "steam")
        String provider
) {}