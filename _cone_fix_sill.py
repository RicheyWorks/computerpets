from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.test.cjs")
t = p.read_text(encoding="utf-8")
old = '  const target = P.pickTarget([WIN], 80, "limpet", WORK, P.SPRITE);\n  let play = P.beginPlay(target, target.approachX);\n  const seen = new Set();\n  for (let i = 0; i < 400 && play.phase !== "done"; i++) {'
new = '  const target = P.pickTarget([WIN], 80, "barnacle", WORK, P.SPRITE);\n  let play = P.beginPlay(target, target.approachX);\n  const seen = new Set();\n  for (let i = 0; i < 400 && play.phase !== "done"; i++) {'
n = t.count(old)
if n != 1:
    raise SystemExit(f"expected 1, found {n}")
p.write_text(t.replace(old, new, 1), encoding="utf-8", newline="\n")
print("moved generic sill pin to barnacle")
