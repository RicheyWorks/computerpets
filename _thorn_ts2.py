from pathlib import Path

ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def sub_once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1 occurrence, found {n}")
    return text.replace(old, new, 1)

SPINES_FUNCS = r'''
export function spinesPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 24;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.30;
  const well = Math.max(22, size * 0.14);
  const gripY = win.y + win.height + well;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 16, maxLift) };
}

export function spinesFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function spinesOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.83) * 2.46;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 3.55 * (1 - ease) + stride * 0.12,
  };
}

export function spinesPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.32) {
    const s = t / 0.32;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.7, lift: ease * -4.8, rot: ease * 13.6 };
  }
  if (t < 0.78) {
    const s = (t - 0.32) / 0.46;
    const pulse = Math.sin(s * Math.PI);
    return { x: 0.7 + pulse * 0.4, lift: -4.8 + pulse * 1.1, rot: 13.6 + pulse * 2.4 };
  }
  return { x: 0.8, lift: -4.4, rot: 14.8 };
}

export function spinesHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.22;
  return { x: 0.8, lift: -4.4 + hush, rot: 14.8 };
}

export function spinesOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.52) * 2.08;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 14.8) * (1 - ease),
  };
}

'''

SPINES_TICK = r'''
  if (next.phase === "spines-on") {
    const face = spinesFace(target);
    const u = next.t / DUR.spinesOn;
    const pose = spinesOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "spines", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "spines") {
    const face = spinesFace(target);
    const pose = spinesPath(Math.min(1, next.t / DUR.spines));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.spines) {
      return goPhase(next, "spines-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "spines-hold") {
    const face = spinesFace(target);
    const pose = spinesHoldPath(Math.min(1, next.t / DUR.spinesHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.spinesHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = spinesHoldPath(1);
      return goPhase(next, "spines-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "spines-off") {
    const u = next.t / DUR.spinesOff;
    const pose = spinesOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }


'''

def patch_ts():
    p = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
    t = p.read_text(encoding="utf-8")
    t = sub_once(
        t,
        '''      if (target.kind === FLAT) {
        return goPhase(next, "flat-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        '''      if (target.kind === FLAT) {
        return goPhase(next, "flat-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === SPINES) {
        return goPhase(next, "spines-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === WRAP) {''',
        "ts approach",
    )
    t = sub_once(
        t,
        '''    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 7.1) * (1 - ease),
  };
}


export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {''',
        '''    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 7.1) * (1 - ease),
  };
}

''' + SPINES_FUNCS + '''
export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {''',
        "ts spines funcs",
    )
    t = sub_once(
        t,
        '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n    return next;\n  }\n\n\n  if (next.phase === "sill-hop") {',
        '    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);\n    return next;\n  }\n\n' + SPINES_TICK + '  if (next.phase === "sill-hop") {',
        "ts tick",
    )
    p.write_text(t, encoding="utf-8", newline="\n")
    print("ts part2 ok")

if __name__ == "__main__":
    patch_ts()
