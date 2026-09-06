from pathlib import Path
lines = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8").splitlines()
ranges = [(1,3),(183,190),(890,925),(1115,1125),(1488,1505),(4860,4895),(5748,5768),(18990,19075),(30190,30285),(31520,31555)]
out=[]
for a,b in ranges:
  out.append(f"\n===== {a}-{b} =====")
  for i in range(a-1, min(b, len(lines))):
    out.append(f"{i+1}:{lines[i]}")
Path("_mane_slices.txt").write_text("\n".join(out), encoding="utf-8")
print("wrote", len(out), "lines")
# also dump test snippets
for p in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs","web/src/lib/pets/window-play.ts","desktop/renderer/leftover-house.test.cjs"]:
  t=Path(p).read_text(encoding="utf-8")
  hits=[(i+1,l) for i,l in enumerate(t.splitlines()) if "lions_mane" in l or "TEETH" in l or 'teeth' in l and ("playFor" in l or "Mane" in l or "const TEETH" in l or "teeth:" in l[:20])]
  print(p, "hits", len(hits))
  for i,l in hits[:15]:
    print(f"  {i}:{l[:140]}")
