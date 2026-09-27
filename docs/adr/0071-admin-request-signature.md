# 0071. Signed admin requests (fail-closed HMAC)

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `AdminRequestSignature`, `AdminRequestSignatureFilter`, house `/admin` ledger

## Context

[0070](0070-machine-request-signature.md) left **admin hooks** as the next gap: `/api/admin/**` accepted a static `X-Admin-Key` (`ADMIN_API_KEY`, or `ADMIN_API_KEY_PREVIOUS` during rotation) with no request MAC and no skew. Inventory on `main` tip `16c197bd5`:

| Route | Caller | What the wire carried |
|-------|--------|------------------------|
| `POST /api/admin/revoke` | House `/admin` ledger, operator curl | `X-Admin-Key` only. A captured header worked until the key rotated |
| `GET /api/admin/licenses` | Same ledger (also the admin page's unlock probe: only a license list counts) | Same static header. Optional `owner` query was unsigned |
| `GET /api/admin/licenses/{jti}` | Same ledger | Same static header |
| `POST /api/verify/**` | Overlay and blotter | Already HMAC (ADR 0070). Different key, different canonical version |
| Download, redeem, pets, catalog, heartbeat, care | Unchanged | Not this gate |

No script under `deploy/` called `/api/admin`. The only client is `web/src/lib/admin/api.ts`, which kept the key in `sessionStorage` and sent it on every request. Spring Security `permitAll`s the prefix; the controller compared the header in constant time.

This slice does not reopen presence/CSP, Hikari/replica, bundle zip, cosign, Terraform, CDN edge, secrets rotation, VerifyFieldBounds, ClientAddress, rate-limit buckets, or the machine-verify HMAC beyond the cross-link above. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana. No Rui sprites.

## Decision

**Fail-closed HMAC-SHA256 on every `/api/admin` method except OPTIONS. The admin key stays the MAC secret. A static `X-Admin-Key` is not accepted.**

1. **Where.** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and any other method under `/api/admin` (including `/api/admin/revoke` and `/api/admin/licenses`). `OPTIONS` stays the CORS preflight. Verify, download, redeem, pets, catalog, heartbeat, and care doors are unchanged.
2. **Headers.** `X-ComputerPets-Timestamp` (unix seconds) and `X-ComputerPets-Signature` (Base64 URL, no padding). The admin key is not a header.
3. **Canonical string.** UTF-8, newline-separated:
   `computerpets-admin-v1`, uppercase method, path (request URI, no scheme or host), raw query or empty, timestamp, lowercase hex SHA-256 of the raw body.
4. **Skew.** 300 seconds either side of the house clock. Missing or non-numeric timestamp → **401** `Admin signature required.` Outside the window → **401** `Admin request outside the 300 second window.` Bad MAC → **401** `Admin signature invalid.` Body is `application/problem+json`. The controller does not run.
5. **Key.** UTF-8 bytes of `admin.api-key` (`ADMIN_API_KEY` / `ADMIN_API_KEY_FILE`). Optional `admin.api-key-previous` verifies during rotation ([0065](0065-secret-rotation-cadence-and-hsm.md)); the house ledger signs with the key the operator pasted. A blank current key never matches. Not `LICENSE_SECRET_KEY` (that would let a machine client open the ledger). Not `BUNDLE_SIGNING_KEY`. Not `JWT_SECRET_KEY`.
6. **Clients.** The house `/admin` page signs the exact path, raw query, and body bytes, then keeps the key in `sessionStorage` for the tab. Operator curl is in [SETUP.md](../SETUP.md). CORS allows the two signature headers on `/api/admin/**`.
7. **Startup.** `AdminController` still refuses a blank, placeholder, or previous-equals-current admin key. That check is not the request gate.

## Consequences

- A captured admin request can be replayed until the 300 second window ends. There is no nonce store in this slice.
- A captured `X-Admin-Key` from an old log no longer opens the ledger. The key is not on the request.
- The key still sits in the operator tab. A script in that page can sign. This raises the bar from a reusable header to possession of the key plus a fresh MAC.
- A machine-verify MAC does not verify here: different version string (`computerpets-machine-v1`) and different key.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** landed as [0072](0072-signed-request-nonce.md). Not started in this ADR.
