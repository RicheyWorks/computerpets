package com.enterprisepet.config;

import com.enterprisepet.security.AdminRequestSignature;
import jakarta.servlet.ServletInputStream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class AdminRequestSignatureFilterTest {

    private static final String KEY = "test-admin-secret";
    private static final String PREVIOUS = "previous-admin-secret";
    private final AdminRequestSignatureFilter filter = new AdminRequestSignatureFilter(KEY, PREVIOUS);

    @Test
    @DisplayName("verify, download, catalog, and OPTIONS preflight are not this gate")
    void otherDoorsPass() throws Exception {
        assertPassed("POST", "/api/verify/steam");
        assertPassed("POST", "/api/download/red_panda");
        assertPassed("GET", "/api/pets");
        assertPassed("GET", "/api/bundles/red_panda");
        assertPassed("OPTIONS", "/api/admin/licenses");
        assertPassed("GET", "/api/public/heartbeat");
    }

    @Test
    @DisplayName("a static X-Admin-Key without a MAC is 401 and does not reach the controller")
    void staticKeyRefused() throws Exception {
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/admin/revoke");
        req.setContent("{\"jti\":\"abc\"}".getBytes(StandardCharsets.UTF_8));
        req.addHeader("X-Admin-Key", KEY);
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};

        filter.doFilter(req, res, (request, response) -> reached[0] = true);

        assertThat(reached[0]).isFalse();
        assertThat(res.getStatus()).isEqualTo(401);
        assertThat(res.getContentType()).isEqualTo(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        assertThat(res.getContentAsString()).contains("Admin signature required.");
    }

    @Test
    @DisplayName("GET /api/admin/licenses without a signature is 401")
    void unsignedGetRefused() throws Exception {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/admin/licenses");
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};

        filter.doFilter(req, res, (request, response) -> reached[0] = true);

        assertThat(reached[0]).isFalse();
        assertThat(res.getStatus()).isEqualTo(401);
        assertThat(res.getContentAsString()).contains("Admin signature required.");
    }

    @Test
    @DisplayName("a valid signature reaches the controller with the same body bytes")
    void signedPostPassesBodyThrough() throws Exception {
        byte[] body = "{\"jti\":\"abc\"}".getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond());
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", ts, body);

        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/admin/revoke");
        req.setContent(body);
        req.addHeader(AdminRequestSignature.TIMESTAMP_HEADER, ts);
        req.addHeader(AdminRequestSignature.SIGNATURE_HEADER, sig);
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
    @DisplayName("the previous admin key verifies during rotation")
    void previousKeyPasses() throws Exception {
        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/admin/licenses");
        req.setQueryString("owner=steam%3A1");
        String ts = Long.toString(Instant.now().getEpochSecond());
        String sig = AdminRequestSignature.sign(PREVIOUS, "GET", "/api/admin/licenses", "owner=steam%3A1", ts, new byte[0]);
        req.addHeader(AdminRequestSignature.TIMESTAMP_HEADER, ts);
        req.addHeader(AdminRequestSignature.SIGNATURE_HEADER, sig);
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};

        filter.doFilter(req, res, (request, response) -> reached[0] = true);

        assertThat(reached[0]).isTrue();
    }

    @Test
    @DisplayName("a skewed timestamp is 401 and does not reach the controller")
    void skewedTimestampRefused() throws Exception {
        byte[] body = "{}".getBytes(StandardCharsets.UTF_8);
        String ts = Long.toString(Instant.now().getEpochSecond() - 301);
        String sig = AdminRequestSignature.sign(KEY, "POST", "/api/admin/revoke", "", ts, body);
        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/admin/revoke");
        req.setContent(body);
        req.addHeader(AdminRequestSignature.TIMESTAMP_HEADER, ts);
        req.addHeader(AdminRequestSignature.SIGNATURE_HEADER, sig);
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};

        filter.doFilter(req, res, (request, response) -> reached[0] = true);

        assertThat(reached[0]).isFalse();
        assertThat(res.getStatus()).isEqualTo(401);
        assertThat(res.getContentAsString()).contains("300 second window");
    }

    private void assertPassed(String method, String path) throws Exception {
        MockHttpServletResponse res = new MockHttpServletResponse();
        boolean[] reached = {false};
        filter.doFilter(new MockHttpServletRequest(method, path), res,
                (request, response) -> reached[0] = true);
        assertThat(reached[0]).isTrue();
    }
}
