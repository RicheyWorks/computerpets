package com.enterprisepet.itch;

import java.util.Map;

/**
 * Typed itch.io verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what {@link ItchService} already reads. No invented
 * game id.
 */
public record ItchVerifyRequest(
        String gameId,
        String downloadKey
) {

    public static ItchVerifyRequest from(Map<String, String> request) {
        Map<String, String> src = request == null ? Map.of() : request;
        return new ItchVerifyRequest(
                trimToNull(src.get("gameId")),
                trimToNull(src.get("downloadKey"))
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
