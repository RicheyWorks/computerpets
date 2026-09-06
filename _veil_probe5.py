from pathlib import Path
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print("JS finsPoint", "finsPoint" in js, "Next", js[js.find("Next leftover"):js.find("Next leftover")+40])
print("TS finsPoint", "finsPoint" in ts, "Next", ts[ts.find("Next leftover"):ts.find("Next leftover")+40])
print("salvage exists", Path("_veil_fins_salvage.js").exists(), Path("_veil_fins_salvage.js").stat().st_size if Path("_veil_fins_salvage.js").exists() else 0)
