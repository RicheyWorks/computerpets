package com.enterprisepet.config;

import com.enterprisepet.bundle.DownloadGrantIndex;
import com.enterprisepet.bundle.InMemoryDownloadGrantIndex;
import com.enterprisepet.bundle.RedisDownloadGrantIndex;
import io.lettuce.core.RedisClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * One-time download grants. Uses the same Redis as the rate limiter when
 * {@code rate-limit.backend=redis}; in-memory only for tests / a single local process.
 */
@Configuration
public class DownloadGrantIndexConfiguration {

    @Bean
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_MEMORY)
    DownloadGrantIndex inMemoryDownloadGrantIndex() {
        return new InMemoryDownloadGrantIndex();
    }

    @Bean(destroyMethod = "close")
    @ConditionalOnProperty(name = "rate-limit.backend", havingValue = RateLimitProperties.BACKEND_REDIS, matchIfMissing = true)
    DownloadGrantIndex redisDownloadGrantIndex(RedisClient rateLimitRedisClient) {
        return new RedisDownloadGrantIndex(rateLimitRedisClient);
    }
}
