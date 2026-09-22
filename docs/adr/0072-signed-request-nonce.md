# 0072. Single-use nonce for signed admin and machine requests

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `RequestReplayStore`, `RedisRequestReplayStore`, `AdminRequestSignatureFilter`, `MachineRequestSignatureFilter`, house `/admin` ledger, Electron `machine-sign`, blotter `machine_sign`

## Context

[0071](0071-admin-request-signature.md) left this gap: a captured admin or machine request can be replayed until the 300 second skew window ends. Inventory on `main` tip `9d3e5d0bc`:

| Surface | Gate | What stops a second use |
|---------|------|-------------------------|
| `GET`/`POST` `/api/admin/**` except OPTIONS | HMAC `computerpets-admin-v1`, `ADMIN_API_KEY`, 300s ([0071](0071-admin-request-signature.md)) | Nothing inside the window. The house ledger is `web/src/lib/admin/api.ts` |
| `POST`/`PUT`/`PATCH`/`DELETE` `/api/verify/**` | HMAC `computerpets-machine-v1`, `LICENSE_SECRET_KEY`, 300s ([0070](0070-machine-request-signature.md)) | Nothing inside the window. Callers are Electron `desktop/license` and the blotter |
| `GET /api/bundles/{pet}/redeem` | URL HMAC `pet\|owner\|jti\|exp` | Already one-time. `download:grant:{jti}:{exp}` on the rate-limit Redis ([0055](0055-download-jti-one-time-and-ip-bound.md)) |
| License revoke | Postgres ledger + `revoked:jti:{jti}` | Already a deny-list. Not a request nonce |
| `POST /api/download/**` | License JWT (`jwt.ttl-minutes`, default 30) | The bearer has no `jti` and is not single-use. Each success still mints a one-time URL |

Download grants and the revocation ledger already share Redis (`rate-limit.backend=redis`, in-memory only for tests / one process). There was no `replay:` key and no nonce header. A static `X-Admin-Key` stays refused.

This slice does not reopen presence/CSP, Hikari/replica, bundle zip, cosign, Terraform, CDN edge, secrets, VerifyFieldBounds, ClientAddress, rate-limit bucket sizes, or the HMAC version strings beyond the nonce line in the canonical string. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Fail-closed single-use nonce on signed admin and machine requests. Same Redis as the rate limiter. TTL 300 seconds.**

1. **Header.** `X-ComputerPets-Nonce`. 16 to 128 characters of `[A-Za-z0-9_-]` (a UUID or 16 random bytes in Base64 URL both fit). A newline cannot move the body hash.
2. **Canonical string.** The version strings stay `computerpets-admin-v1` and `computerpets-machine-v1`. One new line, after the timestamp and before the body hash. A captured request from before this slice has no nonce and is **401**.
3. **Order.** Missing timestamp or signature → **401** `Admin signature required.` / `Machine signature required.` Missing nonce → **401** `Admin nonce required.` / `Machine nonce required.` Illegal nonce → **401** `… nonce invalid.` Skew and a bad MAC stay the existing **401** lines. The controller does not run.
4. **Store.** After the MAC matches, `SET replay:nonce:{admin|machine}:{nonce} 1 NX EX 300`. First use continues. A second use of that nonce on that door → **401** `Admin request replayed.` / `Machine request replayed.` Admin and machine do not share a nonce. Redis down, or any claim error → **503** `… nonce store unavailable.` The request is not accepted. `rate-limit.backend=memory` uses a process-local map with the same TTL. `prod` already refuses `memory`.
5. **Clients.** The house `/admin` ledger, Electron verify, and the blotter each mint a nonce and send it. CORS on `/api/admin/**` allows the header. Operator curl is in [SETUP.md](../SETUP.md).

## Consequences

- A captured signed admin or machine request cannot be replayed inside the 300 second window.
- Two honest calls need two nonces. A retry signs again.
- The nonce store is not the download-grant index and not the jti deny-list. Those keys stay as they are.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** a download JWT is still reusable until `jwt.ttl-minutes` (default 30). It has no `jti` and is not single-use, so a captured bearer can `POST /api/download` again and mint another one-time URL. The signed URL itself is already one-time. WAF in front of the rate limiter remains the Terraform stub ([0062](0062-terraform-managed-stores.md)), not a live gate on this JVM. Not started here.
