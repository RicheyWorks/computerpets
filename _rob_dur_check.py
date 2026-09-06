from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for k in ["huntOn","hawkOn","sipOn","forageOn","huntPath","function huntPath","soarOn"]:
    print(k, k in js)
# DUR hunt keys
import re
for m in re.finditer(r"hunt\w*:\s*[\d.]+", js):
    print(m.group(0))
for m in re.finditer(r"hawk\w*:\s*[\d.]+", js):
    print(m.group(0))
for m in re.finditer(r"sip\w*:\s*[\d.]+", js):
    print(m.group(0))
for m in re.finditer(r"forage\w*:\s*[\d.]+", js):
    print(m.group(0))
