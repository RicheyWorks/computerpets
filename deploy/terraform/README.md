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
```

## Deny-safe defaults

| Control | Default |
|---------|---------|
| Postgres `publicly_accessible` | **false** (variable validation refuses true) |
| Postgres/Redis ingress | **no rules** until `app_cidr_blocks` is set |
| Postgres/Redis resources | **skipped** until `vpc_id` + `private_subnet_ids` are set |
| House crypto in tfvars / state | **refused** (`write_house_secret_values` must stay false) |
| Secrets Manager | **shells only** — names match External Secrets `remoteRef` keys |
| Bundle bucket | Block public ACLs; CloudFront OAC only. Edge redeem: `deploy/cdn/` ([ADR 0063](../../docs/adr/0063-cdn-edge-redeem-verification.md)) |
| Redis AUTH / TLS | **off** — the app has no Redis password setting (same honesty as k8s README) |

## Operator flow

```bash
cd deploy/terraform
cp terraform.tfvars.example terraform.tfvars   # fill vpc / subnets / app CIDRs
terraform init
terraform plan                                 # needs AWS creds for a real plan
terraform apply                                # keeper's account — not CI
```

Then:

1. Put house key **values** into Secrets Manager out of band (`aws secretsmanager put-secret-value` or Vault). Never via `*.tfvars`.
2. Apply a copy of `deploy/k8s/external-secret.example.yaml`.
3. Point the ConfigMap at terraform outputs (`configmap-managed.example.yaml`); drop in-cluster Postgres/Redis Deployments.
4. Set `BUNDLE_BASE_URL` from the CDN output.
5. Optionally set `waf_associate_alb_arn`.
6. Keep the ADR 0061 digest verify gate before `kubectl set image`.

## Local verify (no cloud account)

```bash
./deploy/terraform/check-managed-stores.sh
./deploy/terraform/check-managed-stores.test.sh
```

`check-managed-stores.sh` asserts deny-safe HCL + External Secrets name alignment,
then runs `terraform init -backend=false` and `terraform validate` when the
`terraform` binary is on `PATH`.

## Out of scope

- Live AWS/GCP/Azure accounts in this repo or in CI
- Pulumi / Crossplane (same gap class; Terraform was the named next item)
- Inventing Redis AUTH the app cannot read
- Storefront / monetization, DirectX 12 / Vulkan, Solana
- Reopening presence/CSP, Hikari/replica, bundle zip, or cosign beyond cross-links
