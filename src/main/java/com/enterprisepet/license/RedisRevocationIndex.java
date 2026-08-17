package com.enterprisepet.license;

import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

import java.time.Duration;

/**
 * Redis SETEX deny-list shared by every app replica that points at the same
 * store as the rate limiter. Keys are {@code revoked:jti:{jti}}.
 *
 * <p>The connection is opened on first use so a down Redis does not block
 * process start. Callers decide how to handle {@link RevocationIndexUnavailableException}.
 */
public class RedisRevocationIndex implements RevocationIndex, AutoCloseable {

    static final String KEY_PREFIX = "revoked:jti:";

    private final RedisClient redisClient;
    private final Object lock = new Object();
    private volatile StatefulRedisConnection<String, String> connection;

    public RedisRevocationIndex(RedisClient redisClient) {
        this.redisClient = redisClient;
    }

    @Override
    public void deny(String jti, Duration ttl) {
        if (jti == null || jti.isBlank()) {
            return;
        }
        long seconds = ttlSeconds(ttl);
        try {
            commands().setex(KEY_PREFIX + jti, seconds, "1");
        } catch (RevocationIndexUnavailableException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RevocationIndexUnavailableException("Redis revocation index unavailable", e);
        }
    }

    @Override
    public boolean isDenied(String jti) {
        if (jti == null || jti.isBlank()) {
            return false;
        }
        try {
            return commands().get(KEY_PREFIX + jti) != null;
        } catch (RevocationIndexUnavailableException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RevocationIndexUnavailableException("Redis revocation index unavailable", e);
        }
    }

    private RedisCommands<String, String> commands() {
        StatefulRedisConnection<String, String> existing = this.connection;
        if (existing != null && existing.isOpen()) {
            return existing.sync();
        }
        synchronized (lock) {
            if (connection == null || !connection.isOpen()) {
                try {
                    connection = redisClient.connect();
                } catch (RuntimeException e) {
                    throw new RevocationIndexUnavailableException("Redis revocation index unavailable", e);
                }
            }
            return connection.sync();
        }
    }

    static long ttlSeconds(Duration ttl) {
        if (ttl == null || ttl.isNegative() || ttl.isZero()) {
            return Duration.ofHours(1).toSeconds();
        }
        return Math.max(60L, ttl.toSeconds());
    }

    @Override
    public void close() {
        synchronized (lock) {
            if (connection != null && connection.isOpen()) {
                connection.close();
            }
            connection = null;
        }
    }
}
