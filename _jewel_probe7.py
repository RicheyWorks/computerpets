from pathlib import Path
import re
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# check raspPoint export
print("raspPoint in exports", "raspPoint," in js or "raspPoint\n" in js)
# find module.exports / return block near end
m=re.search(r"raspPoint", js)
print("raspPoint count", js.count("raspPoint"))
# look at export list snippet
idx=js.find("tailsOffPath")
print(js[idx:idx+400])
# check if WHORL / RASP kind
print("RASP const", 'RASP = "rasp"' in js or 'const RASP' in js)
