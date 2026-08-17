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
 */
public class RedisRateLimitBackend implements RateLimitBackend, AutoCloseable {

    static final String KEY_PREFIX = "rl:";

    private final StatefulRedisConnection<String, byte[]> connection;
    private final ProxyManager<String> proxyManager;
    private final ConcurrentHashMap<String, Bucket> proxies = new ConcurrentHashMap<>();

    public RedisRateLimitBackend(RedisClient redisClient) {
        this.connection = redisClient.connect(RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE));
        this.proxyManager = LettuceBasedProxyManager.builderFor(connection)
            .withExpirationStrategy(
                ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(Duration.ofMinutes(2)))
            .build();
    }

    RedisRateLimitBackend(ProxyManager<String> proxyManager, StatefulRedisConnection<String, byte[]> connection) {
        this.proxyManager = proxyManager;
        this.connection = connection;
    }

    @Override
    public Probe tryConsume(String bucketKey, long capacity, Duration period) {
        String redisKey = KEY_PREFIX + bucketKey;
        try {
            Bucket bucket = proxies.computeIfAbsent(redisKey, k ->
                proxyManager.builder().build(k, () -> BucketConfiguration.builder()
                    .addLimit(Bandwidth.classic(capacity, Refill.intervally(capacity, period)))
                    .build()));
            ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
            return new Probe(probe.isConsumed(), probe.getRemainingTokens(), probe.getNanosToWaitForRefill());
        } catch (RuntimeException e) {
            throw new RateLimitStoreException("Redis rate limiter unavailable", e);
        }
    }

    @Override
    public void close() {
        if (connection != null && connection.isOpen()) {
            connection.close();
        }
    }
}
