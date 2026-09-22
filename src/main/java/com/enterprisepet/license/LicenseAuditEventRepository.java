package com.enterprisepet.license;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LicenseAuditEventRepository extends JpaRepository<LicenseAuditEvent, Long> {

    List<LicenseAuditEvent> findTop50ByJtiOrderByOccurredAtDesc(String jti);

    List<LicenseAuditEvent> findTop50ByOrderByOccurredAtDesc();
}
