from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# header first lines
print("HEADER:")
print(js[:1200])
print("---DUR---")
i = js.find("const DUR")
print(js[i:i+2200])
