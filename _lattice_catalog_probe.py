from pathlib import Path
t = Path("web/src/lib/pets/catalog.ts").read_text(encoding="utf-8")
for needle in ["morel", "lattice", "chanterelle", "horn", "fly_agaric", "oyster"]:
    i = t.find(needle)
    print(f"\n=== {needle} idx={i} ===")
    if i>=0:
        print(t[max(0,i-120):i+220].replace("\n"," | "))
