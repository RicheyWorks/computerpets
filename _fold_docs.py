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
    "Seven spots a window-box leaf as a leaf dish: walk onto the leaf, sit the spot, then leave. "
    "Haste still owns hunt. Disc still owns snip. Thrum still owns forage. Sip still owns sip. Comb still owns waggle. "
    "This is the eighth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Fold prays a window-box stem as a green hinge: walk onto the stem, sit the pray, then leave. "
    "Cape still owns fold. Bat still owns fold. Stem still owns stilt. Twig still owns freeze. Still still owns creep. "
    "Hang still owns reach. Snap still owns count. Haste still owns hunt. Seven still owns spot. "
    "This is the ninth leftover of the remaining hive den."
)

LAST_OLD = (
    "2026-09-01 (Seven spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Fold; catalog stays 220; spot is the tell; Haste still owns hunt; "
    "Disc still owns snip; Thrum still owns forage; Sip still owns sip; Comb still owns waggle; "
    "Column still owns nest; Twig still owns freeze; Dart still owns hawk)"
)
LAST_NEW = (
    "2026-09-01 (Fold prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Brood; catalog stays 220; pray is the tell; bat still owns fold; "
    "Stem still owns stilt; Twig still owns freeze; Still still owns creep; Hang still owns reach; "
    "Snap still owns count; Haste still owns hunt; Seven still owns spot)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Seven spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Fold; catalog stays 220; spot is the tell; Haste still owns hunt; "
    "Disc still owns snip; Thrum still owns forage; Sip still owns sip; Comb still owns waggle; "
    "Column still owns nest; Twig still owns freeze; Dart still owns hawk)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Fold prays a window-box stem as a green hinge; ninth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Brood; catalog stays 220; pray is the tell; bat still owns fold; "
    "Stem still owns stilt; Twig still owns freeze; Still still owns creep; Hang still owns reach; "
    "Snap still owns count; Haste still owns hunt; Seven still owns spot)"
)

FOLD_DONE = (
    "Fold is done. Ninth leftover of the remaining hive den done. Shore ten stays closed. "
    "Next leftover is Brood. Do not start Brood."
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
n = road.count("Next leftover is Fold. Do not start Fold.")
if n < 1:
    raise SystemExit("no next leftover Fold in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Fold. Do not start Fold.",
    FOLD_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

FOLD_BULLET = (
    "\n- [x] Fold (`mantis` / `fold`) prays a real window-box stem as a green hinge: walk onto the stem "
    "(window-box plant stem — not Stem's sash parting-bead blotter stem stilt, "
    "not Twig's sash muntin pencil-stem freeze, not Still's sash parting-bead vine rail creep, "
    "not Hang's transom soffit bough hook reach, not Snap's meeting-rail wetland cup count, "
    "not Haste's sash-jamb crack hunt, not Seven's window-box leaf dish spot; "
    "an insect that hunts; she is not a plant; prayer is a trap; green hinge on a stem; "
    "named: Fold. Pray first. Hello: \"I did not strike. That is hello.\" Play: \"A fold. Then I am a stem again.\" "
    "Temperament: watchful.), then leave. One window. The pray is the tell — not bat's `fold`. Not Stem's `stilt`. "
    "Not Twig's `freeze`. Not Still's `creep`. Not Hang's `reach`. Not Snap's `count`. Not Haste's `hunt`. Not Seven's `spot`. "
    "playFor(\"mantis\") returns `pray` (not `fold`, not `hunt`, not `spot`, not `nest`, not `freeze`, not `hawk`, not `snap`, not `still`, not `strike`, not `trap`, not `wait`). "
    "Bat (`bat`) still owns `fold`. Stem (`harvestman`) still owns `stilt`. Twig (`stick`) still owns `freeze`. "
    "Still (`potto`) still owns `creep`. Hang (`sloth`) still owns `reach`. Snap (`venus_flytrap`) still owns `count`. "
    "Haste (`house_centipede`) still owns `hunt`. Seven (`ladybird`) still owns `spot`. "
    "Same `playFor` door. `/demo/fold` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Ninth leftover of the remaining hive den. Shore ten stays closed. Next leftover is Brood. Do not start Brood.\n"
)

marker = "- [x] Seven (`ladybird` / `seven`) spots a real window-box leaf as a leaf dish"
if marker not in road:
    raise SystemExit("MISSING seven bullet")
idx = road.find(marker)
end = road.find("\n- [x] Spark", idx)
if end < 0:
    end = road.find("\n- [x] Ion", idx)
if end < 0:
    raise SystemExit("MISSING bullet after seven")
road = road[:end] + FOLD_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "fold-done-replaced-count-was", n)
