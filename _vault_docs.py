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
    "Blade leafs a sash horn as a leaf rim: walk onto the horn, sit the leaf, still the green, then leave. "
    "Chirp still owns song. Twig still owns freeze. Seven still owns spot. Fold still owns pray. Disc still owns snip. Vein still owns unfurl. Grin still owns still. "
    "This is the second leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Vault jumps a window apron as a grass plate: walk onto the apron, sit, vault once, sit the plate, then leave. "
    "Blade still owns leaf. Chirp still owns song. Hop still owns spring. Leap still owns pounce. Hook still owns soar. "
    "This is the third leftover of the meadow den."
)

LAST_OLD = (
    "2026-09-01 (Blade leafs a sash horn as a leaf rim; second leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Vault; catalog stays 220; leaf is the tell; "
    "Chirp still owns song; Twig still owns freeze; Seven still owns spot; Fold still owns pray; "
    "Disc still owns snip; Vein still owns unfurl; Grin still owns still; gecko still owns chirp)"
)
LAST_NEW = (
    "2026-09-01 (Vault jumps a window apron as a grass plate; third leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Banner; catalog stays 220; jump is the tell; "
    "Blade still owns leaf; Chirp still owns song; Hop still owns spring; Leap still owns pounce; "
    "Hook still owns soar; gecko still owns chirp)"
)

ROADMAP_LAST_OLD = (
    "2026-09-01 (Phase 6 leftover: Blade leafs a sash horn as a leaf rim; second leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Vault; catalog stays 220; leaf is the tell; "
    "Chirp still owns song; Twig still owns freeze; Seven still owns spot; Fold still owns pray; "
    "Disc still owns snip; Vein still owns unfurl; Grin still owns still; gecko still owns chirp)"
)
ROADMAP_LAST_NEW = (
    "2026-09-01 (Phase 6 leftover: Vault jumps a window apron as a grass plate; third leftover of the meadow den done; "
    "hive ten closed; shore ten is closed; next leftover is Banner; catalog stays 220; jump is the tell; "
    "Blade still owns leaf; Chirp still owns song; Hop still owns spring; Leap still owns pounce; "
    "Hook still owns soar; gecko still owns chirp)"
)

VAULT_DONE = (
    "Vault is done. Third leftover of the meadow den done. Hive ten stays closed. Shore ten stays closed. "
    "Next leftover is Banner. Do not start Banner."
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
n = road.count("Next leftover is Vault. Do not start Vault.")
if n < 1:
    raise SystemExit("no next leftover Vault in roadmap: %s" % n)
road = road.replace(
    "Next leftover is Vault. Do not start Vault.",
    VAULT_DONE,
)
road = must_replace(road, ROADMAP_LAST_OLD, ROADMAP_LAST_NEW, "roadmap last")

VAULT_BULLET = (
    "\n- [x] Vault (`grasshopper` / `vault`) jumps a real window apron as a grass plate: walk onto the apron "
    "(the apron under the sill — the same furniture family Vee honks as a blotter green and Lula loops as a blotter river, "
    "not Chirp's window-stool grass-dish song, not Blade's sash-horn leaf rim, not Hop's window-foot duff-cup spring, "
    "not Leap's meeting-rail-end blotter-edge pounce, not Hook's lamp-post-stile soar; "
    "the jump is the tell; she sits then vaults then sits; a jump of the grass; she is not a spider, not a springtail, not a katydid; named: Vault. Jump first. "
    "Hello: \"I vaulted. Hello.\" Play: \"A vault. Review the grass.\" Temperament: vaulting.), then leave. One window. "
    "The jump is the tell — not Blade's `leaf`. Not Chirp's `song`. Not Hop's `spring`. Not Leap's `pounce`. Not Hook's `soar`. Not Velvet's `kick`. "
    "playFor(\"grasshopper\") returns `jump` (not `vault`, not `hop`, not `leap`, not `spring`, not `pounce`, not `soar`, not `leaf`, not `song`, not `kick`, not `grass`, not `sill`). "
    "Blade (`katydid`) still owns `leaf`. Chirp (`field_cricket`) still owns `song`. Hop (`springtail`) still owns `spring`. "
    "Leap (`jumping_spider`) still owns `pounce`. Hook (`red_tail`) still owns `soar`. Gecko (`gecko`) still owns `chirp`. "
    "Same `playFor` door. `/demo/vault` lockstep. "
    "Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. "
    "Catalog stays 220. Third leftover of the meadow den. Hive ten stays closed. Shore ten stays closed. Next leftover is Banner. Do not start Banner.\n"
)

marker = "- [x] Blade (`katydid` / `blade`) leafs a real sash horn as a leaf rim"
if marker not in road:
    raise SystemExit("MISSING blade bullet")
idx = road.find(marker)
end = road.find("\n- [x] ", idx + 10)
if end < 0:
    raise SystemExit("MISSING bullet after blade")
road = road[:end] + VAULT_BULLET + road[end:]
save("docs/ROADMAP.md", road, nl)
print("ok roadmap", "vault-done-replaced-count-was", n)

# leftover-house title + assertions
house, hnl = load("desktop/renderer/leftover-house.test.cjs")
old_title_start = 'test("Blade leftover leafs a sash horn as a leaf rim; second leftover of the meadow den done;'
if old_title_start not in house:
    raise SystemExit("MISSING house blade title")
# replace title opening and next leftover phrase
house = must_replace(
    house,
    'test("Blade leftover leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    'test("Vault leftover jumps a window apron as a grass plate; third leftover of the meadow den done; Blade leftover still leafs a sash horn as a leaf rim; second leftover of the meadow den done; Chirp leftover still songs a window stool as a grass dish; first leftover of the meadow den done;',
    "house title open",
)
house = must_replace(
    house,
    "shore ten is closed; next leftover is Vault;",
    "shore ten is closed; next leftover is Banner;",
    "house next Banner",
)
# grasshopper sill pins -> swallowtail, then add vault asserts before closing of long test
n = house.count('assert.equal(WP.playFor("grasshopper"), "sill");')
print("house grasshopper sill", n)
if n != 2:
    raise SystemExit("unexpected house grasshopper sill count")
# first (generic pin among guests) -> swallowtail
house = house.replace('assert.equal(WP.playFor("grasshopper"), "sill");', 'assert.equal(WP.playFor("swallowtail"), "sill");', 1)
# second (end of blade block) -> vault block
VAULT_ASSERTS = '''  assert.equal(WP.playFor("grasshopper"), "jump");
  assert.equal(WP.JUMP, "jump");
  assert.notEqual(WP.playFor("grasshopper"), "vault");
  assert.notEqual(WP.playFor("grasshopper"), "hop");
  assert.notEqual(WP.playFor("grasshopper"), "leap");
  assert.notEqual(WP.playFor("grasshopper"), "spring");
  assert.notEqual(WP.playFor("grasshopper"), "pounce");
  assert.notEqual(WP.playFor("grasshopper"), "soar");
  assert.notEqual(WP.playFor("grasshopper"), "leaf");
  assert.notEqual(WP.playFor("grasshopper"), "song");
  assert.notEqual(WP.playFor("grasshopper"), "kick");
  assert.notEqual(WP.playFor("grasshopper"), "grass");
  assert.notEqual(WP.playFor("grasshopper"), "sill");
  assert.equal(WP.playFor("katydid"), "leaf");
  assert.equal(WP.LEAF, "leaf");
  assert.equal(WP.playFor("field_cricket"), "song");
  assert.equal(WP.SONG, "song");
  assert.equal(WP.playFor("swallowtail"), "sill");
'''
if house.count('assert.equal(WP.playFor("grasshopper"), "sill");') != 1:
    raise SystemExit("expected one remaining grasshopper sill")
house = house.replace(
    '  assert.notEqual(WP.playFor("katydid"), "sill");\n  assert.equal(WP.playFor("grasshopper"), "sill");\n});',
    '  assert.notEqual(WP.playFor("katydid"), "sill");\n' + VAULT_ASSERTS + '});',
    1,
)
save("desktop/renderer/leftover-house.test.cjs", house, hnl)
print("ok house")
