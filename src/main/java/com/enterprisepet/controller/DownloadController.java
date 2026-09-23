package com.enterprisepet.controller;

import com.enterprisepet.bundle.DownloadGrantService;
import com.enterprisepet.bundle.DownloadGrantUnavailableException;
import com.enterprisepet.bundle.PetBundleService;
import com.enterprisepet.config.ClientAddress;
import com.enterprisepet.dto.DownloadRequest;
import com.enterprisepet.dto.DownloadResponse;
import com.enterprisepet.dto.ErrorResponse;
import com.enterprisepet.license.LicenseService;
import com.enterprisepet.license.LicenseService.LicensePayload;
import com.enterprisepet.observability.VerificationTelemetry;
import com.enterprisepet.pet.PetCatalog;
import com.enterprisepet.pet.PetType;
import com.enterprisepet.security.DownloadJwtStore;
import com.enterprisepet.security.DownloadJwtStoreUnavailableException;
import com.enterprisepet.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Closes the loop on "download to laptop". The client posts the encrypted license it
 * received from {@code /api/verify/{provider}} along with the pet it wants; we validate
 * the license, confirm it was issued for that pet, cross-check the JWT principal, and
 * return a short-lived signed URL.
 *
 * <p>Spring Security guarantees an authenticated principal at this point (see
 * {@code SecurityConfig}). We pull it from the context to verify defense-in-depth:
 * the JWT must have been issued for the same pet and owner the encrypted license
 * names. That blocks two attacks: a stolen license used with someone else's JWT,
 * and a JWT issued for pet A used to grab pet B's bundle.
 */
@RestController
@RequestMapping("/api/download")
@Tag(name = "Download", description = "Secure pet bundle download endpoints")
public class DownloadController {

    private final LicenseService licenseService;
    private final PetBundleService bundleService;
    private final DownloadGrantService grantService;
    private final PetCatalog petCatalog;
    private final VerificationTelemetry telemetry;
    private final ClientAddress clientAddress;
    private final JwtService jwtService;
    private final DownloadJwtStore downloadJwtStore;

    public DownloadController(LicenseService licenseService,
                              PetBundleService bundleService,
                              DownloadGrantService grantService,
                              PetCatalog petCatalog,
                              VerificationTelemetry telemetry,
                              ClientAddress clientAddress,
                              JwtService jwtService,
                              DownloadJwtStore downloadJwtStore) {
        this.licenseService = licenseService;
        this.bundleService = bundleService;
        this.grantService = grantService;
        this.petCatalog = petCatalog;
        this.telemetry = telemetry;
        this.clientAddress = clientAddress;
        this.jwtService = jwtService;
        this.downloadJwtStore = downloadJwtStore;
    }

    /**
     * POST /api/download/{petKey}
     * Headers: Authorization: Bearer &lt;jwt from /api/verify&gt;
     * Body:    { "ciphertext": "...", "iv": "...", "hwid": "...", "platform": "win" }
     *          (hwid only if the license is bound; platform optional)
     * 200:     { "petKey": ..., "downloadUrl": ..., "expiresAt": ..., "jti": ..., ... }
     * 400:     unknown petKey
     * 401:     license missing / expired / tampered / revoked, or the bearer has no jti
     *          (Spring Security handles a missing or invalid JWT separately)
     * 403:     JWT and license disagree, pet mismatch, or hardware binding mismatch
     * 409:     this bearer jti already minted a download URL
     */
    @Operation(
        summary = "Download pet bundle",
        description = "Validates the encrypted license + JWT (and hwid when the license is device-bound) " +
                "and returns a short-lived signed CDN URL. See docs/CLIENT-CONTRACT.md.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Encrypted license (ciphertext + iv) from /api/verify. Include hwid when the license is bound.",
                required = true,
                content = @Content(mediaType = "application/json",
                        schema = @Schema(implementation = DownloadRequest.class),
                        examples = {
                                @ExampleObject(ref = "Download Request"),
                                @ExampleObject(ref = "Download Request With Hwid")
                        })
        ),
        responses = {
            @ApiResponse(responseCode = "200", description = "Signed download URL generated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DownloadResponse.class),
                            examples = @ExampleObject(ref = "Download URL Response"))),
            @ApiResponse(responseCode = "400", description = "Unknown pet key",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Unknown Pet Type"))),
            @ApiResponse(responseCode = "401", description = "License invalid, expired, tampered, or revoked, or download token has no jti",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Download License Invalid"))),
            @ApiResponse(responseCode = "409", description = "Download token already used to mint a URL",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "403", description = "License/pet, JWT/license, or hardware binding mismatch",
                    content = @Content(mediaType = "application/json",
                            examples = {
                                    @ExampleObject(ref = "Download Pet Mismatch"),
                                    @ExampleObject(ref = "Download Auth Mismatch"),
                                    @ExampleObject(ref = "Download Hwid Mismatch")
                            })),
            @ApiResponse(responseCode = "503", description = "Download grant store unavailable (fail closed)",
                    content = @Content(mediaType = "application/json"))
        }
    )
    @PostMapping("/{petKey}")
    public ResponseEntity<?> download(@PathVariable("petKey") String petKey,
                                      @RequestParam(value = "platform", required = false) String platform,
                                      @RequestBody DownloadRequest body,
                                      HttpServletRequest request) {
        return telemetry.download(petKey, () -> executeDownload(petKey, body, platform, request));
    }

    private ResponseEntity<?> executeDownload(String petKey, DownloadRequest body, String queryPlatform,
                                              HttpServletRequest request) {
        Optional<PetType> petOpt = petCatalog.find(petKey);
        if (petOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "unknown petType",
                "received", petKey,
                "validKeys", petCatalog.validKeysCsv()
            ));
        }
        PetType pet = petOpt.get();

        Optional<LicensePayload> licenseOpt = licenseService.validate(
            body.ciphertext(), body.iv()
        );
        if (licenseOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "license missing, expired, or tampered"
            ));
        }
        LicensePayload license = licenseOpt.get();

        if (!pet.key().equals(license.pet())) {
            return ResponseEntity.status(403).body(Map.of(
                "error", "license is not valid for the requested pet",
                "requested", pet.key(),
                "licensedFor", license.pet()
            ));
        }

        // Phase 2.2: if the license was bound to a hardware ID, require the client to prove it again
        String suppliedHwid = body.hwid();
        if (license.hwid() != null && !license.hwid().isBlank()) {
            if (suppliedHwid == null || !suppliedHwid.equals(license.hwid())) {
                return ResponseEntity.status(403).body(Map.of(
                    "error", "hardware binding mismatch",
                    "hint", "This license is bound to a specific device"
                ));
            }
        }

        // Defense in depth: the JWT principal must agree with the license.
        Map<String, Object> principal = currentPrincipal();
        if (principal != null) {
            String jwtOwner = String.valueOf(principal.get("sub"));
            String jwtPet   = String.valueOf(principal.get("pet"));
            if (!Objects.equals(jwtOwner, license.owner()) || !Objects.equals(jwtPet, pet.key())) {
                return ResponseEntity.status(403).body(Map.of(
                    "error", "auth token does not match license",
                    "tokenSubject", jwtOwner,
                    "tokenPet", jwtPet,
                    "licenseOwner", license.owner(),
                    "licensePet", license.pet()
                ));
            }
        }

        // The bearer jti is single-use (ADR 0073). Claim it before any grant is minted
        // so a captured token cannot POST again inside jwt.ttl-minutes. A failed license
        // check above does not claim, so a mismatch can be corrected with the same bearer.
        ResponseEntity<?> spent = claimDownloadToken(principal);
        if (spent != null) {
            return spent;
        }

        // Phase 2.1: record usage, bind signed URL to the license jti, register one-time grant (+ IP).
        licenseService.recordDownload(license.jti());
        String platform = firstNonBlank(body.platform(), queryPlatform);
        var manifest = bundleService.manifestFor(pet, license.owner(), license.jti(), platform);
        try {
            grantService.issue(manifest, license.jti(), clientAddress.from(request));
        } catch (DownloadGrantUnavailableException e) {
            return ResponseEntity.status(503).body(Map.of(
                "error", "download grant store unavailable",
                "hint", "Retry shortly. A signed URL is not returned when the grant cannot be tracked."
            ));
        }
        return ResponseEntity.ok(manifest.body());
    }

    /**
     * Claim the bearer {@code jti} once. {@code null} means the mint may continue.
     * A response is the honest refusal (401 / 409 / 503) and no URL is returned.
     */
    private ResponseEntity<?> claimDownloadToken(Map<String, Object> principal) {
        String tokenJti = principal == null ? null : stringClaim(principal.get("jti"));
        if (tokenJti == null) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "download token has no jti"
            ));
        }
        if (!DownloadJwtStore.isJti(tokenJti)) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "download token jti invalid"
            ));
        }
        try {
            DownloadJwtStore.Claim claim = downloadJwtStore.claim(
                    tokenJti, jwtService.ttlSeconds() + DownloadJwtStore.SKEW_SECONDS);
            if (claim == DownloadJwtStore.Claim.REPLAY) {
                return ResponseEntity.status(409).body(Map.of(
                    "error", "download token already used",
                    "hint", "Verify again for a new download token."
                ));
            }
            return null;
        } catch (DownloadJwtStoreUnavailableException e) {
            return ResponseEntity.status(503).body(Map.of(
                "error", "download token store unavailable",
                "hint", "Retry shortly. A signed URL is not returned when the download token cannot be claimed."
            ));
        }
    }

    private static String stringClaim(Object value) {
        if (!(value instanceof String s) || s.isBlank()) {
            return null;
        }
        return s;
    }

    /** Returns the JWT-derived principal map, or null if the context has none. */
    @SuppressWarnings("unchecked")
    private static Map<String, Object> currentPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        Object principal = auth.getPrincipal();
        return principal instanceof Map<?, ?> m ? (Map<String, Object>) m : null;
    }

    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.isBlank()) {
            return a;
        }
        if (b != null && !b.isBlank()) {
            return b;
        }
        return null;
    }
}
