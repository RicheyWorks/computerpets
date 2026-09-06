from pathlib import Path
import json, re
sp = Path("desktop/renderer/specials.js").read_text(encoding="utf-8")
for key in ["oyster","fly_agaric","morel","chanterelle","turkey_tail","lions_mane","puffball","chicken_of_woods","yeast","lichen","robber_fly","click_beetle"]:
    m = re.search(rf'{key}:\s*"([^"]+)"', sp)
    print(key, "=>", m.group(1) if m else None)
roster = json.loads(Path("desktop/renderer/roster.json").read_text(encoding="utf-8"))
# find dens / groups
if isinstance(roster, list):
    for g in roster:
        if isinstance(g, dict) and any(x.get("key")=="robber_fly" for x in g.get("guests",g.get("pets",[])) if isinstance(x,dict)):
            print("group", g.get("id") or g.get("name") or g.get("den"))
            for x in g.get("guests",g.get("pets",[])):
                print(" ", x.get("key"), x.get("name"), x.get("slug"))
elif isinstance(roster, dict):
    print(roster.keys())
    pets = roster.get("pets") or roster.get("guests") or roster.get("species")
    if pets:
        # print meadow and next
        keys = [p.get("key") for p in pets]
        i = keys.index("robber_fly")
        for p in pets[i-2:i+12]:
            print(p.get("key"), p.get("name"), p.get("slug"), p.get("den") or p.get("group"))
