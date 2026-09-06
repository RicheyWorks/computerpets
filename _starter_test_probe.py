from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for s in ["dryOn:", "dryPoint", "dryPath", "const DRY", 'return DRY', "DUR.dry"]:
    print(s, js.find(s), js.count(s))
# flame abort marker currently in cjs
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
marker = (
    'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved warm wood");\n'
    '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
    '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "drip-off");\n'
    '  assert.equal(play.abort, true);\n'
    '});'
)
print("cjs flame abort marker", cjs.count(marker))
print("yeast sill", cjs.count('playFor("yeast"), "sill"'))
print("lichen sill", cjs.count('playFor("lichen"), "sill"'))
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
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
print("mjs flame abort", mjs.count(marker2))
print("mjs yeast sill", mjs.count('playFor("yeast"), "sill"'))
