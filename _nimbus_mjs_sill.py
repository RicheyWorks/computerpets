import pathlib
mjs = pathlib.Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
for needle in ["other guests", "clone Rui", "sill-hop", 'pickTarget([WIN], 80, "nimbus"', 'pickTarget([WIN], 80, "silica"', 'pickTarget([WIN], 80, "choir"']:
    print(needle, mjs.count(needle))
# find any generic sill walk test
for i,l in enumerate(mjs.splitlines(),1):
    if "sill-hop" in l and "assert.ok(seen.has" in l:
        print("line", i, l.strip())
        for j in range(max(1,i-30), i+5):
            print(f"  {j}:{mjs.splitlines()[j-1][:120]}")
        break
