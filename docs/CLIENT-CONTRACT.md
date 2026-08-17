# Native client contract

← [Back to Documentation Index](README.md)

This is the wire contract a native (or third-party) client implements against.
It describes **what the backend already does**. It does not invent endpoints,
bundle zip layouts, NFT collection addresses, or a hardware-fingerprint algorithm.

| Field | Value |
|-------|--------|
| **Source of truth** | `LicenseService`, `JwtService`, `PetBundleService`, `VerifyController`, `DownloadController` |
| **Last verified** | 2026-08-17 |

---

## 1. End-to-end flow

```
GET  /api/verify/providers
GET  /api/bundles/{petKey}      →  catalog rows (may be empty)
POST /api/verify/{provider}     →  encrypted license + JWT
POST /api/download/{petKey}     →  signed CDN URL  (Bearer JWT required)
GET  {downloadUrl}              →  pet .zip bytes (CDN / edge, not this service)
```

The encrypted license is the durable entitlement. The JWT only proves the
caller recently passed verify. The signed URL is a 15-minute fetch ticket.

Discovery endpoints (`/api/verify/**`, `/api/pets/**`, `/api/bundles/**`) are unauthenticated.
`POST /api/download/**` requires `Authorization: Bearer <jwt>`.

Rate limits (per client IP, Redis-backed, shared across app instances):
**10/min** on `/api/verify/`, **30/min** on `/api/download/`. Exceeding
them returns **429** with `Retry-After` and `application/problem+json`.
If Redis is unreachable the server fail-closes with **503** (same media
type and `Retry-After`) instead of lifting the limit.

---

## 2. Verify and issue

`POST /api/verify/{provider}`

`{provider}` is one of the keys from `GET /api/verify/providers`
(currently `steam`, `nft`, `microsoft`, `itch`, `epic`).

Body is a flat JSON object of strings. Provider-specific fields plus:

| Field | Required | Meaning |
|-------|----------|---------|
| `petType` | no | Catalog key (e.g. `red_panda`). Default `red_panda` if omitted/blank **and** the provider does not return its own pet key. |
| `hwid` | no | Opaque device binding. See [§5](#5-hardware-id-hwid). |

Itch.io (`itch`) also requires `gameId` (numeric) and `downloadKey` (the
purchase receipt). A placeholder `ITCH_API_KEY` fails closed.

Epic Games Store (`epic`) requires `accountId` (32-char Epic Account ID),
`sandboxId`, and `catalogItemId`. The server exchanges
`EPIC_CLIENT_ID` / `EPIC_CLIENT_SECRET` / `EPIC_DEPLOYMENT_ID` for a
client-credentials token, then calls Ecom v3 ownership. Placeholders
fail closed. Do not invent a live sandbox or catalog item id.

**200** — ownership verified, license issued (365 days):

```json
{
  "status": "success",
  "provider": "steam",
  "license": {
    "ciphertext": "<standard base64>",
    "iv": "<standard base64>",
    "expiresAt": "2027-08-17T05:15:00.123456789Z"
  },
  "auth": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "expiresInSeconds": 1800,
    "expiresAt": "2026-08-17T05:45:00Z"
  },
  "pet": { "key": "red_panda", "displayName": "Red Panda" },
  "message": "Steam ownership verified. License issued."
}
```

Store `license.ciphertext`, `license.iv`, and `auth.token`. Treat the
ciphertext as opaque until you decrypt it (or just send it back on download).

| Status | When |
|--------|------|
| 400 | Unknown `petType`, or `hwid` longer than 128 characters |
| 403 | Provider denied ownership |
| 404 | Unknown provider (`validProviders` lists the keys) |
| 502 | Upstream provider call failed |

License lifetime is **365 days** from issuance (`VerifyController.LICENSE_DAYS`).
`license.expiresAt` is ISO-8601 (`Instant.toString()`).

---

## 3. Decrypt the license

There is **no key-derivation function**. `LICENSE_SECRET_KEY` is
standard Base64 of **exactly 32 bytes** and is used directly as the AES-256 key.

A client that decrypts locally must be provisioned with the same
`LICENSE_SECRET_KEY` the server uses. Download does **not** require local
decrypt — you can POST the opaque `ciphertext` + `iv` back unchanged.

| Parameter | Value |
|-----------|--------|
| Algorithm | AES-256-GCM (AEAD) |
| Key | `Base64.decode(LICENSE_SECRET_KEY)` — 32 bytes, no KDF, no salt |
| IV / nonce | 12 bytes, **not** prepended to the ciphertext; sent as `license.iv` |
| Tag | 128 bits (16 bytes), **appended** to the ciphertext (BouncyCastle `GCMBlockCipher` / standard AES-GCM wire form) |
| AAD | none |
| Encoding | RFC 4648 standard Base64 (not URL-safe) for both `ciphertext` and `iv` |
| Plaintext | UTF-8 JSON |

`ciphertext` = `Base64( AES-GCM-ciphertext ‖ 16-byte tag )`.

Server construction uses BouncyCastle 1.78+ factory methods
(`GCMBlockCipher.newInstance(AESEngine.newInstance())`). That is
construction only — IV, tag, AAD, and encoding are unchanged.

Any AES-GCM implementation that accepts a 12-byte IV and a 128-bit tag
(OpenSSL, libsodium, WebCrypto, `javax.crypto` `AES/GCM/NoPadding`) can
decrypt this. Tampering with ciphertext, IV, or tag fails authentication.

### 3.1 Plaintext fields

Jackson serialization of `LicenseService.LicensePayload`:

| Field | Type | Notes |
|-------|------|--------|
| `jti` | string | UUID issued at verify. Primary key for revocation. |
| `owner` | string | Provider owner id (SteamID, wallet, Microsoft hash, `itch:{userId}`, `epic:{accountId}`, …). |
| `pet` | string | Catalog key the license is valid for. |
| `validUntil` | string | ISO-8601 instant (`Instant.toString()`). |
| `issuedAt` | string | ISO-8601 instant. |
| `hwid` | string or `null` | Present when verify received a non-blank `hwid`; otherwise JSON `null`. |

Example:

```json
{
  "jti": "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80",
  "owner": "76561198000000000",
  "pet": "red_panda",
  "validUntil": "2027-08-17T05:15:00.123456789Z",
  "issuedAt": "2026-08-17T05:15:00.123456789Z",
  "hwid": "device-abc-123"
}
```

Server-side `LicenseService.validate` also rejects the license when
`validUntil` is in the past, the `jti` is on the shared Redis deny-list,
the `jti` is missing from the database, or `revokedAt` is set.

Check order after decrypt + expiry: **Redis deny-list, then Postgres**.
Redis is a fast replica-wide deny (`revoked:jti:{jti}`); Postgres
`IssuedLicense.revokedAt` is the ledger. A replica that has not seen the
row still returns the same 401. If Redis is unreachable, validate falls
back to Postgres — it does not accept a revoked license. (HTTP
`/api/download` may still 503 from the rate-limit filter when Redis is
down.)

A client decrypting locally only learns the payload;
**revocation is enforced on `/api/download`**, not by decrypt alone.

---

## 4. JWT

Issued with the license. Send it as:

```
Authorization: Bearer <auth.token>
```

| Parameter | Value |
|-----------|--------|
| Algorithm | HS256 |
| Issuer (`iss`) | `enterprisepet-backend` (`jwt.issuer`) |
| Subject (`sub`) | owner id |
| `pet` | pet catalog key |
| `prv` | provider key (`steam`, `nft`, `microsoft`, `itch`, `epic`) |
| `iat` / `exp` | issued-at / expiry |
| Default TTL | 30 minutes (`jwt.ttl-minutes`) |

The JWT signing key is the **UTF-8 bytes of `JWT_SECRET_KEY`**, not a
Base64 decode of that string. Clients do not need the JWT secret — they
only replay the token. Download cross-checks `sub` and `pet` against the
decrypted license (403 `auth token does not match license` on mismatch).

A missing or invalid Bearer on `/api/download/**` is rejected by Spring
Security (401 or 403) before the license is examined.

---

## 5. Hardware ID (`hwid`)

The backend does **not** define a fingerprint algorithm. `hwid` is an
opaque string the client chooses and must reproduce.

Rules already enforced in code:

1. **Optional.** Omit `hwid` (or send blank) on verify → license is **unbound**.
   Download then ignores any `hwid` in the body.
2. **Bound at issue time.** A non-blank verify `hwid` is stored on
   `IssuedLicense` and inside the encrypted payload.
3. **Exact match on download.** If the payload `hwid` is non-blank, the
   download body **must** include the same string (`String.equals`).
   Missing or different → **403** `{ "error": "hardware binding mismatch",
   "hint": "This license is bound to a specific device" }`.
4. **Length.** Persisted as `VARCHAR(128)`. Verify rejects `hwid` longer
   than 128 characters with **400** `{ "error": "hwid too long", "maxLength": 128 }`.
5. **Case-sensitive.** No normalization, hashing, or prefix matching.

Recommended client practice (not enforced): a stable per-machine id that
fits in 128 characters, sent on both verify and download.

---

## 6. Download

`POST /api/download/{petKey}`

Headers: `Authorization: Bearer <jwt>`  
Body:

```json
{
  "ciphertext": "<from verify license.ciphertext>",
  "iv": "<from verify license.iv>",
  "hwid": "<same string as verify, only if the license is bound>",
  "platform": "win"
}
```

`{petKey}` must be the licensed pet (and the JWT `pet` claim).
`platform` is optional: `win`, `mac`, `linux`, or `any`. Query
`?platform=` is accepted the same way. Unsupported or omitted values
use `bundle.default-platform` (default `win`).

**200** — signed manifest (this is `PetBundleService.BundleManifest.body`):

```json
{
  "petKey": "red_panda",
  "displayName": "Red Panda",
  "rarity": "COMMON",
  "downloadUrl": "https://cdn.enterprisepet.example/bundles/red_panda.zip?owner=76561198000000000&jti=3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80&exp=1755411300&sig=...",
  "expiresAt": "2026-08-17T05:30:00Z",
  "ttlSeconds": 900,
  "jti": "3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80"
}
```

When `bundle.catalog` has a row for that pet and platform, the same
object also carries `version`, `platform`, `sha256`, and `filename`
(the object key). Those fields are **absent** when the catalog is empty
or no row matches. `sha256` is never invented.

`GET /api/bundles/{petKey}` (unauthenticated, like `/api/pets`) lists
the configured rows. Unknown pet → **404**. Known pet with nothing
published → `{ "artifacts": [] }`.

Unknown `petKey` values, placeholder / short / non-hex `sha256`, and
duplicate `petKey`+`platform` rows fail process startup. The house
prefers a refused boot over a typo that ships.

A successful download sets `IssuedLicense.lastUsedAt`. That is audit only;
the URL is **not** one-time-use.

| Status | `error` |
|--------|---------|
| 400 | `unknown petType` |
| 401 | `license missing, expired, or tampered` (also revoked / unknown `jti`) |
| 403 | `license is not valid for the requested pet` |
| 403 | `hardware binding mismatch` |
| 403 | `auth token does not match license` |

---

## 7. Signed download URL

The backend does not serve `.zip` bytes. It returns an HMAC-signed URL
for a CDN / edge worker that shares `BUNDLE_SIGNING_KEY`.

| Parameter | Value |
|-----------|--------|
| TTL | 15 minutes |
| MAC | HMAC-SHA256 |
| Key | UTF-8 bytes of `BUNDLE_SIGNING_KEY` (not Base64-decoded) |
| Message | `petKey\|owner\|jti\|exp` when `jti` is present; otherwise `petKey\|owner\|exp` |
| `exp` | Unix epoch seconds (UTC) |
| `sig` | Base64 **URL-safe, no padding** of the MAC |

URL shape when the license has a `jti` (always true for licenses issued
by this backend):

```
{bundle.base-url}/{object-key}?owner={url-encoded}&jti={url-encoded}&exp={epoch}&sig={sig}
```

`object-key` is the catalog `path` when a row matches, otherwise
`{petKey}.zip`. The HMAC still signs the pet catalog key (`red_panda`),
not the filename.

`owner` and `jti` are `application/x-www-form-urlencoded`
(`URLEncoder`, UTF-8). `jti` is in the query string so an edge verifier
can rebuild the exact MAC input.

Default `bundle.base-url` is `https://cdn.enterprisepet.example/bundles`.
The zip **contents** are not specified here — only the URL, signature,
and optional catalog metadata.

---

## 8. What this contract does not include

- An overlay protocol or asset pack layout (the PyQt blotter in `client/` and the Electron overlay in `desktop/` implement this handshake; they do not add endpoints)
- Zip **contents** or an update protocol (`bundle.catalog` names version, platform, and sha256 when a row is configured; it does not describe what is inside the zip)
- A live NFT collection address (`ethereum.collections` stays empty until one is deployed)
- A prescribed HWID recipe (MAC, disk serial, …)
- One-time or IP-bound download URLs (jti is in the MAC; replay within 15 minutes is still possible)
- Client-side JWT verification (optional; download already checks it)

Admin revocation (`POST /api/admin/revoke` with `X-Admin-Key`) and license
audit (`GET /api/admin/licenses`, `GET /api/admin/licenses/{jti}`) are
operator APIs, not part of the client handshake. The house `/admin` page
uses the same header.
