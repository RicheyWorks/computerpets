from pathlib import Path
js = Path(r"desktop\renderer\window-play.js").read_text(encoding="utf-8")
ts = Path(r"web\src\lib\pets\window-play.ts").read_text(encoding="utf-8")

def extract(src, marker, n=80):
    i = src.find(marker)
    print("===", marker, "js" if src is js else "ts", "at", i, "===")
    print(src[i:i+n] if i>=0 else "MISSING")
    print()

print("TS glowPoint")
i = ts.find("export function glowPoint")
print(ts[i:i+2200] if i>=0 else "no export function")
if i<0:
    i = ts.find("function glowPoint")
    print(ts[i:i+2200] if i>=0 else "no function")

print("\n=== TS pick GLOW ===")
i = ts.find("if (kind === GLOW)")
# second occurrence is pick
idx = 0
c = 0
while True:
    i = ts.find("if (kind === GLOW)", idx)
    if i<0: break
    c += 1
    print("--- occ", c, "line-ish ---")
    print(ts[i:i+650])
    idx = i+1

print("\n=== TS week-off then glow-on tick ===")
i = ts.find('if (next.phase === "glow-on")')
print(ts[i:i+2400] if i>=0 else "MISSING")
