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
        raise SystemExit(f"{label}: expected 1, found {n}\nOLD[:120]={old[:120]!r}")
    return t.replace(old, new, 1)

def many(t, old, new, label):
    n = t.count(old)
    if n < 1:
        raise SystemExit(f"{label}: expected >=1, found {n}")
    return t.replace(old, new), n

HEADER_OLD = "Thread thrashes a glazing rebate as a soil film: walk into the rebate, thrash the round, then leave. Wick still owns thread. Half still owns split. Tun still owns dry. This is the ninth log leftover."
HEADER_NEW = HEADER_OLD + " Scud sides a window well as a side pool: walk into the well, swim the side, then leave. Thread still owns thrash. Armor still owns roll. Silver still owns go. This closes log ten."

JS_SIDE_FUNCS = r'''
  function sidePoint(win, sprite, work) {
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

  function sideFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function sideOnPath(u, from, to) {
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

  function sidePath(u) {
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

  function sideHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.2;
    return { x: 3.2, lift: -4.4 + wait, rot: 86.4 };
  }

  function sideOffPath(u, from, to) {
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
      rot: (from && from.rot != null ? from.rot : 86.4) * (1 - ease),
    };
  }

'''

JS_TICK = r'''
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

JS_PICK = r'''
    if (kind === SIDE) {
      const hold = sidePoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -72 : 72;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 65 : -65;
      return {
        id: best.id,
        kind,
        side: "sidepool",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "sides",
        spin: "none",
      };
    }

'''

print("helpers ok")
