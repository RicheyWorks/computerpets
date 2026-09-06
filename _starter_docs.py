# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:220]!r}")
    return text.replace(old, new, 1)

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
house = house.replace(
    'test("Flame leftover drips a sash stile as warm wood; eighth leftover of the fungi den done;',
    'test("Starter leftover blooms a damp pane as a yeast film; ninth leftover of the fungi den done; Flame leftover still drips a sash stile as warm wood; eighth leftover of the fungi den done;',
    1,
)
house = house.replace('next leftover is Starter;', 'next leftover is Pact;', 1)
house = once(
    house,
    '  assert.equal(WP.playFor("chicken_of_woods"), "drip");\n  assert.equal(WP.DRIP, "drip");',
    '  assert.equal(WP.playFor("yeast"), "bloom");\n  assert.equal(WP.BLOOM, "bloom");\n  assert.notEqual(WP.playFor("yeast"), "drip");\n  assert.notEqual(WP.playFor("yeast"), "dry");\n  assert.notEqual(WP.playFor("yeast"), "sill");\n  assert.equal(WP.playFor("chicken_of_woods"), "drip");\n  assert.equal(WP.DRIP, "drip");',
    "house starter asserts",
)
n = house.count('playFor("yeast"), "sill"')
house = house.replace('playFor("yeast"), "sill"', 'playFor("lichen"), "sill"')
print("house sill pins moved", n)
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
arch = once(
    arch,
    "| **Last Updated** | 2026-09-02 (Flame drips a sash stile as warm wood; eighth leftover of the fungi den done; Puff leftover still clouds a window apron as a spore dish; seventh leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Starter; catalog stays 220; drip is the tell; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust) |",
    "| **Last Updated** | 2026-09-02 (Starter blooms a damp pane as a yeast film; ninth leftover of the fungi den done; Flame leftover still drips a sash stile as warm wood; eighth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Pact; catalog stays 220; bloom is the tell; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |",
    "arch",
)
Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
flame_line = None
for line in rm.splitlines():
    if "Flame (`chicken_of_woods`" in line and line.strip().startswith("- [x]"):
        flame_line = line
        break
if not flame_line:
    raise SystemExit("flame line missing")
starter_entry = (
    "- [x] Starter (`yeast` / `starter`) blooms a real damp pane as a yeast film: walk onto the pane (warm condensation micro-site — Tun dries a pane as moss film; Starter blooms the lower damp glass as soft culture film; not Tun's dry, not Flame's stile drip, not Frill's shelf, not Puff's apron cloud, not Cap's moss-cup warts, not foam, not culture; soft film bloom; yeast; named: Starter. The bloom is the tell. Hours: On the glass. Hello: \"I bloomed. That was hello.\" Play: \"A bloom. Review the yeast film.\" / \"I win by remaining a culture.\" Temperament: soft. Not drip. Not dry. Not foam. Not culture. Not film. Not bloom as guest Bloom (Bloom still walls). Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Ninth leftover of the fungi den. After Pact the fungi/cellar window-play ten may close. Do not start Pact.\n"
)
if "Starter (`yeast`" not in rm:
    rm = rm.replace(flame_line + "\n", flame_line + "\n\n" + starter_entry, 1)
rm = once(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Flame drips a sash stile as warm wood; eighth leftover of the fungi den done; Puff leftover still clouds a window apron as a spore dish; seventh leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Starter; catalog stays 220; drip is the tell; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Starter blooms a damp pane as a yeast film; ninth leftover of the fungi den done; Flame leftover still drips a sash stile as warm wood; eighth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Pact; catalog stays 220; bloom is the tell; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)",
    "roadmap footer",
)
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    old = "Flame drips a sash stile as warm wood: walk onto the stile, sit the bright bracket, drip once, sit the warm wood, then leave. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust."
    new = "Starter blooms a damp pane as a yeast film: walk onto the pane, sit the warm damp glass, bloom once, sit the soft culture film, then leave. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    if old not in text:
        raise SystemExit(f"{p}: Flame sentence mismatch")
    text = text.replace(old, new, 1)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

print("docs/house done")
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house next", "next leftover is Pact" in h)
print("lichen sill", h.count('playFor("lichen"), "sill"'))
print("yeast bloom", h.count('playFor("yeast"), "bloom"'))
print("fungi ten close note", "fungi/cellar window-play ten may close" in Path("docs/ROADMAP.md").read_text(encoding="utf-8"))
