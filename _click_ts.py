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

def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit("MISSING: " + label)
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

HEADER = (
    "Snout drills a window stool as an acorn cup: walk onto the stool, sit, drill once, sit the cup, then leave. "
    "Forceps still owns cerci. Mast still owns seed. Auger still owns bore. Dee still owns cache. Cup still owns lid. "
    "This is the eighth leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den."
)

RIGHT_FNS = """
export function rightPoint(win: DeskWindow, sprite: number | undefined, work: WorkArea) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 32;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.66;
  const plate = Math.max(18, size * 0.12);
  const gripY = win.y + win.height - plate;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 16, maxLift) };
}

export function rightFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function rightOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.68) * 1.04;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 1.76 * (1 - ease) + stride * 0.07,
  };
}

export function rightPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.16) {
    const s = t / 0.16;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.05, lift: ease * 0.22, rot: ease * 152 };
  }
  if (t < 0.4) {
    const s = (t - 0.16) / 0.24;
    const pop = Math.sin(s * Math.PI);
    return { x: 0.05 + pop * 0.12, lift: 0.22 + pop * 14.8, rot: 152 - s * 170 };
  }
  if (t < 0.72) {
    const s = (t - 0.4) / 0.32;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.17 - ease * 0.07, lift: 15.02 - ease * 14.42, rot: -18 + ease * 15.2 };
  }
  return { x: 0.1, lift: 0.6, rot: -2.8 };
}

export function rightHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.07;
  return { x: 0.1, lift: 0.6 + hush, rot: -2.8 };
}

export function rightOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.52) * 1.06;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -2.8) * (1 - ease),
  };
}

"""

RIGHT_PHASES = """
  if (next.phase === "right-on") {
    const face = rightFace(target);
    const u = next.t / DUR.rightOn;
    const pose = rightOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "right", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "right") {
    const face = rightFace(target);
    const pose = rightPath(Math.min(1, next.t / DUR.right));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.right) {
      return goPhase(next, "right-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "right-hold") {
    const face = rightFace(target);
    const pose = rightHoldPath(Math.min(1, next.t / DUR.rightHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.rightHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = rightHoldPath(1);
      return goPhase(next, "right-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "right-off") {
    const u = next.t / DUR.rightOff;
    const pose = rightOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

"""

ts, nl = load("web/src/lib/pets/window-play.ts")
ts = must_replace(ts, HEADER, HEADER_NEW, "ts header")
ts = must_replace(ts, 'export const DRILL = "drill";\nexport const SILL = "sill";', 'export const DRILL = "drill";\nexport const RIGHT = "right";\nexport const SILL = "sill";', "ts RIGHT const")
ts = must_replace(ts, "  drillOff: 2.58,\n  sillHop: 0.38,", "  drillOff: 2.58,\n  rightOn: 2.64,\n  right: 1.92,\n  rightHold: 4.16,\n  rightOff: 2.56,\n  sillHop: 0.38,", "ts DUR")
ts = must_replace(ts, '  if (key === "acorn_weevil") return DRILL;\n  return SILL;', '  if (key === "acorn_weevil") return DRILL;\n  if (key === "click_beetle") return RIGHT;\n  return SILL;', "ts playFor")
ts = must_replace(ts, "    if (kind === DRILL) return w.width >= 186 && w.height >= 150;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === DRILL) return w.width >= 186 && w.height >= 150;\n    if (kind === RIGHT) return w.width >= 184 && w.height >= 152;\n    return w.width >= 180 && w.height >= 70;", "ts size gate")
ts = must_replace(ts, "typeof JUMP | typeof TAILS | typeof BLACK | typeof NET | typeof CERCI | typeof DRILL | typeof SILL | typeof IGNORE;", "typeof JUMP | typeof TAILS | typeof BLACK | typeof NET | typeof CERCI | typeof DRILL | typeof RIGHT | typeof SILL | typeof IGNORE;", "ts kind union")
ts = must_replace(ts, '| "drill-off"\n', '| "drill-off"\n  | "right-on"\n  | "right"\n  | "right-hold"\n  | "right-off"\n', "ts phases")

PICK_OLD = """  if (kind === DRILL) {
    const hold = drillPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -34 : 34;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 28 : -28;
    return {
      id: best.id,
      kind,
      side: "acorncup",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "drilled",
      spin: "none",
    };
  }
"""
PICK_NEW = PICK_OLD + """
  if (kind === RIGHT) {
    const hold = rightPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -32 : 32;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 26 : -26;
    return {
      id: best.id,
      kind,
      side: "barkplate",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "righted",
      spin: "none",
    };
  }
"""
ts = must_replace(ts, PICK_OLD, PICK_NEW, "ts pick RIGHT")

REFIT_OLD = """  if (target.kind === DRILL) {
    const hold = drillPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
REFIT_NEW = """  if (target.kind === DRILL) {
    const hold = drillPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === RIGHT) {
    const hold = rightPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
ts = must_replace(ts, REFIT_OLD, REFIT_NEW, "ts refit RIGHT")

GO_OLD = """      if (target.kind === DRILL) {
        return goPhase(next, "drill-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
GO_NEW = """      if (target.kind === DRILL) {
        return goPhase(next, "drill-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === RIGHT) {
        return goPhase(next, "right-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
ts = must_replace(ts, GO_OLD, GO_NEW, "ts goPhase RIGHT")

idx = ts.find("export function beginPlay(")
if idx < 0:
    raise SystemExit("no beginPlay")
ts = ts[:idx] + RIGHT_FNS + ts[idx:]

phase_marker = '  if (next.phase === "sill-hop") {'
if ts.count(phase_marker) != 1:
    raise SystemExit("sill-hop count %s" % ts.count(phase_marker))
ts = ts.replace(phase_marker, RIGHT_PHASES + phase_marker, 1)

save("web/src/lib/pets/window-play.ts", ts, nl)
print("ok ts")
