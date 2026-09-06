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
    "Ghost weeks a lamp-side glass as lamp dusk: walk onto the glass, sit the week, then leave. "
    "Night still owns dusk. Moth still owns mount. Milk still owns weed. "
    "This is the third leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Spark the firefly glows a lower sash light as ink dusk: walk onto the light, sit the glow, then leave. "
    "The dragon Spark still crackles an edge. Wink still owns flash. Ghost still owns week. "
    "This is the fourth leftover of the remaining hive den."
)

LAST_OLD = (
    "2026-09-01 (Ghost weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Spark; catalog stays 220; week is the tell; Night still owns dusk; "
    "Moth still owns mount; Milk still owns weed; Loom still owns web; Comb still owns waggle; Fan still owns gold; Pale still owns sand)"
)
LAST_NEW = (
    "2026-09-01 (Spark the firefly glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Dart; catalog stays 220; glow is the tell; the dragon Spark still owns crackle; "
    "Wink still owns flash; Ember still owns kindle; Ghost still owns week; Night still owns dusk; Comb still owns waggle; Milk still owns weed)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Ghost weeks a lamp-side glass as lamp dusk; third leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Spark; catalog stays 220; week is the tell; Night still owns dusk; "
    "Moth still owns mount; Milk still owns weed; Loom still owns web; Comb still owns waggle; Fan still owns gold; Pale still owns sand)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Spark the firefly glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Dart; catalog stays 220; glow is the tell; the dragon Spark still owns crackle; "
    "Wink still owns flash; Ember still owns kindle; Ghost still owns week; Night still owns dusk; Comb still owns waggle; Milk still owns weed)"
)

SPARK_DONE = (
    "Spark is done. Fourth leftover of the remaining hive den done. Shore ten stays closed. "
    "Next leftover is Dart. Do not start Dart."
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
n = road.count("Next leftover is Spark. Do not start Spark.")
if n < 1:
    raise SystemExit("no next leftover Spark in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Spark. Do not start Spark.",
    SPARK_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

GHOST_BULLET_END = (
    "Catalog stays 220. Third leftover of the remaining hive den. Shore ten stays closed. "
    + SPARK_DONE
)
# After Ghost bullet, insert Spark bullet. Find unique Ghost playFor line ending.
SPARK_BULLET = (
    "\n- [x] Spark (`firefly` / `spark`) glows a real lower sash light as ink dusk: walk onto the light "
    "(the light — the same furniture family Drake tips as an ink dish and Gale runs as a dry dish, not Drake's tip, "
    "not Gale's run, not Ghost's lamp-side glass week, not Night's lamp-side stile dusk, not Wink's sash-stile flash, "
    "not Ember's kindle, not Slick's pane slide), sit the glow (the tell — a beetle, not a fly; the flash is a sentence; "
    "named: Spark. I am a beetle who learned a lamp. Hello: \"I flashed. That was hello.\" Play: \"A flash. Then another. Review my work.\" "
    "Temperament: signaling.), then leave. One window. The glow is the tell — not the dragon Spark's `crackle`. Not Wink's `flash`. "
    "Not Ember's `kindle`. Not Ghost's `week`. Not Night's `dusk`. Not Drake's `tip`. Not Gale's `run`. "
    "playFor(\"firefly\") returns `glow` (not `spark`, not `crackle`, not `flash`, not `kindle`, not `week`, not `dusk`). "
    "The dragon Spark (`spark_dragon`) still owns `crackle`. Wink (`anole`) still owns `flash`. Ember (`phoenix`) still owns `kindle`. "
    "Ghost (`luna`) still owns `week`. Night (`walleye`) still owns `dusk`. Comb (`honeybee`) still owns `waggle`. Milk (`monarch`) still owns `weed`. "
    "Drake (`mallard`) still owns `tip`. Gale (`solifuge`) still owns `run`. Same `playFor` door. `/demo/spark` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Fourth leftover of the remaining hive den. Shore ten stays closed. Next leftover is Dart. Do not start Dart.\n"
)

marker = "- [x] Ghost (`luna` / `ghost`) weeks a real lamp-side glass as lamp dusk"
if marker not in road:
    raise SystemExit("MISSING ghost bullet")
# insert Spark bullet immediately after the Ghost bullet paragraph (ends at next blank line after marker)
idx = road.find(marker)
end = road.find("\n- [x] Milk", idx)
if end < 0:
    raise SystemExit("MISSING milk after ghost")
road = road[:end] + SPARK_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "spark-done-count-was", n)
