package com.enterprisepet.provider;

import java.util.Map;

/**
 * A pluggable ownership-verification source: Steam, an Ethereum NFT, Microsoft Store, etc.
 *
 * <p>Implementations are Spring beans and are auto-discovered by {@link ProviderRegistry}.
 * Each provider declares a stable wire-format {@link #key()} (e.g. "steam") that clients
 * use when calling {@code POST /api/verify/{provider}}, and parses its own input params
 * out of the request body.
 */
public interface OwnershipProvider {

    /** Stable wire-format identifier, lowercase, e.g. "steam", "nft", "microsoft". */
    String key();

    /** Short human-readable name for error messages and API listings. */
    String displayName();

    /**
     * Verifies ownership from the provider-specific request parameters.
     *
     * <p>Implementations should NOT throw for "not owned" — they should return
     * {@link VerificationResult#denied(String)} with a reason. Throwing is reserved
     * for unexpected failures (network, parse errors), which the caller treats as
     * a 502 to the client.
     */
    VerificationResult verify(Map<String, String> request);
}
