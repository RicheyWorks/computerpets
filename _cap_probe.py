js=open("desktop/renderer/window-play.js",encoding="utf-8").read()
for k in ["ladybird","cuttlefish","robber_fly","oyster","fly_agaric","morel"]:
    needle = 'key === "%s"' % k
    i=js.find(needle)
    print(k, i, repr(js[i:i+70]) if i>=0 else None)
print("SPOT", "SPOT" in js and 'const SPOT' in js)
print("FLUSH", "const FLUSH" in js)
i=js.find("function vaultPoint")
print("vault", repr(js[i:i+420]) if i>=0 else None)
ts=open("web/src/lib/pets/window-play.ts",encoding="utf-8").read()
i=ts.find("Frill shelves")
print("ts", ts[i:i+420])
cjs=open("desktop/renderer/window-play.test.cjs",encoding="utf-8").read()
print("cjs fly sill", cjs.count('playFor("fly_agaric"), "sill"'))
print("mjs fly sill", open("web/scripts/window-play.test.mjs",encoding="utf-8").read().count('playFor("fly_agaric"), "sill"'))
house=open("desktop/renderer/leftover-house.test.cjs",encoding="utf-8").read()
print("house fly sill", house.count('playFor("fly_agaric"), "sill"'))
print("house oyster shelf", house.count('playFor("oyster"), "shelf"'))
# frill title start
print("house title head", house[house.find("test(\"Frill"):house.find("test(\"Frill")+220])
# roadmap last updated
rm=open("docs/ROADMAP.md",encoding="utf-8").read()
i=rm.find("**Last Updated:**")
print("rm", rm[i:i+280])
