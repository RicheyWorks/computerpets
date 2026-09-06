from pathlib import Path
b = Path("desktop/renderer/window-play.js").read_bytes()
print("crlf", b.count(b"\r\n"), "lf", b.count(b"\n"))
