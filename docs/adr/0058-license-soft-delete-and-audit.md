# 0058. License revoke soft-deletes and writes an audit ledger

- **Status:** Accepted
- **Date:** 2026-09-22
- **Code:** `IssuedLicense.deletedAt`; Flyway `V3__License_soft_delete_and_audit.sql`; `LicenseAuditService` / `license_audit_events`; `LicenseService.revoke` / `recordDownload` / `issueLicense`

## Context

ARCHITECTURE §10 / Phase 3.2 Database & Persistence Maturity still listed **soft deletion + audit logging for licenses** after Phase 2 and the license-issuance observation slice (ADR 0057). Revoke already set `revokedAt` and published the Redis deny-list, but the ledger had no soft-delete stamp, default queries did not distinguish active vs revoked tombstones, and there was no append-only who/what/when event table.

This slice closes that DB-maturity gap without storefront work and without DirectX 12 / Vulkan. Presence / CSP, download-jti, and Phase 2 secrets are not reopened beyond this cross-link. Catalog stays 221. Solana stays blocked.

## Decision

**Revoke soft-deletes; audit is append-only; secrets stay out of the ledger.**

1. Flyway `V3` adds `issued_licenses.deleted_at` and backfills it from existing `revoked_at`. Revoke sets `revokedAt` and `deletedAt` together — never `DELETE FROM`.
2. Default operational queries exclude soft-deleted rows (`findByJtiAndDeletedAtIsNull`, `findTop50ByDeletedAtIsNull…`). Admin lookup / list still return soft-deleted rows with honest `revoked` / `deleted` copy.
3. `license_audit_events` records `ISSUED`, `REVOKED`, and `DOWNLOAD` (redeem-adjacent usage). Fields: jti, event type, actor (`system` / `admin`), owner, pet, provider, occurredAt, optional short detail (`hwidBound=true`, `soft-deleted`). No ciphertext, keys, JWTs, or hwid values.
4. Validate denies missing, revoked, or soft-deleted jtis (same fail-closed path as before).

## Consequences

- Operators keep a tombstone on the admin ledger after revoke; downloads still stop immediately via Redis + ledger.
- Active-only listings and download usage stamps skip soft-deleted rows.
- Prometheus issuance rate (ADR 0057) stays separate from the durable audit ledger.
- Read-replica / pool tuning lands in [0059](0059-hikari-pool-and-read-replica.md). Bundle zip contents, image signing, and Terraform remain the next non-storefront / non-DX12 maturity items.
