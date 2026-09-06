from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# extract DUR right* keys
import re
for m in re.finditer(r"right\w*:\s*[\d.]+", js):
    print("DUR", m.group(0))
# header comment line 1
print("HDR", js.splitlines()[0][:300])
# rightPoint through rightOffPath
start = js.index("function rightPoint")
# find next function after rightOffPath
end = js.index("\n  function ", start + 10)
# find a few after
chunk = js[start:start+3500]
print("---FNS---")
print(chunk[:3000])
