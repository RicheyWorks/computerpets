package com.enterprisepet.bundle;

import com.enterprisepet.pet.PetType;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Builds a signed, short-lived download URL for a pet bundle.
 *
 * <p>In production the actual {@code .zip} would live on S3 / CloudFront / R2 and the URL
 * would be a presigned download. Here we emit a stable URL pattern plus an HMAC-SHA256
 * token over {@code petKey|owner|jti|exp}, which an edge worker calls house redeem to
 * verify before serving bytes ({@code deploy/cdn/edge-redeem.js}; ADR 0063). The URL
 * also carries {@code pet=} so redeem works when the object key is a catalog path.
 * This keeps the master key off the client and bounds replay to {@link #DOWNLOAD_URL_TTL}.
 *
 * <p>When {@link BundleCatalog} has a matching row the manifest also carries
 * {@code version}, {@code platform}, and {@code sha256}. Those fields are omitted
 * when the catalog is empty or no row matches — this service does not invent a hash.
 * The HMAC always signs the pet catalog key, never the object filename.
 */
@Service
public class PetBundleService {

    private static final Logger log = LoggerFactory.getLogger(PetBundleService.class);

    /** Reject these as obvious placeholders left over from documentation. */
    private static final String[] PLACEHOLDER_KEYS = {
        "CHANGE_ME_BUNDLE_SIGNING_KEY",
        "CHANGE_ME",
        "PLACEHOLDER",
        ""
    };

    /** How long a signed download URL is valid for. */
    public static final Duration DOWNLOAD_URL_TTL = Duration.ofMinutes(15);

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    @Value("${bundle.base-url:https://cdn.enterprisepet.example/bundles}")
    private String bundleBaseUrl;

    @Value("${bundle.signing-key}")
    private String signingKey;

    private final BundleCatalog catalog;

    private SecretKeySpec signingKeySpec;

    public PetBundleService(BundleCatalog catalog) {
        this.catalog = catalog == null ? BundleCatalog.empty() : catalog;
    }

    @PostConstruct
    void init() {
        if (signingKey == null) {
            throw new IllegalStateException(
                "bundle.signing-key is not configured. Set BUNDLE_SIGNING_KEY to a "
                + "random secret (openssl rand -base64 48).");
        }
        for (String placeholder : PLACEHOLDER_KEYS) {
            if (placeholder.equals(signingKey)) {
                throw new IllegalStateException(
                    "bundle.signing-key looks like a placeholder ('" + placeholder
                    + "'). Refusing to start. Set BUNDLE_SIGNING_KEY to a real secret.");
            }
        }
        this.signingKeySpec = new SecretKeySpec(
            signingKey.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
        log.info("PetBundleService ready. baseUrl={}, ttl={}", bundleBaseUrl, DOWNLOAD_URL_TTL);
    }

    /**
     * Returns a manifest describing where to fetch the pet bundle and how long the URL
     * stays valid. Callers should already have validated the license.
     *
     * <p>When {@code jti} is supplied the signature includes it: {@code petKey|owner|jti|exp}.
     * This binds the short-lived signed URL to a specific license instance (Phase 2.1 jti hardening).
     */
    public BundleManifest manifestFor(PetType pet, String owner, String jti) {
        return manifestFor(pet, owner, jti, null);
    }

    /**
     * @param platform client-requested platform ({@code win}/{@code mac}/{@code linux}/{@code any});
     *                 blank or unknown falls through to {@code bundle.default-platform}
     */
    public BundleManifest manifestFor(PetType pet, String owner, String jti, String platform) {
        Instant expiresAt = Instant.now().plus(DOWNLOAD_URL_TTL);
        long expEpoch = expiresAt.getEpochSecond();

        String toSign = macInput(pet.key(), owner, jti, expEpoch);
        String token = sign(toSign);

        Optional<BundleCatalog.Artifact> artifact = catalog.resolve(pet.key(), platform);
        String objectKey = artifact.map(BundleCatalog.Artifact::path).orElse(pet.key() + ".zip");

        // jti must appear on the URL when it is in the MAC, otherwise an edge
        // worker cannot reconstruct petKey|owner|jti|exp from query params.
        // pet= carries the catalog key so edge redeem works when object-key is
        // a catalog path (e.g. red_panda-win-1.0.0.zip), not only {petKey}.zip.
        // Do not scrub owner/jti/exp/sig/pet for presence theater.
        String url = (jti == null || jti.isBlank())
            ? String.format(
                "%s/%s?pet=%s&owner=%s&exp=%d&sig=%s",
                stripTrailingSlash(bundleBaseUrl),
                objectKey,
                urlEncode(pet.key()),
                urlEncode(owner),
                expEpoch,
                token
            )
            : String.format(
                "%s/%s?pet=%s&owner=%s&jti=%s&exp=%d&sig=%s",
                stripTrailingSlash(bundleBaseUrl),
                objectKey,
                urlEncode(pet.key()),
                urlEncode(owner),
                urlEncode(jti),
                expEpoch,
                token
            );

        Map<String, Object> manifest = new LinkedHashMap<>();
        manifest.put("petKey", pet.key());
        manifest.put("displayName", pet.displayName());
        manifest.put("rarity", pet.rarity().name());
        manifest.put("downloadUrl", url);
        manifest.put("expiresAt", expiresAt.toString());
        manifest.put("ttlSeconds", DOWNLOAD_URL_TTL.toSeconds());
        if (jti != null) {
            manifest.put("jti", jti); // helpful for clients that want to correlate
        }
        artifact.ifPresent(a -> {
            manifest.put("version", a.version());
            manifest.put("platform", a.platform());
            manifest.put("sha256", a.sha256());
            manifest.put("filename", a.path());
        });

        return new BundleManifest(pet.key(), url, expiresAt.toString(), expEpoch, manifest);
    }

    /**
     * True when {@code sig} matches the HMAC over {@code petKey|owner|jti|exp}
     * (or {@code petKey|owner|exp} when {@code jti} is blank). Constant-time compare.
     */
    public boolean signatureMatches(String petKey, String owner, String jti, long expEpochSeconds, String sig) {
        if (petKey == null || petKey.isBlank() || owner == null || sig == null || sig.isBlank()) {
            return false;
        }
        String expected = sign(macInput(petKey, owner, jti, expEpochSeconds));
        return constantTimeEquals(expected, sig);
    }

    static String macInput(String petKey, String owner, String jti, long expEpochSeconds) {
        if (jti == null || jti.isBlank()) {
            return petKey + "|" + owner + "|" + expEpochSeconds;
        }
        return petKey + "|" + owner + "|" + jti + "|" + expEpochSeconds;
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        byte[] left = a.getBytes(StandardCharsets.UTF_8);
        byte[] right = b.getBytes(StandardCharsets.UTF_8);
        if (left.length != right.length) {
            // Still walk the longer side so length leaks less wall time.
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

    /** Backward-compatible overload (jti omitted). */
    public BundleManifest manifestFor(PetType pet, String owner) {
        return manifestFor(pet, owner, null, null);
    }

    private String sign(String input) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(signingKeySpec);
            byte[] sig = mac.doFinal(input.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(sig);
        } catch (Exception e) {
            throw new RuntimeException("Failed to sign bundle URL", e);
        }
    }

    private static String stripTrailingSlash(String s) {
        return s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }

    private static String urlEncode(String s) {
        return java.net.URLEncoder.encode(s == null ? "" : s, StandardCharsets.UTF_8);
    }

    /**
     * Returned to the client; {@code body} is the JSON-friendly view for serialization.
     * {@code expEpochSeconds} is the same {@code exp} query value on {@code downloadUrl}.
     */
    public record BundleManifest(
            String petKey,
            String downloadUrl,
            String expiresAt,
            long expEpochSeconds,
            Map<String, Object> body) {}
}
