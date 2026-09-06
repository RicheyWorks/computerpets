# -*- coding: utf-8 -*-
from pathlib import Path

CJS = Path("_gleam_cjs_block.txt").read_text(encoding="utf-8")
MJS = Path("_gleam_mjs_block.txt").read_text(encoding="utf-8")

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")
if "Gleam thirsts a bright pane" in cjs:
    print("cjs already has Gleam test")
else:
    marker = (
        'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved bark stone");\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "plaque-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if cjs.count(marker) != 1:
        raise SystemExit(f"cjs pact abort marker {cjs.count(marker)}")
    cjs = cjs.replace(marker, marker + "\n" + CJS, 1)

n = cjs.count('playFor("photovore"), "sill"')
cjs = cjs.replace('playFor("photovore"), "sill"', 'playFor("choir"), "sill"')
print("cjs replaced photovore sill -> choir sill:", n)
# Gleam test itself asserts choir sill; leave those. Also Pact test had photovore sill - those become choir.
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
if "Gleam thirsts a bright pane" not in mjs:
    marker2 = (
        '  assert.equal(play.phase, "plaque");\n'
        '  const beforeX = play.target.holdX;\n'
        '  const moved = { ...WIN, x: WIN.x + 140 };\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });\n'
        '  assert.equal(play.phase, "plaque");\n'
        '  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "plaque-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if mjs.count(marker2) != 1:
        raise SystemExit(f"mjs pact abort marker {mjs.count(marker2)}")
    mjs = mjs.replace(marker2, marker2 + "\n" + MJS, 1)
n2 = mjs.count('playFor("photovore"), "sill"')
mjs = mjs.replace('playFor("photovore"), "sill"', 'playFor("choir"), "sill"')
print("mjs replaced photovore sill -> choir sill:", n2)
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
print("cjs Gleam", cjs.count("Gleam thirsts"), "mjs Gleam", mjs.count("Gleam thirsts"))
print("cjs tests", cjs.count('test("'), "mjs", mjs.count('test("'))
