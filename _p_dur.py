from pathlib import Path
import re
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
m=re.search(r"facetOn: ([0-9.]+),\n    facet: ([0-9.]+),\n    facetHold: ([0-9.]+),\n    facetOff: ([0-9.]+)", js)
print("js", m.groups() if m else None)
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
m2=re.search(r"facetOn: ([0-9.]+),\n  facet: ([0-9.]+),\n  facetHold: ([0-9.]+),\n  facetOff: ([0-9.]+)", ts)
print("ts", m2.groups() if m2 else None)
# also count DUR objects
print("facetOn count js", js.count("facetOn:"))
