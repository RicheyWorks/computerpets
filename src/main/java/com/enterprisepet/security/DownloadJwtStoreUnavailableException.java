package com.enterprisepet.security;

/**
 * The download-token store could not claim a JWT {@code jti}. Callers fail closed.
 */
public class DownloadJwtStoreUnavailableException extends RuntimeException {

    public DownloadJwtStoreUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
