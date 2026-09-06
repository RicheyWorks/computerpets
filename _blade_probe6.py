from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find exports object
i = js.find("module.exports")
if i < 0:
    i = js.find("return {")
# look for export list near SONG LEAF
idx = js.find("    SONG,\n    LEAF,\n    IGNORE,")
print("export idx", idx)
print(repr(js[idx-200:idx+300]))
# also search CHIRP, in export list
import re
m = re.search(r"CHIRP,\n", js)
print("CHIRP comma export", bool(m), m.start() if m else None)
# node check
