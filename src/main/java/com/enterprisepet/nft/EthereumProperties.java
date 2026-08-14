package com.enterprisepet.nft;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * {@code ethereum.*} configuration: RPC endpoint, official collections, and
 * policy flags for the NFT ownership provider.
 */
@ConfigurationProperties(prefix = "ethereum")
public class EthereumProperties {

    /**
     * JSON-RPC URL (Alchemy, Infura, a self-hosted node, …).
     * Placeholder values containing {@code YOUR_} are treated as unconfigured.
     */
    private String rpcUrl = "https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY";

    private int requestTimeoutMs = 4000;

    /**
     * When {@code true}, {@code contractAddress} must appear in
     * {@link #collections}. Empty allowlist + required = every NFT verify is denied.
     */
    private boolean allowlistRequired = true;

    /**
     * When {@code true}, the request must include a {@code personal_sign}
     * signature proving control of {@code walletAddress}.
     */
    private boolean requireSignature = false;

    private List<CollectionSpec> collections = new ArrayList<>();

    public String getRpcUrl() {
        return rpcUrl;
    }

    public void setRpcUrl(String rpcUrl) {
        this.rpcUrl = rpcUrl;
    }

    public int getRequestTimeoutMs() {
        return requestTimeoutMs;
    }

    public void setRequestTimeoutMs(int requestTimeoutMs) {
        this.requestTimeoutMs = requestTimeoutMs;
    }

    public boolean isAllowlistRequired() {
        return allowlistRequired;
    }

    public void setAllowlistRequired(boolean allowlistRequired) {
        this.allowlistRequired = allowlistRequired;
    }

    public boolean isRequireSignature() {
        return requireSignature;
    }

    public void setRequireSignature(boolean requireSignature) {
        this.requireSignature = requireSignature;
    }

    public List<CollectionSpec> getCollections() {
        return collections;
    }

    public void setCollections(List<CollectionSpec> collections) {
        this.collections = collections == null ? new ArrayList<>() : collections;
    }

    public boolean isPlaceholderRpc() {
        if (rpcUrl == null || rpcUrl.isBlank()) {
            return true;
        }
        String u = rpcUrl.toUpperCase();
        return u.contains("YOUR_KEY") || u.contains("YOUR_ALCHEMY") || u.contains("YOUR-KEY");
    }

    /** Test helper: accept any contract, no signature, local RPC. */
    static EthereumProperties unrestricted() {
        EthereumProperties p = new EthereumProperties();
        p.setAllowlistRequired(false);
        p.setRequireSignature(false);
        p.setRpcUrl("http://127.0.0.1:8545");
        return p;
    }

    public static class CollectionSpec {
        private String address;
        private NftStandard standard = NftStandard.ERC721;
        private String name = "";
        /** tokenId (decimal string) → pet catalog key. Empty = any token, pet from request. */
        private Map<String, String> tokens = new LinkedHashMap<>();

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public NftStandard getStandard() {
            return standard == null ? NftStandard.ERC721 : standard;
        }

        public void setStandard(NftStandard standard) {
            this.standard = standard;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Map<String, String> getTokens() {
            return tokens;
        }

        public void setTokens(Map<String, String> tokens) {
            this.tokens = tokens == null ? new LinkedHashMap<>() : tokens;
        }

        public boolean hasTokenMap() {
            return tokens != null && !tokens.isEmpty();
        }

        public Optional<String> petKeyFor(String tokenId) {
            if (!hasTokenMap() || tokenId == null) {
                return Optional.empty();
            }
            String direct = tokens.get(tokenId.trim());
            if (direct != null && !direct.isBlank()) {
                return Optional.of(direct.trim());
            }
            try {
                BigInteger wanted = new BigInteger(tokenId.trim());
                for (Map.Entry<String, String> e : tokens.entrySet()) {
                    try {
                        if (new BigInteger(e.getKey().trim()).equals(wanted)
                                && e.getValue() != null && !e.getValue().isBlank()) {
                            return Optional.of(e.getValue().trim());
                        }
                    } catch (NumberFormatException ignored) {
                        // skip malformed catalog keys
                    }
                }
            } catch (NumberFormatException ignored) {
                return Optional.empty();
            }
            return Optional.empty();
        }
    }
}
