package com.enterprisepet.bundle;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Pet-bundle zip layout ({@code computerpets.bundle/v1}) and fail-closed update rules.
 *
 * <p>The backend still does not serve zip bytes. This contract is what a published object
 * under {@code bundle.catalog} must contain, and what a native client checks after the
 * signed CDN GET. Empty catalog stays URL-only: no version claim, no integrity claim.
 */
public final class BundleZipContract {

    public static final String FORMAT = "computerpets.bundle/v1";
    public static final String MANIFEST_NAME = "manifest.json";

    private static final Pattern VERSION = Pattern.compile("^[A-Za-z0-9._+-]{1,64}$");
    private static final Pattern SHA256_HEX = Pattern.compile("^[0-9a-f]{64}$");
    private static final Pattern MEMBER_PATH = Pattern.compile(
            "^(sprites|cries|meta)/[A-Za-z0-9._-]+(?:/[A-Za-z0-9._-]+)*$");

    private static final Set<String> PLATFORMS = Set.of("win", "mac", "linux", "any");

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private BundleZipContract() {}

    public enum UpdateAction {
        /** No catalog version/sha256 — opaque bytes only; not a versioned install. */
        OPAQUE,
        /** Local install already matches the catalog version and sha256. */
        CURRENT,
        /** No local install; zip verified and may be kept. */
        INSTALL,
        /** Local install differs; zip verified and may replace it. */
        REPLACE,
        /** Fail closed — do not keep or extract. */
        REFUSE
    }

    public record Expectation(
            String petKey,
            String version,
            String platform,
            String sha256,
            InstalledBundle local) {

        public Expectation {
            petKey = blankToNull(petKey);
            version = blankToNull(version);
            platform = blankToNull(platform);
            sha256 = blankToNull(sha256);
        }

        public boolean claimsCatalogIntegrity() {
            return version != null || sha256 != null;
        }
    }

    public record InstalledBundle(String petKey, String version, String platform, String sha256) {
        public InstalledBundle {
            petKey = blankToNull(petKey);
            version = blankToNull(version);
            platform = blankToNull(platform);
            sha256 = blankToNull(sha256);
        }
    }

    public record Decision(
            UpdateAction action,
            String error,
            String petKey,
            String version,
            String platform,
            String sha256,
            int memberCount) {

        public boolean accepted() {
            return action == UpdateAction.OPAQUE
                    || action == UpdateAction.CURRENT
                    || action == UpdateAction.INSTALL
                    || action == UpdateAction.REPLACE;
        }
    }

    /**
     * Decide whether zip bytes may become (or stay) the installed bundle.
     *
     * <p>Fail closed when a catalog row claims {@code version} or {@code sha256} and the
     * digest, inner manifest, or member list is missing or wrong. Empty expectation stays
     * opaque (legacy URL-only download).
     */
    public static Decision accept(byte[] zipBytes, Expectation expect) {
        Objects.requireNonNull(expect, "expect");
        if (!expect.claimsCatalogIntegrity()) {
            return new Decision(UpdateAction.OPAQUE, null, null, null, null, null, 0);
        }
        if (expect.sha256() == null) {
            return refuse("bundle_sha256_missing");
        }
        if (!SHA256_HEX.matcher(expect.sha256()).matches()) {
            return refuse("bundle_sha256_missing");
        }
        if (expect.version() == null || !VERSION.matcher(expect.version()).matches()) {
            return refuse("bundle_version_missing");
        }
        if (expect.petKey() == null || expect.petKey().isBlank()) {
            return refuse("bundle_pet_missing");
        }
        if (zipBytes == null || zipBytes.length == 0) {
            return refuse("bundle_zip_missing");
        }

        String digest = sha256Hex(zipBytes);
        if (!constantTimeEquals(digest, expect.sha256())) {
            return refuse("bundle_sha256_mismatch");
        }

        Layout layout;
        try {
            layout = readLayout(zipBytes);
        } catch (BundleZipException ex) {
            return refuse(ex.code());
        }

        if (!expect.petKey().equals(layout.petKey())) {
            return refuse("bundle_pet_mismatch");
        }
        if (!expect.version().equals(layout.version())) {
            return refuse("bundle_version_mismatch");
        }
        if (expect.platform() != null && !expect.platform().equals(layout.platform())) {
            return refuse("bundle_platform_mismatch");
        }

        InstalledBundle local = expect.local();
        if (local != null
                && expect.petKey().equals(local.petKey())
                && expect.version().equals(local.version())
                && expect.sha256().equals(local.sha256())
                && (local.platform() == null || local.platform().equals(layout.platform()))) {
            return new Decision(
                    UpdateAction.CURRENT,
                    null,
                    layout.petKey(),
                    layout.version(),
                    layout.platform(),
                    expect.sha256(),
                    layout.memberCount());
        }

        UpdateAction action = (local == null || local.petKey() == null)
                ? UpdateAction.INSTALL
                : UpdateAction.REPLACE;
        return new Decision(
                action,
                null,
                layout.petKey(),
                layout.version(),
                layout.platform(),
                expect.sha256(),
                layout.memberCount());
    }

    /**
     * True when a local install already matches the catalog row — the CDN GET may be skipped.
     * Still requires a real sha256 claim; never skips on version alone.
     */
    public static boolean alreadyCurrent(Expectation expect) {
        if (expect == null || !expect.claimsCatalogIntegrity()) {
            return false;
        }
        if (expect.sha256() == null || expect.version() == null || expect.petKey() == null) {
            return false;
        }
        if (!SHA256_HEX.matcher(expect.sha256()).matches()) {
            return false;
        }
        InstalledBundle local = expect.local();
        if (local == null || local.sha256() == null || local.version() == null || local.petKey() == null) {
            return false;
        }
        if (!expect.petKey().equals(local.petKey())) {
            return false;
        }
        if (!expect.version().equals(local.version())) {
            return false;
        }
        if (!constantTimeEquals(expect.sha256(), local.sha256())) {
            return false;
        }
        if (expect.platform() != null
                && local.platform() != null
                && !expect.platform().equals(local.platform())) {
            return false;
        }
        return true;
    }

    static Layout readLayout(byte[] zipBytes) throws BundleZipException {
        Map<String, byte[]> members = new LinkedHashMap<>();
        try (ZipInputStream in = new ZipInputStream(new ByteArrayInputStream(zipBytes))) {
            ZipEntry entry;
            while ((entry = in.getNextEntry()) != null) {
                if (entry.isDirectory()) {
                    continue;
                }
                String name = entry.getName();
                if (name == null || name.isBlank()) {
                    throw new BundleZipException("bundle_zip_invalid", "empty zip member name");
                }
                if (name.contains("\\") || name.startsWith("/") || name.contains("..")) {
                    throw new BundleZipException("bundle_zip_invalid", "unsafe zip member path");
                }
                if (members.containsKey(name)) {
                    throw new BundleZipException("bundle_zip_invalid", "duplicate zip member");
                }
                members.put(name, in.readAllBytes());
            }
        } catch (IOException ex) {
            throw new BundleZipException("bundle_zip_invalid", "zip could not be read");
        }
        if (members.isEmpty()) {
            throw new BundleZipException("bundle_zip_invalid", "zip is empty");
        }
        byte[] manifestBytes = members.get(MANIFEST_NAME);
        if (manifestBytes == null) {
            throw new BundleZipException("bundle_zip_invalid", "manifest.json missing at zip root");
        }

        JsonNode root;
        try {
            root = MAPPER.readTree(manifestBytes);
        } catch (IOException ex) {
            throw new BundleZipException("bundle_zip_invalid", "manifest.json is not JSON");
        }
        if (root == null || !root.isObject()) {
            throw new BundleZipException("bundle_zip_invalid", "manifest.json must be an object");
        }

        String format = text(root, "format");
        if (!FORMAT.equals(format)) {
            throw new BundleZipException("bundle_zip_invalid", "unsupported bundle format");
        }
        String petKey = text(root, "petKey");
        if (petKey == null || petKey.isBlank()) {
            throw new BundleZipException("bundle_zip_invalid", "manifest petKey missing");
        }
        petKey = petKey.trim().toLowerCase(Locale.ROOT);
        String version = text(root, "version");
        if (version == null || !VERSION.matcher(version).matches()) {
            throw new BundleZipException("bundle_zip_invalid", "manifest version invalid");
        }
        String platform = text(root, "platform");
        if (platform == null || !PLATFORMS.contains(platform)) {
            throw new BundleZipException("bundle_zip_invalid", "manifest platform invalid");
        }

        JsonNode files = root.get("files");
        if (files == null || !files.isArray() || files.isEmpty()) {
            throw new BundleZipException("bundle_zip_invalid", "manifest files missing");
        }

        Set<String> declared = new LinkedHashSet<>();
        boolean hasSprite = false;
        for (JsonNode row : files) {
            if (row == null || !row.isObject()) {
                throw new BundleZipException("bundle_zip_invalid", "manifest files row invalid");
            }
            String path = text(row, "path");
            String fileSha = text(row, "sha256");
            if (path == null || !MEMBER_PATH.matcher(path).matches()) {
                throw new BundleZipException("bundle_zip_invalid", "manifest file path invalid");
            }
            if (fileSha == null || !SHA256_HEX.matcher(fileSha).matches()) {
                throw new BundleZipException("bundle_zip_invalid", "manifest file sha256 invalid");
            }
            if (!declared.add(path)) {
                throw new BundleZipException("bundle_zip_invalid", "duplicate manifest file path");
            }
            byte[] body = members.get(path);
            if (body == null) {
                throw new BundleZipException("bundle_zip_invalid", "declared file missing from zip");
            }
            if (!constantTimeEquals(sha256Hex(body), fileSha)) {
                throw new BundleZipException("bundle_zip_invalid", "member sha256 mismatch");
            }
            if (path.startsWith("sprites/")) {
                hasSprite = true;
            }
        }
        if (!hasSprite) {
            throw new BundleZipException("bundle_zip_invalid", "bundle needs at least one sprites/ member");
        }

        for (String name : members.keySet()) {
            if (MANIFEST_NAME.equals(name)) {
                continue;
            }
            if (!declared.contains(name)) {
                throw new BundleZipException("bundle_zip_invalid", "undeclared zip member");
            }
        }

        // Reject absolute / traversal already handled; also reject unexpected top-level keys
        // beyond the contract fields so a storefront payload cannot hide here.
        Iterator<String> fields = root.fieldNames();
        Set<String> allowed = Set.of("format", "petKey", "version", "platform", "files");
        while (fields.hasNext()) {
            String field = fields.next();
            if (!allowed.contains(field)) {
                throw new BundleZipException("bundle_zip_invalid", "manifest has unknown field");
            }
        }

        return new Layout(petKey, version, platform, declared.size());
    }

    public static String sha256Hex(byte[] bytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(bytes));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 unavailable", ex);
        }
    }

    static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        byte[] left = a.getBytes(StandardCharsets.UTF_8);
        byte[] right = b.getBytes(StandardCharsets.UTF_8);
        if (left.length != right.length) {
            int len = Math.max(left.length, right.length);
            int diff = left.length ^ right.length;
            for (int i = 0; i < len; i++) {
                byte lb = i < left.length ? left[i] : 0;
                byte rb = i < right.length ? right[i] : 0;
                diff |= lb ^ rb;
            }
            return false;
        }
        int diff = 0;
        for (int i = 0; i < left.length; i++) {
            diff |= left[i] ^ right[i];
        }
        return diff == 0;
    }

    private static Decision refuse(String code) {
        return new Decision(UpdateAction.REFUSE, code, null, null, null, null, 0);
    }

    private static String text(JsonNode node, String field) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull() || !value.isTextual()) {
            return null;
        }
        String text = value.asText();
        return text == null ? null : text.trim();
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    record Layout(String petKey, String version, String platform, int memberCount) {}

    static final class BundleZipException extends Exception {
        private final String code;

        BundleZipException(String code, String message) {
            super(message);
            this.code = code;
        }

        String code() {
            return code;
        }
    }
}
