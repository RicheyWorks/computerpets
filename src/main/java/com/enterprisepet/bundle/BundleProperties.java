package com.enterprisepet.bundle;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

/**
 * {@code bundle.*} catalog settings. Signing key and base URL stay on
 * {@link PetBundleService} via {@code @Value}; this list is the leftover
 * metadata the signed manifest can tell the truth about.
 *
 * <p>Empty {@link #catalog} is the right default until a zip is published.
 * Do not invent sha256 values for files that do not exist.
 */
@ConfigurationProperties(prefix = "bundle")
public class BundleProperties {

    /**
     * Platform used when the client omits {@code platform} (or sends an
     * unsupported value). One of {@code win}, {@code mac}, {@code linux}, {@code any}.
     */
    private String defaultPlatform = "win";

    private List<CatalogEntry> catalog = new ArrayList<>();

    public String getDefaultPlatform() {
        return defaultPlatform;
    }

    public void setDefaultPlatform(String defaultPlatform) {
        this.defaultPlatform = defaultPlatform;
    }

    public List<CatalogEntry> getCatalog() {
        return catalog;
    }

    public void setCatalog(List<CatalogEntry> catalog) {
        this.catalog = catalog == null ? new ArrayList<>() : catalog;
    }

    public static class CatalogEntry {
        private String petKey;
        private String version;
        private String platform;
        private String sha256;
        /** Object key under {@code bundle.base-url}. Optional. */
        private String path;

        public String getPetKey() {
            return petKey;
        }

        public void setPetKey(String petKey) {
            this.petKey = petKey;
        }

        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getPlatform() {
            return platform;
        }

        public void setPlatform(String platform) {
            this.platform = platform;
        }

        public String getSha256() {
            return sha256;
        }

        public void setSha256(String sha256) {
            this.sha256 = sha256;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }
    }
}
