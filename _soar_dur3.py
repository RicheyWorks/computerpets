from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("const DUR")
start = js.find("{", i)
depth=0
for j,c in enumerate(js[start:], start):
  if c=="{": depth+=1
  elif c=="}":
    depth-=1
    if depth==0:
      end=j+1
      break
vals={m.group(1): float(m.group(2)) for m in re.finditer(r"(\w+):\s*([0-9.]+)", js[start:end])}
used=set(vals.values())
# remove our current spots* so we can reassign
for k in list(vals):
  if k.startswith("spots"):
    used.discard(vals[k])
candidates=[]
x=3.05
while len(candidates)<8 and x<3.40:
  x=round(x+0.01,2)
  if not any(abs(x-u)<1e-9 for u in used):
    candidates.append(x)
print("spotsOn candidates", candidates)
candidates=[]
x=2.70
while len(candidates)<8 and x<3.0:
  x=round(x+0.01,2)
  if not any(abs(x-u)<1e-9 for u in used):
    candidates.append(x)
print("spots candidates", candidates)
candidates=[]
x=5.70
while len(candidates)<8 and x<6.1:
  x=round(x+0.01,2)
  if not any(abs(x-u)<1e-9 for u in used):
    candidates.append(x)
print("spotsHold candidates", candidates)
candidates=[]
x=2.90
while len(candidates)<8 and x<3.2:
  x=round(x+0.01,2)
  if not any(abs(x-u)<1e-9 for u in used):
    candidates.append(x)
print("spotsOff candidates", candidates)
