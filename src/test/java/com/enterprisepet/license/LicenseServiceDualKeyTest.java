package com.enterprisepet.license;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LicenseServiceDualKeyTest {

    @Mock
    private LicenseRepository licenseRepository;

    private static String randomKeyB64() {
        byte[] key = new byte[32];
        new SecureRandom().nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }

    private LicenseService service(String currentB64, String previousB64) {
        LicenseService svc = new LicenseService(licenseRepository, true);
        ReflectionTestUtils.setField(svc, "masterKeyBase64", currentB64);
        ReflectionTestUtils.setField(svc, "previousMasterKeyBase64", previousB64 == null ? "" : previousB64);
        svc.init();
        return svc;
    }

    @Test
    @DisplayName("validate decrypts a license issued under the previous key during rotation")
    void validate_acceptsPreviousKeyCiphertext() {
        String previous = randomKeyB64();
        String current = randomKeyB64();

        LicenseService oldIssuer = service(previous, "");
        when(licenseRepository.save(any(IssuedLicense.class))).thenAnswer(inv -> inv.getArgument(0));
        var issued = oldIssuer.issueLicense("steam:owner", "red_panda", "steam", 30);

        LicenseService rotated = service(current, previous);
        when(licenseRepository.findByJti(any())).thenAnswer(inv -> {
            String jti = inv.getArgument(0);
            IssuedLicense stored = new IssuedLicense(
                    "steam:owner",
                    "red_panda",
                    "steam",
                    Instant.now(),
                    Instant.now().plusSeconds(3600));
            stored.setJti(jti);
            return Optional.of(stored);
        });

        assertThat(rotated.validate(issued.ciphertext(), issued.iv())).isPresent();
    }

    @Test
    @DisplayName("validate refuses previous-key ciphertext after the dual-key window closes")
    void validate_refusesPreviousWhenUnset() {
        String previous = randomKeyB64();
        String current = randomKeyB64();

        LicenseService oldIssuer = service(previous, "");
        when(licenseRepository.save(any(IssuedLicense.class))).thenAnswer(inv -> inv.getArgument(0));
        var issued = oldIssuer.issueLicense("steam:owner", "red_panda", "steam", 30);

        LicenseService cutover = service(current, "");
        assertThat(cutover.validate(issued.ciphertext(), issued.iv())).isEmpty();
    }

    @Test
    @DisplayName("init refuses a previous license key equal to current")
    void init_refusesIdenticalPrevious() {
        String key = randomKeyB64();
        LicenseService svc = new LicenseService(licenseRepository, true);
        ReflectionTestUtils.setField(svc, "masterKeyBase64", key);
        ReflectionTestUtils.setField(svc, "previousMasterKeyBase64", key);

        assertThatThrownBy(svc::init)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("must differ");
    }
}
