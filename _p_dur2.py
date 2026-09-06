from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i=js.find("facetOn:")
print(repr(js[i:i+80]))
i2=js.find("floatOff:")
print("around floatOff", repr(js[i2:i2+120]))
