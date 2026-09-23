# 0074. Regional WAF in front of the rate limiter

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `deploy/terraform/modules/waf`; `check-waf-gate.sh`; `WafRateLimitGateContractTest`

## Context

[0073](0073-download-jwt-single-use.md) left this gap: the WAF in front of the rate limiter was still the Terraform stub in [0062](0062-terraform-managed-stores.md). Inventory on `main` tip `b3095ebad`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/terraform/modules/waf` | One regional ACL, default **allow**, a single rate rule of 2000 requests / 5 minutes / IP, plus `AWSManagedRulesCommonRuleSet` | Did not match the four JVM buckets. Association was `count` on an empty ARN, so the ACL was not in front of anything |
| `deploy/k8s/ingress.yaml` | Optional nginx Ingress, not in the kustomization | No rate-limit annotations. It is not a WAF |
| `RateLimitingFilter` | Inner gate: verify 10/min, download 30/min, discovery 60/min, bundles 60/min. Signed `GET /api/bundles/{pet}/redeem` is outside the bundles bucket. Redis down is **503** | Not an edge gate. A client that never reaches the JVM is not counted here |
| Redis module | Private subnet, no AUTH, no transit TLS | The app still builds `RedisURI` from `REDIS_HOST` / `REDIS_PORT` / `REDIS_TIMEOUT` only (`RateLimitConfiguration`). Inventing AUTH here would break that contract |

The bundle CloudFront distribution serves zip bytes ([0063](0063-cdn-edge-redeem-verification.md)). It does not serve `/api/*`. Attaching these rules there would not sit in front of the rate limiter.

This slice does not reopen presence/CSP, Hikari/replica, bundle zip, cosign, CDN edge, secrets, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, or the download JWT `jti` beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Fail-closed regional Web ACL on the API application load balancer. Rules match the JVM buckets. Default action is block. Plan refuses an empty ARN.**

1. **Buckets.** Four rate-based rules, `aggregate_key_type = IP`, `evaluation_window_sec = 60`, action **block** with HTTP **429**, `Retry-After: 60`, and a small JSON body. Limits and prefixes are the filter rules, not a Terraform variable:
   - `verify` — `/api/verify/` — 10
   - `download` — `/api/download/` — 30
   - `discovery` — `/api/pets` — 60
   - `bundles` — `/api/bundles/` — 60, excluding `^/api/bundles/[^/]+/redeem/?$`
2. **Then** `AWSManagedRulesCommonRuleSet` with `override_action` none (block, not count).
3. **Then** one allow rule for the house doors already on this JVM: `/api/verify`, `/api/download`, `/api/pets`, `/api/bundles`, `/api/admin`, `/api/public`, exact `/pet/feed`, `/pet/play`, `/pet/rest`, and `/actuator/health` (liveness and readiness). Sampled requests stay off so a download bearer is not stored by the ACL.
4. **Default block.** Anything else, including `/actuator/prometheus` and `/actuator/info` on the public ALB, is **403** and does not reach the JVM. In-cluster scrapes of the Service do not pass the ALB. The ALB health check path must be `/actuator/health` or `/actuator/health/liveness`, not `/`.
5. **Association.** `aws_wafv2_web_acl_association.alb` is always in the module when `enable_waf` is true. It has no `count`. Root `terraform_data.waf_association_gate` requires `waf_associate_alb_arn` to be an `arn:aws:elasticloadbalancing:…:loadbalancer/app/…` ARN. `terraform validate` still passes with the empty default (no cloud account). `terraform plan` / `apply` with `enable_waf=true` (the default) **fails closed** until that ARN is set. `terraform test` (mock provider) locks that refusal. `enable_waf=false` is the explicit switch for a cluster that has no ALB; the JVM filter remains the only bucket. The bundle distribution does not gain a web ACL id.
6. **Ingress.** `deploy/k8s/ingress.yaml` stays optional and does not grow nginx `limit-rps` / `limit-rpm` annotations. Those would be a third bucket. Keepers set `TRUSTED_PROXY_CIDRS` to the ALB subnet so the inner bucket sees the same client the WAF counted ([0067](0067-trusted-proxy-client-address.md)). This ADR does not change `ClientAddress`.
7. **Verify without a cloud bill.** `check-waf-gate.sh` and `WafRateLimitGateContractTest` lock the markers to `RateLimitingFilter.RULES`. `terraform test` in `deploy/terraform/waf_gate.tftest.hcl` plans with a mock provider: an empty ARN and a network load balancer ARN are refused; an application load balancer ARN plans. CI does not `apply`.

## Consequences

- A keeper who applies this root without an API ALB ARN does not get a quiet unassociated ACL. The plan stops.
- The outer gate and the inner gate share the same four prefixes and the same per-minute budgets. The WAF counts at the edge and returns **429**. The JVM filter still returns **429** when its Redis bucket is empty, and **503** when Redis is down. The WAF does not know that Redis is down.
- WAF evaluation is a fixed window. The JVM filter is a token bucket. A client can still trip one before the other inside the same minute. The budgets are the same size.
- Signed redeem is allowed through and is not on the bundles rate rule. HMAC, one-time consume, and IP binding stay on the house ([0055](0055-download-jti-one-time-and-ip-bound.md)).
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Redis AUTH and transit TLS are still off. `RateLimitConfiguration` only reads `REDIS_HOST` / `REDIS_PORT` / `REDIS_TIMEOUT`. Not started here — a password the JVM cannot read would break the AUTH-less contract in [0062](0062-terraform-managed-stores.md).
