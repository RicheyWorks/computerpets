from pathlib import Path
import re
s = Path("desktop/renderer/specials.js").read_text(encoding="utf-8")
for key in ["lacewing", "earwig", "jewelwing", "swallowtail"]:
    m = re.search(key + r':\s*"([^"]+)"', s)
    print("special", key, "->", m.group(1) if m else None)
c = Path("desktop/renderer/call-guests.js").read_text(encoding="utf-8")
m = re.search(r"MEADOW_KEYS = \[([^\]]+)\]", c)
print("MEADOW", m.group(1) if m else None)
g = Path("web/src/lib/pets/meadow-guide.ts").read_text(encoding="utf-8")
for key in ["jewelwing", "lacewing", "earwig"]:
    idx = g.find('"' + key + '"')
    print("---", key, "---")
    print(g[max(0, idx-80):idx+350])
cat = Path("web/src/lib/pets/catalog.ts").read_text(encoding="utf-8")
for key in ["jewelwing", "lacewing", "earwig"]:
    m = re.search(r'key: "' + key + r'"[^\n]+', cat)
    print("cat", m.group(0) if m else key)
meadow = Path("web/src/lib/pets/meadow.ts").read_text(encoding="utf-8")
for key in ["jewelwing", "lacewing", "earwig"]:
    idx = meadow.find('key: "' + key + '"')
    print("=== meadow", key, "===")
    print(meadow[idx:idx+500])
