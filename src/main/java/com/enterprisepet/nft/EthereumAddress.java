package com.enterprisepet.nft;

import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Validates and normalizes Ethereum addresses for ownership checks.
 *
 * <p>Accepts any 20-byte hex address with a {@code 0x} prefix. Comparison is
 * case-insensitive so EIP-55 checksummed and lowercase forms match. The
 * historic {@code substring(2)} / {@code contains} check is intentionally
 * not used — a wallet of {@code "0x"} used to match every ABI response.
 */
public final class EthereumAddress {

    private static final Pattern HEX = Pattern.compile("^0x[0-9a-fA-F]{40}$");

    private EthereumAddress() {}

    /**
     * @return lowercase {@code 0x}-prefixed address, or empty if the input is
     *         not a well-formed 20-byte hex address
     */
    public static Optional<String> normalize(String raw) {
        if (raw == null) {
            return Optional.empty();
        }
        String trimmed = raw.trim();
        if (trimmed.length() == 42 && (trimmed.startsWith("0X") || trimmed.startsWith("0x"))) {
            trimmed = "0x" + trimmed.substring(2);
        }
        if (!HEX.matcher(trimmed).matches()) {
            return Optional.empty();
        }
        return Optional.of(trimmed.toLowerCase(Locale.ROOT));
    }

    public static boolean equalsNormalized(String left, String right) {
        Optional<String> a = normalize(left);
        Optional<String> b = normalize(right);
        return a.isPresent() && a.equals(b);
    }
}
