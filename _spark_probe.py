from pathlib import Path
t = Path("desktop/renderer/window-play.js").read_bytes()
print(b"\\r\\n" in t, t.find(b"const WEEK"))
i = t.find(b"const WEEK = ")
print(repr(t[i:i+80]))
