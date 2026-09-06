# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}\nOLD: {old[:260]!r}")
    return text.replace(old, new, 1)

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
house = house.replace(
    'test("Gleam leftover thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed;',
    'test("Choir leftover chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed;',
    1,
)
house = house.replace('next leftover is Choir;', 'next leftover is Nimbus;', 1)
house = once(
    house,
    '  assert.equal(WP.playFor("photovore"), "thirst");\n  assert.equal(WP.THIRST, "thirst");\n  assert.notEqual(WP.playFor("photovore"), "plaque");\n  assert.notEqual(WP.playFor("photovore"), "glow");\n  assert.notEqual(WP.playFor("photovore"), "sill");\n  assert.equal(WP.playFor("lichen"), "plaque");\n  assert.equal(WP.PLAQUE, "plaque");\n  assert.notEqual(WP.playFor("lichen"), "bloom");\n  assert.notEqual(WP.playFor("lichen"), "drip");\n  assert.notEqual(WP.playFor("lichen"), "sill");\n  assert.equal(WP.playFor("yeast"), "bloom");\n  assert.equal(WP.BLOOM, "bloom");',
    '  assert.equal(WP.playFor("choir"), "chord");\n  assert.equal(WP.CHORD, "chord");\n  assert.notEqual(WP.playFor("choir"), "thirst");\n  assert.notEqual(WP.playFor("choir"), "chime");\n  assert.notEqual(WP.playFor("choir"), "sill");\n  assert.equal(WP.playFor("photovore"), "thirst");\n  assert.equal(WP.THIRST, "thirst");\n  assert.notEqual(WP.playFor("photovore"), "plaque");\n  assert.notEqual(WP.playFor("photovore"), "glow");\n  assert.notEqual(WP.playFor("photovore"), "sill");\n  assert.equal(WP.playFor("lichen"), "plaque");\n  assert.equal(WP.PLAQUE, "plaque");\n  assert.notEqual(WP.playFor("lichen"), "bloom");\n  assert.notEqual(WP.playFor("lichen"), "drip");\n  assert.notEqual(WP.playFor("lichen"), "sill");\n  assert.equal(WP.playFor("yeast"), "bloom");\n  assert.equal(WP.BLOOM, "bloom");',
    "house choir asserts",
)
n = house.count('playFor("choir"), "sill"')
house = house.replace('playFor("choir"), "sill"', 'playFor("nimbus"), "sill"')
print("house sill pins moved", n)
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
arch = once(
    arch,
    "| **Last Updated** | 2026-09-02 (Gleam thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Choir; catalog stays 220; thirst is the tell; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |",
    "| **Last Updated** | 2026-09-02 (Choir chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Nimbus; catalog stays 220; chord is the tell; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |",
    "arch",
)
Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
gleam_line = None
for line in rm.splitlines():
    if "Gleam (`photovore`" in line and line.strip().startswith("- [x]"):
        gleam_line = line
        break
if not gleam_line:
    raise SystemExit("gleam line missing")
choir_entry = (
    "- [x] Choir (`choir` / `choir`) chords a real mid pane as blotter air: walk onto the pane (mid-center glass — blotter-air membrane a chord body keeps; not Gleam's upper-right lamp glass, not Pact's cool left bark stile, not Starter's lower damp yeast film, not Pulse's chime moons, not Echo's mid jamb perch; soft chord; Harmonia plexus; one animal, many notes; named: Choir. The chord is the tell. Hours: Tone of a treaty. Hello: \"I sounded. That was hello.\" Play: \"A note I was not using.\" / \"Inside a note.\" Temperament: harmonic. Not choir as kind. Not chorus. Not hum. Not chime. Not drone. Not sing. Not song. Not thirst. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Second leftover of the far den. Next leftover is Nimbus (`nimbus`). Do not start Nimbus.\n"
)
if "Choir (`choir`" not in rm:
    rm = rm.replace(gleam_line + "\n", gleam_line + "\n\n" + choir_entry, 1)
rm = rm.replace(
    "Next leftover is Choir (`choir`). Do not start Choir.",
    "Next leftover was Choir (`choir`); Choir chords. Next leftover is Nimbus (`nimbus`). Do not start Nimbus.",
    1,
)
rm = once(
    rm,
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Gleam thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Choir; catalog stays 220; thirst is the tell; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)",
    "**Last Updated:** 2026-09-02 (Phase 6 leftover: Choir chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Nimbus; catalog stays 220; chord is the tell; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)",
    "roadmap footer",
)
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    old = "Gleam thirsts a bright pane as lamp glass: walk onto the pane, sit the bright lamp glass, thirst once, sit the wavelength drink, then leave. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    new = "Choir chords a mid pane as blotter air: walk onto the pane, sit the blotter-air membrane, chord once, sit the overtone, then leave. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    if old not in text:
        raise SystemExit(f"{p}: Gleam sentence mismatch")
    text = text.replace(old, new, 1)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

print("docs/house done")
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house next", "next leftover is Nimbus" in h)
print("nimbus sill", h.count('playFor("nimbus"), "sill"'))
print("choir chord", h.count('playFor("choir"), "chord"'))
print("choir named", "Choir (`choir`" in Path("docs/ROADMAP.md").read_text(encoding="utf-8"))
print("nimbus next", "next leftover is Nimbus" in Path("docs/ROADMAP.md").read_text(encoding="utf-8"))
