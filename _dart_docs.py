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
    "Spark the firefly glows a lower sash light as ink dusk: walk onto the light, sit the glow, then leave. "
    "The dragon Spark still crackles an edge. Wink still owns flash. Ghost still owns week. "
    "This is the fourth leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Dart hawks a lamp-side air as prey air: walk into the air, sit the hawk, then leave. "
    "Hook still owns soar. Haste still owns hunt. Spark the firefly still owns glow. "
    "This is the fifth leftover of the remaining hive den."
)

LAST_OLD = (
    "2026-09-01 (Spark the firefly glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Dart; catalog stays 220; glow is the tell; the dragon Spark still owns crackle; "
    "Wink still owns flash; Ember still owns kindle; Ghost still owns week; Night still owns dusk; Comb still owns waggle; Milk still owns weed)"
)
LAST_NEW = (
    "2026-09-01 (Dart hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Twig; catalog stays 220; hawk is the tell; Hook still owns soar; "
    "Haste still owns hunt; Spark the firefly still owns glow; the dragon Spark still owns crackle; "
    "Ghost still owns week; Sip still owns sip; Comb still owns waggle; Milk still owns weed)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Spark the firefly glows a lower sash light as ink dusk; fourth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Dart; catalog stays 220; glow is the tell; the dragon Spark still owns crackle; "
    "Wink still owns flash; Ember still owns kindle; Ghost still owns week; Night still owns dusk; Comb still owns waggle; Milk still owns weed)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Dart hawks a lamp-side air as prey air; fifth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Twig; catalog stays 220; hawk is the tell; Hook still owns soar; "
    "Haste still owns hunt; Spark the firefly still owns glow; the dragon Spark still owns crackle; "
    "Ghost still owns week; Sip still owns sip; Comb still owns waggle; Milk still owns weed)"
)

DART_DONE = (
    "Dart is done. Fifth leftover of the remaining hive den done. Shore ten stays closed. "
    "Next leftover is Twig. Do not start Twig."
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
n = road.count("Next leftover is Dart. Do not start Dart.")
if n < 1:
    raise SystemExit("no next leftover Dart in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Dart. Do not start Dart.",
    DART_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

DART_BULLET = (
    "\n- [x] Dart (`darner` / `dart`) hawks a real lamp-side air as prey air: walk into the air "
    "(the open air on the lamp side of the glass — not Hook's lamp-post stile soar, "
    "not Haste's sash-jamb crack hunt, not Spark the firefly's lower sash light glow, "
    "not Ghost's lamp-side glass week, not Sip's window-box bloom, not Sun's upper sash warm), sit the hawk (the tell — an adult darner, not the nymph; "
    "named: Dart. Hunt on the wing. Hello: \"I hawked. That was hello.\" Play: \"A patrol. Then a stoop. Review my work.\" "
    "Temperament: hunting.), then leave. One window. The hawk is the tell — not Hook's `soar`. Not Haste's `hunt`. "
    "Not Spark the firefly's `glow`. Not the dragon Spark's `crackle`. Not Ghost's `week`. Not Sip's `sip`. "
    "playFor(\"darner\") returns `hawk` (not `dart`, not `hunt`, not `soar`, not `glow`, not `sip`, not `week`). "
    "Hook (`red_tail`) still owns `soar`. Haste (`house_centipede`) still owns `hunt`. Spark the firefly (`firefly`) still owns `glow`. "
    "The dragon Spark (`spark_dragon`) still owns `crackle`. Ghost (`luna`) still owns `week`. Sip (`hummingbird`) still owns `sip`. "
    "Comb (`honeybee`) still owns `waggle`. Milk (`monarch`) still owns `weed`. "
    "Same `playFor` door. `/demo/dart` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Fifth leftover of the remaining hive den. Shore ten stays closed. Next leftover is Twig. Do not start Twig.\n"
)

marker = "- [x] Spark (`firefly` / `spark`) glows a real lower sash light as ink dusk"
if marker not in road:
    raise SystemExit("MISSING spark bullet")
idx = road.find(marker)
end = road.find("\n- [x] Milk", idx)
if end < 0:
    raise SystemExit("MISSING milk after spark")
road = road[:end] + DART_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "dart-done-replaced-count-was", n)
