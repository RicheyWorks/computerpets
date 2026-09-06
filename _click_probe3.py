from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
checks = [
  'const DRILL = "drill";',
  'const SILL = "sill";',
  'drillOff: 2.58,',
  'sillHop: 0.38,',
  'if (key === "acorn_weevil") return DRILL;',
  'return SILL;',
  'if (kind === DRILL) return w.width >= 186 && w.height >= 150;',
  'return w.width >= 180 && w.height >= 70;',
  'leave: "drilled",',
  'if (target.kind === DRILL) {',
  'if (target.kind === BURY) {',
  'if (target.kind === WRAP) {',
  'function beginPlay(target, petX) {',
  'if (next.phase === "sill-hop") {',
  '    DRILL,',
  '    IGNORE,',
  '    drillOffPath,',
  '    pickTarget,',
  'Snout drills a window stool as an acorn cup',
  'This is the eighth leftover of the meadow den.',
]
for c in checks:
    print(repr(c), "->", js.count(c))
# also check flip/bluff and relay click for collision
for c in ['const FLIP', 'const CLICK', 'FLIP =', 'CLICK =', 'playFor("relay', 'bluff', 'snapper']:
    pass
print("FLIP const", "FLIP" in js and js.count('const FLIP'))
print("CLICK const lines:")
for i,line in enumerate(js.splitlines()):
    if 'const CLICK' in line or 'const FLIP' in line or 'const SNAP' in line or 'const JUMP' in line or 'const GLOW' in line:
        print(i+1, line.strip()[:80])
