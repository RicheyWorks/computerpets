# Native client contract

← [Back to Documentation Index](README.md)

This is the wire contract a native (or third-party) client implements against.
It describes **what the backend already does**. It does not invent endpoints,
NFT collection addresses, or a hardware-fingerprint algorithm. Bundle zip
layout is §8 (`computerpets.bundle/v1`).

| Field | Value |
|-------|--------|
| **Source of truth** | `LicenseService`, `JwtService`, `PetBundleService`, `BundleZipContract`, `VerifyController`, `DownloadController` |
| **Last verified** | 2026-09-22 |

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

Discovery reads (`GET /api/verify/providers`, `GET /api/verify/nft/collections`,
`/api/pets/**`, `GET /api/bundles/{petKey}`) stay unauthenticated.
`POST /api/verify/{provider}` requires a machine HMAC
([ADR 0070](adr/0070-machine-request-signature.md)). It does not take a
license JWT — the license does not exist yet. The living desk does not
call this route.
`POST /api/download/**` requires `Authorization: Bearer <jwt>` from that
issuance and does **not** require the machine HMAC. The house `/admin`
ledger signs with `ADMIN_API_KEY` ([ADR 0071](adr/0071-admin-request-signature.md)), not this handshake.

Rate limits (per client IP, Redis-backed, shared across app instances):
**10/min** on `/api/verify/`, **30/min** on `/api/download/`, **60/min**
on `/api/pets` (list, by-rarity, and detail share one discovery bucket),
**60/min** on `GET /api/bundles/{petKey}` catalog reads (own `bundles`
bucket). Exceeding them returns **429** with `Retry-After` and
`application/problem+json`. If Redis is unreachable the server fail-closes
with **503** (same media type and `Retry-After`) instead of lifting the
limit ([ADR 0068](adr/0068-discovery-rate-limit.md),
[ADR 0069](adr/0069-bundle-catalog-rate-limit.md)).
`GET /api/bundles/{petKey}/redeem` is not on the catalog bucket.
Client IP uses
`remoteAddr` unless the peer matches `trusted-proxies.cidrs`, in which
case the first `X-Forwarded-For` hop (else RFC 7239 `Forwarded` `for=`)
is used ([ADR 0067](adr/0067-trusted-proxy-client-address.md)).

---

## 2. Verify and issue

`POST /api/verify/{provider}`

Machine clients sign the exact raw body. Headers:

| Header | Value |
|--------|--------|
| `X-ComputerPets-Timestamp` | Unix seconds |
| `X-ComputerPets-Nonce` | 16–128 chars of `[A-Za-z0-9_-]`, single-use |
| `X-ComputerPets-Signature` | HMAC-SHA256, Base64 URL, no padding |

Canonical UTF-8 text, newline-separated:

```
computerpets-machine-v1
POST
/api/verify/{provider}
{raw query or empty}
{timestamp}
{nonce}
{lowercase hex SHA-256 of the body}
```

The HMAC key is the UTF-8 bytes of `LICENSE_SECRET_KEY` (the same string
the client uses to decrypt). `LICENSE_SECRET_KEY_PREVIOUS` verifies during
rotation; clients sign with the current key. Skew is **300 seconds**.
The nonce is claimed once for that window ([ADR 0072](adr/0072-signed-request-nonce.md)).
Missing, skewed, bad, or replayed MAC → **401** `application/problem+json`.
Nonce store down → **503**. The provider is not called. This is not
`BUNDLE_SIGNING_KEY` and not the JWT secret.

`{provider}` is one of the keys from `GET /api/verify/providers`
(currently `steam`, `nft`, `microsoft`, `itch`, `epic`).

Body is a flat JSON object of strings. Provider-specific fields plus:

| Field | Required | Meaning |
|-------|----------|---------|
| `petType` | no | Catalog key (e.g. `red_panda`). Default `red_panda` if omitted/blank **and** the provider does not return its own pet key. |
| `hwid` | no | Opaque device binding. See [§5](#5-hardware-id-hwid). |

Provider fields are fail-closed on **max length and allowed charset** before any RestClient / RPC call ([ADR 0066](adr/0066-provider-verify-field-bounds.md)). Bad shape is **400**, not a silent truncate and not a fake ownership deny. Steam: numeric `steamId` / `appId`. Itch: numeric `gameId` plus download-key charset. Epic: 32-hex `accountId`, catalog-token sandbox/item, letter `platform`. Microsoft: printable XSTS / alphanumeric product id (optional hash, account, signature, store id, sku bounded). NFT: checksum addresses, decimal `tokenId`, bounded printable `message` and 65-byte hex `signature`.

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
| 400 | Unknown `petType`, `hwid` longer than 128 characters, or provider field fails length/charset (before any outbound store call; [ADR 0066](adr/0066-provider-verify-field-bounds.md)) |
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
`LICENSE_SECRET_KEY` the server uses. During an AES rotation window the
client may also hold `LICENSE_SECRET_KEY_PREVIOUS` so sealed licenses
issued under the old key still open locally ([ADR 0065](adr/0065-secret-rotation-cadence-and-hsm.md)).
Download does **not** require local decrypt — you can POST the opaque
`ciphertext` + `iv` back unchanged (the backend dual-decrypts).

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
| `jti` | UUID minted with the bearer. Not the license `jti` |
| `iat` / `exp` | issued-at / expiry |
| Default TTL | 30 minutes (`jwt.ttl-minutes`) |

The JWT signing key is the **UTF-8 bytes of `JWT_SECRET_KEY`**, not a
Base64 decode of that string. Clients do not need the JWT secret — they
only replay the token. They do not send `jti` as its own header or body
field. Download cross-checks `sub` and `pet` against the decrypted
license (403 `auth token does not match license` on mismatch).

A missing or invalid Bearer on `/api/download/**` is rejected by Spring
Security (401 or 403) before the license is examined. A bearer with no
`jti` is **401** `download token has no jti`. The first successful
download claims `download:jwt:{jti}` for `jwt.ttl-minutes` plus 60
seconds ([ADR 0073](adr/0073-download-jwt-single-use.md)). A second mint
with that same bearer is **409** `download token already used`. Verify
again for a new token. A pet, hwid, or owner mismatch does not spend it.

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

The ComputerPets overlay and blotter choose that string as follows. The
server still does not hash, and it still requires an exact match.

- They read a named operating-system id only when `hwid.txt` in the
  user-data directory is missing and a bind is needed (verify, or a
  download of a license that already has `hwid`). License status does
  not perform that read.
- Linux reads `/etc/machine-id`, then `/var/lib/dbus/machine-id`.
  Windows reads `HKLM\SOFTWARE\Microsoft\Cryptography\MachineGuid`.
  Mac reads `IOPlatformUUID`. If that read fails, the client does not
  mint a mark until the keeper says yes. That yes hashes the computer
  name. A computer with no name gets a random id. A rename changes the
  computer-name hash. Deleting `hwid.txt` makes a random id a different
  mark. A file that is already stored is sent as-is.
- The stored and sent string is the hex SHA-256 of
  `computerpets:` + platform token + `:` + that id. The raw id is not
  sent. A non-empty `hwid.txt` is sent as-is and is not rewritten, so a
  license already bound to that string stays bound.
- The hash is still a stable fingerprint of the computer. Hashing is
  not anonymity. The browser desk does not read a machine id and does
  not post a license hash.
- Before that hash is posted, the unlock screen names the backend host.
  The line says this computer's network address goes with the https
  request to that host, as any client. A backend on this computer
  (`127.0.0.1`, `localhost`, or `::1`) does not send the hash off the
  machine. Opening the house does not post it. The path, the query, and
  the fragment stay off the line.
- Before the signed bundle GET leaves, the unlock screen names the CDN
  host. The line says this computer's network address goes with the https
  request to that host, as any client. The path, the query, the fragment,
  and any userinfo stay off the line. The license hash is not on that GET.
  A CDN on this computer (`127.0.0.1`, `localhost`, or `::1`), or a
  `file:` URL, does not leave the machine. Opening the house does not
  fetch it.
- Before an unbound download POST leaves, the unlock screen names the
  backend host. The line says this download talks to that host, and that
  this computer's network address goes with the https request, as any
  client. The license hash is not on that POST. A backend on this computer
  (`127.0.0.1`, `localhost`, or `::1`) stays on this computer. Opening the
  house does not post it. The path, the query, the fragment, and any
  userinfo stay off the line.

- Before a news RSS, a market quote, or a Radio Find leaves the desktop
  main process, the payload carries the painted line that names that host.
  A missing line does not fetch. Find and Local share the radio line.
  A loopback read stays on this computer. Opening the house does not fetch
  them. The path, the query, and the fragment stay off the line.

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
  "downloadUrl": "https://cdn.enterprisepet.example/bundles/red_panda.zip?pet=red_panda&owner=76561198000000000&jti=3f2a0c1e-9b44-4d1a-8c2e-7a1b0d5e6f80&exp=1755411300&sig=...",
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
published → `{ "artifacts": [] }`. This read is **60/min** per client IP
([ADR 0069](adr/0069-bundle-catalog-rate-limit.md)): over the budget is
**429**, and an unreachable rate-limit store is **503**. That budget does
not apply to signed redeem.

Unknown `petKey` values, placeholder / short / non-hex `sha256`, and
duplicate `petKey`+`platform` rows fail process startup. The house
prefers a refused boot over a typo that ships.

A successful download sets `IssuedLicense.lastUsedAt` (audit) and registers a
one-time download grant for that `jti`+`exp`, bound to the requesting client
address. See §7.

An unbound body omits `hwid`. That POST still shows this computer's network
address to the backend host. The overlay and the blotter name that host
before the POST leaves, and the session refuses the POST when that line is
missing. The line says this download talks to that host. It does not say a
hash is sent. A backend on this computer stays local. Opening the house
does not post it. The signed query on the later bundle GET is a different
request.

| Status | `error` |
|--------|---------|
| 400 | `unknown petType` |
| 401 | `license missing, expired, or tampered` (also revoked / unknown license `jti`) |
| 401 | `download token has no jti` / `download token jti invalid` |
| 403 | `license is not valid for the requested pet` |
| 403 | `hardware binding mismatch` |
| 403 | `auth token does not match license` |
| 409 | `download token already used` |
| 503 | `download token store unavailable` |

The keeper side refuses before any POST when `license.json` holds no issued
license (never unlocked, or Lock cleared it). Both the overlay
(`desktop/license/session.cjs`) and the blotter
(`client/computerpets_client/license/session.py`) raise LicenseError
`no_license` with one plain sentence: "No license on this computer yet. Unlock
a pet first, then download it." Settings and the Unlock dialog show that
sentence. Nothing leaves the computer. The backend's answer to an empty
license is the 401 above, so the outcome matches without the round trip.

---

## 7. Signed download URL

The backend does not serve `.zip` bytes. It returns an HMAC-signed URL
for a CDN / edge worker. The edge calls house redeem (it does **not** need
`BUNDLE_SIGNING_KEY` when redeem is the gate — [ADR 0063](adr/0063-cdn-edge-redeem-verification.md)).

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
{bundle.base-url}/{object-key}?pet={petKey}&owner={url-encoded}&jti={url-encoded}&exp={epoch}&sig={sig}
```

`object-key` is the catalog `path` when a row matches, otherwise
`{petKey}.zip`. The HMAC still signs the pet catalog key (`red_panda`),
not the filename. `pet=` repeats that catalog key so an edge verifier can
call redeem when the object key is a catalog path.

`owner`, `jti`, and `pet` are `application/x-www-form-urlencoded`
(`URLEncoder`, UTF-8). `jti` is in the query string so an edge verifier
can rebuild the exact MAC input (house redeem does that verification).

Default `bundle.base-url` is `https://cdn.enterprisepet.example/bundles`.
When `bundle.catalog` is empty the zip is an opaque object: URL + HMAC only,
no integrity or version claim. When a catalog row is present, the zip must
follow §8 (`computerpets.bundle/v1`) and the outer sha256 must match.

The overlay and the blotter GET that URL only after the screen names the
CDN host. The line says this computer's network address goes with the
https request to that host, as any client. The path, the query, the
fragment, and any userinfo stay off the line. The license hash is not
on that GET. A CDN on this computer, or a `file:` URL, stays local.
Opening the house does not fetch it.

### One-time redeem and IP binding

Before serving bytes, an edge worker (or this backend as download proxy)
calls:

`GET /api/bundles/{petKey}/redeem?owner=...&jti=...&exp=...&sig=...`

`{petKey}` is the catalog pet key (the HMAC input / `pet=` query), not
necessarily the object filename. Unauthenticated — the signature is the
gate. The query fields stay; they are not scrubbed for presence theater.
This path is not charged to the 60/min catalog bucket. Grant issue remains
**30/min** on `POST /api/download/{petKey}`. HMAC, one-time consume, and
IP binding are unchanged.

Reference edge: `deploy/cdn/edge-redeem.js` (Lambda@Edge / Cloudflare Worker).
Missing `HOUSE_API_BASE`, redeem network errors, and non-allow house
statuses fail closed — zip bytes are not served.

The grant is keyed by `jti`+`exp`. First success:

```json
{ "allowed": true, "petKey": "red_panda", "jti": "...", "exp": 1755411300 }
```

| Status | `error` | Keeper hint (API `hint`) |
|--------|---------|--------------------------|
| 200 | — | allowed |
| 400 | `unknown pet type` / `download grant exp invalid` | — |
| 401 | `download signature invalid` | Request a new download. |
| 401 | `download grant expired` | Request a new download. |
| 401 | `download grant unknown` | Request a new download. |
| 403 | `download grant already used` | This download link was already used. Request a new download. |
| 403 | `download grant address mismatch` | Bound to the address that requested it. Shared NAT may look like one address. |
| 503 | `download grant store unavailable` | Retry; bytes are not served when the grant cannot be checked. |

A second redeem of the **same** grant denies. The house does not silently
re-open it. A fresh `POST /api/download/{petKey}` with a **new** bearer
issues a new `exp` and a new grant. The same download JWT cannot mint a
second URL ([ADR 0073](adr/0073-download-jwt-single-use.md)).

IP binding uses the same client-address rule as rate limits: `remoteAddr`,
or — only when the peer is a configured trusted proxy — the first
`X-Forwarded-For` hop (else `Forwarded` `for=`). An edge that calls redeem
must forward the keeper's requesting address and the house must list that
edge's CIDR in `TRUSTED_PROXY_CIDRS`. Shared NAT / CGNAT is a known
limit. Geolocation is not invented.

If the grant store is down at issue time, `POST /api/download` returns
**503** and does not return a signed URL.

---

## 8. Bundle zip contents and update process

Format id: **`computerpets.bundle/v1`**. Shared by `BundleZipContract`,
`desktop/license/bundle-zip.cjs`, and `client/.../bundle_zip.py`.
This is not a storefront and does not invent CDN objects.

### Zip layout

Root must contain `manifest.json`:

```json
{
  "format": "computerpets.bundle/v1",
  "petKey": "red_panda",
  "version": "1.0.0",
  "platform": "win",
  "files": [
    { "path": "sprites/sit/1.png", "sha256": "<64 lowercase hex>" }
  ]
}
```

| Rule | Detail |
|------|--------|
| Manifest fields | Exactly `format`, `petKey`, `version`, `platform`, `files`. Unknown fields refuse (no price / storefront keys). |
| Members | Every non-manifest zip entry appears in `files[]` with matching member sha256. Undeclared members refuse. |
| Paths | Relative only under `sprites/`, `cries/`, or `meta/`. No `..`, absolute paths, or `\`. |
| Sprites | At least one `sprites/` member (house pose frames). |
| Empty catalog | No version/sha256 on the download JSON → opaque fetch; layout is not claimed. |

### Fail-closed accept

After a successful signed CDN GET (or when skipping the GET because the
install is already current):

| Condition | Result |
|-----------|--------|
| No catalog `version` / `sha256` | `opaque` — bytes counted only; not a versioned install |
| `version` without `sha256` | refuse `bundle_sha256_missing` (do not GET / do not keep) |
| Zip digest ≠ catalog `sha256` | refuse `bundle_sha256_mismatch` |
| Bad / missing URL HMAC | refuse `signed_url_invalid` (existing) |
| Layout / member digest / pet / version / platform mismatch | refuse `bundle_zip_invalid` or `bundle_*_mismatch` |
| Local `installedBundle` matches pet + version + sha256 | `current` — CDN GET may be skipped |
| No local install, zip OK | `install` — record `installedBundle` |
| Local differs, zip OK | `replace` — record `installedBundle` |

`installedBundle` is local keeper state (`petKey`, `version`, `platform`,
`sha256`). The backend does not store it. Zip **byte serving** stays on the
CDN; redeem still authorizes.

---

## 9. Advertised care paths

The posters name three paths. Care (hunger, rest, bond) stays on the keeper
machine — the blotter, the living desk, and the overlay. Java does not apply it.

| Method | Path | Status |
|--------|------|--------|
| GET, POST, PUT, PATCH, DELETE | `/pet/feed` | **409** |
| GET, POST, PUT, PATCH, DELETE | `/pet/play` | **409** |
| GET, POST, PUT, PATCH, DELETE | `/pet/rest` | **409** |

Unauthenticated. `Content-Type: application/problem+json`.

```json
{
  "type": "about:blank",
  "title": "Care is local",
  "status": 409,
  "detail": "Care is local. /pet/feed is not a door.",
  "door": "local",
  "performed": false,
  "verb": "feed"
}
```

`performed` is always `false`. A body on POST is ignored. **200 is not returned.**
**401 is not returned** — a missing license is not why feed fails. Other `/pet/*`
paths are not this contract.

`GET /api/public/heartbeat` still reports `care.feed`, `care.play`, and
`care.rest` as `false` and `care.door` as `local`. It does not list these paths.

---

## 10. What this contract does not include

- An overlay protocol beyond the handshake and the published bundle zip layout in §8 (the PyQt blotter in `client/` and the Electron overlay in `desktop/` implement this handshake; they do not add endpoints)
- A live NFT collection address (`ethereum.collections` stays empty until one is deployed)
- A prescribed HWID recipe (MAC, disk serial, …)
- Zip byte serving from this backend (redeem authorizes; the CDN still holds the object)
- Client-side JWT verification (optional; download already checks it)
- A `/metrics/gpu` route. GPU temperature, utilization, memory, and power are desktop-local on the keeper machine (`desktop/gpu-probe.ps1`, `desktop/gpu-probe.sh`, `desktop/gpu-probe-mac.sh`, blotter `gpu.py`). The sparkline is a local history of those `read` samples, not a server series. Spring Boot does not see that GPU. Linux reads nvidia-smi, and when that binary does not print a row it reads amdgpu `gpu_busy_percent` and VRAM sysfs into the same line. A missing file stays unread. i915 and xe render utilization comes from two DRM fdinfo reads when the interval is honest. A rewind, a zero interval, or a missing file stays unread (`INTEL_EMPTY`). Temperature, power, and device VRAM on that line stay unread. There is no upstream used and total pair, so a planted memory_info file, physical_vram_size_bytes, or vram_d3cold_threshold is not copied. RC6 residency, GT idle residency, and frequency are not copied. amdgpu temperature is the hwmon channel labeled edge, and amdgpu power is the hwmon channel labeled PPT. An unlabeled channel stays unread. Mac reads IOAccelerator PerformanceStatistics and stays unread when `ioreg` is missing or the dictionary has no accepted field. Mac temperature and power stay unread. A planted temperature or power key, including a zero, is not copied. powermetrics is not called. IOReport and AppleSMC are not read. The browser has no sensor, so its strip stays empty.
- A route that returns a mind API key. The keeper card may name who is listening. It does not receive the key. Guests stay on house lines.
- A presence file API. Guests, gifts, and place marks do not read or write the keeper's files. A dropped file is not opened. Clipboard read, screen capture, keyboard lock, and the File System Access API stay denied. Overlay card and mind prefs stay `card.json` and `mind.json` under the app user-data directory. A plugin key is not stored in plain text in `mind.json`. The desk `/mind` page does not keep that key in localStorage or sessionStorage. An overlay Gemini call does not put that key on the query string. A pasted `key` or `api_key` query is dropped before that call. A model value cannot add a query to the Gemini path. A pasted secret in the model field is not stored. A normal model id stays. Desk talk drops that same query from the base URL before the post. The listener read drops that same query from the saved base URL before it posts. Desk mind prefs drop it on save and on read. `mind.json` and the overlay browser copy of mind prefs drop that same query on save and on read. A leftover dirty base URL in `mind.json` is rewritten without a seal rewrite. Listing Desktop, Documents, Downloads, or any other host folder is not this contract. Window titles, document names, and host paths are not returned. A window class is not read. The taskbar and the desktop host are known shell handles. A path is omitted unless the keeper has already consented. A keystroke log is not this contract. Typing in a focused field stays in that field. A key outside it is not returned. A standing geolocation grant is not this contract. The weather control may ask once, then the session permission closes. That click says it sends a place to the forecast host. When no typed area is saved, an in-app yes is required before geolocation, reverse lookup, or the forecast from that locate. Look up of a typed name, and that reverse lookup, name this computer's network address on the https request to the geocode host before they leave. They do not run on load. A live fix is rounded to a tenth of a degree before it leaves. A stored live pin is rounded to that tenth on load. A saved live pin does not open a forecast until the keeper says to use that place. That yes sticks for the pin and does not locate again. A saved typed area is kept and does not start a new locate. A typed city still goes to the forecast host. Electron 35 cannot revoke a Chromium origin grant; after the locate yes, that grant can still answer without a new browser prompt. A later locate in the same session waits for a fresh in-app yes. A timer or opening the weather panel does not call `getCurrentPosition`. A prior browser allow can still satisfy that next locate without a new OS or browser prompt. The house still asks in the app. An IP place lookup is not this contract. A missing fix does not ask a network city. The blotter does not read machine location and does not send a place. News RSS and market quotes do not leave on load or while their plate is closed. Opening the plate shows that this computer's network address goes with the https request, then the send leaves. The refresh does that only while the plate stays open. Radio Find waits until the radio form shows that line for the radio host. The blotter does not call a news host, a quote host, or a radio host. A station stream is not this client. Cloud talk and cloud voice name this computer's network address on that host before they leave. A load does not talk or speak to those hosts. House lines, a loopback mind, and on-device speech stay local. The blotter does not call a talk host or a voice host. Unlock and a bound download name the backend host before the license hash leaves. A backend on this computer does not send it. Opening the house does not post it. A signed bundle GET names the CDN host before it leaves. The license hash is not on that GET. Opening the house does not fetch it. An unbound download POST names the backend host before it leaves. The license hash is not on that POST. Opening the house does not post that download. The unlock hash POST, a bound hash POST, an unbound download POST, and the signed bundle GET leave only inside the refusing wrapper for that host line. A missing or wrong-host line does not post, does not GET, does not read the operating-system id, does not write hwid.txt, and does not say can't reach. A loopback backend or CDN stays on this computer. News RSS, market quotes, and Radio Find do not leave the main process until the painted line for that host is on the IPC payload. A missing line does not fetch. Find and Local share the radio line. A loopback read stays on this computer. Opening the house does not fetch them.

Admin revocation (`POST /api/admin/revoke`) and license audit
(`GET /api/admin/licenses`, `GET /api/admin/licenses/{jti}`) are operator
APIs, not part of the client handshake. They require the admin request HMAC and a single-use nonce
([ADR 0071](adr/0071-admin-request-signature.md), [ADR 0072](adr/0072-signed-request-nonce.md)).
The house `/admin` page signs with the same key. Operator curl is in [SETUP.md](SETUP.md).
