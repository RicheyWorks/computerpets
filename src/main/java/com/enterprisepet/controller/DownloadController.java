package com.enterprisepet.controller;

import com.enterprisepet.bundle.PetBundleService;
import com.enterprisepet.dto.DownloadResponse;
import com.enterprisepet.dto.ErrorResponse;
import com.enterprisepet.license.LicenseService;
import com.enterprisepet.license.LicenseService.LicensePayload;
import com.enterprisepet.pet.PetCatalog;
import com.enterprisepet.pet.PetType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    private final PetCatalog petCatalog;

    public DownloadController(LicenseService licenseService,
                              PetBundleService bundleService,
                              PetCatalog petCatalog) {
        this.licenseService = licenseService;
        this.bundleService = bundleService;
        this.petCatalog = petCatalog;
    }

    /**
     * POST /api/download/{petKey}
     * Headers: Authorization: Bearer &lt;jwt from /api/verify&gt;
     * Body:    { "ciphertext": "...", "iv": "..." }   (EncryptedLicense fields)
     * 200:     { "petKey": ..., "downloadUrl": ..., "expiresAt": ..., ... }
     * 400:     unknown petKey
     * 401:     license missing / expired / tampered (Spring Security handles missing JWT separately)
     * 403:     JWT and license disagree, or either was issued for a different pet
     */
    @Operation(
        summary = "Download pet bundle",
        description = "Validates the encrypted license + JWT and returns a short-lived signed CDN URL for the pet assets.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Encrypted license payload (ciphertext + iv) obtained from a prior successful /api/verify response",
                required = true,
                content = @Content(mediaType = "application/json",
                        examples = @ExampleObject(ref = "Download Request"))
        ),
        responses = {
            @ApiResponse(responseCode = "200", description = "Signed download URL generated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DownloadResponse.class),
                            examples = @ExampleObject(ref = "Download URL Response"))),
            @ApiResponse(responseCode = "400", description = "Unknown pet key",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Unknown Pet Type"))),
            @ApiResponse(responseCode = "401", description = "License invalid, expired, or tampered",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Download License Invalid"))),
            @ApiResponse(responseCode = "403", description = "License/pet or JWT/license mismatch (defense-in-depth)",
                    content = @Content(mediaType = "application/json",
                            examples = {
                                    @ExampleObject(ref = "Download Pet Mismatch"),
                                    @ExampleObject(ref = "Download Auth Mismatch")
                            }))
        }
    )
    @PostMapping("/{petKey}")
    public ResponseEntity<?> download(@PathVariable("petKey") String petKey,
                                      @RequestBody Map<String, String> body) {
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
            body.get("ciphertext"), body.get("iv")
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
        String suppliedHwid = body.get("hwid");
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

        // Phase 2.1: record usage + bind signed URL to this specific jti
        licenseService.recordDownload(license.jti());
        var manifest = bundleService.manifestFor(pet, license.owner(), license.jti());
        return ResponseEntity.ok(manifest.body());
    }

    /** Returns the JWT-derived principal map, or null if the context has none. */
    @SuppressWarnings("unchecked")
    private static Map<String, Object> currentPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        Object principal = auth.getPrincipal();
        return principal instanceof Map<?, ?> m ? (Map<String, Object>) m : null;
    }
}
