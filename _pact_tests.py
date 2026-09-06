# -*- coding: utf-8 -*-
from pathlib import Path

CJS = Path("_pact_cjs_block.txt").read_text(encoding="utf-8")
MJS = Path("_pact_mjs_block.txt").read_text(encoding="utf-8")

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")
if "Pact plaques a cool stile" in cjs:
    print("cjs already has Pact test")
else:
    marker = (
        'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved yeast film");\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "bloom-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if cjs.count(marker) != 1:
        raise SystemExit(f"cjs starter abort marker {cjs.count(marker)}")
    cjs = cjs.replace(marker, marker + "\n" + CJS, 1)

n = cjs.count('playFor("lichen"), "sill"')
cjs = cjs.replace('playFor("lichen"), "sill"', 'playFor("photovore"), "sill"')
print("cjs replaced lichen sill -> photovore sill:", n)
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
if "Pact plaques a cool stile" not in mjs:
    marker2 = (
        '  assert.equal(play.phase, "bloom");\n'
        '  const beforeX = play.target.holdX;\n'
        '  const moved = { ...WIN, x: WIN.x + 140 };\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });\n'
        '  assert.equal(play.phase, "bloom");\n'
        '  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "bloom-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if mjs.count(marker2) != 1:
        raise SystemExit(f"mjs starter abort marker {mjs.count(marker2)}")
    mjs = mjs.replace(marker2, marker2 + "\n" + MJS, 1)
n2 = mjs.count('playFor("lichen"), "sill"')
mjs = mjs.replace('playFor("lichen"), "sill"', 'playFor("photovore"), "sill"')
print("mjs replaced lichen sill -> photovore sill:", n2)
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
print("cjs Pact", cjs.count("Pact plaques"), "mjs Pact", mjs.count("Pact plaques"))
print("cjs tests", cjs.count('test("'), "mjs", mjs.count('test("'))
print("cjs lichen sill left", cjs.count('playFor("lichen"), "sill"'), "photovore sill", cjs.count('playFor("photovore"), "sill"'))
print("mjs lichen sill left", mjs.count('playFor("lichen"), "sill"'), "photovore sill", mjs.count('playFor("photovore"), "sill"'))
print("cjs lichen plaque", cjs.count('playFor("lichen"), "plaque"'), "mjs", mjs.count('playFor("lichen"), "plaque"'))
