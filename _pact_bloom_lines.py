import pathlib, re
js = pathlib.Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
lines = js.splitlines()
for i,l in enumerate(lines):
    if "BLOOM" in l or "yeast" in l:
        print(f"{i+1}:{l}")
