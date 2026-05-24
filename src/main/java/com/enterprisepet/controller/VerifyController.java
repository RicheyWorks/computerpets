package com.enterprisepet.controller;

import com.enterprisepet.dto.VerifySuccessResponse;
import com.enterprisepet.license.LicenseService;
import com.enterprisepet.pet.PetCatalog;
import com.enterprisepet.pet.PetType;
import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.ProviderRegistry;
import com.enterprisepet.provider.VerificationResult;
import com.enterprisepet.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/verify")
@Tag(name = "Verification", description = "Ownership verification and license issuance endpoints")
public class VerifyController {

    private static final String DEFAULT_PET_KEY = "red_panda";
    private static final int LICENSE_DAYS = 365;

    private final ProviderRegistry providers;
    private final LicenseService licenseService;
    private final JwtService jwtService;
    private final PetCatalog petCatalog;

    public VerifyController(ProviderRegistry providers,
                            LicenseService licenseService,
                            JwtService jwtService,
                            PetCatalog petCatalog) {
        this.providers = providers;
        this.licenseService = licenseService;
        this.jwtService = jwtService;
        this.petCatalog = petCatalog;
    }

    /**
     * GET /api/verify/providers — discover which platforms are registered.
     * Lets clients build a platform-picker UI without hardcoding the list.
     */
    @Operation(summary = "List available providers", description = "Returns all registered ownership verification providers.",
            responses = @ApiResponse(responseCode = "200", description = "List of providers",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Providers List"))))
    @GetMapping("/providers")
    public ResponseEntity<List<Map<String, String>>> providers() {
        List<Map<String, String>> body = providers.all().stream()
            .map(p -> Map.of("key", p.key(), "displayName", p.displayName()))
            .toList();
        return ResponseEntity.ok(body);
    }

    /**
     * POST /api/verify/{provider} — generic provider-driven verification.
     * The body is a flat map of provider-specific fields plus an optional {@code petType}.
     * Returns a sealed license + pet info on success.
     */
    @Operation(
        summary = "Verify ownership and issue license",
        description = "Verifies ownership via the selected provider and returns an encrypted license + short-lived JWT.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Ownership verified successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = VerifySuccessResponse.class),
                            examples = @ExampleObject(ref = "Success Response"))),
            @ApiResponse(responseCode = "400", description = "Unknown petType or invalid request",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Unknown Pet Type"))),
            @ApiResponse(responseCode = "403", description = "Ownership verification failed",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = com.enterprisepet.dto.ErrorResponse.class),
                            examples = @ExampleObject(ref = "Ownership Denied"))),
            @ApiResponse(responseCode = "404", description = "Unknown provider",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Unknown Provider"))),
            @ApiResponse(responseCode = "502", description = "Provider call failed",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Provider Call Failed")))
        },
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Provider-specific ownership verification request",
                required = true,
                content = @Content(mediaType = "application/json",
                        examples = {
                                @ExampleObject(ref = "Steam Verification"),
                                @ExampleObject(ref = "NFT Verification"),
                                @ExampleObject(ref = "Microsoft Verification")
                        })
        )
    )
    @PostMapping("/{provider}")
    public ResponseEntity<?> verify(@PathVariable("provider") String providerKey,
                                    @RequestBody Map<String, String> request) {
        Optional<OwnershipProvider> providerOpt = providers.find(providerKey);
        if (providerOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                "error", "unknown provider",
                "provider", providerKey,
                "validProviders", providers.validKeysCsv()
            ));
        }
        OwnershipProvider provider = providerOpt.get();

        ResolvedPet pet = resolvePet(request.getOrDefault("petType", DEFAULT_PET_KEY));
        if (pet.error != null) return pet.error;

        VerificationResult result;
        try {
            result = provider.verify(request);
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of(
                "error", "provider call failed",
                "provider", provider.key(),
                "detail", String.valueOf(e.getMessage())
            ));
        }

        if (!result.verified()) {
            return ResponseEntity.status(403).body(Map.of(
                "error", result.reason() == null ? "ownership not verified" : result.reason(),
                "provider", provider.key()
            ));
        }

        String hwid = request.get("hwid");
        var license = licenseService.issueLicense(result.ownerId(), pet.type.key(), provider.key(), LICENSE_DAYS, hwid);
        var auth = jwtService.issue(result.ownerId(), pet.type.key(), provider.key());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "success");
        body.put("provider", provider.key());
        body.put("license", license);
        body.put("auth", auth);
        body.put("pet", Map.of("key", pet.type.key(), "displayName", pet.type.displayName()));
        body.put("message", provider.displayName() + " ownership verified. License issued.");
        return ResponseEntity.ok(body);
    }

    /** Looks up petKey in the catalog; on miss returns a 400 ResponseEntity listing valid keys. */
    private ResolvedPet resolvePet(String petKey) {
        Optional<PetType> found = petCatalog.find(petKey);
        if (found.isPresent()) return new ResolvedPet(found.get(), null);
        return new ResolvedPet(null, ResponseEntity.status(400).body(Map.of(
            "error", "unknown petType",
            "received", petKey,
            "validKeys", petCatalog.validKeysCsv()
        )));
    }

    /** Tiny result holder: either a resolved type, or a prebuilt error response. */
    private record ResolvedPet(PetType type, ResponseEntity<?> error) {}
}
