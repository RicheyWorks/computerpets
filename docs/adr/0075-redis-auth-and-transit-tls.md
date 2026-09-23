# 0075. Redis AUTH and transit TLS

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `RateLimitConfiguration.redisUri`; `deploy/terraform/modules/redis`; `check-redis-auth.sh`

## Context

[0074](0074-waf-in-front-of-rate-limiter.md) left this gap: managed Redis had no AUTH token and no transit TLS, because the app only read `REDIS_HOST` / `REDIS_PORT` / `REDIS_TIMEOUT`. Inventory on `main` tip `4479cc87c`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `RateLimitConfiguration` | One Lettuce `RedisClient` from host, port, and timeout. Rate limits, the jti deny-list, nonces, download JWTs, and grants share that client | No password, no TLS. A token the JVM cannot read would fail every connection |
| `SecretFileEnvironmentPostProcessor` | `*_FILE` for house keys and optional storefront keys | `REDIS_PASSWORD` was not a file-backed name |
| `deploy/k8s/redis.yaml` and compose | Redis 7 with no `requirepass` | Correct for local. Not an ElastiCache AUTH node |
| `deploy/terraform/modules/redis` | One `aws_elasticache_cluster` in a private subnet | No `auth_token`. The cluster API cannot set AUTH. Transit encryption stayed off ([0062](0062-terraform-managed-stores.md)) |

ElastiCache accepts an AUTH token only on a replication group, and only with transit encryption. The token must be 16–128 printable ASCII characters excluding space, `@`, `"`, and `/`.

This slice does not reopen presence/CSP, Hikari/replica, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, or the WAF ACL beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Optional AUTH and transit TLS on the one Lettuce URI. Local and in-cluster Redis stay AUTH-less. Prod fails closed when the password is required and missing. Terraform turns AUTH and transit encryption on together when a token is supplied.**

1. **App settings.** `REDIS_PASSWORD` (and `REDIS_PASSWORD_FILE`), `REDIS_SSL` (default false), and `REDIS_AUTH_REQUIRED` (default false). Blank password and SSL off build the same URI as before: host, port, timeout, no AUTH, no TLS.
2. **One client.** `RateLimitConfiguration.redisUri` is the only production `RedisURI`. Lettuce `withPassword` sends AUTH. `withSsl(true)` plus `withVerifyPeer(true)` is direct TLS (`rediss`), not STARTTLS. Jedis is not on the classpath; a second client would split the settings. The same `RedisClient` still feeds the rate limiter, jti deny-list, nonce store, download JWT store, and grant index.
3. **Fail closed.** If `REDIS_AUTH_REQUIRED=true` and the password is blank, or the flag is on and `REDIS_SSL` is false, the process refuses to start. On `prod`, the trio is all-or-nothing: leave password, SSL, and the flag unset for in-cluster Redis, or set all three. A password without TLS, TLS without a password, or the flag without either refuses start. When `COMPUTERPETS_SECRETS_SOURCE=file` and AUTH is on, `REDIS_PASSWORD_FILE` is required. The password is never logged. `RedisURI.toString` does not contain it.
4. **Terraform.** `redis_auth_token` defaults empty and is sensitive. Empty keeps `aws_elasticache_cluster` with no AUTH and no transit TLS. Non-empty creates one `aws_elasticache_replication_group` (`num_cache_clusters = 1`, failover off) with `auth_token`, `transit_encryption_enabled`, and `at_rest_encryption_enabled`. A short token or a token containing space, `@`, `"`, or `/` fails the plan. The token is not a Terraform output and is not written in `terraform.tfvars.example`. Pass `TF_VAR_redis_auth_token` (`openssl rand -hex 16`). ElastiCache stores it in state at create time — use an encrypted backend. This is not `write_house_secret_values` (that flag stays false). The token is not a house crypto key.
5. **Wiring.** When `redis_auth_enabled` is true, set `REDIS_SSL=true`, `REDIS_AUTH_REQUIRED=true`, and inject the same token as `REDIS_PASSWORD` or `REDIS_PASSWORD_FILE`. Do not put it in the ConfigMap. In-cluster `redis.yaml` and compose do not gain `requirepass`. Port stays 6379.
6. **Verify without a cloud bill.** `check-redis-auth.sh` and `RedisAuthTlsContractTest` lock the URI and the HCL markers. `terraform test` in `deploy/terraform/redis_auth.tftest.hcl` plans with a mock provider: an empty token stays AUTH-less; a short token and a token with `/` are refused; a fixture token plans AUTH and transit TLS. CI does not `apply`.

## Consequences

- Compose, `mvn` against `localhost:6379`, and the in-cluster Redis Deployment keep booting with no password and no TLS.
- A keeper who sets `REDIS_AUTH_REQUIRED` and forgets the password does not start a process that would talk to Redis without AUTH.
- A keeper who applies a token gets transit TLS in the same plan. AUTH without TLS is not an ElastiCache shape, and prod will not send AUTH in cleartext.
- The token can sit in Terraform state. Do not commit it. Do not print plan output that expands sensitive values into a log you keep.
- Peer verification uses the JVM truststore. ElastiCache certificates are Amazon Trust Services. A JVM without that root fails the handshake closed. There is no switch to disable verify.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Postgres transit TLS. The RDS module encrypts storage and does not set `rds.force_ssl`. `jdbc_url` is `jdbc:postgresql://host:5432/db` with no `sslmode=require`. Not started here.
