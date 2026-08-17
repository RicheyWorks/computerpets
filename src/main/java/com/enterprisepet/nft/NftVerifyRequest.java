package com.enterprisepet.nft;

import java.util.Map;

/**
 * Typed Ethereum NFT verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what {@link EthereumNftService} already reads
 * (wallet, collection, token, optional {@code personal_sign} proof,
 * and {@code petType} for token bindings). No invented collection
 * address.
 */
public record NftVerifyRequest(
        String walletAddress,
        String contractAddress,
        String tokenId,
        String message,
        String signature,
        String petType
) {

    public static NftVerifyRequest from(Map<String, String> request) {
        Map<String, String> src = request == null ? Map.of() : request;
        return new NftVerifyRequest(
                trimToNull(src.get("walletAddress")),
                trimToNull(src.get("contractAddress")),
                trimToNull(src.get("tokenId")),
                trimToNull(src.get("message")),
                trimToNull(src.get("signature")),
                trimToNull(src.get("petType"))
        );
    }

    boolean hasSignature() {
        return signature != null;
    }

    boolean hasMessage() {
        return message != null;
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
