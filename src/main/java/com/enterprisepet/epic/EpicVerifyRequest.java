package com.enterprisepet.epic;

import com.enterprisepet.provider.VerifyFieldBounds;

import java.util.Map;
import java.util.Optional;

/**
 * Typed Epic Games Store verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what {@link EpicService} already reads. Optional
 * {@code platform} defaults to {@code EPIC} when omitted. No invented
 * sandbox or catalog item id. Length and charset are fail-closed —
 * never truncated into a RestClient URI.
 */
public record EpicVerifyRequest(
        String accountId,
        String sandboxId,
        String catalogItemId,
        String platform
) {

    public static EpicVerifyRequest from(Map<String, String> request) {
        Map<String, String> src = request == null ? Map.of() : request;
        return new EpicVerifyRequest(
                trimToNull(src.get("accountId")),
                trimToNull(src.get("sandboxId")),
                trimToNull(src.get("catalogItemId")),
                trimToNull(src.get("platform"))
        );
    }

    /**
     * Missing or malformed fields. Empty when shape is usable for an
     * outbound Epic call (official sandbox/item allowlist is separate).
     *
     * @param resolvedPlatform platform after defaulting blank → {@code EPIC}
     */
    public Optional<String> invalidReason(String resolvedPlatform) {
        if (accountId == null || sandboxId == null || catalogItemId == null) {
            return Optional.of("accountId, sandboxId, and catalogItemId are required");
        }
        Optional<String> accountErr = VerifyFieldBounds.reject(
                "accountId", accountId, VerifyFieldBounds.EPIC_ACCOUNT_ID_MAX,
                VerifyFieldBounds.EPIC_ACCOUNT_ID,
                "accountId must be a 32-character Epic Account ID");
        if (accountErr.isPresent()) {
            return accountErr;
        }
        Optional<String> sandboxErr = VerifyFieldBounds.reject(
                "sandboxId", sandboxId, VerifyFieldBounds.EPIC_CATALOG_TOKEN_MAX,
                VerifyFieldBounds.EPIC_CATALOG_TOKEN,
                "sandboxId is not a valid Epic sandbox id");
        if (sandboxErr.isPresent()) {
            return sandboxErr;
        }
        Optional<String> catalogErr = VerifyFieldBounds.reject(
                "catalogItemId", catalogItemId, VerifyFieldBounds.EPIC_CATALOG_TOKEN_MAX,
                VerifyFieldBounds.EPIC_CATALOG_TOKEN,
                "catalogItemId is not a valid Epic catalog item id");
        if (catalogErr.isPresent()) {
            return catalogErr;
        }
        return VerifyFieldBounds.reject(
                "platform", resolvedPlatform, VerifyFieldBounds.EPIC_PLATFORM_MAX,
                VerifyFieldBounds.EPIC_PLATFORM,
                "platform must be a letter-only Epic platform code (default EPIC)");
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
