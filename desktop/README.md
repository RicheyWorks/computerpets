# Desktop companion — Windows and Mac

All one hundred thirty living kinds live on the real desktop as a Tamagotchi-grade overlay — including ten snakes, a tide of ten sea creatures, a garden of ten plants, a hive of ten insects plus ten bees and comb, a pond of ten Animalia, a roost of ten birds, a corner of ten arachnids and their neighbors, a cellar of ten fungi, a well of ten leftovers, and a far den of ten guests that never evolved here. They turn, ease, and settle on the work-area floor, then do what that animal does — scratch, preen, bask, flick a tongue, lean to the lamp, waggle, hop, or puff. Unique hunger clocks, night cycles, mess, illness, age, and a special move each. The tide den at `/sea` is where the marine guests are taught. The garden den at `/garden` is ten plants on the blotter; plaques teach. The hive den at `/hive` keeps bees and comb; plaques teach. The pond den at `/pond` is ten Animalia on the blotter; plaques teach. The roost den at `/roost` is ten birds on the blotter; plaques teach. The corner at `/corner` is ten arachnids and their neighbors on the blotter; plaques teach. A harvestman is not a spider. The cellar den at `/cellar` is ten fungi on the blotter; plaques teach. The well at `/well` is ten leftovers on the blotter; plaques teach. The far den at `/far` is ten guests that never evolved here; plaques teach.

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
| `COMPUTERPETS_BACKEND_URL` | yes* | Backend origin, no trailing slash. Default `http://127.0.0.1:8081` if unset. |
| `LICENSE_SECRET_KEY` | yes | Same 32-byte standard Base64 key the backend uses. Needed to decrypt the issued license locally. |
| `BUNDLE_SIGNING_KEY` | no | If set, the overlay also checks the CDN URL HMAC. Download still works without it — the backend already signed the URL. |

`ENTERPRISEPET_BACKEND_URL` is accepted as an alias for the backend origin.

```bash
export COMPUTERPETS_BACKEND_URL=http://127.0.0.1:8081
export LICENSE_SECRET_KEY=   # same value as the backend process
cd desktop
npm install
npm start
```

```bash
npm test
```

\* If the default origin is down, unlock fails closed (unreachable backend). Do not invent a live NFT collection address; this overlay does not add Solana. The PyQt blotter is a separate tree (`client/`) and speaks the same contract.

## Package

```bash
npm run dist:win
npm run dist:mac
```
