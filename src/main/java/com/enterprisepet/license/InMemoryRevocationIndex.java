package com.enterprisepet.license;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Process-local deny-list. Used when {@code rate-limit.backend=memory}
 * (tests / single local process). Not shared across app replicas.
 */
public class InMemoryRevocationIndex implements RevocationIndex {

    private final ConcurrentHashMap<String, Instant> until = new ConcurrentHashMap<>();

    @Override
    public void deny(String jti, Duration ttl) {
        if (jti == null || jti.isBlank()) {
            return;
        }
        Duration effective = ttl == null || ttl.isNegative() || ttl.isZero()
            ? Duration.ofHours(1)
            : ttl;
        until.put(jti, Instant.now().plus(effective));
    }

    @Override
    public boolean isDenied(String jti) {
        if (jti == null || jti.isBlank()) {
            return false;
        }
        Instant expires = until.get(jti);
        if (expires == null) {
            return false;
        }
        if (expires.isBefore(Instant.now())) {
            until.remove(jti, expires);
            return false;
        }
        return true;
    }
}
