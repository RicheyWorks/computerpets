package com.enterprisepet.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Optional Postgres read-replica JDBC settings. Empty {@code url} means the
 * house stays on a single primary pool (the default). Do not invent a cloud
 * replica URL — set {@code SPRING_DATASOURCE_REPLICA_URL} only when a real
 * read-only endpoint exists.
 */
@ConfigurationProperties(prefix = "spring.datasource.replica")
public class ReplicaDataSourceProperties {

    /**
     * JDBC URL for the read replica. Blank = disabled.
     */
    private String url = "";

    /**
     * Optional. Blank inherits {@code spring.datasource.username}.
     */
    private String username = "";

    /**
     * Optional. Blank inherits {@code spring.datasource.password}.
     */
    private String password = "";

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url == null ? "" : url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? "" : username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? "" : password;
    }

    public boolean isConfigured() {
        return ReplicaRoutingSupport.isConfigured(url);
    }
}
