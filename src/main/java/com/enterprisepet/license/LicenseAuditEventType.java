package com.enterprisepet.license;

/**
 * Append-only license ledger events. Values are safe to log; never carry secrets.
 */
public enum LicenseAuditEventType {
    /** License sealed and persisted after a verified grant. */
    ISSUED,
    /** Admin (or system) revoke: soft-delete + deny-list. */
    REVOKED,
    /** Successful download authorization (redeem-adjacent usage stamp). */
    DOWNLOAD
}
