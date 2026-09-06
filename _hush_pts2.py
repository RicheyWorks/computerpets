from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for fn in ["weekLampDir", "goldLampDir", "webLampDir", "function weekPoint", "function rimPoint"]:
    i = js.find(fn if fn.startswith("function") else "function %s" % fn)
    print("===", fn, i)
    if i < 0:
        i = js.find(fn)
    if i >= 0:
        print(js[i:i+700])
        print()
# house test umbral/next leftover assertions near end
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
lines = house.splitlines()
Path("_house_tail.txt").write_text("\n".join("%d:%s"%(i+1,lines[i]) for i in range(1690, min(1850,len(lines)))), encoding="utf-8")
# README one liner
for p in ["README.md","desktop/README.md"]:
    t = Path(p).read_text(encoding="utf-8")
    for i,line in enumerate(t.splitlines()):
        if "Beacon aligns" in line or "Brine frosts" in line or "Hush" in line:
            print(p, i+1, line[:220])
