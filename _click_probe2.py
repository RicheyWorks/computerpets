from pathlib import Path
import re
t = Path("web/src/lib/pets/meadow.ts").read_text(encoding="utf-8")
keys = re.findall(r'key:\s*"([a-z_]+)"', t)
names = re.findall(r'name:\s*"([^"]+)"', t)
print("meadow order:")
for i,(k,n) in enumerate(zip(keys, names),1):
    print(f"  {i}. {n} ({k})")
# also playFor sill guests still remaining
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find which meadow keys still fall through to SILL
play_keys = set(re.findall(r'if \(key === "([a-z_]+)"\) return', js))
print("\nmeadow keys still generic sill (not in playFor explicit):")
for k,n in zip(keys, names):
    if k not in play_keys:
        print(f"  {n} ({k}) -> SILL")
    else:
        # find what they return
        m = re.search(rf'if \(key === "{k}"\) return ([A-Z_]+);', js)
        print(f"  {n} ({k}) -> {m.group(1) if m else '?'}")
