# 0112. The kubelet leaf chains to metrics-server-kubelet-ca

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/metrics-server-kubelet-ca.sh`; `deploy/k8s/check-metrics-server-kubelet-ca.sh`

## Context

[0111](0111-metrics-server-serving-cert-chain.md) left this gap: a kubelet certificate that does not chain to `metrics-server-kubelet-ca` still leaves `kubectl top` empty. Inventory on `main` tip `e7949c40c`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/metrics-server.yaml` | `--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca.crt` on a read-only mount of ConfigMap `metrics-server-kubelet-ca` (key `ca.crt`, `optional: false`). `--kubelet-insecure-tls` is unset ([0086](0086-metrics-server-kubelet-ca.md)) | It does not create the ConfigMap. It does not check that a kubelet leaf chains to the bytes in that object |
| Keeper instructions | `kubectl create configmap metrics-server-kubelet-ca --from-file=ca.crt=...` before apply | That create was not gated. A missing file, or a CA that did not sign the kubelet leaf, still applied |
| metrics-server v0.9.0 | The flag sets `TLSClientConfig.CAFile` and clears `CAData`. The process refuses the flag together with `--kubelet-insecure-tls` | Trust is whatever file is mounted. A swapped CA fails the scrape and `kubectl top` stays empty |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the API hostname/zone topology spread, the metrics-server zone `DoNotSchedule` item, the node-pool pin or taint, Cluster Autoscaler replica count, required hostname anti-affinity, leader election, the disruption budget, the salvo, the per-zone max, aws-node, vpc-cni, the kube-proxy reassert hook, or the serving-cert / APIService `caBundle` / SAN path beyond this cross-link. Do not set `--kubelet-insecure-tls`. Do not set `insecureSkipTLSVerify`. Do not set `minDomains`. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**`apply` writes ConfigMap `metrics-server-kubelet-ca` from `ca.crt` only after every supplied kubelet leaf chains to that CA. A missing CA, a leaf that does not chain, a manifest that does not mount that ConfigMap, or `--kubelet-insecure-tls` refuses apply before `kubectl`. Kind and minikube are refused. The certificates stay out of git. The serving Secret and `caBundle` are not this apply. No live AWS apply.**

1. **The mount stays.** The container arg stays `--kubelet-certificate-authority=/etc/metrics-server/kubelet-ca/ca.crt`. Volume `kubelet-ca` stays a required ConfigMap named `metrics-server-kubelet-ca`, key `ca.crt`, `optional: false`, read-only. metrics-server v0.9.0 trusts that file for kubelet scrapes. This slice does not point the flag at `kube-root-ca.crt` or the service-account bundle.
2. **The chain.** `ca.crt` is one CA (`CA:TRUE`). `kubelet.crt` is one end entity whose issuer is that CA. `openssl verify -CAfile ca.crt kubelet.crt` must succeed. Every extra `kubelet-*.crt` in the same directory must chain the same way. One leaf that does not chain refuses the directory. A CA that is not the issuer is a swapped CA. The kubelet private key is not required and is not written into the ConfigMap.
3. **One apply writes the ConfigMap.** `apply` calls `verify` before any `kubectl`. It then creates ConfigMap `metrics-server-kubelet-ca` in `kube-system` from that same `ca.crt`. It does not apply `metrics-server.yaml`, does not write Secret `metrics-server-serving`, and does not patch APIService `caBundle`. The manifest still does not contain a PEM.
4. **The gate.** `COMPUTERPETS_METRICS_KUBELET_CA_APPLY` must be `1`. Without it, `apply` exits and does not call `kubectl`. A current context of kind or minikube, or an empty context, exits before the ConfigMap. `verify` never calls `kubectl`. `verify` and `apply` refuse a directory inside this repo. A manifest whose body sets `--kubelet-insecure-tls`, drops the CA flag, or mounts both a ConfigMap and a Secret of that name refuses before `kubectl`.
5. **What stays.** `--kubelet-insecure-tls` stays unset. `insecureSkipTLSVerify` stays unset. The serving-cert path stays [0111](0111-metrics-server-serving-cert-chain.md). The file stays out of the kustomization. Kind and minikube do not apply it. A Secret of the same name remains the hand substitution in [0086](0086-metrics-server-kubelet-ca.md); this apply writes the ConfigMap the committed manifest mounts, and refuses a manifest that does not.
6. **Verify without a cluster.** `check-metrics-server-kubelet-ca.sh` builds a leaf outside the repo, accepts it, accepts a second leaf from the same CA, and refuses a missing CA, a missing leaf, a swapped CA, and one bad leaf beside a good one. It refuses `apply` with no opt-in, on kind, and on minikube, and it refuses a bad chain before a stub `kubectl` is invoked. A stubbed opt-in apply must show ConfigMap `metrics-server-kubelet-ca` created from that `ca.crt`, and must not show `metrics-server.yaml` or `caBundle`. `check-metrics-server-kubelet-ca.test.sh` proves a skipped chain check, a skipped `verify`, a dropped kind/minikube refusal, a dropped opt-in, `--kubelet-insecure-tls`, a dropped CA flag, and a kustomize listing. No `kubectl apply` against a cluster and no `terraform apply`.

## Consequences

- A keeper who places the kubelet serving CA and at least one kubelet leaf in a directory outside the repo, then runs `apply` with the opt-in, gives both metrics-server pods a trust anchor those leaves chain to. `kubectl top` can use that scrape when the address also matches the leaf. The pods can still be Running when the object is wrong; this gate stops the wrong CA before `kubectl`.
- A missing `ca.crt`, a missing `kubelet.crt`, or a leaf that does not chain does not get a ConfigMap.
- Kind and minikube do not receive this ConfigMap. The manifest stays out of `kubectl apply -k deploy/k8s`.
- The kubelet private key is not an input. The CA private key is not an input. Neither is written into the ConfigMap or into git.
- Adding `--kubelet-insecure-tls`, dropping the CA flag, mounting two sources, or skipping `verify` before `kubectl` fails `check-metrics-server-kubelet-ca.sh`.
- A keeper who supplies a leaf from one node and omits a node whose kubelet was signed by a different CA can still pass. The gate checks the files it was given. It does not dial the cluster.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** moved. A leaf whose SAN does not cover the dial address (`InternalIP`, then `ExternalIP`, then `Hostname`) is refused before that ConfigMap write ([0113](0113-metrics-server-kubelet-san.md)). The port gate is [0114](0114-metrics-server-kubelet-port.md). This chain apply still does not read the node file set. Do not set `--kubelet-insecure-tls`. This is outside the serving-cert `caBundle` path. Do not set `minDomains`. Required hostname anti-affinity is not the follow-up. Required zone anti-affinity is not the follow-up. The kube-proxy managed addon schema still rejects `tolerations`, so coverage between applies depends on the [0097](0097-kube-proxy-toleration-hook.md) hook and on the flag being true. One labeled zone still schedules both metrics-server pods when two hostnames exist. If the lighter zone cannot fit the second metrics-server pod, it stays Pending. One hostname still schedules every API pod of the live color.
