package com.enterprisepet.nft;

import org.junit.jupiter.api.Test;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

class WalletSignatureTest {

    @Test
    void recoverAddress_roundTripsPersonalSign() throws Exception {
        ECKeyPair keys = Keys.createEcKeyPair();
        String expected = "0x" + Keys.getAddress(keys);
        String message = "ComputerPets verify nft 1";

        Sign.SignatureData sig = Sign.signPrefixedMessage(message.getBytes(StandardCharsets.UTF_8), keys);
        byte[] packed = new byte[65];
        System.arraycopy(sig.getR(), 0, packed, 0, 32);
        System.arraycopy(sig.getS(), 0, packed, 32, 32);
        packed[64] = sig.getV()[0];

        assertThat(WalletSignature.recoverAddress(message, Numeric.toHexString(packed)))
                .contains(expected);
    }

    @Test
    void recoverAddress_rejectsGarbage() {
        assertThat(WalletSignature.recoverAddress("hi", "0x1234")).isEmpty();
        assertThat(WalletSignature.recoverAddress("", "0x" + "ab".repeat(65))).isEmpty();
        assertThat(WalletSignature.recoverAddress("hi", null)).isEmpty();
    }
}
