# 0083. Cluster Autoscaler for the multi-AZ API node groups

- **Status:** Accepted (replica count and placement are [0090](0090-cluster-autoscaler-ha.md); IRSA, discovery tags, and the kustomize exclusion stay)
- **Date:** 2026-09-23
- **Code:** `deploy/terraform/modules/cluster_autoscaler/main.tf`; `deploy/terraform/modules/node_pool/main.tf`; `deploy/k8s/cluster-autoscaler.yaml`; `deploy/terraform/check-cluster-autoscaler.sh`

## Context

[0082](0082-multi-az-node-pool.md) left this gap: nothing scales the node groups when `hpa.yaml` asks for more pods. Inventory on `main` tip `236038708`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/hpa.yaml` | Prod ceiling `maxReplicas: 10` on `computerpets-blue` | Does not add nodes. Not in the kustomization |
| `deploy/k8s/pdb.yaml` | `minAvailable: 2` on the live color | A cluster autoscaler that honors budgets was named, not installed |
| `deploy/terraform/modules/node_pool/main.tf` | One private EKS managed node group per AZ, `min_size` 1, `desired_size` 1, `max_size` 4 | Terraform owned `desired_size`. The next apply would write 1 back. No Auto Scaling discovery tags. No IAM role for a scaler |
| `deploy/k8s/` | Local apply stays blue 2 / green 0 | No Cluster Autoscaler manifest. No Karpenter manifest |
| `docs/ARCHITECTURE.md` | Two on-demand workers, one per zone | The ceiling of 10 can sit Pending. Zone spread stays `ScheduleAnyway` |

Karpenter is the other scaler people reach for. It provisions EC2 capacity itself. These workers are already EKS managed node groups, one Auto Scaling group per zone. A Karpenter NodePool would replace that pool. This slice does not.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the PDB `minAvailable`, the hostname/zone topology spread, or the node-pool shape beyond the desired-size owner, the ceiling, and the discovery tags. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Cluster Autoscaler scales the existing per-zone managed node groups. Each group's `max_size` is 10, which is at least `hpa.yaml`'s `maxReplicas`. Create-time `desired_size` stays 1. Terraform ignores `desired_size` after create. The IAM role is IRSA for `system:serviceaccount:kube-system:cluster-autoscaler` only. Kind and minikube do not install it.**

1. **Why this scaler.** Cluster Autoscaler changes desired capacity on the Auto Scaling groups the managed node groups already own. It does not create a second pool. Karpenter is not installed.
2. **Ceiling.** `max_size_per_zone` is 10. That is the HPA ceiling, per group, so one zone can still take the full replica count if the other zone cannot. `min_size` stays 1, so a zone is not scaled to zero. Two zones still mean at least two workers.
3. **Desired size.** `lifecycle.ignore_changes` includes `scaling_config[0].desired_size`. The first apply creates one worker per zone. Later applies do not write that 1 back over the scaler. `min_size` and `max_size` stay Terraform-owned. Lifecycle blocks cannot be conditional, so the ignore remains when `enable_cluster_autoscaler` is false.
4. **Discovery tags.** EKS does not copy node-group tags onto the managed Auto Scaling group. `aws_autoscaling_group_tag.cluster_autoscaler` sets `k8s.io/cluster-autoscaler/enabled=true` and `k8s.io/cluster-autoscaler/<eks_cluster_name>=owned` on that group. `propagate_at_launch` is false. This root still does not declare `aws_autoscaling_group`.
5. **IRSA, deny-safe.** `modules/cluster_autoscaler` plans one role. The trust is `sts:AssumeRoleWithWebIdentity` for the OIDC provider the keeper already has, audience `sts.amazonaws.com`, subject `system:serviceaccount:kube-system:cluster-autoscaler`. There is no `ec2.amazonaws.com` principal, so the worker role (IMDS hop limit 2) cannot assume it. Describe calls are `Resource "*"`, which is what those APIs allow. `autoscaling:SetDesiredCapacity` and `autoscaling:TerminateInstanceInAutoScalingGroup` are allowed only when both discovery tags match. A missing or wrong tag is an explicit Deny. `ec2:AssociateAddress`, `ec2:RunInstances`, `ec2:CreateKeyPair`, `ec2:AuthorizeSecurityGroupIngress`, `autoscaling:UpdateAutoScalingGroup`, `autoscaling:CreateAutoScalingGroup`, `autoscaling:DeleteAutoScalingGroup`, `iam:PassRole`, and `eks:DeleteNodegroup` are denied. This root does not create the OIDC provider.
6. **Plan gate.** `enable_cluster_autoscaler` defaults to true and is skipped when `enable_node_pool` is false. `terraform_data.cluster_autoscaler_gate` fails the plan when both flags are on and `eks_oidc_provider_arn` is empty, malformed, or not in `aws_region`. Empty passes `terraform validate`. `enable_node_pool=false` is still the kind/minikube switch, and it keeps this role off too.
7. **Manifest.** `deploy/k8s/cluster-autoscaler.yaml` is not in the kustomization. Image `registry.k8s.io/autoscaling/cluster-autoscaler:v1.36.1` (Kubernetes 1.36). Args: AWS cloud provider, auto-discovery on those two tags, `--balance-similar-node-groups=true`, `--skip-nodes-with-system-pods=false` so the EKS DaemonSets do not pin every node. It reads `poddisruptionbudgets`. The committed file uses the tokens `CLUSTER_NAME`, `AWS_REGION`, and account `000000000000`. Substitute the cluster name, the region, and `cluster_autoscaler_role_arn` before apply. Do not commit a real account id.
8. **What this does not change.** Hostname spread and zone spread stay `ScheduleAnyway`. The HPA and PDB stay out of the kustomization. Blue stays `replicas: 2`. Green stays `replicas: 0`. metrics-server is still not installed by this repo. No public IP. No SSH. No live AWS apply.

## Consequences

- A keeper who sets the cluster name, at least two private subnets, and the cluster's OIDC provider ARN can plan the role and the discovery tags. After apply, substitute the three tokens and apply the manifest. Pending pods can raise desired capacity up to 10 per zone. Scale-down does not go below one node per zone, and it still honors the live color's disruption budget.
- `enable_node_pool=false` plans neither workers nor the role. A laptop `kubectl apply -k deploy/k8s` does not start the autoscaler.
- Turning `enable_cluster_autoscaler` off skips the role and the manifest is not applied. It does not hand `desired_size` back to Terraform. The ignore stays.
- The groups are tagged even when the role is off, so a later role can discover them. The node instance role still has only the three worker policies.
- The image tag matches Kubernetes 1.36. A keeper whose cluster minor is older replaces the tag with that minor's latest patch before apply. `:latest` is not used.
- A zone failure still leaves the other zone's minimum of one. Replacing a lost node at the current desired size is the managed node group's job. The budget does not apply to that crash.
- Green stays at 0 until a human scales it. This scaler does not wake the idle color.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. The resource-metrics addon is [0084](0084-metrics-server.md).
