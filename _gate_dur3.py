from pathlib import Path
t = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = t.find("const DUR = {")
j = t.find("};", i)
block = t[i:j]
used = set()
for line in block.splitlines():
    line=line.strip().rstrip(",")
    if ":" in line and not line.startswith("//"):
        used.add(line.split(":",1)[1].strip())
free=[]
for n in range(270, 620):
    s = f"{n/100:.2f}"
    if s not in used:
        free.append(s)
print("sample free", free[:40])
print("check", {k: (k in used) for k in ["3.16","3.17","2.83","2.86","5.93","5.94","3.01","3.03"]})
