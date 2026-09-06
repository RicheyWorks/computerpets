import pathlib, json, re
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
print("chord-off in abort lists:", js.count("chord-off"))
print("thirst-off count:", js.count("thirst-off"))
# silica roster
roster=json.loads(pathlib.Path("desktop/renderer/roster.json").read_text(encoding="utf-8"))
for g in roster:
  if g.get("key") in ("silica","terminator","nimbus","choir"):
    print(g["key"], "->", g.get("name"), g.get("speciesLabel"), g.get("slug"))
# current docs pins
for path in ["docs/ARCHITECTURE.md","docs/ROADMAP.md","README.md","desktop/README.md"]:
  t=pathlib.Path(path).read_text(encoding="utf-8")
  for i,line in enumerate(t.splitlines(),1):
    if "Nimbus" in line or "nimbus" in line or "next leftover" in line.lower() or ("Choir" in line and ("chord" in line or "leftover" in line)):
      print(f"{path}:{i}:{line[:200]}")
