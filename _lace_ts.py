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
    "Jewel blacks a glass rim as a stream jewel: walk onto the rim, sit, jewel once, sit the jewel, then leave. "
    "Banner still owns tails. Dart still owns hawk. Bat still owns fold. Vault still owns jump. Blade still owns leaf. "
    "This is the fifth leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Lace nets a window stool as a leaf dish: walk onto the stool, sit, lace once, sit the dish, then leave. "
    "Jewel still owns black. Banner still owns tails. Ghost still owns week. Moth still owns mount. Seven still owns spot. "
    "This is the sixth leftover of the meadow den."
)

NET_FNS = """
export function netPoint(win: DeskWindow, sprite: number | undefined, work: WorkArea) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 32;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.28;
  const dish = Math.max(16, size * 0.10);
  const gripY = win.y + win.height - dish;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 14, maxLift) };
}

export function netFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function netOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.68) * 1.02;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 1.62 * (1 - ease) + stride * 0.07,
  };
}

export function netPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.16) {
    const s = t / 0.16;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.06, lift: ease * 0.38, rot: ease * -1.8 };
  }
  if (t < 0.52) {
    const s = (t - 0.16) / 0.36;
    const lace = Math.sin(s * Math.PI);
    return { x: 0.06 + lace * 0.72, lift: 0.38 + lace * 2.35, rot: -1.8 + lace * 7.1 };
  }
  if (t < 0.78) {
    const s = (t - 0.52) / 0.26;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.78 - ease * 0.60, lift: 2.73 - ease * 2.25, rot: 5.3 - ease * 7.4 };
  }
  return { x: 0.18, lift: 0.48, rot: -2.1 };
}

export function netHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const lace = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.08;
  return { x: 0.18, lift: 0.48 + lace, rot: -2.1 };
}

export function netOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.52) * 1.08;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -2.1) * (1 - ease),
  };
}

"""

NET_PHASES = """
  if (next.phase === "net-on") {
    const face = netFace(target);
    const u = next.t / DUR.netOn;
    const pose = netOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "net", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "net") {
    const face = netFace(target);
    const pose = netPath(Math.min(1, next.t / DUR.net));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.net) {
      return goPhase(next, "net-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "net-hold") {
    const face = netFace(target);
    const pose = netHoldPath(Math.min(1, next.t / DUR.netHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.netHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = netHoldPath(1);
      return goPhase(next, "net-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "net-off") {
    const u = next.t / DUR.netOff;
    const pose = netOffPath(Math.min(1, u), next.from, next.to);
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
ts = must_replace(ts, 'export const BLACK = "black";\nexport const SILL = "sill";', 'export const BLACK = "black";\nexport const NET = "net";\nexport const SILL = "sill";', "ts NET const")
ts = must_replace(ts, "  blackOff: 2.38,\n  sillHop: 0.38,", "  blackOff: 2.38,\n  netOn: 2.54,\n  net: 2.62,\n  netHold: 3.88,\n  netOff: 2.46,\n  sillHop: 0.38,", "ts DUR")
ts = must_replace(ts, '  if (key === "jewelwing") return BLACK;\n  return SILL;', '  if (key === "jewelwing") return BLACK;\n  if (key === "lacewing") return NET;\n  return SILL;', "ts playFor")
ts = must_replace(ts, "    if (kind === BLACK) return w.width >= 184 && w.height >= 156;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === BLACK) return w.width >= 184 && w.height >= 156;\n    if (kind === NET) return w.width >= 190 && w.height >= 152;\n    return w.width >= 180 && w.height >= 70;", "ts size gate")
ts = must_replace(ts, "typeof JUMP | typeof TAILS | typeof BLACK | typeof SILL | typeof IGNORE;", "typeof JUMP | typeof TAILS | typeof BLACK | typeof NET | typeof SILL | typeof IGNORE;", "ts kind union")
ts = must_replace(ts, '| "black-off"\n', '| "black-off"\n  | "net-on"\n  | "net"\n  | "net-hold"\n  | "net-off"\n', "ts phases")

PICK_OLD = """  if (kind === BLACK) {
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
PICK_NEW = PICK_OLD + """
  if (kind === NET) {
    const hold = netPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -38 : 38;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 32 : -32;
    return {
      id: best.id,
      kind,
      side: "leafdish",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "laced",
      spin: "none",
    };
  }
"""
ts = must_replace(ts, PICK_OLD, PICK_NEW, "ts pick NET")

REFIT_OLD = """  if (target.kind === BLACK) {
    const hold = blackPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
REFIT_NEW = """  if (target.kind === BLACK) {
    const hold = blackPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === NET) {
    const hold = netPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
ts = must_replace(ts, REFIT_OLD, REFIT_NEW, "ts refit NET")

GO_OLD = """      if (target.kind === BLACK) {
        return goPhase(next, "black-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
GO_NEW = """      if (target.kind === BLACK) {
        return goPhase(next, "black-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === NET) {
        return goPhase(next, "net-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
ts = must_replace(ts, GO_OLD, GO_NEW, "ts goPhase NET")

idx = ts.find("export function beginPlay")
if idx < 0:
    raise SystemExit("no beginPlay")
line_start = ts.rfind("\n", 0, idx) + 1
ts = ts[:line_start] + NET_FNS + ts[line_start:]

phase_marker = '  if (next.phase === "sill-hop") {'
if ts.count(phase_marker) != 1:
    raise SystemExit("ts sill-hop count %s" % ts.count(phase_marker))
ts = ts.replace(phase_marker, NET_PHASES + phase_marker, 1)

if '| "streamjewel"' in ts:
    ts = must_replace(ts, '| "streamjewel"', '| "streamjewel"\n  | "leafdish"', "ts side leafdish")
if '| "jewelled"' in ts:
    ts = must_replace(ts, '| "jewelled"', '| "jewelled"\n  | "laced"', "ts leave laced")

save("web/src/lib/pets/window-play.ts", ts, nl)
print("ok ts")
