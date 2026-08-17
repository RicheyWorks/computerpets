package com.enterprisepet.microsoft;

import java.util.Map;

/**
 * Typed Microsoft Store verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what the client already sends (plus optional X-token
 * {@code signature} and User Store ID / SKU). No extra invented keys.
 */
public record MicrosoftVerifyRequest(
        String xstsToken,
        String storeProductId,
        String userHash,
        String microsoftAccountId,
        String signature,
        String userStoreId,
        String skuId
) {

    public static MicrosoftVerifyRequest from(Map<String, String> request) {
        Map<String, String> src = request == null ? Map.of() : request;
        return new MicrosoftVerifyRequest(
                trimToNull(src.get("xstsToken")),
                trimToNull(src.get("storeProductId")),
                trimToNull(src.get("userHash")),
                trimToNull(src.get("microsoftAccountId")),
                trimToNull(src.get("signature")),
                firstNonBlank(src.get("userStoreId"), src.get("identityValue")),
                trimToNull(src.get("skuId"))
        );
    }

    boolean hasUserStoreIdentity() {
        return userStoreId != null && !userStoreId.isBlank();
    }

    boolean hasSignature() {
        return signature != null && !signature.isBlank();
    }

    boolean hasSkuId() {
        return skuId != null && !skuId.isBlank();
    }

    private static String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            String trimmed = trimToNull(value);
            if (trimmed != null) {
                return trimmed;
            }
        }
        return null;
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
