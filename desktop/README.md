# Desktop companion — Windows, Mac, and Linux

First-time Windows keepers: [How to get your first pet](../docs/START-HERE.md). That page puts Rui on the real desktop. This page is the grown-up overlay note.

`npm start` is `electron .`. There is no Microsoft Store listing and no live Store ID. `npm run dist:win` is electron-builder (NSIS / portable) for a copy you build yourself — not a published download.

All two hundred twenty living kinds live on the real desktop as a Tamagotchi-grade overlay — including ten snakes, a tide of ten sea creatures, a garden of ten plants, a hive of ten insects plus ten bees and comb, a pond of ten Animalia, a roost of ten birds, a corner of ten arachnids and their neighbors, a wood of ten wild mammals, a canopy of ten tree mammals, a stone of ten more reptiles, a creek of ten more fish, a log of ten litter guests, a shore of ten strand guests, a reef of ten living-rock guests, a meadow of ten grass-and-night insects, a cellar of ten fungi, a well of ten leftovers, a far den of ten guests that never evolved here, and a grid of ten cyber dragons. They turn, ease, and settle on the work-area floor, then do what that animal does — scratch, preen, bask, flick a tongue, lean to the lamp, waggle, hop, or puff. Unique hunger clocks, night cycles, mess, illness, age, and a special move each. The tide den at `/sea` is where the marine guests are taught. The garden den at `/garden` is ten plants on the blotter; plaques teach. The hive den at `/hive` keeps bees and comb; plaques teach. The pond den at `/pond` is ten Animalia on the blotter; plaques teach. The roost den at `/roost` is ten birds on the blotter; plaques teach. The corner at `/corner` is ten arachnids and their neighbors on the blotter; plaques teach. A harvestman is not a spider. The wood at `/wood` is ten wild mammals on the blotter; plaques teach. The canopy at `/canopy` is ten more mammals of the trees on the same wood; plaques teach. A sloth is not a red panda. A koala is not a bear. The stone at `/stone` is ten more reptiles on the blotter; plaques teach. A tuatara is not a lizard. An alligator is not a crocodile. A bat is not a bird. A porcupine is not Burr. The creek at `/creek` is ten more freshwater fish on the blotter; plaques teach. A bass is not a trout. A lamprey is not an eel. The log at `/log` is ten litter guests on the blotter; plaques teach. A millipede is not a centipede. A pillbug is not an insect. The shore at `/shore` is ten guests of the strand on the blotter; plaques teach. A fiddler is not a hermit. A ghost crab is not a horseshoe crab. The reef at `/reef` is ten guests of the living rock on the same wood; plaques teach. A coral is not a plant. An anemone is not a jelly. The meadow at `/meadow` is ten insects of the grass and the night song on the blotter; plaques teach. A cricket is not a cicada. A katydid is not a grasshopper. The cellar den at `/cellar` is ten fungi on the blotter; plaques teach. The well at `/well` is ten leftovers on the blotter; plaques teach. The far den at `/far` is ten guests that never evolved here; plaques teach. The grid at `/grid` is ten cyber dragons; plaques teach.

On Windows the tray sits by the clock. A click toggles the window. The floor sits the work area under the cursor, above the taskbar. Empty glass click-throughs. Hits stay on the pet, the keeper card (collapse and verbs stay `data-hit`), treats, gifts, and the choice sheet. Visible top-level window bounds (work-area space, not pixels) are pushed on a calm tick so Rui can jump onto a window side, cling, then drop or dive. Arc jumps onto the title-bar ridge, holds, then hops or slides off. Volt wraps a window corner, holds, then uncoils off. Trace follows the window outline as a path, then hops or drops off. Other guests walk a sill. Mac and Linux window play is a later door (`mac-linux-window-play`). Click the animal to open the keeper card. Collapse hides it completely so speech stays readable. The expanded card is a desk control: volume, color, house-voice style, saved lines, alarm, timer, mutes, footsteps, Rui's free music + Radio station type-in, Call (any of the 220, or a den), Call Sip, and Turn off. Weather area and news plates sit the desk. Called guests walk and stay. Sip flies and stays. The ribbon is house speech only — no Windows toast. Turn off quits. Start again with `.\desktop.ps1`. The tray can pick Rui, Sip, and the grid ten. A tap is a choice. A drag is a carry. A right-click tends. First click is a sit. This is still Chromium compositing, not DirectX 12.

On a Mac the extra sits in the menu bar. A click opens care. It does not hide the desk. The floor sits under the menu bar and above the dock. They walk every Space. A tap is a choice. A drag is a carry. Control-click tends. First click is a sit.

On Linux the mark sits in the panel. A click opens care. It does not hide the desk. The floor sits in the work area, beside the panel and above the dock. They walk every workspace. A tap is a choice. A drag is a carry. A right-click tends. First click is a sit. The overlay is a toolbar.

## Care

A tap on the guest is a choice. They pick Rest, Walk or Sit, Talk, Treat, Play, Special, Hide or Call back, or Pick if a gift sits. Right-click or use the tray / the extra / the mark for the full care list:

- Feed, treat (species snack), play (chase a ribbon), rest, talk
- Hide — they walk off the screen. Call back — they walk in.
- Clean (click droppings on the floor too)
- Bath, medicine, praise
- Call back if they hide
- Special — the same species trick the desk already keeps (Ridge sits, Chirp sings, Wave waves…)

They grow: hatchling → grown (day 1) → elder (day 7). Neglect them and they vanish until you call. Phoenix can burn out and come back kinder. Comb keeps brood and stores. Neglect can go quiet.

## Run

```bash
cd desktop
npm install
npm start
```

Windows: `..\desktop.ps1`  
Mac and Linux: `sh ../desktop.sh`

Windows toasts use the tray identity `works.richey.computerpets.desk`. The overlay sits the Windows 10/11 work area under the cursor, across DPI and monitor changes. Empty glass click-throughs; the tray watches the cursor against hit rects because DWM layered glass does not reliably forward a hover. First click is a sit, not a focus steal. The tray can pick Rui, Sip, and the grid ten without scrolling two hundred twenty names. The overlay asks main for `desktop/renderer/roster.json` through preload IPC — a sandboxed `file://` fetch is not a door. Spark stays `spark_dragon` / `/demo/crackle`. This is still Chromium compositing, not DirectX 12 or Vulkan. On a Mac the extra is a template mark, the overlay is a panel, and the floor follows the desk under the cursor. On Linux the mark is a StatusNotifier sit, the overlay is a toolbar, and the floor follows the desk under the cursor.

## Unlock (client contract)

The overlay pets already live on the desk without a license. Unlock talks to a running house backend using the published [client contract](../docs/CLIENT-CONTRACT.md): `POST /api/verify/steam`, AES-256-GCM decrypt (no KDF), device `hwid` on verify and download, then `POST /api/download/{pet}` and GET of the HMAC-signed URL (`petKey|owner|jti|exp`).

There is no “always licensed” stub. Bad ciphertext, an expired payload, a revoked `jti`, a hardware mismatch, or a missing backend all fail closed.

Tray / Extra / Mark / House window → **Unlock…**. Steam is the first real provider shape (`steamId`, `appId`, `petType`, `hwid`).

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
npm run dist:linux
```
