# 0062. Terraform for managed Postgres, Redis, secrets, CDN, and WAF stubs

- **Status:** Accepted (WAF association superseded by [0074](0074-waf-in-front-of-rate-limiter.md); Redis AUTH/TLS optional path added by [0075](0075-redis-auth-and-transit-tls.md); Postgres transit TLS added by [0076](0076-postgres-transit-tls.md); API listener TLS added by [0077](0077-api-listener-tls.md); secrets and CDN in this ADR still stand)
- **Date:** 2026-09-22
- **Code:** `deploy/terraform/` (root + `modules/{postgres,redis,secrets,cdn,waf}`); `check-managed-stores.sh`

## Context

ARCHITECTURE deployment gaps still listed **Terraform for managed stores** after GHCR image signing ([0061](0061-ghcr-image-signing.md)). Inventory on `main` tip `45ca937b6`:

- `deploy/k8s/` ships app Deployments and in-cluster Postgres 16 + Redis 7 (compose-equivalent scaffolding, not HA).
- Secret injection is env, `*_FILE`, or External Secrets ([0056](0056-house-secrets-from-file-mounts.md)); no Terraform owned the secret shells or managed data planes.
- No `deploy/terraform/` (or Pulumi / Crossplane) for managed Postgres, Redis, secrets, CDN, or WAF.

This slice closes that named gap without storefront work, without DirectX 12 / Vulkan, and without reopening presence / CSP, Hikari / replica, bundle zip, or cosign beyond this cross-link. Catalog stays 221. Solana stays blocked. No live cloud account is invented in-repo or required for unit tests.

## Decision

**One Terraform root, deny-safe defaults, External Secrets contract preserved.**

1. **Root** — `deploy/terraform/` wires optional modules for Postgres (RDS), Redis (ElastiCache), Secrets Manager shells, CDN (private S3 + CloudFront OAC), and a regional WAF ACL stub. AWS is the reference provider; keepers may fork for GCP/Azure.
2. **Networking gate** — Postgres and Redis resources are created only when `vpc_id` and `private_subnet_ids` are set. Ingress rules appear only for explicit `app_cidr_blocks` (empty = deny-all). `postgres_publicly_accessible` defaults to false and **validation refuses true**.
3. **Secrets** — Terraform creates Secrets Manager **shells** named `computerpets/<KEY>` matching `deploy/k8s/external-secret.example.yaml`. `write_house_secret_values` must stay false so house crypto never enters Terraform state from tfvars. RDS master passwords use `manage_master_user_password` (AWS-managed secret).
4. **Redis honesty** — The original module had no AUTH token and no transit TLS. The app only read `REDIS_HOST` / `REDIS_PORT` / `REDIS_TIMEOUT`. Private SG + subnet isolation was the control. Superseded in part by [0075](0075-redis-auth-and-transit-tls.md): an empty `redis_auth_token` still keeps that AUTH-less cluster; a token creates a replication group with AUTH and transit encryption, and the app reads `REDIS_PASSWORD` / `REDIS_SSL`.
5. **CDN / WAF stubs** — Bundle bucket is private (block public ACLs; OAC-only reads). The original WAF ACL was a single 2000/5-minute rule with optional ALB association. That association is superseded by [0074](0074-waf-in-front-of-rate-limiter.md) (regional ACL, default block, buckets match the JVM filter, plan refuses an empty ALB ARN).
6. **Verify without a cloud bill** — `check-managed-stores.sh` asserts deny-safe HCL + ESO name alignment, then `terraform init -backend=false && terraform validate` when the binary is present. CI does not `apply`.

## Consequences

- Operators with an AWS account can plan/apply, populate secret shells out of band, point ConfigMap at outputs (`configmap-managed.example.yaml`), and drop in-cluster Postgres/Redis.
- In-cluster manifests remain the default local/cluster scaffolding until a keeper applies managed stores.
- Pulumi / Crossplane stay non-goals for this slice (same gap class; Terraform was the named next item).
- Next non-storefront / non-DX12 maturity item after the CDN stub: CDN edge redeem verification — see [0063](0063-cdn-edge-redeem-verification.md).
