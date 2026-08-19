# NFT ownership

A named wallet is not a keeper. `POST /api/verify/nft` asks for a
`personal_sign` from the one who holds the keys, then proves on-chain
ownership, then issues the same AES-GCM license + JWT the Steam and
Microsoft doors issue.

## What was wrong before

The original check decoded `ownerOf` (good) but would still:

- accept **any** ERC-721 on mainnet, then issue a license for **any** pet
- treat `0x` as a wallet (the empty suffix is a substring of every ABI word)
- call `eth_call` with the claimant as `from`
- hang on a stuck Alchemy placeholder with no timeout
- ignore ERC-1155 collections entirely

## Current contract

1. `walletAddress` and `contractAddress` must be 20-byte `0x` hex. They are
   compared case-insensitively (EIP-55 checksums are fine).
2. `tokenId` must be a non-negative decimal integer (max 78 digits / uint256).
3. With the default `ethereum.allowlist-required: true`, the contract must be
   listed under `ethereum.collections`. An empty list means **every** NFT verify
   is denied — we will not license a random CryptoKitty as a Dragon.
4. If a collection declares a `tokens` map, that token is bound to one pet.
   A mismatch with the request `petType` is a 403; a hit sets the issued pet
   even if the client omitted `petType`.
5. Standard is per collection: `ERC721` (`ownerOf`), `ERC1155` (`balanceOf > 0`),
   or `AUTO` (try both). Unlisted contracts (only when the allowlist is off)
   use `AUTO`.
6. `message` + `signature` (`personal_sign`) are required. The recovered
   signer must match `walletAddress`. Naming a wallet is not enough — the
   keeper must prove they hold the keys. Production
   `ethereum.require-signature` is true (fail closed, like the empty Steam
   and Store doors). `EthereumProperties.unrestricted()` is a test helper
   for isolated `ownsToken` checks only.

## Configure

```yaml
ethereum:
  rpc-url: ${ETHEREUM_RPC_URL}
  request-timeout-ms: 4000
  allowlist-required: true
  require-signature: true
  collections:
    - address: "0xYourOfficialComputerPetsContract"
      standard: ERC721
      name: "ComputerPets Genesis"
      tokens:
        1: red_panda
        2: dragon
```

```bash
export ETHEREUM_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/<key>"
```

`GET /api/verify/nft/collections` returns the public allowlist so a client can
build a picker without hardcoding addresses.

`/actuator/health` includes an `nft` indicator: down while the RPC URL is still
the `YOUR_ALCHEMY_KEY` placeholder.

## Request

```json
{
  "walletAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "contractAddress": "0xYourOfficialComputerPetsContract",
  "tokenId": "2",
  "petType": "dragon",
  "message": "ComputerPets verify nft 2",
  "signature": "0x…"
}
```

A successful response is the same shape as Steam/Microsoft: encrypted license,
short-lived JWT, and the pet the token actually unlocks.
