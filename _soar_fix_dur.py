from pathlib import Path
replacements = [
  ("spotsOn: 3.09,", "spotsOn: 3.23,"),
  ("spots: 2.73,", "spots: 2.89,"),
  ("spotsHold: 5.81,", "spotsHold: 5.71,"),
  ("spotsOff: 2.97,", "spotsOff: 3.02,"),
]
for path in [
  Path("desktop/renderer/window-play.js"),
  Path("web/src/lib/pets/window-play.ts"),
]:
  t = path.read_text(encoding="utf-8")
  for a,b in replacements:
    if a not in t:
      raise SystemExit(f"missing {a!r} in {path}")
    t = t.replace(a, b, 1)
  path.write_text(t, encoding="utf-8")
  print("fixed", path)
