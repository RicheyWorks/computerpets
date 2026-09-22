package com.enterprisepet.nft;

import com.enterprisepet.provider.VerifyFieldBounds;

import java.util.Map;
import java.util.Optional;

/**
 * Typed Ethereum NFT verify payload, parsed from the generic
 * {@code Map<String, String>} SPI body.
 *
 * <p>Fields match what {@link EthereumNftService} already reads
 * (wallet, collection, token, optional {@code personal_sign} proof,
 * and {@code petType} for token bindings). No invented collection
 * address. Length and charset on message/signature are fail-closed —
 * address and tokenId shape stay on {@link EthereumAddress} /
 * {@link EthereumNftService#parseTokenId}.
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

    /**
     * Malformed message / signature length or charset. Address and token
     * shape are checked separately. Empty when those optional fields are
     * absent or usable for {@code personal_sign} recovery.
     */
    public Optional<String> invalidProofReason() {
        Optional<String> messageErr = VerifyFieldBounds.reject(
                "message", message, VerifyFieldBounds.NFT_MESSAGE_MAX,
                VerifyFieldBounds.NFT_MESSAGE,
                "message must be printable ASCII (max " + VerifyFieldBounds.NFT_MESSAGE_MAX + ")");
        if (messageErr.isPresent()) {
            return messageErr;
        }
        return VerifyFieldBounds.reject(
                "signature", signature, VerifyFieldBounds.NFT_SIGNATURE_MAX,
                VerifyFieldBounds.NFT_SIGNATURE,
                "signature must be a 65-byte hex personal_sign (optional 0x)");
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
