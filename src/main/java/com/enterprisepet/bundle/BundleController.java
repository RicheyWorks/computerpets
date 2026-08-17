package com.enterprisepet.bundle;

import com.enterprisepet.pet.PetCatalog;
import com.enterprisepet.pet.PetType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Public discovery of configured bundle artifacts. Unauthenticated, like
 * {@code /api/pets}. Does not sign a URL and does not serve zip bytes.
 */
@RestController
@RequestMapping("/api/bundles")
@Tag(name = "Bundles", description = "Published pet-bundle artifact catalog")
public class BundleController {

    private final BundleCatalog catalog;
    private final PetCatalog pets;

    public BundleController(BundleCatalog catalog, PetCatalog pets) {
        this.catalog = catalog;
        this.pets = pets;
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
