# 0068. Discovery rate limit on `/api/pets` (fail-closed)

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `RateLimitingFilter`, `RateLimitBackend`, `ClientAddress`

## Context

[0067](0067-trusted-proxy-client-address.md) made rate-limit and download-grant identity fail-closed on trusted-proxy CIDRs. Inventory on `main` tip `4b9919291`:

| Bucket key | Path prefix | Capacity | Covered |
|------------|-------------|----------|---------|
| `verify` | `/api/verify/` | 10/min | Yes — including `GET /providers` |
| `download` | `/api/download/` | 30/min | Yes |
| *(none)* | `/api/pets` (list, `by-rarity`, `{key}`) | — | **No** — public catalog walked without a bucket |
| *(none)* | `/api/bundles/**` (catalog list; redeem separate) | — | Still open; not this slice |

ARCHITECTURE still listed missing rate limiting on discovery. Prefer a shared Redis Bucket4j rule over signed machine-client requests for this gap. This slice does not reopen presence/CSP, Hikari/replica, bundle zip, cosign, Terraform, CDN edge, secrets, VerifyFieldBounds, or ClientAddress beyond this cross-link. Catalog stays 221. No storefront. No DirectX 12 / Vulkan / Solana.

## Decision

**Fail-closed discovery limits on `/api/pets`, same filter and `ClientAddress` as verify/download.**

1. Add rule prefix `/api/pets`, bucket key `discovery`, **60 tokens / minute** per client IP (abuse-prevention, not metering; above verify because catalog reads are local and cheap).
2. Exhausted bucket → honest **429** + `Retry-After` + `application/problem+json`. Redis down → **503** fail-closed (not a memory lift).
3. List (`GET /api/pets`), grouped (`/by-rarity`), and detail (`/{key}`) share one discovery budget.
4. `/api/bundles/**` catalog listing stays unlimited in this slice; signed machine-client requests remain a later gap.

## Consequences

- Scraping or walking the public catalog is bounded per client IP the same way verify already is.
- A keeper UI that hammers list + detail in a tight loop can hit 429; 60/min is enough for normal unlock / browse cadence.
- Operators still need Redis (or `RATE_LIMIT_BACKEND=memory` for a single local process) for discovery, same as verify/download.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
