package com.enterprisepet.bundle;

import com.enterprisepet.pet.PetType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

class PetBundleServiceTest {

    private static final String SIGNING_KEY = "test-bundle-signing-key-not-a-placeholder";
    private static final String BASE_URL = "https://cdn.example.com/bundles";

    private PetBundleService service;

    @BeforeEach
    void setUp() {
        service = serviceWith(BundleCatalog.empty());
    }

    private static PetBundleService serviceWith(BundleCatalog catalog) {
        PetBundleService s = new PetBundleService(catalog);
        ReflectionTestUtils.setField(s, "bundleBaseUrl", BASE_URL);
        ReflectionTestUtils.setField(s, "signingKey", SIGNING_KEY);
        s.init();
        return s;
    }

    @Test
    @DisplayName("jti-bound URL includes jti query param so an edge worker can rebuild the MAC")
    void manifestFor_includesJtiInUrlAndSignature() throws Exception {
        var manifest = service.manifestFor(PetType.RED_PANDA, "steam:owner", "jti-123");

        String url = manifest.downloadUrl();
        URI uri = URI.create(url);
        assertThat(uri.getPath()).isEqualTo("/bundles/red_panda.zip");
        // URLEncoder uses application/x-www-form-urlencoded (`:` → %3A)
        assertThat(url).contains("owner=steam%3Aowner");
        assertThat(url).contains("jti=jti-123");
        assertThat(manifest.body().get("jti")).isEqualTo("jti-123");

        String exp = queryParam(uri.getRawQuery(), "exp");
        String sig = queryParam(uri.getRawQuery(), "sig");
        String expected = hmac("red_panda|steam:owner|jti-123|" + exp);
        assertThat(sig).isEqualTo(expected);
        assertThat(manifest.body()).doesNotContainKeys("sha256", "version", "platform", "filename");
    }

    @Test
    @DisplayName("legacy overload without jti signs petKey|owner|exp and omits jti from the URL")
    void manifestFor_withoutJti_omitsJtiFromUrl() throws Exception {
        var manifest = service.manifestFor(PetType.CAT, "owner1");

        URI uri = URI.create(manifest.downloadUrl());
        assertThat(uri.getRawQuery()).doesNotContain("jti=");
        assertThat(manifest.body()).doesNotContainKey("jti");

        String exp = queryParam(uri.getRawQuery(), "exp");
        String sig = queryParam(uri.getRawQuery(), "sig");
        assertThat(sig).isEqualTo(hmac("cat|owner1|" + exp));
        assertThat(manifest.body()).doesNotContainKeys("sha256", "version", "platform", "filename");
    }

    @Test
    @DisplayName("catalog row adds version/platform/sha256 and uses the catalog path; HMAC still signs petKey")
    void manifestFor_catalogRow_usesPathAndKeepsPetKeyInMac() throws Exception {
        // Test fixture hash — not a published zip.
        String testSha = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
        BundleProperties props = new BundleProperties();
        BundleProperties.CatalogEntry entry = new BundleProperties.CatalogEntry();
        entry.setPetKey("red_panda");
        entry.setVersion("1.0.0");
        entry.setPlatform("win");
        entry.setSha256(testSha);
        entry.setPath("red_panda-win-1.0.0.zip");
        props.setCatalog(java.util.List.of(entry));

        PetBundleService cataloged = serviceWith(new BundleCatalog(props));
        var manifest = cataloged.manifestFor(PetType.RED_PANDA, "steam:owner", "jti-123", "win");

        URI uri = URI.create(manifest.downloadUrl());
        assertThat(uri.getPath()).isEqualTo("/bundles/red_panda-win-1.0.0.zip");
        assertThat(manifest.body().get("version")).isEqualTo("1.0.0");
        assertThat(manifest.body().get("platform")).isEqualTo("win");
        assertThat(manifest.body().get("sha256")).isEqualTo(testSha);
        assertThat(manifest.body().get("filename")).isEqualTo("red_panda-win-1.0.0.zip");

        String exp = queryParam(uri.getRawQuery(), "exp");
        String sig = queryParam(uri.getRawQuery(), "sig");
        assertThat(sig).isEqualTo(hmac("red_panda|steam:owner|jti-123|" + exp));
    }

    @Test
    @DisplayName("no matching catalog platform keeps {petKey}.zip and does not claim sha256")
    void manifestFor_noMatchingPlatform_omitsHash() {
        String testSha = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
        BundleProperties props = new BundleProperties();
        BundleProperties.CatalogEntry entry = new BundleProperties.CatalogEntry();
        entry.setPetKey("red_panda");
        entry.setVersion("1.0.0");
        entry.setPlatform("win");
        entry.setSha256(testSha);
        props.setCatalog(java.util.List.of(entry));

        PetBundleService cataloged = serviceWith(new BundleCatalog(props));
        var manifest = cataloged.manifestFor(PetType.RED_PANDA, "owner", "jti-1", "mac");

        assertThat(manifest.downloadUrl()).contains("/red_panda.zip?");
        assertThat(manifest.body()).doesNotContainKeys("sha256", "version", "platform", "filename");
    }

    private static String queryParam(String query, String name) {
        for (String part : query.split("&")) {
            int eq = part.indexOf('=');
            if (eq > 0 && part.substring(0, eq).equals(name)) {
                return part.substring(eq + 1);
            }
        }
        throw new AssertionError("missing query param " + name);
    }

    private static String hmac(String input) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(SIGNING_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(mac.doFinal(input.getBytes(StandardCharsets.UTF_8)));
    }
}
