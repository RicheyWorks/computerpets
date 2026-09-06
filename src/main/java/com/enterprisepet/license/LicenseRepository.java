package com.enterprisepet.license;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LicenseRepository extends JpaRepository<IssuedLicense, String> {

    Optional<IssuedLicense> findByJti(String jti);

    boolean existsByJtiAndRevokedAtIsNull(String jti);

    List<IssuedLicense> findTop50ByOwnerOrderByIssuedAtDesc(String owner);

    List<IssuedLicense> findTop50ByOrderByIssuedAtDesc();
}