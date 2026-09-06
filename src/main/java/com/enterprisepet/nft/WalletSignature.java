package com.enterprisepet.nft;

import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Optional;

/**
 * Recovers the signer of an Ethereum {@code personal_sign} payload.
 *
 * <p>Used so {@code POST /api/verify/nft} cannot be called with someone else's
 * wallet address unless the caller proves they hold the private key.
 */
public final class WalletSignature {

    private WalletSignature() {}

    /**
     * @param message        the exact UTF-8 string that was signed
     * @param signatureHex   65-byte {@code 0x}-prefixed r∥s∥v signature
     * @return lowercase {@code 0x} address of the signer, or empty on any parse/crypto failure
     */
    public static Optional<String> recoverAddress(String message, String signatureHex) {
        if (message == null || message.isBlank() || signatureHex == null || signatureHex.isBlank()) {
            return Optional.empty();
        }
        try {
            byte[] sig = Numeric.hexStringToByteArray(signatureHex.trim());
            if (sig.length != 65) {
                return Optional.empty();
            }
            byte[] r = Arrays.copyOfRange(sig, 0, 32);
            byte[] s = Arrays.copyOfRange(sig, 32, 64);
            byte v = sig[64];
            if (v < 27) {
                v += 27;
            }
            Sign.SignatureData data = new Sign.SignatureData(v, r, s);
            BigInteger pub = Sign.signedPrefixedMessageToKey(
                    message.getBytes(StandardCharsets.UTF_8), data);
            return Optional.of("0x" + Keys.getAddress(pub));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
