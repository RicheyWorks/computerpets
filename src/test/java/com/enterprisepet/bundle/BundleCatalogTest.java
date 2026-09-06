package com.enterprisepet.bundle;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BundleCatalogTest {

    /** Test fixture only — not a published zip. */
    static final String TEST_SHA256 =
            "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

    @Test
    @DisplayName("empty catalog is current behavior")
    void emptyCatalog_isEmpty() {
        BundleCatalog catalog = BundleCatalog.empty();
        assertThat(catalog.isEmpty()).isTrue();
        assertThat(catalog.defaultPlatform()).isEqualTo(BundlePlatform.WIN);
        assertThat(catalog.resolve("red_panda", "win")).isEmpty();
    }

    @Test
    @DisplayName("unknown petKey in catalog config fails startup")
    void unknownPetKey_failsHard() {
        BundleProperties props = props("not_a_real_pet", "1.0.0", "win", TEST_SHA256, null);

        assertThatThrownBy(() -> new BundleCatalog(props))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not_a_real_pet")
                .hasMessageContaining("PetType");
    }

    @Test
    @DisplayName("placeholder sha256 is rejected")
    void placeholderSha256_failsHard() {
        assertThatThrownBy(() -> new BundleCatalog(props("red_panda", "1.0.0", "win", "CHANGE_ME", null)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("placeholder");

        assertThatThrownBy(() -> new BundleCatalog(props("red_panda", "1.0.0", "win", "", null)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("empty sha256");

        assertThatThrownBy(() -> new BundleCatalog(props("red_panda", "1.0.0", "win", "abcd", null)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("too short");
    }

    @Test
    @DisplayName("uppercase hex sha256 is rejected")
    void uppercaseSha256_failsHard() {
        assertThatThrownBy(() -> new BundleCatalog(
                props("red_panda", "1.0.0", "win", TEST_SHA256.toUpperCase(), null)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("lowercase hex");
    }

    @Test
    @DisplayName("invalid default-platform fails startup")
    void invalidDefaultPlatform_failsHard() {
        BundleProperties props = new BundleProperties();
        props.setDefaultPlatform("ios");

        assertThatThrownBy(() -> new BundleCatalog(props))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("default-platform");
    }

    @Test
    @DisplayName("single artifact defaults path to {petKey}.zip")
    void singleArtifact_defaultPath() {
        BundleCatalog catalog = new BundleCatalog(props("red_panda", "1.0.0", "win", TEST_SHA256, null));

        BundleCatalog.Artifact row = catalog.resolve("red_panda", "win").orElseThrow();
        assertThat(row.path()).isEqualTo("red_panda.zip");
        assertThat(row.sha256()).isEqualTo(TEST_SHA256);
        assertThat(row.version()).isEqualTo("1.0.0");
    }

    @Test
    @DisplayName("multiple platforms default path to {petKey}-{platform}-{version}.zip")
    void multipleArtifacts_defaultPathIncludesPlatform() {
        BundleProperties props = new BundleProperties();
        props.setCatalog(List.of(
                entry("red_panda", "1.0.0", "win", TEST_SHA256, null),
                entry("red_panda", "1.0.0", "mac", TEST_SHA256, null)
        ));
        BundleCatalog catalog = new BundleCatalog(props);

        assertThat(catalog.resolve("red_panda", "win").orElseThrow().path())
                .isEqualTo("red_panda-win-1.0.0.zip");
        assertThat(catalog.resolve("red_panda", "mac").orElseThrow().path())
                .isEqualTo("red_panda-mac-1.0.0.zip");
    }

    @Test
    @DisplayName("omitted platform uses bundle.default-platform")
    void omittedPlatform_usesDefault() {
        BundleCatalog catalog = new BundleCatalog(props("red_panda", "1.0.0", "win", TEST_SHA256, "custom.zip"));

        assertThat(catalog.resolve("red_panda", null).orElseThrow().path()).isEqualTo("custom.zip");
        assertThat(catalog.resolve("red_panda", "  ").orElseThrow().path()).isEqualTo("custom.zip");
    }

    @Test
    @DisplayName("unsupported client platform falls through to default-platform")
    void unsupportedClientPlatform_usesDefault() {
        BundleCatalog catalog = new BundleCatalog(props("red_panda", "1.0.0", "win", TEST_SHA256, "custom.zip"));

        // ios is not a catalog platform; resolve treats it as omitted → default win
        assertThat(catalog.resolve("red_panda", "ios").orElseThrow().platform()).isEqualTo("win");
    }

    @Test
    @DisplayName("duplicate petKey+platform fails startup")
    void duplicatePlatform_failsHard() {
        BundleProperties props = new BundleProperties();
        props.setCatalog(List.of(
                entry("red_panda", "1.0.0", "win", TEST_SHA256, null),
                entry("red_panda", "1.1.0", "win", TEST_SHA256, null)
        ));

        assertThatThrownBy(() -> new BundleCatalog(props))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("two rows");
    }

    @Test
    @DisplayName("unsafe object path is rejected")
    void unsafePath_failsHard() {
        assertThatThrownBy(() -> new BundleCatalog(
                props("red_panda", "1.0.0", "win", TEST_SHA256, "../secret.zip")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("safe object key");
    }

    private static BundleProperties props(String petKey, String version, String platform,
                                          String sha256, String path) {
        BundleProperties props = new BundleProperties();
        props.setCatalog(List.of(entry(petKey, version, platform, sha256, path)));
        return props;
    }

    private static BundleProperties.CatalogEntry entry(String petKey, String version, String platform,
                                                       String sha256, String path) {
        BundleProperties.CatalogEntry e = new BundleProperties.CatalogEntry();
        e.setPetKey(petKey);
        e.setVersion(version);
        e.setPlatform(platform);
        e.setSha256(sha256);
        e.setPath(path);
        return e;
    }
}
