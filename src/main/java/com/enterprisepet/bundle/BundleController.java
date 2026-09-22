package com.enterprisepet.bundle;

import com.enterprisepet.config.ClientAddress;
import com.enterprisepet.pet.PetCatalog;
import com.enterprisepet.pet.PetType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Public discovery of configured bundle artifacts, plus one-time redeem of a
 * signed download grant. Unauthenticated, like {@code /api/pets}. Does not
 * serve zip bytes; an edge worker calls redeem before serving them.
 */
@RestController
@RequestMapping("/api/bundles")
@Tag(name = "Bundles", description = "Published pet-bundle artifact catalog and download grant redeem")
public class BundleController {

    private final BundleCatalog catalog;
    private final PetCatalog pets;
    private final DownloadGrantService grantService;
    private final ClientAddress clientAddress;

    public BundleController(BundleCatalog catalog, PetCatalog pets, DownloadGrantService grantService,
                            ClientAddress clientAddress) {
        this.catalog = catalog;
        this.pets = pets;
        this.grantService = grantService;
        this.clientAddress = clientAddress;
    }

    @Operation(
            summary = "List catalog rows for a pet",
            description = "Returns configured version/platform/sha256 rows. "
                    + "Empty artifacts means no zip has been published for this pet yet. "
                    + "See docs/CLIENT-CONTRACT.md §6.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Catalog rows (possibly empty)",
                            content = @Content(mediaType = "application/json")),
                    @ApiResponse(responseCode = "404", description = "Unknown pet key",
                            content = @Content(mediaType = "application/json"))
            }
    )
    @GetMapping("/{petKey}")
    public ResponseEntity<?> list(@PathVariable("petKey") String petKey) {
        return pets.find(petKey)
                .<ResponseEntity<?>>map(pet -> ResponseEntity.ok(view(pet)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                        "error", "unknown pet type",
                        "key", petKey,
                        "validKeys", pets.validKeysCsv()
                )));
    }

    @Operation(
            summary = "Redeem a one-time signed download grant",
            description = "Edge worker (or download proxy) verifies HMAC and consumes the grant once. "
                    + "Second use denies. IP must match the address bound at issue when both are present. "
                    + "Does not scrub owner/jti/exp/sig. See docs/CLIENT-CONTRACT.md §7 and ADR 0055.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Grant allowed (first redeem)",
                            content = @Content(mediaType = "application/json")),
                    @ApiResponse(responseCode = "400", description = "Unknown pet key or bad exp",
                            content = @Content(mediaType = "application/json")),
                    @ApiResponse(responseCode = "401", description = "Signature invalid or grant expired/unknown",
                            content = @Content(mediaType = "application/json")),
                    @ApiResponse(responseCode = "403", description = "Already used or address mismatch",
                            content = @Content(mediaType = "application/json")),
                    @ApiResponse(responseCode = "503", description = "Grant store unavailable",
                            content = @Content(mediaType = "application/json"))
            }
    )
    @GetMapping("/{petKey}/redeem")
    public ResponseEntity<?> redeem(@PathVariable("petKey") String petKey,
                                    @RequestParam("owner") String owner,
                                    @RequestParam("jti") String jti,
                                    @RequestParam("exp") String expRaw,
                                    @RequestParam("sig") String sig,
                                    HttpServletRequest request) {
        if (pets.find(petKey).isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "unknown pet type",
                    "key", petKey,
                    "validKeys", pets.validKeysCsv()
            ));
        }
        long exp;
        try {
            exp = Long.parseLong(expRaw);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "download grant exp invalid",
                    "hint", "exp must be Unix epoch seconds from the signed URL."
            ));
        }

        DownloadGrantService.RedeemOutcome outcome;
        try {
            outcome = grantService.redeem(petKey, owner, jti, exp, sig, clientAddress.from(request));
        } catch (DownloadGrantUnavailableException e) {
            return ResponseEntity.status(503).body(Map.of(
                    "error", "download grant store unavailable",
                    "hint", "Retry shortly. Bytes are not served when the grant cannot be checked."
            ));
        }

        return switch (outcome) {
            case ALLOWED -> {
                Map<String, Object> ok = new LinkedHashMap<>();
                ok.put("allowed", true);
                ok.put("petKey", petKey);
                ok.put("jti", jti);
                ok.put("exp", exp);
                yield ResponseEntity.ok(ok);
            }
            case INVALID_SIGNATURE -> ResponseEntity.status(401).body(Map.of(
                    "error", "download signature invalid",
                    "hint", "This download link is not valid. Request a new download."
            ));
            case EXPIRED -> ResponseEntity.status(401).body(Map.of(
                    "error", "download grant expired",
                    "hint", "This download link has expired. Request a new download."
            ));
            case UNKNOWN -> ResponseEntity.status(401).body(Map.of(
                    "error", "download grant unknown",
                    "hint", "This download link is not open. Request a new download."
            ));
            case ALREADY_USED -> ResponseEntity.status(403).body(Map.of(
                    "error", "download grant already used",
                    "hint", "This download link was already used. Request a new download."
            ));
            case ADDRESS_MISMATCH -> ResponseEntity.status(403).body(Map.of(
                    "error", "download grant address mismatch",
                    "hint", "This download link is bound to the address that requested it. "
                            + "Shared NAT may look like one address. Request a new download from this network."
            ));
        };
    }

    private Map<String, Object> view(PetType pet) {
        List<Map<String, Object>> artifacts = catalog.listFor(pet.key()).stream()
                .map(BundleCatalog.Artifact::toPublicView)
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("petKey", pet.key());
        body.put("displayName", pet.displayName());
        body.put("artifacts", artifacts);
        return body;
    }
}
