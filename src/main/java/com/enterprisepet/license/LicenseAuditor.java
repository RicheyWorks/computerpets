package com.enterprisepet.license;

/**
 * Who / what / when stamps for license lifecycle. Implementations must never
 * log ciphertext, keys, JWTs, or hardware fingerprint values.
 */
public interface LicenseAuditor {

    void recordIssued(IssuedLicense lic, boolean hwidBound);

    void recordRevoked(IssuedLicense lic, String actor);

    void recordDownload(IssuedLicense lic);
}
