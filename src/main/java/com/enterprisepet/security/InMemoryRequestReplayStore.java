package com.enterprisepet.security;

import java.time.Clock;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Process-local single-use nonces. Used when {@code rate-limit.backend=memory}
 * (tests / a single local process). Not shared across app replicas.
 */
public class InMemoryRequestReplayStore implements RequestReplayStore {

    private final Clock clock;
    private final ConcurrentHashMap<String, Instant> until = new ConcurrentHashMap<>();

    public InMemoryRequestReplayStore() {
        this(Clock.systemUTC());
    }

    public InMemoryRequestReplayStore(Clock clock) {
        this.clock = clock;
    }

    @Override
    public Claim claim(String surface, String nonce) {
        String key = RequestReplayStore.redisKey(surface, nonce);
        Instant now = clock.instant();
        Instant expiry = now.plusSeconds(TTL_SECONDS);
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
