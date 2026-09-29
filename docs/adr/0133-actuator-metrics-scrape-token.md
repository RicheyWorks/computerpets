# 0133. House metrics need their own scrape token, not a customer JWT

- **Status:** Accepted
- **Date:** 2026-09-28
- **Code:** `src/main/java/com/enterprisepet/security/MetricsScrapeTokenFilter.java`, `src/main/java/com/enterprisepet/config/SecurityConfig.java`, `src/main/java/com/enterprisepet/config/ProductionProfileGuard.java`, `src/main/java/com/enterprisepet/config/SecretFileEnvironmentPostProcessor.java`, `src/main/resources/application.yml`, `src/test/java/com/enterprisepet/config/ActuatorMetricsDoorTest.java`, `src/test/java/com/enterprisepet/config/ActuatorMetricsClosedTest.java`, `src/test/java/com/enterprisepet/security/MetricsScrapeTokenFilterTest.java`, `deploy/k8s/README.md`, `deploy/k8s/external-secret.example.yaml`, `docs/SETUP.md`, `docs/ARCHITECTURE.md`

## Context

The step planned after the security PRs of 2026-09-23 (#1442 to #1444) was Redis AUTH and transit TLS. That had already landed as [0075](0075-redis-auth-and-transit-tls.md), followed by Postgres TLS ([0076](0076-postgres-transit-tls.md)) and API listener TLS ([0077](0077-api-listener-tls.md)). After that, the chain of "next gap" notes moved to infra and the desktop, and ARCHITECTURE's weaknesses list is struck through. So the next gap was found by reading `SecurityConfig` against the deploy tree.

`management.endpoints.web.exposure.include` is `health,info,prometheus`. `SecurityConfig` let anyone reach the three health paths. `/actuator/prometheus`, `/actuator/info`, and the `/actuator` index fell through to `anyRequest().authenticated()`. `JwtAuthenticationFilter` makes **any** valid download JWT `ROLE_CLIENT`, and a keeper gets one from `POST /api/verify` for a pet they own. So any customer could read the house metrics: JVM and Hikari internals, request URIs with status counts, and the business meters (`enterprisepet.verify` by provider and outcome, `enterprisepet.license.issue` by pet).

[0074](0074-waf-in-front-of-rate-limiter.md) meant those paths to be internal: the regional WAF blocks `/actuator/prometheus` and `/actuator/info` on the public ALB by default. But the WAF only fronts the ALB. The in-tree k8s Ingress (`ingress.yaml`, `ingress-tls.yaml`) sends `/` to the Service on 8081, and compose publishes the port directly. On those paths the JVM was the only gate, and it let a customer JWT through. A real Prometheus could not scrape either, because it has no way to mint a short-lived download JWT.

## Decision

1. `/actuator/prometheus` and `/actuator/info` require `ROLE_METRICS`. Only `MetricsScrapeTokenFilter` grants it, and only when `Authorization: Bearer <METRICS_SCRAPE_TOKEN>` matches. The comparison is constant-time over SHA-256 digests. The filter looks at those two paths only, so the token opens nothing else.
2. A customer download JWT (`ROLE_CLIENT`) gets **403** there. Every other `/actuator/**` path, and the `/actuator` index, is `denyAll`.
3. Deny-safe default: with no token, or a token under 32 characters, nobody scrapes. Local dev and tests do not need a token, and health does not change.
4. `metrics.scrape-token` binds `METRICS_SCRAPE_TOKEN`. `METRICS_SCRAPE_TOKEN_FILE` uses the existing `*_FILE` loader ([0056](0056-house-secrets-from-file-mounts.md)).
5. On `prod`, `ProductionProfileGuard` refuses to start when a token is set but is shorter than 32 characters. With `COMPUTERPETS_SECRETS_SOURCE=file`, a set token must come from `METRICS_SCRAPE_TOKEN_FILE`. The token is never logged. The guard's start line now says `metrics scrape=closed|token`.
6. Health, liveness and readiness stay anonymous. Probes, the ALB health check and the WAF allow list do not change.

## Consequences

- Operators who want Prometheus put `METRICS_SCRAPE_TOKEN` (`openssl rand -hex 32`) on the Secret, or mount it, and point the scrape job's `authorization.credentials_file` at the same file (`deploy/k8s/README.md`). There is no real deploy in this change.
- The token is optional and not a house crypto key, so `modules/secrets` does not create a shell for it. That matches `REDIS_PASSWORD`. The ExternalSecret example carries it commented out.
- The WAF stays the outer gate on the ALB. This makes the JVM refuse on its own, whichever way a request arrives.
- A separate management port was considered. It would move probes and the ALB health check, and change the Service, both Deployments and compose. It is left as a follow-up if an operator wants the port split as well.
