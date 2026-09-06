# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:220]!r}")
    return text.replace(old, new, 1)

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
house = house.replace(
    'test("Starter leftover blooms a damp pane as a yeast film; ninth leftover of the fungi den done;',
    'test("Pact leftover plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; Starter leftover still blooms a damp pane as a yeast film; ninth leftover of the fungi den done;',
    1,
)
house = house.replace('next leftover is Pact;', 'next leftover is Gleam;', 1)
house = once(
    house,
    '  assert.equal(WP.playFor("yeast"), "bloom");\n  assert.equal(WP.BLOOM, "bloom");\n  assert.notEqual(WP.playFor("yeast"), "drip");\n  assert.notEqual(WP.playFor("yeast"), "dry");\n  assert.notEqual(WP.playFor("yeast"), "sill");\n  assert.equal(WP.playFor("chicken_of_woods"), "drip");\n  assert.equal(WP.DRIP, "drip");',
    '  assert.equal(WP.playFor("lichen"), "plaque");\n  assert.equal(WP.PLAQUE, "plaque");\n  assert.notEqual(WP.playFor("lichen"), "bloom");\n  assert.notEqual(WP.playFor("lichen"), "drip");\n  assert.notEqual(WP.playFor("lichen"), "sill");\n  assert.equal(WP.playFor("yeast"), "bloom");\n  assert.equal(WP.BLOOM, "bloom");\n  assert.notEqual(WP.playFor("yeast"), "drip");\n  assert.notEqual(WP.playFor("yeast"), "dry");\n  assert.notEqual(WP.playFor("yeast"), "sill");\n  assert.equal(WP.playFor("chicken_of_woods"), "drip");\n  assert.equal(WP.DRIP, "drip");',
    "house pact asserts",
)
n = house.count('playFor("lichen"), "sill"')
house = house.replace('playFor("lichen"), "sill"', 'playFor("photovore"), "sill"')
print("house sill pins moved", n)
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
arch = once(
    arch,
    "| **Last Updated** | 2026-09-02 (Starter blooms a damp pane as a yeast film; ninth leftover of the fungi den done; Flame leftover still drips a sash stile as warm wood; eighth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Pact; catalog stays 220; bloom is the tell; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |",
    "| **Last Updated** | 2026-09-02 (Pact plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; Starter leftover still blooms a damp pane as a yeast film; ninth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Gleam; catalog stays 220; plaque is the tell; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |",
    "arch",
)
Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
starter_line = None
for line in rm.splitlines():
    if "Starter (`yeast`" in line and line.strip().startswith("- [x]"):
        starter_line = line
        break
if not starter_line:
    raise SystemExit("starter line missing")
pact_entry = (
    "- [x] Pact (`lichen` / `pact`) plaques a real cool stile as bark stone: walk onto the stile (upper cool left timber — bark/stone a two-kingdom plaque keeps; not Frill's mid left timber shelf, not Flame's right warm drip, not Starter's lower damp yeast film, not Tun's dry moss film, not Ring's mid zones, not Cap's apron warts, not Puff's apron cloud; slow plaque; lichen; two kingdoms; named: Pact. The plaque is the tell. Hours: Dew of a treaty. Hello: \"We are two. Hello.\" Play: \"A plaque. Review the share.\" / \"I win by remaining a treaty.\" Temperament: soft. Not bloom. Not drip. Not shelf. Not crust. Not stain. Not paint. Not plaque as a store. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Tenth leftover of the fungi den and closes fungi ten. Next leftover is Gleam (`photovore`). Do not start Gleam.\n"
)
if "Pact (`lichen`" not in rm:
    rm = rm.replace(starter_line + "\n", starter_line + "\n\n" + pact_entry, 1)
rm = once(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Starter blooms a damp pane as a yeast film; ninth leftover of the fungi den done; Flame leftover still drips a sash stile as warm wood; eighth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Pact; catalog stays 220; bloom is the tell; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Pact plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; Starter leftover still blooms a damp pane as a yeast film; ninth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Gleam; catalog stays 220; plaque is the tell; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)",
    "roadmap footer",
)
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    old = "Starter blooms a damp pane as a yeast film: walk onto the pane, sit the warm damp glass, bloom once, sit the soft culture film, then leave. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    new = "Pact plaques a cool stile as bark stone: walk onto the stile, sit the cool bark wood, plaque once, sit the two-kingdom share, then leave. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    if old not in text:
        raise SystemExit(f"{p}: Starter sentence mismatch")
    text = text.replace(old, new, 1)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

print("docs/house done")
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house next", "next leftover is Gleam" in h)
print("photovore sill", h.count('playFor("photovore"), "sill"'))
print("lichen plaque", h.count('playFor("lichen"), "plaque"'))
print("fungi ten closed", "fungi ten closed" in Path("docs/ROADMAP.md").read_text(encoding="utf-8"))
print("gleam named", "next leftover is Gleam" in Path("docs/ROADMAP.md").read_text(encoding="utf-8"))
