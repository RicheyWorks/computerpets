from pathlib import Path
import re
# dens
for p in Path("web/src/lib/pets").glob("*.ts"):
    t = p.read_text(encoding="utf-8")
    if "robber_fly" in t or "fly_agaric" in t or "oyster" in t:
        keys = re.findall(r'"([a-z_]+)"', t)
        print("===", p.name, "===")
        print([k for k in keys if "_" in k or k in ("oyster","yeast","lichen")][:30])
# ROADMAP oyster / Fruit / Warn / fungi
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for pat in ["Fruit", "oyster", "Warn", "fly_agaric", "fungi", "shelf ten", "cap ten", "next leftover is"]:
    if pat.lower() in rm.lower():
        print("ROADMAP has", pat)
# how Brood named next
lh = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
# extract the test title start
title = lh.split("test(\"")[1].split("\", ()")[0]
# find next leftover phrase
m = re.search(r"next leftover is ([^;]+);", title)
print("next leftover phrase:", m.group(0) if m else None)
# meadow close wording for hive
m2 = re.search(r"hive ten closed;[^;]*;", title)
print("hive phrase:", m2.group(0) if m2 else None)
