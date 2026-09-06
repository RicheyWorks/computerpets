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
    "Lace nets a window stool as a leaf dish: walk onto the stool, sit, lace once, sit the dish, then leave. "
    "Jewel still owns black. Banner still owns tails. Ghost still owns week. Moth still owns mount. Seven still owns spot. "
    "This is the sixth leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Forceps cercis a window stool as a bark dish: walk onto the stool, sit, raise the cerci once, sit the dish, then leave. "
    "Lace still owns net. Jewel still owns black. Fold still owns pray. Pinch still owns claw. Barb still owns raise. "
    "This is the seventh leftover of the meadow den."
)

LAST_OLD = (
    "2026-09-02 (Lace nets a window stool as a leaf dish; sixth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Forceps; catalog stays 220; net is the tell; "
    "Jewel still owns black; Banner still owns tails; Ghost still owns week; Moth still owns mount; "
    "Seven still owns spot; gecko still owns chirp)"
)
LAST_NEW = (
    "2026-09-02 (Forceps cercis a window stool as a bark dish; seventh leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Snout; catalog stays 220; cerci is the tell; "
    "Lace still owns net; Jewel still owns black; Fold still owns pray; Pinch still owns claw; "
    "Barb still owns raise; gecko still owns chirp)"
)

ROADMAP_LAST_OLD = (
    "2026-09-02 (Phase 6 leftover: Lace nets a window stool as a leaf dish; sixth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Forceps; catalog stays 220; net is the tell; "
    "Jewel still owns black; Banner still owns tails; Ghost still owns week; Moth still owns mount; "
    "Seven still owns spot; gecko still owns chirp)"
)
ROADMAP_LAST_NEW = (
    "2026-09-02 (Phase 6 leftover: Forceps cercis a window stool as a bark dish; seventh leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Snout; catalog stays 220; cerci is the tell; "
    "Lace still owns net; Jewel still owns black; Fold still owns pray; Pinch still owns claw; "
    "Barb still owns raise; gecko still owns chirp)"
)

FORCEPS_DONE = (
    "Forceps is done. Seventh leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Snout. Do not start Snout. Click (click beetle) is later meadow — after Snout."
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
n = road.count("Next leftover is Forceps. Do not start Forceps.")
print("roadmap next Forceps count", n)
if n < 1:
    raise SystemExit("no next leftover Forceps in roadmap")
road = road.replace(
    "Next leftover is Forceps. Do not start Forceps. Snout (acorn weevil) is later meadow — after Forceps.",
    FORCEPS_DONE,
)
if "Next leftover is Forceps. Do not start Forceps." in road:
    road = road.replace("Next leftover is Forceps. Do not start Forceps.", FORCEPS_DONE)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

FORCEPS_BULLET = (
    "\n- [x] Forceps (`earwig` / `forceps`) cercis a real window stool as a bark dish: walk onto the stool "
    "(the stool — papers are bark; the same furniture family Lace nets as a leaf dish, Chirp songs as a grass dish, "
    "and Banner tails as a blossom dish, not Armor's stool bark-dish roll, not Barb's stool bark-tray raise, "
    "not Pinch's sill-wash pebble-tray claw, not Fold's window-box-stem green-hinge pray, not Jewel's glass-rim stream-jewel black, "
    "not Lace's leaf-dish net; cerci, not a sting; not Fold; an earwig is not a beetle with a sting; she sits then raises then sits; "
    "papers are bark; dish kept my forceps; named: Forceps. Cerci first. "
    "Hello: \"I raised the cerci. Hello.\" Play: \"A raise. Review the forceps.\" Temperament: cerci.), then leave. One window. "
    "Cerci is the tell — not Barb's `raise`. Not Fold's `pray`. Not Pinch's `claw`. Not Lace's `net`. Not Jewel's `black`. Not Whip's `spray`. "
    "playFor(\"earwig\") returns `cerci` (not `forceps`, not `raise`, not `claw`, not `pinch`, not `fold`, not `pray`, not `sting`, not `net`, not `black`, not `spray`, not `sill`). "
    "Lace (`lacewing`) still owns `net`. Jewel (`jewelwing`) still owns `black`. Fold (`mantis`) still owns `pray`. "
    "Pinch (`crayfish`) still owns `claw`. Barb (`scorpion`) still owns `raise`. "
    "Same `playFor` door. `/demo/forceps` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Seventh leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Snout. Do not start Snout. Click (click beetle) is later meadow — after Snout.\n"
)

marker = "- [x] Lace (`lacewing` / `lace`) nets a real window stool as a leaf dish"
if marker not in road:
    raise SystemExit("MISSING lace bullet")
idx = road.find(marker)
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    end = road.find("\n\n", idx + 10)
    if end < 0:
        raise SystemExit("MISSING bullet after lace")
road = road[:end] + FORCEPS_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap")

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
house = must_replace(
    house,
    'test("Lace leftover nets a window stool as a leaf dish; sixth leftover of the meadow den done; Jewel leftover still blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    'test("Forceps leftover cercis a window stool as a bark dish; seventh leftover of the meadow den done; Lace leftover still nets a window stool as a leaf dish; sixth leftover of the meadow den done; Jewel leftover still blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    "house title open",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Forceps;",
    "shore ten is closed; next leftover is Snout;",
    "house next Snout",
)
if "Do not start Forceps" in house:
    house = house.replace("Do not start Forceps", "Do not start Snout", 1)
    print("replaced do not start in house title")

n = house.count('assert.equal(WP.playFor("earwig"), "sill");')
print("house earwig sill", n)
if n != 2:
    raise SystemExit("unexpected house earwig sill count")
house = house.replace('assert.equal(WP.playFor("earwig"), "sill");', 'assert.equal(WP.playFor("acorn_weevil"), "sill");', 1)

FORCEPS_ASSERTS = """
  assert.equal(WP.playFor("earwig"), "cerci");
  assert.equal(WP.CERCI, "cerci");
  assert.notEqual(WP.playFor("earwig"), "forceps");
  assert.notEqual(WP.playFor("earwig"), "raise");
  assert.notEqual(WP.playFor("earwig"), "claw");
  assert.notEqual(WP.playFor("earwig"), "pinch");
  assert.notEqual(WP.playFor("earwig"), "fold");
  assert.notEqual(WP.playFor("earwig"), "pray");
  assert.notEqual(WP.playFor("earwig"), "sting");
  assert.notEqual(WP.playFor("earwig"), "net");
  assert.notEqual(WP.playFor("earwig"), "black");
  assert.notEqual(WP.playFor("earwig"), "spray");
  assert.notEqual(WP.playFor("earwig"), "sill");
  assert.equal(WP.playFor("lacewing"), "net");
  assert.equal(WP.NET, "net");
  assert.equal(WP.playFor("jewelwing"), "black");
  assert.equal(WP.BLACK, "black");
  assert.equal(WP.playFor("mantis"), "pray");
  assert.equal(WP.PRAY, "pray");
  assert.equal(WP.playFor("crayfish"), "claw");
  assert.equal(WP.CLAW, "claw");
  assert.equal(WP.playFor("scorpion"), "raise");
  assert.equal(WP.playFor("acorn_weevil"), "sill");
"""
if house.count('assert.equal(WP.playFor("earwig"), "sill");') != 1:
    raise SystemExit("expected one remaining earwig sill")
house = house.replace(
    '  assert.equal(WP.playFor("earwig"), "sill");\n});',
    FORCEPS_ASSERTS + '});',
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")
