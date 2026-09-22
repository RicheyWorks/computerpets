package com.enterprisepet.license;

/** Silent auditor for unit tests that do not wire a persistence layer. */
final class NoOpLicenseAuditor implements LicenseAuditor {

    static final NoOpLicenseAuditor INSTANCE = new NoOpLicenseAuditor();

    private NoOpLicenseAuditor() {}

    @Override
    public void recordIssued(IssuedLicense lic, boolean hwidBound) {}

    @Override
    public void recordRevoked(IssuedLicense lic, String actor) {}

    @Override
    public void recordDownload(IssuedLicense lic) {}
}
