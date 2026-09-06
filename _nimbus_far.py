import pathlib, re
# traits / specials names for far den
for path in ["desktop/renderer/specials.js","desktop/renderer/traits.js","docs/ROADMAP.md"]:
  t=pathlib.Path(path).read_text(encoding="utf-8")
  for key in ["photovore","choir","nimbus","silica","terminator","nexus","halovore","magneton","umbral","cyst"]:
    for i,line in enumerate(t.splitlines(),1):
      if key in line.lower() or (key=="nimbus" and "Nimbus" in line) or (key=="silica" and ("Silica" in line or "Shard" in line)):
        if path.endswith("ROADMAP.md") and "leftover" not in line.lower() and "far" not in line.lower() and key not in line:
          continue
        print(f"{path}:{i}:{line.strip()[:220]}")
        break
# gleam/choir roadmap entries
rm=pathlib.Path("docs/ROADMAP.md").read_text(encoding="utf-8")
for i,line in enumerate(rm.splitlines(),1):
  if "Gleam" in line and "photovore" in line: print("GLEAM", i, line[:250])
  if "Choir" in line and "choir" in line: print("CHOIR", i, line[:250])
  if "far den" in line.lower(): print("FAR", i, line[:200])
