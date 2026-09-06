from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.test.cjs")
t = p.read_text(encoding="utf-8")
old = '  assert.equal(P.playFor("squirrel"), "bury");\n  assert.equal(P.BURY, "bury");\n'
new = '  assert.equal(P.playFor("squirrel"), "bury");\n'
n = t.count(old)
print("count", n)
if n != 1:
    raise SystemExit("expected 1")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("fixed bury const")
