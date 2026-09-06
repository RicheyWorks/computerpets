from pathlib import Path
road = Path("docs/ROADMAP.md").read_text(encoding="utf-8")
idx = road.find('- [x] Chirp (`field_cricket` / `chirp`)')
print("chirp idx", idx)
print(repr(road[idx:idx+1100]))
print("---")
print("Next leftover is Blade count", road.count("Next leftover is Blade. Do not start Blade."))
print("Chirp is done count", road.count("Chirp is done."))
arch = Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
for line in arch.splitlines():
    if "Last Updated" in line:
        print("ARCH:", line[:400])
        break
house = Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
for line in house.splitlines():
    if "Chirp leftover songs" in line:
        print("HOUSE:", line[:600])
        break
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find('if (key === "field_cricket") return SONG;')
print("playFor cricket context:", repr(js[i:i+120]))
# exports
j = js.find("    EMERGE,\n    SONG,\n")
print("exports:", repr(js[j:j+80]))
k = js.find("    emergeOffPath,\n    songPoint,")
print("api paths:", repr(js[k:k+200]))
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("ts kind union has SONG", "typeof SONG" in ts)
print("ts side has grassdish", '"grassdish"' in ts)
print("ts leave has sung", '"sung"' in ts)
print("ts phases song-on", '"song-on"' in ts)
cjs = Path("desktop/renderer/window-play.test.cjs").read_text(encoding="utf-8")
print("cjs katydid sill", cjs.count('assert.equal(P.playFor("katydid"), "sill");'))
print("cjs pickTarget katydid", cjs.count('pickTarget([WIN], 80, "katydid"'))
mjs = Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
print("mjs katydid sill", mjs.count('assert.equal(P.playFor("katydid"), "sill");'))
