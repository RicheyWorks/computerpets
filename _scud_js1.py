from pathlib import Path

def load(p):
    b = Path(p).read_bytes()
    crlf = b"\r\n" in b
    t = b.decode("utf-8").replace("\r\n", "\n")
    return t, crlf

def save(p, t, crlf):
    if crlf:
        t = t.replace("\n", "\r\n")
    Path(p).write_bytes(t.encode("utf-8"))

def once(t, old, new, label):
    n = t.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}\nOLD[:160]={old[:160]!r}")
    return t.replace(old, new, 1)

HEADER_OLD = "Thread thrashes a glazing rebate as a soil film: walk into the rebate, thrash the round, then leave. Wick still owns thread. Half still owns split. Tun still owns dry. This is the ninth log leftover."
HEADER_ADD = " Scud sides a window well as a side pool: walk into the well, swim the side, then leave. Thread still owns thrash. Armor still owns roll. Silver still owns go. This closes log ten."

# ---- JS ----
js, crlf = load("desktop/renderer/window-play.js")
js = once(js, HEADER_OLD, HEADER_OLD + HEADER_ADD, "js header")
js = once(js, '  const THRASH = "thrash";\n  const SILL = "sill";', '  const THRASH = "thrash";\n  const SIDE = "side";\n  const SILL = "sill";', "js SIDE const")
js = once(
    js,
    "    thrashOn: 2.31,\n    thrash: 1.21,\n    thrashHold: 2.59,\n    thrashOff: 1.63,\n    sillHop: 0.38,",
    "    thrashOn: 2.31,\n    thrash: 1.21,\n    thrashHold: 2.59,\n    thrashOff: 1.63,\n    sideOn: 2.38,\n    side: 1.27,\n    sideHold: 2.67,\n    sideOff: 1.67,\n    sillHop: 0.38,",
    "js DUR",
)
js = once(js, '    if (key === "nematode") return THRASH;', '    if (key === "nematode") return THRASH;\n    if (key === "amphipod") return SIDE;', "js playFor")
js = once(js, "    if (kind === THRASH) return w.width >= 192 && w.height >= 198;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === THRASH) return w.width >= 192 && w.height >= 198;\n    if (kind === SIDE) return w.width >= 178 && w.height >= 162;\n    return w.width >= 180 && w.height >= 70;", "js size")
js = once(
    js,
    '''        leave: "round",
        spin: "none",
      };
    }

        if (kind === WRAP) {''',
    '''        leave: "round",
        spin: "none",
      };
    }

    if (kind === SIDE) {
      const hold = sidePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -72 : 72;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 65 : -65;
      return {
        id: best.id,
        kind,
        side: "sidepool",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "sides",
        spin: "none",
      };
    }

        if (kind === WRAP) {''',
    "js pick",
)
js = once(
    js,
    '''    if (target.kind === THRASH) {
      const hold = thrashPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
    '''    if (target.kind === THRASH) {
      const hold = thrashPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === SIDE) {
      const hold = sidePoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === BURY) {''',
    "js refit",
)
js = once(
    js,
    '''        if (target.kind === THRASH) {
          return goPhase(next, "thrash-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
    '''        if (target.kind === THRASH) {
          return goPhase(next, "thrash-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === SIDE) {
          return goPhase(next, "side-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === WRAP) {''',
    "js approach",
)
print("js mid ok")
save("desktop/renderer/window-play.js", js, crlf)
print("js saved mid")
