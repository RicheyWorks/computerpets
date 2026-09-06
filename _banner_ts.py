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
    "Vault jumps a window apron as a grass plate: walk onto the apron, sit, vault once, sit the plate, then leave. "
    "Blade still owns leaf. Chirp still owns song. Hop still owns spring. Leap still owns pounce. Hook still owns soar. "
    "This is the third leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Banner tails a window stool as a blossom dish: walk onto the stool, sit, banner once, sit the dish, then leave. "
    "Vault still owns jump. Blade still owns leaf. Chirp still owns song. Milk still owns weed. Ghost still owns week. "
    "This is the fourth leftover of the meadow den."
)

TAILS_FNS = """
export function tailsPoint(win: DeskWindow, sprite: number | undefined, work: WorkArea) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 28;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.64;
  const dish = Math.max(16, size * 0.10);
  const gripY = win.y + win.height - dish;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 18, maxLift - 8) };
}

export function tailsFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function tailsOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.84) * 1.22;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.18 * (1 - ease) + stride * 0.10,
  };
}

export function tailsPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.18) {
    const s = t / 0.18;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.12, lift: ease * 0.55, rot: ease * -3.2 };
  }
  if (t < 0.52) {
    const s = (t - 0.18) / 0.34;
    const banner = Math.sin(s * Math.PI);
    return { x: 0.12 + banner * 1.8, lift: 0.55 + banner * 5.6, rot: -3.2 + banner * 14.4 };
  }
  if (t < 0.78) {
    const s = (t - 0.52) / 0.26;
    const ease = s * s * (3 - 2 * s);
    return { x: 1.92 - ease * 1.55, lift: 6.15 - ease * 5.45, rot: 11.2 - ease * 14.8 };
  }
  return { x: 0.37, lift: 0.7, rot: -3.6 };
}

export function tailsHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const dish = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.11;
  return { x: 0.37, lift: 0.7 + dish, rot: -3.6 };
}

export function tailsOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.62) * 1.28;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -3.6) * (1 - ease),
  };
}

"""

TAILS_PHASES = """
  if (next.phase === "tails-on") {
    const face = tailsFace(target);
    const u = next.t / DUR.tailsOn;
    const pose = tailsOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "tails", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "tails") {
    const face = tailsFace(target);
    const pose = tailsPath(Math.min(1, next.t / DUR.tails));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.tails) {
      return goPhase(next, "tails-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "tails-hold") {
    const face = tailsFace(target);
    const pose = tailsHoldPath(Math.min(1, next.t / DUR.tailsHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.tailsHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = tailsHoldPath(1);
      return goPhase(next, "tails-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "tails-off") {
    const u = next.t / DUR.tailsOff;
    const pose = tailsOffPath(Math.min(1, u), next.from, next.to);
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
ts = must_replace(ts, 'export const JUMP = "jump";\nexport const SILL = "sill";', 'export const JUMP = "jump";\nexport const TAILS = "tails";\nexport const SILL = "sill";', "ts TAILS const")
ts = must_replace(ts, "  jumpOff: 2.26,\n  sillHop: 0.38,", "  jumpOff: 2.26,\n  tailsOn: 2.66,\n  tails: 2.28,\n  tailsHold: 3.58,\n  tailsOff: 2.34,\n  sillHop: 0.38,", "ts DUR")
ts = must_replace(ts, '  if (key === "grasshopper") return JUMP;\n  return SILL;', '  if (key === "grasshopper") return JUMP;\n  if (key === "swallowtail") return TAILS;\n  return SILL;', "ts playFor")
ts = must_replace(ts, "    if (kind === JUMP) return w.width >= 188 && w.height >= 152;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === JUMP) return w.width >= 188 && w.height >= 152;\n    if (kind === TAILS) return w.width >= 186 && w.height >= 150;\n    return w.width >= 180 && w.height >= 70;", "ts size gate")
ts = must_replace(ts, "typeof SONG | typeof LEAF | typeof JUMP | typeof SILL | typeof IGNORE;", "typeof SONG | typeof LEAF | typeof JUMP | typeof TAILS | typeof SILL | typeof IGNORE;", "ts kind union")
ts = must_replace(ts, '| "jump-off"\n', '| "jump-off"\n  | "tails-on"\n  | "tails"\n  | "tails-hold"\n  | "tails-off"\n', "ts phases")

PICK_OLD = """  if (kind === JUMP) {
    const hold = jumpPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -44 : 44;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 38 : -38;
    return {
      id: best.id,
      kind,
      side: "grassplate",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "vaulted",
      spin: "none",
    };
  }
"""
PICK_NEW = PICK_OLD + """
  if (kind === TAILS) {
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
ts = must_replace(ts, PICK_OLD, PICK_NEW, "ts pick TAILS")

REFIT_OLD = """  if (target.kind === JUMP) {
    const hold = jumpPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
REFIT_NEW = """  if (target.kind === JUMP) {
    const hold = jumpPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === TAILS) {
    const hold = tailsPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
ts = must_replace(ts, REFIT_OLD, REFIT_NEW, "ts refit TAILS")

GO_OLD = """      if (target.kind === JUMP) {
        return goPhase(next, "jump-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
GO_NEW = """      if (target.kind === JUMP) {
        return goPhase(next, "jump-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === TAILS) {
        return goPhase(next, "tails-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
ts = must_replace(ts, GO_OLD, GO_NEW, "ts goPhase TAILS")

idx = ts.find("export function beginPlay")
if idx < 0:
    raise SystemExit("no beginPlay")
line_start = ts.rfind("\n", 0, idx) + 1
ts = ts[:line_start] + TAILS_FNS + ts[line_start:]

phase_marker = '  if (next.phase === "sill-hop") {'
if ts.count(phase_marker) != 1:
    raise SystemExit("ts sill-hop count %s" % ts.count(phase_marker))
ts = ts.replace(phase_marker, TAILS_PHASES + phase_marker, 1)

if '| "grassplate"' in ts:
    ts = must_replace(ts, '| "grassplate"', '| "grassplate"\n  | "blossomdish"', "ts side blossomdish")
if '| "vaulted"' in ts:
    ts = must_replace(ts, '| "vaulted"', '| "vaulted"\n  | "bannered"', "ts leave bannered")

save("web/src/lib/pets/window-play.ts", ts, nl)
print("ok ts")
