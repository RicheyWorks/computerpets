from pathlib import Path
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
# first test title
print(house.splitlines()[6][:300])
print("---")
# find playFor cyst and umbral in house
for i,l in enumerate(house.splitlines(),1):
    if "umbral" in l or ("cyst" in l and "playFor" in l) or "next leftover" in l or "Hush leftover" in l:
        print(f"{i}:{l[:220]}")

print("\n==== README Hush ====")
for f in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
    t=Path(f).read_text(encoding="utf-8")
    for i,l in enumerate(t.splitlines(),1):
        if "Hush" in l or "Arca" in l or ("far den" in l.lower() and ("close" in l.lower() or "[x]" in l or "[ ]" in l)):
            print(f"{f}:{i}:{l[:200]}")
