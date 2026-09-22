package com.enterprisepet.config;

import com.enterprisepet.security.InMemoryRequestReplayStore;
import com.enterprisepet.security.RedisRequestReplayStore;
import com.enterprisepet.security.RequestReplayStore;
import io.lettuce.core.RedisClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Single-use nonces for signed admin and machine requests. Uses the same
 * Redis as the rate limiter when {@code rate-limit.backend=redis}; in-memory
 * only for tests / a single local process.
 */
@Configuration
public class RequestReplayStoreConfiguration {

    @Bean
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_MEMORY)
    RequestReplayStore inMemoryRequestReplayStore() {
        return new InMemoryRequestReplayStore();
    }

    @Bean(destroyMethod = "close")
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
    RequestReplayStore redisRequestReplayStore(RedisClient rateLimitRedisClient) {
        return new RedisRequestReplayStore(rateLimitRedisClient);
    }
}
