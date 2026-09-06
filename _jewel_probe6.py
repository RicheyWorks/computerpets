from pathlib import Path
t=Path("README.md").read_text(encoding="utf-8")
idx=t.find("Banner tails")
print(repr(t[idx:idx+550]))
print("---END---")
# find Others walk
idx2=t.find("Others walk a sill", idx)
print(repr(t[idx2-80:idx2+30]))
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("swallowtail sill occurrences:")
start=0
while True:
    i=house.find('playFor("swallowtail"), "sill"', start)
    if i<0: break
    print(i, repr(house[i-100:i+80]))
    start=i+1
print("jewelwing sill:")
start=0
while True:
    i=house.find('playFor("jewelwing"), "sill"', start)
    if i<0: break
    print(i, repr(house[i-80:i+60]))
    start=i+1
# cjs generic pin
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs jewelwing pick", cjs.count('pickTarget([WIN], 80, "jewelwing"'))
print("cjs swallowtail sill", cjs.count('playFor("swallowtail"), "sill"'))
print("cjs jewelwing sill", cjs.count('playFor("jewelwing"), "sill"'))
print("mjs jewelwing sill", Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8").count('playFor("jewelwing"), "sill"'))
# TS current markers for patch
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("ts TAILS const", 'export const TAILS = "tails";' in ts)
print("ts kind union has TAILS", "typeof TAILS" in ts)
print("ts side blossomdish", '"blossomdish"' in ts)
print("ts leave bannered", '"bannered"' in ts)
# find WRAP after tails goPhase
import re
m=re.search(r'if \(target\.kind === TAILS\) \{[\s\S]{0,200}?if \(target\.kind === WRAP\)', ts)
print("ts GO pattern", bool(m))
m=re.search(r'if \(target\.kind === TAILS\) \{[\s\S]{0,120}?if \(target\.kind === BURY\)', ts)
print("ts REFIT pattern", bool(m))
