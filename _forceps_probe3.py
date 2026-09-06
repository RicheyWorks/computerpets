from pathlib import Path
t = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for s in ["cerciPoint,", "CERCI,", "raisePoint,", "clawPoint,", "prayPoint,", "prayOnPath,", "prayPath,", "raisePath,", "vinegaroon", "scorpion"]:
    print(s, t.count(s))
i = t.find("kind === CLAW")
print("claw gate", repr(t[i:i+90]))
print([ln.strip() for ln in t.splitlines() if "earwig" in ln or "vinegaroon" in ln or "scorpion" in ln][:12])
# check exports block
j = t.rfind("cerciOffPath")
print("export area", t[j:j+120])
