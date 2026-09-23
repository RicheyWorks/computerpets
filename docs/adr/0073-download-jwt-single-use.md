# 0073. Single-use download JWT

- **Status:** Accepted
- **Date:** 2026-09-23
- **Code:** `JwtService`, `DownloadJwtStore`, `RedisDownloadJwtStore`, `DownloadController`, Electron `license/client`, blotter `license/http_client`

## Context

[0072](0072-signed-request-nonce.md) left this gap: a download JWT is reusable until `jwt.ttl-minutes` (default 30). Inventory on `main` tip `6648156c1`:

| Surface | What is single-use | What a captured bearer can still do |
|---------|--------------------|-------------------------------------|
| `GET /api/bundles/{pet}/redeem` | `download:grant:{licenseJti}:{exp}` ([0055](0055-download-jti-one-time-and-ip-bound.md)) | Nothing with that exact URL. A new `exp` is a new grant |
| `POST /api/download/{pet}` | Nothing on the bearer | Present the same JWT again and mint another one-time URL. `JwtService.issue` set `sub`, `pet`, `prv`, `iat`, `exp`. No `jti` |
| Signed admin / machine | `replay:nonce:{admin\|machine}:{nonce}` for 300s ([0072](0072-signed-request-nonce.md)) | Not this door. Download stays the license JWT |

Unlock and the blotter send `Authorization: Bearer <auth.token>`. They do not send a separate jti header. The license `jti` on the signed URL is a different id (revocation and the one-time grant).

This slice does not reopen presence/CSP, Hikari/replica, bundle zip, cosign, Terraform/WAF, CDN edge, secrets, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, the machine/admin HMAC, or the nonce store beyond the cross-link in [0072](0072-signed-request-nonce.md). Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Fail-closed single-use `jti` on the download JWT. Same Redis as the rate limiter. TTL is `jwt.ttl-minutes` plus 60 seconds of clock skew.**

1. **Mint.** `JwtService.issue` sets `jti` to a random UUID. The client keeps storing `auth.token` and sending it as the bearer. Unlock does not gain a new field.
2. **When.** After the license, pet, hwid, and owner/pet cross-check succeed, and before `recordDownload` or grant issue. A 400/401/403 on those checks does not spend the bearer, so a keeper can correct a mismatch and POST again.
3. **Store.** `SET download:jwt:{jti} 1 NX EX {ttl}`. First claim continues and mints one `download:grant:{licenseJti}:{exp}` as today. A second claim of that JWT `jti` is **409** `download token already used`. The signed URL is not returned. A missing `jti` is **401** `download token has no jti`. A non-UUID `jti` is **401** `download token jti invalid`. Redis down, or any claim error, is **503** `download token store unavailable`. The request is not accepted and no URL is returned. `rate-limit.backend=memory` uses a process-local map with the same TTL. `prod` already refuses `memory`.
4. **Not the other keys.** `replay:nonce:*`, `revoked:jti:*`, and `download:grant:*` stay as they are. The URL `jti` is still the license id.

A bearer issued before this slice has no `jti` and is **401** until the client verifies again.

## Consequences

- A captured download bearer can mint one signed URL. A second `POST /api/download` inside the TTL is **409**.
- A new verify mints a new `jti` and a new bearer. That is a new mint, and it still requires the machine HMAC and nonce ([0070](0070-machine-request-signature.md), [0072](0072-signed-request-nonce.md)).
- If the token store accepts the claim and the grant store then fails, the bearer is spent and the client must verify again. Both stores are the same Redis, so that window is a crash between the two commands.
- Two fresh bearers for the same license in the same `exp` second can still `SETEX` the same `download:grant:{licenseJti}:{exp}` key. That reopen is the grant index, not this JWT claim.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** WAF landed as [0074](0074-waf-in-front-of-rate-limiter.md). Redis AUTH and transit TLS landed as [0075](0075-redis-auth-and-transit-tls.md). Not started in this ADR.
