from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

def load(p):
    return (ROOT / p).read_text(encoding="utf-8")

def save(p, text):
    (ROOT / p).write_text(text, encoding="utf-8", newline="\n")

def must_replace(text, old, new, n=1):
    count = text.count(old)
    if count != n:
        raise SystemExit(f"expected {n} of marker, found {count}: {old[:160]!r}")
    return text.replace(old, new)

TICK = """
  if (next.phase === "signal-on") {
    const face = signalFace(target);
    const u = next.t / DUR.signalOn;
    const pose = signalOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "signal", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "signal") {
    const face = signalFace(target);
    const pose = signalPath(Math.min(1, next.t / DUR.signal));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.signal) {
      return goPhase(next, "signal-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "signal-hold") {
    const face = signalFace(target);
    const pose = signalHoldPath(Math.min(1, next.t / DUR.signalHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.signalHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = signalHoldPath(1);
      return goPhase(next, "signal-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "signal-off") {
    const u = next.t / DUR.signalOff;
    const pose = signalOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

"""

p = "web/src/lib/pets/window-play.ts"
ts = load(p)
ts = must_replace(ts,
'''  if (next.phase === "side-off") {
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

  if (next.phase === "sill-hop") {
''',
'''  if (next.phase === "side-off") {
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
''' + TICK + '''  if (next.phase === "sill-hop") {
''')
save(p, ts)
print("ts tick ok")
