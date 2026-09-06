from pathlib import Path
import json
r = json.loads(Path("desktop/renderer/roster.json").read_text(encoding="utf-8"))
# roster may be list or dict
items = r if isinstance(r, list) else r.get("pets") or r.get("guests") or list(r.values())
if isinstance(items, dict):
    items = list(items.values())
for g in items:
    if not isinstance(g, dict):
        continue
    key = g.get("key") or g.get("id") or g.get("speciesKey") or ""
    name = g.get("name") or g.get("houseName") or g.get("slug") or ""
    slug = g.get("slug") or ""
    if key in ("acorn_weevil","click_beetle","earwig","carpenter_bee","oak","chickadee","nautilus") or name in ("Snout","Click","Forceps","Auger","Mast","Dee","Cup") or slug in ("snout","click","forceps","auger","mast","dee","cup"):
        print(g)
print("count", len(items) if isinstance(items, list) else "?")
# meadow guide order
mg = Path("web/src/lib/pets/meadow-guide.ts").read_text(encoding="utf-8")
i = mg.find("snout")
print("meadow snout", repr(mg[max(0,i-200):i+300]))
