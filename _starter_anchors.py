from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
# key anchors
checks = [
  'const DRIP = "drip";',
  'const SILL = "sill";',
  'dripOff: 2.48,',
  'sillHop:',
  'chicken_of_woods") return DRIP',
  'kind === DRIP) return w.width',
  'leave: "dripped"',
  'if (kind === WRAP)',
  'target.kind === DRIP',
  'target.kind === BURY',
  'phase === "drip-off"',
  'phase === "sill-hop"',
  'DRIP,\n    IGNORE',
  'dripOffPath,\n    pickTarget',
  'eighth leftover of the fungi den',
  'Others walk a sill. */',
]
for c in checks:
    print(f"JS {js.count(c):2d} | TS {ts.count(c):2d} | {c[:60]}")

# header tail
idx = js.find("eighth leftover")
print("\nHEADER JS:", js[idx-80:idx+120].replace("\n"," "))
idx = ts.find("eighth leftover")
print("HEADER TS:", ts[idx-80:idx+140].replace("\n"," "))

# side/leave unions in ts
import re
for pat in [r'side:[^;]+;', r'leave:[^;]+;', r'PlayKind =[^;]+;', r'Phase =[^;]+;']:
    m = re.search(pat, ts)
    if m:
        print(pat, m.group(0)[:200])
