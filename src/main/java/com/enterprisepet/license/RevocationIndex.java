package com.enterprisepet.license;

import java.time.Duration;

/**
 * Shared deny-list of revoked license {@code jti}s.
 *
 * <p>Postgres {@code IssuedLicense.revokedAt} is the ledger. This index is a
 * fast replica-wide hint so a validate that has not yet seen the row (read
 * replica lag, stale persistence context) still rejects. It is not a second
 * source of truth: revoke always writes Postgres first, then this index.
 */
public interface RevocationIndex {

    /**
     * Record that {@code jti} is revoked. {@code ttl} should be at least the
     * remaining license lifetime (plus a small clock-skew buffer). After expiry
     * {@link LicenseService#validate} already rejects, so the key can vanish.
     *
     * @throws RevocationIndexUnavailableException if the store cannot be reached
     */
    void deny(String jti, Duration ttl);

    /**
     * {@code true} when this {@code jti} is on the shared deny-list.
     *
     * @throws RevocationIndexUnavailableException if the store cannot be reached
     */
    boolean isDenied(String jti);
}
