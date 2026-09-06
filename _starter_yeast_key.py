from pathlib import Path
import json, re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# show yeast lines in playFor
for m in re.finditer(r'.{0,40}yeast.{0,60}', js):
    print(repr(m.group(0)))
# quick node check
roster = json.loads(Path("desktop/renderer/roster.json").read_text(encoding="utf-8"))
for p in roster:
    if "yeast" in str(p).lower() or (isinstance(p, dict) and p.get("name")=="Starter"):
        print("roster", p)
