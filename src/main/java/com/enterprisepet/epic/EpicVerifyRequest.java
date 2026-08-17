package com.enterprisepet.epic;

import java.util.Map;

/**
 * Typed Epic Games Store verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what {@link EpicService} already reads. Optional
 * {@code platform} defaults to {@code EPIC} when omitted. No invented
 * sandbox or catalog item id.
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

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
