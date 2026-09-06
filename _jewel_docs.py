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
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

HEADER = (
    "Banner tails a window stool as a blossom dish: walk onto the stool, sit, banner once, sit the dish, then leave. "
    "Vault still owns jump. Blade still owns leaf. Chirp still owns song. Milk still owns weed. Ghost still owns week. "
    "This is the fourth leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Jewel blacks a glass rim as a stream jewel: walk onto the rim, sit, jewel once, sit the jewel, then leave. "
    "Banner still owns tails. Dart still owns hawk. Bat still owns fold. Vault still owns jump. Blade still owns leaf. "
    "This is the fifth leftover of the meadow den."
)

LAST_OLD = (
    "2026-09-02 (Banner tails a window stool as a blossom dish; fourth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Jewel; catalog stays 220; tails are the tell; "
    "Vault still owns jump; Blade still owns leaf; Chirp still owns song; Milk still owns weed; "
    "Ghost still owns week; gecko still owns chirp)"
)
LAST_NEW = (
    "2026-09-02 (Jewel blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Lace; catalog stays 220; black is the tell; "
    "Banner still owns tails; Dart still owns hawk; Bat still owns fold; Vault still owns jump; "
    "Blade still owns leaf; gecko still owns chirp)"
)

ROADMAP_LAST_OLD = (
    "2026-09-02 (Phase 6 leftover: Banner tails a window stool as a blossom dish; fourth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Jewel; catalog stays 220; tails are the tell; "
    "Vault still owns jump; Blade still owns leaf; Chirp still owns song; Milk still owns weed; "
    "Ghost still owns week; gecko still owns chirp)"
)
ROADMAP_LAST_NEW = (
    "2026-09-02 (Phase 6 leftover: Jewel blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Lace; catalog stays 220; black is the tell; "
    "Banner still owns tails; Dart still owns hawk; Bat still owns fold; Vault still owns jump; "
    "Blade still owns leaf; gecko still owns chirp)"
)

JEWEL_DONE = (
    "Jewel is done. Fifth leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Lace. Do not start Lace. Forceps (earwig) is later meadow — after Lace."
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
n = road.count("Next leftover is Jewel. Do not start Jewel.")
if n < 1:
    raise SystemExit("no next leftover Jewel in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Jewel. Do not start Jewel.",
    JEWEL_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

JEWEL_BULLET = (
    "\n- [x] Jewel (`jewelwing` / `jewel`) blacks a real glass rim as a stream jewel: walk onto the rim "
    "(the glass edge — the same furniture family Whorl rasps as her own house, "
    "not Dart's lamp-side-air prey-air hawk, not Banner's window-stool blossom-dish tails, not Vault's window-apron grass-plate jump, "
    "not Blade's sash-horn leaf rim, not Chirp's window-stool grass-dish song, not Fold's window-box-stem green-hinge pray, not Sip's window-box-bloom nectar-cup sip; "
    "black wings are the tell; a damselfly who folds, not a darner who hawks; she sits then jewels then sits; rim kept my jewel; stream; named: Jewel. Black first. "
    "Hello: \"I kept the black. Hello.\" Play: \"A rim. Review the jewel.\" Temperament: jeweled.), then leave. One window. "
    "Black is the tell — not Dart's `hawk`. Not Banner's `tails`. Not bat's `fold`. Not Sail's `cling`. Not Wink's `flash`. Not Vault's `jump`. Not Blade's `leaf`. Not Chirp's `song`. "
    "playFor(\"jewelwing\") returns `black` (not `jewel`, not `hawk`, not `fold`, not `cling`, not `flash`, not `perch`, not `tails`, not `jump`, not `leaf`, not `song`, not `dart`, not `sheen`, not `damsel`, not `sill`). "
    "Banner (`swallowtail`) still owns `tails`. Dart (`darner`) still owns `hawk`. Bat (`bat`) still owns `fold`. "
    "Vault (`grasshopper`) still owns `jump`. Blade (`katydid`) still owns `leaf`. Chirp (`field_cricket`) still owns `song`. "
    "Same `playFor` door. `/demo/jewel` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Fifth leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Lace. Do not start Lace. Forceps (earwig) is later meadow — after Lace.\n"
)

marker = "- [x] Banner (`swallowtail` / `banner`) tails a real window stool as a blossom dish"
if marker not in road:
    raise SystemExit("MISSING banner bullet")
idx = road.find(marker)
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    end = road.find("\n\n", idx + 10)
    if end < 0:
        raise SystemExit("MISSING bullet after banner")
road = road[:end] + JEWEL_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "jewel-done-replaced-count-was", n)

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
old_title_start = 'test("Banner leftover tails a window stool as a blossom dish; fourth leftover of the meadow den done;'
if old_title_start not in house:
    raise SystemExit("MISSING house banner title")
house = must_replace(
    house,
    'test("Banner leftover tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    'test("Jewel leftover blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    "house title open",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Jewel;",
    "shore ten is closed; next leftover is Lace;",
    "house next Lace",
)
# also any "Do not start Jewel" in title?
if "Do not start Jewel" in house:
    house = house.replace("Do not start Jewel", "Do not start Lace", 1)
    print("replaced do not start in house title")
n = house.count('assert.equal(WP.playFor("jewelwing"), "sill");')
print("house jewelwing sill", n)
if n != 2:
    raise SystemExit("unexpected house jewelwing sill count")
house = house.replace('assert.equal(WP.playFor("jewelwing"), "sill");', 'assert.equal(WP.playFor("lacewing"), "sill");', 1)
JEWEL_ASSERTS = """
  assert.equal(WP.playFor("jewelwing"), "black");
  assert.equal(WP.BLACK, "black");
  assert.notEqual(WP.playFor("jewelwing"), "jewel");
  assert.notEqual(WP.playFor("jewelwing"), "hawk");
  assert.notEqual(WP.playFor("jewelwing"), "fold");
  assert.notEqual(WP.playFor("jewelwing"), "cling");
  assert.notEqual(WP.playFor("jewelwing"), "flash");
  assert.notEqual(WP.playFor("jewelwing"), "perch");
  assert.notEqual(WP.playFor("jewelwing"), "tails");
  assert.notEqual(WP.playFor("jewelwing"), "jump");
  assert.notEqual(WP.playFor("jewelwing"), "leaf");
  assert.notEqual(WP.playFor("jewelwing"), "song");
  assert.notEqual(WP.playFor("jewelwing"), "dart");
  assert.notEqual(WP.playFor("jewelwing"), "sheen");
  assert.notEqual(WP.playFor("jewelwing"), "damsel");
  assert.notEqual(WP.playFor("jewelwing"), "sill");
  assert.equal(WP.playFor("swallowtail"), "tails");
  assert.equal(WP.TAILS, "tails");
  assert.equal(WP.playFor("darner"), "hawk");
  assert.equal(WP.HAWK, "hawk");
  assert.equal(WP.playFor("bat"), "fold");
  assert.equal(WP.playFor("grasshopper"), "jump");
  assert.equal(WP.JUMP, "jump");
  assert.equal(WP.playFor("katydid"), "leaf");
  assert.equal(WP.LEAF, "leaf");
  assert.equal(WP.playFor("field_cricket"), "song");
  assert.equal(WP.SONG, "song");
  assert.equal(WP.playFor("lacewing"), "sill");
"""
if house.count('assert.equal(WP.playFor("jewelwing"), "sill");') != 1:
    raise SystemExit("expected one remaining jewelwing sill")
house = house.replace(
    '  assert.equal(WP.playFor("jewelwing"), "sill");\n});',
    JEWEL_ASSERTS + '});',
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")
