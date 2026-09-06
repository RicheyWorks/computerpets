# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:220]!r}")
    return text.replace(old, new, 1)

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
house = house.replace(
    'test("Pact leftover plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed;',
    'test("Gleam leftover thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed;',
    1,
)
house = house.replace('next leftover is Gleam;', 'next leftover is Choir;', 1)
house = once(
    house,
    '  assert.equal(WP.playFor("lichen"), "plaque");\n  assert.equal(WP.PLAQUE, "plaque");\n  assert.notEqual(WP.playFor("lichen"), "bloom");\n  assert.notEqual(WP.playFor("lichen"), "drip");\n  assert.notEqual(WP.playFor("lichen"), "sill");\n  assert.equal(WP.playFor("yeast"), "bloom");\n  assert.equal(WP.BLOOM, "bloom");',
    '  assert.equal(WP.playFor("photovore"), "thirst");\n  assert.equal(WP.THIRST, "thirst");\n  assert.notEqual(WP.playFor("photovore"), "plaque");\n  assert.notEqual(WP.playFor("photovore"), "glow");\n  assert.notEqual(WP.playFor("photovore"), "sill");\n  assert.equal(WP.playFor("lichen"), "plaque");\n  assert.equal(WP.PLAQUE, "plaque");\n  assert.notEqual(WP.playFor("lichen"), "bloom");\n  assert.notEqual(WP.playFor("lichen"), "drip");\n  assert.notEqual(WP.playFor("lichen"), "sill");\n  assert.equal(WP.playFor("yeast"), "bloom");\n  assert.equal(WP.BLOOM, "bloom");',
    "house gleam asserts",
)
n = house.count('playFor("photovore"), "sill"')
house = house.replace('playFor("photovore"), "sill"', 'playFor("choir"), "sill"')
print("house sill pins moved", n)
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
arch = once(
    arch,
    "| **Last Updated** | 2026-09-02 (Pact plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; Starter leftover still blooms a damp pane as a yeast film; ninth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Gleam; catalog stays 220; plaque is the tell; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |",
    "| **Last Updated** | 2026-09-02 (Gleam thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Choir; catalog stays 220; thirst is the tell; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |",
    "arch",
)
Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
pact_line = None
for line in rm.splitlines():
    if "Pact (`lichen`" in line and line.strip().startswith("- [x]"):
        pact_line = line
        break
if not pact_line:
    raise SystemExit("pact line missing")
gleam_entry = (
    "- [x] Gleam (`photovore` / `gleam`) thirsts a real bright pane as lamp glass: walk onto the pane (upper-right bright glass — lamp-glass a photovore keeps; not Pact's cool left bark stile, not Starter's lower damp yeast film, not Flame's right warm drip, not Sun's upper sash warm, not Spark's lower sash glow; soft thirst; Lucivora sitim; mouthless light-drink; named: Gleam. The thirst is the tell. Hours: Light of a treaty. Hello: \"I drank. That was hello.\" Play: \"A wavelength. Drink it.\" / \"I win by remaining thirsty.\" Temperament: thirsty. Not glow. Not gleam as kind. Not sun. Not drink. Not sip. Not warm. Not flash. Not plaque. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. First leftover of the far den. Next leftover is Choir (`choir`). Do not start Choir.\n"
)
if "Gleam (`photovore`" not in rm:
    rm = rm.replace(pact_line + "\n", pact_line + "\n\n" + gleam_entry, 1)
# also update Pact line's "Next leftover is Gleam" if present
rm = rm.replace("Next leftover is Gleam (`photovore`). Do not start Gleam.", "Next leftover was Gleam (`photovore`); Gleam thirsts. Next leftover is Choir (`choir`). Do not start Choir.", 1)
rm = once(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Pact plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; Starter leftover still blooms a damp pane as a yeast film; ninth leftover of the fungi den done; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Gleam; catalog stays 220; plaque is the tell; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Gleam thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Choir; catalog stays 220; thirst is the tell; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)",
    "roadmap footer",
)
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    old = "Pact plaques a cool stile as bark stone: walk onto the stile, sit the cool bark wood, plaque once, sit the two-kingdom share, then leave. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    new = "Gleam thirsts a bright pane as lamp glass: walk onto the pane, sit the bright lamp glass, thirst once, sit the wavelength drink, then leave. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    if old not in text:
        raise SystemExit(f"{p}: Pact sentence mismatch")
    text = text.replace(old, new, 1)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

print("docs/house done")
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house next", "next leftover is Choir" in h)
print("choir sill", h.count('playFor("choir"), "sill"'))
print("photovore thirst", h.count('playFor("photovore"), "thirst"'))
print("gleam named", "Gleam (`photovore`" in Path("docs/ROADMAP.md").read_text(encoding="utf-8"))
print("choir next", "next leftover is Choir" in Path("docs/ROADMAP.md").read_text(encoding="utf-8"))
