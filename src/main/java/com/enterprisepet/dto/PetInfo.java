package com.enterprisepet.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Basic information about a pet type")
public record PetInfo(
        @Schema(description = "Unique key for the pet type", example = "red_panda")
        String key,

        @Schema(description = "Human-readable name", example = "Red Panda")
        String displayName
) {}