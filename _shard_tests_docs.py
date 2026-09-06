# -*- coding: utf-8 -*-
from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, got {n}")
    return text.replace(old, new, 1)

CJS = Path("_shard_cjs_block.txt").read_text(encoding="utf-8").lstrip("\ufeff")
MJS = Path("_shard_mjs_block.txt").read_text(encoding="utf-8").lstrip("\ufeff")
if not CJS.startswith("\n"):
    CJS = "\n" + CJS
if not CJS.endswith("\n"):
    CJS += "\n"
if not MJS.startswith("\n"):
    MJS = "\n" + MJS
if not MJS.endswith("\n"):
    MJS += "\n"

marker = (
    'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved methane bowl");\n'
    '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
    '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "float-off");\n'
    '  assert.equal(play.abort, true);\n'
    '});'
)

for path, block, label in [
    ("desktop/renderer/window-play.test.cjs", CJS, "cjs"),
    ("web/scripts/window-play.test.mjs", MJS, "mjs"),
]:
    t = Path(path).read_text(encoding="utf-8")
    if "Shard facets a sash gap" in t:
        print(path, "already has Shard test")
    else:
        if t.count(marker) != 1:
            raise SystemExit(f"{label} nimbus abort marker {t.count(marker)}")
        t = t.replace(marker, marker + block, 1)
    n = t.count('playFor("silica"), "sill"')
    t = t.replace('playFor("silica"), "sill"', 'playFor("terminator"), "sill"')
    print(path, "silica sill -> terminator sill:", n)
    # also generic sill pickTarget guest silica -> terminator in "other guests" test
    idx = t.find('other guests do not clone Rui')
    if idx < 0:
        raise SystemExit(path + ": other guests test missing")
    chunk_end = t.find('});', idx) + 3
    chunk = t[idx:chunk_end]
    if '"silica"' in chunk:
        new_chunk = chunk.replace('pickTarget([WIN], 80, "silica", WORK, P.SPRITE)', 'pickTarget([WIN], 80, "terminator", WORK, P.SPRITE)', 1)
        t = t[:idx] + new_chunk + t[chunk_end:]
        print(path, "sill guest -> terminator")
    elif '"terminator"' in chunk:
        print(path, "sill guest already terminator")
    else:
        print(path, "WARN: no silica/terminator in other guests chunk")
    # Nimbus test still asserts silica sill — flip those inside Nimbus tests to terminator
    # After our replace above, playFor("silica"), "sill" should be gone; Nimbus block had assert.equal(P.playFor("silica"), "sill")
    nimbus_sill = t.count('playFor("silica"), "sill"')
    print(path, "remaining silica sill", nimbus_sill)
    # Inside Nimbus test, change silica sill assert to terminator (already done by global replace if it was playFor("silica"), "sill")
    # But Nimbus has assert.equal(P.playFor("silica"), "sill") — same pattern, replaced.
    # Shard test asserts silica facet and terminator sill — good.
    Path(path).write_text(t, encoding="utf-8", newline="\n")
    print(path, "Shard tests", t.count("Shard facets"), "tests", t.count('test("'))

# leftover-house
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
old_title = 'test("Nimbus leftover floats a mid pane as a methane bowl; third leftover of the far den done;'
if old_title not in house:
    raise SystemExit("house title missing")
house = house.replace(
    'test("Nimbus leftover floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed;',
    'test("Shard leftover facets a sash gap as an inkstone; fourth leftover of the far den done; Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed;',
    1,
)
house = house.replace('next leftover is Silica;', 'next leftover is Dusk;', 1)
n = house.count('playFor("silica"), "sill"')
house = house.replace('playFor("silica"), "sill"', 'playFor("terminator"), "sill"')
print("house sill pins moved", n)
old_assert = (
    '  assert.equal(WP.playFor("nimbus"), "float");\n'
    '  assert.equal(WP.FLOAT, "float");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "chord");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "cloud");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "sill");\n'
    '  assert.equal(WP.playFor("choir"), "chord");'
)
new_assert = (
    '  assert.equal(WP.playFor("silica"), "facet");\n'
    '  assert.equal(WP.FACET, "facet");\n'
    '  assert.notEqual(WP.playFor("silica"), "shard");\n'
    '  assert.notEqual(WP.playFor("silica"), "silica");\n'
    '  assert.notEqual(WP.playFor("silica"), "float");\n'
    '  assert.notEqual(WP.playFor("silica"), "daub");\n'
    '  assert.notEqual(WP.playFor("silica"), "teeth");\n'
    '  assert.notEqual(WP.playFor("silica"), "plane");\n'
    '  assert.notEqual(WP.playFor("silica"), "sill");\n'
    '  assert.equal(WP.playFor("nimbus"), "float");\n'
    '  assert.equal(WP.FLOAT, "float");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "chord");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "cloud");\n'
    '  assert.notEqual(WP.playFor("nimbus"), "sill");\n'
    '  assert.equal(WP.playFor("choir"), "chord");'
)
house = once(house, old_assert, new_assert, "house silica asserts")
# final pin at end was silica sill -> already terminator; also ensure mason_bee still asserted somewhere? optional
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")
print("house done; next Dusk", "next leftover is Dusk" in house)

# docs
arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
arch_old = "| **Last Updated** | 2026-09-02 (Nimbus floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Silica; catalog stays 220; float is the tell; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
arch_new = "| **Last Updated** | 2026-09-02 (Shard facets a sash gap as an inkstone; fourth leftover of the far den done; Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Dusk; catalog stays 220; facet is the tell; Nimbus still owns float; Mortar still owns daub; Mane still owns teeth; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry) |"
arch = once(arch, arch_old, arch_new, "arch")
Path("docs/ARCHITECTURE.md").write_text(arch, encoding="utf-8", newline="\n")

rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
pact_next_old = "Next leftover was Nimbus (`nimbus`); Nimbus floats. Next leftover is Silica (`silica`). Do not start Silica."
pact_next_new = "Next leftover was Nimbus (`nimbus`); Nimbus floats. Next leftover was Silica (`silica`); Shard facets. Next leftover is Dusk (`terminator`). Do not start Dusk."
rm = once(rm, pact_next_old, pact_next_new, "roadmap next")
shard_entry = (
    "- [x] Shard (`silica` / `shard`) facets a real sash gap as an inkstone: walk into the gap (left sash gap — inkstone a living crystal facets; not Mortar's left inkstone-cell daub, not Mane's right wood-wound teeth, not Nimbus methane bowl mid pane, not Choir blotter air, not Gleam lamp glass; sharp facet; living crystal; not quartz; named: Shard. The facet is the tell. Hours: Inkstone. Hello: \"I faceted. Hello.\" Play: \"A facet. Review the edge.\" / \"I win by remaining a mineral.\" Temperament: patient. Not shard as kind. Not silica as kind. Not float. Not daub. Not teeth. Not plane. Not edge. Same `playFor` door. No new `/demo` route. Sleep, hide, leave, rest, the keeper card, and the ribbon still win. Windows first. Mac / Linux window play stays `mac-linux-window-play`. Catalog stays 220. Fourth leftover of the far den. Next leftover is Dusk (`terminator`). Do not start Dusk.\n"
)
if "Shard (`silica`" not in rm:
    # insert after Pact line
    lines = rm.splitlines(True)
    out = []
    inserted = False
    for line in lines:
        out.append(line)
        if (not inserted) and line.startswith("- [x] Pact (`lichen`"):
            out.append("\n")
            out.append(shard_entry)
            out.append("\n")
            inserted = True
    if not inserted:
        raise SystemExit("Pact line missing for Shard insert")
    rm = "".join(out)
rm_old = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Nimbus floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Silica; catalog stays 220; float is the tell; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Mane still owns teeth; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
rm_new = "**Last Updated:** 2026-09-02 (Phase 6 leftover: Shard facets a sash gap as an inkstone; fourth leftover of the far den done; Nimbus leftover still floats a mid pane as a methane bowl; third leftover of the far den done; Choir leftover still chords a mid pane as blotter air; second leftover of the far den done; Gleam leftover still thirsts a bright pane as lamp glass; first leftover of the far den done; Pact leftover still plaques a cool stile as bark stone; tenth leftover of the fungi den done and fungi ten closed; meadow ten closed; hive ten closed; shore ten is closed; next leftover is Dusk; catalog stays 220; facet is the tell; Nimbus still owns float; Mortar still owns daub; Mane still owns teeth; Choir still owns chord; Gleam still owns thirst; Pact still owns plaque; Starter still owns bloom; Flame still owns drip; Puff still owns cloud; Ring still owns zones; Horn still owns fork; Lattice still owns hollow; Cap still owns warts; Frill still owns shelf; Pebble still owns puff; Floss still owns dust; Tun still owns dry)"
rm = once(rm, rm_old, rm_new, "roadmap footer")
Path("docs/ROADMAP.md").write_text(rm, encoding="utf-8", newline="\n")

for p in ["README.md", "desktop/README.md"]:
    text = Path(p).read_text(encoding="utf-8")
    old = "Nimbus floats a mid pane as a methane bowl: walk onto the pane, sit the methane-bowl membrane, float once, sit the cold, then leave. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Mane still owns teeth. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    new = "Shard facets a sash gap as an inkstone: walk into the gap, sit the facet, then leave. Nimbus still owns float. Mortar still owns daub. Mane still owns teeth. Choir still owns chord. Gleam still owns thirst. Pact still owns plaque. Starter still owns bloom. Flame still owns drip. Puff still owns cloud. Ring still owns zones. Horn still owns fork. Lattice still owns hollow. Cap still owns warts. Frill still owns shelf. Pebble still owns puff. Floss still owns dust. Tun still owns dry."
    if old not in text:
        raise SystemExit(p + ": Nimbus sentence mismatch")
    text = text.replace(old, new, 1)
    Path(p).write_text(text, encoding="utf-8", newline="\n")
    print(p, "updated")

print("tests/docs/house done")
