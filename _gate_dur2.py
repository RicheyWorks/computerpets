from pathlib import Path
vals = {}
for rel in ["desktop/renderer/window-play.js"]:
    t = Path(rel).read_text(encoding="utf-8")
    # extract DUR block roughly
    i = t.find("const DUR = {")
    j = t.find("};", i)
    block = t[i:j]
    for line in block.splitlines():
        line=line.strip().rstrip(",")
        if ":" in line and not line.startswith("//"):
            k,v = line.split(":",1)
            vals[k.strip()] = v.strip()
# find collisions for our proposed values
for cand in ["3.08","3.12","3.14","2.91","2.79","5.87","3.02","3.06"]:
    hits = [k for k,v in vals.items() if v==cand]
    print(cand, hits or "free")
