# -*- coding: utf-8 -*-
from pathlib import Path

CJS = Path("_flame_cjs_block.txt").read_text(encoding="utf-8")
MJS = Path("_flame_mjs_block.txt").read_text(encoding="utf-8")

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")
if "Flame drips a sash stile" in cjs:
    print("cjs already has Flame test")
else:
    marker = (
        'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved spore dish");\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "cloud-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if cjs.count(marker) != 1:
        raise SystemExit(f"cjs puff abort marker {cjs.count(marker)}")
    cjs = cjs.replace(marker, marker + "\n" + CJS, 1)

n = cjs.count('assert.equal(P.playFor("chicken_of_woods"), "sill");')
cjs = cjs.replace('assert.equal(P.playFor("chicken_of_woods"), "sill");', 'assert.equal(P.playFor("yeast"), "sill");')
print("cjs replaced chicken sill -> yeast sill:", n)
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
if "Flame drips a sash stile" not in mjs:
    marker2 = (
        '  assert.equal(play.phase, "cloud");\n'
        '  const beforeX = play.target.holdX;\n'
        '  const moved = { ...WIN, x: WIN.x + 140 };\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });\n'
        '  assert.equal(play.phase, "cloud");\n'
        '  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "cloud-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if mjs.count(marker2) != 1:
        raise SystemExit(f"mjs puff abort marker {mjs.count(marker2)}")
    mjs = mjs.replace(marker2, marker2 + "\n" + MJS, 1)
n2 = mjs.count('assert.equal(P.playFor("chicken_of_woods"), "sill");')
mjs = mjs.replace('assert.equal(P.playFor("chicken_of_woods"), "sill");', 'assert.equal(P.playFor("yeast"), "sill");')
print("mjs replaced chicken sill -> yeast sill:", n2)
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
print("cjs Flame", cjs.count("Flame drips"), "mjs Flame", mjs.count("Flame drips"))
print("cjs tests", cjs.count('test("'), "mjs", mjs.count('test("'))
