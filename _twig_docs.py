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
    "Dart hawks a lamp-side air as prey air: walk into the air, sit the hawk, then leave. "
    "Hook still owns soar. Haste still owns hunt. Spark the firefly still owns glow. "
    "This is the fifth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Twig freezes a sash muntin as a pencil stem: walk onto the muntin, sit the freeze, then leave. "
    "Still still owns creep. Hang still owns reach. Stem still owns stilt. Anchor still owns hitch. "
    "This is the sixth leftover of the remaining hive den."
)

LAST_OLD = (
    "2026-09-01 (Dart hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Twig; catalog stays 220; hawk is the tell; Hook still owns soar; "
    "Haste still owns hunt; Spark the firefly still owns glow; the dragon Spark still owns crackle; "
    "Ghost still owns week; Sip still owns sip; Comb still owns waggle; Milk still owns weed)"
)
LAST_NEW = (
    "2026-09-01 (Twig freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Column; catalog stays 220; freeze is the tell; Still still owns creep; "
    "Hang still owns reach; Stem still owns stilt; Anchor still owns hitch; Mast still owns seed; "
    "Dart still owns hawk; Spark the firefly still owns glow; Comb still owns waggle; Milk still owns weed)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Dart hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Twig; catalog stays 220; hawk is the tell; Hook still owns soar; "
    "Haste still owns hunt; Spark the firefly still owns glow; the dragon Spark still owns crackle; "
    "Ghost still owns week; Sip still owns sip; Comb still owns waggle; Milk still owns weed)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Twig freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Column; catalog stays 220; freeze is the tell; Still still owns creep; "
    "Hang still owns reach; Stem still owns stilt; Anchor still owns hitch; Mast still owns seed; "
    "Dart still owns hawk; Spark the firefly still owns glow; Comb still owns waggle; Milk still owns weed)"
)

TWIG_DONE = (
    "Twig is done. Sixth leftover of the remaining hive den done. Shore ten stays closed. "
    "Next leftover is Column. Do not start Column."
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
n = road.count("Next leftover is Twig. Do not start Twig.")
if n < 1:
    raise SystemExit("no next leftover Twig in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Twig. Do not start Twig.",
    TWIG_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

TWIG_BULLET = (
    "\n- [x] Twig (`stick` / `twig`) freezes a real sash muntin as a pencil stem: walk onto the muntin "
    "(the thin bar that divides the lights — not Still's sash parting-bead vine rail creep, "
    "not Hang's transom soffit bough hook reach, not Stem's parting-bead blotter stem stilt, "
    "not Anchor's parting-bead hitch, not Mast's stool acorn dish seed, not Dart's lamp-side air hawk), sit the freeze (the tell — a stick that agreed to be an insect; "
    "freezes first; furniture until it walks; a pencil that learned legs; "
    "named: Twig. Freeze first. Hello: \"I froze. That was hello.\" Play: \"A stick. Then legs. Review my work.\" "
    "Temperament: still.), then leave. One window. The freeze is the tell — not Still's `creep`. Not Hang's `reach`. "
    "Not Stem's `stilt`. Not Anchor's `hitch`. Not Mast's `seed`. Not Grin's `still`. Not Cape's `fold`. Not Prickle's `glue`. "
    "playFor(\"stick\") returns `freeze` (not `twig`, not `stick`, not `still`, not `fold`, not `hang`, not `creep`, not `glue`). "
    "Still (`potto`) still owns `creep`. Hang (`sloth`) still owns `reach`. Stem (`harvestman`) still owns `stilt`. "
    "Anchor (`seahorse`) still owns `hitch`. Mast (`oak`) still owns `seed`. Grin (`opossum`) still owns `still`. "
    "Dart (`darner`) still owns `hawk`. Spark the firefly (`firefly`) still owns `glow`. "
    "Comb (`honeybee`) still owns `waggle`. Milk (`monarch`) still owns `weed`. "
    "Same `playFor` door. `/demo/twig` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Sixth leftover of the remaining hive den. Shore ten stays closed. Next leftover is Column. Do not start Column.\n"
)

marker = "- [x] Dart (`darner` / `dart`) hawks a real lamp-side air as prey air"
if marker not in road:
    raise SystemExit("MISSING dart bullet")
idx = road.find(marker)
end = road.find("\n- [x] Spark", idx)
if end < 0:
    end = road.find("\n- [x] Milk", idx)
if end < 0:
    end = road.find("\n- [x] Comb", idx)
if end < 0:
    raise SystemExit("MISSING bullet after dart")
road = road[:end] + TWIG_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "twig-done-replaced-count-was", n)
