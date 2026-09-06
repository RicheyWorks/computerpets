# -*- coding: utf-8 -*-
from pathlib import Path
import re

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:200]!r}")
    return text.replace(old, new, 1)

# leftover-house
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
old_title_start = 'test("Mane leftover teeths a sash gap as a wood wound; sixth leftover of the fungi den done;'
if old_title_start not in house:
    raise SystemExit("house title missing")
# replace title opening through first assert block pin
house = house.replace(
    'test("Mane leftover teeths a sash gap as a wood wound; sixth leftover of the fungi den done;',
    'test("Puff leftover clouds a window apron as a spore dish; seventh leftover of the fungi den done; Mane leftover still teeths a sash gap as a wood wound; sixth leftover of the fungi den done;',
    1,
)
house = house.replace('next leftover is Puff;', 'next leftover is Flame;', 1)
# asserts at end of fungi section
house = once(house, '  assert.equal(WP.playFor("lions_mane"), "teeth");\n  assert.equal(WP.TEETH, "teeth");',
             '  assert.equal(WP.playFor("puffball"), "cloud");\n  assert.equal(WP.CLOUD, "cloud");\n  assert.notEqual(WP.playFor("puffball"), "puff");\n  assert.notEqual(WP.playFor("puffball"), "dust");\n  assert.notEqual(WP.playFor("puffball"), "warts");\n  assert.notEqual(WP.playFor("puffball"), "sill");\n  assert.equal(WP.playFor("lions_mane"), "teeth");\n  assert.equal(WP.TEETH, "teeth");', "house puff asserts")
# both puffball sill pins
n = house.count('assert.equal(WP.playFor("puffball"), "sill");')
house = house.replace('assert.equal(WP.playFor("puffball"), "sill");', 'assert.equal(WP.playFor("chicken_of_woods"), "sill");')
print("house sill pins moved", n)
# also notEqual puffball sill in new asserts already; ensure chicken pin exists once near mane
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")

# ARCH header
arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
arch = once(
    arch,
    "| **Last Updated** | 2026-09-02 (Mane teeths a sash gap as a wood wound; sixth leftover of the fungi den done; Ring leftover still zones a sash stile as wood grain; fifth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Puff; catalog stays 220; teeth is the tell; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf) |",
    "| **Last Updated** | 2026-09-02 (Puff clouds a window apron as a spore dish; seventh leftover of the fungi den done; Mane leftover still teeths a sash gap as a wood wound; sixth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Flame; catalog stays 220; cloud is the tell; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust) |",
    "arch",
)
Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")

# ROADMAP: add Puff entry after Ring, update footer
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
ring_line = None
for line in rm.splitlines():
    if line.startswith("- [x] Ring (`turkey_tail`"):
        ring_line = line
        break
if not ring_line:
    raise SystemExit("ring line missing")
puff_entry = (
    "- [x] Puff (`puffball` / `puff`) clouds a real window apron as a spore dish: walk onto the apron (the apron under the sill — the same furniture family Cap warts as a moss cup, Vee honks as a blotter green, Lula loops as a blotter river, Vault jumps as a grass plate; not Cap's warts, not Vee's honk, not Lula's loop, not Vault's jump, not Floss's meeting-rail dust, not Pebble's casement-leaf puff; a puff, then a cloud; soft mound; pearl; pore; not a young Amanita if you cut; named: Puff. The cloud is the tell. Hours: On the dish. Hello: \"I puffed. That was hello.\" Play: \"A puff. Review the cloud.\" / \"I win by remaining a burst.\" Temperament: patient. Not puff. Not dust. Not warts. Not teeth. Not shelf. Not burst. Not spore. Not pearl. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Seventh leftover of the fungi den. Do not start Flame.\n"
)
if "Puff (`puffball`" not in rm:
    rm = rm.replace(ring_line + "\n", ring_line + "\n\n" + puff_entry, 1)
# footer
rm = once(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Mane teeths a sash gap as a wood wound; sixth leftover of the fungi den done; Ring leftover still zones a sash stile as wood grain; fifth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Puff; catalog stays 220; teeth is the tell; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Puff clouds a window apron as a spore dish; seventh leftover of the fungi den done; Mane leftover still teeths a sash gap as a wood wound; sixth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Flame; catalog stays 220; cloud is the tell; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust)",
    "roadmap footer",
)
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

# README + desktop README: replace Mane pin sentence with Puff, and note next Flame
for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    old = "Mane teeths a sash gap as a wood wound: walk into the gap, sit the teeth, then leave. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf."
    new = "Puff clouds a window apron as a spore dish: walk onto the apron, sit the soft mound, cloud once, sit the dish, then leave. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust."
    if old not in text:
        # try find Mane teeths fragment
        if "Mane teeths" not in text:
            print(p, "NO Mane teeths fragment — skip long paragraph")
        else:
            raise SystemExit(f"{p}: Mane sentence mismatch: " + repr(text[text.find("Mane teeths"):text.find("Mane teeths")+220]))
    else:
        text = text.replace(old, new, 1)
        Path(p).write_text(text, encoding="utf-8", newline="\n")
        print(p, "updated")

print("docs/house done")
# verify tests mention Puff
print("cjs puff tests", Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").count("Puff clouds"))
print("mjs puff tests", Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8").count("Puff clouds"))
# exports check
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["puffPoint", "dustPoint", "jumpPoint", "cloudPoint", "CLOUD"]:
    print(name, "export" if f"    {name}," in js or f"    {name}\n" in js or f"const {name}" in js or f"  const {name}" in js else "missing?", js.count(name))
