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
    "Banner tails a window stool as a blossom dish: walk onto the stool, sit, banner once, sit the dish, then leave. "
    "Vault still owns jump. Blade still owns leaf. Chirp still owns song. Milk still owns weed. Ghost still owns week. "
    "This is the fourth leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Jewel blacks a glass rim as a stream jewel: walk onto the rim, sit, jewel once, sit the jewel, then leave. "
    "Banner still owns tails. Dart still owns hawk. Bat still owns fold. Vault still owns jump. Blade still owns leaf. "
    "This is the fifth leftover of the meadow den."
)

BLACK_FNS = """
export function blackPoint(win: DeskWindow, sprite: number | undefined, work: WorkArea) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 30;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.36;
  const rim = Math.max(48, size * 0.28);
  const gripY = win.y + rim;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 34, maxLift - 8) };
}

export function blackFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function blackOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.76) * 1.08;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 1.84 * (1 - ease) + stride * 0.08,
  };
}

export function blackPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.18) {
    const s = t / 0.18;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.08, lift: ease * 0.42, rot: ease * -2.4 };
  }
  if (t < 0.54) {
    const s = (t - 0.18) / 0.36;
    const jewel = Math.sin(s * Math.PI);
    return { x: 0.08 + jewel * 0.95, lift: 0.42 + jewel * 3.2, rot: -2.4 + jewel * 9.6 };
  }
  if (t < 0.80) {
    const s = (t - 0.54) / 0.26;
    const ease = s * s * (3 - 2 * s);
    return { x: 1.03 - ease * 0.78, lift: 3.62 - ease * 3.05, rot: 7.2 - ease * 9.9 };
  }
  return { x: 0.25, lift: 0.57, rot: -2.7 };
}

export function blackHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const jewel = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.09;
  return { x: 0.25, lift: 0.57 + jewel, rot: -2.7 };
}

export function blackOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.58) * 1.14;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -2.7) * (1 - ease),
  };
}

"""

BLACK_PHASES = """
  if (next.phase === "black-on") {
    const face = blackFace(target);
    const u = next.t / DUR.blackOn;
    const pose = blackOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "black", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "black") {
    const face = blackFace(target);
    const pose = blackPath(Math.min(1, next.t / DUR.black));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.black) {
      return goPhase(next, "black-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "black-hold") {
    const face = blackFace(target);
    const pose = blackHoldPath(Math.min(1, next.t / DUR.blackHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.blackHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = blackHoldPath(1);
      return goPhase(next, "black-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "black-off") {
    const u = next.t / DUR.blackOff;
    const pose = blackOffPath(Math.min(1, u), next.from, next.to);
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
ts = must_replace(ts, 'export const TAILS = "tails";\nexport const SILL = "sill";', 'export const TAILS = "tails";\nexport const BLACK = "black";\nexport const SILL = "sill";', "ts BLACK const")
ts = must_replace(ts, "  tailsOff: 2.34,\n  sillHop: 0.38,", "  tailsOff: 2.34,\n  blackOn: 2.72,\n  black: 2.42,\n  blackHold: 3.66,\n  blackOff: 2.38,\n  sillHop: 0.38,", "ts DUR")
ts = must_replace(ts, '  if (key === "swallowtail") return TAILS;\n  return SILL;', '  if (key === "swallowtail") return TAILS;\n  if (key === "jewelwing") return BLACK;\n  return SILL;', "ts playFor")
ts = must_replace(ts, "    if (kind === TAILS) return w.width >= 186 && w.height >= 150;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === TAILS) return w.width >= 186 && w.height >= 150;\n    if (kind === BLACK) return w.width >= 184 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;", "ts size gate")
ts = must_replace(ts, "typeof JUMP | typeof TAILS | typeof SILL | typeof IGNORE;", "typeof JUMP | typeof TAILS | typeof BLACK | typeof SILL | typeof IGNORE;", "ts kind union")
ts = must_replace(ts, '| "tails-off"\n', '| "tails-off"\n  | "black-on"\n  | "black"\n  | "black-hold"\n  | "black-off"\n', "ts phases")

PICK_OLD = """  if (kind === TAILS) {
    const hold = tailsPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -42 : 42;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 36 : -36;
    return {
      id: best.id,
      kind,
      side: "blossomdish",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "bannered",
      spin: "none",
    };
  }
"""
PICK_NEW = PICK_OLD + """
  if (kind === BLACK) {
    const hold = blackPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -40 : 40;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 34 : -34;
    return {
      id: best.id,
      kind,
      side: "streamjewel",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "jewelled",
      spin: "none",
    };
  }
"""
ts = must_replace(ts, PICK_OLD, PICK_NEW, "ts pick BLACK")

REFIT_OLD = """  if (target.kind === TAILS) {
    const hold = tailsPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
REFIT_NEW = """  if (target.kind === TAILS) {
    const hold = tailsPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BLACK) {
    const hold = blackPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
ts = must_replace(ts, REFIT_OLD, REFIT_NEW, "ts refit BLACK")

GO_OLD = """      if (target.kind === TAILS) {
        return goPhase(next, "tails-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
GO_NEW = """      if (target.kind === TAILS) {
        return goPhase(next, "tails-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === BLACK) {
        return goPhase(next, "black-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
ts = must_replace(ts, GO_OLD, GO_NEW, "ts goPhase BLACK")

idx = ts.find("export function beginPlay")
if idx < 0:
    raise SystemExit("no beginPlay")
line_start = ts.rfind("\n", 0, idx) + 1
ts = ts[:line_start] + BLACK_FNS + ts[line_start:]

phase_marker = '  if (next.phase === "sill-hop") {'
if ts.count(phase_marker) != 1:
    raise SystemExit("ts sill-hop count %s" % ts.count(phase_marker))
ts = ts.replace(phase_marker, BLACK_PHASES + phase_marker, 1)

if '| "blossomdish"' in ts:
    ts = must_replace(ts, '| "blossomdish"', '| "blossomdish"\n  | "streamjewel"', "ts side streamjewel")
if '| "bannered"' in ts:
    ts = must_replace(ts, '| "bannered"', '| "bannered"\n  | "jewelled"', "ts leave jewelled")

save("web/src/lib/pets/window-play.ts", ts, nl)
print("ok ts")
