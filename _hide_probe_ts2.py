from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
checks = [
    'export const HOLE = "hole"',
    "holeOn: 3.31",
    "typeof HOLE",
    '"reefhole"',
    '"holed"',
    'key === "grouper"',
    "kind === HOLE) return w.width",
    'leave: "holed"',
    "function holePoint",
    "target.kind === HOLE",
    "hole-on",
    "Hide holes a sash well",
]
for c in checks:
    print(("OK" if c in ts else "MISS"), c)
# approach marker context
i = ts.find('target.kind === SPOTS')
while i >= 0:
    ctx = ts[i:i+200]
    if "spots-on" in ctx:
        print("APPROACH:", repr(ctx[:180]))
        break
    i = ts.find("target.kind === SPOTS", i+1)
