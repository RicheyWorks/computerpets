from pathlib import Path
lines = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(lines):
  if "TEETH," in l and i>31000:
    for j in range(i-30, i+5):
      print(f"{j+1}:{lines[j]}")
    break
print("--- docs ---")
for p in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
  text=Path(p).read_text(encoding="utf-8")
  for i,l in enumerate(text.splitlines()):
    low=l.lower()
    if "puff" in low or "lions_mane" in low or ("mane" in low and "teeth" in low) or "generic-sill" in low or "generic sill" in low:
      print(f"{p}:{i+1}:{l[:200]}")
print("--- leftover house mane asserts end ---")
t=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(t):
  if "lions_mane" in l or "puffball" in l or "chicken_of_woods" in l or "next leftover is Puff" in l:
    print(f"{i+1}:{l[:200]}")
print("--- ts WindowPlayKind TEETH ---")
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
idx=ts.find("typeof TEETH")
print(ts[idx-80:idx+80] if idx>=0 else "not found")
idx2=ts.find("export const TEETH")
print("TEETH export", ts[idx2:idx2+40])
# Mane second test
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").splitlines()
for i,l in enumerate(cjs):
  if "refits Mane" in l or "Mane" in l and "abort" in l:
    for j in range(i, min(i+80,len(cjs))):
      print(f"{j+1}:{cjs[j]}")
      if j>i+5 and cjs[j].startswith("test("):
        break
    break
