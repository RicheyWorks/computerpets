package com.enterprisepet.security;

import io.lettuce.core.RedisClient;
import io.lettuce.core.SetArgs;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

/**
 * Redis {@code SET key 1 NX EX 300} shared by every app replica that points
 * at the same store as the rate limiter. Keys are
 * {@code replay:nonce:{admin|machine}:{nonce}}.
 *
 * <p>The connection is opened on first use so a down Redis does not block
 * process start. A failed command fails closed.
 */
public class RedisRequestReplayStore implements RequestReplayStore, AutoCloseable {

    private final RedisClient redisClient;
    private final Object lock = new Object();
    private volatile StatefulRedisConnection<String, String> connection;

    public RedisRequestReplayStore(RedisClient redisClient) {
        this.redisClient = redisClient;
    }

    @Override
    public Claim claim(String surface, String nonce) {
        String key = RequestReplayStore.redisKey(surface, nonce);
        try {
            String result = commands().set(key, "1", SetArgs.Builder.nx().ex(TTL_SECONDS));
            if (result == null) {
                return Claim.REPLAY;
            }
            if ("OK".equalsIgnoreCase(result)) {
                return Claim.FRESH;
            }
            throw new RequestReplayStoreUnavailableException(
                    "Redis nonce store returned an unexpected reply", null);
        } catch (RequestReplayStoreUnavailableException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RequestReplayStoreUnavailableException("Redis nonce store unavailable", e);
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
                    throw new RequestReplayStoreUnavailableException("Redis nonce store unavailable", e);
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
