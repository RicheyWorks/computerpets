from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
i = js.find("function shouldAbort")
print(js[i:i+1500])
