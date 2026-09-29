package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.mock.env.MockEnvironment;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SecretFileEnvironmentPostProcessorTest {

    private final SecretFileEnvironmentPostProcessor processor = new SecretFileEnvironmentPostProcessor();
    private final SpringApplication application = new SpringApplication();

    @TempDir
    Path tempDir;

    @Test
    @DisplayName("loads LICENSE_SECRET_KEY from LICENSE_SECRET_KEY_FILE when env is blank")
    void loadsFromFileWhenEnvBlank() throws Exception {
        Path file = tempDir.resolve("license");
        Files.writeString(file, "file-license-value\n", StandardCharsets.UTF_8);

        StandardEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "LICENSE_SECRET_KEY_FILE", file.toString()
        )));

        processor.postProcessEnvironment(env, application);

        assertThat(env.getProperty("LICENSE_SECRET_KEY")).isEqualTo("file-license-value");
        assertThat(env.getPropertySources().contains(SecretFileEnvironmentPostProcessor.PROPERTY_SOURCE_NAME))
                .isTrue();
    }

    @Test
    @DisplayName("non-blank env wins over *_FILE")
    void envWinsOverFile() throws Exception {
        Path file = tempDir.resolve("license");
        Files.writeString(file, "from-file", StandardCharsets.UTF_8);

        StandardEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "LICENSE_SECRET_KEY", "from-env",
                "LICENSE_SECRET_KEY_FILE", file.toString()
        )));

        processor.postProcessEnvironment(env, application);

        assertThat(env.getProperty("LICENSE_SECRET_KEY")).isEqualTo("from-env");
        assertThat(env.getPropertySources().contains(SecretFileEnvironmentPostProcessor.PROPERTY_SOURCE_NAME))
                .isFalse();
    }

    @Test
    @DisplayName("missing *_FILE path refuses to start without inventing a secret")
    void missingFileRefusesStart() {
        StandardEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "ADMIN_API_KEY_FILE", tempDir.resolve("does-not-exist").toString()
        )));

        assertThatThrownBy(() -> processor.postProcessEnvironment(env, application))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("ADMIN_API_KEY_FILE")
                .hasMessageContaining("Refuse to start")
                .hasMessageContaining("do not invent");
    }

    @Test
    @DisplayName("exception and property source never carry a distinctive secret value into the name list")
    void doesNotExposeFileValueInExceptionOnMissingSibling() throws Exception {
        Path good = tempDir.resolve("jwt");
        Files.writeString(good, "super-secret-jwt-value-do-not-leak", StandardCharsets.UTF_8);
        Path missing = tempDir.resolve("missing-admin");

        StandardEnvironment env = new StandardEnvironment();
        // JWT loads; ADMIN missing → refuse. The JWT value must not appear in the failure text.
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "JWT_SECRET_KEY_FILE", good.toString(),
                "ADMIN_API_KEY_FILE", missing.toString()
        )));

        assertThatThrownBy(() -> processor.postProcessEnvironment(env, application))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageNotContaining("super-secret-jwt-value-do-not-leak");
    }

    @Test
    @DisplayName("loads REDIS_PASSWORD from REDIS_PASSWORD_FILE when env is blank")
    void loadsRedisPasswordFromFile() throws Exception {
        Path file = tempDir.resolve("redis-password");
        Files.writeString(file, "plan-fixture-token\n", StandardCharsets.UTF_8);

        StandardEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "REDIS_PASSWORD_FILE", file.toString()
        )));

        processor.postProcessEnvironment(env, application);

        assertThat(env.getProperty("REDIS_PASSWORD")).isEqualTo("plan-fixture-token");
        assertThat(SecretFileEnvironmentPostProcessor.SECRET_ENV_NAMES).contains("REDIS_PASSWORD");
        assertThat(SecretFileEnvironmentPostProcessor.SECRET_ENV_NAMES).contains("METRICS_SCRAPE_TOKEN");
    }

    @Test
    @DisplayName("optional STEAM_API_KEY_FILE loads and binds as steam.api-key via relaxed names")
    void optionalSteamFileBindsRelaxed() throws Exception {
        Path file = tempDir.resolve("steam");
        Files.writeString(file, "steam-from-file", StandardCharsets.UTF_8);

        StandardEnvironment env = new StandardEnvironment();
        env.getPropertySources().addFirst(new MapPropertySource("test", Map.of(
                "STEAM_API_KEY_FILE", file.toString()
        )));

        processor.postProcessEnvironment(env, application);

        assertThat(env.getProperty("STEAM_API_KEY")).isEqualTo("steam-from-file");
        assertThat(env.getProperty("steam.api-key")).isEqualTo("steam-from-file");
    }

    @Test
    @DisplayName("blank *_FILE is ignored; no property source added")
    void blankFileEnvIgnored() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("JWT_SECRET_KEY_FILE", "   ");

        processor.postProcessEnvironment(env, application);

        assertThat(env.getPropertySources().contains(SecretFileEnvironmentPostProcessor.PROPERTY_SOURCE_NAME))
                .isFalse();
    }

    @Test
    @DisplayName("stripTrailingNewline removes a single CR/LF only")
    void stripTrailingNewline() {
        assertThat(SecretFileEnvironmentPostProcessor.stripTrailingNewline("abc\n")).isEqualTo("abc");
        assertThat(SecretFileEnvironmentPostProcessor.stripTrailingNewline("abc\r\n")).isEqualTo("abc");
        assertThat(SecretFileEnvironmentPostProcessor.stripTrailingNewline("abc\r")).isEqualTo("abc");
        assertThat(SecretFileEnvironmentPostProcessor.stripTrailingNewline("abc\n\n")).isEqualTo("abc\n");
        assertThat(SecretFileEnvironmentPostProcessor.stripTrailingNewline("")).isEqualTo("");
    }
}
