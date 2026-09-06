from pathlib import Path

# Fix mangled notEqual lichen sill -> yeast sill (yeast must NOT be sill)
for p in [
    Path("desktop/renderer/window-play.test.cjs"),
    Path("web/scripts/window-play.test.mjs"),
    Path("desktop/renderer/leftover-house.test.cjs"),
]:
    t = p.read_text(encoding="utf-8")
    n = t.count('assert.notEqual(P.playFor("lichen"), "sill")')
    n2 = t.count('assert.notEqual(WP.playFor("lichen"), "sill")')
    t = t.replace('assert.notEqual(P.playFor("lichen"), "sill")', 'assert.notEqual(P.playFor("yeast"), "sill")')
    t = t.replace('assert.notEqual(WP.playFor("lichen"), "sill")', 'assert.notEqual(WP.playFor("yeast"), "sill")')
    # cling / generic sill walker still using yeast
    t2 = t.replace(
        'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "yeast", WORK, P.SPRITE);',
        'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "lichen", WORK, P.SPRITE);',
    )
    # mjs may use same
    t2 = t2.replace(
        'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "yeast", WORK, P.SPRITE);',
        'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "lichen", WORK, P.SPRITE);',
    )
    # broader: any remaining pickTarget yeast in non-Starter contexts for sill
    p.write_text(t2, encoding="utf-8", newline="\n")
    print(p.name, "fixed notEqual", n+n2, "cling yeast left", t2.count('pickTarget([WIN], 80, "yeast"'))

# Also scan for other sill-walk tests using yeast as the generic guest
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
import re
for label,t in [("cjs",cjs),("mjs",mjs)]:
    for m in re.finditer(r'pickTarget\([^\)]*"yeast"', t):
        # show if inside Starter test (ok) or not
        start = t.rfind('test("', 0, m.start())
        title = t[start:start+80]
        if "Starter" not in title and "yeast-film" not in title and "Starter's" not in title:
            print(label, "NON-STARTER yeast pick:", title.replace("\n"," "))
