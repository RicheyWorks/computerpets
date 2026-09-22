package com.enterprisepet.bundle;

import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Issues and redeems one-time, optionally IP-bound download grants on the jti foundation.
 *
 * <p>Issue runs after license validation on {@code POST /api/download/{pet}}. Redeem is
 * what an edge worker (or this backend as download proxy) calls before serving bytes.
 * A second redeem of the same {@code jti}+{@code exp} denies with a clear error; the
 * house does not silently re-open that grant.
 */
@Service
public class DownloadGrantService {

    private final PetBundleService bundleService;
    private final DownloadGrantIndex grantIndex;

    public DownloadGrantService(PetBundleService bundleService, DownloadGrantIndex grantIndex) {
        this.bundleService = bundleService;
        this.grantIndex = grantIndex;
    }

    /**
     * Register the signed URL as an open one-time grant bound to {@code boundIp}.
     *
     * @throws DownloadGrantUnavailableException when the grant store is down
     */
    public void issue(PetBundleService.BundleManifest manifest, String jti, String boundIp) {
        if (manifest == null || jti == null || jti.isBlank()) {
            throw new IllegalArgumentException("manifest and jti are required to issue a download grant");
        }
        grantIndex.issue(
            jti,
            manifest.expEpochSeconds(),
            boundIp == null ? "" : boundIp,
            PetBundleService.DOWNLOAD_URL_TTL
        );
    }

    /**
     * Verify HMAC + expiry, then atomically redeem. Does not re-issue.
     */
    public RedeemOutcome redeem(String petKey, String owner, String jti, long expEpochSeconds,
                                String sig, String requestIp) {
        if (petKey == null || petKey.isBlank() || owner == null || owner.isBlank()
                || jti == null || jti.isBlank() || sig == null || sig.isBlank()) {
            return RedeemOutcome.INVALID_SIGNATURE;
        }
        if (expEpochSeconds <= Instant.now().getEpochSecond()) {
            return RedeemOutcome.EXPIRED;
        }
        if (!bundleService.signatureMatches(petKey, owner, jti, expEpochSeconds, sig)) {
            return RedeemOutcome.INVALID_SIGNATURE;
        }
        DownloadGrantIndex.RedeemResult result = grantIndex.tryRedeem(jti, expEpochSeconds, requestIp);
        return switch (result) {
            case OK -> RedeemOutcome.ALLOWED;
            case ALREADY_USED -> RedeemOutcome.ALREADY_USED;
            case ADDRESS_MISMATCH -> RedeemOutcome.ADDRESS_MISMATCH;
            case UNKNOWN -> RedeemOutcome.UNKNOWN;
        };
    }

    public enum RedeemOutcome {
        ALLOWED,
        INVALID_SIGNATURE,
        EXPIRED,
        ALREADY_USED,
        ADDRESS_MISMATCH,
        UNKNOWN
    }
}
