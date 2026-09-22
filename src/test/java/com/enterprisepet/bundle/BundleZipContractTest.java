package com.enterprisepet.bundle;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static org.assertj.core.api.Assertions.assertThat;

class BundleZipContractTest {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Test
    @DisplayName("empty expectation stays opaque — no integrity claim")
    void emptyExpectation_isOpaque() {
        BundleZipContract.Decision decision = BundleZipContract.accept(
                new byte[] {1, 2, 3},
                new BundleZipContract.Expectation(null, null, null, null, null));
        assertThat(decision.action()).isEqualTo(BundleZipContract.UpdateAction.OPAQUE);
        assertThat(decision.accepted()).isTrue();
    }

    @Test
    @DisplayName("version without sha256 refuses")
    void versionWithoutSha_refuses() {
        BundleZipContract.Decision decision = BundleZipContract.accept(
                new byte[] {1},
                new BundleZipContract.Expectation("red_panda", "1.0.0", "win", null, null));
        assertThat(decision.action()).isEqualTo(BundleZipContract.UpdateAction.REFUSE);
        assertThat(decision.error()).isEqualTo("bundle_sha256_missing");
    }

    @Test
    @DisplayName("sha256 mismatch refuses")
    void shaMismatch_refuses() throws Exception {
        Fixture zip = goodZip("red_panda", "1.0.0", "win");
        String wrong = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
        BundleZipContract.Decision decision = BundleZipContract.accept(
                zip.bytes(),
                new BundleZipContract.Expectation("red_panda", "1.0.0", "win", wrong, null));
        assertThat(decision.error()).isEqualTo("bundle_sha256_mismatch");
    }

    @Test
    @DisplayName("valid zip with catalog row installs")
    void validZip_installs() throws Exception {
        Fixture zip = goodZip("red_panda", "1.0.0", "win");
        BundleZipContract.Decision decision = BundleZipContract.accept(
                zip.bytes(),
                new BundleZipContract.Expectation("red_panda", "1.0.0", "win", zip.sha256(), null));
        assertThat(decision.action()).isEqualTo(BundleZipContract.UpdateAction.INSTALL);
        assertThat(decision.petKey()).isEqualTo("red_panda");
        assertThat(decision.version()).isEqualTo("1.0.0");
        assertThat(decision.platform()).isEqualTo("win");
        assertThat(decision.sha256()).isEqualTo(zip.sha256());
        assertThat(decision.memberCount()).isEqualTo(1);
    }

    @Test
    @DisplayName("matching local install is current and alreadyCurrent skips CDN")
    void matchingLocal_isCurrent() throws Exception {
        Fixture zip = goodZip("red_panda", "1.0.0", "win");
        BundleZipContract.InstalledBundle local = new BundleZipContract.InstalledBundle(
                "red_panda", "1.0.0", "win", zip.sha256());
        BundleZipContract.Expectation expect = new BundleZipContract.Expectation(
                "red_panda", "1.0.0", "win", zip.sha256(), local);
        assertThat(BundleZipContract.alreadyCurrent(expect)).isTrue();

        BundleZipContract.Decision decision = BundleZipContract.accept(zip.bytes(), expect);
        assertThat(decision.action()).isEqualTo(BundleZipContract.UpdateAction.CURRENT);
    }

    @Test
    @DisplayName("newer catalog version replaces local")
    void newerVersion_replaces() throws Exception {
        Fixture zip = goodZip("red_panda", "1.1.0", "win");
        BundleZipContract.InstalledBundle local = new BundleZipContract.InstalledBundle(
                "red_panda",
                "1.0.0",
                "win",
                "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
        BundleZipContract.Decision decision = BundleZipContract.accept(
                zip.bytes(),
                new BundleZipContract.Expectation("red_panda", "1.1.0", "win", zip.sha256(), local));
        assertThat(decision.action()).isEqualTo(BundleZipContract.UpdateAction.REPLACE);
    }

    @Test
    @DisplayName("missing manifest refuses")
    void missingManifest_refuses() throws Exception {
        byte[] bytes = zipOf(Map.of("sprites/sit/1.png", new byte[] {1, 2, 3, 4}));
        String sha = BundleZipContract.sha256Hex(bytes);
        BundleZipContract.Decision decision = BundleZipContract.accept(
                bytes,
                new BundleZipContract.Expectation("red_panda", "1.0.0", "win", sha, null));
        assertThat(decision.error()).isEqualTo("bundle_zip_invalid");
    }

    @Test
    @DisplayName("undeclared member refuses")
    void undeclaredMember_refuses() throws Exception {
        Fixture zip = goodZip("red_panda", "1.0.0", "win");
        Map<String, byte[]> members = new LinkedHashMap<>(zip.members());
        members.put("meta/extra.txt", "nope".getBytes(StandardCharsets.UTF_8));
        byte[] bytes = zipOf(members);
        String sha = BundleZipContract.sha256Hex(bytes);
        BundleZipContract.Decision decision = BundleZipContract.accept(
                bytes,
                new BundleZipContract.Expectation("red_panda", "1.0.0", "win", sha, null));
        assertThat(decision.error()).isEqualTo("bundle_zip_invalid");
    }

    @Test
    @DisplayName("storefront unknown manifest field refuses")
    void unknownManifestField_refuses() throws Exception {
        byte[] sprite = new byte[] {9, 8, 7, 6};
        ObjectNode manifest = baseManifest("red_panda", "1.0.0", "win");
        manifest.put("price", "9.99");
        ArrayNode files = manifest.putArray("files");
        ObjectNode row = files.addObject();
        row.put("path", "sprites/sit/1.png");
        row.put("sha256", BundleZipContract.sha256Hex(sprite));
        Map<String, byte[]> members = new LinkedHashMap<>();
        members.put(BundleZipContract.MANIFEST_NAME, MAPPER.writeValueAsBytes(manifest));
        members.put("sprites/sit/1.png", sprite);
        byte[] bytes = zipOf(members);
        String sha = BundleZipContract.sha256Hex(bytes);
        BundleZipContract.Decision decision = BundleZipContract.accept(
                bytes,
                new BundleZipContract.Expectation("red_panda", "1.0.0", "win", sha, null));
        assertThat(decision.error()).isEqualTo("bundle_zip_invalid");
    }

    @Test
    @DisplayName("inner petKey mismatch refuses")
    void petMismatch_refuses() throws Exception {
        Fixture zip = goodZip("red_panda", "1.0.0", "win");
        BundleZipContract.Decision decision = BundleZipContract.accept(
                zip.bytes(),
                new BundleZipContract.Expectation("cat", "1.0.0", "win", zip.sha256(), null));
        assertThat(decision.error()).isEqualTo("bundle_pet_mismatch");
    }

    private static Fixture goodZip(String petKey, String version, String platform) throws Exception {
        byte[] sprite = new byte[] {1, 2, 3, 4, 5};
        ObjectNode manifest = baseManifest(petKey, version, platform);
        ArrayNode files = manifest.putArray("files");
        ObjectNode row = files.addObject();
        row.put("path", "sprites/sit/1.png");
        row.put("sha256", BundleZipContract.sha256Hex(sprite));
        Map<String, byte[]> members = new LinkedHashMap<>();
        members.put(BundleZipContract.MANIFEST_NAME, MAPPER.writeValueAsBytes(manifest));
        members.put("sprites/sit/1.png", sprite);
        byte[] bytes = zipOf(members);
        return new Fixture(bytes, BundleZipContract.sha256Hex(bytes), members);
    }

    private static ObjectNode baseManifest(String petKey, String version, String platform) {
        ObjectNode manifest = MAPPER.createObjectNode();
        manifest.put("format", BundleZipContract.FORMAT);
        manifest.put("petKey", petKey);
        manifest.put("version", version);
        manifest.put("platform", platform);
        return manifest;
    }

    private static byte[] zipOf(Map<String, byte[]> members) throws IOException {
        ByteArrayOutputStream raw = new ByteArrayOutputStream();
        try (ZipOutputStream out = new ZipOutputStream(raw)) {
            for (Map.Entry<String, byte[]> entry : members.entrySet()) {
                out.putNextEntry(new ZipEntry(entry.getKey()));
                out.write(entry.getValue());
                out.closeEntry();
            }
        }
        return raw.toByteArray();
    }

    private record Fixture(byte[] bytes, String sha256, Map<String, byte[]> members) {}
}
