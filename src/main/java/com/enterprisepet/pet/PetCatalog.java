package com.enterprisepet.pet;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Thin service wrapper around {@link PetType} so other components inject the catalog
 * rather than depend on the enum directly. Makes it easy to swap in a DB-backed catalog later.
 */
@Service
public class PetCatalog {

    /** All pet types in declaration order. */
    public List<PetType> list() {
        return Arrays.asList(PetType.values());
    }

    /** All pet types of the given rarity, in declaration order. */
    public List<PetType> listByRarity(PetType.Rarity rarity) {
        return Arrays.stream(PetType.values())
            .filter(p -> p.rarity() == rarity)
            .toList();
    }

    /**
     * Pet types grouped by rarity. Insertion order is the {@link PetType.Rarity}
     * declaration order (COMMON → LEGENDARY); every rarity is present, even if empty.
     */
    public Map<PetType.Rarity, List<PetType>> groupedByRarity() {
        Map<PetType.Rarity, List<PetType>> grouped = new LinkedHashMap<>();
        for (PetType.Rarity r : PetType.Rarity.values()) {
            grouped.put(r, new ArrayList<>());
        }
        for (PetType p : PetType.values()) {
            grouped.get(p.rarity()).add(p);
        }
        return grouped;
    }

    /** Returns the PetType for a wire-format key (e.g. "fox"), or empty if unknown. */
    public Optional<PetType> find(String key) {
        return PetType.fromKey(key);
    }

    /** Case-insensitive parse of a rarity name (e.g. "rare", "RARE"), or empty if unknown. */
    public Optional<PetType.Rarity> parseRarity(String name) {
        if (name == null) return Optional.empty();
        try {
            return Optional.of(PetType.Rarity.valueOf(name.trim().toUpperCase()));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    /** Comma-separated list of valid keys, for use in error messages. */
    public String validKeysCsv() {
        StringBuilder sb = new StringBuilder();
        PetType[] all = PetType.values();
        for (int i = 0; i < all.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append(all[i].key());
        }
        return sb.toString();
    }

    /** Comma-separated list of valid rarity names, for use in error messages. */
    public String validRaritiesCsv() {
        StringBuilder sb = new StringBuilder();
        PetType.Rarity[] all = PetType.Rarity.values();
        for (int i = 0; i < all.length; i++) {
            if (i > 0) sb.append(", ");
            sb.append(all[i].name());
        }
        return sb.toString();
    }
}
