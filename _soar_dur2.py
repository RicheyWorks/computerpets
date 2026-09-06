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
for v in [3.21, 2.89, 5.81, 2.99, 3.22, 2.74, 5.84, 3.01]:
  coll=[n for n,x in vals.items() if abs(x-v)<1e-9]
  print(v, coll or "FREE")
