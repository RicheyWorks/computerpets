from pathlib import Path
import re
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
print("ROADMAP last", [ln for ln in rm.splitlines() if "Last Updated" in ln][:3])
print("--- shard lines ---")
for ln in rm.splitlines():
    if "Shard (`silica`" in ln or "Next leftover is Dusk" in ln or "next leftover is Dusk" in ln:
        print(ln[:240])
print("--- arch last ---")
for ln in arch.splitlines():
    if "Last Updated" in ln:
        print(ln[:400])
print("--- readme shard ---")
for p in ["README.md", "desktop/README.md"]:
    t = Path(p).read_text(encoding="utf-8")
    print(p, "Shard facets" in t, "Dusk rims" in t, "next leftover is Dusk" in t)