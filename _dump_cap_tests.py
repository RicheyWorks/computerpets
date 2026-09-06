from pathlib import Path
# Cap leftover test as template (shorter apron family)
for p in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs"]:
  t=Path(p).read_text(encoding="utf-8").splitlines()
  start=None
  for i,l in enumerate(t):
    if "Cap warts a window apron" in l:
      start=i; break
  print("====", p, "start", start+1 if start is not None else None)
  if start is not None:
    for j in range(start, min(start+120, len(t))):
      print(f"{j+1}:{t[j]}")
