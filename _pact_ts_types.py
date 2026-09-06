from pathlib import Path
import re
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# find Side type and Leave type
for name in ["PlaySide", "side:", "Leave", "leave:", "WindowPlayPhase", "yeastfilm", "bloomed", "warmwood", "sporedish"]:
    pass
for m in re.finditer(r'export type \w+Side[^\n]*\n(?:.*\n){0,30}', ts):
    s = m.group(0)
    if "yeast" in s or "warm" in s or "spore" in s or "side" in s.lower():
        print("SIDE BLOCK:\n", s[:800])
        break
# search yeastfilm context
i = ts.find("yeastfilm")
print("yeastfilm ctx", repr(ts[i-200:i+80]))
i = ts.find('"bloomed"')
print("bloomed ctx", repr(ts[i-200:i+80]))
# phase type
i = ts.find('"bloom-off"')
print("phase ctx", repr(ts[i-120:i+80]))
# kind type
i = ts.find("typeof BLOOM")
print("kind ctx", repr(ts[i-80:i+80]))
# starter test marker end for cjs insert
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
marker = 'assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "bloom-off");\n  assert.equal(play.abort, true);\n});'
print("cjs markers", cjs.count(marker))
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
marker2 = 'assert.ok(play.phase === "drop" || play.phase === "done" || play.phase === "bloom-off");\n  assert.equal(play.abort, true);\n});'
print("mjs markers", mjs.count(marker2))
print("cjs tests", cjs.count('test("'), "mjs", mjs.count('test("'))
print("house tests", Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8").count('test("'))
# starter roadmap line
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for line in rm.splitlines():
    if "Starter (`yeast`" in line:
        print("STARTER LINE LEN", len(line))
        print(line[:300])
