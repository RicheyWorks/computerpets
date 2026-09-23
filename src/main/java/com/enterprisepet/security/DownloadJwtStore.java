package com.enterprisepet.security;

import java.util.regex.Pattern;

/**
 * Single-use claim for a download JWT {@code jti}.
 *
 * <p>The same Redis as the rate limiter, the jti deny-list, download grants,
 * and signed-request nonces when {@code rate-limit.backend=redis}. Process
 * memory when that backend is {@code memory}. Not {@code replay:nonce:*}
 * and not {@code download:grant:{jti}:{exp}} — those keys stay as they are.
 * See ADR 0073.
 */
public interface DownloadJwtStore {

    String KEY_PREFIX = "download:jwt:";

    /**
     * Extra seconds beyond {@code jwt.ttl-minutes} so a replica clock that
     * is slightly behind cannot accept the bearer after this key expires.
     */
    int SKEW_SECONDS = 60;

    Pattern JTI = Pattern.compile(
            "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");

    enum Claim {
        /** First successful mint for this download token. */
        FRESH,
        /** This {@code jti} was already claimed. */
        REPLAY
    }

    /**
     * Atomically claim {@code jti} for {@code ttlSeconds}.
     *
     * @throws DownloadJwtStoreUnavailableException when the store cannot be reached
     * @throws IllegalArgumentException when {@code jti} is not a store key or the TTL is not positive
     */
    Claim claim(String jti, long ttlSeconds);

    static boolean isJti(String jti) {
        return jti != null && JTI.matcher(jti).matches();
    }

    static String redisKey(String jti) {
        if (!isJti(jti)) {
            throw new IllegalArgumentException("jti is not a download token key");
        }
        return KEY_PREFIX + jti;
    }
}
