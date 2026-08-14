package com.enterprisepet.nft;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * In-memory view of official ComputerPets NFT collections.
 *
 * <p>Lookups are by normalized (lowercase) contract address. Token → pet
 * bindings live on each {@link EthereumProperties.CollectionSpec}.
 */
@Component
public class NftCatalog {

    private final EthereumProperties props;
    private final Map<String, EthereumProperties.CollectionSpec> byAddress;

    public NftCatalog(EthereumProperties props) {
        this.props = props;
        Map<String, EthereumProperties.CollectionSpec> map = new LinkedHashMap<>();
        for (EthereumProperties.CollectionSpec spec : props.getCollections()) {
            EthereumAddress.normalize(spec.getAddress())
                    .ifPresent(addr -> map.put(addr, spec));
        }
        this.byAddress = Map.copyOf(map);
    }

    public Optional<EthereumProperties.CollectionSpec> find(String address) {
        return EthereumAddress.normalize(address).map(byAddress::get);
    }

    public boolean allowlistRequired() {
        return props.isAllowlistRequired();
    }

    public boolean isEmpty() {
        return byAddress.isEmpty();
    }

    public int size() {
        return byAddress.size();
    }

    public List<Map<String, Object>> listPublic() {
        List<Map<String, Object>> out = new ArrayList<>();
        for (EthereumProperties.CollectionSpec spec : byAddress.values()) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("address", EthereumAddress.normalize(spec.getAddress()).orElse(spec.getAddress()));
            row.put("name", spec.getName() == null ? "" : spec.getName());
            row.put("standard", spec.getStandard().name());
            row.put("tokens", spec.getTokens() == null ? Map.of() : Map.copyOf(spec.getTokens()));
            out.add(row);
        }
        return out;
    }
}
