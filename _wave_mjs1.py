from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\web\scripts\window-play.test.mjs")
text = p.read_text(encoding="utf-8")
old = '  assert.equal(P.playFor("fiddler_crab"), "sill");\n  assert.equal(Overlay.playFor("fiddler_crab"), "sill");\n'
new = '  assert.equal(P.playFor("fiddler_crab"), "signal");\n  assert.equal(Overlay.playFor("fiddler_crab"), "signal");\n'
n = text.count(old)
print("count", n)
if n != 1:
    raise SystemExit("pin not unique")
p.write_text(text.replace(old, new), encoding="utf-8", newline="\n")
print("ok")
