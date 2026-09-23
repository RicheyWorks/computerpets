package com.enterprisepet.config;

import com.enterprisepet.security.DownloadJwtStore;
import com.enterprisepet.security.InMemoryDownloadJwtStore;
import com.enterprisepet.security.RedisDownloadJwtStore;
import io.lettuce.core.RedisClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Single-use download JWTs. Uses the same Redis as the rate limiter when
 * {@code rate-limit.backend=redis}; in-memory only for tests / a single local process.
 */
@Configuration
public class DownloadJwtStoreConfiguration {

    @Bean
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_MEMORY)
    DownloadJwtStore inMemoryDownloadJwtStore() {
        return new InMemoryDownloadJwtStore();
    }

    @Bean(destroyMethod = "close")
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
    DownloadJwtStore redisDownloadJwtStore(RedisClient rateLimitRedisClient) {
        return new RedisDownloadJwtStore(rateLimitRedisClient);
    }
}
