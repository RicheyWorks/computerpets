package com.enterprisepet.config;

import io.lettuce.core.RedisURI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Optional Redis AUTH and transit TLS (ADR 0075). Local defaults stay
 * AUTH-less. A required password that is missing refuses to start.
 */
class RedisAuthTlsContractTest {

    private static final String FIXTURE = "plan-fixture-token";

    @Test
    @DisplayName("unset password and SSL match local Redis")
    void defaultsStayAuthless() {
        RateLimitProperties.Redis redis = new RateLimitProperties.Redis();

        RedisURI uri = RateLimitConfiguration.redisUri(redis);

        assertThat(uri.getHost()).isEqualTo("localhost");
        assertThat(uri.getPort()).isEqualTo(6379);
        assertThat(uri.getTimeout()).isEqualTo(Duration.ofMillis(200));
        assertThat(uri.isSsl()).isFalse();
        assertThat(uri.isStartTls()).isFalse();
        char[] password = uri.getPassword();
        assertThat(password == null || password.length == 0).isTrue();
    }

    @Test
    @DisplayName("password and SSL land on one Lettuce URI and the password is not in toString")
    void passwordAndSsl() {
        RateLimitProperties.Redis redis = configured(true, true, false);

        RedisURI uri = RateLimitConfiguration.redisUri(redis);

        assertThat(uri.isSsl()).isTrue();
        assertThat(uri.isVerifyPeer()).isTrue();
        assertThat(uri.isStartTls()).isFalse();
        assertThat(new String(uri.getPassword())).isEqualTo(FIXTURE);
        assertThat(uri.toString()).doesNotContain(FIXTURE);
    }

    @Test
    @DisplayName("auth-required with a blank password refuses to start")
    void authRequiredWithoutPasswordFailsClosed() {
        RateLimitProperties.Redis redis = configured(true, false, true);
        redis.setPassword("   ");

        assertThatThrownBy(() -> RateLimitConfiguration.redisUri(redis))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("REDIS_PASSWORD")
                .hasMessageNotContaining(FIXTURE);
    }

    @Test
    @DisplayName("auth-required without TLS refuses cleartext AUTH")
    void authRequiredWithoutSslFailsClosed() {
        RateLimitProperties.Redis redis = configured(false, true, true);

        assertThatThrownBy(() -> RateLimitConfiguration.redisUri(redis))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("REDIS_SSL")
                .hasMessageNotContaining(FIXTURE);
    }

    @Test
    @DisplayName("auth-required with password and TLS builds a verified rediss URI")
    void authRequiredWithPasswordAndSsl() {
        RedisURI uri = RateLimitConfiguration.redisUri(configured(true, true, true));

        assertThat(uri.isSsl()).isTrue();
        assertThat(uri.isVerifyPeer()).isTrue();
        assertThat(new String(uri.getPassword())).isEqualTo(FIXTURE);
        assertThat(uri.toString()).doesNotContain(FIXTURE);
    }

    @Test
    @DisplayName("Terraform enables AUTH and transit TLS only when a token is supplied")
    void terraformPairsAuthAndTransitTls() throws Exception {
        String hcl = Files.readString(Path.of("deploy/terraform/modules/redis/main.tf"));
        String vars = Files.readString(Path.of("deploy/terraform/variables.tf"));
        String outputs = Files.readString(Path.of("deploy/terraform/outputs.tf"));
        String yaml = Files.readString(Path.of("src/main/resources/application.yml"));
        String secrets = Files.readString(Path.of(
                "src/main/java/com/enterprisepet/config/SecretFileEnvironmentPostProcessor.java"));

        assertThat(hcl).contains("redis-auth ADR 0075: empty token");
        assertThat(hcl).contains("redis-auth ADR 0075: non-empty token");
        assertThat(hcl).contains("local.provision && !local.auth_enabled ? 1 : 0");
        assertThat(hcl).contains("local.provision && local.auth_enabled ? 1 : 0");
        assertThat(hcl).contains("transit_encryption_enabled = true");
        assertThat(hcl).contains("at_rest_encryption_enabled = true");
        assertThat(hcl).containsPattern("auth_token\\s+=\\s+var\\.auth_token");
        assertThat(hcl).doesNotContain("withStartTls");
        assertThat(vars).contains("variable \"redis_auth_token\"");
        assertThat(vars).contains("default     = \"\"");
        assertThat(outputs).contains("output \"redis_auth_enabled\"");
        assertThat(outputs).doesNotContain("output \"redis_auth_token\"");
        assertThat(yaml).contains("password: ${REDIS_PASSWORD:}");
        assertThat(yaml).contains("ssl: ${REDIS_SSL:false}");
        assertThat(yaml).contains("auth-required: ${REDIS_AUTH_REQUIRED:false}");
        assertThat(secrets).contains("\"REDIS_PASSWORD\"");
        assertThat(Files.readString(Path.of("deploy/k8s/redis.yaml"))).doesNotContain("requirepass");
        assertThat(Files.readString(Path.of("deploy/terraform/terraform.tfvars.example")))
                .doesNotContain("redis_auth_token =");
    }

    private static RateLimitProperties.Redis configured(boolean ssl, boolean password, boolean authRequired) {
        RateLimitProperties.Redis redis = new RateLimitProperties.Redis();
        redis.setSsl(ssl);
        redis.setAuthRequired(authRequired);
        if (password) {
            redis.setPassword(FIXTURE);
        }
        return redis;
    }
}
