# -*- coding: utf-8 -*-
from pathlib import Path

CJS = Path("_choir_cjs_block.txt").read_text(encoding="utf-8")
MJS = Path("_choir_mjs_block.txt").read_text(encoding="utf-8")

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")
if "Choir chords a mid pane" in cjs:
    print("cjs already has Choir test")
else:
    marker = (
        'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved lamp glass");\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "thirst-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if cjs.count(marker) != 1:
        raise SystemExit(f"cjs gleam abort marker {cjs.count(marker)}")
    cjs = cjs.replace(marker, marker + "\n" + CJS, 1)

n = cjs.count('playFor("choir"), "sill"')
cjs = cjs.replace('playFor("choir"), "sill"', 'playFor("nimbus"), "sill"')
print("cjs replaced choir sill -> nimbus sill:", n)
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
if "Choir chords a mid pane" not in mjs:
    marker2 = (
        '  assert.equal(play.phase, "thirst");\n'
        '  const beforeX = play.target.holdX;\n'
        '  const moved = { ...WIN, x: WIN.x + 140 };\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });\n'
        '  assert.equal(play.phase, "thirst");\n'
        '  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "thirst-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if mjs.count(marker2) != 1:
        # try with refit message variant from cjs-like
        marker2b = (
            '  assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved lamp glass");\n'
            '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
            '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "thirst-off");\n'
            '  assert.equal(play.abort, true);\n'
            '});'
        )
        if mjs.count(marker2b) == 1:
            marker2 = marker2b
        else:
            raise SystemExit(f"mjs gleam abort marker {mjs.count(marker2)} / alt {mjs.count(marker2b)}")
    mjs = mjs.replace(marker2, marker2 + "\n" + MJS, 1)
n2 = mjs.count('playFor("choir"), "sill"')
mjs = mjs.replace('playFor("choir"), "sill"', 'playFor("nimbus"), "sill"')
print("mjs replaced choir sill -> nimbus sill:", n2)
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
print("cjs Choir", cjs.count("Choir chords"), "mjs Choir", mjs.count("Choir chords"))
print("cjs tests", cjs.count('test("'), "mjs", mjs.count('test("'))
