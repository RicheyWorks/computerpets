package com.enterprisepet.nft;

import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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
import org.web3j.protocol.http.HttpService;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnProperty(
    name = "ownership.providers.nft.enabled",
    havingValue = "true",
    matchIfMissing = true
)
public class EthereumNftService implements OwnershipProvider {

    private static final Logger log = LoggerFactory.getLogger(EthereumNftService.class);

    @Value("${ethereum.rpc-url:https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY}")
    private String rpcUrl;

    private Web3j web3j;

    @PostConstruct
    void init() {
        // rpcUrl is field-injected by Spring AFTER the constructor returns,
        // so the Web3j client must be built here, not in the constructor.
        this.web3j = Web3j.build(new HttpService(rpcUrl));
    }

    @Override public String key()         { return "nft"; }
    @Override public String displayName() { return "Ethereum NFT"; }

    @Override
    public VerificationResult verify(Map<String, String> request) {
        String wallet   = request.get("walletAddress");
        String contract = request.get("contractAddress");
        String tokenId  = request.get("tokenId");
        if (wallet == null || wallet.isBlank()
            || contract == null || contract.isBlank()
            || tokenId == null || tokenId.isBlank()) {
            return VerificationResult.denied("walletAddress, contractAddress, and tokenId are required");
        }
        return ownsToken(wallet, contract, tokenId)
            ? VerificationResult.granted(wallet)
            : VerificationResult.denied("NFT ownership not verified on-chain");
    }

    /**
     * Verifies on-chain that walletAddress owns the specific tokenId of the NFT contract.
     * Protected by Resilience4j circuit breaker + retry (Phase 2.3) around the RPC call.
     */
    @CircuitBreaker(name = "nft", fallbackMethod = "ownsTokenFallback")
    @Retry(name = "nft")
    public boolean ownsToken(String walletAddress, String contractAddress, String tokenId) {
        try {
            Function function = new Function(
                "ownerOf",
                List.of(new Uint256(new BigInteger(tokenId))),
                List.of(new TypeReference<Address>() {})
            );

            String encodedFunction = FunctionEncoder.encode(function);
            Transaction transaction = Transaction.createEthCallTransaction(
                walletAddress, contractAddress, encodedFunction
            );

            EthCall response = web3j.ethCall(transaction, DefaultBlockParameterName.LATEST).send();

            if (response.hasError()) {
                return false;
            }

            // Properly decode the ABI response instead of using fragile string matching
            List<Type> decoded = FunctionReturnDecoder.decode(
                response.getValue(),
                function.getOutputParameters()
            );

            if (decoded.isEmpty()) {
                return false;
            }

            Address ownerAddress = (Address) decoded.get(0);
            return walletAddress.equalsIgnoreCase(ownerAddress.getValue());

        } catch (Exception e) {
            log.warn("NFT verification failed: {}", e.getMessage());
            return false;
        }
    }

    @SuppressWarnings("unused")
    private boolean ownsTokenFallback(String walletAddress, String contractAddress, String tokenId, Exception e) {
        log.warn("NFT (Ethereum) circuit breaker open or retries exhausted for contract={} tokenId={}: {}",
                contractAddress, tokenId, e.getMessage());
        return false;
    }
}
