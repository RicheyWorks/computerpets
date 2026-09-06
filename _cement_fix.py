from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.test.cjs")
t = p.read_text(encoding="utf-8")
old = '''  assert.equal(P.playFor("beaver"), "gnaw");
  assert.equal(P.GNAW, "gnaw");
  assert.equal(P.playFor("velvet_worm"), "velvet");
  assert.equal(P.VELVET, "velvet");
'''
new = '''  assert.equal(P.playFor("beaver"), "gnaw");
  assert.equal(P.playFor("velvet_worm"), "velvet");
  assert.equal(P.VELVET, "velvet");
'''
n = t.count(old)
if n != 1:
    raise SystemExit(f"expected 1, found {n}")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("fixed GNAW export pin")