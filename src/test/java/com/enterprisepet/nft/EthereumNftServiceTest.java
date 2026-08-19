package com.enterprisepet.nft;

import com.enterprisepet.observability.VerificationTelemetry;
import com.enterprisepet.provider.VerificationResult;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.observation.DefaultMeterObservationHandler;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import io.micrometer.observation.ObservationRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.Request;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.utils.Numeric;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EthereumNftServiceTest {

    @Mock
    private Web3j web3j;

    private EthereumNftService unrestricted;

    private static final String WALLET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    private static final String CONTRACT = "0x1234567890123456789012345678901234567890";
    private static final String TOKEN_ID = "12345";

    private static final String OWNER_RESPONSE =
            "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    private static final String NOT_OWNER_RESPONSE =
            "0x0000000000000000000000001111111111111111111111111111111111111111";
    private static final String BALANCE_ONE =
            "0x0000000000000000000000000000000000000000000000000000000000000001";
    private static final String BALANCE_ZERO =
            "0x0000000000000000000000000000000000000000000000000000000000000000";

    @BeforeEach
    void setUp() {
        unrestricted = new EthereumNftService(web3j);
    }

    @Test
    @DisplayName("house default requires personal_sign")
    void productionDefault_requireSignature_isTrue() {
        assertThat(new EthereumProperties().isRequireSignature()).isTrue();
        assertThat(EthereumProperties.unrestricted().isRequireSignature()).isFalse();
    }

    @Test
    @DisplayName("verify denies an unsigned keeper before eth_call")
    void verify_missingSignature_deniedWithoutEthCall() {
        EthereumNftService service = houseService(allowlistedGenesis(NftStandard.ERC721, Map.of()));

        VerificationResult result = service.verify(Map.of(
                "walletAddress", WALLET,
                "contractAddress", CONTRACT,
                "tokenId", TOKEN_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("signature");

        VerificationResult messageOnly = service.verify(Map.of(
                "walletAddress", WALLET,
                "contractAddress", CONTRACT,
                "tokenId", TOKEN_ID,
                "message", "ComputerPets verify nft 1"
        ));
        assertThat(messageOnly.verified()).isFalse();
        assertThat(messageOnly.reason()).contains("signature");
        verify(web3j, never()).ethCall(any(), any());
    }

    @Test
    @DisplayName("verify denies a signature that does not recover to the wallet")
    void verify_badSignature_deniedWithoutEthCall() throws Exception {
        SignedKeeper keeper = SignedKeeper.generate();
        EthereumNftService service = houseService(allowlistedGenesis(NftStandard.ERC721, Map.of()));

        Map<String, String> request = signedRequest(keeper, CONTRACT, TOKEN_ID);
        request.put("signature", "0x" + "ab".repeat(65));

        VerificationResult result = service.verify(request);

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("signature");
        verify(web3j, never()).ethCall(any(), any());
    }

    @Test
    @DisplayName("verify denies everything when the allowlist is required but empty")
    void verify_emptyAllowlist_denied() throws Exception {
        SignedKeeper keeper = SignedKeeper.generate();
        EthereumNftService service = houseService();

        VerificationResult result = service.verify(signedRequest(keeper, CONTRACT, "1"));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("no official NFT collections");
        verify(web3j, never()).ethCall(any(), any());
    }

    @Test
    @DisplayName("ownsToken returns true when wallet owns the token")
    void ownsToken_whenOwnsToken_returnsTrue() throws Exception {
        stubEthCall(OWNER_RESPONSE);

        boolean result = unrestricted.ownsToken(WALLET, CONTRACT, TOKEN_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("ownsToken records a provider-call meter for the eth_call")
    void ownsToken_recordsProviderCallMeter() throws Exception {
        SimpleMeterRegistry meters = new SimpleMeterRegistry();
        ObservationRegistry observations = ObservationRegistry.create();
        observations.observationConfig().observationHandler(new DefaultMeterObservationHandler(meters));
        unrestricted.setObservationRegistry(observations);
        stubEthCall(OWNER_RESPONSE);

        assertThat(unrestricted.ownsToken(WALLET, CONTRACT, TOKEN_ID)).isTrue();

        Timer timer = meters.find(VerificationTelemetry.PROVIDER_CALL)
                .tag("provider", "nft")
                .tag("operation", "eth_call")
                .timer();
        assertThat(timer).isNotNull();
        assertThat(timer.count()).isGreaterThanOrEqualTo(1);
    }

    @Test
    @DisplayName("ownsToken is case-insensitive on checksummed addresses")
    void ownsToken_checksumMismatch_stillMatches() throws Exception {
        stubEthCall(OWNER_RESPONSE);

        boolean result = unrestricted.ownsToken(WALLET.toLowerCase(), CONTRACT.toUpperCase(), TOKEN_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("ownsToken returns false when wallet does not own the token")
    void ownsToken_whenDoesNotOwn_returnsFalse() throws Exception {
        stubEthCall(NOT_OWNER_RESPONSE);

        boolean result = unrestricted.ownsToken(WALLET, CONTRACT, TOKEN_ID);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("AUTO does not treat a foreign ownerOf address as a positive ERC-1155 balance")
    void ownsToken_autoForeignOwner_doesNotTreatAddressAsBalance() throws Exception {
        stubEthCall(NOT_OWNER_RESPONSE);

        assertThat(unrestricted.ownsToken(WALLET, CONTRACT, TOKEN_ID)).isFalse();
    }

    @Test
    @DisplayName("ownsToken returns false on RPC error")
    void ownsToken_onRpcError_returnsFalse() throws Exception {
        @SuppressWarnings("unchecked")
        Request request = mock(Request.class);
        when(request.send()).thenThrow(new RuntimeException("RPC failure"));
        when(web3j.ethCall(any(), any())).thenReturn(request);

        boolean result = unrestricted.ownsToken(WALLET, CONTRACT, TOKEN_ID);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("ownsToken rejects malformed addresses instead of substring-matching")
    void ownsToken_shortWallet_returnsFalse() {
        assertThat(unrestricted.ownsToken("0x", CONTRACT, TOKEN_ID)).isFalse();
        assertThat(unrestricted.ownsToken(WALLET, "not-an-address", TOKEN_ID)).isFalse();
        assertThat(unrestricted.ownsToken(WALLET, CONTRACT, "-1")).isFalse();
        assertThat(unrestricted.ownsToken(WALLET, CONTRACT, "abc")).isFalse();
    }

    @Test
    @DisplayName("verify rejects requests with missing fields")
    void verify_missingFields_returnsDenied() {
        VerificationResult result = unrestricted.verify(Map.of(
                "walletAddress", WALLET,
                "contractAddress", CONTRACT
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("required");
    }

    @Test
    @DisplayName("verify(null) denies with the same required-field message")
    void verify_nullRequest_returnsDenied() {
        VerificationResult result = unrestricted.verify(null);

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("walletAddress, contractAddress, and tokenId are required");
    }

    @Test
    @DisplayName("verify rejects a wallet shorter than 20 bytes")
    void verify_invalidWallet_returnsDenied() {
        VerificationResult result = unrestricted.verify(Map.of(
                "walletAddress", "0x",
                "contractAddress", CONTRACT,
                "tokenId", TOKEN_ID
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("walletAddress");
    }

    @Test
    @DisplayName("verify rejects a non-decimal tokenId")
    void verify_invalidTokenId_returnsDenied() {
        VerificationResult result = unrestricted.verify(Map.of(
                "walletAddress", WALLET,
                "contractAddress", CONTRACT,
                "tokenId", "0xdead"
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("tokenId");
    }

    @Test
    @DisplayName("verify denies unknown contracts when the allowlist is required")
    void verify_unknownContract_deniedWhenAllowlisted() throws Exception {
        SignedKeeper keeper = SignedKeeper.generate();
        EthereumNftService locked = houseService(allowlistedGenesis(NftStandard.ERC721, Map.of()));

        VerificationResult result = locked.verify(signedRequest(
                keeper, "0x9999999999999999999999999999999999999999", "1"));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("official");
        verify(web3j, never()).ethCall(any(), any());
    }

    @Test
    @DisplayName("verify denies an unmapped token on a collection that binds token → pet")
    void verify_unmappedToken_denied() throws Exception {
        SignedKeeper keeper = SignedKeeper.generate();
        EthereumNftService locked = houseService(allowlistedGenesis(NftStandard.ERC721, Map.of("1", "dragon")));

        Map<String, String> request = signedRequest(keeper, CONTRACT, "99");
        request.put("petType", "dragon");

        VerificationResult result = locked.verify(request);

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("not a ComputerPets entitlement");
        verify(web3j, never()).ethCall(any(), any());
    }

    @Test
    @DisplayName("verify denies a petType that does not match the token binding")
    void verify_petMismatch_denied() throws Exception {
        SignedKeeper keeper = SignedKeeper.generate();
        EthereumNftService locked = houseService(allowlistedGenesis(NftStandard.ERC721, Map.of("1", "dragon")));

        Map<String, String> request = signedRequest(keeper, CONTRACT, "1");
        request.put("petType", "red_panda");

        VerificationResult result = locked.verify(request);

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("bound to petType");
        verify(web3j, never()).ethCall(any(), any());
    }

    @Test
    @DisplayName("verify grants the mapped pet when a signed keeper owns the bound token")
    void verify_mappedToken_grantsBoundPet() throws Exception {
        SignedKeeper keeper = SignedKeeper.generate();
        EthereumNftService locked = houseService(allowlistedGenesis(NftStandard.ERC721, Map.of("1", "dragon")));
        stubEthCall(keeper.ownerOfResponse());

        VerificationResult result = locked.verify(signedRequest(keeper, CONTRACT, "1"));

        assertThat(result.verified()).isTrue();
        assertThat(result.ownerId()).isEqualTo(keeper.wallet.toLowerCase());
        assertThat(result.petKey()).isEqualTo("dragon");
    }

    @Test
    @DisplayName("ERC-1155 balanceOf > 0 is treated as ownership")
    void ownsToken_erc1155BalancePositive_returnsTrue() throws Exception {
        EthereumNftService erc1155 = serviceWith(allowlistedGenesis(NftStandard.ERC1155, Map.of()));
        stubEthCall(BALANCE_ONE);

        assertThat(erc1155.ownsToken(WALLET, CONTRACT, "7")).isTrue();
    }

    @Test
    @DisplayName("ERC-1155 balanceOf == 0 is not ownership")
    void ownsToken_erc1155BalanceZero_returnsFalse() throws Exception {
        EthereumNftService erc1155 = serviceWith(allowlistedGenesis(NftStandard.ERC1155, Map.of()));
        stubEthCall(BALANCE_ZERO);

        assertThat(erc1155.ownsToken(WALLET, CONTRACT, "7")).isFalse();
    }

    @Test
    @DisplayName("ownsToken returns false when the RPC URL is still a placeholder")
    void ownsToken_placeholderRpc_returnsFalse() {
        EthereumProperties props = new EthereumProperties();
        props.setAllowlistRequired(false);
        props.setRpcUrl("https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY");
        EthereumNftService service = new EthereumNftService(props, new NftCatalog(props), web3j);

        assertThat(service.ownsToken(WALLET, CONTRACT, TOKEN_ID)).isFalse();
    }

    /** House door: allowlist required, personal_sign required (production default). */
    private EthereumNftService houseService() {
        return houseService(null);
    }

    private EthereumNftService houseService(EthereumProperties.CollectionSpec spec) {
        EthereumProperties props = new EthereumProperties();
        props.setAllowlistRequired(true);
        props.setRpcUrl("http://127.0.0.1:8545");
        if (spec != null) {
            props.setCollections(List.of(spec));
        }
        return new EthereumNftService(props, new NftCatalog(props), web3j);
    }

    /** Isolated ownsToken helper — same allowlist fixture, no verify grant path. */
    private EthereumNftService serviceWith(EthereumProperties.CollectionSpec spec) {
        return houseService(spec);
    }

    private static Map<String, String> signedRequest(SignedKeeper keeper, String contract, String tokenId) {
        Map<String, String> request = new LinkedHashMap<>();
        request.put("walletAddress", keeper.wallet);
        request.put("contractAddress", contract);
        request.put("tokenId", tokenId);
        request.put("message", keeper.message);
        request.put("signature", keeper.signature);
        return request;
    }

    private static final class SignedKeeper {
        final String wallet;
        final String message;
        final String signature;

        private SignedKeeper(String wallet, String message, String signature) {
            this.wallet = wallet;
            this.message = message;
            this.signature = signature;
        }

        static SignedKeeper generate() throws Exception {
            ECKeyPair keys = Keys.createEcKeyPair();
            String wallet = "0x" + Keys.getAddress(keys);
            String message = "ComputerPets verify nft 1";
            Sign.SignatureData sig = Sign.signPrefixedMessage(
                    message.getBytes(StandardCharsets.UTF_8), keys);
            byte[] packed = new byte[65];
            System.arraycopy(sig.getR(), 0, packed, 0, 32);
            System.arraycopy(sig.getS(), 0, packed, 32, 32);
            packed[64] = sig.getV()[0];
            return new SignedKeeper(wallet, message, Numeric.toHexString(packed));
        }

        String ownerOfResponse() {
            String hex = wallet.startsWith("0x") ? wallet.substring(2) : wallet;
            hex = hex.toLowerCase();
            return "0x" + "0".repeat(64 - hex.length()) + hex;
        }
    }

    private static EthereumProperties.CollectionSpec allowlistedGenesis(
            NftStandard standard, Map<String, String> tokens) {
        EthereumProperties.CollectionSpec spec = new EthereumProperties.CollectionSpec();
        spec.setAddress(CONTRACT);
        spec.setStandard(standard);
        spec.setName("ComputerPets Genesis");
        spec.setTokens(new LinkedHashMap<>(tokens));
        return spec;
    }

    @SuppressWarnings("unchecked")
    private void stubEthCall(String hex) throws Exception {
        EthCall call = mock(EthCall.class);
        when(call.hasError()).thenReturn(false);
        when(call.getValue()).thenReturn(hex);

        Request request = mock(Request.class);
        when(request.send()).thenReturn(call);
        when(web3j.ethCall(any(), any())).thenReturn(request);
    }
}
