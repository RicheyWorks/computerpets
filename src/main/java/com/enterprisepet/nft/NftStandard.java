package com.enterprisepet.nft;

import java.util.Locale;

/**
 * On-chain interface used to prove NFT ownership.
 *
 * <ul>
 *   <li>{@link #ERC721} — {@code ownerOf(uint256)}</li>
 *   <li>{@link #ERC1155} — {@code balanceOf(address,uint256) > 0}</li>
 *   <li>{@link #AUTO} — try ERC-721, then ERC-1155 (unknown / unlisted contracts)</li>
 * </ul>
 */
public enum NftStandard {
    ERC721,
    ERC1155,
    AUTO;

    public static NftStandard parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return ERC721;
        }
        String n = raw.trim().toUpperCase(Locale.ROOT).replace("-", "").replace("_", "");
        return switch (n) {
            case "ERC1155" -> ERC1155;
            case "AUTO" -> AUTO;
            default -> ERC721;
        };
    }
}
