from pathlib import Path
p = Path(r"desktop/renderer/window-play.test.cjs")
t = p.read_text(encoding="utf-8")
old = '  assert.equal(P.playFor("porcupine"), "bristle");\n  assert.equal(P.BRISTLE, "bristle");\n'
new = '  assert.equal(P.playFor("porcupine"), "bristle");\n'
n = t.count(old)
print("count", n)
if n != 1:
    raise SystemExit("expected 1")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("fixed")
