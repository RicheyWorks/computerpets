# EnterprisePet Backend v1.0

**Secure Java backend for premium desktop pets — Steam, Ethereum NFTs, and Microsoft Store**

## Architecture

- Plugin-based ownership verification (Steam, Ethereum NFT, Microsoft Store; add new platforms by dropping in a `@Service` that implements `OwnershipProvider`).
- AES-GCM encrypted license bundles (never trust the desktop client).
- JWT-authenticated client→backend channel; bundle download requires a fresh bearer issued by `/api/verify/{provider}`.
- Per-IP rate limiting on verification and download endpoints (Bucket4j).
- HMAC-signed, short-lived CDN download URLs.
- Web3j for on-chain NFT verification.

## Quick Start

```bash
# 1. Generate required secrets:
export LICENSE_SECRET_KEY=$(openssl rand -base64 32)
export BUNDLE_SIGNING_KEY=$(openssl rand -base64 48)
export JWT_SECRET_KEY=$(openssl rand -base64 48)

# 2. (Optional for local dev) bypass Microsoft live verification:
export MICROSOFT_DEV_MODE=true

# 3. Run
./mvnw spring-boot:run
```

The app refuses to start if `BUNDLE_SIGNING_KEY` or `JWT_SECRET_KEY` is missing or
obviously a placeholder.

## API Endpoints

Verification is plugin-based: each storefront/wallet implements `OwnershipProvider`
and is reachable at `POST /api/verify/{provider}`. New platforms drop in as a
single `@Service` class — no controller changes required.

### List registered providers
```http
GET /api/verify/providers
→ [{ "key": "steam", "displayName": "Steam" },
   { "key": "nft", "displayName": "Ethereum NFT" },
   { "key": "microsoft", "displayName": "Microsoft Store" }]
```

### Verify Steam Ownership + Get License
```http
POST /api/verify/steam
{
  "steamId": "76561198xxxxxxxxx",
  "appId": "YOUR_STEAM_APP_ID",
  "petType": "red_panda"
}
```

### Verify Ethereum NFT Ownership + Get License
```http
POST /api/verify/nft
{
  "walletAddress": "0xYourWallet...",
  "contractAddress": "0xYourNFTContract...",
  "tokenId": "12345",
  "petType": "red_panda"
}
```

### Verify Microsoft Store Entitlement + Get License
```http
POST /api/verify/microsoft
{
  "xstsToken": "<XSTS bearer token>",
  "userHash":  "<Xbox Live user hash>",
  "storeProductId": "9NXXXXXXXXXX",
  "microsoftAccountId": "optional",
  "petType": "red_panda"
}
```

The Microsoft provider calls `collections.mp.microsoft.com/v6.0/collections/query`
and grants ownership iff the response contains the requested product ID with an
active fulfillment. Set `MICROSOFT_DEV_MODE=true` to bypass this in local dev.

### Verify response shape
```jsonc
{
  "status": "success",
  "provider": "steam",
  "license": {                       // encrypted, opaque to client
    "ciphertext": "...",
    "iv": "...",
    "expiresAt": "..."
  },
  "auth": {                          // short-lived JWT for /api/download/**
    "token": "eyJhbGciOiJIUzI1...",
    "tokenType": "Bearer",
    "expiresInSeconds": 1800,
    "expiresAt": "..."
  },
  "pet": { "key": "red_panda", "displayName": "Red Panda" },
  "message": "Steam ownership verified. License issued."
}
```

### Download a pet bundle (requires JWT)
```http
POST /api/download/{petKey}
Authorization: Bearer <auth.token from /api/verify>
Content-Type: application/json

{
  "ciphertext": "<from license.ciphertext>",
  "iv":         "<from license.iv>"
}
→ { "petKey": "red_panda", "downloadUrl": "https://cdn.../red_panda.zip?sig=...",
    "expiresAt": "...", "ttlSeconds": 900, ... }
```
The server verifies, in order: (1) the JWT signature and expiry; (2) the
encrypted license's AES-GCM auth tag; (3) that the license was issued for the
requested pet; (4) that the JWT's `sub` and `pet` claims match the license. It
then returns an HMAC-signed CDN URL valid for 15 minutes.

| Status | Meaning |
|---|---|
| 401 | Missing/invalid JWT, **or** license missing/expired/tampered |
| 403 | Token and license disagree, or were issued for a different pet |
| 429 | Rate limit exceeded — see `Retry-After` header |

## Rate limits

| Path prefix         | Capacity   | Window     |
|---------------------|-----------:|------------|
| `/api/verify/**`    | 10 reqs    | per minute |
| `/api/download/**`  | 30 reqs    | per minute |

Buckets are per-client-IP (trusting `X-Forwarded-For` when present — set
appropriately in a reverse-proxied deploy). Overflow returns
`429 Too Many Requests` with a `Retry-After` header and an RFC 7807
`application/problem+json` body.

## Adding a new platform (plugin)
1. Create a `@Service` that implements `com.enterprisepet.provider.OwnershipProvider`.
2. Return a stable lowercase `key()` (e.g. `"itch"`, `"epic"`, `"gumroad"`).
3. Parse your fields out of the request `Map` and return
   `VerificationResult.granted(ownerId)` or `denied(reason)`.

Spring auto-discovers it; `ProviderRegistry` indexes it on startup and
`POST /api/verify/{your-key}` starts working immediately.

## Security Notes

- Never store master encryption key in client.
- Desktop client should re-verify periodically (recommended: every 60–120 min).
- Required secrets must be set via env (`LICENSE_SECRET_KEY`, `BUNDLE_SIGNING_KEY`,
  `JWT_SECRET_KEY`) — startup fails otherwise.
- For multi-instance deploys, replace the in-memory rate-limit store with
  `bucket4j-redis` so the limit is shared across replicas.
- Use in production with:
  - Real Steam Web API key (currently the Steam check is a stub — see
    `AUDIT.md`).
  - Alchemy / Infura RPC and tighter NFT response parsing (also in
    `AUDIT.md`).
  - PostgreSQL for issued-license tracking + revocation.
  - WAF in front of the rate limiter for L7 abuse signals.

## Next Steps

- Real Steam Web API JSON parsing (replace stub).
- Tighten NFT ownership decode (use `FunctionReturnDecoder` instead of substring match).
- Add hardware-fingerprint binding (`hwid` in license payload + download check).
- Persist issued licenses in Postgres for revocation/audit.
- Deploy to Railway / Render / AWS.
- Connect to PyQt6 frontend.

See `AUDIT.md` for the full punch list.
