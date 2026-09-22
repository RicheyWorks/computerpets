package com.enterprisepet.security;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * Client-chosen single-use nonce for a signed admin or machine request.
 *
 * <p>The value is part of the HMAC canonical string. Charset is URL-safe and
 * excludes newlines so it cannot shift the following body hash. Length is
 * bounded so the Redis key stays small. A UUID or 16 random bytes in Base64
 * URL form both fit.
 */
public final class RequestNonce {

    public static final String HEADER = "X-ComputerPets-Nonce";
    public static final int MIN_LENGTH = 16;
    public static final int MAX_LENGTH = 128;

    private static final SecureRandom RANDOM = new SecureRandom();

    private RequestNonce() {}

    public enum Shape {
        OK,
        MISSING,
        INVALID
    }

    public static Shape shape(String nonce) {
        if (nonce == null || nonce.isBlank()) {
            return Shape.MISSING;
        }
        if (nonce.length() < MIN_LENGTH || nonce.length() > MAX_LENGTH) {
            return Shape.INVALID;
        }
        for (int i = 0; i < nonce.length(); i++) {
            char c = nonce.charAt(i);
            boolean ok = (c >= 'A' && c <= 'Z')
                    || (c >= 'a' && c <= 'z')
                    || (c >= '0' && c <= '9')
                    || c == '_'
                    || c == '-';
            if (!ok) {
                return Shape.INVALID;
            }
        }
        return Shape.OK;
    }

    /** 16 random bytes, Base64 URL, no padding (22 characters). */
    public static String random() {
        byte[] buf = new byte[16];
        RANDOM.nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }
}
