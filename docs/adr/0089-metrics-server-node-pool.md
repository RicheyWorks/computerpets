# 0089. Pin metrics-server to the multi-AZ API node pool

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/metrics-server.yaml`; `deploy/k8s/check-metrics-server.sh`; `deploy/terraform/modules/node_pool/main.tf` (label comment only)

## Context

[0088](0088-metrics-server-zone-spread.md) left this gap: `nodeSelector` is only `kubernetes.io/os: linux`, so both metrics-server pods can schedule onto linux nodes outside the multi-AZ API groups, and the soft zone rule counts those nodes. Inventory on `main` tip `6834ecb13`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/metrics-server.yaml` | `replicas: 2`. Required pod anti-affinity on `kubernetes.io/hostname`. Soft zone spread (`maxSkew: 1`, `ScheduleAnyway`, `nodeTaintsPolicy: Honor`). Kubelet CA mount. Serving Secret. Out of the kustomization | `nodeSelector` was only `kubernetes.io/os: linux`. No `nodeAffinityPolicy`. No `computerpets/node-pool` key |
| `deploy/terraform/modules/node_pool/main.tf` | One private managed node group per availability zone, at least two. The only custom label is `computerpets/node-pool=api`. EKS sets `topology.kubernetes.io/zone` from the instance AZ | Did not place the addon. API Deployments do not select the label ([0082](0082-multi-az-node-pool.md)) |
| `deploy/k8s/deployment-blue.yaml` and `deployment-green.yaml` | Soft hostname and zone spread | No `nodeSelector`. They are not pinned to the pool |
| `deploy/k8s/cluster-autoscaler.yaml` | One replica. Scales the labeled groups when pods are Pending | Not this addon's scheduler |

A preferred node affinity would still admit every other linux node. Those nodes would still receive a pod, and a zone constraint that ignores node affinity would still count them. Required zone anti-affinity is still the wrong follow-up: it leaves the second pod Pending when every labeled node shares one zone. Kind and minikube do not apply this file. `enable_node_pool=false` does not label their nodes.

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the API hostname/zone topology spread, the node-pool shape beyond this label cross-link, Cluster Autoscaler, the kubelet CA mount, the serving certificate, or metrics-server TLS beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`deploy/k8s/metrics-server.yaml` keeps required hostname anti-affinity and soft zone spread, and its `nodeSelector` requires both `kubernetes.io/os: linux` and `computerpets/node-pool: api`. The zone constraint sets `nodeAffinityPolicy: Honor`, so the zone count includes only nodes that match that selector. The pool label already exists on the multi-AZ groups. Kind and minikube stay on the feature-off path: they do not apply this file. A single-zone set of nodes that do carry the label still schedules both pods when two hostnames exist, because the zone action stays `ScheduleAnyway`.**

1. **Target.** The metrics-server pod template. `nodeSelector` keeps `kubernetes.io/os: linux` and adds `computerpets/node-pool: api`. That value is the label `aws_eks_node_group.zone` already sets. This slice does not add a second label, a taint, a toleration, or a scaling change on the node pool.
2. **Required, not preferred.** The selector is a hard filter. `preferredDuringSchedulingIgnoredDuringExecution` is not added. A preference would still place pods on linux nodes that lack the pool label. Required node affinity is not used in place of `nodeSelector`: the selector is the filter, and an extra required term can only narrow it.
3. **Zone count.** The one `topologySpreadConstraints` item keeps `topology.kubernetes.io/zone`, `maxSkew: 1`, `whenUnsatisfiable: ScheduleAnyway`, and `nodeTaintsPolicy: Honor`. It adds `nodeAffinityPolicy: Honor`. Honor drops nodes that fail `nodeSelector` out of the skew. `Ignore` would count linux nodes outside the API groups again. `DoNotSchedule` and `minDomains` stay unset. There is no required zone anti-affinity.
4. **Hostname anti-affinity stays required.** `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution` stays on `kubernetes.io/hostname` for `k8s-app: metrics-server` in `kube-system`. Two labeled hostnames in one zone still satisfy it. The zone item is what prefers they not share that zone.
5. **Kind and single-zone.** Kind and minikube do not apply this file, and `enable_node_pool=false` does not label their nodes. Applying `metrics-server.yaml` on a cluster whose nodes lack `computerpets/node-pool=api` leaves both pods Pending. That is the feature-off path. Do not delete the pool key to make a laptop apply schedule. A cluster that does carry the label on only one zone still runs both pods when two hostnames exist: the hostname rule is met, and `ScheduleAnyway` binds the zone skew it cannot meet. The node-pool plan still refuses fewer than two zones, so groups this module creates already span two zones. A one-node cluster still leaves the second pod Pending on the hostname rule from [0085](0085-metrics-server-ha.md).
6. **API Deployments stay unpinned.** Blue and green do not gain `nodeSelector` and do not select `computerpets/node-pool`. Their zone spread stays `ScheduleAnyway`.
7. **High availability, kubelet CA, and serving cert stay.** `replicas: 2`, rolling update `maxUnavailable: 1`, and the addon `PodDisruptionBudget` `minAvailable: 1` stay. `--kubelet-certificate-authority` stays on the required kubelet CA mount. `--tls-cert-file` and `--tls-private-key-file` stay on Secret `metrics-server-serving`. `insecureSkipTLSVerify` stays unset. `--kubelet-insecure-tls` stays unset. The image stays `registry.k8s.io/metrics-server/metrics-server:v0.9.0`.
8. **Still not in the kustomization.** `kubectl apply -k deploy/k8s` does not install this file. Blue stays `replicas: 2`. Green stays `replicas: 0`.
9. **Verify without a cluster.** `check-metrics-server.sh` fails when the pool key is missing from `nodeSelector`, when `nodeAffinityPolicy` is missing or `Ignore`, when `DoNotSchedule` or `minDomains` returns, when hostname anti-affinity is no longer required, when the node-pool module stops setting `computerpets/node-pool=api`, when either API Deployment gains a `nodeSelector`, or when `kustomization.yaml` lists the file. `check-metrics-server.test.sh` proves a dropped pool key and `nodeAffinityPolicy: Ignore`. No `kubectl apply`.

## Consequences

- On a cluster whose API workers carry `computerpets/node-pool=api` in at least two zones, both metrics-server pods schedule only onto those workers, and the soft zone rule counts only those workers. A linux node outside the groups does not receive a pod and does not count as an empty zone.
- `ScheduleAnyway` is still a preference inside that set. One labeled zone, labeled nodes that omit `topology.kubernetes.io/zone`, a failed score, or a zone that cannot fit the second pod can still co-locate both pods. Required zone anti-affinity is still not the follow-up.
- Kind and minikube stay off this file. Applying it there leaves both pods Pending until the nodes carry the pool label. A single-zone set of labeled nodes with two hostnames still runs both pods.
- The API colors can still land on nodes outside the pool. This slice does not pin them.
- `nodeAffinityPolicy` is the same Kubernetes field family as `nodeTaintsPolicy`. A cluster that rejects the field cannot apply this Deployment.
- Dropping the pool key, setting `nodeAffinityPolicy: Ignore`, adding `DoNotSchedule` on the zone key, dropping required hostname anti-affinity, adding `insecureSkipTLSVerify`, adding `--kubelet-insecure-tls`, floating the image tag, or listing the file in `kustomization.yaml` fails `check-metrics-server.sh`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Cluster Autoscaler is still one replica (`deploy/k8s/cluster-autoscaler.yaml` has `replicas: 1` and no anti-affinity). It only adds a node for pods that are already Pending, and a dead replica stops that until the pod is back. `ScheduleAnyway` can still place both metrics-server pods in one zone when the labeled pool is one zone or a labeled node omits `topology.kubernetes.io/zone`. API zone spread stays `ScheduleAnyway`, and the API Deployments are still not pinned to this label. A serving certificate that does not chain to `caBundle` (and is not a system root), or whose SAN is not `metrics-server.kube-system.svc`, still leaves `kubectl top` empty. A kubelet certificate that does not chain to `metrics-server-kubelet-ca` still leaves `kubectl top` empty.
