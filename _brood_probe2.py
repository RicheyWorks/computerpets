from pathlib import Path
t=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i=t.find('leave: "prayed"')
print(repr(t[i:i+180]))
print("---")
i=t.find('if (target.kind === PRAY) {\n      const hold = prayPoint(win')
print("refit", i)
j=t.find('if (target.kind === SPOT) {\n          return goPhase(next, "spot-on"')
# find approach PRAY
k=t.find('if (target.kind === PRAY) {\n          return goPhase(next, "pray-on"')
print("approach pray", k)
print(repr(t[k:k+220]))
print("--- WRAP after pray pick ---")
# find WRAP after prayed
m=t.find('leave: "prayed"')
print(repr(t[m:m+250]))
