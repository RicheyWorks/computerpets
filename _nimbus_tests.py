# -*- coding: utf-8 -*-
from pathlib import Path

CJS = Path("_nimbus_cjs_block.txt").read_text(encoding="utf-8").lstrip("\ufeff")
MJS = Path("_nimbus_mjs_block.txt").read_text(encoding="utf-8").lstrip("\ufeff")
if not CJS.startswith("\n"):
    CJS = "\n" + CJS
if not CJS.endswith("\n"):
    CJS += "\n"
if not MJS.startswith("\n"):
    MJS = "\n" + MJS
if not MJS.endswith("\n"):
    MJS += "\n"

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")
if "Nimbus floats a mid pane" in cjs:
    print("cjs already has Nimbus test")
else:
    marker = (
        'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved blotter air");\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "chord-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if cjs.count(marker) != 1:
        raise SystemExit(f"cjs choir abort marker {cjs.count(marker)}")
    cjs = cjs.replace(marker, marker + CJS, 1)

n = cjs.count('playFor("nimbus"), "sill"')
cjs = cjs.replace('playFor("nimbus"), "sill"', 'playFor("silica"), "sill"')
print("cjs replaced nimbus sill -> silica sill:", n)
# also pickTarget with nimbus for generic sill demo near top?
# leave functional pickTarget([WIN], 80, "nimbus"...) that tests sill path - those should become silica
# count remaining nimbus sill references after replace
print("remaining nimbus sill", cjs.count('playFor("nimbus"), "sill"'))
print("silica sill", cjs.count('playFor("silica"), "sill"'))
cjs_path.write_text(cjs, encoding="utf-8", newline="\n")

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
if "Nimbus floats a mid pane" not in mjs:
    marker2 = (
        'assert.ok(Math.abs(play.target.holdX - beforeX) > 40, "refit follows the moved blotter air");\n'
        '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
        '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "chord-off");\n'
        '  assert.equal(play.abort, true);\n'
        '});'
    )
    if mjs.count(marker2) != 1:
        marker2b = (
            '  assert.ok(Math.abs(play.target.holdX - beforeX) > 40);\n'
            '  play = P.stepPlay(play, 0.05, { x: play.x, lift: play.lift }, [moved], WORK, P.SPRITE, { asleep: true, cmd: "sleep" });\n'
            '  assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "chord-off");\n'
            '  assert.equal(play.abort, true);\n'
            '});'
        )
        if mjs.count(marker2b) == 1:
            marker2 = marker2b
        else:
            raise SystemExit(f"mjs choir abort marker {mjs.count(marker2)} / alt {mjs.count(marker2b)}")
    mjs = mjs.replace(marker2, marker2 + MJS, 1)
n2 = mjs.count('playFor("nimbus"), "sill"')
mjs = mjs.replace('playFor("nimbus"), "sill"', 'playFor("silica"), "sill"')
print("mjs replaced nimbus sill -> silica sill:", n2)
mjs_path.write_text(mjs, encoding="utf-8", newline="\n")
print("cjs Nimbus", cjs.count("Nimbus floats"), "mjs Nimbus", mjs.count("Nimbus floats"))
print("cjs tests", cjs.count('test("'), "mjs", mjs.count('test("'))
