from pathlib import Path

cjs_path = Path("desktop/renderer/window-play.test.cjs")
cjs = cjs_path.read_text(encoding="utf-8")

# Fix wrongly replaced notEqual choir sill inside Gleam test -> back to photovore
old = '  assert.notEqual(P.playFor("choir"), "sill");\n  assert.equal(P.playFor("lichen"), "plaque");'
new = '  assert.notEqual(P.playFor("photovore"), "sill");\n  assert.equal(P.playFor("lichen"), "plaque");'
n = cjs.count(old)
print("cjs notEqual fix", n)
if n != 1:
    raise SystemExit("cjs notEqual marker")
cjs = cjs.replace(old, new, 1)

# Fix other-guests test to use choir (generic sill pin)
old2 = 'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "photovore", WORK, P.SPRITE);'
new2 = 'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "choir", WORK, P.SPRITE);'
n2 = cjs.count(old2)
print("cjs other-guests", n2)
if n2 != 1:
    # try already choir?
    print("photovore other", cjs.count('pickTarget([WIN], 80, "photovore"'))
    print("choir other", cjs.count('pickTarget([WIN], 80, "choir"'))
    raise SystemExit("other guests marker")
cjs = cjs.replace(old2, new2, 1)

# Any remaining pickTarget photovore used as sill exemplar?
import re
for m in re.finditer(r'pickTarget\([^)]*"photovore"[^)]*\)', cjs):
    snip = cjs[max(0,m.start()-80):m.end()+40]
    if "Gleam" in cjs[max(0,m.start()-500):m.start()] or "thirst" in snip:
        continue
    # show non-gleam photovore picks
    line = cjs[:m.start()].count("\n")+1
    if "thirst" not in cjs[m.start():m.start()+200]:
        print(f"photovore pick @{line}: {snip[:120]}")

cjs_path.write_text(cjs, encoding="utf-8", newline="\n")

mjs_path = Path("web/scripts/window-play.test.mjs")
mjs = mjs_path.read_text(encoding="utf-8")
oldm = '  assert.notEqual(P.playFor("choir"), "sill");\n  assert.equal(P.playFor("lichen"), "plaque");'
# mjs may differ
if oldm in mjs:
    mjs = mjs.replace(oldm, '  assert.notEqual(P.playFor("photovore"), "sill");\n  assert.equal(P.playFor("lichen"), "plaque");', 1)
    print("mjs notEqual fixed")
else:
    # find gleam notEqual choir
    print("mjs choir notequal", mjs.count('notEqual(P.playFor("choir"), "sill")'))
    print("mjs photovore notequal sill", mjs.count('notEqual(P.playFor("photovore"), "sill")'))
    # show gleam section
    i = mjs.find("Gleam thirsts")
    print(repr(mjs[i:i+800]))

# other guests in mjs?
if 'pickTarget([WIN], 80, "photovore"' in mjs:
    print("mjs photovore picks", mjs.count('pickTarget([WIN], 80, "photovore"'))
# typically mjs may have overlay lockstep other-guests
for pat in ['"photovore", WORK', "photovore"]:
    pass
i = mjs.find("other guests do not clone")
print("mjs other guests", i)
if i>=0:
    print(repr(mjs[i:i+250]))
    mjs2 = mjs[i:i+250].replace('"photovore"', '"choir"', 1)
    mjs = mjs[:i] + mjs2 + mjs[i+250:]
    print("mjs other guests fixed")

mjs_path.write_text(mjs, encoding="utf-8", newline="\n")

# house leftover - check wrong notequal
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house notEqual choir sill", house.count('notEqual(WP.playFor("choir"), "sill")'))
print("house equal choir sill", house.count('playFor("choir"), "sill"'))
print("house photovore thirst", house.count('playFor("photovore"), "thirst"'))
