from pathlib import Path
for p in ["README.md","desktop/README.md"]:
    t = Path(p).read_text(encoding="utf-8")
    idx = t.find("Beacon aligns")
    print(p, "Beacon idx", idx)
    if idx < 0:
        idx = t.find("Brine frosts")
        print("  Brine idx", idx)
    if idx >= 0:
        # print surrounding 400 chars
        print(t[max(0,idx-100):idx+350])
        print("---")
# check TS phase union current end for beacon
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for needle in ['typeof ALIGN', 'align-off', 'rulerline', 'aligned', 'frostOff:', 'alignOff:', '"quiet"', 'saltdish']:
    i = ts.find(needle)
    print("ts", needle, i)
# house title line start
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("HOUSE TITLE START:", house.splitlines()[18][:180])
print("next leftover is Hush" in house)
print("umbral sill count", house.count('playFor("umbral"), "sill"'))
