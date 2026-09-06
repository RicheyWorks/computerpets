from pathlib import Path
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
print(ts[51300:54500])
