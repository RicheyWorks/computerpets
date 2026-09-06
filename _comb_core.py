from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def patch(path, reps, label):
    raw = path.read_bytes()
    file_nl = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8")
    if text.startswith("\ufeff"):
        text = text.lstrip("\ufeff")
    text = text.replace("\r\n", "\n")
    for old, new in reps:
        count = text.count(old)
        if count != 1:
            raise SystemExit("%s: expected 1 occurrence, got %d for %r" % (label, count, old[:160]))
        text = text.replace(old, new, 1)
    path.write_bytes(text.replace("\n", file_nl).encode("utf-8"))
    print("patched", label)

FUNCS = r'''
export function wagglePoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 48;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.58;
  const pan = Math.max(68, size * 0.38);
  const gripY = win.y + win.height - pan;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 28, maxLift) };
}

export function waggleFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function waggleOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 2.14) * 2.62;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 4.35 * (1 - ease) + stride * 0.19,
  };
}

export function wagglePath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.20) {
    const s = t / 0.20;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 0.9, lift: ease * 3.1, rot: ease * 14.6 };
  }
  if (t < 0.84) {
    const s = (t - 0.20) / 0.64;
    const wag = Math.sin(s * Math.PI * 2.8);
    const loop = Math.sin(s * Math.PI * 1.4);
    return { x: 0.9 + wag * 4.2, lift: 3.1 + Math.abs(loop) * 2.2, rot: 14.6 + wag * 5.8 };
  }
  return { x: 0.7, lift: 3.3, rot: 15.2 };
}

export function waggleHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const hush = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.22;
  return { x: 0.7, lift: 3.3 + hush, rot: 15.2 };
}

export function waggleOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.71) * 2.08;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 15.2) * (1 - ease),
  };
}

'''

TICK = r'''
  if (next.phase === "waggle-on") {
    const face = waggleFace(target);
    const u = next.t / DUR.waggleOn;
    const pose = waggleOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "waggle", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "waggle") {
    const face = waggleFace(target);
    const pose = wagglePath(Math.min(1, next.t / DUR.waggle));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.waggle) {
      return goPhase(next, "waggle-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "waggle-hold") {
    const face = waggleFace(target);
    const pose = waggleHoldPath(Math.min(1, next.t / DUR.waggleHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.waggleHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = waggleHoldPath(1);
      return goPhase(next, "waggle-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "waggle-off") {
    const u = next.t / DUR.waggleOff;
    const pose = waggleOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

'''

ts = ROOT / "web" / "src" / "lib" / "pets" / "window-play.ts"
patch(ts, [
    ("export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {",
     FUNCS + "export function beginPlay(target: PlayTarget | null | undefined, petX: number): WindowPlay | null {"),
    ('  if (next.phase === "sill-hop") {', TICK + '  if (next.phase === "sill-hop") {'),
], "window-play.ts-c")
print("ts-c ok")
