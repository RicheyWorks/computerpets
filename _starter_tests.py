# -*- coding: utf-8 -*-
from pathlib import Path

CJS = Path("_starter_cjs_block.txt").read_text(encoding="utf-8")
MJS = Path("_starter_mjs_block.txt").read_text(encoding="utf-8")

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")
if "Starter blooms a damp pane" in cjs:
    print("cjs already has Starter test")
else:
    marker = (
        'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved warm wood");\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "drip-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if cjs.count(marker) != 1:
        raise SystemExit(f"cjs flame abort marker {cjs.count(marker)}")
    cjs = cjs.replace(marker, marker + "\n" + CJS, 1)

n = cjs.count('playFor("yeast"), "sill"')
cjs = cjs.replace('playFor("yeast"), "sill"', 'playFor("lichen"), "sill"')
# Starter block should keep yeast as bloom — rewrite any lichen that landed inside Starter tests back? 
# Starter block uses playFor("lichen"), "sill" intentionally and playFor("yeast"), "bloom"
print("cjs replaced yeast sill -> lichen sill:", n)
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
if "Starter blooms a damp pane" not in mjs:
    marker2 = (
        '  assert.equal(play.phase, "drip");\n'
        '  const beforeX = play.target.holdX;\n'
        '  const moved = { ...WIN, x: WIN.x + 140 };\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { cmd: "idle" });\n'
        '  assert.equal(play.phase, "drip");\n'
        '  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "drip-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if mjs.count(marker2) != 1:
        raise SystemExit(f"mjs flame abort marker {mjs.count(marker2)}")
    mjs = mjs.replace(marker2, marker2 + "\n" + MJS, 1)
n2 = mjs.count('playFor("yeast"), "sill"')
mjs = mjs.replace('playFor("yeast"), "sill"', 'playFor("lichen"), "sill"')
print("mjs replaced yeast sill -> lichen sill:", n2)
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
print("cjs Starter", cjs.count("Starter blooms"), "mjs Starter", mjs.count("Starter blooms"))
print("cjs tests", cjs.count('test("'), "mjs", mjs.count('test("'))
print("cjs yeast sill left", cjs.count('playFor("yeast"), "sill"'), "lichen sill", cjs.count('playFor("lichen"), "sill"'))
print("mjs yeast sill left", mjs.count('playFor("yeast"), "sill"'), "lichen sill", mjs.count('playFor("lichen"), "sill"'))
