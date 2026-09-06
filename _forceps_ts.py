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
    "Lace nets a window stool as a leaf dish: walk onto the stool, sit, lace once, sit the dish, then leave. "
    "Jewel still owns black. Banner still owns tails. Ghost still owns week. Moth still owns mount. Seven still owns spot. "
    "This is the sixth leftover of the meadow den."
)
HEADER_NEW = HEADER + (
    " Forceps cercis a window stool as a bark dish: walk onto the stool, sit, raise the cerci once, sit the dish, then leave. "
    "Lace still owns net. Jewel still owns black. Fold still owns pray. Pinch still owns claw. Barb still owns raise. "
    "This is the seventh leftover of the meadow den."
)

CERCI_FNS = """
export function cerciPoint(win: DeskWindow, sprite: number | undefined, work: WorkArea) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 30;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.48;
  const dish = Math.max(18, size * 0.11);
  const gripY = win.y + win.height - dish;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 15, maxLift) };
}

export function cerciFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function cerciOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.84) * 1.14;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 2.08 * (1 - ease) + stride * 0.09,
  };
}

export function cerciPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.16) {
    const s = t / 0.16;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.08, lift: ease * 0.32, rot: ease * -1.4 };
  }
  if (t < 0.52) {
    const s = (t - 0.16) / 0.36;
    const raise = Math.sin(s * Math.PI);
    return { x: 0.08 + raise * 0.22, lift: 0.32 + raise * 2.68, rot: -1.4 + raise * 10.4 };
  }
  if (t < 0.78) {
    const s = (t - 0.52) / 0.26;
    const ease = s * s * (3 - 2 * s);
    return { x: 0.30 - ease * 0.14, lift: 3.0 - ease * 2.42, rot: 9.0 - ease * 10.6 };
  }
  return { x: 0.16, lift: 0.58, rot: -1.6 };
}

export function cerciHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.07;
  return { x: 0.16, lift: 0.58 + hush, rot: -1.6 };
}

export function cerciOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.62) * 1.12;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -1.6) * (1 - ease),
  };
}

"""

CERCI_PHASES = """
  if (next.phase === "cerci-on") {
    const face = cerciFace(target);
    const u = next.t / DUR.cerciOn;
    const pose = cerciOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "cerci", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "cerci") {
    const face = cerciFace(target);
    const pose = cerciPath(Math.min(1, next.t / DUR.cerci));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.cerci) {
      return goPhase(next, "cerci-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "cerci-hold") {
    const face = cerciFace(target);
    const pose = cerciHoldPath(Math.min(1, next.t / DUR.cerciHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.cerciHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = cerciHoldPath(1);
      return goPhase(next, "cerci-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "cerci-off") {
    const u = next.t / DUR.cerciOff;
    const pose = cerciOffPath(Math.min(1, u), next.from, next.to);
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
ts = must_replace(ts, 'export const NET = "net";\nexport const SILL = "sill";', 'export const NET = "net";\nexport const CERCI = "cerci";\nexport const SILL = "sill";', "ts CERCI const")
ts = must_replace(ts, "  netOff: 2.46,\n  sillHop: 0.38,", "  netOff: 2.46,\n  cerciOn: 2.68,\n  cerci: 2.34,\n  cerciHold: 3.74,\n  cerciOff: 2.52,\n  sillHop: 0.38,", "ts DUR")
ts = must_replace(ts, '  if (key === "lacewing") return NET;\n  return SILL;', '  if (key === "lacewing") return NET;\n  if (key === "earwig") return CERCI;\n  return SILL;', "ts playFor")
ts = must_replace(ts, "    if (kind === NET) return w.width >= 190 && w.height >= 152;\n    return w.width >= 180 && w.height >= 70;", "    if (kind === NET) return w.width >= 190 && w.height >= 152;\n    if (kind === CERCI) return w.width >= 188 && w.height >= 154;\n    return w.width >= 180 && w.height >= 70;", "ts size gate")
ts = must_replace(ts, "typeof JUMP | typeof TAILS | typeof BLACK | typeof NET | typeof SILL | typeof IGNORE;", "typeof JUMP | typeof TAILS | typeof BLACK | typeof NET | typeof CERCI | typeof SILL | typeof IGNORE;", "ts kind union")
ts = must_replace(ts, '| "net-off"\n', '| "net-off"\n  | "cerci-on"\n  | "cerci"\n  | "cerci-hold"\n  | "cerci-off"\n', "ts phases")

PICK_OLD = """  if (kind === NET) {
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
PICK_NEW = PICK_OLD + """
  if (kind === CERCI) {
    const hold = cerciPoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -36 : 36;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 30 : -30;
    return {
      id: best.id,
      kind,
      side: "paperbark",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "cercied",
      spin: "none",
    };
  }
"""
ts = must_replace(ts, PICK_OLD, PICK_NEW, "ts pick CERCI")

REFIT_OLD = """  if (target.kind === NET) {
    const hold = netPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
REFIT_NEW = """  if (target.kind === NET) {
    const hold = netPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === CERCI) {
    const hold = cerciPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === BURY) {
"""
ts = must_replace(ts, REFIT_OLD, REFIT_NEW, "ts refit CERCI")

GO_OLD = """      if (target.kind === NET) {
        return goPhase(next, "net-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
GO_NEW = """      if (target.kind === NET) {
        return goPhase(next, "net-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === CERCI) {
        return goPhase(next, "cerci-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {
"""
ts = must_replace(ts, GO_OLD, GO_NEW, "ts goPhase CERCI")

# Insert path fns before beginPlay
marker = "export function beginPlay(target: PlayTarget, petX?: number): PlayState |"
# try simpler
if "export function beginPlay(" not in ts:
    raise SystemExit("no beginPlay")
# Find exact beginPlay line start
idx = ts.find("export function beginPlay(")
# Prefer inserting after netOffPath block - look for netOffPath end near beginPlay
# Lace inserted before beginPlay
before = ts.rfind("\n", 0, idx)
# Insert CERCI_FNS right before beginPlay export
ts = ts[:idx] + CERCI_FNS + ts[idx:]

phase_marker = '  if (next.phase === "sill-hop") {'
if ts.count(phase_marker) != 1:
    raise SystemExit("sill-hop count %s" % ts.count(phase_marker))
ts = ts.replace(phase_marker, CERCI_PHASES + phase_marker, 1)

save("web/src/lib/pets/window-play.ts", ts, nl)
print("ok ts")
