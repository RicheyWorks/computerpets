from pathlib import Path
p = Path(r"C:\Users\730ri\projects\ComputerPets\desktop\renderer\window-play.test.cjs")
raw = p.read_bytes()
nl = "\r\n" if b"\r\n" in raw else "\n"
text = raw.decode("utf-8").replace("\r\n", "\n")
old = '  const target = P.pickTarget([WIN], 80, "honeybee", WORK, P.SPRITE);\n  let play = P.beginPlay(target, target.approachX);\n  const seen = new Set();\n  for (let i = 0; i < 400 && play.phase !== "done"; i++) {'
new = '  const target = P.pickTarget([WIN], 80, "monarch", WORK, P.SPRITE);\n  let play = P.beginPlay(target, target.approachX);\n  const seen = new Set();\n  for (let i = 0; i < 400 && play.phase !== "done"; i++) {'
if old not in text:
    raise SystemExit("sill-hop guest marker missing")
text = text.replace(old, new, 1)
p.write_bytes(text.replace("\n", nl).encode("utf-8"))
print("generic sill guest is now monarch")
