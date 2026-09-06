# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:220]!r}")
    return text.replace(old, new, 1)

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
house = house.replace(
    'test("Puff leftover clouds a window apron as a spore dish; seventh leftover of the fungi den done;',
    'test("Flame leftover drips a sash stile as warm wood; eighth leftover of the fungi den done; Puff leftover still clouds a window apron as a spore dish; seventh leftover of the fungi den done;',
    1,
)
house = house.replace('next leftover is Flame;', 'next leftover is Starter;', 1)
house = once(
    house,
    '  assert.equal(WP.playFor("puffball"), "cloud");\n  assert.equal(WP.CLOUD, "cloud");',
    '  assert.equal(WP.playFor("chicken_of_woods"), "drip");\n  assert.equal(WP.DRIP, "drip");\n  assert.notEqual(WP.playFor("chicken_of_woods"), "shelf");\n  assert.notEqual(WP.playFor("chicken_of_woods"), "cloud");\n  assert.notEqual(WP.playFor("chicken_of_woods"), "sill");\n  assert.equal(WP.playFor("puffball"), "cloud");\n  assert.equal(WP.CLOUD, "cloud");',
    "house flame asserts",
)
n = house.count('assert.equal(WP.playFor("chicken_of_woods"), "sill");')
house = house.replace('assert.equal(WP.playFor("chicken_of_woods"), "sill");', 'assert.equal(WP.playFor("yeast"), "sill");')
print("house sill pins moved", n)
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
arch = once(
    arch,
    "| **Last Updated** | 2026-09-02 (Puff clouds a window apron as a spore dish; seventh leftover of the fungi den done; Mane leftover still teeths a sash gap as a wood wound; sixth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Flame; catalog stays 220; cloud is the tell; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust) |",
    "| **Last Updated** | 2026-09-02 (Flame drips a sash stile as warm wood; eighth leftover of the fungi den done; Puff leftover still clouds a window apron as a spore dish; seventh leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Starter; catalog stays 220; drip is the tell; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust) |",
    "arch",
)
Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
puff_line = None
for line in rm.splitlines():
    if line.startswith("- [x] Puff (`puffball`"):
        puff_line = line
        break
if not puff_line:
    # may be multi-line start
    for line in rm.splitlines():
        if "Puff (`puffball`" in line and line.strip().startswith("- [x]"):
            puff_line = line
            break
if not puff_line:
    raise SystemExit("puff line missing")
flame_entry = (
    "- [x] Flame (`chicken_of_woods` / `flame`) drips a real sash stile as warm wood: walk onto the stile (the right timber — Frill shelves the left stile as oyster bracket; Flame drips the right stile as sulfur chicken shelves; not Frill's shelf, not Ring's zones, not Puff's apron cloud, not Cap's moss-cup warts, not Mane's wood-wound teeth, not Fan's gold; cascading bright brackets; warm wood; chicken of the woods; named: Flame. The drip is the tell. Hours: On the wood. Hello: \"I dripped. That was hello.\" Play: \"A drip. Review the warm wood.\" / \"I win by remaining a bracket.\" Temperament: bright. Not shelf. Not cloud. Not gold. Not flame. Not bracket. Not sulfur. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Eighth leftover of the fungi den. Do not start Starter.\n"
)
if "Flame (`chicken_of_woods`" not in rm:
    rm = rm.replace(puff_line + "\n", puff_line + "\n\n" + flame_entry, 1)
rm = once(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Puff clouds a window apron as a spore dish; seventh leftover of the fungi den done; Mane leftover still teeths a sash gap as a wood wound; sixth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Flame; catalog stays 220; cloud is the tell; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Flame drips a sash stile as warm wood; eighth leftover of the fungi den done; Puff leftover still clouds a window apron as a spore dish; seventh leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Starter; catalog stays 220; drip is the tell; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust)",
    "roadmap footer",
)
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    old = "Puff clouds a window apron as a spore dish: walk onto the apron, sit the soft mound, cloud once, sit the dish, then leave. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust."
    new = "Flame drips a sash stile as warm wood: walk onto the stile, sit the bright bracket, drip once, sit the warm wood, then leave. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust."
    if old not in text:
        raise SystemExit(f"{p}: Puff sentence mismatch")
    text = text.replace(old, new, 1)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

print("docs/house done")
print("house next", "next leftover is Starter" in Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8"))
print("yeast sill", Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8").count('playFor("yeast"), "sill"'))
