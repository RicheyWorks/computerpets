package com.enterprisepet.security;

import io.lettuce.core.RedisClient;
import io.lettuce.core.SetArgs;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

/**
 * Redis {@code SET download:jwt:{jti} 1 NX EX ttl} shared by every app replica
 * that points at the same store as the rate limiter.
 *
 * <p>The connection is opened on first use so a down Redis does not block
 * process start. A failed command fails closed.
 */
public class RedisDownloadJwtStore implements DownloadJwtStore, AutoCloseable {

    private final RedisClient redisClient;
    private final Object lock = new Object();
    private volatile StatefulRedisConnection<String, String> connection;

    public RedisDownloadJwtStore(RedisClient redisClient) {
        this.redisClient = redisClient;
    }

    @Override
    public Claim claim(String jti, long ttlSeconds) {
        String key = DownloadJwtStore.redisKey(jti);
        if (ttlSeconds <= 0) {
            throw new IllegalArgumentException("download token ttl must be positive");
        }
        try {
            String result = commands().set(key, "1", SetArgs.Builder.nx().ex(ttlSeconds));
            if (result == null) {
                return Claim.REPLAY;
            }
            if ("OK".equalsIgnoreCase(result)) {
                return Claim.FRESH;
            }
            throw new DownloadJwtStoreUnavailableException(
                    "Redis download token store returned an unexpected reply", null);
        } catch (DownloadJwtStoreUnavailableException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new DownloadJwtStoreUnavailableException("Redis download token store unavailable", e);
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
                    throw new DownloadJwtStoreUnavailableException("Redis download token store unavailable", e);
                }
            }
            return connection.sync();
        }
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
