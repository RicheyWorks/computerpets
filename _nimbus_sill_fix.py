import pathlib, re
for path in ["desktop/renderer/window-play.test.cjs", "web/scripts/window-play.test.mjs", "desktop/renderer/leftover-house.test.cjs"]:
  t = pathlib.Path(path).read_text(encoding="utf-8")
  hits = []
  for i, line in enumerate(t.splitlines(), 1):
    if "nimbus" in line:
      hits.append(f"{i}:{line.strip()[:160]}")
  print("====", path, "nimbus hits", len(hits))
  for h in hits[:30]:
    print(h)
  print("silica pickTarget", t.count('pickTarget([WIN], 80, "silica"'), "nimbus pickTarget", t.count('pickTarget([WIN], 80, "nimbus"'))
