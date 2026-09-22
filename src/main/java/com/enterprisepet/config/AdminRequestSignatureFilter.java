package com.enterprisepet.config;

import com.enterprisepet.security.AdminRequestSignature;
import com.enterprisepet.security.AdminRequestSignature.Decision;
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
 * {@code ADMIN_API_KEY} (current, then previous during rotation). Machine
 * verify stays a different canonical version and a different key (ADR 0070).
 */
@Component
@Order(210)
public class AdminRequestSignatureFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AdminRequestSignatureFilter.class);

    private final String currentKey;
    private final String previousKey;

    public AdminRequestSignatureFilter(
            @Value("${admin.api-key:}") String currentKey,
            @Value("${admin.api-key-previous:}") String previousKey) {
        this.currentKey = currentKey == null ? "" : currentKey;
        this.previousKey = previousKey == null ? "" : previousKey;
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

        Decision decision = AdminRequestSignature.verify(
                currentKey,
                previousKey,
                req.getMethod(),
                path,
                req.getQueryString(),
                req.getHeader(AdminRequestSignature.TIMESTAMP_HEADER),
                req.getHeader(AdminRequestSignature.SIGNATURE_HEADER),
                body,
                Instant.now().getEpochSecond());

        if (decision != Decision.OK) {
            log.warn("Admin request refused path={} reason={}", path, decision);
            writeUnauthorized(res, detail(decision));
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
            case MISSING, OK -> "Admin signature required.";
        };
    }

    private static void writeUnauthorized(HttpServletResponse res, String detail) throws IOException {
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        res.getWriter().write(
                "{\"type\":\"about:blank\",\"title\":\"Unauthorized\",\"status\":401,\"detail\":\""
                        + detail + "\"}");
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
