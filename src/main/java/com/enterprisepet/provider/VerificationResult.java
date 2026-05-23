package com.enterprisepet.provider;

/**
 * Outcome of an {@link OwnershipProvider#verify} call.
 *
 * <p>{@code ownerId} is whatever stable identifier the provider knows the user by
 * (Steam ID, wallet address, Microsoft account ID). It becomes the license's
 * {@code owner} field.
 */
public record VerificationResult(boolean verified, String ownerId, String reason) {

    public static VerificationResult granted(String ownerId) {
        return new VerificationResult(true, ownerId, null);
    }

    public static VerificationResult denied(String reason) {
        return new VerificationResult(false, null, reason);
    }
}
