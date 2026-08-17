package com.enterprisepet.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Single-process Bucket4j store. Used only when {@code rate-limit.backend=memory}
 * (tests / explicit local opt-out). Not a Redis failover path.
 */
public class InMemoryRateLimitBackend implements RateLimitBackend {

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public Probe tryConsume(String bucketKey, long capacity, Duration period) {
        Bucket bucket = buckets.computeIfAbsent(bucketKey, k -> Bucket.builder()
            .addLimit(Bandwidth.classic(capacity, Refill.intervally(capacity, period)))
            .build());
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        return new Probe(probe.isConsumed(), probe.getRemainingTokens(), probe.getNanosToWaitForRefill());
    }
}
