from pathlib import Path

def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s: expected 1, got %d" % (label, n))
    return text.replace(old, new, 1)

old = '  assert.equal(P.playFor("squirrel"), "bury");\n  assert.equal(P.BURY, "bury");\n'
new = '  assert.equal(P.playFor("squirrel"), "bury");\n'
for rel in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs"]:
    p = Path(rel)
    t = p.read_text(encoding="utf-8")
    if old not in t:
        # mjs may differ
        print(rel, "pattern missing", t.count("P.BURY"))
        continue
    t = once(t, old, new, rel)
    p.write_text(t, encoding="utf-8", newline="\n")
    print(rel, "fixed")
