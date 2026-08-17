package com.enterprisepet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/**
 * Rate-limit store settings. Default backend is Redis so multiple app
 * instances share the same per-IP verify (10/min) and download (30/min) buckets.
 *
 * <p>{@code memory} is for automated tests and single-process local runs only.
 * It is not a failover path: when {@code backend=redis} and Redis is unreachable
 * the filter fail-closes with HTTP 503 rather than lifting the limit.
 */
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {

    public static final String BACKEND_REDIS = "redis";
    public static final String BACKEND_MEMORY = "memory";

    /**
     * {@code redis} (default) or {@code memory}.
     */
    private String backend = BACKEND_REDIS;

    /**
     * {@code Retry-After} advertised when Redis cannot be reached.
     */
    private int failClosedRetryAfterSeconds = 5;

    private Redis redis = new Redis();

    public String getBackend() {
        return backend;
    }

    public void setBackend(String backend) {
        this.backend = backend;
    }

    public boolean isRedis() {
        return BACKEND_REDIS.equalsIgnoreCase(backend);
    }

    public boolean isMemory() {
        return BACKEND_MEMORY.equalsIgnoreCase(backend);
    }

    public int getFailClosedRetryAfterSeconds() {
        return failClosedRetryAfterSeconds;
    }

    public void setFailClosedRetryAfterSeconds(int failClosedRetryAfterSeconds) {
        this.failClosedRetryAfterSeconds = failClosedRetryAfterSeconds;
    }

    public Redis getRedis() {
        return redis;
    }

    public void setRedis(Redis redis) {
        this.redis = redis == null ? new Redis() : redis;
    }

    public static class Redis {
        private String host = "localhost";
        private int port = 6379;
        private Duration timeout = Duration.ofMillis(200);

        public String getHost() {
            return host;
        }

        public void setHost(String host) {
            this.host = host;
        }

        public int getPort() {
            return port;
        }

        public void setPort(int port) {
            this.port = port;
        }

        public Duration getTimeout() {
            return timeout;
        }

        public void setTimeout(Duration timeout) {
            this.timeout = timeout == null ? Duration.ofMillis(200) : timeout;
        }
    }
}
