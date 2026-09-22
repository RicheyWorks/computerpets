package com.enterprisepet.itch;

import com.enterprisepet.provider.VerifyFieldBounds;

import java.util.Map;
import java.util.Optional;

/**
 * Typed itch.io verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what {@link ItchService} already reads. No invented
 * game id. Length and charset are fail-closed — never truncated into a
 * RestClient URI.
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

    /**
     * Missing or malformed fields. Empty when shape is usable for an
     * outbound itch.io call (official game allowlist is separate).
     */
    public Optional<String> invalidReason() {
        if (gameId == null || downloadKey == null) {
            return Optional.of("gameId and downloadKey are required");
        }
        Optional<String> gameErr = VerifyFieldBounds.reject(
                "gameId", gameId, VerifyFieldBounds.ITCH_GAME_ID_MAX,
                VerifyFieldBounds.ITCH_GAME_ID, "gameId must be a numeric itch.io game id");
        if (gameErr.isPresent()) {
            return gameErr;
        }
        return VerifyFieldBounds.reject(
                "downloadKey", downloadKey, VerifyFieldBounds.ITCH_DOWNLOAD_KEY_MAX,
                VerifyFieldBounds.ITCH_DOWNLOAD_KEY,
                "downloadKey must be an itch.io download key (8–128 letters, digits, ._-)");
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
