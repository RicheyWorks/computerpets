from pathlib import Path

# Fix accidental notEqual photovore sill back where we meant lichen plaque guest
for path in [
    Path("desktop/renderer/window-play.test.cjs"),
    Path("web/scripts/window-play.test.mjs"),
    Path("desktop/renderer/leftover-house.test.cjs"),
]:
    t = path.read_text(encoding="utf-8")
    # restore notEqual lichen sill that became notEqual photovore sill inside Pact blocks
    # Only inside Pact tests: assert.notEqual(P.playFor("photovore"), "sill") should be lichen
    # But equal(P.playFor("photovore"), "sill") should stay
    before = t.count('assert.notEqual(P.playFor("photovore"), "sill")')
    before2 = t.count('assert.notEqual(WP.playFor("photovore"), "sill")')
    t2 = t.replace('assert.notEqual(P.playFor("photovore"), "sill")', 'assert.notEqual(P.playFor("lichen"), "sill")')
    t2 = t2.replace('assert.notEqual(WP.playFor("photovore"), "sill")', 'assert.notEqual(WP.playFor("lichen"), "sill")')
    # other guests test: lichen -> photovore for sill walker
    t2 = t2.replace(
        'const target = P.pickTarget([WIN], 80, "lichen", WORK, P.SPRITE);',
        'const target = P.pickTarget([WIN], 80, "photovore", WORK, P.SPRITE);',
        1,  # only first = the cling/sill test near top; Pact uses lichen intentionally later
    )
    path.write_text(t2, encoding="utf-8", newline="\n")
    print(path, "notEqual fixes", before + before2, "photovore sill equal", t2.count('playFor("photovore"), "sill"'), "lichen plaque", t2.count('playFor("lichen"), "plaque"'))

# Also check mjs for other guests lichen pickTarget
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs other guests uses", "photovore" if 'pickTarget([WIN], 80, "photovore"' in cjs[cjs.find("other guests"):cjs.find("other guests")+400] else "??")
# any remaining notEqual photovore sill?
print("remaining notEqual photovore sill", cjs.count('notEqual(P.playFor("photovore"), "sill")'), mjs.count('notEqual(P.playFor("photovore"), "sill")'))
print("equal photovore sill", cjs.count('equal(P.playFor("photovore"), "sill")'), mjs.count('equal(P.playFor("photovore"), "sill")'))
print("notEqual lichen sill", cjs.count('notEqual(P.playFor("lichen"), "sill")'), mjs.count('notEqual(P.playFor("lichen"), "sill")'))
# mjs other guests?
idx = mjs.find("other guests do not clone")
print("mjs other guests", idx)
if idx >= 0:
    print(mjs[idx:idx+250])
