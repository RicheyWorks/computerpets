mjs=open("web/scripts/window-play.test.mjs",encoding="utf-8").read().splitlines()
for i,l in enumerate(mjs):
  if "leafrim" in l or "leafs a sash" in l or "sash horn" in l:
    print("HIT", i+1, l[:200])
  if 'P.playFor("katydid")' in l:
    print("PF", i+1, l.strip()[:160])
# show around last Blade demo test and search for grasshopper sill context
for i,l in enumerate(mjs):
  if 'P.playFor("grasshopper")' in l:
    print("GH", i+1, l.strip()[:160])
