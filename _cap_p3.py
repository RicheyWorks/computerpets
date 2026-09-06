# -*- coding: utf-8 -*-
from pathlib import Path

def load(p):
    raw = Path(p).read_bytes()
    nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text[1:]
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text, nl

def save(p, text, nl):
    if nl != "\n":
        text = text.replace("\n", nl)
    Path(p).write_bytes(text.encode("utf-8"))

def mr(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit("%s count=%s" % (label, n))
    return text.replace(old, new, 1)

text, nl = load("desktop/renderer/window-play.js")

shelf_approach = """        if (target.kind === SHELF) {
          return goPhase(next, "shelf-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }"""
warts_approach = shelf_approach + """

        if (target.kind === WARTS) {
          return goPhase(next, "warts-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }"""
text = mr(text, shelf_approach, warts_approach, "approach")

text = mr(text, "    SHELF,\n    IGNORE,", "    SHELF,\n    WARTS,\n    IGNORE,", "export const")
text = mr(
    text,
    "    shelfPoint,\n    shelfFace,\n    shelfOnPath,\n    shelfPath,\n    shelfHoldPath,\n    shelfOffPath,\n    pickTarget,",
    "    shelfPoint,\n    shelfFace,\n    shelfOnPath,\n    shelfPath,\n    shelfHoldPath,\n    shelfOffPath,\n    wartsPoint,\n    wartsFace,\n    wartsOnPath,\n    wartsPath,\n    wartsHoldPath,\n    wartsOffPath,\n    pickTarget,",
    "export fns",
)

save("desktop/renderer/window-play.js", text, nl)
print("ok approach exports")
