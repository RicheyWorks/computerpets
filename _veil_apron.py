from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["function vaultPoint", "function wartsPoint", "function cloudPoint", "function greenPoint", "function blotterPoint", "function loopPoint"]:
    i = js.find(name)
    print("===", name, i, "===")
    if i>=0:
        print(js[i:i+450])
        print()
# size gates for CAP/PUFF/VAULT
import re
for m in re.finditer(r"if \(kind === (CAP|PUFF|VAULT|WARTS|CLOUD|LOOP|GREEN)\) return[^\n]+", js):
    print(m.group(0))
