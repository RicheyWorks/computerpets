from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
# find shouldAbort and rays mentions
i = js.find("function shouldAbort")
print(js[i:i+2500])
