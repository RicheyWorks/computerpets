from pathlib import Path
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
for label, t in [("cjs", cjs), ("mjs", mjs)]:
    for needle in ['"umbral"', "cyst", 'pickTarget([WIN], 80, "umbral"', "pickTarget([WIN], 80, 'umbral'"]:
        print(label, needle, t.count(needle))
    # sample umbral lines
    for i, line in enumerate(t.splitlines()):
        if "umbral" in line and "pickTarget" in line:
            print(label, "L", i+1, line[:160])
