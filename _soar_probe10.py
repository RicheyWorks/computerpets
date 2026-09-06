from pathlib import Path
mjs=Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
i=mjs.find("other guests do not clone")
print(mjs[i:i+350] if i>=0 else "no clone test")
# all sill playFor
idx=0
while True:
  i=mjs.find('playFor("', idx)
  if i<0: break
  if '"sill"' in mjs[i:i+60]:
    ls=mjs.rfind("\n",0,i)+1; le=mjs.find("\n",i)
    print("sill:", mjs[ls:le][:120])
  idx=i+10
