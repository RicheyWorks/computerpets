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
    "Forceps cercis a window stool as a bark dish: walk onto the stool, sit, raise the cerci once, sit the dish, then leave. "
    "Lace still owns net. Jewel still owns black. Fold still owns pray. Pinch still owns claw. Barb still owns raise. "
    "This is the seventh leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Snout drills a window stool as an acorn cup: walk onto the stool, sit, drill once, sit the cup, then leave. "
    "Forceps still owns cerci. Mast still owns seed. Auger still owns bore. Dee still owns cache. Cup still owns lid. "
    "This is the eighth leftover of the meadow den."
)

LAST_OLD = (
    "2026-09-02 (Forceps cercis a window stool as a bark dish; seventh leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Snout; catalog stays 220; cerci is the tell; "
    "Lace still owns net; Jewel still owns black; Fold still owns pray; Pinch still owns claw; "
    "Barb still owns raise; gecko still owns chirp)"
)
LAST_NEW = (
    "2026-09-02 (Snout drills a window stool as an acorn cup; eighth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Click; catalog stays 220; drill is the tell; "
    "Forceps still owns cerci; Mast still owns seed; Auger still owns bore; Dee still owns cache; "
    "Cup still owns lid; gecko still owns chirp)"
)

ROADMAP_LAST_OLD = (
    "2026-09-02 (Phase 6 leftover: Forceps cercis a window stool as a bark dish; seventh leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Snout; catalog stays 220; cerci is the tell; "
    "Lace still owns net; Jewel still owns black; Fold still owns pray; Pinch still owns claw; "
    "Barb still owns raise; gecko still owns chirp)"
)
ROADMAP_LAST_NEW = (
    "2026-09-02 (Phase 6 leftover: Snout drills a window stool as an acorn cup; eighth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Click; catalog stays 220; drill is the tell; "
    "Forceps still owns cerci; Mast still owns seed; Auger still owns bore; Dee still owns cache; "
    "Cup still owns lid; gecko still owns chirp)"
)

SNOUT_DONE = (
    "Snout is done. Eighth leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Click. Do not start Click. Click (click beetle) is later meadow — after Snout."
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
n = road.count("Next leftover is Snout. Do not start Snout.")
print("roadmap next Snout count", n)
if n < 1:
    raise SystemExit("no next leftover Snout in roadmap")
road = road.replace(
    "Next leftover is Snout. Do not start Snout. Click (click beetle) is later meadow — after Snout.",
    SNOUT_DONE,
)
if "Next leftover is Snout. Do not start Snout." in road:
    road = road.replace("Next leftover is Snout. Do not start Snout.", SNOUT_DONE)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

SNOUT_BULLET = (
    "\n- [x] Snout (`acorn_weevil` / `snout`) drills a real window stool as an acorn cup: walk onto the stool "
    "(the stool — papers are an acorn; the same furniture family Forceps cercis as a bark dish, Lace nets as a leaf dish, "
    "Chirp songs as a grass dish, and Banner tails as a blossom dish, not Mast's stool acorn-dish seed, "
    "not Auger's sash-stile timber bore, not Dee's meeting-rail twig-cup cache, not Cup's sash-latch teacup lid, "
    "not Forceps's bark-dish cerci; drill, not a bee; a weevil is not a bee; she sits then drills then sits; "
    "papers are an acorn; cup kept my snout; named: Snout. Drill first. "
    "Hello: \"I drilled the acorn. Hello.\" Play: \"A drill. Review the snout.\" Temperament: drill.), then leave. One window. "
    "Drill is the tell — not Auger's `bore`. Not Mast's `seed`. Not Forceps's `cerci`. Not Dee's `cache`. Not Cup's `lid`. "
    "playFor(\"acorn_weevil\") returns `drill` (not `snout`, not `bore`, not `seed`, not `cerci`, not `net`, not `nest`, not `chew`, not `acorn`, not `sill`). "
    "Forceps (`earwig`) still owns `cerci`. Mast (`oak`) still owns `seed`. Auger (`carpenter_bee`) still owns `bore`. "
    "Dee (`chickadee`) still owns `cache`. Cup (`octopus`) still owns `lid`. "
    "Same `playFor` door. `/demo/snout` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Eighth leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Click. Do not start Click. Click (click beetle) is later meadow — after Snout.\n"
)

marker = "- [x] Forceps (`earwig` / `forceps`) cercis a real window stool as a bark dish"
if marker not in road:
    raise SystemExit("MISSING forceps bullet")
idx = road.find(marker)
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    end = road.find("\n\n", idx + 10)
    if end < 0:
        raise SystemExit("MISSING bullet after forceps")
road = road[:end] + SNOUT_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap")

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
house = must_replace(
    house,
    'test("Forceps leftover cercis a window stool as a bark dish; seventh leftover of the meadow den done; Lace leftover still nets a window stool as a leaf dish; sixth leftover of the meadow den done; Jewel leftover still blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    'test("Snout leftover drills a window stool as an acorn cup; eighth leftover of the meadow den done; Forceps leftover still cercis a window stool as a bark dish; seventh leftover of the meadow den done; Lace leftover still nets a window stool as a leaf dish; sixth leftover of the meadow den done; Jewel leftover still blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    "house title open",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Snout;",
    "shore ten is closed; next leftover is Click;",
    "house next Click",
)
if "Do not start Snout" in house:
    house = house.replace("Do not start Snout", "Do not start Click", 1)
    print("replaced do not start in house title")

n = house.count('assert.equal(WP.playFor("acorn_weevil"), "sill");')
print("house acorn_weevil sill", n)
if n != 2:
    raise SystemExit("unexpected house acorn_weevil sill count")
# Move the generic sill pin to click_beetle (next remaining generic-sill meadow guest)
house = house.replace('assert.equal(WP.playFor("acorn_weevil"), "sill");', 'assert.equal(WP.playFor("click_beetle"), "sill");', 1)

SNOUT_ASSERTS = """
  assert.equal(WP.playFor("acorn_weevil"), "drill");
  assert.equal(WP.DRILL, "drill");
  assert.notEqual(WP.playFor("acorn_weevil"), "snout");
  assert.notEqual(WP.playFor("acorn_weevil"), "bore");
  assert.notEqual(WP.playFor("acorn_weevil"), "seed");
  assert.notEqual(WP.playFor("acorn_weevil"), "cerci");
  assert.notEqual(WP.playFor("acorn_weevil"), "net");
  assert.notEqual(WP.playFor("acorn_weevil"), "nest");
  assert.notEqual(WP.playFor("acorn_weevil"), "chew");
  assert.notEqual(WP.playFor("acorn_weevil"), "acorn");
  assert.notEqual(WP.playFor("acorn_weevil"), "sill");
  assert.equal(WP.playFor("earwig"), "cerci");
  assert.equal(WP.CERCI, "cerci");
  assert.equal(WP.playFor("carpenter_bee"), "bore");
  assert.equal(WP.playFor("oak"), "seed");
  assert.equal(WP.playFor("chickadee"), "cache");
  assert.equal(WP.playFor("octopus"), "lid");
  assert.equal(WP.playFor("click_beetle"), "sill");
"""
if house.count('assert.equal(WP.playFor("acorn_weevil"), "sill");') != 1:
    raise SystemExit("expected one remaining acorn_weevil sill")
house = house.replace(
    '  assert.equal(WP.playFor("acorn_weevil"), "sill");\n});',
    SNOUT_ASSERTS + '});',
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")
