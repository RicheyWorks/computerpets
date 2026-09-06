# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}")
    return text.replace(old, new, 1)

for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    t = Path(path).read_text(encoding="utf-8")
    needle = 'const target = P.pickTarget([WIN], 80, "nimbus", WORK, P.SPRITE);'
    # Only replace the generic sill test occurrence — first occurrence before Nimbus tests
    idx = t.find('other guests do not clone Rui')
    if idx < 0:
        raise SystemExit(path + ": other guests test missing")
    chunk_end = t.find('});', idx) + 3
    chunk = t[idx:chunk_end]
    if '"nimbus"' not in chunk:
        if '"silica"' in chunk:
            print(path, "sill guest already silica")
        else:
            raise SystemExit(path + ": no nimbus/silica in other guests test")
    else:
        new_chunk = chunk.replace('pickTarget([WIN], 80, "nimbus", WORK, P.SPRITE)', 'pickTarget([WIN], 80, "silica", WORK, P.SPRITE)', 1)
        t = t[:idx] + new_chunk + t[chunk_end:]
        Path(path).write_text(t, encoding="utf-8", newline="\n")
        print(path, "sill guest -> silica")

house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
old_title_start = 'test("Choir leftover chords a mid pane as blotter air; second leftover of the far den done;'
if old_title_start not in house:
    raise SystemExit("house title missing")
house = house.replace(
    'test("Choir leftover chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed;',
    'test("Nimbus leftover floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed;',
    1,
)
house = house.replace('next leftover is Nimbus;', 'next leftover is Silica;', 1)
n = house.count('playFor("nimbus"), "sill"')
house = house.replace('playFor("nimbus"), "sill"', 'playFor("silica"), "sill"')
print("house sill pins moved", n)
old_assert = (
    '  assert.equal(WP.playFor("choir"), "chord");\n'
    '  assert.equal(WP.CHORD, "chord");\n'
    '  assert.notEqual(WP.playFor("choir"), "thirst");\n'
    '  assert.notEqual(WP.playFor("choir"), "chime");\n'
    '  assert.notEqual(WP.playFor("choir"), "sill");\n'
    '  assert.equal(WP.playFor("photovore"), "thirst");'
)
new_assert = (
    '  assert.equal(WP.playFor("nimbus"), "float");\n'
    '  assert.equal(WP.FLOAT, "float");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "chord");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "cloud");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "sill");\n'
    '  assert.equal(WP.playFor("choir"), "chord");\n'
    '  assert.equal(WP.CHORD, "chord");\n'
    '  assert.notEqual(WP.playFor("choir"), "thirst");\n'
    '  assert.notEqual(WP.playFor("choir"), "chime");\n'
    '  assert.notEqual(WP.playFor("choir"), "sill");\n'
    '  assert.equal(WP.playFor("photovore"), "thirst");'
)
house = once(house, old_assert, new_assert, "house nimbus asserts")
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")

arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
arch_old = "| **Last Updated** | 2026-09-02 (Choir chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Nimbus; catalog stays 220; chord is the tell; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
arch_new = "| **Last Updated** | 2026-09-02 (Nimbus floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Silica; catalog stays 220; float is the tell; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
arch = once(arch, arch_old, arch_new, "arch")
Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
choir_line = None
for line in rm.splitlines():
    if "Choir (`choir`" in line and line.strip().startswith("- [x]"):
        choir_line = line
        break
if not choir_line:
    raise SystemExit("choir line missing")
nimbus_entry = (
    "- [x] Nimbus (`nimbus` / `drift`) floats a real mid pane as a methane bowl: walk onto the pane (lower-mid glass — methane-bowl membrane a cold-gas floater keeps; not Choir's mid-center blotter air, not Gleam's upper-right lamp glass, not Pact's cool left bark stile, not Starter's lower damp yeast film, not Pulse's chime moons, not Coin's bowl circle; soft float; methane floater; one animal, a gas; named: Nimbus / Drift. The float is the tell. Hours: Gas of a treaty. Hello: \"I floated. That was hello.\" Play: \"A float. Review the air.\" / \"I win by remaining a gas.\" Temperament: cold. Not nimbus as kind. Not drift. Not cloud. Not mist. Not fog. Not haze. Not puff. Not dust. Not rain. Not chord. Not thirst. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Third leftover of the far den. Next leftover is Silica (`silica`). Do not start Silica.\n"
)
if "Nimbus (`nimbus`" not in rm:
    rm = rm.replace(choir_line + "\n", choir_line + "\n\n" + nimbus_entry, 1)
rm = rm.replace(
    "Next leftover is Nimbus (`nimbus`). Do not start Nimbus.",
    "Next leftover was Nimbus (`nimbus`); Nimbus floats. Next leftover is Silica (`silica`). Do not start Silica.",
    1,
)
rm_old = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Choir chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Nimbus; catalog stays 220; chord is the tell; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
rm_new = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Nimbus floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Silica; catalog stays 220; float is the tell; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
rm = once(rm, rm_old, rm_new, "roadmap footer")
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    old = "Choir chords a mid pane as blotter air: walk onto the pane, sit the blotter-air membrane, chord once, sit the overtone, then leave. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    new = "Nimbus floats a mid pane as a methane bowl: walk onto the pane, sit the methane-bowl membrane, float once, sit the cold, then leave. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    if old not in text:
        raise SystemExit(p + ": Choir sentence mismatch")
    text = text.replace(old, new, 1)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

print("docs/house done")
