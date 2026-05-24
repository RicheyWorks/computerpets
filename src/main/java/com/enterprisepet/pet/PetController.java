package com.enterprisepet.pet;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
@Tag(name = "Pets", description = "Pet catalog discovery endpoints")
public class PetController {

    private final PetCatalog catalog;

    public PetController(PetCatalog catalog) {
        this.catalog = catalog;
    }

    /**
     * GET /api/pets — full catalog of pet types.
     * GET /api/pets?rarity=RARE — filter to a single rarity (case-insensitive).
     */
    @Operation(summary = "List all pets", description = "Returns the full pet catalog, optionally filtered by rarity.",
            responses = {
                @ApiResponse(responseCode = "200", description = "List of pets",
                        content = @Content(mediaType = "application/json",
                                examples = @ExampleObject(ref = "Pets List"),
                                array = @ArraySchema(schema = @Schema(implementation = com.enterprisepet.dto.PetInfo.class)))),
                @ApiResponse(responseCode = "400", description = "Invalid rarity parameter",
                        content = @Content(mediaType = "application/json",
                                examples = @ExampleObject(ref = "Validation Error")))
            })
    @GetMapping
    public ResponseEntity<?> list(@RequestParam(value = "rarity", required = false) String rarity) {
        List<PetType> pets;
        if (rarity == null || rarity.isBlank()) {
            pets = catalog.list();
        } else {
            Optional<PetType.Rarity> parsed = catalog.parseRarity(rarity);
            if (parsed.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "unknown rarity",
                    "rarity", rarity,
                    "validRarities", catalog.validRaritiesCsv()
                ));
            }
            pets = catalog.listByRarity(parsed.get());
        }
        List<Map<String, Object>> body = pets.stream().map(PetController::view).toList();
        return ResponseEntity.ok(body);
    }

    /** GET /api/pets/by-rarity — catalog grouped by rarity (COMMON → LEGENDARY). */
    @Operation(summary = "Get pets grouped by rarity",
            responses = @ApiResponse(responseCode = "200", description = "Pets grouped by rarity",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(ref = "Pets Grouped By Rarity"))))
    @GetMapping("/by-rarity")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> byRarity() {
        Map<String, List<Map<String, Object>>> body = new LinkedHashMap<>();
        catalog.groupedByRarity().forEach((rarity, pets) ->
            body.put(rarity.name(), pets.stream().map(PetController::view).toList())
        );
        return ResponseEntity.ok(body);
    }

    /** GET /api/pets/{key} — single pet type by wire-format key. */
    @Operation(summary = "Get pet by key", description = "Returns a single pet type or 404 if not found.",
            responses = {
                @ApiResponse(responseCode = "200", description = "Pet found",
                        content = @Content(mediaType = "application/json",
                                examples = @ExampleObject(ref = "Pet Detail"))),
                @ApiResponse(responseCode = "404", description = "Pet not found",
                        content = @Content(mediaType = "application/json",
                                examples = @ExampleObject(ref = "Pet Not Found")))
            })
    @GetMapping("/{key}")
    public ResponseEntity<?> get(@PathVariable("key") String key) {
        return catalog.find(key)
            .<ResponseEntity<?>>map(p -> ResponseEntity.ok(view(p)))
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of(
                "error", "unknown pet type",
                "key", key,
                "validKeys", catalog.validKeysCsv()
            )));
    }

    private static Map<String, Object> view(PetType p) {
        return Map.of(
            "key", p.key(),
            "displayName", p.displayName(),
            "rarity", p.rarity().name()
        );
    }
}
