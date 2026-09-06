from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("lichen return", [l.strip() for l in js.splitlines() if 'lichen' in l and 'return' in l][:10])
print("PLAQUE const", 'const PLAQUE = "plaque"' in js)
# line 1115 area of cjs
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8").splitlines()
for i in range(1110, 1145):
    print(f"{i+1}:{cjs[i]}")
print("--- pact fail lines ---")
for i in range(34770, 34785):
    print(f"{i+1}:{cjs[i]}")
