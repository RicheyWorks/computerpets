# 0069. Bundle catalog rate limit on `GET /api/bundles/{petKey}` (fail-closed)

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `RateLimitingFilter`, `RateLimitBackend`, `ClientAddress`

## Context

[0068](0068-discovery-rate-limit.md) limited public pet discovery (`/api/pets`, 60/min) and left `/api/bundles/**` open. Inventory on `main` tip `44a529a1a`:

| Bucket key | Path | Capacity | Covered |
|------------|------|----------|---------|
| `verify` | `/api/verify/` | 10/min | Yes |
| `download` | `/api/download/` | 30/min | Yes — grant **issue** (`POST /api/download/{pet}`) |
| `discovery` | `/api/pets` | 60/min | Yes — list, by-rarity, detail ([0068](0068-discovery-rate-limit.md)) |
| *(none)* | `GET /api/bundles/{petKey}` | — | **No** — public catalog read, walked without a bucket |
| *(none)* | `GET /api/bundles/{petKey}/redeem` | — | Not a filter bucket. HMAC, one-time consume, and IP binding ([0055](0055-download-jti-one-time-and-ip-bound.md)). Issue is already the `download` bucket. |

Catalog listing is still the unlimited public read, so this slice is the rate limit, not signed machine-client requests. Signed requests stay the next gap. This slice does not reopen presence/CSP, Hikari/replica, bundle zip, cosign, Terraform, CDN edge, secrets, VerifyFieldBounds, ClientAddress, or the discovery bucket beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana.

## Decision

**Fail-closed catalog limits on bundle artifact reads, same filter and `ClientAddress` as verify/download/discovery. Signed redeem stays off that bucket.**

1. Add rule prefix `/api/bundles/`, bucket key `bundles`, **60 tokens / minute** per client IP (abuse-prevention, not metering; same default as discovery because catalog reads are local and cheap). Separate from `discovery` so a pet-list walk does not spend the artifact budget.
2. `GET /api/bundles/{petKey}` (and any other non-redeem path under that prefix) shares the bundles budget. Exhausted bucket → honest **429** + `Retry-After` + `application/problem+json`. Redis down → **503** fail-closed (not a memory lift).
3. `GET /api/bundles/{petKey}/redeem` (optional trailing slash) is **excluded**. A catalog 429 does not run redeem, does not consume the one-time grant, and does not replace redeem status codes (401/403 grant outcomes, grant-store 503). Download issue remains 30/min on `/api/download/`.
4. Client identity stays `ClientAddress` (trusted-proxy CIDRs only; [0067](0067-trusted-proxy-client-address.md)).

## Consequences

- Walking published artifact rows is bounded per client IP the same way pet discovery already is.
- A keeper UI that lists every pet's artifacts in a tight loop can hit 429; 60/min is enough for normal browse cadence. Edge redeem of a signed URL is not charged to this bucket.
- Operators still need Redis (or `RATE_LIMIT_BACKEND=memory` for a single local process). Capacities are code defaults in `RateLimitingFilter`, not environment knobs.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
- **Next gap:** signed requests for machine clients. Not started here.
