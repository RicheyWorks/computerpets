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
old = 'const clawOk = P.pickTarget([{ id: "claw", x: 200, y: 80, width: 200, height: 120 }], 80, "crayfish", WORK, P.SPRITE);'
new = 'const clawOk = P.pickTarget([{ id: "claw", x: 200, y: 80, width: 188, height: 172 }], 80, "crayfish", WORK, P.SPRITE);'
if old not in cjs:
    raise SystemExit("MISSING clawOk")
cjs = cjs.replace(old, new, 1)
save("desktop/renderer/window-play.test.cjs", cjs, nl)
print("fixed clawOk")

# also verify CERCI const
js = Path("desktop/renderer/window-play.js").read_text(encoding="utf-8")
assert 'const CERCI = "cerci";' in js
assert 'export const CERCI' not in js  # cjs style
ts = Path("web/src/lib/pets/window-play.ts").read_text(encoding="utf-8")
assert 'export const CERCI = "cerci";' in ts
print("consts ok")
