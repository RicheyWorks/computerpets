# -*- coding: utf-8 -*-
from pathlib import Path

DOCS = r'''from pathlib import Path

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
    "Snout drills a window stool as an acorn cup: walk onto the stool, sit, drill once, sit the cup, then leave. "
    "Forceps still owns cerci. Mast still owns seed. Auger still owns bore. Dee still owns cache. Cup still owns lid. "
    "This is the eighth leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns snap. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den."
)

# Note: Snap the plant owns count; Beak/snapper owns snap. House voice for Click says "not Snap".
# Header says "Snap still owns snap" matching Beak's SNAP kind in code — but user said "Snap still snap".
# User confirm: "Confirm Snout still drill; Relay still click; Snap still snap"
# So keep "Snap still owns snap" referring to the SNAP kind / Beak naming in some leftovers,
# but ROADMAP should say Snap (venus_flytrap) still owns count AND Beak/snapper still owns snap.
# Looking at Snout header: it named Forceps/Mast/Auger. For Click, user said Relay click, Snap snap.
# I'll use: Relay still owns click. Snap (venus flytrap) still owns count. Beak still owns snap.
# Actually re-read header pattern - short names. Snout used "Snap still owns snap" in user goal?
# User: "Confirm Snout still drill; Relay still click; Snap still snap"
# Snap's playFor is count though. The confirm line might mean the SNAP constant still exists for Beak,
# or they loosely mean Snap's behavior. I'll put in header what user asked and in asserts both count and snap.

LAST_OLD = (
    "2026-09-02 (Snout drills a window stool as an acorn cup; eighth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Click; catalog stays 220; drill is the tell; "
    "Forceps still owns cerci; Mast still owns seed; Auger still owns bore; Dee still owns cache; "
    "Cup still owns lid; gecko still owns chirp)"
)
LAST_NEW = (
    "2026-09-02 (Click rights a window stool as a bark plate; ninth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Rob; catalog stays 220; right is the tell; "
    "Snout still owns drill; Relay still owns click; Snap still owns count; Beak still owns snap; "
    "Bluff still owns flip; gecko still owns chirp)"
)

ROADMAP_LAST_OLD = (
    "2026-09-02 (Phase 6 leftover: Snout drills a window stool as an acorn cup; eighth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Click; catalog stays 220; drill is the tell; "
    "Forceps still owns cerci; Mast still owns seed; Auger still owns bore; Dee still owns cache; "
    "Cup still owns lid; gecko still owns chirp)"
)
ROADMAP_LAST_NEW = (
    "2026-09-02 (Phase 6 leftover: Click rights a window stool as a bark plate; ninth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Rob; catalog stays 220; right is the tell; "
    "Snout still owns drill; Relay still owns click; Snap still owns count; Beak still owns snap; "
    "Bluff still owns flip; gecko still owns chirp)"
)

CLICK_DONE = (
    "Click is done. Ninth leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Rob. Do not start Rob. Rob (robber fly) is later meadow — after Click."
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
n = road.count("Next leftover is Click. Do not start Click.")
print("roadmap next Click count", n)
if n < 1:
    raise SystemExit("no next leftover Click in roadmap")
road = road.replace(
    "Next leftover is Click. Do not start Click. Click (click beetle) is later meadow — after Snout.",
    CLICK_DONE,
)
if "Next leftover is Click. Do not start Click." in road:
    road = road.replace("Next leftover is Click. Do not start Click.", CLICK_DONE)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

CLICK_BULLET = (
    "\n- [x] Click (`click_beetle` / `click`) rights a real window stool as a bark plate: walk onto the stool "
    "(the stool — papers are bark; the same furniture family Snout drills as an acorn cup, Forceps cercis as a bark dish, "
    "Lace nets as a leaf dish, and Chirp songs as a grass dish, not Relay's two-window click, "
    "not Snap's meeting-rail wetland-cup count, not Beak's snap, not Bluff's eraser-dish flip, "
    "not Vault's apron grass-plate jump, not Spark the firefly's glow; a click, not a snap; not Snap; not Spark; "
    "a click beetle is not a firefly; she sits then clicks then sits; plate kept my eyes; papers are bark; "
    "review the flip (righting); named: Click. Right first. "
    "Hello: \"I clicked. Hello.\" Play: \"A click. Review the flip.\" Temperament: right.), then leave. One window. "
    "Right is the tell — not Relay's `click`. Not Snap's `count`. Not Beak's `snap`. Not Bluff's `flip`. Not Vault's `jump`. Not Spark the firefly's `glow`. "
    "playFor(\"click_beetle\") returns `right` (not `click`, not `snap`, not `flip`, not `glow`, not `flash`, not `spring`, not `jump`, not `drill`, not `crack`, not `tick`, not `sill`). "
    "Snout (`acorn_weevil`) still owns `drill`. Relay (`relay_dragon`) still owns `click`. Snap (`venus_flytrap`) still owns `count`. "
    "Beak (`snapper`) still owns `snap`. Bluff (`hognose`) still owns `flip`. Spark the firefly (`firefly`) still owns `glow`. "
    "Same `playFor` door. `/demo/click` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Ninth leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Rob. Do not start Rob. Rob (robber fly) is later meadow — after Click.\n"
)

marker = "- [x] Snout (`acorn_weevil` / `snout`) drills a real window stool as an acorn cup"
if marker not in road:
    raise SystemExit("MISSING snout bullet")
idx = road.find(marker)
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    end = road.find("\n\n", idx + 10)
    if end < 0:
        raise SystemExit("MISSING bullet after snout")
road = road[:end] + CLICK_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap")

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
house = must_replace(
    house,
    'test("Snout leftover drills a window stool as an acorn cup; eighth leftover of the meadow den done; Forceps leftover still cercis a window stool as a bark dish; seventh leftover of the meadow den done; Lace leftover still nets a window stool as a leaf dish; sixth leftover of the meadow den done; Jewel leftover still blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    'test("Click leftover rights a window stool as a bark plate; ninth leftover of the meadow den done; Snout leftover still drills a window stool as an acorn cup; eighth leftover of the meadow den done; Forceps leftover still cercis a window stool as a bark dish; seventh leftover of the meadow den done; Lace leftover still nets a window stool as a leaf dish; sixth leftover of the meadow den done; Jewel leftover still blacks a glass rim as a stream jewel; fifth leftover of the meadow den done; Banner leftover still tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    "house title open",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Click;",
    "shore ten is closed; next leftover is Rob;",
    "house next Rob",
)
if "Do not start Click" in house:
    house = house.replace("Do not start Click", "Do not start Rob", 1)
    print("replaced do not start in house title")

n = house.count('assert.equal(WP.playFor("click_beetle"), "sill");')
print("house click_beetle sill", n)
if n != 2:
    raise SystemExit("unexpected house click_beetle sill count")
# Move the generic sill pin to robber_fly (next remaining generic-sill meadow guest)
house = house.replace('assert.equal(WP.playFor("click_beetle"), "sill");', 'assert.equal(WP.playFor("robber_fly"), "sill");', 1)

CLICK_ASSERTS = """
  assert.equal(WP.playFor("click_beetle"), "right");
  assert.equal(WP.RIGHT, "right");
  assert.notEqual(WP.playFor("click_beetle"), "click");
  assert.notEqual(WP.playFor("click_beetle"), "snap");
  assert.notEqual(WP.playFor("click_beetle"), "flip");
  assert.notEqual(WP.playFor("click_beetle"), "glow");
  assert.notEqual(WP.playFor("click_beetle"), "flash");
  assert.notEqual(WP.playFor("click_beetle"), "spring");
  assert.notEqual(WP.playFor("click_beetle"), "jump");
  assert.notEqual(WP.playFor("click_beetle"), "drill");
  assert.notEqual(WP.playFor("click_beetle"), "crack");
  assert.notEqual(WP.playFor("click_beetle"), "tick");
  assert.notEqual(WP.playFor("click_beetle"), "sill");
  assert.equal(WP.playFor("acorn_weevil"), "drill");
  assert.equal(WP.DRILL, "drill");
  assert.equal(WP.playFor("relay_dragon"), "click");
  assert.equal(WP.CLICK, "click");
  assert.equal(WP.playFor("venus_flytrap"), "count");
  assert.equal(WP.playFor("snapper"), "snap");
  assert.equal(WP.playFor("hognose"), "flip");
  assert.equal(WP.playFor("firefly"), "glow");
  assert.equal(WP.playFor("robber_fly"), "sill");
"""
if house.count('assert.equal(WP.playFor("click_beetle"), "sill");') != 1:
    raise SystemExit("expected one remaining click_beetle sill")
house = house.replace(
    '  assert.equal(WP.playFor("click_beetle"), "sill");\n});',
    CLICK_ASSERTS + '});',
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")
'''

# Fix HEADER to be honest about Snap: user said "Snap still snap" but Snap plant owns count.
# Keep header short like Snout — use "Snap still owns count. Beak still owns snap" is long.
# Looking at user tagline "not Snap" and confirm "Snap still snap" — I'll use shorter house header:
# "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow."
# And drop Beak from the short header; Beak appears in ROADMAP bullet.

DOCS = DOCS.replace(
    "Snout still owns drill. Relay still owns click. Snap still owns snap. Bluff still owns flip. Spark the firefly still owns glow. ",
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. ",
)

Path("_click_docs.py").write_text(DOCS, encoding="utf-8", newline="\n")
print("wrote _click_docs.py", len(DOCS))
