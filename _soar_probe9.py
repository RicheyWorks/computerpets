from pathlib import Path
for p in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs", "desktop/renderer/leftover-house.test.cjs"]:
  t = Path(p).read_text(encoding="utf-8")
  print("====", p, "eagle_ray count", t.count("eagle_ray"), "====")
  idx=0
  while True:
    i=t.find("eagle_ray", idx)
    if i<0: break
    ls=t.rfind("\n",0,i)+1; le=t.find("\n",i)
    print(" ", t[ls:min(le,ls+140)])
    idx=i+9
