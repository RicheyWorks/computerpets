package com.enterprisepet.provider;

import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Fail-closed length and charset gates for ownership verify fields.
 *
 * <p>Values that fail are rejected outright — never truncated into a shape
 * that could still leave on a RestClient call. Patterns encode the allowed
 * charset; {@code maxLen} is checked first so the 400 copy can say "too long"
 * honestly.
 */
public final class VerifyFieldBounds {

    private VerifyFieldBounds() {}

    /** SteamID64 is a decimal uint64; keep a small pad above 17 digits. */
    public static final int STEAM_ID_MAX = 20;
    public static final Pattern STEAM_ID = Pattern.compile("\\d{1," + STEAM_ID_MAX + "}");

    public static final int STEAM_APP_ID_MAX = 10;
    public static final Pattern STEAM_APP_ID = Pattern.compile("\\d{1," + STEAM_APP_ID_MAX + "}");

    public static final int ITCH_GAME_ID_MAX = 18;
    public static final Pattern ITCH_GAME_ID = Pattern.compile("\\d{1," + ITCH_GAME_ID_MAX + "}");

    /** itch.io download-key receipts are short opaque tokens (letters/digits/._-). */
    public static final int ITCH_DOWNLOAD_KEY_MAX = 128;
    public static final Pattern ITCH_DOWNLOAD_KEY =
            Pattern.compile("[A-Za-z0-9._-]{8," + ITCH_DOWNLOAD_KEY_MAX + "}");

    /** Epic Account IDs in the public Auth docs are 32-char hex. */
    public static final int EPIC_ACCOUNT_ID_MAX = 32;
    public static final Pattern EPIC_ACCOUNT_ID =
            Pattern.compile("[0-9a-fA-F]{" + EPIC_ACCOUNT_ID_MAX + "}");

    public static final int EPIC_CATALOG_TOKEN_MAX = 64;
    public static final Pattern EPIC_CATALOG_TOKEN =
            Pattern.compile("[A-Za-z0-9._-]{1," + EPIC_CATALOG_TOKEN_MAX + "}");

    public static final int EPIC_PLATFORM_MAX = 16;
    public static final Pattern EPIC_PLATFORM =
            Pattern.compile("[A-Za-z]{2," + EPIC_PLATFORM_MAX + "}");

    /** XSTS / Bearer tokens can be multi-kilobyte JWTs; cap before Authorization. */
    public static final int MS_XSTS_TOKEN_MAX = 8192;
    public static final Pattern MS_XSTS_TOKEN =
            Pattern.compile("[\\x21-\\x7E]{1," + MS_XSTS_TOKEN_MAX + "}");

    public static final int MS_STORE_PRODUCT_ID_MAX = 64;
    public static final Pattern MS_STORE_PRODUCT_ID =
            Pattern.compile("[A-Za-z0-9._-]{1," + MS_STORE_PRODUCT_ID_MAX + "}");

    public static final int MS_USER_HASH_MAX = 32;
    public static final Pattern MS_USER_HASH =
            Pattern.compile("[0-9]{1," + MS_USER_HASH_MAX + "}");

    public static final int MS_ACCOUNT_ID_MAX = 64;
    public static final Pattern MS_ACCOUNT_ID =
            Pattern.compile("[A-Za-z0-9-]{1," + MS_ACCOUNT_ID_MAX + "}");

    public static final int MS_SIGNATURE_MAX = 4096;
    public static final Pattern MS_SIGNATURE =
            Pattern.compile("[A-Za-z0-9+/=_-]{1," + MS_SIGNATURE_MAX + "}");

    public static final int MS_USER_STORE_ID_MAX = 2048;
    public static final Pattern MS_USER_STORE_ID =
            Pattern.compile("[\\x21-\\x7E]{1," + MS_USER_STORE_ID_MAX + "}");

    public static final int MS_SKU_ID_MAX = 64;
    public static final Pattern MS_SKU_ID =
            Pattern.compile("[A-Za-z0-9._-]{1," + MS_SKU_ID_MAX + "}");

    public static final int NFT_MESSAGE_MAX = 512;
    public static final Pattern NFT_MESSAGE =
            Pattern.compile("[\\x20-\\x7E]{1," + NFT_MESSAGE_MAX + "}");

    /** {@code personal_sign} recovery expects a 65-byte hex signature (optional 0x). */
    public static final int NFT_SIGNATURE_MAX = 132;
    public static final Pattern NFT_SIGNATURE =
            Pattern.compile("(?:0x)?[0-9a-fA-F]{130}");

    /**
     * Rejects a present value that exceeds {@code maxLen} or fails {@code charset}.
     * {@code null} is skipped — callers still enforce required fields.
     */
    public static Optional<String> reject(String field, String value, int maxLen,
                                          Pattern charset, String charsetHint) {
        if (value == null) {
            return Optional.empty();
        }
        if (value.length() > maxLen) {
            return Optional.of(field + " too long");
        }
        if (!charset.matcher(value).matches()) {
            return Optional.of(charsetHint);
        }
        return Optional.empty();
    }
}
