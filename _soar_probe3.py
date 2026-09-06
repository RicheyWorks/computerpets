from pathlib import Path
for p in [
  "desktop/renderer/leftover-house.test.cjs",
  "docs/ARCHITECTURE.md",
  "docs/ROADMAP.md",
  "README.md",
  "desktop/README.md",
  "web/src/lib/pets/window-play.ts",
  "desktop/renderer/window-play.test.cjs",
  "web/scripts/window-play.test.mjs",
]:
  t = Path(p).read_text(encoding="utf-8")
  print("====", p, "====")
  for s in ["Next leftover", "Soar", "eagle_ray", "grouper", "Hide", "Gate leftover", "generic-sill", 'pickTarget([WIN], 80, "eagle_ray"']:
    idx = 0
    n = 0
    while n < 2:
      i = t.find(s, idx)
      if i < 0: break
      line_start = t.rfind("\n", 0, i) + 1
      line_end = t.find("\n", i)
      print(f"  {s}@{i}: {t[line_start:min(line_end, line_start+180)]}")
      idx = i + len(s)
      n += 1
