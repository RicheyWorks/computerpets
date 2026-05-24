package com.enterprisepet.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Short-lived JWT authentication token for bundle downloads")
public record AuthInfo(
        @Schema(description = "JWT bearer token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String token,

        @Schema(description = "Token type", example = "Bearer")
        String tokenType,

        @Schema(description = "Token lifetime in seconds", example = "1800")
        long expiresInSeconds,

        @Schema(description = "ISO-8601 expiration timestamp", example = "2026-05-23T13:30:00Z")
        String expiresAt
) {}