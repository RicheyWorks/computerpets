from pathlib import Path

# Extract Beacon test from cjs (last big test)
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
start = cjs.find('test("Beacon leftover aligns')
# find next test after abort test ends - take from Beacon through end of abort test
# better: find both Beacon tests
idx1 = cjs.find('test("Beacon leftover aligns')
idx2 = cjs.find('test("a moved window refits Beacon')
# find end of second test - next test( or end
idx3 = cjs.find('\ntest("', idx2 + 10)
if idx3 < 0:
    idx3 = len(cjs)
block = cjs[idx1:idx3]
Path("_beacon_cjs_block.txt").write_text(block, encoding="utf-8")
print("cjs block lines", block.count("\n"), "chars", len(block))

# house test head + beacon section
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
Path("_beacon_house_head.txt").write_text("\n".join(house.splitlines()[:80]), encoding="utf-8")
# find umbral and beacon sections near end
for i, line in enumerate(house.splitlines()):
    if "umbral" in line or "Beacon" in line or "Hush" in line or "next leftover" in line.lower() or "eighth" in line.lower() or "ninth" in line.lower():
        pass
# dump lines 1-50 and 1680-1850
lines = house.splitlines()
Path("_beacon_house_snip.txt").write_text("\n".join(
    [f"{i+1}:{lines[i]}" for i in list(range(0, 80)) + list(range(1680, min(1850, len(lines))))]
), encoding="utf-8")
print("house lines", len(lines))

# mjs beacon block
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
m1 = mjs.find('test("Beacon leftover aligns')
m2 = mjs.find('test("a moved window refits Beacon')
m3 = mjs.find('\ntest("', m2 + 10)
if m3 < 0: m3 = len(mjs)
Path("_beacon_mjs_block.txt").write_text(mjs[m1:m3], encoding="utf-8")
print("mjs block lines", mjs[m1:m3].count("\n"))

# docs roadmap hush
for p in ["docs/ROADMAP.md", "README.md", "desktop/README.md", "docs/ARCHITECTURE.md"]:
    t = Path(p).read_text(encoding="utf-8")
    for i, line in enumerate(t.splitlines()):
        if any(k in line for k in ["Hush", "Beacon", "Arca", "umbral", "Next leftover", "far den", "Lamp shadow", "quiet"]):
            print(f"{p}:{i+1}:{line[:200]}")
