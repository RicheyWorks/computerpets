from pathlib import Path
import json, re
# find acorn weevil / snout / earwig keys in catalog-ish files
roots = ["desktop", "web/src", "docs"]
for root in roots:
  for p in Path(root).rglob("*"):
    if p.suffix.lower() not in {".js",".ts",".cjs",".mjs",".json",".md"}: continue
    if p.name.startswith("_"): continue
    try:
      t = p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
      continue
    if "earwig" in t or "acorn_weevil" in t or "snout" in t.lower() and "weevil" in t.lower():
      hits = []
      for i,line in enumerate(t.splitlines(),1):
        if "earwig" in line or "acorn_weevil" in line or ("snout" in line.lower() and "weevil" in line.lower()) or '"snout"' in line:
          hits.append(f"{i}:{line.strip()[:140]}")
          if len(hits)>=3: break
      if hits:
        print(p.as_posix())
        for h in hits: print(" ", h)
