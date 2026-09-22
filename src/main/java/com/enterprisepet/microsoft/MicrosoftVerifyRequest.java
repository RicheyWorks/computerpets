package com.enterprisepet.microsoft;

import com.enterprisepet.provider.VerifyFieldBounds;

import java.util.Map;
import java.util.Optional;

/**
 * Typed Microsoft Store verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what the client already sends (plus optional X-token
 * {@code signature} and User Store ID / SKU). No extra invented keys.
 * Length and charset are fail-closed — never truncated into Collections
 * headers or JSON.
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

    /**
     * Missing or malformed fields. Empty when shape is usable for an
     * outbound Collections call (house-door allowlist is separate).
     */
    public Optional<String> invalidReason() {
        if (xstsToken == null || storeProductId == null) {
            return Optional.of("xstsToken and storeProductId are required");
        }
        Optional<String> tokenErr = VerifyFieldBounds.reject(
                "xstsToken", xstsToken, VerifyFieldBounds.MS_XSTS_TOKEN_MAX,
                VerifyFieldBounds.MS_XSTS_TOKEN,
                "xstsToken must be a printable ASCII Microsoft identity token");
        if (tokenErr.isPresent()) {
            return tokenErr;
        }
        Optional<String> productErr = VerifyFieldBounds.reject(
                "storeProductId", storeProductId, VerifyFieldBounds.MS_STORE_PRODUCT_ID_MAX,
                VerifyFieldBounds.MS_STORE_PRODUCT_ID,
                "storeProductId must be a Microsoft Store product id (letters, digits, ._-)");
        if (productErr.isPresent()) {
            return productErr;
        }
        Optional<String> hashErr = VerifyFieldBounds.reject(
                "userHash", userHash, VerifyFieldBounds.MS_USER_HASH_MAX,
                VerifyFieldBounds.MS_USER_HASH,
                "userHash must be a numeric Xbox user hash");
        if (hashErr.isPresent()) {
            return hashErr;
        }
        Optional<String> accountErr = VerifyFieldBounds.reject(
                "microsoftAccountId", microsoftAccountId, VerifyFieldBounds.MS_ACCOUNT_ID_MAX,
                VerifyFieldBounds.MS_ACCOUNT_ID,
                "microsoftAccountId must be an alphanumeric Microsoft account id");
        if (accountErr.isPresent()) {
            return accountErr;
        }
        Optional<String> sigErr = VerifyFieldBounds.reject(
                "signature", signature, VerifyFieldBounds.MS_SIGNATURE_MAX,
                VerifyFieldBounds.MS_SIGNATURE,
                "signature must be a base64-like Microsoft Collections signature");
        if (sigErr.isPresent()) {
            return sigErr;
        }
        Optional<String> storeIdErr = VerifyFieldBounds.reject(
                "userStoreId", userStoreId, VerifyFieldBounds.MS_USER_STORE_ID_MAX,
                VerifyFieldBounds.MS_USER_STORE_ID,
                "userStoreId must be a printable ASCII User Store ID");
        if (storeIdErr.isPresent()) {
            return storeIdErr;
        }
        return VerifyFieldBounds.reject(
                "skuId", skuId, VerifyFieldBounds.MS_SKU_ID_MAX,
                VerifyFieldBounds.MS_SKU_ID,
                "skuId must be an alphanumeric Microsoft Store SKU id");
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
