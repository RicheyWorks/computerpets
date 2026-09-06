from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("blackOffPath,\n    netPoint")
print("export net block", js[i:i+200] if i>=0 else "MISSING EXPORT")
i = js.find("TAILS,\n    BLACK,\n    NET,\n    IGNORE")
print("NET const export", "yes" if i>=0 else "no")
# weekPath exported?
i = js.rfind("weekPath")
print("last weekPath", js[i-30:i+40])
