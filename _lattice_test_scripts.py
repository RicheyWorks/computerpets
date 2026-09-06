from pathlib import Path
import json
for p in ["package.json","desktop/package.json","web/package.json"]:
    t = Path(p).read_text(encoding="utf-8")
    if "window-play" in t or "leftover-house" in t:
        print("===", p, "===")
        for line in t.splitlines():
            if "window-play" in line or "leftover" in line or "test" in line.lower():
                print(line[:200])
