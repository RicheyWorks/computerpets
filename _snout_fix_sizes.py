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

for path in ["desktop/renderer/window-play.test.cjs", "_snout_cjs_tests.txt"]:
    t, nl = load(path)
    old = 'const seedOk = P.pickTarget([{ id: "seed", x: 200, y: 80, width: 200, height: 120 }], 80, "oak", WORK, P.SPRITE);'
    new = 'const seedOk = P.pickTarget([{ id: "seed", x: 200, y: 80, width: 198, height: 172 }], 80, "oak", WORK, P.SPRITE);'
    if old not in t:
        print("MISSING seedOk", path)
    else:
        t = t.replace(old, new, 1)
        print("fixed seedOk", path)
    old2 = 'const boreOk = P.pickTarget([{ id: "bore", x: 200, y: 80, width: 200, height: 160 }], 80, "carpenter_bee", WORK, P.SPRITE);'
    new2 = 'const boreOk = P.pickTarget([{ id: "bore", x: 200, y: 80, width: 188, height: 208 }], 80, "carpenter_bee", WORK, P.SPRITE);'
    if old2 not in t:
        print("MISSING boreOk", path)
    else:
        t = t.replace(old2, new2, 1)
        print("fixed boreOk", path)
    save(path, t, nl)
