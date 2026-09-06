from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# extract playFor body
m = re.search(r"function playFor\(key\) \{([\s\S]*?)\n  \}", js)
body = m.group(1)
mapped = dict(re.findall(r'if \(key === "([^"]+)"\) return ([A-Z_]+);', body))
print("mapped count", len(mapped))
# far.ts guests
far = Path("web/src/lib/pets/far.ts").read_text(encoding="utf-8")
# keys in far
keys = re.findall(r'key:\s*"([^"]+)"', far)
names = re.findall(r'name:\s*"([^"]+)"', far)
slugs = re.findall(r'slug:\s*"([^"]+)"', far)
print("far guests", list(zip(names, keys, slugs)))
for name,key,slug in zip(names, keys, slugs):
    kind = mapped.get(key, "SILL?")
    print(f"  {name}/{key}/{slug} -> {kind}")
# also find terminator in whole pets
for p in Path("web/src/lib/pets").glob("*.ts"):
    t = p.read_text(encoding="utf-8")
    if "terminator" in t or "Dusk" in t or 'key: "terminator"' in t or "dusk" in t.lower():
        if "terminator" in t or "dusk" in t.lower():
            for line in t.splitlines():
                if any(x in line.lower() for x in ["terminator", "dusk", 'key:', 'name:', 'slug:']):
                    if "terminator" in line or "Dusk" in line or "dusk" in line or "key:" in line or "name:" in line:
                        print(p.name, line.strip()[:120])
