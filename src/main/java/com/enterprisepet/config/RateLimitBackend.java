package com.enterprisepet.config;

import java.time.Duration;

/**
 * Shared token-bucket store used by {@link RateLimitingFilter}.
 * Implementations must be safe for concurrent use from multiple app instances
 * when backed by Redis.
 */
@FunctionalInterface
public interface RateLimitBackend {

    /**
     * Consume one token from the named bucket.
     *
     * @throws RateLimitStoreException if the backing store cannot be reached
     */
    Probe tryConsume(String bucketKey, long capacity, Duration period);

    record Probe(boolean consumed, long remainingTokens, long nanosToWaitForRefill) {
        static Probe allowed(long remainingTokens) {
            return new Probe(true, remainingTokens, 0);
        }

        static Probe denied(long nanosToWaitForRefill) {
            return new Probe(false, 0, nanosToWaitForRefill);
        }
    }
}
