package com.enterprisepet.bundle;

/**
 * Raised when the shared download-grant store cannot be reached.
 * Callers fail closed: do not issue a URL that cannot be redeemed once,
 * and do not allow a redeem when the store is down.
 */
public class DownloadGrantUnavailableException extends RuntimeException {

    public DownloadGrantUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
