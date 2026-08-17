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
        service = new PetBundleService();
        ReflectionTestUtils.setField(service, "bundleBaseUrl", BASE_URL);
        ReflectionTestUtils.setField(service, "signingKey", SIGNING_KEY);
        service.init();
    }

    @Test
    @DisplayName("jti-bound URL includes jti query param so an edge worker can rebuild the MAC")
    void manifestFor_includesJtiInUrlAndSignature() throws Exception {
        var manifest = service.manifestFor(PetType.RED_PANDA, "steam:owner", "jti-123");

        URI uri = URI.create(manifest.downloadUrl());
        assertThat(uri.getPath()).isEqualTo("/bundles/red_panda.zip");
        assertThat(uri.getQuery()).contains("owner=steam%3Aowner");
        assertThat(uri.getQuery()).contains("jti=jti-123");
        assertThat(uri.getQuery()).contains("exp=");
        assertThat(uri.getQuery()).contains("sig=");
        assertThat(manifest.body().get("jti")).isEqualTo("jti-123");

        String exp = queryParam(uri.getQuery(), "exp");
        String sig = queryParam(uri.getQuery(), "sig");
        String expected = hmac("red_panda|steam:owner|jti-123|" + exp);
        assertThat(sig).isEqualTo(expected);
    }

    @Test
    @DisplayName("legacy overload without jti signs petKey|owner|exp and omits jti from the URL")
    void manifestFor_withoutJti_omitsJtiFromUrl() throws Exception {
        var manifest = service.manifestFor(PetType.CAT, "owner1");

        URI uri = URI.create(manifest.downloadUrl());
        assertThat(uri.getQuery()).doesNotContain("jti=");
        assertThat(manifest.body()).doesNotContainKey("jti");

        String exp = queryParam(uri.getQuery(), "exp");
        String sig = queryParam(uri.getQuery(), "sig");
        assertThat(sig).isEqualTo(hmac("cat|owner1|" + exp));
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
