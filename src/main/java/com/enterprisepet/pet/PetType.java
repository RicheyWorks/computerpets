package com.enterprisepet.pet;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Catalog of pet kinds the backend will issue licenses for.
 * The {@code key} is the wire-format string used by clients and stored in licenses.
 */
public enum PetType {
    RED_PANDA ("red_panda",  "Red Panda",   Rarity.COMMON),
    CAT       ("cat",        "Cat",         Rarity.COMMON),
    DOG       ("dog",        "Dog",         Rarity.COMMON),
    RABBIT    ("rabbit",     "Rabbit",      Rarity.COMMON),
    HAMSTER   ("hamster",    "Hamster",     Rarity.COMMON),
    GUINEA_PIG("guinea_pig", "Guinea Pig",  Rarity.COMMON),
    TURTLE    ("turtle",     "Turtle",      Rarity.COMMON),
    GOLDFISH  ("goldfish",   "Goldfish",    Rarity.COMMON),
    BUDGIE    ("budgie",     "Budgie",      Rarity.COMMON),
    FOX       ("fox",        "Fox",         Rarity.UNCOMMON),
    PENGUIN   ("penguin",    "Penguin",     Rarity.UNCOMMON),
    PARROT    ("parrot",     "Parrot",      Rarity.UNCOMMON),
    FERRET    ("ferret",     "Ferret",      Rarity.UNCOMMON),
    HEDGEHOG  ("hedgehog",   "Hedgehog",    Rarity.UNCOMMON),
    CHINCHILLA("chinchilla", "Chinchilla",  Rarity.UNCOMMON),
    AXOLOTL   ("axolotl",    "Axolotl",     Rarity.RARE),
    TOUCAN    ("toucan",     "Toucan",      Rarity.RARE),
    IGUANA    ("iguana",     "Iguana",      Rarity.RARE),
    DRAGON    ("dragon",     "Dragon",      Rarity.LEGENDARY),
    PHOENIX   ("phoenix",    "Phoenix",     Rarity.LEGENDARY);

    public enum Rarity { COMMON, UNCOMMON, RARE, LEGENDARY }

    private static final Map<String, PetType> BY_KEY = Arrays.stream(values())
        .collect(Collectors.toUnmodifiableMap(PetType::key, Function.identity()));

    private final String key;
    private final String displayName;
    private final Rarity rarity;

    PetType(String key, String displayName, Rarity rarity) {
        this.key = key;
        this.displayName = displayName;
        this.rarity = rarity;
    }

    public String key()         { return key; }
    public String displayName() { return displayName; }
    public Rarity rarity()      { return rarity; }

    /** Case-insensitive lookup by wire-format key (e.g. "red_panda"). */
    public static Optional<PetType> fromKey(String key) {
        if (key == null) return Optional.empty();
        return Optional.ofNullable(BY_KEY.get(key.toLowerCase()));
    }
}
