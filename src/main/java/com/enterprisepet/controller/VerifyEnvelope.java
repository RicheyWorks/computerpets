package com.enterprisepet.controller;

import java.util.Map;

/**
 * Shared verify fields parsed from the same flat {@code Map<String, String>}
 * body the controller already binds. Provider-specific keys stay on each
 * {@code *VerifyRequest}.
 *
 * <p>{@code petType} is trimmed (blank → null), matching the controller's
 * existing defaulting. {@code hwid} is left raw so the 128-character
 * length check and license binding stay unchanged.
 */
public record VerifyEnvelope(String petType, String hwid) {

    public static VerifyEnvelope from(Map<String, String> request) {
        Map<String, String> src = request == null ? Map.of() : request;
        return new VerifyEnvelope(
                trimToNull(src.get("petType")),
                src.get("hwid")
        );
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
