package com.enterprisepet.nft;

import com.enterprisepet.provider.VerificationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.Request;
import org.web3j.protocol.core.methods.response.EthCall;

import java.lang.reflect.Field;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EthereumNftServiceTest {

    @Mock
    private Web3j web3j;

    private EthereumNftService service;

    private static final String WALLET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    private static final String CONTRACT = "0x1234567890123456789012345678901234567890";
    private static final String TOKEN_ID = "12345";

    private static final String OWNER_RESPONSE =
            "0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    private static final String NOT_OWNER_RESPONSE =
            "0x0000000000000000000000001111111111111111111111111111111111111111";

    @BeforeEach
    void setUp() throws Exception {
        service = new EthereumNftService();

        Field web3jField = EthereumNftService.class.getDeclaredField("web3j");
        web3jField.setAccessible(true);
        web3jField.set(service, web3j);
    }

    @Test
    @DisplayName("ownsToken returns true when wallet owns the token")
    void ownsToken_whenOwnsToken_returnsTrue() throws Exception {
        EthCall call = mock(EthCall.class);
        when(call.hasError()).thenReturn(false);
        when(call.getValue()).thenReturn(OWNER_RESPONSE);

        @SuppressWarnings("unchecked")
        Request request = mock(Request.class);
        when(request.send()).thenReturn(call);
        when(web3j.ethCall(any(), any())).thenReturn(request);

        boolean result = service.ownsToken(WALLET, CONTRACT, TOKEN_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("ownsToken returns false when wallet does not own the token")
    void ownsToken_whenDoesNotOwn_returnsFalse() throws Exception {
        EthCall call = mock(EthCall.class);
        when(call.hasError()).thenReturn(false);
        when(call.getValue()).thenReturn(NOT_OWNER_RESPONSE);

        @SuppressWarnings("unchecked")
        Request request = mock(Request.class);
        when(request.send()).thenReturn(call);
        when(web3j.ethCall(any(), any())).thenReturn(request);

        boolean result = service.ownsToken(WALLET, CONTRACT, TOKEN_ID);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("ownsToken returns false on RPC error")
    void ownsToken_onRpcError_returnsFalse() throws Exception {
        @SuppressWarnings("unchecked")
        Request request = mock(Request.class);
        when(request.send()).thenThrow(new RuntimeException("RPC failure"));
        when(web3j.ethCall(any(), any())).thenReturn(request);

        boolean result = service.ownsToken(WALLET, CONTRACT, TOKEN_ID);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("verify rejects requests with missing fields")
    void verify_missingFields_returnsDenied() {
        VerificationResult result = service.verify(Map.of(
                "walletAddress", WALLET,
                "contractAddress", CONTRACT
        ));

        assertThat(result.verified()).isFalse();
        assertThat(result.reason()).contains("required");
    }
}