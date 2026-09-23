package com.enterprisepet.config;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;

/**
 * Managed Postgres JDBC TLS (ADR 0076).
 *
 * <p>There is no second datasource URL builder. Spring uses
 * {@code SPRING_DATASOURCE_URL} as the operator set it. {@link #managedUrl}
 * is the shape Terraform writes into {@code jdbc_url}: {@code sslmode=require},
 * or {@code sslmode=verify-full} when a CA bundle path is supplied. This class
 * does not rewrite a URL at startup and does not invent a CA.
 *
 * <p>Local, compose, and in-cluster Postgres omit {@code sslmode}. On
 * {@code prod}, that cleartext shape and the managed shape are all-or-nothing.
 */
public final class PostgresJdbcSsl {

    public static final String MODE_REQUIRE = "require";
    public static final String MODE_VERIFY_FULL = "verify-full";
    public static final String MODE_DISABLE = "disable";

    private PostgresJdbcSsl() {
    }

    /**
     * JDBC URL for a managed endpoint. Blank {@code rootCertPath} is
     * {@code sslmode=require}. A path is {@code sslmode=verify-full} plus
     * {@code sslrootcert}. The path is not checked here.
     */
    public static String managedUrl(String host, String database, String rootCertPath) {
        if (host == null || host.isBlank() || database == null || database.isBlank()) {
            throw new IllegalArgumentException(
                    "managed JDBC URL needs a host and a database name (ADR 0076).");
        }
        if (host.indexOf('?') >= 0 || host.indexOf('/') >= 0 || database.indexOf('?') >= 0) {
            throw new IllegalArgumentException(
                    "managed JDBC host and database must not contain a query or an extra slash (ADR 0076).");
        }
        String base = "jdbc:postgresql://" + host.trim() + ":5432/" + database.trim();
        if (rootCertPath == null || rootCertPath.isBlank()) {
            return base + "?sslmode=require";
        }
        return base + "?sslmode=verify-full&sslrootcert=" + rootCertPath.trim();
    }

    /**
     * Prod all-or-nothing check (ADR 0076). Cleartext (no {@code sslmode}, or
     * {@code sslmode=disable}) is accepted only when SSL is not required and
     * no CA path is set. Managed mode is {@code sslmode=require} with no CA,
     * or {@code sslmode=verify-full} whose {@code sslrootcert} matches the CA
     * path. The replica, when set, must use that same mode. A CA path must
     * name a readable PEM file. The path value is not included in the message.
     */
    public static void rejectHalfConfigured(
            String primaryUrl,
            String replicaUrl,
            boolean sslRequired,
            String rootCertPath) {
        String cert = rootCertPath == null ? "" : rootCertPath.trim();
        if (!cert.isEmpty() && !isLocalCertPath(cert)) {
            throw new IllegalStateException(
                    "POSTGRES_SSL_ROOT_CERT must be a local CA bundle path. "
                            + "A URL, a query, or a space is not a bundle. Refusing start (ADR 0076).");
        }
        boolean replicaOn = replicaUrl != null && !replicaUrl.isBlank();
        Query primary = parse(primaryUrl);
        Query replica = replicaOn ? parse(replicaUrl) : null;

        if (!sslRequired && cert.isEmpty() && isCleartext(primary) && (replica == null || isCleartext(replica))) {
            return;
        }
        boolean primaryOk = managedMode(primary, cert);
        boolean replicaOk = replica == null || managedMode(replica, cert);
        if (!sslRequired || !primaryOk || !replicaOk) {
            throw new IllegalStateException(
                    "Postgres transit TLS on prod is all-or-nothing (ADR 0076). "
                            + "Leave POSTGRES_SSL_REQUIRED and POSTGRES_SSL_ROOT_CERT unset and omit sslmode "
                            + "for in-cluster Postgres. For managed RDS set POSTGRES_SSL_REQUIRED=true and "
                            + (cert.isEmpty()
                                    ? "sslmode=require on the JDBC URL (no sslrootcert). "
                                    : "sslmode=verify-full with sslrootcert matching POSTGRES_SSL_ROOT_CERT. ")
                            + "The replica URL must use that same mode when it is set. "
                            + "prefer, allow, verify-ca, and the legacy ssl property are refused. "
                            + "Refusing a half-configured datasource (ssl-required=" + sslRequired
                            + ", root-cert=" + (cert.isEmpty() ? "unset" : "set")
                            + ", primary=" + describe(primary)
                            + (replica == null ? "" : ", replica=" + describe(replica))
                            + ").");
        }
        if (!cert.isEmpty()) {
            assertReadablePem(Path.of(cert));
        }
    }

    static Query parse(String jdbcUrl) {
        if (jdbcUrl == null) {
            return Query.empty();
        }
        String trimmed = jdbcUrl.trim();
        int q = trimmed.indexOf('?');
        if (q < 0 || q == trimmed.length() - 1) {
            return Query.empty();
        }
        String sslmode = null;
        String root = null;
        boolean duplicate = false;
        boolean legacySsl = false;
        for (String part : trimmed.substring(q + 1).split("&", -1)) {
            if (part.isEmpty()) {
                continue;
            }
            int eq = part.indexOf('=');
            String key = decode(eq < 0 ? part : part.substring(0, eq)).trim().toLowerCase(Locale.ROOT);
            String value = decode(eq < 0 ? "" : part.substring(eq + 1)).trim();
            if ("sslmode".equals(key)) {
                if (sslmode != null) {
                    duplicate = true;
                }
                sslmode = value.toLowerCase(Locale.ROOT);
            } else if ("sslrootcert".equals(key)) {
                if (root != null) {
                    duplicate = true;
                }
                root = value;
            } else if ("ssl".equals(key)) {
                legacySsl = true;
            }
        }
        return new Query(sslmode == null ? "" : sslmode, root == null ? "" : root, duplicate, legacySsl);
    }

    private static boolean isLocalCertPath(String cert) {
        if (cert.indexOf('?') >= 0 || cert.indexOf('&') >= 0 || cert.indexOf(' ') >= 0
                || cert.indexOf('\\') >= 0 || cert.contains("://") || cert.contains("..")) {
            return false;
        }
        return true;
    }

    private static boolean isCleartext(Query query) {
        return !query.duplicate()
                && !query.legacySsl()
                && query.sslRootCert().isEmpty()
                && (query.sslmode().isEmpty() || MODE_DISABLE.equals(query.sslmode()));
    }

    private static boolean managedMode(Query query, String cert) {
        if (query.duplicate() || query.legacySsl()) {
            return false;
        }
        if (cert.isEmpty()) {
            return MODE_REQUIRE.equals(query.sslmode()) && query.sslRootCert().isEmpty();
        }
        return MODE_VERIFY_FULL.equals(query.sslmode()) && cert.equals(query.sslRootCert());
    }

    private static String describe(Query query) {
        if (query.duplicate()) {
            return "duplicate-ssl-params";
        }
        if (query.legacySsl()) {
            return "legacy-ssl";
        }
        if (query.sslmode().isEmpty()) {
            return "sslmode-absent";
        }
        return "sslmode=" + query.sslmode() + (query.sslRootCert().isEmpty() ? "" : ",sslrootcert=set");
    }

    private static void assertReadablePem(Path path) {
        if (!Files.isRegularFile(path) || !Files.isReadable(path)) {
            throw new IllegalStateException(
                    "POSTGRES_SSL_ROOT_CERT does not name a readable CA bundle. "
                            + "Refusing verify-full without a CA. Do not invent a bundle (ADR 0076).");
        }
        byte[] head;
        try (InputStream in = Files.newInputStream(path)) {
            head = in.readNBytes(8192);
        } catch (IOException e) {
            throw new IllegalStateException(
                    "POSTGRES_SSL_ROOT_CERT could not be read. "
                            + "Refusing verify-full without a CA. Do not invent a bundle (ADR 0076).",
                    e);
        }
        String preview = new String(head, StandardCharsets.US_ASCII);
        if (!preview.contains("BEGIN CERTIFICATE")) {
            throw new IllegalStateException(
                    "POSTGRES_SSL_ROOT_CERT is not a PEM CA bundle (no BEGIN CERTIFICATE). "
                            + "Refusing verify-full. Do not invent a bundle (ADR 0076).");
        }
    }

    private static String decode(String raw) {
        try {
            return URLDecoder.decode(raw.replace("+", "%2B"), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            return raw;
        }
    }

    record Query(String sslmode, String sslRootCert, boolean duplicate, boolean legacySsl) {
        static Query empty() {
            return new Query("", "", false, false);
        }
    }
}
