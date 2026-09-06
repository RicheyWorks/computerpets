from pathlib import Path
import re
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for label,t in [("cjs",cjs),("mjs",mjs),("house",house)]:
    ys = [(m.start(), t[max(0,m.start()-60):m.end()+40]) for m in re.finditer(r'playFor\("yeast"\),\s*"sill"', t)]
    print(label, "count", len(ys))
    # unique contexts (strip whitespace)
    uniq = sorted(set(re.sub(r"\s+"," ",x[1]) for x in ys))
    for u in uniq[:8]:
        print(" ", u[:140])
    if len(uniq)>8: print(" ...", len(uniq), "unique")
# also check dryOn exported
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("dryOn in DUR object exported via P.DUR?", "dryOn:" in js)
print("exports dryPoint", "dryPoint," in js or "dryPoint\n" in js)
