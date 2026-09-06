from pathlib import Path
cjs=Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
idx=0
while True:
    i=cjs.find('playFor("cyst"), "sill"', idx)
    if i<0: break
    print(repr(cjs[i-30:i+40]))
    idx=i+1
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("house title starts", house.splitlines()[18][:180])
print("Do not start Boot", "Do not start Boot" in Path("docs/ROADMAP.md").read_text(encoding="utf-8"))
print("mjs Arca", Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8").count("Arca leftover"))
