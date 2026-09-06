from pathlib import Path

def patch(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    old = "P.kindlePath(0.5)"
    n = text.count(old)
    if n < 1:
        raise SystemExit("no kindlePath in " + p)
    text = text.replace(old, "P.kindleCoalPath(0.5)")
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))
    print(p, n)

patch("desktop/renderer/window-play.test.cjs")
patch("web/scripts/window-play.test.mjs")
