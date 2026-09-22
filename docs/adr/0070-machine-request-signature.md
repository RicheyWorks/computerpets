# 0070. Signed requests for machine clients (fail-closed verify HMAC)

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `MachineRequestSignature`, `MachineRequestSignatureFilter`

## Context

[0069](0069-bundle-catalog-rate-limit.md) left **signed requests for machine clients** as the next ARCHITECTURE missing control. Inventory on `main` tip `c123c58db`:

| Surface | Caller | Bearer | Request signature |
|---------|--------|--------|-------------------|
| `POST /api/verify/{provider}` | Electron overlay + PyQt blotter Unlock, before a license exists | No | **No** — anyone could ask for a license |
| `POST /api/download/{pet}` | Same clients, after Unlock | JWT (`JWT_SECRET_KEY`, HMAC-SHA256) | Bearer only. Not a MAC over method, path, and body |
| `GET /api/bundles/{pet}/redeem` | CDN edge (`deploy/cdn/edge-redeem.js`) | No | **Yes** — URL HMAC `pet\|owner\|jti\|exp` with `BUNDLE_SIGNING_KEY`, then one-time IP grant ([0055](0055-download-jti-one-time-and-ip-bound.md), [0063](0063-cdn-edge-redeem-verification.md)) |
| `GET /api/verify/providers`, `GET /api/verify/nft/collections` | Discovery | No | No — reads, not a license issue |
| `GET /api/pets/**`, `GET /api/bundles/{petKey}` | Discovery / catalog | No | No — already rate-limited ([0068](0068-discovery-rate-limit.md), [0069](0069-bundle-catalog-rate-limit.md)) |
| `GET /api/public/heartbeat`, `/pet/feed` `/pet/play` `/pet/rest`, actuator health | Overlay HUD, care door, probes | No | No — not the license door |
| `/api/admin/**` | House `/admin` ledger | No | **No** — static `X-Admin-Key` (`ADMIN_API_KEY`, previous key during rotation). No skew |

Download-grant HMAC and edge redeem are already fail-closed. They are not a general machine-client request signature. Admin is a human browser ledger, not this slice.

The overlay and the blotter already hold `LICENSE_SECRET_KEY` (env or `LICENSE_SECRET_KEY_FILE`, [0056](0056-house-secrets-from-file-mounts.md)) to decrypt the license Unlock just received. The living desk does not POST verify and does not hold that key. Download continues to require the license JWT, so a browser Unlock that already has a license is not asked to mint a second signature scheme.

This slice does not reopen presence/CSP, Hikari/replica, bundle zip, cosign, Terraform, CDN edge, secrets, VerifyFieldBounds, ClientAddress, or rate-limit bucket sizes beyond the filter order note below. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Fail-closed HMAC-SHA256 on machine writes to `/api/verify`. License download stays the JWT. Redeem stays the URL MAC.**

1. **Where.** `POST`, `PUT`, `PATCH`, and `DELETE` under `/api/verify` (including `/api/verify/{provider}`). `GET` discovery is unchanged. `POST /api/download/**` is unchanged. Redeem, admin, heartbeat, pets, catalog, and care doors are unchanged.
2. **Headers.** `X-ComputerPets-Timestamp` (unix seconds) and `X-ComputerPets-Signature` (Base64 URL, no padding).
3. **Canonical string.** UTF-8, five lines after the version:
   `computerpets-machine-v1`, uppercase method, path (no scheme or host), raw query or empty, timestamp, lowercase hex SHA-256 of the raw body.
4. **Skew.** 300 seconds either side of the house clock. Missing or non-numeric timestamp → **401** `Machine signature required.` Outside the window → **401** `Machine request outside the 300 second window.` Bad MAC → **401** `Machine signature invalid.` Body is `application/problem+json`. The controller does not run.
5. **Key.** UTF-8 bytes of `license.secret-key` (`LICENSE_SECRET_KEY` / `LICENSE_SECRET_KEY_FILE`). Optional `license.secret-key-previous` verifies during rotation ([0065](0065-secret-rotation-cadence-and-hsm.md)); signing uses the current key only. A blank current key never matches. Not `BUNDLE_SIGNING_KEY` (that would let the client forge CDN URLs). Not `JWT_SECRET_KEY` (that would let the client forge bearers). Not a new secret mount.
6. **Clients.** Electron `desktop/license` and the blotter sign the exact body bytes they send, with the license key Unlock already requires. Missing key → `missing_secret` before the POST. Download is still `Authorization: Bearer`.
7. **Rate limit.** The verify bucket (10/min, [0003](0003-redis-rate-limit-and-jti-denylist.md)) runs before this MAC, so a refused signature still spends a token. Capacities are unchanged.

## Consequences

- A caller who does not hold `LICENSE_SECRET_KEY` cannot complete `POST /api/verify`. The official overlay and blotter already need that key to decrypt, so Unlock still issues a license and then downloads with the JWT.
- The living-desk browser does not call this route. `/admin` sent a static `X-Admin-Key` until [0071](0071-admin-request-signature.md).
- A captured signed verify can be replayed until the 300 second window ends. There is no nonce store in this slice.
- The desktop binary still contains the license key, because decrypt requires it. This raises the bar from an anonymous POST to possession of that key. It does not make the client trusted.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** landed as [0071](0071-admin-request-signature.md). Not started in this ADR.
