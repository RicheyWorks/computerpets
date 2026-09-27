# App inspect harness

Buffffff uses this to **automate and troubleshoot the whole house** — not only care. One entrypoint, real surfaces only, honest gaps for GUI-only and live-network bits.

The care harness is unchanged and still the source of the 18 care actions. This wraps it as the `care` domain inside a broader registry.

## Why this shape

Stolen from Richey’s other repos (architecture, not domain):

| Pattern | From | Here |
|---|---|---|
| Registry of real operations; discover / invoke / assert | CSRBT `HarnessRegistry` + FlowersForever `ConnectorRegistry` | `catalog()` / `invoke()` / `assert_action()` |
| Domains as plugins / suites | CSRBT `tools/verify/` + harness plugins | `care` `guest` `visit` `species` `ethogram` `cry` `gift` `desk` `card` `web` `blotter` `gui` |
| Accounting identity | CSRBT `tools/harness.py` | `discovered == driven + dead + sequenced + hidden + failed + excluded`; `UNACCOUNTED` is a harness bug |
| General oracle | CSRBT | Observable trace + no errors + no `NaN` / `undefined` / `[object Object]` junk — not frozen remembered counts |
| One runner, exit non-zero on fail | CSRBT `tools/verify/run_all.py` | `py -m computerpets_client.app_harness` |
| Dual-mode offline vs live/gui | FlowersForever connectors | Default **offline/headless**. Live + GUI/Electron/Qt are catalogued as `excluded`; opt-in `--live` / `--gui` |
| ControllerIT-style smoke per surface | FlowersForever `*ControllerIT.java` | One `run_domain(domain)` per house surface |

Risk ladder / MCP transports are optional later (CSRBT). CLI is the first transport.

## Run

From `client/` (PowerShell: `py`; use `;` not `&&`):

```powershell
cd client
py -m computerpets_client.app_harness
py -m computerpets_client.app_harness --list
py -m computerpets_client.app_harness --domain care
py -m computerpets_client.app_harness --domain guest --only close exit marks
py -m computerpets_client.app_harness --only care.feed gift.pick
py -m computerpets_client.app_harness --gaps
py -m computerpets_client.app_harness --live
py -m computerpets_client.app_harness --gui
py -m pytest tests/test_app_harness.py tests/test_care_harness.py -q
```

Care-only (unchanged):

```powershell
py -m computerpets_client.care_harness
py -m computerpets_client.care_harness --list
```

## Programmatic API

```python
from computerpets_client.app_harness import (
    catalog, catalog_ids, invoke, assert_action, run_all, run_domain, accounting, gaps,
)

print(catalog_ids(domain="care"))          # ('care.feed', ... 18)
result = invoke("care.feed")               # also invoke("feed")
assert not assert_action("care.feed", result)

results = run_all()                        # every driven surface
ledger = accounting(results)
assert ledger.holds() and ledger.unaccounted == 0

run_domain("guest")
print([g.id for g in gaps()])              # GUI-only / live-network holes
```

Ids are `domain.local`. Bare care ids (`feed`) still resolve for the original harness.

## Domains

| domain | What is driven | Real handlers |
|---|---|---|
| `care` | Existing 18 (feed…exit) | `care_harness` → `life` / `specials` / `shed` |
| `guest` | Tap, marks, every `GUEST_CHOICE` id including **close** / **exit** | `choice.guest_tap` / `guest_marks` / `guest_pick` |
| `visit` | Today's visitor, phase clock, call begin/place/leave, arrive vs tap/place | `visitor.js` / `call-guests.js` / `arrive.js` |
| `species` | Catalog load, lookup, GUESTS.md, sample guests, **portrait jpg for every key** (`species.portraits`) | `species.CATALOG_KEYS` / `species_by_key` / `docs/GUESTS.md` / `web/public/pets/{key}.jpg` |
| `ethogram` | **Catalog-wide** `ethogram.catalog_all` (every key denser `acts_for` + tricks parse smoke); absent tricks (Rui / dragons) excluded | `ethogram.acts_for` / `desktop/renderer/*-tricks.js` |
| `cry` | `prefersHouseCry` parse, pet.js wiring, **`cry.catalog_wavs`** (every prefersHouseCry key has a wav), **stubbed `cry.playback`**, **`cry.decode`** (every cry wav opens, decodes, has a sane rate and length, and is not silence; no speakers) | `card.ts` / `pet.js` / `house-sounds.js` / `desk-house.js` / `harness_smokes.cjs` |
| `gift` | Line, leave, pick, **place coords** (`gift.place`) | `gift.py` + `life.js leaveGift` via `harness_smokes.cjs` |
| `desk` | Weather clock; plate keys; URL builders; **offline resolve**; **recorded-feed replay** (`desk.weather.replay`, `desk.news.replay`, `desk.market.replay`, `desk.nft.replay`, `desk.gpu.replay`: a saved response through the real read, parse, and paint, checked against the words on the plate); **`desk.links.open`** (painted news links go to the keeper's browser through the overlay seal, other schemes are refused, the overlay never navigates or opens a window); **`desk.launch_check`** (the start script checks Node 22+ and npm, reports the pieces state, and installs nothing in check mode); **`desk.tray.switch`** (tray On the desk / Companions / `switch-pet` / Hide the window / Show through the real `main.cjs`); **`desk.quit`** (`quit-desk`, tray Quit, pet-menu Quit; Turn off asks twice); **`desk.market.search`** (`market-search` held / found / unread on a fake fetch); **Favorites** (News/Coins/NFTs/Weather); **news topics/Popular/X**; **quotes add-ticker**; **plate chrome/style**; **plant drag-place**; **OS window perch**; **`desk.presence`** (no Desktop/Documents/Downloads listing, no window title or document name, path omitted without consent, no key log outside a focused field, geolocation only while a weather locate is open, no IP place lookup, a live locate waits for an in-app yes, a later locate in the session waits for a fresh yes, a stored live pin is rounded on load, a saved live pin does not forecast until the keeper says to use that place, a saved typed area does not start a new locate, a license machine id is not a presence read, and a missing OS id waits for an in-app yes before a computer-name or random hash) | `weather.py`; `desk-plates` / `desk-plants`; `windows.js` / `window-play.js`; `news.js` / `market.js` / `weather-areas.js`; `presence.py`; `desktop.ps1` / `desktop.sh` |
| `card` | `blankCard`, collapse/open hooks, colors, **paintHud/persistCard wire**, **notif deep-link → open card on need**, **needs save/reload + alert clear after care**, **`card.speak_opts`** (TTS rate/pitch/volume), **`card.volume_mutes`** (volume clamp/persist + mute buses + cry volume via stubbed Audio), **`card.gpu`** (valid / missing / malformed / stale / Mac-Linux unsupported; sparkline history growth and empty unread/stale/malformed/unsupported strips; no invented zeros), **`card.listener`** (House lines unless the plugin can be asked; no key, URL, or model on the line), **`card.house_server`** (server row hidden with no Backend URL and no license; a saved URL wins; `House server · reachable/unreachable`, never `Java 8081` or `unread`), **`card.alarm`** / **`card.timer`** (the keeper clock rings a passed alarm minute once and a timer on time while the overlay is hidden; ring day and running timer survive `card.json`), **`card.saved_lines`**, **`card.music`** (house loop wav + `radio-search`), **`card.mind`** (`mind-set` seals, `mind-get` opens) | `card.ts` / `card.js` / `pet.js` / `desk-house.js` / `life.js` / `gpu.py` / `listener.py` + `harness_smokes.cjs` / `harness_web_smokes.mjs` |
| `web` | Companion-room parity: **`web.guest_choice`** (guest-choice.ts Exit/Close last + choice.js lockstep + CompanionRoom wires); **`web.ethogram_tricks`** (every catalog key in ethogram.ts; web↔desktop `*-tricks` TRICKS lockstep, Rui-only exclude); **`web.demo_room`** (demo-stage CompanionRoom / persistLocal=false) | `guest-choice.ts` / `ethogram.ts` / `*-tricks.ts`; `harness_web_smokes.mjs`; demo-stage |
| `blotter` | Pure study-desk surfaces: **hours** (day parts + **three-way REST lockstep** py↔desk↔web), **hive**, **guide** (catalog plaques), **classroom** (catalog-wide rooms + web `classroomFor` lockstep), **return_memory** (`return_line` thresholds + `remember_visit`/`seen.json` + web `returnLine`/`rememberVisit`), **gait**, **play**, **weather** lines/idle, **rail** group coverage, **frames** ANIMS keys; Qt **plaque** / **frames_paint** / **scene** stay excluded offline, driven under `--gui` | `hours.py`/`hive.py`/`guide.py`/`gait.py`/`play.py`/`weather.py` + desktop `hours.js`/`hive.js`/`gait.js`/`play.js`/`weather.js` lockstep (+ web `hours.ts` REST/return); `rail.py`/`frames.py`/`plaque.py`/`blotter.py`; web `plaques.classroomFor` via tsx; Qt slices share `app --check --offscreen` with `gui.blotter_qt` |
| `gui` | Overlay **choice Close/Exit** (`gui.choice_close_exit`); Electron/Qt rows excluded until `--gui` (incl. **host place-at-coords** + blotter Qt parent) | `choice.js`; `desktop/gui-harness.cjs` + `app --check --offscreen` under `--gui` |

No invented verbs. Guest choice does **not** include blotter tend (`feed` / `bath` / `clean`). Desk **Quotes** is the `market` plate (coins + NFT list). Offline desk resolves use fixture JSON / RSS — not live HTTP. Replays use saved responses in `desktop/renderer/fixtures/replay/` (provenance in its README) and a fake fetch — not live HTTP.

## Accounting

A run prints:

```
discovered=N  driven=A  failed=B  excluded=C  dead=0  sequenced=0  hidden=0  UNACCOUNTED=0
A/(A+B) passed
```

`UNACCOUNTED != 0` fails the run: the harness lost track of an affordance.

Invariants that survive growth (not frozen house-wide counts):

- Care driven is still 18/18
- Required ids stay in the catalog
- Guest marks end with `close` then `exit`
- `CATALOG_KEYS` and `SPECIES` stay the same set
- Every catalog key has denser `acts_for` (`ethogram.catalog_all`); every `prefersHouseCry` key has a wav (`cry.catalog_wavs`); every key has `web/public/pets/{key}.jpg` (`species.portraits`)
- Web companion-room lockstep: `guest-choice.ts` Exit/Close last (`web.guest_choice`); ethogram.ts keys + web↔desktop tricks TRICKS (`web.ethogram_tricks`); demo CompanionRoom (`web.demo_room`)
- Card audio: `card.speak_opts` (VOICE_STYLES + speakOpts clamp/soft + web lockstep) and `card.volume_mutes` (guest volume persist, MUTE_BUSES/isMuted, playVoice cry volume+talk-mute, hud-volume/hud-mutes wires) — no invented settings UI; live speakers stay `live.cry_playback`
- Blotter pure surfaces: hours/hive/guide/classroom/return_memory/gait/play/weather/rail/frames (`blotter.*`); **`blotter.hours` FAILs on any REST ACTIVE drift** across `hours.py` / `hours.js` / `hours.ts`; `dayPart` is Python+web only (no desktop peer — not invented); **`blotter.classroom`** catalog-wide `classroom_for` + web `classroomFor` label/verb/to lockstep (desktop has no classroom API); **`blotter.return_memory`** deepens `return_line` + `remember_visit` persist with web `returnLine` lockstep (desktop has no returnLine/rememberVisit — callLine stays in hours); Qt `blotter.plaque` / `frames_paint` / `scene` stay catalog gaps offline and are driven under `--gui` via shared `gui.blotter_qt` / `app --check --offscreen` traces
- Recorded-feed replays read the plate back, not the parser: weather shows `Seattle · Overcast · 8°` (the saved forecast is WMO 3) and the three daily rows, and WMO 0/1/2/3/45/61/71/95 each show their own word; news shows the saved titles and sources with whole links and no Wikipedia markup; coins show every saved price and `…` for the coin the response left out; the stock shows `AAPL · 341.07`; the NFT shows `CryptoPunks. Floor $91246.00. CoinGecko.`. Each replay also proves the plate asked one URL on the right host, asked nothing without its honesty line, and reads unread or can't reach after a failed read
- Feed words are text. Every replay sends hostile words through the real parse and paint (`<img src=x onerror=alert(1)>` and `&lt;script&gt;` as RSS titles and sources, a Wikipedia title and story, a geocoded place name, a coin name, an NFT currency symbol, and a saved favorite) and requires them on the plate as letters with no `<img>` or `<script>` element made, no link for a `javascript:` URL, and no write to `innerHTML`, `outerHTML`, or `insertAdjacentHTML` (the fake DOM records any such write). `desktop/renderer/feed-sinks.test.cjs` and `web/scripts/feed-sinks.test.mjs` ban those sinks (and `dangerouslySetInnerHTML`) in the overlay renderer and in `web/src`
- `desk.gpu.replay` feeds the same saved probe output to desktop `gpu-sense.cjs` and blotter `gpu.read_local`; both must print the same line, and a missing reading stays `unread`. The counter-only Windows reading is Task Manager's number: processes are added per engine, then the busiest engine is shown (`4.2%`, the video decode engine, for the saved counters). Counters are grouped per adapter LUID plus physical index, and the adapter with the most VRAM is shown: the hand-built `gpu-win-two-adapters.txt` has two adapters on `phys_0` and must read `12.5% · 2 GiB/8 GiB` (the 8 GiB card), not the integrated adapter's 61.5% or a mixed memory sum
- `desk.links.open` paints the saved Popular RSS, the saved Wikipedia featured feed, and a hostile item, then clicks every painted link through `presence/open-link.cjs` `sealContents`, the same seal `main.cjs` puts on both windows. All 6 painted `https` links reach `shell.openExternal` (a stand-in) once, in order, and each carries its `Opens <host> in your browser` title. `javascript:`, `data:`, `file:`, `blob:`, `about:`, `chrome:`, `vbscript:`, `mailto:`, `ftp:`, protocol-relative, relative, and credential links are refused and logged by scheme only. Every window-open answer is `deny`, so no Electron window is made, and every `will-navigate`, `will-redirect`, and `will-frame-navigate` is prevented, web pages included. A real browser opening is not checked
- `cry.decode` decodes all 221 house cries (221/221) and names any cry file that is silent. No cry is a known hole today (`garter.wav` was all zeros until it was re-exported from field tape); the row fails if a cry goes silent, or if a file listed in `KNOWN_SILENT_CRIES` gets sound and stays listed
- `desk.tray.switch`, `desk.quit`, `desk.market.search`, `card.alarm`, `card.timer`, `card.saved_lines`, `card.music`, and `card.mind` load the real `desktop/main.cjs` in Node under a stand-in Electron (`client/computerpets_client/harness_main.cjs`). The ready promise resolves, so the tray and overlay window are built on stand-ins; the hit, window, GPU, and desktop ticks are recorded and never run; GPU path, window listing, GPU sense, and virtual desktops are stubbed. `app.quit` is counted, never called. IPC is driven the way preload sends it (`send`, `sendSync`, `invoke`), and card rows wire renderer `card.js` `load` / `save` to `card-get` / `card-set`, so lines, alarms, and timers go through a real `card.json` in a temp folder. Radio and market look-ups answer from a fake fetch; no request leaves the computer. A live station stream, a real tray icon, and a real quit are not checked
- `desk.launch_check` runs the real start script in check mode (`desktop.ps1 -Check` on Windows, `desktop.sh --check` elsewhere). With Node 22 or newer and npm it must print the same version `node -v` prints and a pieces state; with no Node, an older Node, or no npm it must stop with plain words. It never installs or starts the overlay, and the install stamp does not change
- Every excluded row has a reason

## Gaps (honest)

These are **in the catalog** so they cannot go green by omission. `--gaps` lists them.

| id | Why it is not driven here |
|---|---|
| `gui.overlay_paint` | Needs Electron compositor/display; **pass `--gui`** on BLACKBEARD to boot overlay, paint pet/HUD, dismiss choice Close+Exit |
| `gui.blotter_qt` | Needs Qt in **`client/.venv`**; **pass `--gui`** to run `app --check --offscreen` via that interpreter (honest software-raster path — not a GPU lie) |
| `gui.card_hud_paint` | Needs Electron DOM; **pass `--gui`** for collapse/open + vital paint. Offline: **`card.paint_wire` + collapse/open hooks** |
| `gui.gift_drag_place` | Needs overlay gift-dot hit-targets; **pass `--gui`** for leaveGift + click `gift-dot` (place/pick, not freehand drag). Offline: **`gift.place`** |
| `gui.host_place` | Needs Electron host pet overlay; **pass `--gui`** for `placeHostAt` + `data-hit`. Offline OS perch: **`desk.windows.perch`** |
| `live.cry_playback` | Real speakers/Electron session; **`cry.playback` drives stubbed `Audio` + `playVoice` + wav**; **`cry.decode` decodes every cry file**. Nothing checks that a speaker made a sound |
| `live.weather_forecast` | True live Open-Meteo HTTP; **`desk.weather.replay` replays a saved forecast through read, parse, and paint** (`desk.weather.resolve` still drives small inline fixtures) |
| `live.news_rss` | True live RSS/HTTP; **`desk.news.replay` replays saved Popular and topic RSS plus a saved Wikipedia featured feed through read, parse, and paint** |
| `live.market_quote` | True live CoinGecko/Yahoo HTTP; **`desk.market.replay` replays saved CoinGecko prices and a saved Yahoo chart through read, parse, and paint** |
| `live.nft_floor` | True live NFT floor HTTP; **`desk.nft.replay` replays a saved floor through read, parse, and paint** |
| `live.gpu_sense` | Live keeper-machine GPU probe; **`card.gpu` drives the offline contract** and **`desk.gpu.replay` replays saved probe output through both readers**. Linux reads nvidia-smi. Mac reads IOAccelerator. Pass `--live` to read the machine. Never invents numbers. |
| `ethogram.tricks.red_panda` | Rui stays excluded by design (idle `acts_for` covers blotter ethogram) — do not invent a driven `ethogram.tricks.red_panda` ultra row |
| `blotter.plaque` | Needs PyQt6 `SpeciesPlaque` QWidget; **plaque copy** driven as `blotter.guide`; **pass `--gui`** to drive this id (species-plaque `ok:` line from shared `app --check`) |
| `blotter.frames_paint` | Needs PyQt6 QPainter; **ANIMS keys** driven as `blotter.frames`; **pass `--gui`** to drive this id (pet-frames-painted / pixmap `ok:` line) |
| `blotter.scene` | Needs PyQt6 `DeskBackground`/`DayWash`/`WeatherLayer`; **pass `--gui`** to drive this id (graphics-scene + weather/day-part `ok:` lines) |

Moved from gaps → driven (prior pass): stubbed cry playback, desk offline resolves, gift place coords, card paint wire, gui choice Close/Exit.

### What replay covers, and what is still not checked

Covered offline now: the weather, news, coin, stock, and NFT plates from a saved response to the words painted in the plate, the GPU line from saved probe output on both clients, and every cry file decoding to real sound. The `live.*` rows stay excluded because they are the live calls; `--live` still makes them for real, and default test-all never does.

Still not checked, by anything in default test-all:

- **Painted pixels.** The replays read the plate's text and elements through a small fake DOM, not a browser. The fake DOM has no HTML parser, so it proves the plates never hand feed words to one; it does not prove how a real browser would parse markup. Layout, fonts, colors, the overlay sprite, and the keeper card's paint are not looked at. `--gui` boots Electron and checks text and hit-targets, not pixels.
- **Drag-and-drop.** Freehand guest drag, gift drag, and plant drag physics are not driven. Place-at-coords and plant drag state are.
- **The Qt blotter scene.** Still `--gui` only (`gui.blotter_qt` and its slices).
- **Real speakers.** `cry.decode` proves the file holds sound; nothing proves a speaker played it.
- **Today's feeds.** The fixtures are a snapshot from 2026-09-27. A host that changes its response shape is caught only by `--live` or by a keeper.
- **The Electron main-process doors** (`news-feed`, `market-quotes`, `market-quote`, `nft-quote` IPC). The replays parse each saved body the way those doors do (`PlateFetch.parseJson`, then the same parse function) and require the same result, but the IPC handlers themselves need Electron.

This pass (pet keyboard button, plates in the overlay Tab cycle, more idle pauses, a cheaper keeper clock, alarm and mutes pressed, admin names and focus): **`web.pet_keys_plates`** imports the real `web/src/lib/pets/keeper.ts`, `pets/card.ts`, and `admin/base.ts` (`harness_web_smokes.mjs pet_keys_plates`): `petTapLabel` names the pet's hit area ("Choose what Rui does (Rui, asleep)", "Pick Chirp (chosen)", "Say hello to Wave"), `isTapKey` takes Enter and Space but not a held repeat, `isStale` lets the news plate read once on return only when 20 minutes old, `createCardTickReader` parses a still card once and a changed card again, and `ledgerCaption` / `focusAfterGate` name the license list and pick where focus lands. The smoke also checks that the living pet, room, floor, news plate, keeper card, admin page, overlay `pet.js` / `index.html` / `styles.css` (plates in the Tab cycle, focus kept across a repaint, alarm and mutes pressed), and desktop README use them, and that `main.cjs` still registers no global shortcut (ADR 0012).

Prior (rename and let-go, music hint, one re-read, overlay keys, screen-reader names, idle pauses): **`web.pets_keys_idle`** imports the real `web/src/lib/plain-error.ts`, `admin/base.ts`, `pets/keeper.ts` (with `everyVisible`), `pets/house-music.ts`, and `desktop/renderer/house-music.js` / `keeper.js` (`harness_web_smokes.mjs pets_keys_idle`): `petNotSaved` gives "The new name wasn't saved." / "They weren't let go; they're still in your kennel." plus the plain reason, `sharedMusicHint` says "Pick music on Rui's card." when the music is off or radio has no station (never on Rui's card, web and desktop agree), `rereadOnce` runs once however often it fires, `tabWrap` / `cardKey` wrap Tab in the open keeper card and close it on Escape unless a menu is open, `petArtLabel` / `roomLabel` name the pet art and the room, and `everyVisible` pauses while hidden and runs once on return. The smoke also checks the pets route, admin page, keeper card, companion room, overlay `pet.js`, `main.cjs` (the "Keeper card" tray and pet-menu item), and the overlay focus ring use them.

Prior (one care message, revoke vs list, shared house music, one heartbeat poll): **`web.pets_admin_music`** imports the real `web/src/lib/plain-error.ts`, `admin/base.ts`, `pets/keeper.ts`, `pets/house-music.ts`, and `desktop/renderer/house-music.js` (`harness_web_smokes.mjs pets_admin_music`): `roomReportsCare` is true for play / feed / rest / clean / medicine (so `/pets/$key` drops its toast for those) and false for anything else, `markRevoked` / `revokedListStale` keep a confirmed revoke reading as done when the list refresh fails, `sharedMusicShows` / `houseMusicToggle` agree between web and desktop and never show on Rui's card, `createHeartbeatPoll` runs one interval for two subscribers, stops with the last, and reads DOWN when the service is unreachable, and `plateProblem('floor')` gives "Couldn't load the floor price.". The smoke also checks the pets route, admin page, keeper card, desk plates, and overlay HTML / pet.js use them.

Prior (care saves, talk, revoke, plates, keeper sound): **`web.care_talk_plates`** imports the real `web/src/lib/plain-error.ts` and `web/src/lib/admin/base.ts` under `node --experimental-strip-types` (`harness_web_smokes.mjs care_talk_plates`): a feed, rest, clean, or medicine the house could not save gives "The feeding wasn't saved, so the meters didn't change." (and so on) plus the plain reason, a failed talk turn gives the Minds reason when a plugin was involved and the house reason otherwise, a revoke counts only on the ledger's own `{revoked:true, jti}` for that jti, the forecast / headlines / price plates say "Couldn't load …" with a reason that never blames the house server, and music or sleep sounds that did not play say why while a deliberate pause says nothing. The smoke also checks that the companion room, the admin API, the desk plates, and the keeper card use them.

Prior (nest, play save, admin search, Minds, deploy): **`web.plain_reasons`** imports the real `web/src/lib/plain-error.ts` and `web/src/lib/admin/base.ts` under `node --experimental-strip-types` (`harness_web_smokes.mjs plain_reasons`): a failed nest load gives "Couldn't load the nest." plus the plain reason, a play the house could not save gives "The play wasn't saved, so the meters didn't change." plus the plain reason, a Minds test failure names the reason (key rejected, rate limited, wrong address or model, server trouble, refused URL, unreachable) with the raw text only in the log, and the admin answer checks (`isLicenseRow`, `isLicenseMissing`, `isRevokeMiss`) accept only the license service's own shapes. The smoke also checks that `/nest`, the companion room, the Minds page, and the admin API use them.

Prior (web load problems): **`web.load_problems`** imports the real `web/src/lib/plain-error.ts` and `web/src/lib/admin/base.ts` under `node --experimental-strip-types` (`harness_web_smokes.mjs load_problems`): `loadProblem` for kennel / ember / desk / sign-in gives "Couldn't load …" plus the plain reason with no raw text, the routes use it (and no longer fall back to an empty kennel, 0 ember, the default guest, or a silent sign-in click), the admin address starts from env, then this site, then localhost only for a local page, only a license list opens the ledger (a 404 is not the license service), and ledger times read in local time with the ISO instant kept.

Prior (Python Unlock seal): **`blotter.unlock_offline`** drives the real Python `license/session.py` against the contract double with an in-memory disk, test-only keys, and a fake codec: Unlock seals `auth.token` (never plain in `license.json`), no secret store keeps it in memory and a later run's Signed download says `no_token` before any POST, an older plain token is sealed on first read, and refused / HTTP 500 / 403 / blank Steam fields each give one plain sentence ending "Pets still work without it." (`license/plain_error.py`, a port of `plain-error.cjs`). Peer of `desk.license.offline`.

Prior (House window, Unlock offline, tray menu): **`desk.settings.window`** runs `settings.html`'s own scripts against a stand-in DOM, joined to the real `main.cjs` by the real sandboxed `preload.cjs` (`harness_windows.cjs`): fields, the four Base URL checks, a sealed save, Not saved when `mind.json` cannot be written, no secret store, the folded Details, and plain Unlock errors. **`desk.license.offline`** drives the real `desktop/license` code through main's IPC with fake house-server answers and test-only keys (valid, expired, wrong machine, network down, 500, 403, expired stored license, no license key, empty Steam fields) and checks that no file holds the key or the download sign-in. **`desk.tray.menu`** clicks every tray row and boots the software, refused, and no-adapter GPU gates in their own processes. Fixed: Unlock errors showed developer or server text; `license-status` skipped the plain words; `license.json` kept the download sign-in in plain text; Minds said Saved when `mind.json` was not written and saved Base URLs talk refuses; Unlock... opened the window at Minds. Prior (clock notification + Lula): clicking the notification a hidden overlay sends for an alarm or timer shows the overlay and the saved line and opens no care; `card.alarm` and `card.timer` click the stand-in notification and read `clock-note`, the line, and that other notifications still open care. Lula's cry is a real boa field hiss (Freesound 33458, CC BY 3.0), so `cry.decode` still reads 221 of 221. Prior (keeper clock + main process): the overlay and desk keeper clock keep looking while hidden and remember the last look, so a passed alarm minute rings once and a timer rings on time; a hidden overlay also gets a notification. `desk.tray.switch`, `desk.quit`, `desk.market.search`, `card.alarm`, `card.timer`, `card.saved_lines`, `card.music`, and `card.mind` drive the real `main.cjs` IPC and tray on a stand-in Electron. Prior (start script): `desktop.ps1` and `desktop.sh` check Node 22+ and npm first and stop in plain words, get the pieces again when an install was closed halfway or `package.json` changed, stop when `npm install` fails, and have a check mode that changes nothing. **`desk.launch_check`** drives that check mode. Prior (garter and missing cries): `garter.wav` is re-exported from a real grass field tape, so `cry.decode` lists no silent cry. Beak (snapper) plays a real underwater snapping-turtle grunt and Jaw (crocodile) a Nile crocodile juvenile call, both CC BY 4.0 from published papers. Sol, Shift, Spike, and Lid get CC0 habitat recordings until open-licensed species tape exists. Web `prefersHouseCry` gains Soak (capybara), whose cry was already on disk. `cry.decode` now reads 221 of 221. Prior (overlay links and GPU adapters): headline, Wikipedia, and favorite links on the overlay open in the keeper's default browser. The main process hands only `http(s)` links to `shell.openExternal`, refuses every other scheme, and still denies every window and navigation (**`desk.links.open`**). Windows GPU counters are grouped per adapter LUID, and the adapter with the most VRAM is shown (hand-built `gpu-win-two-adapters.txt` in `desk.gpu.replay`). Prior (feed honesty): the overlay's weather, news, coin, NFT, and geocode plates now build their elements with `createElement` and text nodes, and link only `http(s)` pages; the replays feed hostile titles through each plate and require letters, no element, and no HTML sink. The forecast says the WMO code in words (3 is Overcast, not Clear) on desktop and web. The Windows counter-only GPU reading adds processes per engine and shows the busiest engine, as Task Manager does. Prior (recorded-feed replay): **`desk.weather.replay`**, **`desk.news.replay`**, **`desk.market.replay`**, **`desk.nft.replay`**, and **`desk.gpu.replay`** replay saved responses from `desktop/renderer/fixtures/replay/` through the real read, parse, and paint (`harness_replay.cjs`), and **`cry.decode`** decodes every house cry with Python `wave`. The replays found two real bugs, fixed on desktop and web together: a Wikipedia featured story reached the news plate as raw markup, cut mid-tag at 200 characters, and a Google News link longer than 240 characters was cut, so its link opened a broken page. `cry.decode` found `garter.wav` is all zeros, listed as a known hole until the file is re-exported. Prior (audio / volume / speakOpts): **`card.speak_opts`** drives desktop+web TTS `speakOpts` / `VOICE_STYLES` (hearth soft 0.92, clamp 0..100, pet.js + companion-room/keeper-card wires). **`card.volume_mutes`** drives guest volume clamp+load/save persist, `MUTE_BUSES`/`isMuted`, `playVoice` cry volume via Audio stub + talk-mute no-op, and existing hud-volume/hud-mutes / keeper-card wires — no invented settings UI; license/unlock skipped; live speakers stay `live.cry_playback`. Prior (classroom + visit memory): **`blotter.classroom`** drives catalog-wide `guide.classroom_for` (20 rooms) and locksteps web `plaques.classroomFor` on label/verb/to (tsx load); desktop has no classroom peer — not invented. **`blotter.return_memory`** deepens `return_line` thresholds + `remember_visit`/`seen.json` away-ms persist and locksteps web `returnLine` + companion-room `rememberVisit` wire; desktop `hours.js` has callLine only (no returnLine/rememberVisit) — not invented. Prior (blotter Qt `--gui` slices): **`blotter.plaque`**, **`blotter.frames_paint`**, **`blotter.scene`** stay catalog `excluded` / `mode=gui` so default offline stays green; under `--gui` they are promoted and each asserts a distinct `ok:` line from the shared `computerpets_client.app --check --offscreen` bundle (same run as `gui.blotter_qt`). Prior (hours lockstep): **`blotter.hours`** three-way REST-locksteps `hours.py` ↔ `hours.js` ↔ `hours.ts` (Rui `red_panda` REST `(1,6)`); `dayPart` stays Python+web only.

Prior (still offline-driven, no invented verbs): **`blotter` domain** — `blotter.hours` / `hive` / `guide` / `classroom` / `return_memory` / `gait` / `play` / `weather` / `rail` / `frames` (Python pure APIs + desktop `hours.js`/`hive.js`/`gait.js`/`play.js`/`weather.js` lockstep where fixtures agree; visitor already covered by `visit.*`; license/unlock skipped). Qt-only `blotter.plaque` / `frames_paint` / `scene` stay excluded → `--gui`. Prior: **`web.guest_choice`**, **`web.ethogram_tricks`**, **`web.demo_room`** — companion-room parity with desktop where real APIs exist. `web.guest_choice` drives `guest-choice.ts` (Exit/Close last) via `harness_web_smokes.mjs` + lockstep with `choice.js` / CompanionRoom wires (not only desktop `gui.choice_close_exit` / Python `choice.py`). `web.ethogram_tricks` is catalog-wide: every `CATALOG_KEYS` guest is in `ethogram.ts`; every non-Rui key has matching web `*-tricks.ts` and desktop `*-tricks.js` TRICKS lists (alias-aware; Rui-only exclude). `web.demo_room` reuses the pure demo-stage check (CompanionRoom / `persistLocal=false` / `demo.$slug`) — no invented static-export smoke (TanStack/nitro has none offline). `--gui` stays Electron desktop. Prior: **`ethogram.catalog_all`**, **`cry.catalog_wavs`**, **`species.portraits`** — CSRBT-style house-wide invariants; tricks alias-aware (`relay`/`fuse`/`earth` for dragons); Rui stays the only ethogram.tricks exclusion. Prior: **`desk.windows.perch`** — `windows.js` `parseEnumText`/`takeRects` work-area filter + `window-play.js` `playFor`/`pickTarget`/`beginPlay` (budgie perch / cat ledge) on fixture rects (no live HWND / multi-monitor); **`gui.host_place`** (mode=gui) — Electron `placeHostAt` coords + pet `data-hit` under `--gui`. Plate open/close/minimize APIs do **not** exist beyond style+drag persist already driven as `desk.plates.style` — skipped inventing minimize. Visit durable position store has **no** real API (`visitor.js` is todays/phases/line only; call `placed` is in-memory) — skipped. Prior: visit lifecycle, tickers, news X, needs persist, Favorites, plants, notify. License/unlock still skipped (network/secrets).

### Dual-mode (`--live`)

Catalog `mode` is `offline` (default) or `live`. Default `run_all` **keeps** `mode=live` rows as `excluded` (UNACCOUNTED stays 0) and never opens a socket. Pass `--live` to opt into real HTTP for weather/news/market/nft on that run only. Live failures name the plate id, timeout, and URL (10–12s); they do not change offline scores:

```powershell
py -m computerpets_client.app_harness --live
py -m computerpets_client.app_harness --domain desk --live
```

### GUI opt-in (`--gui`)

Catalog `mode=gui` rows stay **excluded** in default `run_all` so GitHub/cloud stays offline-green (`UNACCOUNTED=0`). On BLACKBEARD (or any machine with Electron + Qt), Buffffff passes `--gui`:

```powershell
cd client
# Prefer the client venv so gui.blotter_qt finds PyQt6 (bare `py` often has none):
.\.venv\Scripts\python.exe -m computerpets_client.app_harness --gui
.\.venv\Scripts\python.exe -m computerpets_client.app_harness --domain gui --gui
# Bare `py` still works for offline domains; blotter_qt subprocess uses client/.venv when present:
py -m computerpets_client.app_harness --gui
# Electron-only launcher (same smokes the harness uses):
node ..\desktop\gui-harness.cjs
# Qt blotter alone (same interpreter the harness prefers):
.\.venv\Scripts\python.exe -m computerpets_client.app --check --offscreen
```

`--gui` drives:

| id | What it observes |
|---|---|
| `gui.overlay_paint` | Electron boots; pet `src` + HUD name; choice opens with Close/Exit; Close dismisses; Exit collapses card |
| `gui.card_hud_paint` | open → vital text; collapse → `data-collapsed=1`; reopen shows again |
| `gui.gift_drag_place` | `leaveGift` paints a `gift-dot` `[data-hit]`; click clears it (honest hit-target place/pick) |
| `gui.host_place` | `PetGuiHarness.placeHostAt(x)` sets host `sim.x` and asserts pet `data-hit` bounds (place-at-coords, not drag physics) |
| `gui.blotter_qt` | `app --check --offscreen` prints `ok:` lines (pet, plaque, frames painted, scene, weather, day-part); parent of blotter Qt slices |
| `blotter.plaque` | Species plaque text (`ok: species plaque for …`) from Qt path / `--check` |
| `blotter.frames_paint` | Pet frame pixmaps exist (`ok: pet frames painted (N pixmaps; …)`) |
| `blotter.scene` | Graphics scene + weather/day-part (`ok: graphics scene (… weather=…; day=…)`) + QGraphicsView renderer label |

Requires `desktop/` `npm install` (Electron) and **`client/.venv` with PyQt6**. `gui.blotter_qt` prefers `client/.venv/Scripts/python.exe` (or `bin/python`) when present — do not assume bare `py` has Qt. Install once:

```powershell
cd client
py -m venv .venv
$env:PIP_IGNORE_REQUIRES_PYTHON = "1"   # if default py is still 3.10; pyproject wants >=3.11
.\.venv\Scripts\python.exe -m pip install -U pip
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
.\.venv\Scripts\python.exe -m computerpets_client.app --check --offscreen
```

`desktop.ps1` remains the human desk launch; harness uses a temp `userData` and skips the tray.

Node offline smokes live in `client/computerpets_client/harness_smokes.cjs`; recorded-feed replays live in `harness_replay.cjs` and read `desktop/renderer/fixtures/replay/`. Web companion-room smokes: `harness_web_smokes.mjs` (`node --experimental-strip-types`). Electron GUI smokes: `desktop/gui-harness.cjs` + `PetGuiHarness` in `pet.js` when `?gui_harness=1`.

## Care-only doc

The original 18 actions, Exit/Close overlay notes, and `care_harness` CLI remain in [CARE-HARNESS.md](CARE-HARNESS.md).
