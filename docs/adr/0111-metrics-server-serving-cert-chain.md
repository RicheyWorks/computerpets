# 0111. The metrics-server serving cert chains to caBundle

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `deploy/k8s/metrics-server-serving-cert.sh`; `deploy/k8s/check-metrics-server-serving-cert.sh`

## Context

[0110](0110-cluster-autoscaler-pending-lease.md) left this gap, outside the Cluster Autoscaler loop: a serving certificate that does not chain to `caBundle` (and is not a system root), or whose SAN is not `metrics-server.kube-system.svc`, still leaves `kubectl top` empty. Inventory on `main` tip `4be4ca05a`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/metrics-server.yaml` | `--tls-cert-file` and `--tls-private-key-file` mount Secret `metrics-server-serving` (`tls.crt`, `tls.key`, `optional: false`). `insecureSkipTLSVerify` is unset. The file does not contain a PEM or `caBundle` ([0087](0087-metrics-server-serving-cert.md)) | It does not mint the certificate. It does not check the SAN. It does not write `caBundle` |
| Keeper instructions | Create the Secret, apply the file, then patch `caBundle` from `ca.crt` | That patch was not gated. A leaf signed by a different CA, or a DNS SAN of `metrics-server.kube-system.svc.cluster.local` alone, still applied |
| kube-aggregator | `ServerName` is `metrics-server.kube-system.svc`. Empty `CAData` uses the system trust store. A private CA with an empty `caBundle` does not verify | The APIService cannot reference a Secret. The trust anchor is the `caBundle` bytes |
| metrics-server v0.9.0 | Both TLS file flags disable the `/tmp` cert. The apiserver dynamic file provider reloads those paths when the Secret mount changes | Reloading the leaf does not update `caBundle`. A rotation that changes the CA and leaves the old bundle still fails verification |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, Postgres JDBC SSL, API listener TLS, the HPA metrics and replica range, the API PDB `minAvailable`, the API hostname/zone topology spread, the metrics-server zone `DoNotSchedule` item, the node-pool pin or taint, Cluster Autoscaler replica count, required hostname anti-affinity, leader election, the disruption budget, the salvo, the per-zone max, aws-node, vpc-cni, or the kube-proxy reassert hook beyond this cross-link. Do not set `--kubelet-insecure-tls`. Do not set `insecureSkipTLSVerify`. Do not set `minDomains`. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**The serving leaf is minted with DNS SAN `metrics-server.kube-system.svc` and chains to a private CA that is not a system root. `apply` writes Secret `metrics-server-serving` and patches APIService `v1beta1.metrics.k8s.io` `caBundle` from that same `ca.crt`, and only after `verify` succeeds. A leaf that does not chain, a key that does not match, or a SAN that is not that name refuses apply before `kubectl`. Kind and minikube are refused. The certificates stay out of git. No live AWS apply.**

1. **The name.** kube-aggregator dials `metrics-server.kube-system.svc`. The leaf's DNS SAN list must include that exact name. `metrics-server.kube-system.svc.cluster.local` is not a substitute. A wildcard is not a substitute. `render` puts that name in the CSR and in the signed extension, so the signed certificate carries it.
2. **The chain.** `ca.crt` is a CA (`CA:TRUE`). `tls.crt` is an end entity (`CA:FALSE`) whose issuer is that CA. `openssl verify -CAfile ca.crt tls.crt` must succeed. The same leaf must not verify against the system trust store: a system root would make an empty `caBundle` succeed, and this apply does not leave `caBundle` empty. `tls.key` must be the key for `tls.crt`.
3. **One apply writes both.** `apply` calls `verify` before any `kubectl`. It then applies Secret `metrics-server-serving` (`tls.crt`, `tls.key`, `ca.crt`) and `metrics-server.yaml`, then patches `caBundle` to the base64 of that same `ca.crt`. The manifest still does not contain `caBundle` or a PEM. Re-running `render` mints a new leaf. If `ca.key` is still in the directory the CA stays, and the patch writes the same bundle. If `ca.key` is gone, `render` mints a new CA and the same `apply` replaces the bundle, so the apiserver does not keep trusting the previous CA.
4. **The gate.** `COMPUTERPETS_METRICS_SERVING_APPLY` must be `1`. Without it, `apply` exits and does not call `kubectl`. A current context of kind or minikube, or an empty context, exits before the Secret and before the patch. `verify` and `render` never call `kubectl`. `render` refuses a directory inside this repo.
5. **What stays.** `insecureSkipTLSVerify` stays unset. `--kubelet-insecure-tls` stays unset. `--tls-cert-file` and `--tls-private-key-file` stay. The Secret volume stays `optional: false`. The file stays out of the kustomization. Kind and minikube do not apply it. The kubelet CA mount is not this material.
6. **Verify without a cluster.** `check-metrics-server-serving-cert.sh` renders a cert outside the repo, accepts it, keeps the CA when `ca.key` remains, mints a new CA when `ca.key` is gone, and refuses a cluster.local-only SAN, a swapped CA, and a mismatched key. It refuses `apply` with no opt-in, on kind, and on minikube, and it refuses a bad chain or a bad SAN before a stub `kubectl` is invoked. A stubbed opt-in apply must show the Secret, the manifest, and the `ca.crt` bytes in `caBundle`. `check-metrics-server-serving-cert.test.sh` proves a wrong SAN constant, a skipped `verify`, a dropped kind/minikube refusal, a dropped opt-in, a disabled SAN check, `insecureSkipTLSVerify`, `--kubelet-insecure-tls`, a vendored `caBundle`, and a kustomize listing. No `kubectl apply` against a cluster and no `terraform apply`.

## Consequences

- A keeper who runs `render` and then `apply` with the opt-in gives the apiserver a serving certificate that chains to `caBundle` and whose DNS SAN is `metrics-server.kube-system.svc`. `kubectl top` can use that hop. The pods can still be Running when the hop is wrong; this gate stops the wrong material before `kubectl`.
- A certificate that does not chain to the paired `ca.crt`, or whose SAN is not that name, does not get a Secret and does not get a `caBundle` patch.
- Kind and minikube do not receive this Secret or this patch. The manifest stays out of `kubectl apply -k deploy/k8s`.
- The CA private key stays in the render directory on the keeper machine. It is not a key in the Secret and it is not a file in git.
- Adding `insecureSkipTLSVerify`, adding `--kubelet-insecure-tls`, vendoring `caBundle`, or skipping `verify` before `kubectl` fails `check-metrics-server-serving-cert.sh`.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** a kubelet certificate that does not chain to `metrics-server-kubelet-ca` still leaves `kubectl top` empty ([0086](0086-metrics-server-kubelet-ca.md)). This slice does not mount that CA and does not set `--kubelet-insecure-tls`. Do not set `minDomains`. Required hostname anti-affinity is not the follow-up. Required zone anti-affinity is not the follow-up. The kube-proxy managed addon schema still rejects `tolerations`, so coverage between applies depends on the [0097](0097-kube-proxy-toleration-hook.md) hook and on the flag being true. One labeled zone still schedules both metrics-server pods when two hostnames exist. If the lighter zone cannot fit the second metrics-server pod, it stays Pending. One hostname still schedules every API pod of the live color.
