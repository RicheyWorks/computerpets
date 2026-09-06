from pathlib import Path
t = Path("web/src/lib/pets/catalog.ts").read_text(encoding="utf-8")
i = t.find('key: "morel"')
print(t[i-80:i+400])
print("\n--- slugs ---")
# search slug
for n in ["lattice", "horn", "slug"]:
    print(n, t.find(n))
# maybe slug is elsewhere
from pathlib import Path
import os
found = []
for p in ["web/src/lib/pets","desktop/renderer"]:
    for f in Path(p).glob("*"):
        if f.is_file() and f.suffix in (".ts",".js",".cjs"):
            txt = f.read_text(encoding="utf-8", errors="ignore")
            if "lattice" in txt.lower() or '"morel"' in txt:
                if "lattice" in txt.lower():
                    found.append(str(f)+" lattice")
print("lattice files", found[:30])
