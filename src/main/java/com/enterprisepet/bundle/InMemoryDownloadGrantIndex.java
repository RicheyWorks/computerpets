package com.enterprisepet.bundle;

import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Process-local download grants. Used when {@code rate-limit.backend=memory}
 * (tests / single local process). Not shared across app replicas.
 */
public class InMemoryDownloadGrantIndex implements DownloadGrantIndex {

    private final ConcurrentHashMap<String, Entry> entries = new ConcurrentHashMap<>();

    @Override
    public void issue(String jti, long expEpochSeconds, String boundIp, Duration ttl) {
        if (jti == null || jti.isBlank() || expEpochSeconds <= 0) {
            return;
        }
        Duration effective = ttl == null || ttl.isNegative() || ttl.isZero()
            ? Duration.ofMinutes(15)
            : ttl;
        String key = key(jti, expEpochSeconds);
        entries.put(key, new Entry(
            boundIp == null ? "" : boundIp.trim(),
            false,
            Instant.now().plus(effective)
        ));
    }

    @Override
    public RedeemResult tryRedeem(String jti, long expEpochSeconds, String requestIp) {
        if (jti == null || jti.isBlank() || expEpochSeconds <= 0) {
            return RedeemResult.UNKNOWN;
        }
        String key = key(jti, expEpochSeconds);
        synchronized (entries) {
            Entry entry = entries.get(key);
            if (entry == null) {
                return RedeemResult.UNKNOWN;
            }
            if (entry.expiresAt.isBefore(Instant.now())) {
                entries.remove(key, entry);
                return RedeemResult.UNKNOWN;
            }
            if (entry.used) {
                return RedeemResult.ALREADY_USED;
            }
            String bound = entry.boundIp;
            String req = requestIp == null ? "" : requestIp.trim();
            if (!bound.isEmpty() && !req.isEmpty() && !Objects.equals(bound, req)) {
                return RedeemResult.ADDRESS_MISMATCH;
            }
            entries.put(key, new Entry(bound, true, entry.expiresAt));
            return RedeemResult.OK;
        }
    }

    static String key(String jti, long expEpochSeconds) {
        return jti + "|" + expEpochSeconds;
    }

    private record Entry(String boundIp, boolean used, Instant expiresAt) {}
}
