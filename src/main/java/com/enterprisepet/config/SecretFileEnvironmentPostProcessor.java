package com.enterprisepet.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.SystemEnvironmentPropertySource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Loads house secrets from Docker / Kubernetes / Vault-agent file mounts.
 *
 * <p>Operator contract (deny-safe):
 * <ul>
 *   <li>A non-blank env value for {@code NAME} wins (local-dev {@code .env}, k8s {@code envFrom}).</li>
 *   <li>Else if {@code NAME_FILE} is set, read that path as UTF-8. Trailing CR/LF is stripped.</li>
 *   <li>If {@code NAME_FILE} is set and the path is missing or unreadable, refuse to start.</li>
 *   <li>Never invent a production default. Never log secret values — only the names sourced from files.</li>
 * </ul>
 *
 * <p>Critical keys still fail-hard in their {@code @PostConstruct} guards when blank or
 * placeholder. Optional storefront keys stay fail-closed at verify time.
 */
public final class SecretFileEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    static final String PROPERTY_SOURCE_NAME = "computerpetsSecretFiles";

    /**
     * Env names that may be supplied via {@code NAME_FILE}. Keep in sync with
     * {@code docs/SETUP.md} § Secret management and ADR 0056.
     */
    static final List<String> SECRET_ENV_NAMES = List.of(
            "LICENSE_SECRET_KEY",
            "LICENSE_SECRET_KEY_PREVIOUS",
            "JWT_SECRET_KEY",
            "JWT_SECRET_KEY_PREVIOUS",
            "BUNDLE_SIGNING_KEY",
            "BUNDLE_SIGNING_KEY_PREVIOUS",
            "ADMIN_API_KEY",
            "ADMIN_API_KEY_PREVIOUS",
            "SPRING_DATASOURCE_PASSWORD",
            "POSTGRES_PASSWORD",
            "REDIS_PASSWORD",
            "METRICS_SCRAPE_TOKEN",
            "STEAM_API_KEY",
            "ITCH_API_KEY",
            "EPIC_CLIENT_ID",
            "EPIC_CLIENT_SECRET",
            "EPIC_DEPLOYMENT_ID",
            "ETHEREUM_RPC_URL"
    );

    private static final Logger log = LoggerFactory.getLogger(SecretFileEnvironmentPostProcessor.class);

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> fromFiles = new LinkedHashMap<>();
        List<String> loadedNames = new ArrayList<>();

        for (String name : SECRET_ENV_NAMES) {
            if (hasNonBlank(environment, name)) {
                continue;
            }
            String filePath = environment.getProperty(name + "_FILE");
            if (filePath == null || filePath.isBlank()) {
                continue;
            }
            String value = readSecretFile(name, filePath.trim());
            fromFiles.put(name, value);
            loadedNames.add(name);
        }

        if (fromFiles.isEmpty()) {
            return;
        }

        // SystemEnvironmentPropertySource so STEAM_API_KEY binds to steam.api-key, etc.
        environment.getPropertySources().addFirst(
                new SystemEnvironmentPropertySource(PROPERTY_SOURCE_NAME, fromFiles));
        // Names only — never the values.
        log.info("Loaded {} house secret(s) from *_FILE mounts: {}", loadedNames.size(), loadedNames);
    }

    static boolean hasNonBlank(ConfigurableEnvironment environment, String name) {
        String value = environment.getProperty(name);
        return value != null && !value.isBlank();
    }

    /**
     * Reads a secret file. Missing or unreadable paths refuse start. Values are never logged.
     */
    static String readSecretFile(String name, String filePath) {
        Path path = Path.of(filePath);
        if (!Files.isRegularFile(path) || !Files.isReadable(path)) {
            throw new IllegalStateException(
                    name + "_FILE points to a missing or unreadable path (" + path + "). "
                            + "Refuse to start — do not invent a production secret. "
                            + "Fix the mount or unset " + name + "_FILE.");
        }
        try {
            String raw = Files.readString(path, StandardCharsets.UTF_8);
            return stripTrailingNewline(raw);
        } catch (IOException e) {
            throw new IllegalStateException(
                    "Failed to read " + name + "_FILE. Refuse to start — secret values are not logged.",
                    e);
        }
    }

    /** Docker / k8s secret files often end with a single newline. */
    static String stripTrailingNewline(String raw) {
        if (raw == null || raw.isEmpty()) {
            return raw == null ? "" : raw;
        }
        if (raw.endsWith("\r\n")) {
            return raw.substring(0, raw.length() - 2);
        }
        if (raw.endsWith("\n") || raw.endsWith("\r")) {
            return raw.substring(0, raw.length() - 1);
        }
        return raw;
    }

    @Override
    public int getOrder() {
        // After ConfigData so application.yml is present; before bean binding.
        return Ordered.LOWEST_PRECEDENCE - 100;
    }
}
