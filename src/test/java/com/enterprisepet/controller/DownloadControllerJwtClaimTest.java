package com.enterprisepet.controller;

import com.enterprisepet.bundle.DownloadGrantService;
import com.enterprisepet.bundle.PetBundleService;
import com.enterprisepet.config.ClientAddress;
import com.enterprisepet.dto.DownloadRequest;
import com.enterprisepet.license.LicenseService;
import com.enterprisepet.license.LicenseService.LicensePayload;
import com.enterprisepet.observability.VerificationTelemetry;
import com.enterprisepet.pet.PetCatalog;
import com.enterprisepet.pet.PetType;
import com.enterprisepet.security.DownloadJwtStore;
import com.enterprisepet.security.DownloadJwtStoreUnavailableException;
import com.enterprisepet.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DownloadControllerJwtClaimTest {

    private final LicenseService licenseService = mock(LicenseService.class);
    private final PetBundleService bundleService = mock(PetBundleService.class);
    private final DownloadGrantService grantService = mock(DownloadGrantService.class);
    private final PetCatalog petCatalog = mock(PetCatalog.class);
    private final VerificationTelemetry telemetry = mock(VerificationTelemetry.class);
    private final ClientAddress clientAddress = mock(ClientAddress.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final DownloadJwtStore downloadJwtStore = mock(DownloadJwtStore.class);

    private final DownloadController controller = new DownloadController(
            licenseService,
            bundleService,
            grantService,
            petCatalog,
            telemetry,
            clientAddress,
            jwtService,
            downloadJwtStore);

    @AfterEach
    void clearSecurity() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("a bearer without jti is 401 and does not mint a grant")
    void missingJti_is401() {
        readyLicense();
        authenticate(Map.of("sub", "steam:1", "pet", "red_panda", "provider", "steam"));

        ResponseEntity<?> response = controller.download(
                "red_panda", null, new DownloadRequest("cipher", "iv", null, null), mock(HttpServletRequest.class));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(body(response)).containsEntry("error", "download token has no jti");
        verify(downloadJwtStore, never()).claim(anyString(), anyLong());
        verify(grantService, never()).issue(any(), anyString(), any());
    }

    @Test
    @DisplayName("a non-UUID jti is 401")
    void invalidJti_is401() {
        readyLicense();
        authenticate(Map.of("sub", "steam:1", "pet", "red_panda", "provider", "steam", "jti", "not-a-uuid"));

        ResponseEntity<?> response = controller.download(
                "red_panda", null, new DownloadRequest("cipher", "iv", null, null), mock(HttpServletRequest.class));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(body(response)).containsEntry("error", "download token jti invalid");
        verify(grantService, never()).issue(any(), anyString(), any());
    }

    @Test
    @DisplayName("a second claim is 409 and does not mint another grant")
    void replay_is409() {
        readyLicense();
        String jti = "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80";
        authenticate(Map.of("sub", "steam:1", "pet", "red_panda", "provider", "steam", "jti", jti));
        when(jwtService.ttlSeconds()).thenReturn(1800L);
        when(downloadJwtStore.claim(jti, 1800L + DownloadJwtStore.SKEW_SECONDS))
                .thenReturn(DownloadJwtStore.Claim.REPLAY);

        ResponseEntity<?> response = controller.download(
                "red_panda", null, new DownloadRequest("cipher", "iv", null, null), mock(HttpServletRequest.class));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(body(response)).containsEntry("error", "download token already used");
        assertThat(body(response)).doesNotContainKey("downloadUrl");
        verify(grantService, never()).issue(any(), anyString(), any());
        verify(licenseService, never()).recordDownload(anyString());
    }

    @Test
    @DisplayName("a down token store is 503 and does not mint a grant")
    void storeDown_is503() {
        readyLicense();
        String jti = "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80";
        authenticate(Map.of("sub", "steam:1", "pet", "red_panda", "provider", "steam", "jti", jti));
        when(jwtService.ttlSeconds()).thenReturn(1800L);
        when(downloadJwtStore.claim(eq(jti), eq(1800L + DownloadJwtStore.SKEW_SECONDS)))
                .thenThrow(new DownloadJwtStoreUnavailableException("Redis download token store unavailable", null));

        ResponseEntity<?> response = controller.download(
                "red_panda", null, new DownloadRequest("cipher", "iv", null, null), mock(HttpServletRequest.class));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(body(response)).containsEntry("error", "download token store unavailable");
        verify(grantService, never()).issue(any(), anyString(), any());
    }

    @Test
    @DisplayName("a pet mismatch is 403 and does not spend the bearer")
    void petMismatch_doesNotClaim() {
        when(telemetry.download(anyString(), any())).thenAnswer(invocation -> {
            Supplier<?> supplier = invocation.getArgument(1);
            return supplier.get();
        });
        when(petCatalog.find("cat")).thenReturn(Optional.of(PetType.CAT));
        when(licenseService.validate("cipher", "iv")).thenReturn(Optional.of(
                new LicensePayload("lic-jti", "steam:1", "red_panda", "2099-01-01T00:00:00Z", "2026-01-01T00:00:00Z")));
        authenticate(Map.of(
                "sub", "steam:1",
                "pet", "red_panda",
                "provider", "steam",
                "jti", "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80"));

        ResponseEntity<?> response = controller.download(
                "cat", null, new DownloadRequest("cipher", "iv", null, null), mock(HttpServletRequest.class));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        verify(downloadJwtStore, never()).claim(anyString(), anyLong());
    }

    private void readyLicense() {
        when(telemetry.download(anyString(), any())).thenAnswer(invocation -> {
            Supplier<?> supplier = invocation.getArgument(1);
            return supplier.get();
        });
        when(petCatalog.find("red_panda")).thenReturn(Optional.of(PetType.RED_PANDA));
        when(licenseService.validate("cipher", "iv")).thenReturn(Optional.of(
                new LicensePayload("lic-jti", "steam:1", "red_panda", "2099-01-01T00:00:00Z", "2026-01-01T00:00:00Z")));
    }

    private static void authenticate(Map<String, Object> principal) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                principal,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_CLIENT"))));
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> body(ResponseEntity<?> response) {
        return (Map<String, Object>) response.getBody();
    }
}
