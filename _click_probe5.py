from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find pickTarget DRILL block
idx = 0
while True:
    i = js.find("if (kind === DRILL)", idx)
    if i < 0: break
    print("AT", i)
    print(js[i:i+520])
    print("====")
    idx = i+1
print("GO PHASE DRILL:")
i = js.find('goPhase(next, "drill-on"')
print(js[i-200:i+220])
print("EXPORT:")
i = js.find("    DRILL,\n    IGNORE")
print(repr(js[i-40:i+80]))
i = js.find("drillOffPath,\n    pickTarget")
print(repr(js[i-60:i+80]))
# README header snippet
for p in ["README.md","desktop/README.md"]:
    t=Path(p).read_text(encoding="utf-8")
    i=t.find("Snout drills")
    print(p, t[i:i+280])
