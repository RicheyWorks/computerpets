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
        raise SystemExit(f"{label}: expected 1, found {n}\nOLD[:220]={old[:220]!r}")
    return t.replace(old, new, 1)

ts, crlf = load("web/src/lib/pets/window-play.ts")

FUNCS = r'''
export function sidePoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 24;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.92;
  const well = Math.max(22, size * 0.14);
  const gripY = win.y + win.height + well;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 16, maxLift) };
}

export function sideFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function sideOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const roll = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.92) * 3.1;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + roll,
    rot: (toX >= fromX ? 1 : -1) * 31.6 * ease + roll * 0.22,
  };
}

export function sidePath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.24) {
    const s = t / 0.24;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 3.2, lift: ease * -4.6, rot: ease * 86.4 };
  }
  if (t < 0.82) {
    const s = (t - 0.24) / 0.58;
    const scud = Math.sin(s * Math.PI * 2.4);
    return { x: 3.2 + scud * 6.8, lift: -4.6 + Math.abs(scud) * 1.4, rot: 86.4 + scud * 4.2 };
  }
  return { x: 3.2, lift: -4.4, rot: 86.4 };
}

export function sideHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.2;
  return { x: 3.2, lift: -4.4 + wait, rot: 86.4 };
}

export function sideOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.61) * 2.7;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 86.4) * (1 - ease),
  };
}

'''

ts = once(
    ts,
    '''    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 4.8) * (1 - ease),
  };
}

export function splitOffPath(u: number, from: PlayPoint, to: PlayPoint) {''',
    '''    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 4.8) * (1 - ease),
  };
}

''' + FUNCS + '''export function splitOffPath(u: number, from: PlayPoint, to: PlayPoint) {''',
    "ts funcs",
)

ts = once(
    ts,
    '''      if (target.kind === THRASH) {
        return goPhase(next, "thrash-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
''',
    '''      if (target.kind === THRASH) {
        return goPhase(next, "thrash-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === SIDE) {
        return goPhase(next, "side-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
''',
    "ts approach",
)

# The approach insert may have broken the closing brace of THRASH. Check: we added `}` then SIDE then the original next if. The old THRASH block already had a closing `}` after the return... wait.

# Original:
#       if (target.kind === THRASH) {
#         return goPhase(next, "thrash-on", ...);
#       }
#       if (target.kind === WRAP) {
#
# I replaced including only the opening if and return line, then added extra `}` and SIDE. That would DUPLICATE the closing brace... 
# Let's look at what I actually did. I replaced:
#       if (target.kind === THRASH) {
#         return goPhase(next, "thrash-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
#
# with the same PLUS:
#       }
#       if (target.kind === SIDE) {
#         return goPhase(next, "side-on", ...);
#
# Then the original `      }` that closed THRASH now closes SIDE. And WRAP follows. That's CORRECT - one close brace moves from THRASH to SIDE. Good.

TICK = r'''
  if (next.phase === "side-on") {
    const face = sideFace(target);
    const u = next.t / DUR.sideOn;
    const pose = sideOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "side", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "side") {
    const face = sideFace(target);
    const pose = sidePath(Math.min(1, next.t / DUR.side));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.side) {
      return goPhase(next, "side-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "side-hold") {
    const face = sideFace(target);
    const pose = sideHoldPath(Math.min(1, next.t / DUR.sideHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.sideHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = sideHoldPath(1);
      return goPhase(next, "side-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "side-off") {
    const u = next.t / DUR.sideOff;
    const pose = sideOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

ts = once(
    ts,
    '''    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "sill-hop") {''',
    '''    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
''' + TICK + '''  if (next.phase === "sill-hop") {''',
    "ts tick",
)

save("web/src/lib/pets/window-play.ts", ts, crlf)
print("ts complete")
