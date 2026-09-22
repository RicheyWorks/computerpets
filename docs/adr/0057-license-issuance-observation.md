# 0057. License issuance is a business observation

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `VerificationTelemetry.issue`; `VerifyController` wrap of `LicenseService.issueLicense`

## Context

Phase 3.2 already ships `enterprisepet.verify` (provider + outcome) and `enterprisepet.download` (pet). ARCHITECTURE called out **license issuance rate** as still open: a successful ownership probe does not by itself prove a license was sealed and persisted. Operators scraping `/actuator/prometheus` could not tell issue volume or encrypt/persist latency apart from verify latency.

Phase 2 hardening (download jti grants, ownership timeouts, `*_FILE` secrets) is complete. This slice closes the named observability gap without storefront work and without DirectX 12 / Vulkan. Presence / CSP and download-jti are not reopened beyond this cross-link. Catalog stays 221.

## Decision

**Observe issuance at the verify success path.**

1. After ownership is verified and the pet / hwid checks pass, wrap `LicenseService.issueLicense` in `VerificationTelemetry.issue(provider, pet, …)`.
2. Meter name: `enterprisepet.license.issue`. Tags: `provider`, `pet`, `outcome` (`success` / `error`).
3. Issuance rate = count of `outcome=success`. Latency covers AES-GCM encrypt + Postgres persist only — not the provider probe (that stays on `enterprisepet.verify`).
4. Denied or unknown-provider verifies do **not** emit an issue observation (no license left the house).
5. Direct test / admin calls to `LicenseService.issueLicense` stay unmetered; the business rate is the HTTP verify→issue path.

Histogram percentiles for `enterprisepet.license.issue` are enabled next to verify and download in `application.yml`.

## Consequences

- Prometheus can chart issuance rate and p99 encrypt/persist time per provider and pet without inventing a second scrape path.
- A hang inside issue shows up on the issue timer, not only on `http.server.requests`.
- Soft-delete / license audit ledger work (ARCHITECTURE 3.2 DB maturity) remains separate.
