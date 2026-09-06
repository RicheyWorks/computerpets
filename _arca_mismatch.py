from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
print("JS QUIET", 'const QUIET = "quiet"' in js)
print("JS COOL", 'const COOL = "cool"' in js)
print("JS umbral return", [l for l in js.splitlines() if "umbral" in l])
# house assertions around 1700
lines=house.splitlines()
print("house title:", lines[18][:120])
for i in range(1698,1720):
    print(f"{i+1}:{lines[i]}")
print("arch hush:", [l[:120] for l in arch.splitlines() if "Hush" in l][:2])
# Does house test actually run WP.playFor umbral cool?
print("house cool count", house.count('"cool"'))
print("house quiet count", house.count('"quiet"'))
