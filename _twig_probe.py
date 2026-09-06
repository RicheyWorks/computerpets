from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
needles = [
  "function creepPoint",
  "function reachPoint",
  "function stiltPoint",
  "function hitchPoint",
  "function seedPoint",
  "function foldPoint",
  "function hawkPoint",
  "Spark the firefly",
  "Dart hawks",
  'if (key === "darner")',
  "const HAWK",
  "const SILL",
]
for n in needles:
    idx = js.find(n)
    if idx < 0:
        print("MISS", n)
        continue
    line = js.count("\n", 0, idx) + 1
    print(f"{line}:{n}")
    print(js[idx:idx+520])
    print("====")
