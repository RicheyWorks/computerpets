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
    "Fold prays a window-box stem as a green hinge: walk onto the stem, sit the pray, then leave. "
    "Cape still owns fold. Bat still owns fold. Stem still owns stilt. Twig still owns freeze. Still still owns creep. "
    "Hang still owns reach. Snap still owns count. Haste still owns hunt. Seven still owns spot. "
    "This is the ninth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Brood emerges a window foot as a soil husk: walk onto the foot, sit, burst, sit the husk, then leave. "
    "Heap still owns castings. Hop still owns spring. Lid still owns shut. Prowl still owns carry. "
    "Fold still owns pray. Seven still owns spot. Drum still owns drum. Hum still owns drone. Thrum still owns forage. "
    "This is the tenth leftover of the remaining hive den and closes hive ten."
)

LAST_OLD = (
    "2026-09-01 (Fold prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Brood; catalog stays 220; pray is the tell; bat still owns fold; "
    "Stem still owns stilt; Twig still owns freeze; Still still owns creep; Hang still owns reach; "
    "Snap still owns count; Haste still owns hunt; Seven still owns spot)"
)
LAST_NEW = (
    "2026-09-01 (Brood emerges a window foot as a soil husk; tenth leftover of the remaining hive den done; hive ten closed; "
    "shore ten is closed; next leftover is Chirp; catalog stays 220; emerge is the tell; Heap still owns castings; "
    "Hop still owns spring; Lid still owns shut; Prowl still owns carry; Fold still owns pray; Seven still owns spot; "
    "bat still owns fold; Drum still owns drum; Hum still owns drone; Thrum still owns forage)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Fold prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Brood; catalog stays 220; pray is the tell; bat still owns fold; "
    "Stem still owns stilt; Twig still owns freeze; Still still owns creep; Hang still owns reach; "
    "Snap still owns count; Haste still owns hunt; Seven still owns spot)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Brood emerges a window foot as a soil husk; tenth leftover of the remaining hive den done; hive ten closed; "
    "shore ten is closed; next leftover is Chirp; catalog stays 220; emerge is the tell; Heap still owns castings; "
    "Hop still owns spring; Lid still owns shut; Prowl still owns carry; Fold still owns pray; Seven still owns spot; "
    "bat still owns fold; Drum still owns drum; Hum still owns drone; Thrum still owns forage)"
)

BROOD_DONE = (
    "Brood is done. Tenth leftover of the remaining hive den done. Hive ten closed. Shore ten stays closed. "
    "Next leftover is Chirp. Do not start Chirp."
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
n = road.count("Next leftover is Brood. Do not start Brood.")
if n < 1:
    raise SystemExit("no next leftover Brood in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Brood. Do not start Brood.",
    BROOD_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

BROOD_BULLET = (
    "\n- [x] Brood (`cicada` / `brood`) emerges a real window foot as a soil husk: walk onto the foot "
    "(the soil at the pane's foot — not Heap's window-foot wet-sand castings, not Hop's window-foot duff-cup spring, "
    "not Lid's window-foot leaf-dish shut, not Prowl's window-foot leaf-litter carry, not Fold's window-box stem pray, "
    "not Seven's window-box leaf spot, not Drum's upper-stile drum, not Hum's pane drone, not Thrum's window-box forage; "
    "seventeen years underground; then she emerges; sit, burst, sit; husk/relic; a periodical cicada, not a cricket, not Chirp; "
    "named: Brood. Emerge first. Hello: \"I emerged. You may wait.\" Play: \"A burst. Then the husk again.\" "
    "Temperament: patient.), then leave. One window. The emerge is the tell — not Heap's `castings`. Not Hop's `spring`. "
    "Not Lid's `shut`. Not Prowl's `carry`. Not Fold's `pray`. Not Seven's `spot`. Not Drum's `drum`. Not Hum's `drone`. Not Thrum's `forage`. "
    "playFor(\"cicada\") returns `emerge` (not `brood`, not `sing`, not `song`, not `drone`, not `drum`, not `hum`, not `thrum`, not `pulse`, not `chime`, not `pray`, not `spot`, not `nest`, not `fold`, not `burst`, not `wait`). "
    "Heap (`lugworm`) still owns `castings`. Hop (`springtail`) still owns `spring`. Lid (`box_turtle`) still owns `shut`. "
    "Prowl (`wolf_spider`) still owns `carry`. Fold (`mantis`) still owns `pray`. Seven (`ladybird`) still owns `spot`. "
    "Bat (`bat`) still owns `fold`. Drum (`pileated`) still owns `drum`. Hum (`honey_drone`) still owns `drone`. Thrum (`bumblebee`) still owns `forage`. "
    "Same `playFor` door. `/demo/brood` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Tenth leftover of the remaining hive den. Hive ten closed. Shore ten stays closed. Next leftover is Chirp. Do not start Chirp.\n"
)

marker = "- [x] Fold (`mantis` / `fold`) prays a real window-box stem as a green hinge"
if marker not in road:
    raise SystemExit("MISSING fold bullet")
idx = road.find(marker)
end = road.find("\n- [x] Seven", idx)
if end < 0:
    end = road.find("\n- [x] Spark", idx)
if end < 0:
    end = road.find("\n- [x] Ion", idx)
if end < 0:
    raise SystemExit("MISSING bullet after fold")
road = road[:end] + BROOD_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "brood-done-replaced-count-was", n)
