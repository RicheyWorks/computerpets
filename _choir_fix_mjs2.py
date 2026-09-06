from pathlib import Path
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8-sig").replace("\ufeff","")
mjs = mjs.replace('assert.notEqual(P.playFor("nimbus"), "sill");', 'assert.notEqual(P.playFor("choir"), "sill");')
lines = mjs.splitlines()
# show context around remaining choir pickTargets that aren't in Choir test
for i,line in enumerate(lines):
    if 'pickTarget([WIN], 80, "choir"' in line or 'pickTarget([WIN], 200, "choir"' in line:
        start=max(0,i-3); end=min(len(lines), i+8)
        print(f"--- around {i+1} ---")
        for j in range(start,end):
            print(f"{j+1}:{lines[j][:160]}")
# Also check cjs still ok
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs notEqual choir sill", cjs.count('notEqual(P.playFor("choir"), "sill")'))
print("cjs equal nimbus sill", cjs.count('equal(P.playFor("nimbus"), "sill")'))
print("cjs other guests nimbus", 'pickTarget([WIN], 80, "nimbus"' in cjs[cjs.find("other guests"):cjs.find("other guests")+300])
Path("web/scripts/window-play.test.mjs").write_text(mjs, encoding="utf-8", newline="\n")
print("mjs saved, notEqual choir sill", mjs.count('notEqual(P.playFor("choir"), "sill")'))
