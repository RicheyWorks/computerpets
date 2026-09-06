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
    "Jewel blacks a glass rim as a stream jewel: walk onto the rim, sit, jewel once, sit the jewel, then leave. "
    "Banner still owns tails. Dart still owns hawk. Bat still owns fold. Vault still owns jump. Blade still owns leaf. "
    "This is the fifth leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Lace nets a window stool as a leaf dish: walk onto the stool, sit, lace once, sit the dish, then leave. "
    "Jewel still owns black. Banner still owns tails. Ghost still owns week. Moth still owns mount. Seven still owns spot. "
    "This is the sixth leftover of the meadow den."
)

LAST_OLD = (
    "2026-09-02 (Jewel blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Lace; catalog stays 220; black is the tell; "
    "Banner still owns tails; Dart still owns hawk; Bat still owns fold; Vault still owns jump; "
    "Blade still owns leaf; gecko still owns chirp)"
)
LAST_NEW = (
    "2026-09-02 (Lace nets a window stool as a leaf dish; sixth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Forceps; catalog stays 220; net is the tell; "
    "Jewel still owns black; Banner still owns tails; Ghost still owns week; Moth still owns mount; "
    "Seven still owns spot; gecko still owns chirp)"
)

ROADMAP_LAST_OLD = (
    "2026-09-02 (Phase 6 leftover: Jewel blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Lace; catalog stays 220; black is the tell; "
    "Banner still owns tails; Dart still owns hawk; Bat still owns fold; Vault still owns jump; "
    "Blade still owns leaf; gecko still owns chirp)"
)
ROADMAP_LAST_NEW = (
    "2026-09-02 (Phase 6 leftover: Lace nets a window stool as a leaf dish; sixth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Forceps; catalog stays 220; net is the tell; "
    "Jewel still owns black; Banner still owns tails; Ghost still owns week; Moth still owns mount; "
    "Seven still owns spot; gecko still owns chirp)"
)

LACE_DONE = (
    "Lace is done. Sixth leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Forceps. Do not start Forceps. Snout (acorn weevil) is later meadow — after Forceps."
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
n = road.count("Next leftover is Lace. Do not start Lace.")
if n < 1:
    raise SystemExit("no next leftover Lace in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Lace. Do not start Lace. Forceps (earwig) is later meadow — after Lace.",
    LACE_DONE,
)
# also plain without Forceps clause if any remain
if "Next leftover is Lace. Do not start Lace." in road:
    road = road.replace("Next leftover is Lace. Do not start Lace.", LACE_DONE)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

LACE_BULLET = (
    "\n- [x] Lace (`lacewing` / `lace`) nets a real window stool as a leaf dish: walk onto the stool "
    "(the stool — the same furniture family Chirp songs as a grass dish and Banner tails as a blossom dish, "
    "not Jewel's glass-rim stream-jewel black, not Ghost's lamp-side-glass week, not Moth's jamb-bark mount, "
    "not Seven's window-box-leaf spot, not Sip's window-box-bloom nectar-cup sip, not Blade's sash-horn leaf rim; "
    "the lace/net of the wings is the tell; not a moth; the larva is the lion; she sits then laces then sits; dish kept my green; leaf; named: Lace. Net first. "
    "Hello: \"I laced. Hello.\" Play: \"A lace. Review the wings.\" Temperament: laced.), then leave. One window. "
    "Net is the tell — not Ghost's `week`. Not Moth's `mount`. Not Jewel's `black`. Not Banner's `tails`. Not Dart's `hawk`. Not Vault's `jump`. Not Blade's `leaf`. Not Chirp's `song`. Not Seven's `spot`. Not Vein's `unfurl`. "
    "playFor(\"lacewing\") returns `net` (not `lace`, not `week`, not `mount`, not `gold`, not `black`, not `hawk`, not `tails`, not `jump`, not `leaf`, not `song`, not `thread`, not `hunt`, not `spot`, not `vein`, not `unfurl`, not `sill`). "
    "Jewel (`jewelwing`) still owns `black`. Banner (`swallowtail`) still owns `tails`. Ghost (`luna`) still owns `week`. "
    "Moth (`moth`) still owns `mount`. Seven (`ladybug`) still owns `spot`. "
    "Same `playFor` door. `/demo/lace` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Sixth leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Forceps. Do not start Forceps. Snout (acorn weevil) is later meadow — after Forceps.\n"
)

marker = "- [x] Jewel (`jewelwing` / `jewel`) blacks a real glass rim as a stream jewel"
if marker not in road:
    raise SystemExit("MISSING jewel bullet")
idx = road.find(marker)
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    end = road.find("\n\n", idx + 10)
    if end < 0:
        raise SystemExit("MISSING bullet after jewel")
road = road[:end] + LACE_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "lace-done-replaced")

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
house = must_replace(
    house,
    'test("Jewel leftover blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    'test("Lace leftover nets a window stool as a leaf dish; sixth leftover of the meadow den done; Jewel leftover still blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    "house title open",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Lace;",
    "shore ten is closed; next leftover is Forceps;",
    "house next Forceps",
)
if "Do not start Lace" in house:
    house = house.replace("Do not start Lace", "Do not start Forceps", 1)
    print("replaced do not start in house title")
n = house.count('assert.equal(WP.playFor("lacewing"), "sill");')
print("house lacewing sill", n)
if n != 2:
    raise SystemExit("unexpected house lacewing sill count")
house = house.replace('assert.equal(WP.playFor("lacewing"), "sill");', 'assert.equal(WP.playFor("earwig"), "sill");', 1)
LACE_ASSERTS = """
  assert.equal(WP.playFor("lacewing"), "net");
  assert.equal(WP.NET, "net");
  assert.notEqual(WP.playFor("lacewing"), "lace");
  assert.notEqual(WP.playFor("lacewing"), "week");
  assert.notEqual(WP.playFor("lacewing"), "mount");
  assert.notEqual(WP.playFor("lacewing"), "gold");
  assert.notEqual(WP.playFor("lacewing"), "black");
  assert.notEqual(WP.playFor("lacewing"), "hawk");
  assert.notEqual(WP.playFor("lacewing"), "tails");
  assert.notEqual(WP.playFor("lacewing"), "jump");
  assert.notEqual(WP.playFor("lacewing"), "leaf");
  assert.notEqual(WP.playFor("lacewing"), "song");
  assert.notEqual(WP.playFor("lacewing"), "thread");
  assert.notEqual(WP.playFor("lacewing"), "hunt");
  assert.notEqual(WP.playFor("lacewing"), "spot");
  assert.notEqual(WP.playFor("lacewing"), "vein");
  assert.notEqual(WP.playFor("lacewing"), "unfurl");
  assert.notEqual(WP.playFor("lacewing"), "sill");
  assert.equal(WP.playFor("jewelwing"), "black");
  assert.equal(WP.BLACK, "black");
  assert.equal(WP.playFor("swallowtail"), "tails");
  assert.equal(WP.TAILS, "tails");
  assert.equal(WP.playFor("luna"), "week");
  assert.equal(WP.WEEK, "week");
  assert.equal(WP.playFor("moth"), "mount");
  assert.equal(WP.playFor("darner"), "hawk");
  assert.equal(WP.HAWK, "hawk");
  assert.equal(WP.playFor("grasshopper"), "jump");
  assert.equal(WP.JUMP, "jump");
  assert.equal(WP.playFor("katydid"), "leaf");
  assert.equal(WP.LEAF, "leaf");
  assert.equal(WP.playFor("field_cricket"), "song");
  assert.equal(WP.SONG, "song");
  assert.equal(WP.playFor("earwig"), "sill");
"""
if house.count('assert.equal(WP.playFor("lacewing"), "sill");') != 1:
    raise SystemExit("expected one remaining lacewing sill")
house = house.replace(
    '  assert.equal(WP.playFor("lacewing"), "sill");\n});',
    LACE_ASSERTS + '});',
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")
