package com.enterprisepet.steam;

import com.enterprisepet.provider.VerifyFieldBounds;

import java.util.Map;
import java.util.Optional;

/**
 * Typed Steam verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what {@link SteamService} already reads. No ticket
 * keys and no invented App ID. Length and charset are fail-closed —
 * never truncated into a RestClient URI.
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

    /**
     * Missing or malformed fields. Empty when shape is usable for an
     * outbound Steam call (house-door allowlist is separate).
     */
    public Optional<String> invalidReason() {
        if (steamId == null || appId == null) {
            return Optional.of("steamId and appId are required");
        }
        Optional<String> steamIdErr = VerifyFieldBounds.reject(
                "steamId", steamId, VerifyFieldBounds.STEAM_ID_MAX,
                VerifyFieldBounds.STEAM_ID, "steamId must be a numeric SteamID64");
        if (steamIdErr.isPresent()) {
            return steamIdErr;
        }
        return VerifyFieldBounds.reject(
                "appId", appId, VerifyFieldBounds.STEAM_APP_ID_MAX,
                VerifyFieldBounds.STEAM_APP_ID, "appId must be a numeric Steam AppID");
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
