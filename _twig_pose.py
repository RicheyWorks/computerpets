from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
for name in ["creepPath", "reachPath", "stiltPath", "foldPath"]:
    i = js.find(f"function {name}(")
    print("====", name)
    print(js[i:i+700])
