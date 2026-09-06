from pathlib import Path
mjs=Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
# find sill guest pins that still use silica as the generic walker
idx=0
while True:
    i=mjs.find('pickTarget([WIN], 80, "silica"', idx)
    if i<0: break
    print(i, repr(mjs[i-80:i+120]))
    idx=i+1
print("--- house/docs state ---")
house=Path("desktop/renderer/leftover-house.test.cjs").read_text(encoding="utf-8")
print("Shard leftover title", house.startswith('test("Shard') or 'Shard leftover facets' in house[:200])
print("next Silica", "next leftover is Silica" in house)
print("next Dusk", "next leftover is Dusk" in house)
print("silica facet", 'playFor("silica"), "facet"' in house)
print("silica sill", 'playFor("silica"), "sill"' in house)
arch=Path("docs/ARCHITECTURE.md").read_text(encoding="utf-8")
print("arch Shard", "Shard facets" in arch)
print("arch Silica next", "next leftover is Silica" in arch)
rm=Path("docs/ROADMAP.md").read_text(encoding="utf-8")
print("rm Shard entry", "Shard (`silica`" in rm)
print("rm Dusk next", "Next leftover is Dusk" in rm)
readme=Path("README.md").read_text(encoding="utf-8")
print("readme Shard", "Shard facets a sash gap" in readme)
