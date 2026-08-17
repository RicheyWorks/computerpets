package com.enterprisepet.config;

/**
 * Raised when the rate-limit store cannot complete a consume.
 * The filter fail-closes (HTTP 503) instead of allowing the request through.
 */
public class RateLimitStoreException extends RuntimeException {

    public RateLimitStoreException(String message, Throwable cause) {
        super(message, cause);
    }
}
