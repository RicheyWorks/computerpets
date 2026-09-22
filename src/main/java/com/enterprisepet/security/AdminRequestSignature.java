package com.enterprisepet.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * HMAC-SHA256 over an operator request to {@code /api/admin}.
 *
 * <p>The key is the configured {@code ADMIN_API_KEY} string (UTF-8). It is
 * not sent as a header. During a rotation window the previous admin key is
 * accepted too (ADR 0065). The canonical version is not the machine-verify
 * MAC ({@code computerpets-machine-v1}) and not a bundle-URL MAC.
 */
public final class AdminRequestSignature {

    public static final String TIMESTAMP_HEADER = "X-ComputerPets-Timestamp";
    public static final String SIGNATURE_HEADER = "X-ComputerPets-Signature";
    /** Single-use nonce. Same header the machine door uses; the MAC version differs. */
    public static final String NONCE_HEADER = RequestNonce.HEADER;
    /** Accept timestamps this many seconds either side of the house clock. */
    public static final int SKEW_SECONDS = 300;
    public static final String VERSION = "computerpets-admin-v1";

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private AdminRequestSignature() {}

    public enum Decision {
        OK,
        /** Header missing, blank, or not unix seconds. */
        MISSING,
        /** Outside {@link #SKEW_SECONDS}. */
        SKEW,
        /** MAC did not match the current or previous admin key. */
        INVALID,
        /** Nonce header missing or blank. */
        NONCE_MISSING,
        /** Nonce charset or length refused. */
        NONCE_INVALID
    }

    public static String sign(String key, String method, String path, String query,
                              String timestamp, String nonce, byte[] body) {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("admin signing key is blank");
        }
        if (RequestNonce.shape(nonce) != RequestNonce.Shape.OK) {
            throw new IllegalArgumentException("admin nonce is not 16-128 chars of [A-Za-z0-9_-]");
        }
        return mac(key, canonical(method, path, query, timestamp, nonce, body));
    }

    /**
     * Fail closed. A blank current key never matches. A blank previous key is
     * skipped. Comparison is constant-time on the signature text.
     */
    public static Decision verify(String currentKey, String previousKey,
                                  String method, String path, String query,
                                  String timestamp, String nonce, String signature, byte[] body,
                                  long nowEpochSeconds) {
        if (timestamp == null || timestamp.isBlank() || signature == null || signature.isBlank()) {
            return Decision.MISSING;
        }
        RequestNonce.Shape nonceShape = RequestNonce.shape(nonce);
        if (nonceShape == RequestNonce.Shape.MISSING) {
            return Decision.NONCE_MISSING;
        }
        if (nonceShape == RequestNonce.Shape.INVALID) {
            return Decision.NONCE_INVALID;
        }
        Long ts = parseEpochSeconds(timestamp);
        if (ts == null) {
            return Decision.MISSING;
        }
        long delta = nowEpochSeconds - ts;
        if (delta > SKEW_SECONDS || delta < -SKEW_SECONDS) {
            return Decision.SKEW;
        }
        if (currentKey == null || currentKey.isBlank()) {
            return Decision.INVALID;
        }
        String message = canonical(method, path, query, timestamp.trim(), nonce, body);
        if (constantTimeEquals(mac(currentKey, message), signature.trim())) {
            return Decision.OK;
        }
        if (previousKey != null && !previousKey.isBlank()
                && constantTimeEquals(mac(previousKey, message), signature.trim())) {
            return Decision.OK;
        }
        return Decision.INVALID;
    }

    static String canonical(String method, String path, String query, String timestamp,
                            String nonce, byte[] body) {
        String verb = method == null ? "" : method.toUpperCase(Locale.ROOT);
        String p = path == null ? "" : path;
        String q = query == null ? "" : query;
        String ts = timestamp == null ? "" : timestamp;
        String n = nonce == null ? "" : nonce;
        byte[] bytes = body == null ? new byte[0] : body;
        return VERSION + "\n"
                + verb + "\n"
                + p + "\n"
                + q + "\n"
                + ts + "\n"
                + n + "\n"
                + HexFormat.of().formatHex(sha256(bytes));
    }

    private static Long parseEpochSeconds(String timestamp) {
        String trimmed = timestamp.trim();
        if (trimmed.isEmpty() || trimmed.length() > 20) {
            return null;
        }
        for (int i = 0; i < trimmed.length(); i++) {
            char c = trimmed.charAt(i);
            if (c < '0' || c > '9') {
                return null;
            }
        }
        try {
            return Long.parseLong(trimmed);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static byte[] sha256(byte[] body) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(body);
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }

    private static String mac(String key, String message) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
            byte[] raw = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
        } catch (Exception e) {
            throw new IllegalStateException("HMAC-SHA256 unavailable", e);
        }
    }

    static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        byte[] left = a.getBytes(StandardCharsets.UTF_8);
        byte[] right = b.getBytes(StandardCharsets.UTF_8);
        int len = Math.max(left.length, right.length);
        int diff = left.length ^ right.length;
        for (int i = 0; i < len; i++) {
            byte lb = i < left.length ? left[i] : 0;
            byte rb = i < right.length ? right[i] : 0;
            diff |= lb ^ rb;
        }
        return diff == 0;
    }
}
