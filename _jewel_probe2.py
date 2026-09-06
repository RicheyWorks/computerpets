from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# extract point functions near meadow guests and rim-ish
for name in ["tailsPoint","jumpPoint","leafPoint","songPoint","hawkPoint","sillPoint","weekPoint","weedPoint","emergePoint","freezePoint","prayPoint","raspPoint"]:
    m = re.search(rf"function {name}\(win.*?^\s{{2}}\}}", js, re.M|re.S)
    if m:
        print("====", name, "====")
        print(m.group(0)[:500])
        print()
# used side/leave tokens near meadow
for tok in ["blossomdish","grassplate","leafrim","grassdish","preyair","stream","rim","side:"]:
    print(tok, js.count(tok))
# current DUR tails values and consts end
m = re.search(r"const TAILS = .*?\n  const SILL", js)
print("consts", m.group(0) if m else None)
m = re.search(r"tailsOn:.*?\n    sillHop", js, re.S)
print("dur", m.group(0) if m else None)
# playFor end
m = re.search(r'if \(key === "swallowtail"\).*?return SILL;', js, re.S)
print("playFor", m.group(0) if m else None)
# exports near JUMP TAILS
m = re.search(r"JUMP,\n    TAILS,\n    IGNORE,", js)
print("export const", bool(m))
m = re.search(r"tailsOffPath,\n    pickTarget,", js)
print("export fns", bool(m))
# leftover house current next
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for line in house.splitlines():
    if "next leftover" in line.lower() or "jewelwing" in line or "Jewel" in line:
        if len(line) < 220:
            print("HOUSE:", line.strip())
