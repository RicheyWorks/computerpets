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
    "Twig freezes a sash muntin as a pencil stem: walk onto the muntin, sit the freeze, then leave. "
    "Still still owns creep. Hang still owns reach. Stem still owns stilt. Anchor still owns hitch. "
    "This is the sixth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Column nests a sash stile as a timber gallery: walk onto the stile, sit the nest, then leave. "
    "Auger still owns bore. Dam still owns gnaw. Bank still owns dig. Twig still owns freeze. Dart still owns hawk. "
    "This is the seventh leftover of the remaining hive den."
)

LAST_OLD = (
    "2026-09-01 (Twig freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Column; catalog stays 220; freeze is the tell; Still still owns creep; "
    "Hang still owns reach; Stem still owns stilt; Anchor still owns hitch; Mast still owns seed; "
    "Dart still owns hawk; Spark the firefly still owns glow; Comb still owns waggle; Milk still owns weed)"
)
LAST_NEW = (
    "2026-09-01 (Column nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Seven; catalog stays 220; nest is the tell; Auger still owns bore; "
    "Dam still owns gnaw; Bank still owns dig; Twig still owns freeze; Dart still owns hawk; "
    "Spark the firefly still owns glow; Comb still owns waggle; Milk still owns weed)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Twig freezes a sash muntin as a pencil stem; sixth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Column; catalog stays 220; freeze is the tell; Still still owns creep; "
    "Hang still owns reach; Stem still owns stilt; Anchor still owns hitch; Mast still owns seed; "
    "Dart still owns hawk; Spark the firefly still owns glow; Comb still owns waggle; Milk still owns weed)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Column nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Seven; catalog stays 220; nest is the tell; Auger still owns bore; "
    "Dam still owns gnaw; Bank still owns dig; Twig still owns freeze; Dart still owns hawk; "
    "Spark the firefly still owns glow; Comb still owns waggle; Milk still owns weed)"
)

COLUMN_DONE = (
    "Column is done. Seventh leftover of the remaining hive den done. Shore ten stays closed. "
    "Next leftover is Seven. Do not start Seven."
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
n = road.count("Next leftover is Column. Do not start Column.")
if n < 1:
    raise SystemExit("no next leftover Column in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Column. Do not start Column.",
    COLUMN_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

COLUMN_BULLET = (
    "\n- [x] Column (`carpenter_ant` / `column`) nests a real sash stile as a timber gallery: walk onto the stile "
    "(structural timber — not Auger's sash-stile timber hole bore, "
    "not Dam's sash-stile lodge-cup gnaw, not Bank's window-stool sand-bank dig, "
    "not Twig's sash-muntin pencil-stem freeze, not Dart's lamp-side air hawk; "
    "she does not eat the house; she nests in it; scent road / grain / column of workers; "
    "named: Column. Nest first. Hello: \"I nest. I do not eat the house.\" Play: \"A gallery. Then workers. Review my work.\" "
    "Temperament: nest.), then leave. One window. The nest is the tell — not Auger's `bore`. Not Dam's `gnaw`. "
    "Not Bank's `dig`. Not Twig's `freeze`. Not Dart's `hawk`. Not Eft's `trail`. Not Prickle's `glue`. "
    "playFor(\"carpenter_ant\") returns `nest` (not `column`, not `bore`, not `trail`, not `chew`, not `scent`, not `carry`, not `glue`, not `freeze`, not `hawk`, not `road`, not `ant`). "
    "Auger (`carpenter_bee`) still owns `bore`. Dam (`beaver`) still owns `gnaw`. Bank (`mining_bee`) still owns `dig`. "
    "Twig (`stick`) still owns `freeze`. Dart (`darner`) still owns `hawk`. Spark the firefly (`firefly`) still owns `glow`. "
    "Comb (`honeybee`) still owns `waggle`. Milk (`monarch`) still owns `weed`. "
    "Same `playFor` door. `/demo/column` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Seventh leftover of the remaining hive den. Shore ten stays closed. Next leftover is Seven. Do not start Seven.\n"
)

marker = "- [x] Twig (`stick` / `twig`) freezes a real sash muntin as a pencil stem"
if marker not in road:
    raise SystemExit("MISSING twig bullet")
idx = road.find(marker)
end = road.find("\n- [x] Dart", idx)
if end < 0:
    end = road.find("\n- [x] Spark", idx)
if end < 0:
    end = road.find("\n- [x] Milk", idx)
if end < 0:
    raise SystemExit("MISSING bullet after twig")
road = road[:end] + COLUMN_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "column-done-replaced-count-was", n)
