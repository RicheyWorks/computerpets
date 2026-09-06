from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("const DUR")
# find DUR object
start = js.find("{", i)
# naive brace match
depth=0
for j,c in enumerate(js[start:], start):
  if c=="{": depth+=1
  elif c=="}":
    depth-=1
    if depth==0:
      end=j+1
      break
dur = js[start:end]
import re
vals={}
for m in re.finditer(r"(\w+):\s*([0-9.]+)", dur):
  vals[m.group(1)] = float(m.group(2))
# find collisions with our planned
ours = {"spotsOn":3.09,"spots":2.73,"spotsHold":5.81,"spotsOff":2.97}
for k,v in ours.items():
  coll=[n for n,x in vals.items() if abs(x-v)<1e-9 and n!=k]
  print(k,v,"collides",coll)
# suggest free floats near
used=set(vals.values())
def free(base):
  x=base
  while any(abs(x-u)<1e-9 for u in used):
    x=round(x+0.01,2)
  return x
for base in [3.08, 2.72, 5.80, 2.96]:
  print("free near", base, "->", free(base))
print("raysOn", vals.get("raysOn"), "mantleOn", vals.get("mantleOn"))
