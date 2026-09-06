import re
from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
kinds = sorted(set(re.findall(r"kind:\s*'([a-z_]+)'", js)))
print("kinds", len(kinds))
print("\n".join(kinds))
print("---yeast---", "yeast" in js)
print("---chicken---", js.find("chicken_of_woods"))
Path("_kinds_unique.txt").write_text("\n".join(kinds), encoding="utf-8")
