from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
m = re.search(r"function playFor\([\s\S]*?\n\}", js)
body = m.group(0) if m else ""
pairs = re.findall(r'["\'](\w+)["\']\s*:\s*["\'](\w+)["\']', body)
vals = sorted(set(v for _, v in pairs))
print("playFor pairs", len(pairs))
print("unique kinds", len(vals))
Path("_all_kinds.txt").write_text("\n".join(vals), encoding="utf-8")
print("wrote _all_kinds.txt")
# choir and photovore lines
for key in ("choir", "photovore", "lichen", "nimbus"):
    for line in body.splitlines():
        if f'"{key}"' in line or f"'{key}'" in line:
            print("MAP", line.strip())
# thirst / gleam handlers presence
for token in ("thirst", "gleam", "plaque", "photovore", "choir"):
    print(token, "count", js.count(token))
