from pathlib import Path
# full hush cjs block
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
i = cjs.find('test("Hush leftover quiets')
# second hush test
j = cjs.find('test("a moved window refits Hush', i)
k = cjs.find("\ntest(", j+10)
if k<0: k=len(cjs)
block = cjs[i:k]
Path("_hush_cjs_full.txt").write_text(block, encoding="utf-8")
print("hush tests len", len(block), "ends", repr(block[-200:]))

# mjs hush
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
i = mjs.find('test("Hush leftover')
j = mjs.find('test("a moved window refits Hush', i)
k = mjs.find("\ntest(", j+10)
if k<0: k=len(mjs)
Path("_hush_mjs_full.txt").write_text(mjs[i:k], encoding="utf-8")
print("mjs hush len", k-i)

# house
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
# find far den / Hush / next
for needle in ["Hush", "far den", "Arca", "Boot", "ninth", "tenth", "cyst", "umbral"]:
    print(needle, house.count(needle), house.find(needle))
# print last 120 lines
lines = house.splitlines()
Path("_house_tail.txt").write_text("\n".join(lines[-120:]), encoding="utf-8")
print("house lines", len(lines))
