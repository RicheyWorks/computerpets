# -*- coding: utf-8 -*-
from pathlib import Path
p = Path("desktop/renderer/window-play.test.cjs")
t = p.read_text(encoding="utf-8")
old = "const target = P.pickTarget([WIN], 80, \"chicken_of_woods\", WORK, P.SPRITE);" + "\n" + "  let play = P.beginPlay(target, target.approachX);"
new = "const target = P.pickTarget([WIN], 80, \"yeast\", WORK, P.SPRITE);" + "\n" + "  let play = P.beginPlay(target, target.approachX);"
n = t.count(old)
print("cjs matches", n)
if n != 1:
    raise SystemExit("expected 1 got %s" % n)
t = t.replace(old, new, 1)
uniq = (
    "    assert.notEqual(play.phase, \"dust\");" + "\n"
    + "    assert.notEqual(play.phase, \"dust-fluff\");" + "\n"
    + "  }" + "\n"
    + "  assert.ok(seen.has(\"sill-hop\"));"
)
uniq_new = (
    "    assert.notEqual(play.phase, \"dust\");" + "\n"
    + "    assert.notEqual(play.phase, \"dust-fluff\");" + "\n"
    + "    assert.notEqual(play.phase, \"drip\");" + "\n"
    + "    assert.notEqual(play.phase, \"cloud\");" + "\n"
    + "  }" + "\n"
    + "  assert.ok(seen.has(\"sill-hop\"));"
)
print("uniq", t.count(uniq))
if t.count(uniq) == 1:
    t = t.replace(uniq, uniq_new, 1)
    print("added drip/cloud exclusions")
p.write_text(t, encoding="utf-8", newline="\n")
print("done")
