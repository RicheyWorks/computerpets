from pathlib import Path
ROOT = Path(r"C:\Users\730ri\projects\ComputerPets")

JS_PICK = r'''    if (kind === EIGHT) {
      const hold = eightPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -53 : 53;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 48 : -48;
      return {
        id: best.id,
        kind,
        side: "tiderock",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "plated",
        spin: "none",
      };
    }
'''

TS_PICK = r'''  if (kind === EIGHT) {
    const hold = eightPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -53 : 53;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 48 : -48;
    return {
      id: best.id,
      kind,
      side: "tiderock",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "plated",
      spin: "none",
    };
  }
'''

JS_TICK = r'''
    if (next.phase === "eight-on") {
      const face = eightFace(target);
      const u = next.t / DUR.eightOn;
      const pose = eightOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "eight", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "eight") {
      const face = eightFace(target);
      const pose = eightPath(Math.min(1, next.t / DUR.eight));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.eight) {
        return goPhase(next, "eight-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "eight-hold") {
      const face = eightFace(target);
      const pose = eightHoldPath(Math.min(1, next.t / DUR.eightHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.eightHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = eightHoldPath(1);
        return goPhase(next, "eight-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "eight-off") {
      const u = next.t / DUR.eightOff;
      const pose = eightOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
'''

TS_TICK = r'''
  if (next.phase === "eight-on") {
    const face = eightFace(target);
    const u = next.t / DUR.eightOn;
    const pose = eightOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "eight", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "eight") {
    const face = eightFace(target);
    const pose = eightPath(Math.min(1, next.t / DUR.eight));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.eight) {
      return goPhase(next, "eight-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "eight-hold") {
    const face = eightFace(target);
    const pose = eightHoldPath(Math.min(1, next.t / DUR.eightHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.eightHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = eightHoldPath(1);
      return goPhase(next, "eight-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "eight-off") {
    const u = next.t / DUR.eightOff;
    const pose = eightOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
'''

open(ROOT / "_mail_js_pick.txt", "w", encoding="utf-8", newline="\n").write(JS_PICK)
open(ROOT / "_mail_ts_pick.txt", "w", encoding="utf-8", newline="\n").write(TS_PICK)
open(ROOT / "_mail_js_tick.txt", "w", encoding="utf-8", newline="\n").write(JS_TICK)
open(ROOT / "_mail_ts_tick.txt", "w", encoding="utf-8", newline="\n").write(TS_TICK)
print("wrote pick/tick fragments")
