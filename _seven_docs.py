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
    "Column nests a sash stile as a timber gallery: walk onto the stile, sit the nest, then leave. "
    "Auger still owns bore. Dam still owns gnaw. Bank still owns dig. Twig still owns freeze. Dart still owns hawk. "
    "This is the seventh leftover of the remaining hive den."
)
HEADER_NEW = HEADER + (
    " Seven spots a window-box leaf as a leaf dish: walk onto the leaf, sit the spot, then leave. "
    "Haste still owns hunt. Disc still owns snip. Thrum still owns forage. Sip still owns sip. Comb still owns waggle. "
    "This is the eighth leftover of the remaining hive den."
)

LAST_OLD = (
    "2026-09-01 (Column nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Seven; catalog stays 220; nest is the tell; Auger still owns bore; "
    "Dam still owns gnaw; Bank still owns dig; Twig still owns freeze; Dart still owns hawk; "
    "Spark the firefly still owns glow; Comb still owns waggle; Milk still owns weed)"
)
LAST_NEW = (
    "2026-09-01 (Seven spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Fold; catalog stays 220; spot is the tell; Haste still owns hunt; "
    "Disc still owns snip; Thrum still owns forage; Sip still owns sip; Comb still owns waggle; "
    "Column still owns nest; Twig still owns freeze; Dart still owns hawk)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Column nests a sash stile as a timber gallery; seventh leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Seven; catalog stays 220; nest is the tell; Auger still owns bore; "
    "Dam still owns gnaw; Bank still owns dig; Twig still owns freeze; Dart still owns hawk; "
    "Spark the firefly still owns glow; Comb still owns waggle; Milk still owns weed)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Seven spots a window-box leaf as a leaf dish; eighth leftover of the remaining hive den done; "
    "shore ten is closed; next leftover is Fold; catalog stays 220; spot is the tell; Haste still owns hunt; "
    "Disc still owns snip; Thrum still owns forage; Sip still owns sip; Comb still owns waggle; "
    "Column still owns nest; Twig still owns freeze; Dart still owns hawk)"
)

SEVEN_DONE = (
    "Seven is done. Eighth leftover of the remaining hive den done. Shore ten stays closed. "
    "Next leftover is Fold. Do not start Fold."
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
n = road.count("Next leftover is Seven. Do not start Seven.")
if n < 1:
    raise SystemExit("no next leftover Seven in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Seven. Do not start Seven.",
    SEVEN_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

SEVEN_BULLET = (
    "\n- [x] Seven (`ladybird` / `seven`) spots a real window-box leaf as a leaf dish: walk onto the leaf "
    "(window-box foliage — not Disc's window-box leaf foliage snip, "
    "not Thrum's window-box meadow forage, not Sip's window-box bloom sip, "
    "not Haste's sash-jamb crack hunt, not Comb's sill-pan wax waggle; "
    "seven spots; she eats aphids; a beetle, not a rumor of luck; "
    "named: Seven. Spot first. Hello: \"I counted. Hello.\" Play: \"A hunt. Then I am a bead again.\" "
    "Temperament: tidy.), then leave. One window. The spot is the tell — not Haste's `hunt`. Not Disc's `snip`. "
    "Not Thrum's `forage`. Not Sip's `sip`. Not Comb's `waggle`. Not Column's `nest`. Not Twig's `freeze`. Not Dart's `hawk`. "
    "playFor(\"ladybird\") returns `spot` (not `seven`, not `hunt`, not `count`, not `nest`, not `freeze`, not `hawk`, not `bore`, not `trail`, not `lady`, not `aphid`, not `beetle`). "
    "Haste (`house_centipede`) still owns `hunt`. Disc (`leafcutter`) still owns `snip`. Thrum (`bumblebee`) still owns `forage`. "
    "Sip (`hummingbird`) still owns `sip`. Comb (`honeybee`) still owns `waggle`. Column (`carpenter_ant`) still owns `nest`. "
    "Twig (`stick`) still owns `freeze`. Dart (`darner`) still owns `hawk`. "
    "Same `playFor` door. `/demo/seven` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Eighth leftover of the remaining hive den. Shore ten stays closed. Next leftover is Fold. Do not start Fold.\n"
)

marker = "- [x] Column (`carpenter_ant` / `column`) nests a real sash stile as a timber gallery"
if marker not in road:
    raise SystemExit("MISSING column bullet")
idx = road.find(marker)
end = road.find("\n- [x] Spark", idx)
if end < 0:
    end = road.find("\n- [x] Ion", idx)
if end < 0:
    raise SystemExit("MISSING bullet after column")
road = road[:end] + SEVEN_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "seven-done-replaced-count-was", n)
