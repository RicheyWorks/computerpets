package com.enterprisepet.license;

/**
 * The shared jti deny-list could not be reached.
 *
 * <p>{@link LicenseService#validate} falls back to the Postgres ledger rather
 * than failing the download. {@link LicenseService#revoke} still persists
 * {@code revokedAt} and logs the index write failure.
 */
public class RevocationIndexUnavailableException extends RuntimeException {

    public RevocationIndexUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
