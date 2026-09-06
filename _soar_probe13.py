from pathlib import Path
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# side type
for s in ['mantledish', 'reefledge', 'type Side', 'leave:', 'PlayLeave', 'mantled', 'rayed', 'spotted']:
  i=ts.find(s)
  print(s, i)
  if i>=0:
    ls=ts.rfind("\n",0,i)+1; le=ts.find("\n",i)
    # for type defs get more
    if "type" in s or s in ("mantledish","reefledge"):
      print(ts[max(0,i-100):i+200].replace("\n"," | "))
    else:
      print(" ", ts[ls:le][:160])

# find Side union
i=ts.find("side:")
# export type for side
import re
m=re.search(r'export type \w*Side\w* = [^;]+;', ts)
print("Side type:", m.group(0)[:500] if m else "none")
m=re.search(r'side: "[^"]+" \|', ts)
# PlayTarget side field
m=re.search(r'side:\s*([^;\n]+)', ts)
print("side field samples:")
for m in re.finditer(r'^\s*side:\s*.+$', ts, re.M):
  if "type" in m.group(0) or "|" in m.group(0) or "string" in m.group(0):
    print(m.group(0)[:300])
    break
# Look at PlayTarget interface
i=ts.find("export type PlayTarget")
if i<0: i=ts.find("type PlayTarget")
print(ts[i:i+500] if i>=0 else "no PlayTarget")
