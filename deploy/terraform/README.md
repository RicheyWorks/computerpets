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
  modules/postgres|redis|secrets|cdn|waf|api_listener|node_pool|cluster_autoscaler/
  check-managed-stores.sh          # deny-safe asserts + terraform validate
  check-managed-stores.test.sh
  check-waf-gate.sh                # JVM buckets == regional ACL (ADR 0074)
  check-waf-gate.test.sh
  check-redis-auth.sh              # Lettuce AUTH/TLS == ElastiCache token (ADR 0075)
  check-redis-auth.test.sh
  redis_auth.tftest.hcl
  check-postgres-tls.sh            # JDBC sslmode == rds.force_ssl (ADR 0076)
  check-postgres-tls.test.sh
  postgres_tls.tftest.hcl
  check-api-listener-tls.sh        # edge HTTPS; pod stays HTTP (ADR 0077)
  check-api-listener-tls.test.sh
  api_listener_tls.tftest.hcl
  check-node-pool.sh               # private multi-AZ workers (ADR 0082)
  check-node-pool.test.sh
  node_pool.tftest.hcl
  check-cluster-autoscaler.sh      # scale those groups; do not reset desired_size (ADR 0083)
  check-cluster-autoscaler.test.sh
  cluster_autoscaler.tftest.hcl
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
| Postgres transit TLS | **on** for every provisioned RDS instance. Parameter group `rds.force_ssl=1`. `jdbc_url` is `sslmode=require`, or `verify-full` when `postgres_ssl_root_cert` is an absolute PEM path. The app flag is `POSTGRES_SSL_REQUIRED` ([ADR 0076](../../docs/adr/0076-postgres-transit-tls.md)) |
| API listener TLS | **on** for the public ALB (`enable_api_listener_tls`, default true). HTTPS 443 forwards to the existing target group. Port 80 is `HTTP_301`. Plan **refuses** until the keeper-owned ALB ARN, an existing ACM certificate ARN, and the target group ARN are set. When the WAF is on, the listener ALB must be the same ARN. This root does not call ACM. The JVM stays HTTP on 8081 ([ADR 0077](../../docs/adr/0077-api-listener-tls.md)) |
| Redis AUTH / TLS | **off** unless `redis_auth_token` is set (`TF_VAR_`, never in git). A token enables AUTH + transit encryption together. The app reads `REDIS_PASSWORD` / `REDIS_SSL` / `REDIS_AUTH_REQUIRED` ([ADR 0075](../../docs/adr/0075-redis-auth-and-transit-tls.md)) |
| API node pool | **on** (`enable_node_pool`, default true). One private EKS managed node group per AZ, at least two, `min_size` 1, on-demand, no public IP, no SSH. Plan **refuses** an empty cluster name or a single zone. This root does not create the cluster or the subnets. EKS sets `topology.kubernetes.io/zone` from the instance AZ ([ADR 0082](../../docs/adr/0082-multi-az-node-pool.md)) |
| Cluster Autoscaler | **on** when the node pool is on (`enable_cluster_autoscaler`, default true). IRSA for `kube-system/cluster-autoscaler` only. Each group's max is at least the HPA ceiling of 10. Terraform ignores `desired_size` after create. Plan **refuses** a missing OIDC provider ARN in `aws_region`. This root does not create the provider. Kind/minikube keep `enable_node_pool=false`, which skips the role. The manifest is not in the kustomization ([ADR 0083](../../docs/adr/0083-cluster-autoscaler.md)) |

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
7. Set `POSTGRES_SSL_REQUIRED=true` with `spring_datasource_url`. That URL is `sslmode=require` unless you set `postgres_ssl_root_cert` to a PEM you mounted (then `verify-full` and `POSTGRES_SSL_ROOT_CERT`). Do not invent a CA bundle. In-cluster Postgres leaves the flag unset ([ADR 0076](../../docs/adr/0076-postgres-transit-tls.md)).
8. Keep the ADR 0061 digest verify gate before `kubectl set image`.
9. For a public API door, set `api_listener_alb_arn` to the same ALB as `waf_associate_alb_arn`, plus an ACM certificate ARN you already have and that ALB's target group. This root does not call ACM. Port 80 redirects to 443. Set `API_LISTENER_TLS_REQUIRED=true` and `API_PUBLIC_BASE_URL=https://<host>`. Leave both unset for in-cluster HTTP. Do not set `server.ssl` ([ADR 0077](../../docs/adr/0077-api-listener-tls.md)). `enable_api_listener_tls=false` is the explicit switch for no public listener.
10. For multi-AZ API workers, set `eks_cluster_name` and `node_pool_subnets` to at least two **private** subnets in `aws_region` (one key per AZ). Plan refuses a single zone. Nodes do not get a public IP and SSH stays closed. This root does not create the cluster. `enable_node_pool=false` is the switch for kind or minikube. EKS sets `topology.kubernetes.io/zone` ([ADR 0082](../../docs/adr/0082-multi-az-node-pool.md)).
11. Cluster Autoscaler grows those groups when pods are Pending. Set `eks_oidc_provider_arn` to the cluster's existing OIDC provider in `aws_region`. This root does not create it. Each zone's max is at least the HPA ceiling of 10. Terraform ignores `desired_size` after create. Apply `deploy/k8s/cluster-autoscaler.yaml` only after substituting `CLUSTER_NAME`, `AWS_REGION`, and `cluster_autoscaler_role_arn`. It is not in the kustomization. `enable_node_pool=false` keeps the role off ([ADR 0083](../../docs/adr/0083-cluster-autoscaler.md)).

## Local verify (no cloud account)

```bash
./deploy/terraform/check-managed-stores.sh
./deploy/terraform/check-managed-stores.test.sh
./deploy/terraform/check-waf-gate.sh
./deploy/terraform/check-waf-gate.test.sh
./deploy/terraform/check-redis-auth.sh
./deploy/terraform/check-redis-auth.test.sh
./deploy/terraform/check-postgres-tls.sh
./deploy/terraform/check-postgres-tls.test.sh
./deploy/terraform/check-api-listener-tls.sh
./deploy/terraform/check-api-listener-tls.test.sh
./deploy/terraform/check-node-pool.sh
./deploy/terraform/check-node-pool.test.sh
./deploy/terraform/check-cluster-autoscaler.sh
./deploy/terraform/check-cluster-autoscaler.test.sh
terraform -chdir=deploy/terraform test    # mock provider; empty ALB ARN, empty ACM ARN, a short Redis token, a bad Postgres CA path, a single-zone node pool, and an empty OIDC ARN must fail the plan
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
