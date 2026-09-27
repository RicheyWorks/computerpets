package com.enterprisepet.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * The regional WAF ACL (ADR 0074) must keep the same four buckets as
 * {@link RateLimitingFilter}. An unassociated allow-all ACL is not a gate.
 */
class WafRateLimitGateContractTest {

    private static final Path WAF = Path.of("deploy/terraform/modules/waf/main.tf");
    private static final Path CDN = Path.of("deploy/terraform/modules/cdn/main.tf");
    private static final Path INGRESS = Path.of("deploy/k8s/ingress.yaml");
    private static final Path VARS = Path.of("deploy/terraform/variables.tf");

    @Test
    @DisplayName("WAF locals match RateLimitingFilter buckets on a 60-second window")
    void bucketsMatchFilter() throws Exception {
        String hcl = Files.readString(WAF);
        assertThat(RateLimitingFilter.RULES).hasSize(4);
        for (RateLimitingFilter.Rule rule : RateLimitingFilter.RULES) {
            assertThat(rule.period()).isEqualTo(Duration.ofMinutes(1));
            String marker = "waf-bucket %s prefix=%s limit=%d window_sec=60"
                .formatted(rule.bucketKey(), rule.pathPrefix(), rule.capacity());
            assertThat(hcl).contains(marker);
            assertThat(hcl).containsPattern(
                rule.bucketKey() + "_limit\\s*=\\s*" + rule.capacity() + "\\b");
            assertThat(hcl).contains("limit                 = local." + rule.bucketKey() + "_limit");
            assertThat(hcl).contains("search_string         = local." + rule.bucketKey() + "_prefix");
        }
        assertThat(hcl).contains("window_sec = 60");
        assertThat(hcl).doesNotContain("waf_rate_limit");
        assertThat(hcl).doesNotContain("count {");
        assertThat(hcl).doesNotContainPattern("(?m)^\\s*count\\s*=");
    }

    @Test
    @DisplayName("ACL defaults deny, rate rules answer 429, and the ALB association is unconditional")
    void denySafeAssociation() throws Exception {
        // The block checks below span lines. A Windows checkout (core.autocrlf) has CRLF.
        String hcl = Files.readString(WAF).replace("\r\n", "\n");
        assertThat(hcl).contains("scope       = \"REGIONAL\"");
        assertThat(hcl).contains("default_action {\n    block {}");
        assertThat(hcl).doesNotContain("default_action {\n    allow");
        assertThat(hcl).contains("response_code            = 429");
        assertThat(hcl).contains("aggregate_key_type    = \"IP\"");
        assertThat(hcl).contains("aws_wafv2_web_acl_association\" \"alb\"");
        String root = Files.readString(Path.of("deploy/terraform/main.tf"));
        assertThat(root).contains("terraform_data\" \"waf_association_gate\"");
        assertThat(root).contains("loadbalancer/app/");
        assertThat(hcl).contains("sampled_requests_enabled   = false");
        assertThat(hcl).doesNotContain("sampled_requests_enabled   = true");
        assertThat(hcl).contains("override_action {\n      none {}");
        assertThat(Files.readString(CDN)).doesNotContain("web_acl_id");
        assertThat(Files.readString(VARS)).doesNotContain("variable \"waf_rate_limit\"");
        String ingress = Files.readString(INGRESS);
        assertThat(ingress).contains("ADR 0074");
        assertThat(ingress).doesNotContain("limit-rps");
        assertThat(ingress).doesNotContain("limit-rpm");
    }

    @Test
    @DisplayName("signed redeem is outside the bundles rule, and the allow regex is the house doors")
    void redeemExcludedAndAllowListIsHouseDoors() throws Exception {
        String hcl = Files.readString(WAF);
        String redeem = "^/api/bundles/[^/]+/redeem/?$";
        assertThat(hcl).contains(redeem);
        Pattern redeemPattern = Pattern.compile(redeem);
        List<String> bundles = List.of(
            "/api/bundles/red_panda",
            "/api/bundles/red_panda/redeem",
            "/api/bundles/red_panda/redeem/",
            "/api/bundles/red_panda/redeem/extra",
            "/api/bundles/redeem",
            "/api/bundles/red_panda/sha"
        );
        for (String path : bundles) {
            boolean excluded = redeemPattern.matcher(path).matches();
            assertThat(excluded)
                .as(path)
                .isEqualTo(RateLimitingFilter.isSignedBundleRedeem(path));
        }

        int regexAt = hcl.indexOf("waf-allow-regex=");
        assertThat(regexAt).isGreaterThan(0);
        String allow = hcl.substring(regexAt + "waf-allow-regex=".length(), hcl.indexOf('\n', regexAt)).trim();
        Pattern allowPattern = Pattern.compile(allow);
        for (String path : List.of(
            "/api/verify",
            "/api/verify/providers",
            "/api/verify/nft/collections",
            "/api/verify/steam",
            "/api/download/red_panda",
            "/api/pets",
            "/api/pets/by-rarity",
            "/api/pets/red_panda",
            "/api/bundles/red_panda",
            "/api/bundles/red_panda/redeem",
            "/api/admin/licenses",
            "/api/admin/revoke",
            "/api/public/heartbeat",
            "/pet/feed",
            "/pet/play",
            "/pet/rest",
            "/actuator/health",
            "/actuator/health/liveness",
            "/actuator/health/readiness"
        )) {
            assertThat(allowPattern.matcher(path).matches()).as(path).isTrue();
        }
        for (String path : List.of(
            "/actuator/prometheus",
            "/actuator/info",
            "/pet/feed/extra",
            "/pet/sleep",
            "/api/petstore",
            "/admin",
            "/"
        )) {
            assertThat(allowPattern.matcher(path).matches()).as(path).isFalse();
        }
    }
}
