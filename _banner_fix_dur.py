from pathlib import Path

def patch(p, old, new):
    raw = Path(p).read_bytes()
    nl = b"\r\n" if b"\r\n" in raw else b"\n"
    text = raw.decode("utf-8").replace("\r\n","\n").replace("\r","\n")
    if text.startswith("\ufeff"): text = text[1:]
    if old not in text:
        raise SystemExit("missing in "+p)
    text = text.replace(old, new, 1)
    if nl == b"\r\n": text = text.replace("\n","\r\n")
    Path(p).write_bytes(text.encode("utf-8"))
    print("ok", p)

old = "tailsOn: 2.66,\n    tails: 2.28,\n    tailsHold: 3.58,\n    tailsOff: 2.34,"
new = "tailsOn: 2.66,\n    tails: 2.36,\n    tailsHold: 3.58,\n    tailsOff: 2.34,"
patch("desktop/renderer/window-play.js", old, new)
old2 = "tailsOn: 2.66,\n  tails: 2.28,\n  tailsHold: 3.58,\n  tailsOff: 2.34,"
new2 = "tailsOn: 2.66,\n  tails: 2.36,\n  tailsHold: 3.58,\n  tailsOff: 2.34,"
patch("web/src/lib/pets/window-play.ts", old2, new2)
