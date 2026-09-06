from pathlib import Path
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
keys = ("silica", "Silica", "nimbus", "Nimbus", "Dusk", "terminator", "next leftover", "Shard", "methane", "far den", "fourth")
for i, l in enumerate(house.splitlines(), 1):
    if any(x in l for x in keys):
        print(f"{i}:{l[:220]}")
