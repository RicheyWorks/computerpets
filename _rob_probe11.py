from pathlib import Path
import re
for p in ["desktop/renderer/window-play.js","web/src/lib/pets/window-play.ts"]:
    t = Path(p).read_text(encoding="utf-8")
    print(p, "seize" in t, "SEIZE" in t)
# find export block end
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
idx = js.index("RIGHT,")
print(js[idx-200:idx+400])
print("--- module end ---")
# find last exports
m = list(re.finditer(r"rightOffPath,", js))
print("rightOffPath count", len(m), "at", m[-1].start() if m else None)
# sill pin in tests
for p in ["desktop/renderer/window-play.test.cjs","web/scripts/window-play.test.mjs","desktop/renderer/leftover-house.test.cjs"]:
    t = Path(p).read_text(encoding="utf-8")
    for line in t.splitlines():
        if "robber_fly" in line or ("sill" in line and "click_beetle" in line) or "generic sill" in line.lower() or "still walks a generic sill" in line:
            if "robber" in line or "sill" in line:
                print(p, ":", line.strip()[:160])
