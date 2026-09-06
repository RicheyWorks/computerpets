from pathlib import Path

def fix(path):
    raw = Path(path).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    old = 'return goPhase(next, "jump", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);'
    new = 'return goPhase(next, "jump", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);'
    n = text.count(old)
    print(path, "count", n)
    if n < 1:
        raise SystemExit("missing")
    text = text.replace(old, new)
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(path).write_bytes(text.encode("utf-8"))

fix("desktop/renderer/window-play.js")
fix("web/src/lib/pets/window-play.ts")
print("done")
