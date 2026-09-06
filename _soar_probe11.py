from pathlib import Path
# find grouper in repo
hits=[]
for p in Path(".").rglob("*"):
  if p.suffix.lower() not in {".js",".ts",".cjs",".mjs",".json",".md"}: continue
  if p.name.startswith("_"): continue
  try:
    t=p.read_text(encoding="utf-8", errors="ignore")
  except Exception:
    continue
  if "grouper" in t:
    hits.append(str(p))
print("files with grouper:", hits[:30], "count", len(hits))
# roster
for cand in ["desktop/renderer/pets.js","desktop/renderer/roster.js","web/src/lib/pets/roster.ts","web/src/lib/pets/pets.ts","desktop/renderer/catalog.js"]:
  if Path(cand).exists():
    t=Path(cand).read_text(encoding="utf-8")
    i=t.find("grouper")
    print(cand, i)
    if i>=0: print(t[i-80:i+120])
    i=t.find("eagle_ray")
    print("eagle_ray", i)
    if i>=0: print(t[i-80:i+200])
