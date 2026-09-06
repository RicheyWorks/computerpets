from pathlib import Path
h = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
lines = h.splitlines()
print("line 1706:", lines[1705])
print("context:")
for i in range(1695, 1720):
    print(f"{i+1}:{lines[i]}")
# fix any mangled notEqual nimbus sill
n = h.count('assert.notEqual(WP.playFor("nimbus"), "sill");')
h2 = h.replace('assert.notEqual(WP.playFor("nimbus"), "sill");', 'assert.notEqual(WP.playFor("choir"), "sill");')
print("fixed", n)
Path("desktop/renderer/leftover-house.test.cjs").write_text(h2, encoding="utf-8", newline="\n")
