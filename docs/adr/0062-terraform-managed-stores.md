# 0062. Terraform for managed Postgres, Redis, secrets, CDN, and WAF stubs

- **Status:** Accepted
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
4. **Redis honesty** — No AUTH token and no transit TLS requirement. The app still only reads `REDIS_HOST` / `REDIS_PORT` / `REDIS_TIMEOUT` (same as k8s README). Private SG + subnet isolation is the control until the app grows Redis TLS.
5. **CDN / WAF stubs** — Bundle bucket is private (block public ACLs; OAC-only reads). WAF ACL includes a rate-based rule + AWS common managed rules; ALB association is optional via `waf_associate_alb_arn`.
6. **Verify without a cloud bill** — `check-managed-stores.sh` asserts deny-safe HCL + ESO name alignment, then `terraform init -backend=false && terraform validate` when the binary is present. CI does not `apply`.

## Consequences

- Operators with an AWS account can plan/apply, populate secret shells out of band, point ConfigMap at outputs (`configmap-managed.example.yaml`), and drop in-cluster Postgres/Redis.
- In-cluster manifests remain the default local/cluster scaffolding until a keeper applies managed stores.
- Pulumi / Crossplane stay non-goals for this slice (same gap class; Terraform was the named next item).
- Next non-storefront / non-DX12 maturity item: a real keeper apply of this root (or CDN edge redeem verification) — see ROADMAP / ARCHITECTURE remaining gaps.
