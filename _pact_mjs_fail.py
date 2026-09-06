from pathlib import Path
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8").splitlines()
for i in range(20670, 20710):
    print(f"{i+1}:{mjs[i]}")
# how does mjs import P?
head = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")[:1500]
print("HEAD\n", head)
# check ts has lichen plaque
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("ts lichen", 'key === "lichen") return PLAQUE' in ts)
print("ts PLAQUE export", "export const PLAQUE" in ts)
