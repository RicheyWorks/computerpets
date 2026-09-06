from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
m = re.search(r"function playFor\(key\) \{([\s\S]*?)\n  \}", js)
body = m.group(1)
keys = set(re.findall(r'key === "([^"]+)"', body))
print("playFor keys", len(keys))
for p in Path(".").rglob("*"):
    if p.is_file() and "catalog" in p.name.lower() and p.suffix in {".js",".ts",".json",".cjs",".mjs"}:
        print("catalog-ish", p)
