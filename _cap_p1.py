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
text = mr(
    text,
    '  const SHELF = "shelf";\n  const SILL = "sill";',
    '  const SHELF = "shelf";\n  const WARTS = "warts";\n  const SILL = "sill";',
    "const",
)
text = mr(
    text,
    "    shelfOn: 2.72,\n    shelf: 2.05,\n    shelfHold: 4.35,\n    shelfOff: 2.62,",
    "    shelfOn: 2.72,\n    shelf: 2.05,\n    shelfHold: 4.35,\n    shelfOff: 2.62,\n    wartsOn: 2.64,\n    warts: 1.88,\n    wartsHold: 4.18,\n    wartsOff: 2.55,",
    "dur",
)
text = mr(
    text,
    '    if (key === "oyster") return SHELF;\n    return SILL;',
    '    if (key === "oyster") return SHELF;\n    if (key === "fly_agaric") return WARTS;\n    return SILL;',
    "playFor",
)
text = mr(
    text,
    "    if (kind === SHELF) return w.width >= 188 && w.height >= 204;",
    "    if (kind === SHELF) return w.width >= 188 && w.height >= 204;\n    if (kind === WARTS) return w.width >= 186 && w.height >= 148;",
    "gate",
)
save("desktop/renderer/window-play.js", text, nl)
print("ok small patches")
