from pathlib import Path
p = Path("desktop/renderer/window-play.test.cjs")
t = p.read_text(encoding="utf-8")
old = '  assert.equal(P.playFor("moss"), "lean");\n  assert.equal(P.LEAN, "lean");\n  assert.equal(P.playFor("salamander"), "cover");'
new = '  assert.equal(P.playFor("moss"), "lean");\n  assert.equal(P.playFor("salamander"), "cover");'
if t.count(old) != 1:
    raise SystemExit(f"count {t.count(old)}")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("removed P.LEAN")
