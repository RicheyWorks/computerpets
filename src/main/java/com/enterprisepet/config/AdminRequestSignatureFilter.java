package com.enterprisepet.config;

import com.enterprisepet.security.AdminRequestSignature;
import com.enterprisepet.security.AdminRequestSignature.Decision;
import com.enterprisepet.security.RequestReplayStore;
import com.enterprisepet.security.RequestReplayStore.Claim;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

/**
 * Fail-closed HMAC on every method under {@code /api/admin} except OPTIONS.
 *
 * <p>A static {@code X-Admin-Key} is not accepted. The MAC key is
 * {@code ADMIN_API_KEY} (current, then previous during rotation). The nonce
 * is single-use for {@link AdminRequestSignature#SKEW_SECONDS} seconds
 * (ADR 0072). Machine verify stays a different canonical version and a
 * different key (ADR 0070).
 */
@Component
@Order(210)
public class AdminRequestSignatureFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AdminRequestSignatureFilter.class);

    private final String currentKey;
    private final String previousKey;
    private final RequestReplayStore replayStore;

    public AdminRequestSignatureFilter(
            @Value("${admin.api-key:}") String currentKey,
            @Value("${admin.api-key-previous:}") String previousKey,
            RequestReplayStore replayStore) {
        this.currentKey = currentKey == null ? "" : currentKey;
        this.previousKey = previousKey == null ? "" : previousKey;
        this.replayStore = replayStore;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String path = pathOf(req);
        if (!requiresSignature(req.getMethod(), path)) {
            chain.doFilter(req, res);
            return;
        }

        byte[] body;
        try {
            body = req.getInputStream().readAllBytes();
        } catch (IOException e) {
            log.warn("Admin body unreadable path={}", path);
            writeUnauthorized(res, "Admin signature invalid.");
            return;
        }

        String nonce = req.getHeader(AdminRequestSignature.NONCE_HEADER);
        Decision decision = AdminRequestSignature.verify(
                currentKey,
                previousKey,
                req.getMethod(),
                path,
                req.getQueryString(),
                req.getHeader(AdminRequestSignature.TIMESTAMP_HEADER),
                nonce,
                req.getHeader(AdminRequestSignature.SIGNATURE_HEADER),
                body,
                Instant.now().getEpochSecond());

        if (decision != Decision.OK) {
            log.warn("Admin request refused path={} reason={}", path, decision);
            writeUnauthorized(res, detail(decision));
            return;
        }

        Claim claim;
        try {
            claim = replayStore.claim(RequestReplayStore.SURFACE_ADMIN, nonce);
        } catch (RuntimeException e) {
            log.warn("Admin nonce store unavailable path={}", path, e);
            writeUnavailable(res, "Admin nonce store unavailable.");
            return;
        }
        if (claim != Claim.FRESH) {
            log.warn("Admin request replayed path={}", path);
            writeUnauthorized(res, "Admin request replayed.");
            return;
        }

        chain.doFilter(new CachedBodyRequest(req, body), res);
    }

    /**
     * Every method under {@code /api/admin}, including GET audit reads.
     * OPTIONS is the browser preflight and carries no MAC.
     */
    public static boolean requiresSignature(String method, String path) {
        if (method == null || path == null) {
            return false;
        }
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return false;
        }
        return "/api/admin".equals(path) || path.startsWith("/api/admin/");
    }

    static String pathOf(HttpServletRequest req) {
        String uri = req.getRequestURI();
        if (uri == null) {
            return "";
        }
        int semi = uri.indexOf(';');
        if (semi >= 0) {
            uri = uri.substring(0, semi);
        }
        return uri;
    }

    private static String detail(Decision decision) {
        return switch (decision) {
            case SKEW -> "Admin request outside the 300 second window.";
            case INVALID -> "Admin signature invalid.";
            case NONCE_MISSING -> "Admin nonce required.";
            case NONCE_INVALID -> "Admin nonce invalid.";
            case MISSING, OK -> "Admin signature required.";
        };
    }

    private static void writeUnauthorized(HttpServletResponse res, String detail) throws IOException {
        writeProblem(res, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized", detail);
    }

    private static void writeUnavailable(HttpServletResponse res, String detail) throws IOException {
        writeProblem(res, HttpServletResponse.SC_SERVICE_UNAVAILABLE, "Service Unavailable", detail);
    }

    private static void writeProblem(HttpServletResponse res, int status, String title, String detail)
            throws IOException {
        res.setStatus(status);
        res.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        res.getWriter().write(
                "{\"type\":\"about:blank\",\"title\":\"" + title + "\",\"status\":" + status
                        + ",\"detail\":\"" + detail + "\"}");
    }

    private static final class CachedBodyRequest extends HttpServletRequestWrapper {
        private final byte[] body;

        CachedBodyRequest(HttpServletRequest request, byte[] body) {
            super(request);
            this.body = body;
        }

        @Override
        public ServletInputStream getInputStream() {
            ByteArrayInputStream in = new ByteArrayInputStream(body);
            return new ServletInputStream() {
                @Override
                public boolean isFinished() {
                    return in.available() == 0;
                }

                @Override
                public boolean isReady() {
                    return true;
                }

                @Override
                public void setReadListener(ReadListener readListener) {
                    // Synchronous admin bodies only.
                }

                @Override
                public int read() {
                    return in.read();
                }
            };
        }

        @Override
        public BufferedReader getReader() {
            return new BufferedReader(new InputStreamReader(getInputStream(), StandardCharsets.UTF_8));
        }

        @Override
        public int getContentLength() {
            return body.length;
        }

        @Override
        public long getContentLengthLong() {
            return body.length;
        }
    }
}
