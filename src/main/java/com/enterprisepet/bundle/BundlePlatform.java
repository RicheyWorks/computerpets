package com.enterprisepet.bundle;

import java.util.Arrays;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Desktop artifact platforms the bundle catalog will name.
 *
 * <p>{@code any} is a shared pack. Phone/tablet ids are not invented here.
 */
public enum BundlePlatform {
    WIN,
    MAC,
    LINUX,
    ANY;

    public String wire() {
        return name().toLowerCase(Locale.ROOT);
    }

    public static Optional<BundlePlatform> from(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(valueOf(raw.trim().toUpperCase(Locale.ROOT)));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public static String validCsv() {
        return Arrays.stream(values()).map(BundlePlatform::wire).collect(Collectors.joining(", "));
    }
}
