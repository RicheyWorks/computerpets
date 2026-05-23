package com.enterprisepet.provider;

import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Holds every {@link OwnershipProvider} bean and looks them up by wire-format key.
 *
 * <p>Spring injects the full list of providers; we index them by {@link OwnershipProvider#key()}
 * on construction. Iteration order matches discovery order, which is stable per JVM.
 */
@Service
public class ProviderRegistry {

    private final Map<String, OwnershipProvider> byKey;

    public ProviderRegistry(List<OwnershipProvider> providers) {
        Map<String, OwnershipProvider> map = new LinkedHashMap<>();
        for (OwnershipProvider p : providers) {
            OwnershipProvider previous = map.putIfAbsent(p.key().toLowerCase(), p);
            if (previous != null) {
                throw new IllegalStateException(
                    "Duplicate OwnershipProvider key '" + p.key() + "': "
                    + previous.getClass().getName() + " and " + p.getClass().getName());
            }
        }
        this.byKey = Map.copyOf(map);
    }

    /** All registered providers, in discovery order. */
    public Collection<OwnershipProvider> all() {
        return byKey.values();
    }

    /** Case-insensitive lookup; empty if no provider is registered under that key. */
    public Optional<OwnershipProvider> find(String key) {
        if (key == null) return Optional.empty();
        return Optional.ofNullable(byKey.get(key.toLowerCase()));
    }

    /** Comma-separated list of valid keys, for use in error messages. */
    public String validKeysCsv() {
        return String.join(", ", byKey.keySet());
    }
}
