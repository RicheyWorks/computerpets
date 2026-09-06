from pathlib import Path
import re
for p in ["README.md", "desktop/README.md"]:
    t = Path(p).read_text(encoding="utf-8")
    m = re.search(r".{0,40}Flame drips.{0,280}", t)
    print(p, "=>", m.group(0) if m else "MISSING")
# ROADMAP fungi section around Flame/Starter/Pact
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,line in enumerate(rm.splitlines()):
    if any(k in line for k in ["Flame (", "Starter", "Pact", "yeast", "lichen", "fungi den", "cellar"]):
        if line.strip().startswith("-") or "Last Updated" in line or "fungi" in line.lower() or "cellar" in line.lower():
            print(f"{i}: {line[:180]}")
# house markers for sill pin
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("yeast sill count", house.count('playFor("yeast"), "sill"'))
print("chicken drip", house.count('playFor("chicken_of_woods"), "drip"'))
# lichen in catalog
cat = Path("desktop/renderer/roster.json").read_text(encoding="utf-8")
print("yeast in roster", "yeast" in cat)
print("lichen in roster", "lichen" in cat)
# confirm catalog 220
import json
roster = json.loads(cat)
print("roster len", len(roster) if isinstance(roster, list) else type(roster))
