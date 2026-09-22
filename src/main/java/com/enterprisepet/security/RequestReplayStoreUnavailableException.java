package com.enterprisepet.security;

/**
 * The nonce store could not claim a signed request. Callers fail closed.
 */
public class RequestReplayStoreUnavailableException extends RuntimeException {

    public RequestReplayStoreUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
