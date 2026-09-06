from pathlib import Path
import re
cat = Path("web/src/lib/pets/catalog.ts").read_text(encoding="utf-8")
entries = re.findall(r'\{ key: "([^"]+)", displayName: "([^"]+)", rarity: "[^"]+", temperament: "([^"]+)"', cat)
by = {k:(n,t) for k,n,t in entries}
for key in ["oyster","fly_agaric","morel","chanterelle","turkey_tail","lions_mane","puffball","chicken_of_woods","yeast","lichen","sloth","gibbon"]:
    print(key, by.get(key))
# house names often in pet.js roster
for name in ["pet.js","desk.js","pets-data.js","roster.js"]:
    p = Path("desktop/renderer")/name
    if p.exists():
        t = p.read_text(encoding="utf-8", errors="ignore")
        for key in ["oyster","fly_agaric","robber_fly"]:
            if key in t:
                idx = t.index(key)
                print("---", name, key, "---")
                print(t[max(0,idx-120):idx+200].replace("\n"," "))
