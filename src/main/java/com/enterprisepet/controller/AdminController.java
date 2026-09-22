package com.enterprisepet.controller;

import com.enterprisepet.dto.LicenseAuditResponse;
import com.enterprisepet.license.LicenseAuditService;
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

import java.util.List;
import java.util.Map;

/**
 * Internal admin endpoints for license lookup, audit, and revocation.
 *
 * <p>The HTTP gate is {@link com.enterprisepet.config.AdminRequestSignatureFilter}:
 * timestamp, single-use nonce, and HMAC-SHA256 over method, path, query, nonce, and body, keyed by
 * {@code ADMIN_API_KEY} (previous key during rotation, ADR 0072). A static
 * {@code X-Admin-Key} header is not accepted (ADR 0071). Production operators
 * supply the key via env, {@code ADMIN_API_KEY_FILE}, or External Secrets into
 * the existing Opaque Secret (ADR 0056). Revoke soft-deletes the ledger row
 * (ADR 0058); it does not hard-wipe.
 */
@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Internal administration operations (revocation, audit)")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private static final String[] PLACEHOLDER_KEYS = {
        "CHANGE_ME_ADMIN_KEY", "CHANGE_ME", "PLACEHOLDER", ""
    };

    private final LicenseService licenseService;
    private final String adminApiKey;
    private final String previousAdminApiKey;

    public AdminController(LicenseService licenseService,
                           @Value("${admin.api-key:}") String adminApiKey,
                           @Value("${admin.api-key-previous:}") String previousAdminApiKey) {
        this.licenseService = licenseService;
        this.adminApiKey = adminApiKey;
        this.previousAdminApiKey = previousAdminApiKey == null ? "" : previousAdminApiKey;
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
        if (!previousAdminApiKey.isBlank()) {
            for (String p : PLACEHOLDER_KEYS) {
                if (p.equals(previousAdminApiKey)) {
                    throw new IllegalStateException(
                            "admin.api-key-previous looks like a placeholder. Unset or set a real previous key (ADR 0065).");
                }
            }
            if (previousAdminApiKey.equals(adminApiKey)) {
                throw new IllegalStateException(
                        "admin.api-key-previous must differ from admin.api-key (ADR 0065).");
            }
        }
        log.info(
                "AdminController ready (request HMAC; previousKey={}).",
                previousAdminApiKey.isBlank() ? "no" : "yes");
    }

    @Operation(
        summary = "Revoke an issued license",
        description = "Immediately revokes a license by its jti so it can no longer be used for downloads. Requires an admin request HMAC (ADR 0071).",
        responses = {
            @ApiResponse(responseCode = "200", description = "Revocation result",
                content = @Content(mediaType = "application/json",
                    examples = @ExampleObject(value = "{\"revoked\": true, \"jti\": \"...\"}"))),
            @ApiResponse(responseCode = "401", description = "Missing, skewed, invalid, or replayed admin signature"),
            @ApiResponse(responseCode = "404", description = "License not found")
        }
    )
    @PostMapping("/revoke")
    public ResponseEntity<?> revoke(@RequestBody Map<String, String> body) {
        String jti = body.get("jti");
        if (jti == null || jti.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "jti is required",
                "example", Map.of("jti", "a1b2c3d4-...")
            ));
        }

        boolean revoked = licenseService.revoke(jti, LicenseAuditService.ACTOR_ADMIN);
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
            "jti", jti,
            "softDeleted", true
        ));
    }

    @Operation(
        summary = "Look up one issued license",
        description = "Returns audit fields for a license by jti. Requires an admin request HMAC (ADR 0071).",
        responses = {
            @ApiResponse(responseCode = "200", description = "License audit row"),
            @ApiResponse(responseCode = "401", description = "Missing, skewed, invalid, or replayed admin signature"),
            @ApiResponse(responseCode = "404", description = "License not found")
        }
    )
    @GetMapping("/licenses/{jti}")
    public ResponseEntity<?> getByJti(@PathVariable String jti) {
        return licenseService.findIssued(jti)
            .<ResponseEntity<?>>map(lic -> ResponseEntity.ok(LicenseAuditResponse.from(lic)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "error", "license not found",
                "jti", jti
            )));
    }

    @Operation(
        summary = "List issued licenses",
        description = "Returns the newest licenses, optionally filtered by exact owner. Capped at 50. Requires an admin request HMAC (ADR 0071).",
        responses = {
            @ApiResponse(responseCode = "200", description = "License audit rows"),
            @ApiResponse(responseCode = "401", description = "Missing, skewed, invalid, or replayed admin signature")
        }
    )
    @GetMapping("/licenses")
    public ResponseEntity<?> list(@RequestParam(required = false) String owner) {
        List<LicenseAuditResponse> rows = (owner != null && !owner.isBlank())
            ? licenseService.findByOwner(owner).stream().map(LicenseAuditResponse::from).toList()
            : licenseService.listRecent().stream().map(LicenseAuditResponse::from).toList();
        return ResponseEntity.ok(rows);
    }
}
