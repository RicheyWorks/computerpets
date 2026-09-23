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
| `cry` | `prefersHouseCry` parse, pet.js wiring, **`cry.catalog_wavs`** (every prefersHouseCry key has a wav), **stubbed `cry.playback`** | `card.ts` / `pet.js` / `house-sounds.js` / `desk-house.js` / `harness_smokes.cjs` |
| `gift` | Line, leave, pick, **place coords** (`gift.place`) | `gift.py` + `life.js leaveGift` via `harness_smokes.cjs` |
| `desk` | Weather clock; plate keys; URL builders; **offline resolve**; **Favorites** (News/Coins/NFTs/Weather); **news topics/Popular/X**; **quotes add-ticker**; **plate chrome/style**; **plant drag-place**; **OS window perch**; **`desk.presence`** (no Desktop/Documents/Downloads listing, no window title or document name, path omitted without consent, no key log outside a focused field, geolocation only while a weather locate is open, no IP place lookup, a live locate waits for an in-app yes, a later locate in the session waits for a fresh yes, a stored live pin is rounded on load, a saved live pin does not forecast until the keeper says to use that place, a saved typed area does not start a new locate, a license machine id is not a presence read, and a missing OS id waits for an in-app yes before a computer-name or random hash) | `weather.py`; `desk-plates` / `desk-plants`; `windows.js` / `window-play.js`; `news.js` / `market.js` / `weather-areas.js`; `presence.py` |
| `card` | `blankCard`, collapse/open hooks, colors, **paintHud/persistCard wire**, **notif deep-link → open card on need**, **needs save/reload + alert clear after care**, **`card.speak_opts`** (TTS rate/pitch/volume), **`card.volume_mutes`** (volume clamp/persist + mute buses + cry volume via stubbed Audio), **`card.gpu`** (valid / missing / malformed / stale / Mac-Linux unsupported; sparkline history growth and empty unread/stale/malformed/unsupported strips; no invented zeros), **`card.listener`** (House lines unless the plugin can be asked; no key, URL, or model on the line) | `card.ts` / `card.js` / `pet.js` / `desk-house.js` / `life.js` / `gpu.py` / `listener.py` + `harness_smokes.cjs` / `harness_web_smokes.mjs` |
| `web` | Companion-room parity: **`web.guest_choice`** (guest-choice.ts Exit/Close last + choice.js lockstep + CompanionRoom wires); **`web.ethogram_tricks`** (every catalog key in ethogram.ts; web↔desktop `*-tricks` TRICKS lockstep, Rui-only exclude); **`web.demo_room`** (demo-stage CompanionRoom / persistLocal=false) | `guest-choice.ts` / `ethogram.ts` / `*-tricks.ts`; `harness_web_smokes.mjs`; demo-stage |
| `blotter` | Pure study-desk surfaces: **hours** (day parts + **three-way REST lockstep** py↔desk↔web), **hive**, **guide** (catalog plaques), **classroom** (catalog-wide rooms + web `classroomFor` lockstep), **return_memory** (`return_line` thresholds + `remember_visit`/`seen.json` + web `returnLine`/`rememberVisit`), **gait**, **play**, **weather** lines/idle, **rail** group coverage, **frames** ANIMS keys; Qt **plaque** / **frames_paint** / **scene** stay excluded offline, driven under `--gui` | `hours.py`/`hive.py`/`guide.py`/`gait.py`/`play.py`/`weather.py` + desktop `hours.js`/`hive.js`/`gait.js`/`play.js`/`weather.js` lockstep (+ web `hours.ts` REST/return); `rail.py`/`frames.py`/`plaque.py`/`blotter.py`; web `plaques.classroomFor` via tsx; Qt slices share `app --check --offscreen` with `gui.blotter_qt` |
| `gui` | Overlay **choice Close/Exit** (`gui.choice_close_exit`); Electron/Qt rows excluded until `--gui` (incl. **host place-at-coords** + blotter Qt parent) | `choice.js`; `desktop/gui-harness.cjs` + `app --check --offscreen` under `--gui` |

No invented verbs. Guest choice does **not** include blotter tend (`feed` / `bath` / `clean`). Desk **Quotes** is the `market` plate (coins + NFT list). Offline desk resolves use fixture JSON / RSS — not live HTTP.

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
- Every excluded row has a reason

## Gaps (honest)

These are **in the catalog** so they cannot go green by omission. `--gaps` lists them.

| id | Why it is not driven here |
|---|---|
| `gui.overlay_paint` | Needs Electron compositor/display; **pass `--gui`** on BLACKBEARD to boot overlay, paint pet/HUD, dismiss choice Close+Exit |
| `gui.blotter_qt` | Needs Qt in **`client/.venv`**; **pass `--gui`** to run `app --check --offscreen` via that interpreter (honest software-raster path ? not a GPU lie) |
| `gui.card_hud_paint` | Needs Electron DOM; **pass `--gui`** for collapse/open + vital paint. Offline: **`card.paint_wire` + collapse/open hooks** |
| `gui.gift_drag_place` | Needs overlay gift-dot hit-targets; **pass `--gui`** for leaveGift + click `gift-dot` (place/pick, not freehand drag). Offline: **`gift.place`** |
| `gui.host_place` | Needs Electron host pet overlay; **pass `--gui`** for `placeHostAt` + `data-hit`. Offline OS perch: **`desk.windows.perch`** |
| `live.cry_playback` | Real speakers/Electron session; **`cry.playback` drives stubbed `Audio` + `playVoice` + wav** |
| `live.weather_forecast` | True live Open-Meteo HTTP; **`desk.weather.resolve` drives `parseForecast` fixtures** |
| `live.news_rss` | True live RSS/HTTP; **`desk.news.resolve` drives `parseRss` fixtures** |
| `live.market_quote` | True live CoinGecko/Yahoo HTTP; **`desk.market.resolve` drives parse fixtures** |
| `live.nft_floor` | True live NFT floor HTTP; **`desk.nft.resolve` drives `parseNftLive` fixtures** |
| `live.gpu_sense` | Live keeper-machine GPU probe; **`card.gpu` drives the offline contract**. Linux reads nvidia-smi. Mac reads IOAccelerator. Pass `--live` to read the machine. Never invents numbers. |
| `ethogram.tricks.red_panda` | Rui stays excluded by design (idle `acts_for` covers blotter ethogram) — do not invent a driven `ethogram.tricks.red_panda` ultra row |
| `blotter.plaque` | Needs PyQt6 `SpeciesPlaque` QWidget; **plaque copy** driven as `blotter.guide`; **pass `--gui`** to drive this id (species-plaque `ok:` line from shared `app --check`) |
| `blotter.frames_paint` | Needs PyQt6 QPainter; **ANIMS keys** driven as `blotter.frames`; **pass `--gui`** to drive this id (pet-frames-painted / pixmap `ok:` line) |
| `blotter.scene` | Needs PyQt6 `DeskBackground`/`DayWash`/`WeatherLayer`; **pass `--gui`** to drive this id (graphics-scene + weather/day-part `ok:` lines) |

Moved from gaps → driven (prior pass): stubbed cry playback, desk offline resolves, gift place coords, card paint wire, gui choice Close/Exit.

This pass (audio / volume / speakOpts): **`card.speak_opts`** drives desktop+web TTS `speakOpts` / `VOICE_STYLES` (hearth soft 0.92, clamp 0..100, pet.js + companion-room/keeper-card wires). **`card.volume_mutes`** drives guest volume clamp+load/save persist, `MUTE_BUSES`/`isMuted`, `playVoice` cry volume via Audio stub + talk-mute no-op, and existing hud-volume/hud-mutes / keeper-card wires — no invented settings UI; license/unlock skipped; live speakers stay `live.cry_playback`. Prior (classroom + visit memory): **`blotter.classroom`** drives catalog-wide `guide.classroom_for` (20 rooms) and locksteps web `plaques.classroomFor` on label/verb/to (tsx load); desktop has no classroom peer — not invented. **`blotter.return_memory`** deepens `return_line` thresholds + `remember_visit`/`seen.json` away-ms persist and locksteps web `returnLine` + companion-room `rememberVisit` wire; desktop `hours.js` has callLine only (no returnLine/rememberVisit) — not invented. Prior (blotter Qt `--gui` slices): **`blotter.plaque`**, **`blotter.frames_paint`**, **`blotter.scene`** stay catalog `excluded` / `mode=gui` so default offline stays green; under `--gui` they are promoted and each asserts a distinct `ok:` line from the shared `computerpets_client.app --check --offscreen` bundle (same run as `gui.blotter_qt`). Prior (hours lockstep): **`blotter.hours`** three-way REST-locksteps `hours.py` ↔ `hours.js` ↔ `hours.ts` (Rui `red_panda` REST `(1,6)`); `dayPart` stays Python+web only.

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

Requires `desktop/` `npm install` (Electron) and **`client/.venv` with PyQt6**. `gui.blotter_qt` prefers `client/.venv/Scripts/python.exe` (or `bin/python`) when present ? do not assume bare `py` has Qt. Install once:

```powershell
cd client
py -m venv .venv
$env:PIP_IGNORE_REQUIRES_PYTHON = "1"   # if default py is still 3.10; pyproject wants >=3.11
.\.venv\Scripts\python.exe -m pip install -U pip
.\.venv\Scripts\python.exe -m pip install -e ".[dev]"
.\.venv\Scripts\python.exe -m computerpets_client.app --check --offscreen
```

`desktop.ps1` remains the human desk launch; harness uses a temp `userData` and skips the tray.

Node offline smokes live in `client/computerpets_client/harness_smokes.cjs`. Web companion-room smokes: `harness_web_smokes.mjs` (`node --experimental-strip-types`). Electron GUI smokes: `desktop/gui-harness.cjs` + `PetGuiHarness` in `pet.js` when `?gui_harness=1`.

## Care-only doc

The original 18 actions, Exit/Close overlay notes, and `care_harness` CLI remain in [CARE-HARNESS.md](CARE-HARNESS.md).
