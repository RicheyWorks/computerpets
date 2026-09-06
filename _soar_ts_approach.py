from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
i = ts.find('goPhase(next, "mantle-on"')
print("mantle-on contexts:")
idx=0
n=0
while n<5:
  i=ts.find('mantle-on', idx)
  if i<0: break
  print(repr(ts[i-120:i+200]))
  print("---")
  idx=i+10
  n+=1
# WRAP after mantle in approach?
i=ts.find('if (target.kind === MANTLE)')
while i>=0 and i < len(ts):
  chunk=ts[i:i+350]
  if "goPhase" in chunk or "mantle-on" in chunk:
    print("CANDIDATE:", repr(chunk[:350]))
    print("====")
  i=ts.find('if (target.kind === MANTLE)', i+1)
  if i>0 and i> 900000: # only early ones? actually approach is late
    pass
