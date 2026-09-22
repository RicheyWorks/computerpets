# 0067. Trusted-proxy client address (fail-closed XFF / Forwarded)

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `TrustedProxyProperties`, `ClientAddress`, `RateLimitingFilter`, `DownloadController`, `BundleController`

## Context

[0066](0066-provider-verify-field-bounds.md) closed verify-field length/charset. ARCHITECTURE still listed **`X-Forwarded-For` trusted unconditionally** as a weakness. Inventory on `main` tip `bf3ebbf19`:

| Consumer | Path | Pre-slice behaviour |
|----------|------|---------------------|
| Rate limits | `RateLimitingFilter` → `ClientAddress.from` | First XFF hop always, else `remoteAddr` |
| Download grant issue | `DownloadController` | Same |
| Download grant redeem / IP bind | `BundleController` redeem | Same |
| Audit / MDC | — | No client IP recorded |
| CDN edge | `deploy/cdn/edge-redeem.js` | Sets XFF to viewer; house must trust the edge peer |

Any direct client could spoof XFF and exhaust another keeper's rate-limit bucket or steal a download grant IP bind. This slice does not reopen CDN edge, secret rotation, verify-field bounds, presence/CSP, Hikari/replica, bundle zip, cosign, or Terraform beyond this cross-link. Catalog stays 221.

## Decision

**Fail-closed trusted-proxy CIDRs. Honour `X-Forwarded-For` / RFC 7239 `Forwarded` only when `remoteAddr` matches; otherwise use `remoteAddr`.**

1. `trusted-proxies.cidrs` (`TRUSTED_PROXY_CIDRS`) — comma/whitespace CIDRs. Empty = never trust forwarded headers.
2. Shared `ClientAddress` bean: when the peer is trusted, first XFF hop wins; else first `Forwarded` `for=`; else `remoteAddr`.
3. Defaults: base/staging/prod empty (fail-closed). `dev` profile defaults to `127.0.0.1/32,::1/128` so laptop / compose loopback can still bind grants by XFF.
4. Operators behind ALB / ingress / CDN edge list those peer CIDRs. Misconfiguration degrades to proxy-IP bucketing (safe), not client spoofing.

## Consequences

- Spoofed XFF from the public internet no longer moves rate-limit or download-grant identity.
- Edge and LB deploys must set `TRUSTED_PROXY_CIDRS` or IP binding / per-keeper limits collapse onto the proxy address.
- Clients that previously relied on unconditional XFF against a directly exposed house stop getting their preferred identity — correct.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
