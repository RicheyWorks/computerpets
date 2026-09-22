package com.enterprisepet.license;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LicenseRepository extends JpaRepository<IssuedLicense, String> {

    /** Any row including soft-deleted (admin + revoke + validate ledger). */
    Optional<IssuedLicense> findByJti(String jti);

    /** Default operational lookup: excludes soft-deleted rows. */
    Optional<IssuedLicense> findByJtiAndDeletedAtIsNull(String jti);

    boolean existsByJtiAndDeletedAtIsNullAndRevokedAtIsNull(String jti);

    /** Active-only lists (default queries exclude soft-deleted). */
    List<IssuedLicense> findTop50ByDeletedAtIsNullAndOwnerOrderByIssuedAtDesc(String owner);

    List<IssuedLicense> findTop50ByDeletedAtIsNullOrderByIssuedAtDesc();

    /** Admin lists include soft-deleted / revoked rows with honest copy. */
    List<IssuedLicense> findTop50ByOwnerOrderByIssuedAtDesc(String owner);

    List<IssuedLicense> findTop50ByOrderByIssuedAtDesc();
}
