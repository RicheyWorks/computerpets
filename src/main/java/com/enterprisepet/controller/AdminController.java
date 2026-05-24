package com.enterprisepet.controller;

import com.enterprisepet.license.LicenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Minimal internal admin endpoints.
 *
 * <p>Protected by a strong pre-shared admin key (X-Admin-Key header).
 * This is intentionally simple for Phase 2; in production you would typically
 * use a separate short-lived admin JWT, mTLS, or a full secrets manager + Vault agent.
 */
@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Internal administration operations (revocation, etc.)")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private static final String[] PLACEHOLDER_KEYS = {
        "CHANGE_ME_ADMIN_KEY", "CHANGE_ME", "PLACEHOLDER", ""
    };

    private final LicenseService licenseService;
    private final String adminApiKey;

    public AdminController(LicenseService licenseService,
                           @Value("${admin.api-key:}") String adminApiKey) {
        this.licenseService = licenseService;
        this.adminApiKey = adminApiKey;
    }

    @PostConstruct
    void init() {
        if (adminApiKey == null || adminApiKey.isBlank()) {
            throw new IllegalStateException(
                "admin.api-key is not configured. Set ADMIN_API_KEY for internal admin endpoints " +
                "(generate with: openssl rand -base64 32).");
        }
        for (String p : PLACEHOLDER_KEYS) {
            if (p.equals(adminApiKey)) {
                throw new IllegalStateException(
                    "admin.api-key looks like a placeholder. Set a real secret via ADMIN_API_KEY env var.");
            }
        }
        log.info("AdminController ready (protected by X-Admin-Key).");
    }

    @Operation(
        summary = "Revoke an issued license",
        description = "Immediately revokes a license by its jti so it can no longer be used for downloads. Requires X-Admin-Key header.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Revocation result",
                content = @Content(mediaType = "application/json",
                    examples = @ExampleObject(value = "{\"revoked\": true, \"jti\": \"...\"}"))),
            @ApiResponse(responseCode = "401", description = "Missing or invalid admin key"),
            @ApiResponse(responseCode = "404", description = "License not found")
        }
    )
    @PostMapping("/revoke")
    public ResponseEntity<?> revoke(@RequestHeader(value = "X-Admin-Key", required = false) String providedKey,
                                    @RequestBody Map<String, String> body) {

        if (providedKey == null || !providedKey.equals(adminApiKey)) {
            log.warn("Admin revoke attempt with invalid or missing X-Admin-Key");
            return ResponseEntity.status(401).body(Map.of(
                "error", "invalid or missing admin key",
                "hint", "Supply X-Admin-Key header with the configured admin secret"
            ));
        }

        String jti = body.get("jti");
        if (jti == null || jti.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "jti is required",
                "example", Map.of("jti", "a1b2c3d4-...")
            ));
        }

        boolean revoked = licenseService.revoke(jti);
        if (!revoked) {
            // Either not found or already revoked
            return ResponseEntity.status(404).body(Map.of(
                "revoked", false,
                "jti", jti,
                "reason", "not found or already revoked"
            ));
        }

        return ResponseEntity.ok(Map.of(
            "revoked", true,
            "jti", jti
        ));
    }
}