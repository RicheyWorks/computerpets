from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.test.cjs")
t = p.read_text(encoding="utf-8")
old = 'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "chiton", WORK, P.SPRITE);'
new = 'test("other guests do not clone Rui\'s cling — they walk a sill and hop down", () => {\n  const target = P.pickTarget([WIN], 80, "periwinkle", WORK, P.SPRITE);'
n = t.count(old)
if n != 1:
    raise SystemExit(f"expected 1, found {n}")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("moved generic sill guest to periwinkle")
