from pathlib import Path
mjs=Path("web/scripts/window-play.test.mjs").read_text(encoding="utf-8")
print("Shard facets", "Shard facets" in mjs)
print("silica sill", mjs.count('playFor("silica"), "sill"'))
print("terminator sill", mjs.count('playFor("terminator"), "sill"'))
# find other guests / sill guest patterns
for needle in ["other guests", "clone Rui", "pickTarget([WIN], 80, \"silica\"", "pickTarget([WIN], 80, \"terminator\"", "pickTarget([WIN], 80, \"nimbus\""]:
    print(needle, mjs.find(needle))
# show around first sill-related pick with silica/terminator/nimbus near top tests
import re
for m in re.finditer(r'pickTarget\(\[WIN\], 80, "[^"]+"', mjs):
    if m.start() < 50000:
        print(m.start(), m.group(0))
