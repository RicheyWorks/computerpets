# 0077. API listener TLS

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `ApiListenerTls`; `ProductionProfileGuard.rejectUnsafeApiListenerTls`; `deploy/k8s/ingress-tls.yaml`; `deploy/terraform/modules/api_listener`; `check-api-listener-tls.sh`

## Context

[0076](0076-postgres-transit-tls.md) left this gap: the public API door was still cleartext. Inventory on `main` tip `1fd40e56f`:

| Surface | What it did | What it did not do |
|---------|-------------|--------------------|
| `deploy/k8s/ingress.yaml` | Optional nginx Ingress, not in the kustomization. Host `computerpets.example` | No `tls` block, no certificate, no redirect to HTTPS |
| `application.yml` `server.port` | JVM listens on 8081 | No `server.ssl`. Correct for a pod. Not a public TLS terminator |
| `deploy/terraform` | Regional WAF associates to a keeper-owned ALB ARN ([0074](0074-waf-in-front-of-rate-limiter.md)) | No ACM certificate. No `aws_lb_listener`. Nothing refused a cleartext public listener |
| Compose and the in-cluster Service | HTTP on 8081 | Correct for local. Not a public door |

This slice does not reopen presence/CSP, Hikari/replica pool sizing, bundle zip, cosign, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, the nonce store, the download JWT `jti`, the WAF ACL, Redis AUTH, or Postgres JDBC SSL beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**TLS terminates at the edge. The JVM stays HTTP on 8081. Local and in-cluster stay cleartext. When the public-listener flag or module is on, a cleartext public door is refused. This root does not call ACM.**

1. **Pod.** `server.ssl.enabled` stays false. There is no keystore. `ApiListenerTls` refuses `server.ssl` or a keystore on `prod` even when the public flag is unset. Terminating TLS in the JVM is not this slice.
2. **Flag.** `API_LISTENER_TLS_REQUIRED` (default false) and `API_PUBLIC_BASE_URL` (default empty). Blank means the same local HTTP door as before. On `prod`, a set flag requires an `https` origin: a dotted public hostname, port 443 or omitted, no userinfo, no path, no query. Loopback is refused. The URL is not logged.
3. **Ingress.** `deploy/k8s/ingress.yaml` stays the local/dev HTTP example and is still not in the kustomization. `deploy/k8s/ingress-tls.yaml` is the public manifest: a `tls` block (`computerpets-api-tls`), cert-manager annotation `cert-manager.io/cluster-issuer`, `ssl-redirect` and `force-ssl-redirect`, and `backend-protocol: HTTP`. It is not in the kustomization. It does not create a ClusterIssuer and does not register an ACME account. Change the issuer name to one you already run. Change the host. No nginx rate-limit annotations ([0074](0074-waf-in-front-of-rate-limiter.md)).
4. **Terraform.** `enable_api_listener_tls` defaults true. The module plans `aws_lb_listener.https` (443, `ELBSecurityPolicy-TLS13-1-2-2021-06`, forward to the existing target group) and `aws_lb_listener.http_redirect` (80, `HTTP_301` to HTTPS). It never forwards cleartext. There is no `aws_acm_certificate` resource. The keeper passes an ACM certificate ARN they already have, the ALB ARN they already have, and that ALB's target group ARN. `terraform validate` still passes with the empty defaults. `terraform plan` / `apply` with the flag on **fails closed** until those ARNs are shaped. When `enable_waf` is also true, `api_listener_alb_arn` must equal `waf_associate_alb_arn` so the listener and the WAF sit on the same keeper-owned ALB. `enable_api_listener_tls=false` is the explicit switch for local or in-cluster HTTP. CI does not `apply`.
5. **Wiring.** A public prod door sets `API_LISTENER_TLS_REQUIRED=true` and `API_PUBLIC_BASE_URL=https://<host>` (the name on that certificate). In-cluster `configmap.yaml` and compose leave the flag unset. `configmap-managed.example.yaml` shows the flag with a placeholder host, not a live domain.
6. **Verify without a cloud bill.** `check-api-listener-tls.sh` and `ApiListenerTlsTest` lock the markers. `terraform test` in `deploy/terraform/api_listener_tls.tftest.hcl` plans with a mock provider: an empty certificate ARN, a non-ACM ARN, and an NLB ARN are refused; a fixture ACM ARN plans 443 and an HTTP 301; a different ALB than the WAF is refused; `enable_api_listener_tls=false` plans no listener. CI does not `apply`.

## Consequences

- Compose, `mvn` on port 8081, and `kubectl apply -k deploy/k8s` keep booting with HTTP inside the cluster.
- A keeper who sets `API_LISTENER_TLS_REQUIRED` and leaves the public URL blank, or sets `http://`, does not start a process that claims a public TLS door while the origin is cleartext.
- A keeper who applies this root with the module on and no certificate ARN does not get a quiet HTTP listener. The plan stops. ACM is not called.
- The certificate, the ALB, and the target group stay keeper-owned. A wrong ARN fails in their account at apply time. This repo does not contain a live certificate.
- `ingress.yaml` can still be applied by hand. It is the local door. The public file is `ingress-tls.yaml`. A cluster without the named ClusterIssuer will not mint `computerpets-api-tls`.
- The hop from the Ingress or the ALB to the pod is HTTP on 8081. That is the in-cluster hop, not the public listener.
- The policy `ELBSecurityPolicy-TLS13-1-2-2021-06` does not pin a certificate fingerprint. Renewal stays with the keeper's ACM certificate.
- Forgetting the JVM flag on a hand-applied HTTP ingress does not fail the process. The terraform plan is what refuses a cleartext public ALB when the module is on.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** Horizontal pod autoscaling landed as [0078](0078-horizontal-pod-autoscaling.md). Not started in this ADR.
