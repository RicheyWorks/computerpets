import re
from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# all const KIND = "kind" near top of IIFE
consts = re.findall(r'const ([A-Z_]+) = "([a-z_]+)";', js)
# unique kind values
vals = []
seen=set()
for name,val in consts:
    if val not in seen and name not in ("WALK_PX",):
        # filter to play kinds - typically short words assigned as const UPPER = "lower"
        if name.isupper() and name.replace("_","").isalpha() and val.isalpha():
            seen.add(val); vals.append((name,val))
print("const kinds", len(vals))
for n,v in vals:
    print(f"{n}={v}")
print("==== DUR plaque-ish")
# DUR keys related to plaque/bloom
m = re.search(r'const DUR = \{([^}]+(?:\{[^}]*\}[^}]*)*)\}', js)
# simpler
i = js.find("const DUR = {")
j = js.find("};", i)
block = js[i:j+2]
for line in block.splitlines():
    if any(x in line.lower() for x in ("plaque","bloom","drip","shelf","wart","sill","cloud","stain","crust")):
        print(line)
print("==== exports")
# module.exports or return object
for needle in ["plaquePath", "bloomPath", "dripPath", "playFor", "PLAQUE", "BLOOM"]:
    print(needle, js.count(needle))
