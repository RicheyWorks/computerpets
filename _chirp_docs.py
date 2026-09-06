from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label + " in current")
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

HEADER = (
    "Brood emerges a window foot as a soil husk: walk onto the foot, sit, burst, sit the husk, then leave. "
    "Heap still owns castings. Hop still owns spring. Lid still owns shut. Prowl still owns carry. "
    "Fold still owns pray. Seven still owns spot. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the tenth leftover of the remaining hive den and closes hive ten."
)
HEADER_NEW = HEADER + (
    " Chirp songs a window stool as a grass dish: walk onto the stool, sit the song, hold the night, then leave. "
    "Brood still owns emerge. Gecko still owns chirp. Swing still owns sing. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the first leftover of the meadow den."
)

LAST_OLD = (
    "2026-09-01 (Brood emerges a window foot as a soil husk; tenth leftover of the remaining hive den done; hive ten closed; "
    "shore ten is closed; next leftover is Chirp; catalog stays 220; emerge is the tell; Heap still owns castings; "
    "Hop still owns spring; Lid still owns shut; Prowl still owns carry; Fold still owns pray; Seven still owns spot; "
    "bat still owns fold; Drum still owns drum; Hum still owns drone; Thrum still owns forage)"
)
LAST_NEW = (
    "2026-09-01 (Chirp songs a window stool as a grass dish; first leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Blade; catalog stays 220; song is the tell; "
    "Brood still owns emerge; gecko still owns chirp; Swing still owns sing; Drum still owns drum; "
    "Hum still owns drone; Thrum still owns forage)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Brood emerges a window foot as a soil husk; tenth leftover of the remaining hive den done; hive ten closed; "
    "shore ten is closed; next leftover is Chirp; catalog stays 220; emerge is the tell; Heap still owns castings; "
    "Hop still owns spring; Lid still owns shut; Prowl still owns carry; Fold still owns pray; Seven still owns spot; "
    "bat still owns fold; Drum still owns drum; Hum still owns drone; Thrum still owns forage)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Chirp songs a window stool as a grass dish; first leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Blade; catalog stays 220; song is the tell; "
    "Brood still owns emerge; gecko still owns chirp; Swing still owns sing; Drum still owns drum; "
    "Hum still owns drone; Thrum still owns forage)"
)

CHIRP_DONE = (
    "Chirp is done. First leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Blade. Do not start Blade."
)

for p in ["README.md", "desktop/README.md"]:
    text, nl = load(p)
    text = must_replace(text, HEADER, HEADER_NEW, p + " header")
    save(p, text, nl)
    print("ok", p)

arch, nl = load("docs/ARCHITECTURE.md")
arch = must_replace(arch, LAST_OLD, LAST_NEW, "arch last")
save("docs/ARCHITECTURE.md", arch, nl)
print("ok arch")

road, nl = load("docs/ROADMAP.md")
n = road.count("Next leftover is Chirp. Do not start Chirp.")
if n < 1:
    raise SystemExit("no next leftover Chirp in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Chirp. Do not start Chirp.",
    CHIRP_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

CHIRP_BULLET = (
    "\n- [x] Chirp (`field_cricket` / `chirp`) songs a real window stool as a grass dish: walk onto the stool "
    "(papers are grass — the same furniture family Pale sands as dry sand, Ledger plows as a sand tray, and Cache buries as an oak dish, "
    "not Brood's window-foot soil-husk emerge, not Pad/gecko's lamp-side jamb chirp, not Swing's lamp-side stile sing, "
    "not Drum's upper-stile drum, not Hum's pane drone, not Thrum's window-box forage; "
    "the song is the tell; she sings the night; a cricket is not a cicada; named: Chirp. Song first. "
    "Hello: \"I sang. Hello.\" Play: \"A song. Review the grass.\" Temperament: singing.), then leave. One window. "
    "The song is the tell — not Brood's `emerge`. Not Pad's `chirp`. Not Swing's `sing`. Not Drum's `drum`. Not Hum's `drone`. Not Thrum's `forage`. "
    "playFor(\"field_cricket\") returns `song` (not `chirp`, not `sing`, not `emerge`, not `drone`, not `drum`, not `hum`, not `thrum`, not `pray`, not `spot`, not `brood`, not `sill`). "
    "Brood (`cicada`) still owns `emerge`. Gecko (`gecko`) still owns `chirp`. Swing (`gibbon`) still owns `sing`. "
    "Drum (`pileated`) still owns `drum`. Hum (`honey_drone`) still owns `drone`. Thrum (`bumblebee`) still owns `forage`. "
    "Same `playFor` door. `/demo/chirp` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. First leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Blade. Do not start Blade.\n"
)

marker = "- [x] Brood (`cicada` / `brood`) emerges a real window foot as a soil husk"
if marker not in road:
    raise SystemExit("MISSING brood bullet")
idx = road.find(marker)
# insert after Brood bullet line (ends at next \n- [x] or after the long line)
# Brood bullet is one long line; find its end
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    raise SystemExit("MISSING bullet after brood")
road = road[:end] + CHIRP_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "chirp-done-replaced-count-was", n)
