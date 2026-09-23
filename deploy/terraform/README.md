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
  modules/postgres|redis|secrets|cdn|waf|api_listener|node_pool|cluster_autoscaler|system_daemons/
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
  check-system-daemons.sh          # vpc-cni toleration + kube-proxy patch (ADR 0096)
  check-system-daemons.test.sh
  check-kube-proxy-toleration.sh   # reassert kube-proxy coverage or fail closed (ADR 0097)
  check-kube-proxy-toleration.test.sh
  system_daemons.tftest.hcl
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
| API node pool | **on** (`enable_node_pool`, default true). One private EKS managed node group per AZ, at least two, `min_size` 3 and create-time `desired_size` 3 so one Ready zone is three hostnames for the HPA floor ([ADR 0106](../../docs/adr/0106-api-single-zone-hostname-floor.md)), on-demand, no public IP, no SSH. Plan **refuses** an empty cluster name or a single zone. This root does not create the cluster or the subnets. EKS sets `topology.kubernetes.io/zone` from the instance AZ. The only custom label is `computerpets/node-pool=api`. metrics-server selects it ([ADR 0089](../../docs/adr/0089-metrics-server-node-pool.md)). Cluster Autoscaler selects it ([ADR 0091](../../docs/adr/0091-cluster-autoscaler-node-pool.md)). The API Deployments select it ([ADR 0093](../../docs/adr/0093-api-node-pool.md)). Kind and minikube leave those pods Pending until a node carries the label |
| Cluster Autoscaler | **on** when the node pool is on (`enable_cluster_autoscaler`, default true). IRSA for `kube-system/cluster-autoscaler` only. Each group's max is 20 (ADR 0104). The HPA ceiling is 6 (ADR 0107). Terraform ignores `desired_size` after create. Plan **refuses** a missing OIDC provider ARN in `aws_region`. This root does not create the provider. Kind/minikube keep `enable_node_pool=false`, which skips the role. The manifest is two replicas with leader election. The standby is not the scaler. The scheduled leader keeps `--balance-similar-node-groups=true` and `--expander=least-waste` ([ADR 0101](../../docs/adr/0101-cluster-autoscaler-leader-scale.md)). `--salvo-scale-up=true` and `--salvo-scale-up-budget=1m` run another choice in that same loop ([ADR 0102](../../docs/adr/0102-cluster-autoscaler-scale-up-salvo.md)). The `1m` budget stays. A budget that is already gone, a failed snapshot update, or a scale-up that is not successful still ends that salvo, and the next main loop is the retry ([ADR 0103](../../docs/adr/0103-cluster-autoscaler-salvo-early-stop.md)). `nodeSelector` requires `computerpets/node-pool=api` and linux. Voluntary disruption keeps one pod (`minAvailable: 1`). Kind and minikube do not apply the file, so they do not install that budget. It is not in the kustomization ([ADR 0083](../../docs/adr/0083-cluster-autoscaler.md), [ADR 0090](../../docs/adr/0090-cluster-autoscaler-ha.md), [ADR 0091](../../docs/adr/0091-cluster-autoscaler-node-pool.md), [ADR 0092](../../docs/adr/0092-cluster-autoscaler-pdb.md)) |
| aws-node / kube-proxy toleration | **on** when the node pool is on. `aws_eks_addon.vpc_cni` `configuration_values` is the chart default `operator: Exists` plus `computerpets/node-pool=api:NoSchedule` (`Equal`) ([ADR 0096](../../docs/adr/0096-system-daemon-api-pool-toleration.md)). The kube-proxy addon schema rejects `tolerations`. Coverage is a keyless `operator: Exists` (effect empty or `NoSchedule`) or that exact `Equal` entry. `reassert_kube_proxy_toleration=true` probes on plan and reasserts on apply, and fails closed if the patch does not stick. The flag defaults false. Kind and minikube do not call kubectl ([ADR 0097](../../docs/adr/0097-kube-proxy-toleration-hook.md)) |

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
10. For multi-AZ API workers, set `eks_cluster_name` and `node_pool_subnets` to at least two **private** subnets in `aws_region` (one key per AZ). Plan refuses a single zone. Nodes do not get a public IP and SSH stays closed. This root does not create the cluster. `enable_node_pool=false` is the switch for kind or minikube. EKS sets `topology.kubernetes.io/zone` ([ADR 0082](../../docs/adr/0082-multi-az-node-pool.md)). Each group taints `computerpets/node-pool=api:NoSchedule`. Blue, green, metrics-server, and Cluster Autoscaler tolerate it. Kind and minikube are not this resource. Do not taint a kind or minikube node ([ADR 0094](../../docs/adr/0094-api-pool-taint.md)).
11. Before that apply, record the same toleration on `aws-node` and `kube-proxy` ([ADR 0096](../../docs/adr/0096-system-daemon-api-pool-toleration.md)). `aws-node` is the `vpc-cni` addon. Its `configuration_values` document is tolerations only: chart default `operator: Exists`, then key `computerpets/node-pool`, operator `Equal`, value `api`, effect `NoSchedule`. Run `aws eks describe-addon --cluster-name <eks_cluster_name> --addon-name vpc-cni` first. If `configurationValues` is already set and is not that document, stop. This apply uses `OVERWRITE` and would replace it. An existing managed addon is imported, not created twice:

```bash
terraform import 'module.system_daemons[0].aws_eks_addon.vpc_cni' '<eks_cluster_name>:vpc-cni'
```

`kube-proxy` configuration_values cannot carry tolerations. The schema rejects that field. Do not send it. Set `reassert_kube_proxy_toleration=true` on the EKS root so plan probes DaemonSet `kube-proxy` and apply runs:

```bash
deploy/terraform/modules/system_daemons/reassert-kube-proxy-toleration.sh --live
```

That command strategic-merges `kube-proxy-api-pool-toleration.yaml` only when the DaemonSet has neither a keyless `operator: Exists` (effect empty or `NoSchedule`) nor the exact `Equal` entry. If the second read is still uncovered, apply fails closed. The flag defaults false, so CI and `terraform test` do not call kubectl. Do not run that patch on kind or minikube. A kind or minikube context fails the plan before any patch. Do not taint a kind or minikube node. The patch is not in the kustomization. The node group waits on this module in the same apply. This repo does not apply either change in CI.
12. Cluster Autoscaler grows those groups when pods are Pending. Set `eks_oidc_provider_arn` to the cluster's existing OIDC provider in `aws_region`. This root does not create it. Each zone's max is 20 (ADR 0104). The HPA ceiling is 6 (ADR 0107). Terraform ignores `desired_size` after create. Apply `deploy/k8s/cluster-autoscaler.yaml` only after substituting `CLUSTER_NAME`, `AWS_REGION`, and `cluster_autoscaler_role_arn`. It is two replicas with required hostname anti-affinity, hard zone spread (`DoNotSchedule` on `topology.kubernetes.io/zone`, `maxSkew` 1; one labeled zone still schedules; do not set minDomains), and leader election. `nodeSelector` requires `kubernetes.io/os: linux` and `computerpets/node-pool: api`. The same file keeps one pod during voluntary disruption (`minAvailable: 1`). Kind and minikube do not apply the file (`enable_node_pool=false` does not label their nodes, does not set a zone, and does not install that budget). It is not in the kustomization. `enable_node_pool=false` keeps the role off ([ADR 0083](../../docs/adr/0083-cluster-autoscaler.md), [ADR 0090](../../docs/adr/0090-cluster-autoscaler-ha.md), [ADR 0091](../../docs/adr/0091-cluster-autoscaler-node-pool.md), [ADR 0092](../../docs/adr/0092-cluster-autoscaler-pdb.md), [ADR 0099](../../docs/adr/0099-cluster-autoscaler-zone-hard-spread.md)). Resource metrics are `deploy/k8s/metrics-server.yaml` (two replicas, required hostname anti-affinity, soft zone spread, kubelet CA mount, keeper serving cert), also not in the kustomization ([ADR 0084](../../docs/adr/0084-metrics-server.md), [ADR 0085](../../docs/adr/0085-metrics-server-ha.md), [ADR 0086](../../docs/adr/0086-metrics-server-kubelet-ca.md), [ADR 0087](../../docs/adr/0087-metrics-server-serving-cert.md), [ADR 0088](../../docs/adr/0088-metrics-server-zone-spread.md)).

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
./deploy/terraform/check-system-daemons.sh
./deploy/terraform/check-system-daemons.test.sh
./deploy/terraform/check-kube-proxy-toleration.sh
./deploy/terraform/check-kube-proxy-toleration.test.sh
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
