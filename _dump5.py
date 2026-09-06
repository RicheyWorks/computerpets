from pathlib import Path
lines = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8").splitlines()
print("===== beginPlay TEETH =====")
for j in range(19680, 19730):
  print(f"{j+1}:{lines[j]}")
print("===== stepPlay TEETH =====")
for j in range(30195, 30285):
  print(f"{j+1}:{lines[j]}")
print("===== Cap beginPlay WARTS =====")
for i,l in enumerate(lines):
  if 'target.kind === WARTS' in l and i>19000 and i<20000:
    for j in range(i-15, i+10):
      print(f"{j+1}:{lines[j]}")
    break
print("===== Mane test =====")
t=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(t):
  if "Mane teeths a sash gap" in l:
    for j in range(i, min(i+180,len(t))):
      print(f"{j+1}:{t[j]}")
      if j>i+10 and t[j].startswith("test("):
        break
    break
print("===== puffball sill =====")
for i,l in enumerate(t):
  if "puffball" in l:
    print(f"{i+1}:{l}")
# docs pins
for p in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
  text=Path(p).read_text(encoding="utf-8")
  for i,l in enumerate(text.splitlines()):
    if "Puff" in l or "puffball" in l or "lions_mane" in l or "Mane" in l and "teeth" in l.lower():
      if i>0:
        print(f"{p}:{i+1}:{l[:160]}")
