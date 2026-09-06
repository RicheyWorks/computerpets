from pathlib import Path
g=Path("_gate_apply.py").read_text(encoding="utf-8")
i=g.find("for readme in")
print(g[i:i+1200])
print("====MAIN====")
i=g.find("def main")
print(g[i:])

# house body next leftover
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for s in ["next leftover is Soar", "Next leftover is Soar", "next leftover is Gate", "eagle_ray", "Do not start"]:
  print(s, house.lower().find(s.lower()) if False else house.find(s))
# search case insensitive
import re
for m in re.finditer(r"(?i).{0,30}next leftover.{0,40}", house):
  print("HIT:", m.group(0)[:100])

# generic sill test title in cjs
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i=cjs.find('pickTarget([WIN], 80, "eagle_ray"')
print("====SILL TEST====")
print(cjs[i-300:i+200])
