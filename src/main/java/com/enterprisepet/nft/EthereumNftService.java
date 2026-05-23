package com.enterprisepet.nft;

import com.enterprisepet.provider.OwnershipProvider;
import com.enterprisepet.provider.VerificationResult;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
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
     */
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

            // Parse the returned address and compare (case-insensitive)
            String owner = response.getValue();
            return owner != null && owner.toLowerCase().contains(walletAddress.toLowerCase().substring(2));

        } catch (Exception e) {
            log.warn("NFT verification failed: {}", e.getMessage());
            return false;
        }
    }
}
