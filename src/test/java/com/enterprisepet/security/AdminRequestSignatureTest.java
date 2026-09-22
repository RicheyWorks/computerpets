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
    /** Cross-check with web/src/lib/admin/sign.ts. */
    private static final String VECTOR = "-VMFZenWBOFRVfYpmAGRHN-njILBKegCBerR6B3RnE0";

    @Test
    @DisplayName("known vector matches the house ledger MAC")
    void knownVector() {
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, BODY);
        assertThat(sig).isEqualTo(VECTOR);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "post", "/api/admin/revoke", null, TS, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.OK);
    }

    @Test
    @DisplayName("a machine-verify MAC over the same bytes is not an admin MAC")
    void machineVersionDoesNotOpenAdmin() {
        String adminSig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, BODY);
        String machineSig = MachineRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, BODY);
        assertThat(adminSig).isNotEqualTo(machineSig);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, machineSig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
    }

    @Test
    @DisplayName("previous admin key verifies during rotation; a third key does not")
    void previousKeyAccepted() {
        String sig = AdminRequestSignature.sign(PREVIOUS, "GET", "/api/admin/licenses", "owner=steam%3A1", TS, new byte[0]);
        assertThat(AdminRequestSignature.verify(
                KEY, PREVIOUS, "GET", "/api/admin/licenses", "owner=steam%3A1", TS, sig, new byte[0], 1700000100L))
                .isEqualTo(AdminRequestSignature.Decision.OK);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "GET", "/api/admin/licenses", "owner=steam%3A1", TS, sig, new byte[0], 1700000100L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
    }

    @Test
    @DisplayName("skew is 300 seconds inclusive; 301 refuses")
    void skewWindow() {
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, BODY);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, sig, BODY, 1700000000L + 300))
                .isEqualTo(AdminRequestSignature.Decision.OK);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, sig, BODY, 1700000000L - 300))
                .isEqualTo(AdminRequestSignature.Decision.OK);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, sig, BODY, 1700000000L + 301))
                .isEqualTo(AdminRequestSignature.Decision.SKEW);
    }

    @Test
    @DisplayName("missing headers, a blank key, a static header, and a tampered body fail closed")
    void failClosed() {
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", TS, BODY);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", null, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.MISSING);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", "not-a-time", sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.MISSING);
        assertThat(AdminRequestSignature.verify(
                "", PREVIOUS, "POST", "/api/admin/revoke", "", TS, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
        byte[] tampered = "{\"jti\":\"nope\"}".getBytes(StandardCharsets.UTF_8);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "", TS, sig, tampered, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
        assertThat(AdminRequestSignature.verify(
                KEY, "", "POST", "/api/admin/revoke", "x=1", TS, sig, BODY, 1700000000L))
                .isEqualTo(AdminRequestSignature.Decision.INVALID);
    }
}
