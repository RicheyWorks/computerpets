from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
for src,label in [(js,"js"),(ts,"ts")]:
  m = re.search(r"leafOn: [\d.]+,\n\s*leaf: ([\d.]+)", src)
  print(label, "leaf", m.group(1) if m else "?")
  m = re.search(r"tailsOn: ([\d.]+),\n\s*tails: ([\d.]+),\n\s*tailsHold: ([\d.]+),\n\s*tailsOff: ([\d.]+)", src)
  print(label, "tails", m.groups() if m else "?")
