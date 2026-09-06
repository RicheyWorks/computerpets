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

shelf_pick = """    if (kind === SHELF) {
      const hold = shelfPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -28 : 28;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 32 : -32;
      return {
        id: best.id,
        kind,
        side: "timbershelf",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "shelved",
        spin: "none",
      };
    }"""

warts_pick = shelf_pick + """

    if (kind === WARTS) {
      const hold = wartsPoint(best, size, work);
      const approachOff = hold.x < workW / 2 ? -30 : 30;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 30 : -30;
      return {
        id: best.id,
        kind,
        side: "mosscup",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "warted",
        spin: "none",
      };
    }"""
text = mr(text, shelf_pick, warts_pick, "pick")

shelf_refit = """    if (target.kind === SHELF) {
      const hold = shelfPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }"""
warts_refit = shelf_refit + """

    if (target.kind === WARTS) {
      const hold = wartsPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }"""
text = mr(text, shelf_refit, warts_refit, "refit")

warts = Path("_cap_warts_fns.js").read_text(encoding="utf-8")
if not warts.endswith("\n"):
    warts += "\n"
text = mr(
    text,
    "  function beginPlay(target, petX) {",
    "\n" + warts + "  function beginPlay(target, petX) {",
    "fns",
)

save("desktop/renderer/window-play.js", text, nl)
print("ok pick refit fns")
