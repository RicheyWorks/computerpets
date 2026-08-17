# 0001. Modular monolith with an OwnershipProvider SPI

- **Status:** Accepted
- **Date:** 2026-08-17
- **Code:** `OwnershipProvider`, `ProviderRegistry`, `VerifyController`; implementations in `steam/`, `nft/`, `microsoft/`, `itch/`, `epic/`

## Context

ComputerPets has to prove entitlement on several unrelated storefronts
(Steam game ownership, Ethereum ERC-721/1155, Microsoft Store, itch.io
download keys, Epic Ecom) and then issue the same license + JWT. The
request bodies are different; the issuance path is not.

Splitting “one microservice per storefront” would multiply deployables,
secrets, and health probes before traffic exists. Hard-coding each
storefront in `VerifyController` would make every new platform a
controller and security change.

## Decision

Stay a **single Spring Boot process** (a modular monolith) with a
plugin SPI:

- `OwnershipProvider` declares a stable wire `key()`, a `displayName()`,
  and `verify(Map<String, String>)`.
- Implementations are `@Service` beans, optionally gated by
  `ownership.providers.{key}.enabled`.
- `ProviderRegistry` indexes them at startup (duplicate keys fail the
  process) and `GET /api/verify/providers` lists what is actually
  registered.
- `POST /api/verify/{provider}` dispatches by key. Controllers, JWT
  issuance, AES-GCM licensing, and download stay shared.

A provider returns `VerificationResult.denied(...)` for “not owned” and
throws only for unexpected upstream failure (mapped to 502).

## Consequences

- Adding a storefront is one class plus config and tests. Clients
  discover it; they do not get a new URL family.
- Runtime registration and ordering are not dynamic. Enable/disable is
  a restart (`@ConditionalOnProperty`).
- Horizontal scale is replica count of this one service, not a mesh of
  provider gateways. Phase 5 (“split into License Service / Provider
  Gateway”) is still an evaluation, not a decision.
- The verify body stays a flat `Map<String, String>` so wildly different
  credentials fit. That costs compile-time request types and generated
  SDKs.
- Solana (or any other chain) is not a provider until a live collection
  address exists. See [0004](0004-empty-nft-allowlist.md).
