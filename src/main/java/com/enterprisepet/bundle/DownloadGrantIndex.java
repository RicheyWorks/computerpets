package com.enterprisepet.bundle;

import java.time.Duration;

/**
 * Shared one-time download grants keyed by license {@code jti} + signed {@code exp}.
 *
 * <p>Postgres is not the ledger for these short-lived grants. Redis (or process
 * memory for tests) holds an open grant until redeem or TTL. A second redeem of
 * the same grant denies; the house does not silently re-open that grant.
 */
public interface DownloadGrantIndex {

    /**
     * Register an open grant. {@code boundIp} may be blank when the issuer had
     * no address; blank skips IP match on redeem.
     *
     * @throws DownloadGrantUnavailableException if the store cannot be reached
     */
    void issue(String jti, long expEpochSeconds, String boundIp, Duration ttl);

    /**
     * Atomically consume an open grant. Does not invent a new grant.
     *
     * @throws DownloadGrantUnavailableException if the store cannot be reached
     */
    RedeemResult tryRedeem(String jti, long expEpochSeconds, String requestIp);

    enum RedeemResult {
        /** First successful redeem. */
        OK,
        /** This {@code jti}+{@code exp} was already redeemed. */
        ALREADY_USED,
        /** No open grant (never issued, expired TTL, or unknown). */
        UNKNOWN,
        /** Bound address does not match the redeem request. */
        ADDRESS_MISMATCH
    }
}
