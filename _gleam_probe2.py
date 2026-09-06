import re
js = open("desktop/renderer/window-play.js", encoding="utf-8").read()
# photovore, lichen, yeast, plaque
for needle in ["photovore", "lichen", "yeast", "plaque", "bloom", "PLAQUE", "BLOOM"]:
    idxs = [m.start() for m in re.finditer(re.escape(needle), js)]
    print(needle, "count", len(idxs), "first idxs", idxs[:8])

# find lichen branch in playFor
idx = js.find('if (key === "lichen")')
print("\n=== lichen playFor ===")
print(js[idx:idx+200])
idx = js.find('if (key === "yeast")')
print("\n=== yeast playFor ===")
print(js[idx:idx+200])
idx = js.find('if (key === "photovore")')
print("\n=== photovore playFor (may be absent - falls to sill) ===")
print(repr(js[idx:idx+200]) if idx>=0 else "ABSENT - falls through to sill")

# constants for PLAQUE
for name in ["PLAQUE", "BLOOM", "plaquePath", "bloomPath", "plaquePoints", "bloomPoints"]:
    i = js.find(name)
    print(name, "at", i)
