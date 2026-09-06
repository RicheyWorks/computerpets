from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for kind in ["WEEK","RIM","GOLD","WEB","THIRST","ALIGN","FROST","DUSK"]:
    m = re.search(r'if \(kind === %s\) return w\.width >= (\d+) && w\.height >= (\d+);' % kind, js)
    print(kind, m.group(0) if m else "NO")
# count umbral sill and pickTarget umbral in tests
for p in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs","desktop/renderer/leftover-house.test.cjs"]:
    t = Path(p).read_text(encoding="utf-8")
    print(p)
    print("  umbral sill", t.count('playFor("umbral"), "sill"'))
    print("  pick umbral", t.count('pickTarget([WIN], 80, "umbral"'))
    print("  cyst", t.count("cyst"))
# README exact old string for beacon docs
readme = Path("README.md").read_text(encoding="utf-8")
old = "Beacon aligns a sash parting bead as a ruler line: walk onto the bead, sit the north, then leave. Brine still owns frost. Flux still owns field. Bandit still owns inspect. Anchor still owns hitch. Stem still owns stilt."
print("readme old count", readme.count(old))
