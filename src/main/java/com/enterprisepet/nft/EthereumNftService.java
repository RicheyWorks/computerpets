package com.enterprisepet.nft;

import com.enterprisepet.observability.VerificationTelemetry;
import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.micrometer.observation.ObservationRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * On-chain NFT ownership provider (ERC-721 {@code ownerOf} / ERC-1155 {@code balanceOf}).
 *
 * <p>Input is validated before any RPC call: well-formed addresses, non-negative
 * token ids, optional {@code personal_sign} proof, and (by default) an official
 * collection allowlist with optional token → pet bindings.
 */
@Service
@ConditionalOnProperty(
    name = "ownership.providers.nft.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class EthereumNftService implements OwnershipProvider {

    private static final Logger log = LoggerFactory.getLogger(EthereumNftService.class);

    /** eth_call {@code from} — never the claimant; some nodes reject empty-balance senders. */
    private static final String ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    private static final Pattern DECIMAL_TOKEN_ID = Pattern.compile("\\d{1,78}");

    private final EthereumProperties props;
    private final NftCatalog catalog;
    private final Web3j web3j;

    @Autowired
    private ObservationRegistry observationRegistry = ObservationRegistry.NOOP;

    /**
     * Production constructor. {@code @Autowired} is required because package-private
     * test constructors also exist — without it Spring looks for a no-arg constructor
     * and the application context fails to start.
     *
     * <p>{@code web3j} is a {@link EthereumConfig} bean built from the already-bound
     * {@code ethereum.rpc-url}; it is never constructed against a null field.
     */
    @Autowired
    public EthereumNftService(EthereumProperties props, NftCatalog catalog, Web3j web3j) {
        this.props = props;
        this.catalog = catalog;
        this.web3j = Objects.requireNonNull(web3j, "web3j");
        if (props.isPlaceholderRpc()) {
            log.warn("Ethereum RPC URL is a placeholder — NFT ownership checks will be denied until ETHEREUM_RPC_URL is set");
        }
        if (catalog.allowlistRequired() && catalog.isEmpty()) {
            log.warn("ethereum.allowlist-required=true but no collections are configured — NFT verify will deny until ethereum.collections is set");
        }
    }

    /** Unit-test constructor: inject a mocked Web3j, no allowlist. */
    EthereumNftService(Web3j web3j) {
        this(EthereumProperties.unrestricted(), new NftCatalog(EthereumProperties.unrestricted()), web3j);
    }

    void setObservationRegistry(ObservationRegistry observationRegistry) {
        this.observationRegistry = observationRegistry == null ? ObservationRegistry.NOOP : observationRegistry;
    }

    @Override public String key()         { return "nft"; }
    @Override public String displayName() { return "Ethereum NFT"; }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        NftVerifyRequest typed = NftVerifyRequest.from(request);
        if (typed.walletAddress() == null || typed.contractAddress() == null || typed.tokenId() == null) {
            return VerificationResult.denied("walletAddress, contractAddress, and tokenId are required");
        }

        Optional<String> wallet = EthereumAddress.normalize(typed.walletAddress());
        if (wallet.isEmpty()) {
            return VerificationResult.denied("walletAddress is not a valid Ethereum address");
        }
        Optional<String> contract = EthereumAddress.normalize(typed.contractAddress());
        if (contract.isEmpty()) {
            return VerificationResult.denied("contractAddress is not a valid Ethereum address");
        }
        Optional<BigInteger> tokenId = parseTokenId(typed.tokenId());
        if (tokenId.isEmpty()) {
            return VerificationResult.denied("tokenId must be a non-negative decimal integer");
        }

        VerificationResult signature = checkSignature(typed, wallet.get());
        if (signature != null) {
            return signature;
        }

        Optional<EthereumProperties.CollectionSpec> collection = catalog.find(contract.get());
        if (catalog.allowlistRequired() && collection.isEmpty()) {
            if (catalog.isEmpty()) {
                return VerificationResult.denied("no official NFT collections configured");
            }
            return VerificationResult.denied("contractAddress is not an official ComputerPets collection");
        }

        String mappedPet = null;
        if (collection.isPresent() && collection.get().hasTokenMap()) {
            Optional<String> pet = collection.get().petKeyFor(typed.tokenId());
            if (pet.isEmpty()) {
                return VerificationResult.denied("tokenId is not a ComputerPets entitlement on this collection");
            }
            mappedPet = pet.get();
            String requested = typed.petType();
            if (requested != null && !mappedPet.equalsIgnoreCase(requested)) {
                return VerificationResult.denied(
                        "tokenId is bound to petType '" + mappedPet + "', not '" + requested + "'");
            }
        }

        if (!ownsToken(wallet.get(), contract.get(), tokenId.get().toString())) {
            return VerificationResult.denied("NFT ownership not verified on-chain");
        }

        return mappedPet == null
                ? VerificationResult.granted(wallet.get())
                : VerificationResult.granted(wallet.get(), mappedPet);
    }

    /**
     * Verifies on-chain that {@code walletAddress} owns {@code tokenId} of {@code contractAddress}.
     * Standard is taken from the official catalog, or {@link NftStandard#AUTO} for unknown contracts.
     * Protected by Resilience4j circuit breaker + retry around the RPC call.
     */
    @CircuitBreaker(name = "nft", fallbackMethod = "ownsTokenFallback")
    @Retry(name = "nft")
    public boolean ownsToken(String walletAddress, String contractAddress, String tokenId) {
        Optional<String> wallet = EthereumAddress.normalize(walletAddress);
        Optional<String> contract = EthereumAddress.normalize(contractAddress);
        Optional<BigInteger> id = parseTokenId(tokenId);
        if (wallet.isEmpty() || contract.isEmpty() || id.isEmpty()) {
            return false;
        }
        if (props.isPlaceholderRpc()) {
            log.warn("NFT verification skipped: Ethereum RPC URL is not configured");
            return false;
        }
        NftStandard standard = catalog.find(contract.get())
                .map(EthereumProperties.CollectionSpec::getStandard)
                .orElse(NftStandard.AUTO);
        try {
            return checkOnChain(wallet.get(), contract.get(), id.get(), standard);
        } catch (Exception e) {
            log.warn("NFT verification failed contract={} tokenId={}: {}", contract.get(), id.get(), e.getMessage());
            return false;
        }
    }

    @SuppressWarnings("unused")
    private boolean ownsTokenFallback(String walletAddress, String contractAddress, String tokenId, Exception e) {
        log.warn("NFT (Ethereum) circuit breaker open or retries exhausted for contract={} tokenId={}: {}",
                contractAddress, tokenId, e.getMessage());
        return false;
    }

    private boolean checkOnChain(String wallet, String contract, BigInteger tokenId, NftStandard standard)
            throws Exception {
        return switch (standard) {
            case ERC721 -> ownerOf(wallet, contract, tokenId);
            case ERC1155 -> balanceOf(wallet, contract, tokenId);
            // A successful ownerOf (any address) is definitive. Falling through to
            // balanceOf would decode that address as a non-zero uint256 and grant
            // ownership to a wallet that does not own the token.
            case AUTO -> {
                Optional<Boolean> erc721 = ownerOfIfPresent(wallet, contract, tokenId);
                if (erc721.isPresent()) {
                    yield erc721.get();
                }
                yield balanceOf(wallet, contract, tokenId);
            }
        };
    }

    /**
     * @return empty when ownerOf did not decode (typical ERC-1155 revert);
     *         otherwise whether {@code wallet} is the returned owner
     */
    private Optional<Boolean> ownerOfIfPresent(String wallet, String contract, BigInteger tokenId)
            throws Exception {
        Optional<List<Type>> decoded = ethCall(contract, ownerOfFunction(tokenId));
        if (decoded.isEmpty() || decoded.get().isEmpty()) {
            return Optional.empty();
        }
        Address owner = (Address) decoded.get().get(0);
        return Optional.of(EthereumAddress.equalsNormalized(wallet, owner.getValue()));
    }

    private boolean ownerOf(String wallet, String contract, BigInteger tokenId) throws Exception {
        return ownerOfIfPresent(wallet, contract, tokenId).orElse(false);
    }

    private static Function ownerOfFunction(BigInteger tokenId) {
        return new Function(
                "ownerOf",
                List.of(new Uint256(tokenId)),
                List.of(new TypeReference<Address>() {})
        );
    }

    private boolean balanceOf(String wallet, String contract, BigInteger tokenId) throws Exception {
        Function function = new Function(
                "balanceOf",
                List.of(new Address(wallet), new Uint256(tokenId)),
                List.of(new TypeReference<Uint256>() {})
        );
        Optional<List<Type>> decoded = ethCall(contract, function);
        if (decoded.isEmpty() || decoded.get().isEmpty()) {
            return false;
        }
        Uint256 balance = (Uint256) decoded.get().get(0);
        return balance.getValue().signum() > 0;
    }

    private Optional<List<Type>> ethCall(String contract, Function function) throws Exception {
        return VerificationTelemetry.observeProviderCall(
                observationRegistry, "nft", "eth_call", () -> {
                    String encoded = FunctionEncoder.encode(function);
                    Transaction tx = Transaction.createEthCallTransaction(ZERO_ADDRESS, contract, encoded);
                    EthCall response = web3j.ethCall(tx, DefaultBlockParameterName.LATEST).send();
                    if (response.hasError() || response.getValue() == null || response.getValue().isBlank()) {
                        return Optional.empty();
                    }
                    return Optional.of(FunctionReturnDecoder.decode(
                            response.getValue(), function.getOutputParameters()));
                });
    }

    /**
     * @return a denied result when the signature policy fails; {@code null} when the check
     *         is skipped or the recovered signer matches {@code wallet}
     */
    private VerificationResult checkSignature(NftVerifyRequest request, String wallet) {
        boolean provided = request.hasSignature() || request.hasMessage();
        if (!props.isRequireSignature() && !provided) {
            return null;
        }
        if (!request.hasSignature() || !request.hasMessage()) {
            return VerificationResult.denied("message and signature are required to prove wallet control");
        }
        Optional<String> signer = WalletSignature.recoverAddress(request.message(), request.signature());
        if (signer.isEmpty() || !EthereumAddress.equalsNormalized(wallet, signer.get())) {
            return VerificationResult.denied("wallet signature does not match walletAddress");
        }
        return null;
    }

    static Optional<BigInteger> parseTokenId(String raw) {
        if (raw == null) {
            return Optional.empty();
        }
        String t = raw.trim();
        if (!DECIMAL_TOKEN_ID.matcher(t).matches()) {
            return Optional.empty();
        }
        return Optional.of(new BigInteger(t));
    }
}
