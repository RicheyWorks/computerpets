from pathlib import Path
js=Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
end=js.find("*/")
print(repr(js[end-200:end+2]))
ts=Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
end=ts.find("*/")
print("TS", repr(ts[end-220:end+2]))
