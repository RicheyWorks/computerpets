from pathlib import Path
import re
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["rightPoint","drillPoint","cerciPoint","songPoint","chirpPoint","netPoint","tailsPoint","huntPoint","hawkPoint"]:
    i = js.find(f"function {name}")
    if i < 0:
        print(name, "MISSING")
        continue
    print("====", name, "====")
    print(js[i:i+500])
