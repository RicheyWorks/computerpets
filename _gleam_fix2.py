from pathlib import Path
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
old = 'assert.notEqual(WP.playFor("choir"), "sill")'
new = 'assert.notEqual(WP.playFor("photovore"), "sill")'
n = house.count(old)
print("house bad notequal", n)
house = house.replace(old, new)
Path("desktop/renderer/leftover-house.test.cjs").write_text(house, encoding="utf-8", newline="\n")
print("fixed", house.count(new), "choir sill equals", house.count('playFor("choir"), "sill"'))

# mjs photovore pick context
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
idx = 0
while True:
    j = mjs.find('pickTarget([WIN], 80, "photovore"', idx)
    if j < 0: break
    print("mjs pick", mjs[j-100:j+80].replace("\n"," "))
    idx = j+1
# also search other sill walker patterns that used photovore
for needle in ['"photovore", WORK', "playFor(\"photovore\"), \"sill\"", "key: \"photovore\""]:
    print(needle, mjs.count(needle))

cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
# remaining sill-walker tests using photovore?
import re
for m in re.finditer(r'"(?:photovore)"', cjs):
    line = cjs[:m.start()].count("\n")+1
    ctx = cjs[max(0,m.start()-60):m.start()+40].replace("\n"," ")
    if "thirst" in cjs[max(0,m.start()-200):m.start()+200] or "Gleam" in cjs[max(0,m.start()-800):m.start()]:
        continue
    if "playFor" in ctx and "thirst" in cjs[m.start()-30:m.start()+50]:
        continue
    # print suspicious
    if "sill" in cjs[m.start()-80:m.start()+80] or "pickTarget" in ctx:
        if "thirst" not in cjs[m.start()-100:m.start()+100]:
            print(f"cjs @{line}: {ctx}")
