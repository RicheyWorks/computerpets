import json
from pathlib import Path
r = json.loads(Path("desktop/renderer/roster.json").read_text(encoding="utf-8"))
# structure
if isinstance(r, list):
    for item in r:
        if isinstance(item, dict) and item.get("key") in ("oyster","fly_agaric","robber_fly"):
            print(item.get("key"), item.get("name"), item.get("slug"))
elif isinstance(r, dict):
    print("keys", list(r.keys())[:20])
    pets = r.get("pets") or r.get("species") or r.get("guests") or r
    if isinstance(pets, list):
        for item in pets:
            if item.get("key") in ("oyster","fly_agaric","robber_fly","click_beetle"):
                print(item)
    elif isinstance(pets, dict):
        for k in ("oyster","fly_agaric","robber_fly"):
            print(k, pets.get(k))
