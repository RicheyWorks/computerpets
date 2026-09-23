# 0082. Multi-AZ API worker node pool

- **Status:** Accepted (the API Deployments select this label in [0093](0093-api-node-pool.md); the node groups stay)
- **Date:** 2026-09-23
- **Code:** `deploy/terraform/modules/node_pool/main.tf`; `deploy/terraform/check-node-pool.sh`

## Context

[0081](0081-api-pod-zone-spread.md) left this gap: soft zone spread does not create a second zone. Inventory on `main` tip `8f8a66fb4`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/deployment-blue.yaml` and `deployment-green.yaml` | Soft `topologySpreadConstraints` on `topology.kubernetes.io/zone` (`maxSkew: 1`, `ScheduleAnyway`) beside the hostname item | No nodes. `ScheduleAnyway` still binds when every node shares one zone label, or has none |
| `deploy/k8s/hpa.yaml` / `pdb.yaml` | Prod floor of 3 and `minAvailable: 2` | Do not place nodes. A zone failure is involuntary, so the budget does not apply |
| `deploy/terraform/` | Managed Postgres, Redis, secrets, CDN, WAF, API listener | No `aws_eks_cluster`, no `aws_eks_node_group`, no `aws_autoscaling_group`. Zone labels are whatever the keeper's nodes already carry |
| `docs/ARCHITECTURE.md` | Prod should run workers in at least two availability zones | Said this repo does not provision that pool |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the PDB `minAvailable`, or the hostname/zone topology spread beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**One private EKS managed node group per availability zone, at least two zones, on a keeper-owned cluster. This root does not create the cluster, the VPC, or the subnets. Nodes do not get a public IP. SSH stays closed. The zone label is `topology.kubernetes.io/zone`, set by EKS from the instance AZ. This module does not stamp that label. Local replica counts stay blue 2 / green 0.**

1. **Target.** `modules/node_pool` plans `aws_eks_node_group.zone` with `for_each` over `node_pool_subnets` (AZ name → one private subnet id). `subnet_ids` is that single subnet, so the group cannot place a worker in a second zone. `min_size` and the create-time `desired_size` are 1. The per-zone ceiling and who owns `desired_size` after create are [0083](0083-cluster-autoscaler.md). Two zones therefore mean at least two on-demand workers, one in each AZ. The managed node group owns its Auto Scaling group. This root does not declare `aws_autoscaling_group`.
2. **Cluster stays the keeper's.** `eks_cluster_name` is the existing cluster. Empty is validate-only. Plan refuses it while `enable_node_pool` is true. There is no `aws_eks_cluster`, no VPC, and no subnet resource. `enable_node_pool=false` is the switch for kind, minikube, or any cluster this root does not feed.
3. **Zone label.** EKS sets `topology.kubernetes.io/zone` from the instance placement AZ. That is the key [0081](0081-api-pod-zone-spread.md) already selects. A static label on the node group would be one value for every node, and it would be wrong when the subnet is not in the map key. The only label this module sets is `computerpets/node-pool=api`. The API Deployments select it ([0093](0093-api-node-pool.md)). The NoSchedule taint on that key is [0094](0094-api-pool-taint.md). A local apply whose nodes omit the label leaves those pods Pending.
4. **Deny-safe.** The launch template sets `associate_public_ip_address = false` and does not set `key_name`. The node group has no `remote_access` block, so port 22 is not opened. There is no `0.0.0.0/0` rule and no security group of our own (the cluster security group stays the keeper's). Root volume is encrypted gp3, 20 GiB. IMDSv2 is required, hop limit 2, so pods can still reach instance metadata. Capacity is `ON_DEMAND`. Instance types default to `t3.medium`. GPU, Inferentia, Trainium, and VT families are refused. AMI type is `AL2023_x86_64_STANDARD` (the keeper's cluster must accept that AMI).
5. **Plan gate.** `terraform_data.node_pool_gate` fails the plan when the flag is on and the cluster name is empty, the map has fewer than two entries, a subnet id is reused, an AZ is not in `aws_region`, or a subnet id is not `subnet-` plus 8 or 17 hex characters. `terraform validate` still succeeds with the empty defaults. No live AWS apply.
6. **What this does not change.** Hostname spread and zone spread stay `ScheduleAnyway`. The HPA and PDB stay out of the kustomization. Blue stays `replicas: 2`. Green stays `replicas: 0`. Applying the Deployments does not create these node groups.

## Consequences

- A keeper who sets `eks_cluster_name` and at least two private subnets in `aws_region` can plan one worker in each of those zones. EKS then labels each node with that instance's zone. Soft zone spread has two domains to prefer.
- `enable_node_pool` defaults to true. A prod plan with an empty map fails closed. Set the flag false only when this root should not create workers.
- Subnets must already be private. The launch template also refuses a public IP. This root cannot see `MapPublicIpOnLaunch` without a live AWS read, so a public subnet id that merely looks like `subnet-…` still plans. Apply it only on private subnets.
- The cluster security group is not modified. If that group already allows SSH, this module does not close it. It also does not open SSH.
- Create-time desired size is 1 per zone. Who changes it afterwards, and the per-zone ceiling, are [0083](0083-cluster-autoscaler.md).
- A zone failure takes that zone's worker. The other zone's worker remains. Replacing the lost node is the managed node group's job at the desired size. It is not a voluntary eviction, and the disruption budget does not apply.
- Green stays at 0 until a human scales it. These node groups do not wake the idle color.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. Cluster Autoscaler owns desired size after create ([0083](0083-cluster-autoscaler.md)).
