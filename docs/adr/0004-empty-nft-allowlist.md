# 0004. Official NFT allowlist stays empty until a collection exists

- **Status:** Accepted
- **Date:** 2026-08-17
- **Code:** `ethereum.collections` in `application.yml`; `NftCatalog`, `EthereumNftService`; [NFT.md](../NFT.md)

## Context

An earlier NFT check would accept **any** mainnet ERC-721 and then
issue a license for **any** pet. That makes a random CryptoKitty a
Dragon. There is still no deployed ComputerPets collection, so filling
`ethereum.collections` with a placeholder address would be a lie and
would let anyone who deployed that address mint licenses.

Solana (and any other chain) has the same problem: no live collection
address, no provider.

## Decision

Keep the official allowlist **empty** and **required**:

```yaml
ethereum:
  allowlist-required: true
  collections: []
```

With those defaults, `POST /api/verify/nft` returns denied
(`no official NFT collections configured`) before any `eth_call`.
`GET /api/verify/nft/collections` returns the public list — today,
nothing.

When a real contract exists, add it under `ethereum.collections`
(address, `ERC721` / `ERC1155` / `AUTO`, optional `tokenId → petType`
map). Do not invent an address in docs, tests, or config.

Do not add a Solana (or other) `OwnershipProvider` until that chain
has a live collection address to allowlist the same way.

## Consequences

- NFT verify is fail-closed in every environment until an operator
  configures a real contract. That is intentional.
- `allowlist-required: false` still exists for tests
  (`EthereumProperties.unrestricted()`). It is not the production
  shape.
- Clients must not hard-code a ComputerPets collection. They should
  read `/api/verify/nft/collections` or wait until the list is
  non-empty.
- The Electron unlock UI ships Steam only ([0005](0005-electron-overlay-implements-client-contract.md)).
  It does not stub an NFT address.
