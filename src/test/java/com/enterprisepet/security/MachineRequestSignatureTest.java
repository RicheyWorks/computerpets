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
    /** Cross-check with desktop/license/machine-sign.cjs and client machine_sign.py. */
    private static final String VECTOR = "aQnHDFNgA6mc5FUEYEc3XsqmUFRtefDA_KfiCluM47E";

    @Test
    @DisplayName("known vector matches the desktop and blotter MAC")
    void knownVector() {
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", TS, BODY);
        assertThat(sig).isEqualTo(VECTOR);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "post", "/api/verify/steam", null, TS, sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.OK);
    }

    @Test
    @DisplayName("previous license key verifies during rotation; a third key does not")
    void previousKeyAccepted() {
        String sig = MachineRequestSignature.sign(PREVIOUS, "POST", "/api/verify/itch", "x=1", TS, BODY);
        assertThat(MachineRequestSignature.verify(
                KEY, PREVIOUS, "POST", "/api/verify/itch", "x=1", TS, sig, BODY, 1700000100L))
                .isEqualTo(MachineRequestSignature.Decision.OK);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/itch", "x=1", TS, sig, BODY, 1700000100L))
                .isEqualTo(MachineRequestSignature.Decision.INVALID);
    }

    @Test
    @DisplayName("skew is 300 seconds inclusive; 301 refuses")
    void skewWindow() {
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", TS, BODY);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, sig, BODY, 1700000000L + 300))
                .isEqualTo(MachineRequestSignature.Decision.OK);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, sig, BODY, 1700000000L - 300))
                .isEqualTo(MachineRequestSignature.Decision.OK);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, sig, BODY, 1700000000L + 301))
                .isEqualTo(MachineRequestSignature.Decision.SKEW);
    }

    @Test
    @DisplayName("missing headers, a blank key, and a tampered body fail closed")
    void failClosed() {
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", TS, BODY);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", null, sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.MISSING);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", "not-a-time", sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.MISSING);
        assertThat(MachineRequestSignature.verify(
                "", PREVIOUS, "POST", "/api/verify/steam", "", TS, sig, BODY, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.INVALID);
        byte[] tampered = "{\"petType\":\"cat\"}".getBytes(StandardCharsets.UTF_8);
        assertThat(MachineRequestSignature.verify(
                KEY, "", "POST", "/api/verify/steam", "", TS, sig, tampered, 1700000000L))
                .isEqualTo(MachineRequestSignature.Decision.INVALID);
    }
}
