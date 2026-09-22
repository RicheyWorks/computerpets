package com.enterprisepet.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

class AdminRequestSignatureTest {

    private static final String KEY = "test-admin-secret";
    private static final String PREVIOUS = "previous-admin-secret";
    private static final byte[] BODY = "{\"jti\":\"abc\"}".getBytes(StandardCharsets.UTF_8);
    private static final String TS = "1700000000";
    private static final String NONCE = "0123456789abcdef";
    /** Cross-check with web/src/lib/admin/sign.ts. */
    private static final String VECTOR = "mIV045pY8c-HU1s7kMEQ2eFV02JmJQfWA_CpYl3e9pA";

    @Test
    @DisplayName("known vector matches the house ledger MAC, nonce included")
    void knownVector() {
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, NONCE, BODY);
        assertThat(sig).isEqualTo(VECTOR);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "post", "/api/admin/revoke", null, TS, NONCE, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.OK);
    }

    @Test
    @DisplayName("a machine-verify MAC over the same bytes is not an admin MAC")
    void machineVersionDoesNotOpenAdmin() {
        String adminSig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, NONCE, BODY);
        String machineSig = MachineRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, NONCE, BODY);
        assertThat(adminSig).isNotEqualTo(machineSig);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, NONCE, machineSig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
    }

    @Test
    @DisplayName("previous admin key verifies during rotation; a third key does not")
    void previousKeyAccepted() {
        String sig = AdminRequestSignature.sign(PREVIOUS, "GET", "/api/admin/licenses", "owner=steam%3A1", TS, NONCE, new byte[0]);
        assertThat(AdminRequestSignature.verify(
                KEY, PREVIOUS, "GET", "/api/admin/licenses", "owner=steam%3A1", TS, NONCE, sig, new byte[0], 1700000100L))
                .isEqualTo(AdminRequestSignature.Decision.OK);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "GET", "/api/admin/licenses", "owner=steam%3A1", TS, NONCE, sig, new byte[0], 1700000100L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
    }

    @Test
    @DisplayName("skew is 300 seconds inclusive; 301 refuses")
    void skewWindow() {
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, NONCE, BODY);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, NONCE, sig, BODY, 1700000000L + 300))
                .isEqualTo(AdminRequestSignature.Decision.OK);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, NONCE, sig, BODY, 1700000000L - 300))
                .isEqualTo(AdminRequestSignature.Decision.OK);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, NONCE, sig, BODY, 1700000000L + 301))
                .isEqualTo(AdminRequestSignature.Decision.SKEW);
    }

    @Test
    @DisplayName("missing headers, a blank key, a static header, and a tampered body fail closed")
    void failClosed() {
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, NONCE, BODY);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", null, NONCE, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.MISSING);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", "not-a-time", NONCE, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.MISSING);
        assertThat(AdminRequestSignature.verify(
                "", PREVIOUS, "POST", "/api/admin/revoke", "", TS, NONCE, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
        byte[] tampered = "{\"jti\":\"nope\"}".getBytes(StandardCharsets.UTF_8);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, NONCE, sig, tampered, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "x=1", TS, NONCE, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
    }

    @Test
    @DisplayName("a missing or illegal nonce is refused before the MAC")
    void nonceRequired() {
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, NONCE, BODY);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, null, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.NONCE_MISSING);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, "short", sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.NONCE_INVALID);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, "has a newline\nnope", sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.NONCE_INVALID);
    }
}
