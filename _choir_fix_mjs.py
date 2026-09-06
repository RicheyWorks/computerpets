from pathlib import Path
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8-sig")
mjs = mjs.replace("\ufeff", "")
n1 = mjs.count('assert.notEqual(P.playFor("nimbus"), "sill");')
mjs = mjs.replace('assert.notEqual(P.playFor("nimbus"), "sill");', 'assert.notEqual(P.playFor("choir"), "sill");')
print("fixed notEqual", n1)
# find other guests / sill walker
for i,line in enumerate(mjs.splitlines(),1):
    if "sill and hop" in line or "other guests" in line or 'pickTarget([WIN], 80, "choir"' in line or 'pickTarget([WIN], 80, "nimbus"' in line:
        if i < 200 or "choir" in line or "nimbus" in line and i < 500:
            print(f"{i}:{line[:140]}")
# search sill-hop assert with nearby pick
idx = mjs.find('seen.has("sill-hop")')
print("sill-hop at", idx)
print(mjs[max(0,idx-400):idx+80])
