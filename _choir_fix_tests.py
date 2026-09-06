from pathlib import Path

def fix(path):
    t = Path(path).read_text(encoding="utf-8-sig")  # strip BOM if present
    # undo mangled notEqual pins
    n1 = t.count('assert.notEqual(P.playFor("nimbus"), "sill");')
    # In Choir test we want notEqual choir/sill; equal nimbus/sill stays.
    # The mangled one is specifically notEqual(nimbus, sill) which is wrong.
    t2 = t.replace('assert.notEqual(P.playFor("nimbus"), "sill");', 'assert.notEqual(P.playFor("choir"), "sill");')
    n2 = t.count('assert.notEqual(WP.playFor("nimbus"), "sill");')
    t2 = t2.replace('assert.notEqual(WP.playFor("nimbus"), "sill");', 'assert.notEqual(WP.playFor("choir"), "sill");')
    # other guests sill walker: choir -> nimbus (both occurrences of pickTarget with choir for sill walk)
    # Only the early generic sill test — change pickTarget choir used for sill-hop expectation
    old = 'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "choir", WORK, P.SPRITE);'
    new = 'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "nimbus", WORK, P.SPRITE);'
    c = t2.count(old)
    if c == 0:
        # try without special dash
        for needle_key in ["choir"]:
            pass
        # broader: first occurrence only of this pick in file before Choir test
        idx = t2.find('they walk a sill and hop down')
        if idx < 0:
            raise SystemExit(f"{path}: other guests test missing")
        chunk_end = t2.find("});", idx) + 3
        chunk = t2[idx:chunk_end]
        if 'pickTarget([WIN], 80, "choir"' not in chunk and 'pickTarget([WIN], 80, "nimbus"' not in chunk:
            raise SystemExit(f"{path}: other guests pick missing\n{chunk[:200]}")
        chunk2 = chunk.replace('pickTarget([WIN], 80, "choir"', 'pickTarget([WIN], 80, "nimbus"', 1)
        t2 = t2[:idx] + chunk2 + t2[chunk_end:]
        print(path, "other guests fixed via chunk")
    else:
        t2 = t2.replace(old, new, 1)
        print(path, "other guests fixed via exact", c)
    # strip any remaining BOM-like at test starts
    t2 = t2.replace("\ufeff", "")
    Path(path).write_text(t2, encoding="utf-8", newline="\n")
    print(path, "fixed notEqual nimbus->choir", n1, n2)
    print("  equal nimbus sill", t2.count('playFor("nimbus"), "sill"'))
    print("  notEqual choir sill", t2.count('notEqual(P.playFor("choir"), "sill")'))

fix("desktop/renderer/window-play.test.cjs")
fix("web/scripts/window-play.test.mjs")

# house file too?
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8-sig")
if 'notEqual(WP.playFor("nimbus"), "sill")' in h:
    h = h.replace('assert.notEqual(WP.playFor("nimbus"), "sill");', 'assert.notEqual(WP.playFor("choir"), "sill");')
    print("house notEqual fixed")
h = h.replace("\ufeff", "")
Path("desktop/renderer/leftover-house.test.cjs").write_text(h, encoding="utf-8", newline="\n")
print("house choir chord", h.count('playFor("choir"), "chord"'), "nimbus sill", h.count('playFor("nimbus"), "sill"'))
