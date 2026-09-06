js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
# find Brood sentence in header
h=js.splitlines()[0]
idx=h.find("Brood emerges")
print(h[idx:idx+420])
print("---")
ts=open("web/src/lib/pets/window-play.ts",encoding="utf-8").read()
print("ts header brood?", "Brood emerges" in ts.splitlines()[0])
th=ts.splitlines()[0]
idx=th.find("Brood emerges")
print(th[idx:idx+420])
print("---README brood---")
r=open("README.md",encoding="utf-8").read()
i=r.find("Brood ")
print(r[i:i+280] if i>=0 else "not found")
print("---desktop README---")
d=open("desktop/README.md",encoding="utf-8").read()
i=d.find("Brood ")
print(d[i:i+280] if i>=0 else "not found")
print("---arch---")
a=open("docs/ARCHITECTURE.md",encoding="utf-8").read()
i=a.find("Brood emerges")
print(a[i:i+220] if i>=0 else "not found")
# field_cricket sill count in tests
for p in ["desktop/renderer/window-play.test.cjs","desktop/renderer/leftover-house.test.cjs","web/scripts/window-play.test.mjs"]:
    t=open(p,encoding="utf-8").read()
    print(p, "field_cricket sill", t.count('playFor("field_cricket"), "sill"'), "katydid sill", t.count('playFor("katydid"), "sill"'))
