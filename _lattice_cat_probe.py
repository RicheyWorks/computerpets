from pathlib import Path
# leftover-house test name start
t = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
lines = t.splitlines()
print("TEST NAME start:", lines[18][:500])
print("...")
print("TEST NAME lattice bit:", "next leftover is Lattice" in lines[18])
# find catalog morel/chanterelle
for p in ["web/src/lib/pets/catalog.ts","web/src/data/pets.ts","web/src/lib/pets/pets.ts"]:
    pass
# glob catalog
import os
cands = []
for root, dirs, files in os.walk("."):
    if "node_modules" in root or ".git" in root: continue
    for f in files:
        if "catalog" in f.lower() or f in ("pets.ts","pets.js","guests.ts"):
            cands.append(os.path.join(root,f))
print("catalog files", cands[:20])
