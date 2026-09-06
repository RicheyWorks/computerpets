from pathlib import Path
import re
cat = Path("web/src/lib/pets/catalog.ts").read_text(encoding="utf-8")
keys = re.findall(r'key: "([^"]+)"', cat)
# show around robber_fly and meadow guests
for i,k in enumerate(keys):
    if k in ("honeybee","monarch","luna","firefly","darner","stick","carpenter_ant","ladybird","mantis","cicada","field_cricket","katydid","grasshopper","swallowtail","jewelwing","lacewing","earwig","acorn_weevil","click_beetle","robber_fly","oyster","fly_agaric","brain_coral"):
        print(i, k, keys[i-1] if i else None, "->", keys[i+1] if i+1 < len(keys) else None)
print("--- meadow block ---")
# find contiguous insect/meadow block
for i,k in enumerate(keys):
    if "cricket" in k or "robber" in k or k in ("katydid","grasshopper","swallowtail","jewelwing","lacewing","earwig","acorn_weevil","click_beetle"):
        print(i,k)
