from pathlib import Path
cjs = Path(r"desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
mjs = Path(r"web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
house = Path(r"desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("cjs halovore sill", cjs.count('playFor("halovore"), "sill"'))
print("mjs halovore sill", mjs.count('playFor("halovore"), "sill"'))
print("house halovore sill", house.count('playFor("halovore"), "sill"'))
print("cjs magneton", cjs.count("magneton"))
print("cjs pickTarget halovore", cjs.count('pickTarget([WIN], 80, "halovore"'))
print("house next leftover", [l for l in house.splitlines() if "next leftover" in l][:3])
# house title
for l in house.splitlines():
    if l.startswith('test("Knot leftover') or l.startswith('test("Dusk leftover') or "far den" in l and l.startswith("test("):
        print("HOUSE TITLE:", l[:240])
        break
# docs
readme = Path("README.md").read_text(encoding="utf-8")
for line in readme.splitlines():
    if "Knot manys" in line or "Brine" in line:
        print("README:", line[:220])
        break
rm = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for line in rm.splitlines():
    if "Knot (`nexus`" in line or "Next leftover is Brine" in line or "Do not start Brine" in line:
        print("RM:", line[:200])
