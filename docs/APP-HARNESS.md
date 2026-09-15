# App inspect harness

Buffffff uses this to **automate and troubleshoot the whole house** — not only care. One entrypoint, real surfaces only, honest gaps for GUI-only and live-network bits.

The care harness is unchanged and still the source of the 18 care actions. This wraps it as the `care` domain inside a broader registry.

## Why this shape

Stolen from Richey’s other repos (architecture, not domain):

| Pattern | From | Here |
|---|---|---|
| Registry of real operations; discover / invoke / assert | CSRBT `HarnessRegistry` + FlowersForever `ConnectorRegistry` | `catalog()` / `invoke()` / `assert_action()` |
| Domains as plugins / suites | CSRBT `tools/verify/` + harness plugins | `care` `guest` `species` `ethogram` `cry` `gift` `desk` `card` |
| Accounting identity | CSRBT `tools/harness.py` | `discovered == driven + dead + sequenced + hidden + failed + excluded`; `UNACCOUNTED` is a harness bug |
| General oracle | CSRBT | Observable trace + no errors + no `NaN` / `undefined` / `[object Object]` junk — not frozen remembered counts |
| One runner, exit non-zero on fail | CSRBT `tools/verify/run_all.py` | `py -m computerpets_client.app_harness` |
| Dual-mode offline vs live | FlowersForever connectors | Default **offline/headless**. Live fetches are catalogued as `excluded` with a reason |
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
| `cry` | `prefersHouseCry` parse, pet.js wiring, wav files where they exist | `card.ts prefersHouseCry` / `pet.js` / `desktop/renderer/sounds/*.wav` |
| `gift` | Line, leave, pick | `gift.gift_line` / `leave_gift` / `pick_gift` |
| `desk` | Weather clock; plate keys; news/market/NFT **URL builders** and address normalize — **not** live HTTP | `weather.py`; `desk-plates.ts`; `news.ts`; `market.ts`; `EthereumAddress.java`; `NftCatalog.java` |
| `card` | `blankCard` collapsed, collapse/open hooks, colors | `card.ts` / `pet.js collapseKeeperCard` / `openKeeperCard` |

No invented verbs. Guest choice does **not** include blotter tend (`feed` / `bath` / `clean`). Desk **Quotes** is the `market` plate (coins + NFT list).

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
| `gui.overlay_paint` | Overlay walk/paint loop needs Electron |
| `gui.blotter_qt` | Qt OpenGL viewport needs a display |
| `gui.card_hud_paint` | Keeper HUD paint/persist needs the overlay; collapse/open **hooks** are driven |
| `gui.gift_drag_place` | Pointer drag on the wood; `leave_gift` / `pick_gift` cover the logic |
| `live.cry_playback` | Speakers / `PetDeskHouse`; wav presence is driven |
| `live.weather_forecast` | Open-Meteo HTTP |
| `live.news_rss` | Wikipedia / Google News HTTP |
| `live.market_quote` | CoinGecko / Yahoo HTTP |
| `live.nft_floor` | CoinGecko NFT floor HTTP |

Pass `--live` is not wired yet. Dual-mode is the catalog `mode` field (`offline` vs `live`); live rows stay excluded until a later transport can hold a network policy.

## Care-only doc

The original 18 actions, Exit/Close overlay notes, and `care_harness` CLI remain in [CARE-HARNESS.md](CARE-HARNESS.md).
