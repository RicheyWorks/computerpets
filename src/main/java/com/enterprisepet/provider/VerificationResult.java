package com.enterprisepet.provider;

/**
 * Outcome of an {@link OwnershipProvider#verify} call.
 *
 * <p>{@code ownerId} is whatever stable identifier the provider knows the user by
 * (Steam ID, wallet address, Microsoft account ID). It becomes the license's
 * {@code owner} field.
 *
 * <p>{@code petKey} is an optional entitlement hint. NFT collections that bind
 * {@code tokenId → pet} populate it so the verify endpoint issues a license for
 * the token's pet rather than whatever the client asked for.
 *
 * <p>{@code clientError} marks fail-closed request-shape failures (length /
 * charset / missing required fields). {@link com.enterprisepet.controller.VerifyController}
 * maps those to HTTP 400. Ownership denies stay {@code clientError=false} → 403.
 */
public record VerificationResult(
        boolean verified,
        String ownerId,
        String reason,
        String petKey,
        boolean clientError
) {

    public static VerificationResult granted(String ownerId) {
        return new VerificationResult(true, ownerId, null, null, false);
    }

    public static VerificationResult granted(String ownerId, String petKey) {
        return new VerificationResult(true, ownerId, null, petKey, false);
    }

    public static VerificationResult denied(String reason) {
        return new VerificationResult(false, null, reason, null, false);
    }

    /**
     * Client request is unusable (missing/malformed fields). Never means
     * "provider said no" — that is {@link #denied(String)}.
     */
    public static VerificationResult invalid(String reason) {
        return new VerificationResult(false, null, reason, null, true);
    }
}
