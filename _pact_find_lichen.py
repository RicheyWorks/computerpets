from pathlib import Path
import re

# Find lichen in pet definitions / order
hits = []
for p in Path(".").rglob("*"):
    if not p.is_file():
        continue
    if p.suffix not in {".json",".js",".ts",".cjs",".mjs",".md",".csv"}:
        continue
    if any(x in str(p).replace("\\","/") for x in ["node_modules",".git","__pycache__","_starter","_flame","_puff","_cap","_banner","_click","_rob","_lace","_jewel","_vault","_snout","_forceps"]):
        continue
    try:
        if p.stat().st_size > 3_000_000:
            continue
        t = p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue
    if re.search(r"\blichen\b", t) and ("pact" in t.lower() or "yeast" in t or "slug" in t):
        # show context lines
        lines = t.splitlines()
        for i,l in enumerate(lines):
            if "lichen" in l.lower():
                hits.append((str(p), i+1, l[:180]))
                if len(hits) > 60:
                    break
    if len(hits) > 60:
        break
for h in hits:
    print(f"{h[0]}:{h[1]}:{h[2]}")
