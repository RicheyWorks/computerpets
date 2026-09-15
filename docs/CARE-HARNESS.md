# Care harness

Inspect and verify every **real** house care action (blotter `life.py` / `specials.py` / `shed.py`). No invented verbs.

Buffffff’s house-wide runner (guest, species, ethogram, cry, gift, desk plates, card) is **[APP-HARNESS.md](APP-HARNESS.md)** — `py -m computerpets_client.app_harness`. This file is the care domain that runner wraps.

## Catalog (stable ids)

| id | kind | notes |
|----|------|-------|
| `feed` | care | `apply_feed` |
| `rest` | care | `apply_rest` |
| `walk` / `sit` | pose | `pet.issue` only — no CareState delta |
| `talk` | care | `apply_talk` |
| `treat` | care | `apply_treat` (overlay snack) |
| `play` | care | `apply_play` |
| `special` | special | species verb — e.g. **Steal ribbon** for `red_panda` |
| `hide` / `call` | care | `apply_hide` / `apply_call` |
| `pick` | gift | needs a gift on the wood |
| `clean` / `bath` | care | desk tend / blotter buttons (not guest-choice marks) |
| `medicine` / `praise` / `shed` | care | tend / shed |
| `close` / `exit` | menu | dismiss overlay; Exit also unfocuses keeper card on overlay/web |

App-harness ids are the same with a `care.` prefix (`care.feed`). Bare ids still work.

## Run

```powershell
cd client
py -m computerpets_client.care_harness
py -m computerpets_client.care_harness --list
py -m computerpets_client.care_harness --only feed special close exit
py -m computerpets_client.app_harness --domain care
py -m pytest tests/test_care_harness.py tests/test_app_harness.py -q
```

Programmatic:

```python
from computerpets_client.care_harness import catalog, invoke, assert_action, run_all

print([a.id for a in catalog()])
result = invoke("feed")
assert not assert_action("feed", result)
```

## Exit / Close (guest options overlay)

Guest-click care menus (desktop overlay + web lockstep + blotter) always end with **Close** then **Exit**:

- **Close** — dismiss the options overlay only (same as Esc / re-tap toggle).
- **Exit** — dismiss and leave pet care: collapses the keeper card on overlay + web; blotter treats both as dismiss (no keeper card).
