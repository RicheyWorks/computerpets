package com.enterprisepet.config;

import com.enterprisepet.security.MachineRequestSignature;
import com.enterprisepet.security.MachineRequestSignature.Decision;
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
 * Fail-closed HMAC on machine writes to {@code /api/verify}.
 *
 * <p>GET discovery ({@code /providers}, {@code /nft/collections}) stays
 * unsigned. {@code POST /api/download} stays the license JWT. Signed bundle
 * redeem stays the URL MAC. The house {@code /admin} ledger stays
 * {@code X-Admin-Key}. Human Unlock still receives a license and uses that
 * JWT; the overlay and blotter sign this POST with the license key they
 * already hold (ADR 0070).
 */
@Component
@Order(200)
public class MachineRequestSignatureFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(MachineRequestSignatureFilter.class);

    private final String currentKey;
    private final String previousKey;

    public MachineRequestSignatureFilter(
            @Value("${license.secret-key:}") String currentKey,
            @Value("${license.secret-key-previous:}") String previousKey) {
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
            log.warn("Machine verify body unreadable path={}", path);
            writeUnauthorized(res, "Machine signature invalid.");
            return;
        }

        Decision decision = MachineRequestSignature.verify(
                currentKey,
                previousKey,
                req.getMethod(),
                path,
                req.getQueryString(),
                req.getHeader(MachineRequestSignature.TIMESTAMP_HEADER),
                req.getHeader(MachineRequestSignature.SIGNATURE_HEADER),
                body,
                Instant.now().getEpochSecond());

        if (decision != Decision.OK) {
            log.warn("Machine verify refused path={} reason={}", path, decision);
            writeUnauthorized(res, detail(decision));
            return;
        }

        chain.doFilter(new CachedBodyRequest(req, body), res);
    }

    /**
     * Writes under {@code /api/verify}. Reads (provider list, NFT catalog)
     * are not machine commands.
     */
    public static boolean requiresSignature(String method, String path) {
        if (method == null || path == null) {
            return false;
        }
        if (!"POST".equalsIgnoreCase(method)
                && !"PUT".equalsIgnoreCase(method)
                && !"PATCH".equalsIgnoreCase(method)
                && !"DELETE".equalsIgnoreCase(method)) {
            return false;
        }
        return "/api/verify".equals(path) || path.startsWith("/api/verify/");
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
            case SKEW -> "Machine request outside the 300 second window.";
            case INVALID -> "Machine signature invalid.";
            case MISSING, OK -> "Machine signature required.";
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
                    // Synchronous verify bodies only.
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
