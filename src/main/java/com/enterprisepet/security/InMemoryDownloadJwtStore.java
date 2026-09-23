package com.enterprisepet.security;

import java.time.Clock;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Process-local single-use download JWTs. Used when
 * {@code rate-limit.backend=memory} (tests / a single local process).
 * Not shared across app replicas.
 */
public class InMemoryDownloadJwtStore implements DownloadJwtStore {

    private final Clock clock;
    private final ConcurrentHashMap<String, Instant> until = new ConcurrentHashMap<>();

    public InMemoryDownloadJwtStore() {
        this(Clock.systemUTC());
    }

    public InMemoryDownloadJwtStore(Clock clock) {
        this.clock = clock;
    }

    @Override
    public Claim claim(String jti, long ttlSeconds) {
        String key = DownloadJwtStore.redisKey(jti);
        if (ttlSeconds <= 0) {
            throw new IllegalArgumentException("download token ttl must be positive");
        }
        Instant now = clock.instant();
        Instant expiry = now.plusSeconds(ttlSeconds);
        AtomicBoolean fresh = new AtomicBoolean(false);
        until.compute(key, (ignored, existing) -> {
            if (existing == null || !existing.isAfter(now)) {
                fresh.set(true);
                return expiry;
            }
            fresh.set(false);
            return existing;
        });
        return fresh.get() ? Claim.FRESH : Claim.REPLAY;
    }
}
