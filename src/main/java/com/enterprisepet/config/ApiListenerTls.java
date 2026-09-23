package com.enterprisepet.config;

import java.net.URI;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Public API listener TLS (ADR 0077).
 *
 * <p>The JVM keeps listening on {@link #LISTEN_PORT} without {@code server.ssl}.
 * TLS terminates at {@code deploy/k8s/ingress-tls.yaml} (cert-manager) or at
 * the ALB HTTPS listener. Local, compose, and the in-cluster Service leave
 * {@code API_LISTENER_TLS_REQUIRED} unset and stay HTTP. On {@code prod}, a
 * set flag refuses a cleartext public origin. This class does not request an
 * ACM certificate and does not invent a hostname.
 */
public final class ApiListenerTls {

    public static final int LISTEN_PORT = 8081;

    private static final Pattern PUBLIC_HOST = Pattern.compile(
            "^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$");

    private ApiListenerTls() {
    }

    /**
     * Prod check (ADR 0077). A keystore or {@code server.ssl.enabled} is
     * refused even when the public flag is off: this process does not
     * terminate TLS. When the flag is on, {@code publicBaseUrl} must be an
     * {@code https} origin on port 443. The URL is not included in the message.
     */
    public static void rejectCleartextPublicListener(
            boolean tlsRequired,
            String publicBaseUrl,
            boolean serverSslEnabled,
            String keyStore) {
        if (serverSslEnabled || (keyStore != null && !keyStore.isBlank())) {
            throw new IllegalStateException(
                    "The JVM listens on 8081 without server.ssl. "
                            + "Do not enable SSL or set a keystore. "
                            + "Public TLS terminates at the Ingress or the ALB listener (ADR 0077).");
        }
        if (!tlsRequired) {
            return;
        }
        String problem = publicUrlProblem(publicBaseUrl);
        if (problem != null) {
            throw new IllegalStateException(problem);
        }
    }

    /**
     * @return a refusal message when {@code raw} is not an https origin, or
     *         null when it is. The raw value is not copied into the message.
     */
    public static String publicUrlProblem(String raw) {
        if (raw == null || raw.isBlank()) {
            return "API_LISTENER_TLS_REQUIRED=true needs API_PUBLIC_BASE_URL=https://<host>. "
                    + "A blank URL is a cleartext public listener. Refusing start (ADR 0077).";
        }
        URI uri;
        try {
            uri = URI.create(raw.trim());
        } catch (IllegalArgumentException e) {
            return "API_PUBLIC_BASE_URL must be an https origin. Refusing start (ADR 0077).";
        }
        if (uri.getScheme() == null || !"https".equals(uri.getScheme().toLowerCase(Locale.ROOT))) {
            return "API_PUBLIC_BASE_URL must use https when API_LISTENER_TLS_REQUIRED is set. "
                    + "http is a cleartext public listener. Refusing start (ADR 0077).";
        }
        if (uri.getUserInfo() != null) {
            return "API_PUBLIC_BASE_URL must not carry userinfo. Refusing start (ADR 0077).";
        }
        if (uri.getRawQuery() != null || uri.getRawFragment() != null) {
            return "API_PUBLIC_BASE_URL is an origin, not a query or a fragment. Refusing start (ADR 0077).";
        }
        String path = uri.getPath();
        if (path != null && !path.isEmpty() && !"/".equals(path)) {
            return "API_PUBLIC_BASE_URL must be an origin with no path. Refusing start (ADR 0077).";
        }
        String host = uri.getHost();
        if (host == null || host.isBlank() || !PUBLIC_HOST.matcher(host).matches()) {
            return "API_PUBLIC_BASE_URL needs a public hostname. Refusing start (ADR 0077).";
        }
        String lower = host.toLowerCase(Locale.ROOT);
        if ("localhost".equals(lower)
                || lower.endsWith(".localhost")
                || "127.0.0.1".equals(lower)
                || "::1".equals(lower)
                || lower.endsWith(".local")) {
            return "API_PUBLIC_BASE_URL must not be a loopback host when the public listener requires TLS. "
                    + "Refusing start (ADR 0077).";
        }
        int port = uri.getPort();
        if (port != -1 && port != 443) {
            return "API_PUBLIC_BASE_URL port must be 443 or omitted. "
                    + "Another port is not this public listener. Refusing start (ADR 0077).";
        }
        return null;
    }
}
