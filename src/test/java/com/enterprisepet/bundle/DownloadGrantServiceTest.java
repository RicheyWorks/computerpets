package com.enterprisepet.bundle;

import com.enterprisepet.pet.PetType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class DownloadGrantServiceTest {

    private static final String SIGNING_KEY = "test-bundle-signing-key-not-a-placeholder";
    private static final String BASE_URL = "https://cdn.example.com/bundles";

    private PetBundleService bundleService;
    private InMemoryDownloadGrantIndex index;
    private DownloadGrantService grants;

    @BeforeEach
    void setUp() {
        bundleService = new PetBundleService(BundleCatalog.empty());
        ReflectionTestUtils.setField(bundleService, "bundleBaseUrl", BASE_URL);
        ReflectionTestUtils.setField(bundleService, "signingKey", SIGNING_KEY);
        bundleService.init();
        index = new InMemoryDownloadGrantIndex();
        grants = new DownloadGrantService(bundleService, index);
    }

    @Test
    @DisplayName("issue then redeem once; second redeem is already used")
    void redeem_secondUse_denies() {
        var manifest = bundleService.manifestFor(PetType.RED_PANDA, "steam:owner", "jti-abc");
        grants.issue(manifest, "jti-abc", "203.0.113.9");

        assertThat(grants.redeem(
            "red_panda", "steam:owner", "jti-abc", manifest.expEpochSeconds(),
            sigFrom(manifest), "203.0.113.9"))
            .isEqualTo(DownloadGrantService.RedeemOutcome.ALLOWED);

        assertThat(grants.redeem(
            "red_panda", "steam:owner", "jti-abc", manifest.expEpochSeconds(),
            sigFrom(manifest), "203.0.113.9"))
            .isEqualTo(DownloadGrantService.RedeemOutcome.ALREADY_USED);
    }

    @Test
    @DisplayName("bad signature denies without consuming")
    void redeem_badSig_doesNotConsume() {
        var manifest = bundleService.manifestFor(PetType.RED_PANDA, "steam:owner", "jti-sig");
        grants.issue(manifest, "jti-sig", "203.0.113.9");

        assertThat(grants.redeem(
            "red_panda", "steam:owner", "jti-sig", manifest.expEpochSeconds(),
            "not-a-real-signature", "203.0.113.9"))
            .isEqualTo(DownloadGrantService.RedeemOutcome.INVALID_SIGNATURE);

        assertThat(grants.redeem(
            "red_panda", "steam:owner", "jti-sig", manifest.expEpochSeconds(),
            sigFrom(manifest), "203.0.113.9"))
            .isEqualTo(DownloadGrantService.RedeemOutcome.ALLOWED);
    }

    @Test
    @DisplayName("address mismatch denies; matching redeem still works")
    void redeem_ipMismatch() {
        var manifest = bundleService.manifestFor(PetType.CAT, "owner1", "jti-ip");
        grants.issue(manifest, "jti-ip", "203.0.113.9");

        assertThat(grants.redeem(
            "cat", "owner1", "jti-ip", manifest.expEpochSeconds(),
            sigFrom(manifest), "198.51.100.7"))
            .isEqualTo(DownloadGrantService.RedeemOutcome.ADDRESS_MISMATCH);

        assertThat(grants.redeem(
            "cat", "owner1", "jti-ip", manifest.expEpochSeconds(),
            sigFrom(manifest), "203.0.113.9"))
            .isEqualTo(DownloadGrantService.RedeemOutcome.ALLOWED);
    }

    @Test
    @DisplayName("expired exp denies before grant store")
    void redeem_expired() {
        long past = Instant.now().getEpochSecond() - 60;
        assertThat(grants.redeem("red_panda", "o", "j", past, "sig", "203.0.113.9"))
            .isEqualTo(DownloadGrantService.RedeemOutcome.EXPIRED);
    }

    private static String sigFrom(PetBundleService.BundleManifest manifest) {
        String query = manifest.downloadUrl().substring(manifest.downloadUrl().indexOf('?') + 1);
        for (String part : query.split("&")) {
            if (part.startsWith("sig=")) {
                return part.substring(4);
            }
        }
        throw new AssertionError("missing sig");
    }
}
