package com.enterprisepet.steam;

import java.util.Map;

/**
 * Typed Steam verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what {@link SteamService} already reads. No ticket
 * keys and no invented App ID.
 */
public record SteamVerifyRequest(
        String steamId,
        String appId
) {

    public static SteamVerifyRequest from(Map<String, String> request) {
        Map<String, String> src = request == null ? Map.of() : request;
        return new SteamVerifyRequest(
                trimToNull(src.get("steamId")),
                trimToNull(src.get("appId"))
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
