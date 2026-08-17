package com.enterprisepet.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.codec.ByteArrayCodec;
import io.lettuce.core.codec.RedisCodec;
import io.lettuce.core.codec.StringCodec;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Bucket4j token buckets stored in Redis via Lettuce compare-and-set.
 * Two app instances that share this Redis share the same per-IP verify/download limits.
 *
 * <p>The Redis connection is opened on first consume so a down store does not
 * prevent process startup; the filter then fail-closes with 503.
 */
public class RedisRateLimitBackend implements RateLimitBackend, AutoCloseable {

    static final String KEY_PREFIX = "rl:";

    private final RedisClient redisClient;
    private final Object lock = new Object();
    private final ConcurrentHashMap<String, Bucket> proxies = new ConcurrentHashMap<>();

    private volatile StatefulRedisConnection<String, byte[]> connection;
    private volatile ProxyManager<String> proxyManager;

    public RedisRateLimitBackend(RedisClient redisClient) {
        this.redisClient = redisClient;
    }

    @Override
    public Probe tryConsume(String bucketKey, long capacity, Duration period) {
        String redisKey = KEY_PREFIX + bucketKey;
        try {
            ProxyManager<String> manager = proxyManager();
            Bucket bucket = proxies.computeIfAbsent(redisKey, k ->
                manager.builder().build(k, () -> BucketConfiguration.builder()
                    .addLimit(Bandwidth.classic(capacity, Refill.intervally(capacity, period)))
                    .build()));
            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
            return new Probe(probe.isConsumed(), probe.getRemainingTokens(), probe.getNanosToWaitForRefill());
        } catch (RateLimitStoreException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RateLimitStoreException("Redis rate limiter unavailable", e);
        }
    }

    private ProxyManager<String> proxyManager() {
        ProxyManager<String> existing = this.proxyManager;
        if (existing != null) {
            return existing;
        }
        synchronized (lock) {
            if (proxyManager == null) {
                try {
                    connection = redisClient.connect(RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE));
                    proxyManager = LettuceBasedProxyManager.builderFor(connection)
                        .withExpirationStrategy(
                            ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(Duration.ofMinutes(2)))
                        .build();
                } catch (RuntimeException e) {
                    throw new RateLimitStoreException("Redis rate limiter unavailable", e);
                }
            }
            return proxyManager;
        }
    }

    @Override
    public void close() {
        synchronized (lock) {
            proxies.clear();
            proxyManager = null;
            if (connection != null && connection.isOpen()) {
                connection.close();
            }
            connection = null;
        }
    }
}
