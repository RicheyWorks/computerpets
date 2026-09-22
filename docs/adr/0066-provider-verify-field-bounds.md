# 0066. Provider verify fields fail closed on length and charset

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `VerifyFieldBounds`, `VerificationResult.invalid`, `*VerifyRequest.invalidReason` / `invalidProofReason`, `VerifyController` (HTTP 400); Steam / Itch / Epic / Microsoft / NFT ownership services

## Context

[0065](0065-secret-rotation-cadence-and-hsm.md) closed secret rotation. ARCHITECTURE §10 still listed **input length/charset validation on all provider fields** as a missing control. Inventory on `main` tip `4fd847f44`:

| Provider | Fields | Pre-outbound shape gate |
|----------|--------|-------------------------|
| Steam | `steamId`, `appId` | Missing required only — no charset/length |
| Itch | `gameId`, `downloadKey` | Numeric `gameId` only — `downloadKey` unbounded |
| Epic | `accountId`, `sandboxId`, `catalogItemId`, `platform` | Patterns present, but mapped to **403** deny |
| Microsoft | `xstsToken`, `storeProductId`, optional hash / account / signature / store id / sku | Missing required only |
| NFT | wallet / contract / token / `personal_sign` | Address + decimal token solid; message/signature unbounded |
| Shared | `hwid` | Max 128 → **400** already |

Junk tokens could still leave on RestClient / RPC paths, and malformed Epic/Itch shapes looked like ownership denies. Trusted-proxy `X-Forwarded-For` hardening remains a separate gap (ARCHITECTURE weaknesses) and is **not** this slice.

This closes the verify-field gap without storefront work, without DirectX 12 / Vulkan / Solana, and without reopening presence / CSP, Hikari / replica, bundle zip, cosign, Terraform, CDN edge redeem, ProductionProfileGuard, or dual-key rotation beyond this cross-link. Catalog stays 221.

## Decision

**Fail-closed max length + allowed charset on every ownership verify field before any outbound store or RPC call. Honest HTTP 400. No silent truncation.**

1. Shared `VerifyFieldBounds` encodes per-field max length and charset patterns.
2. Each `*VerifyRequest` exposes `invalidReason()` (NFT: `invalidProofReason()` for message/signature; address/token stay on existing normalize/parse).
3. `VerificationResult.invalid(reason)` sets `clientError=true`. Ownership misses stay `denied` → 403.
4. `VerifyController` maps `clientError` → **400** `{ "error", "provider" }` before license issue.
5. `enterprisepet.verify` outcome tag uses `invalid` for shape failures (distinct from `denied`).

## Consequences

- Path-junk / oversized Steam IDs, itch download keys, Epic ids, Microsoft tokens, and NFT proofs never leave the house.
- Clients that previously saw **403** for malformed Epic/Itch/NFT shape now see **400** — clearer contract; update callers that branched on 403 for typos.
- `X-Forwarded-For` remains trusted unconditionally until a dedicated trusted-proxy slice.
- Catalog stays 221. No Rui sprites. `_*.py` stay untracked.
