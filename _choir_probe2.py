from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# constants like const THIRST = "thirst"
consts = re.findall(r'const\s+([A-Z_]+)\s*=\s*["\'](\w+)["\']', js)
print("KIND consts:")
for a,b in consts:
    if a.isupper():
        print(f"  {a} = {b}")
# playFor function
m = re.search(r"function playFor\([\s\S]*?\n\}", js)
print("\nplayFor:\n", m.group(0)[:3000] if m else "NONE")
print("---TAIL---")
print(m.group(0)[-1500:] if m else "")
