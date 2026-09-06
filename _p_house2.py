from pathlib import Path
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print(house.splitlines()[18][:220])
print("---")
for i,l in enumerate(house.splitlines(),1):
    if any(x in l for x in ["next leftover", "silica", "terminator", "FACET", "Shard leftover", "Nimbus leftover floats"]):
        if "assert" in l or "test(" in l or "next leftover" in l:
            print(f"{i}:{l[:200]}")
