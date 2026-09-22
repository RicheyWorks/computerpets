package com.enterprisepet.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

class MachineRequestSignatureTest {

    private static final String KEY = "test-license-secret";
    private static final String PREVIOUS = "previous-license-secret";
    private static final byte[] BODY = "{\"petType\":\"red_panda\"}".getBytes(StandardCharsets.UTF_8);
    private static final String TS = "1700000000";
    private static final String NONCE = "0123456789abcdef";
    /** Cross-check with desktop/license/machine-sign.cjs and client machine_sign.py. */
    private static final String VECTOR = "8na55WUBS507nkCWT83Goq-Cec4o1FpXeweNUm26UqU";

    @Test
    @DisplayName("known vector matches the desktop and blotter MAC, nonce included")
    void knownVector() {
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", TS, NONCE, BODY);
        assertThat(sig).isEqualTo(VECTOR);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "post", "/api/verify/steam", null, TS, NONCE, sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.OK);
    }

    @Test
    @DisplayName("previous license key verifies during rotation; a third key does not")
    void previousKeyAccepted() {
        String sig = MachineRequestSignature.sign(PREVIOUS, "POST", "/api/verify/itch", "x=1", TS, NONCE, BODY);
        assertThat(MachineRequestSignature.verify(
                KEY, PREVIOUS, "POST", "/api/verify/itch", "x=1", TS, NONCE, sig, BODY, 1700000100L))
                .isEqualTo(MachineRequestSignature.Decision.OK);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/itch", "x=1", TS, NONCE, sig, BODY, 1700000100L))
                .isEqualTo(MachineRequestSignature.Decision.INVALID);
    }

    @Test
    @DisplayName("skew is 300 seconds inclusive; 301 refuses")
    void skewWindow() {
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", TS, NONCE, BODY);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, NONCE, sig, BODY, 1700000000L + 300))
                .isEqualTo(MachineRequestSignature.Decision.OK);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, NONCE, sig, BODY, 1700000000L - 300))
                .isEqualTo(MachineRequestSignature.Decision.OK);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, NONCE, sig, BODY, 1700000000L + 301))
                .isEqualTo(MachineRequestSignature.Decision.SKEW);
    }

    @Test
    @DisplayName("missing headers, a blank key, and a tampered body fail closed")
    void failClosed() {
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", TS, NONCE, BODY);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", null, NONCE, sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.MISSING);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", "not-a-time", NONCE, sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.MISSING);
        assertThat(MachineRequestSignature.verify(
                "", PREVIOUS, "POST", "/api/verify/steam", "", TS, NONCE, sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.INVALID);
        byte[] tampered = "{\"petType\":\"cat\"}".getBytes(StandardCharsets.UTF_8);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, NONCE, sig, tampered, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.INVALID);
    }

    @Test
    @DisplayName("a missing or illegal nonce is refused before the MAC")
    void nonceRequired() {
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", TS, NONCE, BODY);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, " ", sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.NONCE_MISSING);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, "0123456789abcde/", sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.NONCE_INVALID);
    }

    @Test
    @DisplayName("nonce TTL matches both signature skew windows")
    void ttlMatchesSkew() {
        assertThat(RequestReplayStore.TTL_SECONDS).isEqualTo(MachineRequestSignature.SKEW_SECONDS);
        assertThat(RequestReplayStore.TTL_SECONDS).isEqualTo(AdminRequestSignature.SKEW_SECONDS);
    }
}
