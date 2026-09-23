# Managed stores (Terraform)

ARCHITECTURE named this gap after GHCR image signing ([ADR 0061](../../docs/adr/0061-ghcr-image-signing.md)):
no Terraform for managed Postgres, Redis, secrets, CDN, or WAF. In-cluster
Postgres/Redis in `deploy/k8s/` remain compose-equivalent scaffolding.

This root is the shippable skeleton. AWS is the **reference** provider so a
keeper with an account can `plan` / `apply`. Unit tests and local verify do
**not** need a cloud account or paid APIs.

## Inventory (what already existed)

| Path | Role |
|------|------|
| `deploy/k8s/` | App Deployments, in-cluster Postgres 16 + Redis 7, Ingress example |
| `deploy/k8s/external-secret.example.yaml` | ESO → `computerpets-secrets` contract ([ADR 0056](../../docs/adr/0056-house-secrets-from-file-mounts.md)) |
| `deploy/k8s/verify-image-signature.sh` | Fail-closed GHCR digest verify ([ADR 0061](../../docs/adr/0061-ghcr-image-signing.md)) |
| *(none)* | Terraform / Pulumi / Crossplane for managed stores — **this tree** |

## Layout

```
deploy/terraform/
  main.tf / variables.tf / outputs.tf / versions.tf / providers.tf
  terraform.tfvars.example
  configmap-managed.example.yaml   # ConfigMap overlay after apply (not kustomized)
  modules/postgres|redis|secrets|cdn|waf/
  check-managed-stores.sh          # deny-safe asserts + terraform validate
  check-managed-stores.test.sh
  check-waf-gate.sh                # JVM buckets == regional ACL (ADR 0074)
  check-waf-gate.test.sh
  check-redis-auth.sh              # Lettuce AUTH/TLS == ElastiCache token (ADR 0075)
  check-redis-auth.test.sh
  redis_auth.tftest.hcl
```

## Deny-safe defaults

| Control | Default |
|---------|---------|
| Postgres `publicly_accessible` | **false** (variable validation refuses true) |
| Postgres/Redis ingress | **no rules** until `app_cidr_blocks` is set |
| Postgres/Redis resources | **skipped** until `vpc_id` + `private_subnet_ids` are set |
| House crypto in tfvars / state | **refused** (`write_house_secret_values` must stay false) |
| Secrets Manager | **shells only** — names match External Secrets `remoteRef` keys |
| Bundle bucket | Block public ACLs; CloudFront OAC only. Edge redeem: `deploy/cdn/` ([ADR 0063](../../docs/adr/0063-cdn-edge-redeem-verification.md)). Not the API WAF |
| API WAF | Regional ACL, default **block**, four buckets matching `RateLimitingFilter` (10/30/60/60 per minute). Plan **refuses** an empty ALB ARN ([ADR 0074](../../docs/adr/0074-waf-in-front-of-rate-limiter.md)) |
| Redis AUTH / TLS | **off** unless `redis_auth_token` is set (`TF_VAR_`, never in git). A token enables AUTH + transit encryption together. The app reads `REDIS_PASSWORD` / `REDIS_SSL` / `REDIS_AUTH_REQUIRED` ([ADR 0075](../../docs/adr/0075-redis-auth-and-transit-tls.md)) |

## Operator flow

```bash
cd deploy/terraform
cp terraform.tfvars.example terraform.tfvars   # fill vpc / subnets / app CIDRs
# waf_associate_alb_arn must be the API ALB before plan (ADR 0074)
terraform init
terraform plan                                 # needs AWS creds for a real plan
terraform apply                                # keeper's account — not CI
```

Then:

1. Put house key **values** into Secrets Manager out of band (`aws secretsmanager put-secret-value` or Vault). Never via `*.tfvars`.
2. Apply a copy of `deploy/k8s/external-secret.example.yaml`.
3. Point the ConfigMap at terraform outputs (`configmap-managed.example.yaml`); drop in-cluster Postgres/Redis Deployments.
4. Set `BUNDLE_BASE_URL` from the CDN output.
5. Confirm `waf_associate_alb_arn` was the API application load balancer (health check `/actuator/health` or `/actuator/health/liveness`). Do not attach this ACL to the bundle CloudFront distribution. `enable_waf=false` is the explicit switch for no edge gate; the JVM filter remains.
6. If `redis_auth_enabled` is true, set `REDIS_SSL=true` and `REDIS_AUTH_REQUIRED=true`, and inject the same token as `REDIS_PASSWORD` or `REDIS_PASSWORD_FILE` (`openssl rand -hex 16`). Leave all three unset when the output is false.
7. Keep the ADR 0061 digest verify gate before `kubectl set image`.

## Local verify (no cloud account)

```bash
./deploy/terraform/check-managed-stores.sh
./deploy/terraform/check-managed-stores.test.sh
./deploy/terraform/check-waf-gate.sh
./deploy/terraform/check-waf-gate.test.sh
./deploy/terraform/check-redis-auth.sh
./deploy/terraform/check-redis-auth.test.sh
terraform -chdir=deploy/terraform test    # mock provider; empty ALB ARN and a short Redis token must fail the plan
```

`check-managed-stores.sh` asserts deny-safe HCL + External Secrets name alignment,
then runs `terraform init -backend=false` and `terraform validate` when the
`terraform` binary is on `PATH`.

## Out of scope

- Live AWS/GCP/Azure accounts in this repo or in CI
- Pulumi / Crossplane (same gap class; Terraform was the named next item)
- Committing a Redis AUTH token (pass `TF_VAR_redis_auth_token`; ADR 0075)
- Storefront / monetization, DirectX 12 / Vulkan, Solana
- Reopening presence/CSP, Hikari/replica, bundle zip, or cosign beyond cross-links
