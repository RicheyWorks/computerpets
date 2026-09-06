mjs=open("web/scripts/window-play.test.mjs",encoding="utf-8").read().splitlines()
# print Blade demo test fully
start=None
for i,l in enumerate(mjs):
  if 'demo window plate walks Blade leaf' in l:
    start=i; break
for j in range(start, start+40):
  print(f"{j+1}:{mjs[j]}")
  if j>start and mjs[j].startswith("test("):
    break
  if j>start and mjs[j]=="});" and j>start+5:
    print(f"{j+1}:{mjs[j]}")
    break
