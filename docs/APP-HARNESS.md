# App inspect harness

Buffffff uses this to **automate and troubleshoot the whole house** — not only care. One entrypoint, real surfaces only, honest gaps for GUI-only and live-network bits.

The care harness is unchanged and still the source of the 18 care actions. This wraps it as the `care` domain inside a broader registry.

## Why this shape

Stolen from Richey’s other repos (architecture, not domain):

| Pattern | From | Here |
|---|---|---|
| Registry of real operations; discover / invoke / assert | CSRBT `HarnessRegistry` + FlowersForever `ConnectorRegistry` | `catalog()` / `invoke()` / `assert_action()` |
| Domains as plugins / suites | CSRBT `tools/verify/` + harness plugins | `care` `guest` `species` `ethogram` `cry` `gift` `desk` `card` `gui` |
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
| `species` | Catalog load, lookup, GUESTS.md, sample guests | `species.CATALOG_KEYS` / `species_by_key` / `docs/GUESTS.md` |
| `ethogram` | Acts + tricks files for sample guests | `ethogram.acts_for` / `desktop/renderer/*-tricks.js` |
| `cry` | `prefersHouseCry` parse, pet.js wiring, wav files, **stubbed `cry.playback`** (mock `Audio` + `PetDeskHouse.playVoice`) | `card.ts` / `pet.js` / `house-sounds.js` / `desk-house.js` / `harness_smokes.cjs` |
| `gift` | Line, leave, pick, **place coords** (`gift.place`) | `gift.py` + `life.js leaveGift` via `harness_smokes.cjs` |
| `desk` | Weather clock; plate keys; URL builders; **offline resolve**; **Favorites** (News/Coins/NFTs/Weather); **news topics/Popular**; **plate chrome/style**; **plant drag-place** | `weather.py`; `desk-plates` / `desk-plants`; `news.js` / `market.js` / `weather-areas.js` |
| `card` | `blankCard`, collapse/open hooks, colors, **paintHud/persistCard wire**, **notif deep-link → open card on need** | `card.ts` / `pet.js` / `life.js` via hooks + `harness_smokes.cjs` |
| `gui` | Overlay **choice Close/Exit** (`gui.choice_close_exit`); Electron/Qt rows excluded until `--gui` | `choice.js`; `desktop/gui-harness.cjs` + `app --check --offscreen` under `--gui` |

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
- Every excluded row has a reason

## Gaps (honest)

These are **in the catalog** so they cannot go green by omission. `--gaps` lists them.

| id | Why it is not driven here |
|---|---|
| `gui.overlay_paint` | Needs Electron compositor/display; **pass `--gui`** on BLACKBEARD to boot overlay, paint pet/HUD, dismiss choice Close+Exit |
| `gui.blotter_qt` | Needs Qt in **`client/.venv`**; **pass `--gui`** to run `app --check --offscreen` via that interpreter (honest software-raster path ? not a GPU lie) |
| `gui.card_hud_paint` | Needs Electron DOM; **pass `--gui`** for collapse/open + vital paint. Offline: **`card.paint_wire` + collapse/open hooks** |
| `gui.gift_drag_place` | Needs overlay gift-dot hit-targets; **pass `--gui`** for leaveGift + click `gift-dot` (place/pick, not freehand drag). Offline: **`gift.place`** |
| `live.cry_playback` | Real speakers/Electron session; **`cry.playback` drives stubbed `Audio` + `playVoice` + wav** |
| `live.weather_forecast` | True live Open-Meteo HTTP; **`desk.weather.resolve` drives `parseForecast` fixtures** |
| `live.news_rss` | True live RSS/HTTP; **`desk.news.resolve` drives `parseRss` fixtures** |
| `live.market_quote` | True live CoinGecko/Yahoo HTTP; **`desk.market.resolve` drives parse fixtures** |
| `live.nft_floor` | True live NFT floor HTTP; **`desk.nft.resolve` drives `parseNftLive` fixtures** |
| `ethogram.tricks.red_panda` | No separate `*-tricks.js` for Rui by design (idle `acts_for` covers blotter ethogram) |

Moved from gaps → driven (prior pass): stubbed cry playback, desk offline resolves, gift place coords, card paint wire, gui choice Close/Exit.

This pass (still offline-driven, no invented verbs): `desk.favorites.news` / `desk.favorites.market` / `desk.favorites.weather`, `desk.news.topics`, `desk.plates.style` (plate chrome + drag persist), `desk.plants.place` (Disk/Felt), `card.notify_open` (`NEED_CARE` / `careForNeed` / `alerts` + `openCareFromNotify` wire). Guest freehand overlay drag remains GUI-only (`gui.gift_drag_place` covers gift hit-targets under `--gui`).

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
| `gui.blotter_qt` | `app --check --offscreen` prints `ok:` lines (pet, plaque, weather, day-part) |

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

Node offline smokes live in `client/computerpets_client/harness_smokes.cjs`. Electron GUI smokes: `desktop/gui-harness.cjs` + `PetGuiHarness` in `pet.js` when `?gui_harness=1`.

## Care-only doc

The original 18 actions, Exit/Close overlay notes, and `care_harness` CLI remain in [CARE-HARNESS.md](CARE-HARNESS.md).
