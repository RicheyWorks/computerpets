package com.enterprisepet.bundle;

import com.enterprisepet.pet.PetType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Validated, in-memory view of {@code bundle.catalog}.
 *
 * <p>Unknown {@code petKey} values, placeholder hashes, and duplicate
 * {@code petKey}+{@code platform} rows fail the process at startup so a
 * typo cannot ship. An empty list is current behavior: signed URL, no
 * version or sha256 claim.
 */
@Component
public class BundleCatalog {

    private static final Logger log = LoggerFactory.getLogger(BundleCatalog.class);

    private static final Pattern SHA256_HEX = Pattern.compile("^[0-9a-f]{64}$");
    private static final Pattern VERSION = Pattern.compile("^[A-Za-z0-9._+-]{1,64}$");
    private static final Pattern OBJECT_KEY = Pattern.compile("^[A-Za-z0-9._-]+(?:/[A-Za-z0-9._-]+)*$");

    private static final Set<String> SHA256_PLACEHOLDERS = Set.of(
            "change_me",
            "changeme",
            "placeholder",
            "todo",
            "your_sha256",
            "insert_sha256_here"
    );

    private final BundlePlatform defaultPlatform;
    private final Map<String, List<Artifact>> byPet;

    public BundleCatalog(BundleProperties props) {
        this.defaultPlatform = BundlePlatform.from(props.getDefaultPlatform())
                .orElseThrow(() -> new IllegalStateException(
                        "bundle.default-platform must be one of " + BundlePlatform.validCsv()
                                + " (got '" + props.getDefaultPlatform() + "')"));

        List<BundleProperties.CatalogEntry> raw = props.getCatalog() == null
                ? List.of()
                : props.getCatalog();

        Map<String, List<BundleProperties.CatalogEntry>> grouped = new LinkedHashMap<>();
        for (int i = 0; i < raw.size(); i++) {
            BundleProperties.CatalogEntry entry = raw.get(i);
            String petKey = requirePetKey(entry, i);
            grouped.computeIfAbsent(petKey, k -> new ArrayList<>()).add(entry);
        }

        Map<String, List<Artifact>> index = new LinkedHashMap<>();
        for (Map.Entry<String, List<BundleProperties.CatalogEntry>> group : grouped.entrySet()) {
            String petKey = group.getKey();
            List<BundleProperties.CatalogEntry> rows = group.getValue();
            boolean single = rows.size() == 1;
            List<Artifact> artifacts = new ArrayList<>(rows.size());
            for (BundleProperties.CatalogEntry entry : rows) {
                artifacts.add(validate(entry, petKey, single));
            }
            failOnDuplicatePlatforms(petKey, artifacts);
            index.put(petKey, List.copyOf(artifacts));
        }
        this.byPet = Map.copyOf(index);

        log.info("BundleCatalog ready. artifacts={} pets={} defaultPlatform={}",
                artifactCount(), byPet.size(), defaultPlatform.wire());
    }

    public static BundleCatalog empty() {
        return new BundleCatalog(new BundleProperties());
    }

    public BundlePlatform defaultPlatform() {
        return defaultPlatform;
    }

    public boolean isEmpty() {
        return byPet.isEmpty();
    }

    public int artifactCount() {
        int n = 0;
        for (List<Artifact> rows : byPet.values()) {
            n += rows.size();
        }
        return n;
    }

    /**
     * Rows published for {@code petKey}, in config order. Unknown or blank
     * keys return an empty list (the pet catalog decides 404 vs 200).
     */
    public List<Artifact> listFor(String petKey) {
        if (petKey == null || petKey.isBlank()) {
            return List.of();
        }
        return byPet.getOrDefault(petKey.toLowerCase(Locale.ROOT), List.of());
    }

    /**
     * Picks one row: a supported client {@code platform} if present, else
     * {@link #defaultPlatform}. No matching row → empty (caller keeps today's
     * {@code {petKey}.zip} URL and must not invent a hash).
     */
    public Optional<Artifact> resolve(String petKey, String requestedPlatform) {
        List<Artifact> rows = listFor(petKey);
        if (rows.isEmpty()) {
            return Optional.empty();
        }
        BundlePlatform wanted = BundlePlatform.from(requestedPlatform).orElse(defaultPlatform);
        return rows.stream()
                .filter(a -> a.platform().equals(wanted.wire()))
                .findFirst();
    }

    private static String requirePetKey(BundleProperties.CatalogEntry entry, int index) {
        String raw = entry == null ? null : entry.getPetKey();
        if (raw == null || raw.isBlank()) {
            throw new IllegalStateException(
                    "bundle.catalog[" + index + "].petKey is blank");
        }
        String key = raw.trim().toLowerCase(Locale.ROOT);
        if (PetType.fromKey(key).isEmpty()) {
            throw new IllegalStateException(
                    "bundle.catalog[" + index + "].petKey '" + raw
                            + "' is not a PetType key. Refusing to start so a typo cannot ship.");
        }
        return key;
    }

    private static Artifact validate(BundleProperties.CatalogEntry entry, String petKey, boolean singleForPet) {
        String version = entry.getVersion() == null ? "" : entry.getVersion().trim();
        if (!VERSION.matcher(version).matches()) {
            throw new IllegalStateException(
                    "bundle.catalog entry " + petKey + " has invalid version '"
                            + entry.getVersion() + "' (semver-ish, no spaces)");
        }

        BundlePlatform platform = BundlePlatform.from(entry.getPlatform())
                .orElseThrow(() -> new IllegalStateException(
                        "bundle.catalog entry " + petKey + " has invalid platform '"
                                + entry.getPlatform() + "'; use " + BundlePlatform.validCsv()));

        String sha256 = requireSha256(petKey, entry.getSha256());
        String path = resolvePath(petKey, platform, version, entry.getPath(), singleForPet);
        return new Artifact(petKey, version, platform.wire(), sha256, path);
    }

    static String requireSha256(String petKey, String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalStateException(
                    "bundle.catalog entry " + petKey + " has an empty sha256");
        }
        String value = raw.trim();
        String folded = value.toLowerCase(Locale.ROOT);
        if (SHA256_PLACEHOLDERS.contains(folded) || folded.contains("change_me")
                || folded.contains("placeholder")) {
            throw new IllegalStateException(
                    "bundle.catalog entry " + petKey + " sha256 looks like a placeholder ('"
                            + raw + "'). Refusing to start. Do not invent a hash for an unpublished zip.");
        }
        if (value.length() < 64) {
            throw new IllegalStateException(
                    "bundle.catalog entry " + petKey + " sha256 is too short ("
                            + value.length() + " chars; need 64 lowercase hex)");
        }
        if (!SHA256_HEX.matcher(value).matches()) {
            throw new IllegalStateException(
                    "bundle.catalog entry " + petKey
                            + " sha256 must be 64 lowercase hex characters");
        }
        return value;
    }

    private static String resolvePath(String petKey, BundlePlatform platform, String version,
                                      String configured, boolean singleForPet) {
        if (configured == null || configured.isBlank()) {
            return singleForPet
                    ? petKey + ".zip"
                    : petKey + "-" + platform.wire() + "-" + version + ".zip";
        }
        String path = configured.trim();
        while (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (path.contains("..") || path.contains("://") || path.contains("?")
                || path.contains("#") || path.contains("\\")) {
            throw new IllegalStateException(
                    "bundle.catalog entry " + petKey + " path '" + configured
                            + "' is not a safe object key");
        }
        if (!OBJECT_KEY.matcher(path).matches()) {
            throw new IllegalStateException(
                    "bundle.catalog entry " + petKey + " path '" + configured
                            + "' must be a relative object key");
        }
        return path;
    }

    private static void failOnDuplicatePlatforms(String petKey, List<Artifact> artifacts) {
        Map<String, Integer> seen = new LinkedHashMap<>();
        for (Artifact artifact : artifacts) {
            Integer prior = seen.put(artifact.platform(), 1);
            if (prior != null) {
                throw new IllegalStateException(
                        "bundle.catalog has two rows for " + petKey + "/" + artifact.platform()
                                + ". Bump version in place; do not ship a duplicate platform.");
            }
        }
    }

    /**
     * One published artifact. {@code path} is the object key under
     * {@code bundle.base-url}; HMAC still signs the pet catalog key.
     */
    public record Artifact(String petKey, String version, String platform, String sha256, String path) {

        public Map<String, Object> toPublicView() {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("version", version);
            row.put("platform", platform);
            row.put("sha256", sha256);
            row.put("path", path);
            return row;
        }
    }
}
