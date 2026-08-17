# Desktop companion — Windows and Mac

All thirty pets live on the real desktop as a Tamagotchi-grade overlay — including ten snakes. Unique hunger clocks, night cycles, mess, illness, age, and a special move each.

## Care

Right-click the pet or use the tray / menu bar:

- Feed, treat (species snack), play (chase a ribbon), rest, talk
- Hide — they walk off the screen. Call back — they walk in.
- Clean (click droppings on the floor too)
- Bath, medicine, praise
- Call back if they hide
- Special — species trick (coil, play dead, drape, thread, steal ribbon…)

They grow: hatchling → grown (day 1) → elder (day 7). Neglect them and they vanish until you call. Phoenix can burn out and come back kinder.

## Run

```bash
cd desktop
npm install
npm start
```

Windows: `..\desktop.ps1`  
Mac: `sh ../desktop.sh`

Windows toasts use the tray identity `works.richey.computerpets.desk`. The overlay tracks the work area across DPI and monitor changes.

## Unlock (client contract)

The overlay pets already live on the desk without a license. Unlock talks to a running house backend using the published [client contract](../docs/CLIENT-CONTRACT.md): `POST /api/verify/steam`, AES-256-GCM decrypt (no KDF), device `hwid` on verify and download, then `POST /api/download/{pet}` and GET of the HMAC-signed URL (`petKey|owner|jti|exp`).

There is no “always licensed” stub. Bad ciphertext, an expired payload, a revoked `jti`, a hardware mismatch, or a missing backend all fail closed.

Tray / House window → **Unlock…**. Steam is the first real provider shape (`steamId`, `appId`, `petType`, `hwid`).

| Variable | Required | Meaning |
|----------|----------|---------|
| `COMPUTERPETS_BACKEND_URL` | yes* | Backend origin, no trailing slash. Default `http://127.0.0.1:8080` if unset. |
| `LICENSE_SECRET_KEY` | yes | Same 32-byte standard Base64 key the backend uses. Needed to decrypt the issued license locally. |
| `BUNDLE_SIGNING_KEY` | no | If set, the overlay also checks the CDN URL HMAC. Download still works without it — the backend already signed the URL. |

`ENTERPRISEPET_BACKEND_URL` is accepted as an alias for the backend origin.

```bash
export COMPUTERPETS_BACKEND_URL=http://127.0.0.1:8080
export LICENSE_SECRET_KEY=   # same value as the backend process
cd desktop
npm install
npm start
```

```bash
npm test
```

\* If the default origin is down, unlock fails closed (unreachable backend). Do not invent a live NFT collection address; this slice does not add Solana or a PyQt client.

## Package

```bash
npm run dist:win
npm run dist:mac
```
