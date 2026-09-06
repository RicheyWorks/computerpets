from pathlib import Path
import re
# current doc pins
for p in ["README.md","desktop/README.md","docs/ARCHITECTURE.md","docs/ROADMAP.md"]:
    t=Path(p).read_text(encoding="utf-8")
    for line in t.splitlines():
        if "Banner" in line and ("next leftover" in line.lower() or "tails a" in line or "2026-09" in line or "Jewel" in line):
            if len(line)<240:
                print(p+":", line.strip()[:220])
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
# find the long test title
m=re.search(r'test\("Banner leftover tails.*?do not start[^"]+"', house)
print("TITLE LEN", len(m.group(0)) if m else None)
if m:
    print(m.group(0)[:500])
    print("...")
    print(m.group(0)[-400:])
# find asserts around jewelwing
idx=house.find('playFor("jewelwing")')
print(house[idx-200:idx+800])
# DUR actual
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("DUR tails", re.search(r"tailsOn:[\s\S]*?sillHop", js).group(0))
# WRAP marker for goPhase
print("GO after tails", "tails-on" in js and 'if (target.kind === WRAP)' in js)
# check bat fold and dart hawk
print("bat", re.search(r'if \(key === "bat"\) return ([A-Z_]+);', js).group(0))
print("darner", re.search(r'if \(key === "darner"\) return ([A-Z_]+);', js).group(0))
print("fold const", "const FOLD" in js or 'FOLD = "fold"' in js)
