package com.enterprisepet.security;

/**
 * Single-use nonce store for signed admin and machine requests.
 *
 * <p>The same Redis as the rate limiter, the jti deny-list, and download
 * grants when {@code rate-limit.backend=redis}. Process memory when that
 * backend is {@code memory}. TTL matches the 300 second signature skew so a
 * nonce cannot be reused while the captured timestamp would still verify.
 */
public interface RequestReplayStore {

    String SURFACE_ADMIN = "admin";
    String SURFACE_MACHINE = "machine";

    /** Aligned with {@link AdminRequestSignature#SKEW_SECONDS} and {@link MachineRequestSignature#SKEW_SECONDS}. */
    int TTL_SECONDS = 300;

    String KEY_PREFIX = "replay:nonce:";

    enum Claim {
        /** First use inside the TTL. */
        FRESH,
        /** This surface already claimed this nonce. */
        REPLAY
    }

    /**
     * Atomically claim {@code nonce} for {@code surface}.
     *
     * @throws RequestReplayStoreUnavailableException when the store cannot be reached
     * @throws IllegalArgumentException when the surface or nonce is not a store key
     */
    Claim claim(String surface, String nonce);

    static String redisKey(String surface, String nonce) {
        if (!SURFACE_ADMIN.equals(surface) && !SURFACE_MACHINE.equals(surface)) {
            throw new IllegalArgumentException("unknown replay surface");
        }
        if (RequestNonce.shape(nonce) != RequestNonce.Shape.OK) {
            throw new IllegalArgumentException("nonce is not a replay key");
        }
        return KEY_PREFIX + surface + ":" + nonce;
    }
}
