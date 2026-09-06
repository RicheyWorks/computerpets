from pathlib import Path
t = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("next leftover is Lattice count", t.count("next leftover is Lattice"))
print("playFor morel count", t.count('playFor("morel")'))
# print contexts
idx = 0
while True:
    i = t.find('playFor("morel")', idx)
    if i < 0: break
    line = t[:i].count("\n")+1
    print(f"morel line {line}: {t[max(0,i-40):i+50].replace(chr(10),' | ')}")
    idx = i+1
print("--- chanterelle ---", t.count("chanterelle"))
print("--- horn ---", "playFor(\"chanterelle\")" in t)
# generic sill
for n in ["generic-sill", "generic sill", "sill guest", "remaining generic"]:
    print(n, t.count(n))
# find playFor sill remaining
# look near line 1658
lines = t.splitlines()
for n in range(1640, 1660):
    print(f"{n+1}:{lines[n][:200]}")
