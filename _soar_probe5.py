from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("function barrelPoint")
print("====BARREL====")
print(js[i:i+550])
# kite playFor
for s in ['key === "manta"', 'key === "eagle"', 'BARREL', 'const BARREL', 'return BARREL']:
  idx=0
  while True:
    i=js.find(s, idx)
    if i<0: break
    ls=js.rfind("\n",0,i)+1; le=js.find("\n",i)
    print(f"{s}: {js[ls:le][:160]}")
    idx=i+len(s)
    if idx>i+50000: break

# README snippet around Gate
for p in ["README.md","desktop/README.md"]:
  t=Path(p).read_text(encoding="utf-8")
  i=t.find("Gate mantles")
  print("====",p,"====")
  print(t[i-200:i+350])

# house Next leftover is Soar
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
i=house.find("Next leftover is Soar")
print("====HOUSE NEXT====", i)
print(house[i-100:i+200] if i>=0 else "missing")
# end of house gate asserts
i=house.find('playFor("eagle_ray"), "sill"')
print(house[i-400:i+80])

# gate_apply docs rest
g=Path("_gate_apply.py").read_text(encoding="utf-8")
i=g.find("def patch_docs")
print("====GATE DOCS====")
print(g[i:i+2500])
