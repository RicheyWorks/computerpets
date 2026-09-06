import json, pathlib
roster=json.loads(pathlib.Path("desktop/renderer/roster.json").read_text(encoding="utf-8"))
for g in roster:
  if g.get("key") in ("photovore","choir","nimbus","silica","lichen","yeast"):
    print(g["key"], g.get("name"), g.get("slug"), g.get("speciesLabel"))
# traits den labels
t=pathlib.Path("desktop/renderer/traits.js").read_text(encoding="utf-8")
import re
for key in ["nimbus","silica"]:
  m=re.search(rf"{key}:\s*\{{([^}}]+)}}", t, re.S)
  print(key, "traits snippet:", (m.group(0)[:400] if m else "missing"))
# choir roadmap line exact + hours for nimbus
rm=pathlib.Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,line in enumerate(rm.splitlines(),1):
  if "`choir`" in line or "`photovore`" in line or "next leftover is Nimbus" in line:
    print(i, line[:300])
