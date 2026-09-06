from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
m = re.search(r"function playFor\(key\) \{([\s\S]*?)\n  \}", js)
keys = set(re.findall(r'key === "([^"]+)"', m.group(1)))
cat = Path("web/src/lib/pets/catalog.ts").read_text(encoding="utf-8")
# try to find id/key fields
ids = re.findall(r'\bid:\s*"([^"]+)"', cat)
if not ids:
    ids = re.findall(r'key:\s*"([^"]+)"', cat)
if not ids:
    ids = re.findall(r'slug:\s*"([^"]+)"', cat)
print("catalog id count", len(ids), "unique", len(set(ids)))
# show a sample of catalog structure
print(cat[:800])
print("--- missing from playFor ---")
missing = [i for i in ids if i not in keys]
print(len(missing))
for i in missing[:50]:
    print(i)
