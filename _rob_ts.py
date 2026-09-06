# -*- coding: utf-8 -*-
"""Patch web/src/lib/pets/window-play.ts for Rob seize (lockstep with JS)."""
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
        raise SystemExit("MISSING: " + label + " :: " + repr(old[:120]))
    n = text.count(old)
    if n != 1:
        raise SystemExit("COUNT %s for %s" % (n, label))
    return text.replace(old, new, 1)

HEADER_OLD_TAIL = (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den. Others walk a sill. Same map as desktop `window-play.js`. */"
)

HEADER_NEW_TAIL = (
    " Click rights a window stool as a bark plate: walk onto the stool, sit, right once, sit the plate, then leave. "
    "Snout still owns drill. Relay still owns click. Snap still owns count. Bluff still owns flip. Spark the firefly still owns glow. "
    "This is the ninth leftover of the meadow den. "
    "Rob seizes a window stool as a grass perch: walk onto the stool, sit, seize once, sit the perch, then leave. "
    "Click still owns right. Relay still owns click. Haste still owns hunt. Dart still owns hawk. Sip still owns sip. Thrum still owns forage. Spine still owns bristle. Hook still owns soar. Leap still owns pounce. Hum still owns drone. "
    "This is the tenth leftover of the meadow den and closes meadow ten. Others walk a sill. Same map as desktop `window-play.js`. */"
)

SEIZE_FNS = r'''
export function seizePoint(win: WindowBounds, sprite = SPRITE, work?: WorkSpace): PlayPoint {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 31;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.55;
  const perch = Math.max(17, size * 0.115);
  const gripY = win.y + win.height - perch;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 16, maxLift) };
}

export function seizeFace(target: PlayTarget): number {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function seizeOnPath(u: number, from: PlayPoint, to: PlayPoint): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.74) * 1.08;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 1.9 * (1 - ease) + stride * 0.08,
  };
}

export function seizePath(u: number): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.14) {
    const s = t / 0.14;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.08, lift: ease * 0.35, rot: ease * -6.5 };
  }
  if (t < 0.42) {
    const s = (t - 0.14) / 0.28;
    const dart = Math.sin(s * Math.PI);
    return { x: 0.08 + dart * 18.4, lift: 0.35 + dart * 3.6, rot: -6.5 + dart * 9.2 };
  }
  if (t < 0.72) {
    const s = (t - 0.42) / 0.3;
    const ease = s * s * (3 - 2 * s);
    return { x: 18.48 - ease * 18.2, lift: 3.95 - ease * 3.2, rot: 2.7 - ease * 5.1 };
  }
  return { x: 0.28, lift: 0.75, rot: -2.4 };
}

export function seizeHoldPath(u: number): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.09;
  return { x: 0.28, lift: 0.75 + hush, rot: -2.4 };
}

export function seizeOffPath(u: number, from: PlayPoint & { rot?: number }, to: PlayPoint): PlayPoint & { rot: number } {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.48) * 1.1;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && from.rot != null ? from.rot : -2.4) * (1 - ease),
  };
}

'''

text, nl = load("web/src/lib/pets/window-play.ts")
text = must_replace(text, HEADER_OLD_TAIL, HEADER_NEW_TAIL, "ts header")

# Check how RIGHT is declared - export const?
# find patterns
if 'export const RIGHT = "right";' in text:
    text = must_replace(
        text,
        'export const RIGHT = "right";\nexport const SILL = "sill";',
        'export const RIGHT = "right";\nexport const SEIZE = "seize";\nexport const SILL = "sill";',
        "ts SEIZE const",
    )
elif 'const RIGHT = "right";\nexport const SILL' in text:
    text = must_replace(
        text,
        'const RIGHT = "right";\nexport const SILL = "sill";',
        'const RIGHT = "right";\nexport const SEIZE = "seize";\nexport const SILL = "sill";',
        "ts SEIZE const2",
    )
else:
    raise SystemExit("RIGHT const pattern unknown")

text = must_replace(
    text,
    'typeof DRILL | typeof RIGHT | typeof SILL | typeof IGNORE;',
    'typeof DRILL | typeof RIGHT | typeof SEIZE | typeof SILL | typeof IGNORE;',
    "ts PlayKind",
)

text = must_replace(
    text,
    '  | "right-on"\n  | "right"\n  | "right-hold"\n  | "right-off"\n  | "sill-hop"',
    '  | "right-on"\n  | "right"\n  | "right-hold"\n  | "right-off"\n  | "seize-on"\n  | "seize"\n  | "seize-hold"\n  | "seize-off"\n  | "sill-hop"',
    "ts PlayPhase",
)

# DUR - find rightOff in DUR object
if "rightOff: 2.56," in text:
    text = must_replace(
        text,
        "rightOn: 2.64,\n  right: 1.92,\n  rightHold: 4.16,\n  rightOff: 2.56,",
        "rightOn: 2.64,\n  right: 1.92,\n  rightHold: 4.16,\n  rightOff: 2.56,\n  seizeOn: 2.58,\n  seize: 1.68,\n  seizeHold: 4.05,\n  seizeOff: 2.48,",
        "ts DUR",
    )
else:
    # try with more spaces
    raise SystemExit("DUR pattern missing: " + repr([line for line in text.splitlines() if "rightOff" in line][:5]))

text = must_replace(
    text,
    '  if (key === "click_beetle") return RIGHT;\n  return SILL;',
    '  if (key === "click_beetle") return RIGHT;\n  if (key === "robber_fly") return SEIZE;\n  return SILL;',
    "ts playFor",
)

text = must_replace(
    text,
    "  if (kind === RIGHT) return w.width >= 184 && w.height >= 152;",
    "  if (kind === RIGHT) return w.width >= 184 && w.height >= 152;\n  if (kind === SEIZE) return w.width >= 184 && w.height >= 152;",
    "ts size gate",
)

# pick - need to see side type. barkplate may need grassperch in union
if '"barkplate"' in text:
    # find side type
    pass

right_pick = '''  if (kind === RIGHT) {
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
  }'''

seize_pick = right_pick + '''

  if (kind === SEIZE) {
    const hold = seizePoint(best, size, work);
    const approachOff = hold.x < workW / 2 ? -30 : 30;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 28 : -28;
    return {
      id: best.id,
      kind,
      side: "grassperch",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "seized",
      spin: "none",
    };
  }'''
text = must_replace(text, right_pick, seize_pick, "ts pick")

right_refit = '''  if (target.kind === RIGHT) {
    const hold = rightPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }'''
seize_refit = right_refit + '''

  if (target.kind === SEIZE) {
    const hold = seizePoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }'''
text = must_replace(text, right_refit, seize_refit, "ts refit")

# insert seize fns after rightOffPath function
marker = "export function rightOffPath"
i = text.find(marker)
if i < 0:
    raise SystemExit("no rightOffPath")
# find end of rightOffPath function - next export function
j = text.find("\nexport function ", i + 10)
if j < 0:
    raise SystemExit("no next after rightOffPath")
text = text[:j] + "\n" + SEIZE_FNS + text[j:]
print("inserted seize fns at", j)

right_approach = '''      if (target.kind === RIGHT) {
        return goPhase(next, "right-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }'''
seize_approach = right_approach + '''

      if (target.kind === SEIZE) {
        return goPhase(next, "seize-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }'''
text = must_replace(text, right_approach, seize_approach, "ts approach")

right_phases = '''  if (next.phase === "right-on") {
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
  }'''

seize_phases = right_phases + '''

  if (next.phase === "seize-on") {
    const face = seizeFace(target);
    const u = next.t / DUR.seizeOn;
    const pose = seizeOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot * face;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "seize", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "seize") {
    const face = seizeFace(target);
    const pose = seizePath(Math.min(1, next.t / DUR.seize));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.seize) {
      return goPhase(next, "seize-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "seize-hold") {
    const face = seizeFace(target);
    const pose = seizeHoldPath(Math.min(1, next.t / DUR.seizeHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.seizeHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = seizeHoldPath(1);
      return goPhase(next, "seize-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "seize-off") {
    const u = next.t / DUR.seizeOff;
    const pose = seizeOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }'''
text = must_replace(text, right_phases, seize_phases, "ts phases")

# side type union - add grassperch if needed
if 'side?:' in text or '"barkplate"' in text:
    # find type for side
    for pat in [
        '"barkplate" |',
        '| "barkplate"',
        'barkplate',
    ]:
        pass
    # Look for side in PlayTarget
    import re
    m = re.search(r'side\??: ([^;]+);', text)
    if m:
        print("side type:", m.group(1)[:200])
    # If side is string, fine. If union, add grassperch
    if '"barkplate"' in text and 'grassperch' not in text:
        # try common pattern
        if '| "barkplate"' in text:
            text = must_replace(text, '| "barkplate"', '| "barkplate" | "grassperch"', "ts side union")
        elif '"barkplate" |' in text:
            text = must_replace(text, '"barkplate" |', '"barkplate" | "grassperch" |', "ts side union2")

# leave union seized
if '"righted"' in text and '"seized"' not in text:
    if '| "righted"' in text:
        text = text.replace('| "righted"', '| "righted" | "seized"', 1)
        print("added seized leave")
    elif '"righted" |' in text:
        text = text.replace('"righted" |', '"righted" | "seized" |', 1)
        print("added seized leave2")

save("web/src/lib/pets/window-play.ts", text, nl)
print("ok ts")
