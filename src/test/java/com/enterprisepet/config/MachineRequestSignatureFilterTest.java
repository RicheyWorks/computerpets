package com.enterprisepet.config;

import com.enterprisepet.security.InMemoryRequestReplayStore;
import com.enterprisepet.security.MachineRequestSignature;
import com.enterprisepet.security.RequestReplayStoreUnavailableException;
import jakarta.servlet.ServletInputStream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class MachineRequestSignatureFilterTest {

    private static final String KEY = "test-license-secret";
    private final InMemoryRequestReplayStore store = new InMemoryRequestReplayStore();
    private final MachineRequestSignatureFilter filter = new MachineRequestSignatureFilter(KEY, "", store);

    @Test
    @DisplayName("GET discovery, download, admin, and catalog are not this gate")
    void unsignedReadsAndOtherDoorsPass() throws Exception {
        assertPassed("GET", "/api/verify/providers");
        assertPassed("GET", "/api/verify/nft/collections");
        assertPassed("POST", "/api/download/red_panda");
        assertPassed("POST", "/api/admin/revoke");
        assertPassed("GET", "/api/bundles/red_panda/redeem");
        assertPassed("GET", "/api/public/heartbeat");
        assertPassed("GET", "/api/pets");
    }

    @Test
    @DisplayName("POST /api/verify without a signature is 401 and does not reach the controller")
    void unsignedVerifyRefused() throws Exception {
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/verify/steam");
        req.setContent("{\"steamId\":\"1\"}".getBytes(StandardCharsets.UTF_8));
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};

        filter.doFilter(req, res, (request, response) -> reached[0] = true);

        assertThat(reached[0]).isFalse();
        assertThat(res.getStatus()).isEqualTo(401);
        assertThat(res.getContentType()).isEqualTo(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        assertThat(res.getContentAsString()).contains("Machine signature required.");
    }

    @Test
    @DisplayName("a valid signature reaches the controller with the same body bytes")
    void signedVerifyPassesBodyThrough() throws Exception {
        byte[] body = "{\"petType\":\"red_panda\"}".getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond());
        String nonce = "machine-body-nonce1";
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", ts, nonce, body);

        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/verify/steam");
        req.setContent(body);
        req.addHeader(MachineRequestSignature.TIMESTAMP_HEADER, ts);
        req.addHeader(MachineRequestSignature.NONCE_HEADER, nonce);
        req.addHeader(MachineRequestSignature.SIGNATURE_HEADER, sig);
        MockHttpServletResponse res = new MockHttpServletResponse();
        byte[][] seen = new byte[1][];

        filter.doFilter(req, res, (request, response) -> {
            ServletInputStream in = request.getInputStream();
            seen[0] = in.readAllBytes();
        });

        assertThat(res.getStatus()).isEqualTo(200);
        assertThat(seen[0]).isEqualTo(body);
    }

    @Test
    @DisplayName("a skewed timestamp is 401 and does not reach the controller")
    void skewedTimestampRefused() throws Exception {
        byte[] body = "{}".getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond() - 301);
        String nonce = "machine-skew-nonce1";
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", ts, nonce, body);
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/verify/steam");
        req.setContent(body);
        req.addHeader(MachineRequestSignature.TIMESTAMP_HEADER, ts);
        req.addHeader(MachineRequestSignature.NONCE_HEADER, nonce);
        req.addHeader(MachineRequestSignature.SIGNATURE_HEADER, sig);
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};

        filter.doFilter(req, res, (request, response) -> reached[0] = true);

        assertThat(reached[0]).isFalse();
        assertThat(res.getStatus()).isEqualTo(401);
        assertThat(res.getContentAsString()).contains("300 second window");
    }

    @Test
    @DisplayName("the same signed verify is 401 on the second use")
    void replayIs401() throws Exception {
        byte[] body = "{\"petType\":\"red_panda\"}".getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond());
        String nonce = "machine-replay-non1";
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", ts, nonce, body);

        boolean[] first = {false};
        filter.doFilter(signed(body, ts, nonce, sig), new MockHttpServletResponse(),
                (request, response) -> first[0] = true);
        assertThat(first[0]).isTrue();

        MockHttpServletResponse replay = new MockHttpServletResponse();
        boolean[] second = {false};
        filter.doFilter(signed(body, ts, nonce, sig), replay, (request, response) -> second[0] = true);
        assertThat(second[0]).isFalse();
        assertThat(replay.getStatus()).isEqualTo(401);
        assertThat(replay.getContentAsString()).contains("Machine request replayed.");
    }

    @Test
    @DisplayName("a down nonce store is 503 and does not reach the controller")
    void storeDownIs503() throws Exception {
        MachineRequestSignatureFilter closed = new MachineRequestSignatureFilter(KEY, "", (surface, nonce) -> {
            throw new RequestReplayStoreUnavailableException("down", null);
        });
        byte[] body = "{}".getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond());
        String nonce = "machine-down-nonce01";
        String sig = MachineRequestSignature.sign(KEY, "POST", "/api/verify/steam", "", ts, nonce, body);
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};
        closed.doFilter(signed(body, ts, nonce, sig), res, (request, response) -> reached[0] = true);
        assertThat(reached[0]).isFalse();
        assertThat(res.getStatus()).isEqualTo(503);
        assertThat(res.getContentAsString()).contains("Machine nonce store unavailable.");
    }

    private static MockHttpServletRequest signed(byte[] body, String ts, String nonce, String sig) {
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/verify/steam");
        req.setContent(body);
        req.addHeader(MachineRequestSignature.TIMESTAMP_HEADER, ts);
        req.addHeader(MachineRequestSignature.NONCE_HEADER, nonce);
        req.addHeader(MachineRequestSignature.SIGNATURE_HEADER, sig);
        return req;
    }

    private void assertPassed(String method, String path) throws Exception {
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};
        filter.doFilter(new MockHttpServletRequest(method, path), res,
                (request, response) -> reached[0] = true);
        assertThat(reached[0]).isTrue();
    }
}
