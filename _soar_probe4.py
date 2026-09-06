from pathlib import Path
import re

# README Gate mention
for p in ["README.md", "desktop/README.md"]:
  t = Path(p).read_text(encoding="utf-8")
  for m in re.finditer(r".{0,40}Gate.{0,120}", t):
    print(p, ":", m.group(0).replace("\n"," "))
  for m in re.finditer(r".{0,40}Next leftover.{0,80}", t):
    print(p, "NEXT:", m.group(0).replace("\n"," "))

# house test first 30 lines of Gate test
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
i = house.find('test("Gate leftover')
print("====HOUSE====")
print(house[i:i+2500])

# roadmap Gate line
road = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
i = road.find("Gate (`giant_clam`")
print("====ROAD GATE====")
print(road[i:i+900])
print("====ROAD END====")
i = road.find("**Last Updated:**")
print(road[i:i+350])

# barrel / kite
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["barrelPoint", "kitePoint", 'side: "barrel"', "const BARREL", "playFor(\"kite\")", 'key === "kite"']:
  print(name, js.find(name))

# TS typeof MANTLE
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find("typeof MANTLE")
print("typeof MANTLE", i)
if i>0:
  print(ts[i-80:i+80])
print("export const MANTLE", ts.find("export const MANTLE"))
print("Next leftover is Soar", ts.find("Next leftover is Soar"))
