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

cjs, nl = load("desktop/renderer/window-play.test.cjs")
old = (
    '  const augerOk = P.pickTarget([{ id: "bore", x: 200, y: 80, width: 160, height: 180 }], 80, "carpenter_bee", WORK, P.SPRITE);\n'
    '  assert.ok(augerOk, "Auger still takes a timber stile");\n'
    '  const columnNo = P.pickTarget([{ id: "bore", x: 200, y: 80, width: 160, height: 180 }], 80, "carpenter_ant", WORK, P.SPRITE);\n'
    '  assert.equal(columnNo, null, "Column needs a taller stile gallery, not Auger\'s bore gate");'
)
new = (
    '  const augerNo = P.pickTarget([{ id: "gallery", x: 200, y: 80, width: 188, height: 200 }], 80, "carpenter_bee", WORK, P.SPRITE);\n'
    '  assert.equal(augerNo, null, "Auger needs a taller bore stile, not Column\'s gallery gate");\n'
    '  const augerOk = P.pickTarget([{ id: "bore", x: 200, y: 80, width: 188, height: 208 }], 80, "carpenter_bee", WORK, P.SPRITE);\n'
    '  assert.ok(augerOk, "Auger still takes a timber stile");'
)
if old not in cjs:
    raise SystemExit("missing old block")
cjs = cjs.replace(old, new, 1)
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("fixed cjs")
