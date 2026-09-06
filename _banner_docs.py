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
    "Vault jumps a window apron as a grass plate: walk onto the apron, sit, vault once, sit the plate, then leave. "
    "Blade still owns leaf. Chirp still owns song. Hop still owns spring. Leap still owns pounce. Hook still owns soar. "
    "This is the third leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Banner tails a window stool as a blossom dish: walk onto the stool, sit, banner once, sit the dish, then leave. "
    "Vault still owns jump. Blade still owns leaf. Chirp still owns song. Milk still owns weed. Ghost still owns week. "
    "This is the fourth leftover of the meadow den."
)

LAST_OLD = (
    "2026-09-01 (Vault jumps a window apron as a grass plate; third leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Banner; catalog stays 220; jump is the tell; "
    "Blade still owns leaf; Chirp still owns song; Hop still owns spring; Leap still owns pounce; "
    "Hook still owns soar; gecko still owns chirp)"
)
LAST_NEW = (
    "2026-09-02 (Banner tails a window stool as a blossom dish; fourth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Jewel; catalog stays 220; tails are the tell; "
    "Vault still owns jump; Blade still owns leaf; Chirp still owns song; Milk still owns weed; "
    "Ghost still owns week; gecko still owns chirp)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Vault jumps a window apron as a grass plate; third leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Banner; catalog stays 220; jump is the tell; "
    "Blade still owns leaf; Chirp still owns song; Hop still owns spring; Leap still owns pounce; "
    "Hook still owns soar; gecko still owns chirp)"
)
ROADMAP_LAST_NEW = (
    "2026-09-02 (Phase 6 leftover: Banner tails a window stool as a blossom dish; fourth leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Jewel; catalog stays 220; tails are the tell; "
    "Vault still owns jump; Blade still owns leaf; Chirp still owns song; Milk still owns weed; "
    "Ghost still owns week; gecko still owns chirp)"
)

BANNER_DONE = (
    "Banner is done. Fourth leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Jewel. Do not start Jewel."
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
n = road.count("Next leftover is Banner. Do not start Banner.")
if n < 1:
    raise SystemExit("no next leftover Banner in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Banner. Do not start Banner.",
    BANNER_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

BANNER_BULLET = (
    "\n- [x] Banner (`swallowtail` / `banner`) tails a real window stool as a blossom dish: walk onto the stool "
    "(papers are a blossom — the same furniture family Chirp songs as a grass dish, Pale sands as dry sand, "
    "Ledger plows as a sand tray, and Cache buries as an oak dish, "
    "not Milk's window-box milkweed-cup weed, not Ghost's lamp-side-glass lamp-dusk week, not Fan's lamp-side autumn gold, "
    "not Sip's window-box-bloom nectar-cup sip, not Vault's window-apron grass-plate jump, not Blade's sash-horn leaf rim; "
    "the tails are the tell; yellow bands; she sits then banners then sits; a swallowtail is not a monarch; named: Banner. Tails first. "
    "Hello: \"I kept the yellow. Hello.\" Play: \"A lift. Review the banner.\" Temperament: banded.), then leave. One window. "
    "The tails are the tell — not Milk's `weed`. Not Ghost's `week`. Not Fan's `gold`. Not Sip's `sip`. Not Vault's `jump`. Not Blade's `leaf`. Not Chirp's `song`. "
    "playFor(\"swallowtail\") returns `tails` (not `banner`, not `weed`, not `week`, not `gold`, not `sip`, not `mount`, not `flag`, not `jump`, not `leaf`, not `song`, not `glow`, not `flutter`, not `sill`). "
    "Vault (`grasshopper`) still owns `jump`. Blade (`katydid`) still owns `leaf`. Chirp (`field_cricket`) still owns `song`. "
    "Milk (`monarch`) still owns `weed`. Ghost (`luna`) still owns `week`. Gecko (`gecko`) still owns `chirp`. "
    "Same `playFor` door. `/demo/banner` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Fourth leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Jewel. Do not start Jewel.\n"
)

marker = "- [x] Vault (`grasshopper` / `vault`) jumps a real window apron as a grass plate"
if marker not in road:
    raise SystemExit("MISSING vault bullet")
idx = road.find(marker)
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    end = road.find("\n\n", idx + 10)
    if end < 0:
        raise SystemExit("MISSING bullet after vault")
road = road[:end] + BANNER_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "banner-done-replaced-count-was", n)

house, hnl = load("desktop/renderer/leftover-house.test.cjs")
old_title_start = 'test("Vault leftover jumps a window apron as a grass plate; third leftover of the meadow den done;'
if old_title_start not in house:
    raise SystemExit("MISSING house vault title")
house = must_replace(
    house,
    'test("Vault leftover jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    'test("Banner leftover tails a window stool as a blossom dish; fourth leftover of the meadow den done; Vault leftover still jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    "house title open",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Banner;",
    "shore ten is closed; next leftover is Jewel;",
    "house next Jewel",
)
n = house.count('assert.equal(WP.playFor("swallowtail"), "sill");')
print("house swallowtail sill", n)
if n != 2:
    raise SystemExit("unexpected house swallowtail sill count")
house = house.replace('assert.equal(WP.playFor("swallowtail"), "sill");', 'assert.equal(WP.playFor("jewelwing"), "sill");', 1)
BANNER_ASSERTS = """
  assert.equal(WP.playFor("swallowtail"), "tails");
  assert.equal(WP.TAILS, "tails");
  assert.notEqual(WP.playFor("swallowtail"), "banner");
  assert.notEqual(WP.playFor("swallowtail"), "weed");
  assert.notEqual(WP.playFor("swallowtail"), "week");
  assert.notEqual(WP.playFor("swallowtail"), "gold");
  assert.notEqual(WP.playFor("swallowtail"), "sip");
  assert.notEqual(WP.playFor("swallowtail"), "mount");
  assert.notEqual(WP.playFor("swallowtail"), "flag");
  assert.notEqual(WP.playFor("swallowtail"), "jump");
  assert.notEqual(WP.playFor("swallowtail"), "leaf");
  assert.notEqual(WP.playFor("swallowtail"), "song");
  assert.notEqual(WP.playFor("swallowtail"), "glow");
  assert.notEqual(WP.playFor("swallowtail"), "flutter");
  assert.notEqual(WP.playFor("swallowtail"), "sill");
  assert.equal(WP.playFor("grasshopper"), "jump");
  assert.equal(WP.JUMP, "jump");
  assert.equal(WP.playFor("katydid"), "leaf");
  assert.equal(WP.LEAF, "leaf");
  assert.equal(WP.playFor("field_cricket"), "song");
  assert.equal(WP.SONG, "song");
  assert.equal(WP.playFor("monarch"), "weed");
  assert.equal(WP.playFor("luna"), "week");
  assert.equal(WP.playFor("jewelwing"), "sill");
"""
if house.count('assert.equal(WP.playFor("swallowtail"), "sill");') != 1:
    raise SystemExit("expected one remaining swallowtail sill")
house = house.replace(
    '  assert.equal(WP.playFor("swallowtail"), "sill");\n});',
    BANNER_ASSERTS + '});',
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")
