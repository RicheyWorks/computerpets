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

/**
 * Builds a signed, short-lived download URL for a pet bundle.
 *
 * <p>In production the actual {@code .zip} would live on S3 / CloudFront / R2 and the URL
 * would be a presigned download. Here we emit a stable URL pattern plus an HMAC-SHA256
 * token over {@code petKey|owner|expiry}, which an edge worker (or this same backend's
 * download proxy) can verify before serving bytes. This keeps the master key off the
 * client and bounds replay to {@link #DOWNLOAD_URL_TTL}.
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
    private static final Duration DOWNLOAD_URL_TTL = Duration.ofMinutes(15);

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    @Value("${bundle.base-url:https://cdn.enterprisepet.example/bundles}")
    private String bundleBaseUrl;

    @Value("${bundle.signing-key}")
    private String signingKey;

    private SecretKeySpec signingKeySpec;

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
        Instant expiresAt = Instant.now().plus(DOWNLOAD_URL_TTL);

        String toSign = (jti == null || jti.isBlank())
            ? pet.key() + "|" + owner + "|" + expiresAt.getEpochSecond()
            : pet.key() + "|" + owner + "|" + jti + "|" + expiresAt.getEpochSecond();

        String token = sign(toSign);

        String url = String.format(
            "%s/%s.zip?owner=%s&exp=%d&sig=%s",
            stripTrailingSlash(bundleBaseUrl),
            pet.key(),
            urlEncode(owner),
            expiresAt.getEpochSecond(),
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

        return new BundleManifest(pet.key(), url, expiresAt.toString(), manifest);
    }

    /** Backward-compatible overload (jti omitted). */
    public BundleManifest manifestFor(PetType pet, String owner) {
        return manifestFor(pet, owner, null);
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

    /** Returned to the client; {@code body} is the JSON-friendly view for serialization. */
    public record BundleManifest(String petKey, String downloadUrl, String expiresAt, Map<String, Object> body) {}
}
