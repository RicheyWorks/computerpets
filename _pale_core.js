const fs = require("fs");
const path = require("path");

function read(p) { return fs.readFileSync(p, "utf8"); }
function write(p, s) { fs.writeFileSync(p, s); }
function mustReplace(src, find, repl, label, expected) {
  const n = src.split(find).length - 1;
  if (expected != null && n !== expected) {
    throw new Error(label + ": expected " + expected + " hits, got " + n + " for: " + find.slice(0, 80));
  }
  if (n < 1) throw new Error(label + ": missing: " + find.slice(0, 120));
  return src.split(find).join(repl);
}

const JS = "desktop/renderer/window-play.js";
const TS = "web/src/lib/pets/window-play.ts";

const HEADER_OLD = "Wave signals a sill pan as a marsh dish: walk onto the pan, signal the big claw, then leave. Scud still owns side. Pinch still owns the claw. Tenant still owns knob. This opens shore ten.";
const HEADER_NEW = HEADER_OLD + " Pale sands a window stool as dry sand: walk onto the stool, run the pale, then leave. Wave still owns signal. Gale still owns run. Tun still owns dry. This is the second shore leftover.";

const JS_SAND_FNS = `
  function sandPoint(win, sprite, work) {
    const size = sprite == null ? SPRITE : sprite;
    const pad = 32;
    const span = Math.max(0, win.width - size - pad * 2);
    const x = win.x + pad + span * 0.79;
    const stool = Math.max(14, size * 0.09);
    const gripY = win.y + win.height - stool;
    const lift = gripLift(gripY, work);
    const maxLift = (work && work.height ? work.height : 800) - 48;
    return { x, lift: clamp(lift, 18, maxLift) };
  }

  function sandFace(target) {
    return target.approachX >= target.holdX ? -1 : 1;
  }

  function sandOnPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.92) * 3.1;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (toX >= fromX ? 1 : -1) * 5.8 * (1 - ease) + stride * 0.16,
    };
  }

  function sandPath(u) {
    const t = Math.max(0, Math.min(1, u));
    if (t < 0.16) {
      const s = t / 0.16;
      const ease = s * s * (3 - 2 * s);
      return { x: ease * 3.4, lift: ease * 2.2, rot: ease * 11.6 };
    }
    if (t < 0.84) {
      const s = (t - 0.16) / 0.68;
      const stride = Math.sin(s * Math.PI * 2.8);
      return { x: 3.4 + s * 18.2 + stride * 1.6, lift: 2.2 + Math.abs(stride) * 3.1, rot: 11.6 + stride * 7.4 };
    }
    return { x: 21.6, lift: 2.6, rot: 9.2 };
  }

  function sandHoldPath(u) {
    const t = Math.max(0, Math.min(1, u));
    const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.28;
    return { x: 21.6, lift: 2.6 + wait, rot: 9.2 };
  }

  function sandOffPath(u, from, to) {
    const t = Math.max(0, Math.min(1, u));
    const fromX = from && from.x != null ? from.x : 0;
    const toX = to && to.x != null ? to.x : fromX;
    const fromLift = from && from.lift != null ? from.lift : 0;
    const toLift = to && to.lift != null ? to.lift : 0;
    const ease = t * t * (3 - 2 * t);
    const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.88) * 2.7;
    return {
      x: fromX + (toX - fromX) * ease,
      lift: fromLift + (toLift - fromLift) * ease + stride,
      rot: (from && from.rot != null ? from.rot : 9.2) * (1 - ease),
    };
  }
`;

const TS_SAND_FNS = `
export function sandPoint(win: DeskWindow, sprite: number | undefined, work: WorkSpace) {
  const size = sprite == null ? SPRITE : sprite;
  const pad = 32;
  const span = Math.max(0, win.width - size - pad * 2);
  const x = win.x + pad + span * 0.79;
  const stool = Math.max(14, size * 0.09);
  const gripY = win.y + win.height - stool;
  const lift = gripLift(gripY, work);
  const maxLift = (work && work.height ? work.height : 800) - 48;
  return { x, lift: clamp(lift, 18, maxLift) };
}

export function sandFace(target: PlayTarget) {
  return target.approachX >= target.holdX ? -1 : 1;
}

export function sandOnPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.92) * 3.1;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (toX >= fromX ? 1 : -1) * 5.8 * (1 - ease) + stride * 0.16,
  };
}

export function sandPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  if (t < 0.16) {
    const s = t / 0.16;
    const ease = s * s * (3 - 2 * s);
    return { x: ease * 3.4, lift: ease * 2.2, rot: ease * 11.6 };
  }
  if (t < 0.84) {
    const s = (t - 0.16) / 0.68;
    const stride = Math.sin(s * Math.PI * 2.8);
    return { x: 3.4 + s * 18.2 + stride * 1.6, lift: 2.2 + Math.abs(stride) * 3.1, rot: 11.6 + stride * 7.4 };
  }
  return { x: 21.6, lift: 2.6, rot: 9.2 };
}

export function sandHoldPath(u: number) {
  const t = Math.max(0, Math.min(1, u));
  const wait = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI) * 0.28;
  return { x: 21.6, lift: 2.6 + wait, rot: 9.2 };
}

export function sandOffPath(u: number, from: PlayPoint, to: PlayPoint) {
  const t = Math.max(0, Math.min(1, u));
  const fromX = from && from.x != null ? from.x : 0;
  const toX = to && to.x != null ? to.x : fromX;
  const fromLift = from && from.lift != null ? from.lift : 0;
  const toLift = to && to.lift != null ? to.lift : 0;
  const ease = t * t * (3 - 2 * t);
  const stride = t <= 0 || t >= 1 ? 0 : Math.sin(t * Math.PI * 1.88) * 2.7;
  return {
    x: fromX + (toX - fromX) * ease,
    lift: fromLift + (toLift - fromLift) * ease + stride,
    rot: (from && (from as { rot?: number }).rot != null ? (from as { rot?: number }).rot : 9.2) * (1 - ease),
  };
}
`;

const JS_TICK = `
    if (next.phase === "sand-on") {
      const face = sandFace(target);
      const u = next.t / DUR.sandOn;
      const pose = sandOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = face;
      if (u >= 1) {
        return goPhase(next, "sand", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
      }
      return next;
    }

    if (next.phase === "sand") {
      const face = sandFace(target);
      const pose = sandPath(Math.min(1, next.t / DUR.sand));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "play";
      next.facing = face;
      if (next.t >= DUR.sand) {
        return goPhase(next, "sand-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
      }
      return next;
    }

    if (next.phase === "sand-hold") {
      const face = sandFace(target);
      const pose = sandHoldPath(Math.min(1, next.t / DUR.sandHold));
      next.x = target.holdX + pose.x * face;
      next.lift = target.holdLift + pose.lift;
      next.rot = pose.rot * face;
      next.anim = "sit";
      next.facing = face;
      if (next.t >= DUR.sandHold) {
        const leaveFace = target.landX >= target.holdX ? 1 : -1;
        const done = sandHoldPath(1);
        return goPhase(next, "sand-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
      }
      return next;
    }

    if (next.phase === "sand-off") {
      const u = next.t / DUR.sandOff;
      const pose = sandOffPath(Math.min(1, u), next.from, next.to);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "walk";
      next.facing = target.landX >= target.holdX ? 1 : -1;
      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
`;

const TS_TICK = `
  if (next.phase === "sand-on") {
    const face = sandFace(target);
    const u = next.t / DUR.sandOn;
    const pose = sandOnPath(Math.min(1, u), next.from, { x: target.holdX, lift: target.holdLift });
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = face;
    if (u >= 1) {
      return goPhase(next, "sand", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "play", face);
    }
    return next;
  }

  if (next.phase === "sand") {
    const face = sandFace(target);
    const pose = sandPath(Math.min(1, next.t / DUR.sand));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "play";
    next.facing = face;
    if (next.t >= DUR.sand) {
      return goPhase(next, "sand-hold", { x: target.holdX, lift: target.holdLift }, { x: target.holdX, lift: target.holdLift }, "sit", face);
    }
    return next;
  }

  if (next.phase === "sand-hold") {
    const face = sandFace(target);
    const pose = sandHoldPath(Math.min(1, next.t / DUR.sandHold));
    next.x = target.holdX + pose.x * face;
    next.lift = target.holdLift + pose.lift;
    next.rot = pose.rot * face;
    next.anim = "sit";
    next.facing = face;
    if (next.t >= DUR.sandHold) {
      const leaveFace = target.landX >= target.holdX ? 1 : -1;
      const done = sandHoldPath(1);
      return goPhase(next, "sand-off", { x: target.holdX + done.x * face, lift: target.holdLift + done.lift, rot: done.rot * face }, { x: target.landX, lift: 0 }, "walk", leaveFace);
    }
    return next;
  }

  if (next.phase === "sand-off") {
    const u = next.t / DUR.sandOff;
    const pose = sandOffPath(Math.min(1, u), next.from, next.to);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = "walk";
    next.facing = target.landX >= target.holdX ? 1 : -1;
    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
`;

const JS_PICK = `    if (kind === SAND) {
      const hold = sandPoint(best, size, work);
      const fromLeft = hold.x >= workW / 2;
      const approachOff = fromLeft ? -76 : 76;
      const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
      const away = hold.x < workW / 2 ? 69 : -69;
      return {
        id: best.id,
        kind,
        side: "drysand",
        holdX: hold.x,
        holdLift: hold.lift,
        approachX,
        landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
        leave: "sands",
        spin: "none",
      };
    }
`;

const TS_PICK = `  if (kind === SAND) {
    const hold = sandPoint(best, size, work);
    const fromLeft = hold.x >= workW / 2;
    const approachOff = fromLeft ? -76 : 76;
    const approachX = clamp(hold.x + approachOff, 8, Math.max(8, workW - size - 8));
    const away = hold.x < workW / 2 ? 69 : -69;
    return {
      id: best.id,
      kind,
      side: "drysand",
      holdX: hold.x,
      holdLift: hold.lift,
      approachX,
      landX: clamp(hold.x + away, 8, Math.max(8, workW - size - 8)),
      leave: "sands",
      spin: "none",
    };
  }
`;

let js = read(JS);
js = mustReplace(js, HEADER_OLD, HEADER_NEW, "js header", 1);
js = mustReplace(js, '  const SIGNAL = "signal";\n  const SILL = "sill";', '  const SIGNAL = "signal";\n  const SAND = "sand";\n  const SILL = "sill";', "js const", 1);
js = mustReplace(js, `    signalOn: 2.45,
    signal: 1.33,
    signalHold: 2.75,
    signalOff: 1.71,`, `    signalOn: 2.45,
    signal: 1.33,
    signalHold: 2.75,
    signalOff: 1.71,
    sandOn: 2.52,
    sand: 1.39,
    sandHold: 2.83,
    sandOff: 1.75,`, "js DUR", 1);
js = mustReplace(js, '    if (key === "fiddler_crab") return SIGNAL;\n    return SILL;', '    if (key === "fiddler_crab") return SIGNAL;\n    if (key === "ghost_crab") return SAND;\n    return SILL;', "js playFor", 1);
js = mustReplace(js, "    if (kind === SIGNAL) return w.width >= 190 && w.height >= 184;", "    if (kind === SIGNAL) return w.width >= 190 && w.height >= 184;\n    if (kind === SAND) return w.width >= 192 && w.height >= 158;", "js gate", 1);
js = mustReplace(js, `        leave: "signals",
        spin: "none",
      };
    }

        if (kind === WRAP) {`, `        leave: "signals",
        spin: "none",
      };
    }
${JS_PICK}
        if (kind === WRAP) {`, "js pick", 1);
js = mustReplace(js, `    if (target.kind === SIGNAL) {
      const hold = signalPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }`, `    if (target.kind === SIGNAL) {
      const hold = signalPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }
    if (target.kind === SAND) {
      const hold = sandPoint(win, sprite, work);
      return { ...target, holdX: hold.x, holdLift: hold.lift };
    }`, "js refit", 1);
js = mustReplace(js, "  function beginPlay(target, petX) {", JS_SAND_FNS + "\n  function beginPlay(target, petX) {", "js fns", 1);
js = mustReplace(js, `        if (target.kind === SIGNAL) {
          return goPhase(next, "signal-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }`, `        if (target.kind === SIGNAL) {
          return goPhase(next, "signal-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }
        if (target.kind === SAND) {
          return goPhase(next, "sand-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
        }`, "js begin", 1);
js = mustReplace(js, `      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }

    if (next.phase === "sill-hop") {`, `      if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
      return next;
    }
${JS_TICK}
    if (next.phase === "sill-hop") {`, "js tick", 1);
js = mustReplace(js, `    SIDE,
    SIGNAL,
    IGNORE,`, `    SIDE,
    SIGNAL,
    SAND,
    IGNORE,`, "js export const", 1);
js = mustReplace(js, `    signalHoldPath,
    signalOffPath,
    pickTarget,`, `    signalHoldPath,
    signalOffPath,
    sandPoint,
    sandFace,
    sandOnPath,
    sandPath,
    sandHoldPath,
    sandOffPath,
    pickTarget,`, "js export fns", 1);
write(JS, js);
console.log("patched JS");

let ts = read(TS);
ts = mustReplace(ts, HEADER_OLD, HEADER_NEW, "ts header", 1);
ts = mustReplace(ts, 'export const SIGNAL = "signal";\nexport const SILL = "sill";', 'export const SIGNAL = "signal";\nexport const SAND = "sand";\nexport const SILL = "sill";', "ts const", 1);
ts = mustReplace(ts, `    signalOn: 2.45,
    signal: 1.33,
    signalHold: 2.75,
    signalOff: 1.71,`, `    signalOn: 2.45,
    signal: 1.33,
    signalHold: 2.75,
    signalOff: 1.71,
    sandOn: 2.52,
    sand: 1.39,
    sandHold: 2.83,
    sandOff: 1.75,`, "ts DUR", 1);
ts = mustReplace(ts, "typeof SIDE | typeof SIGNAL | typeof SILL", "typeof SIDE | typeof SIGNAL | typeof SAND | typeof SILL", "ts kind", 1);
ts = mustReplace(ts, `  | "signal-on"
  | "signal"
  | "signal-hold"
  | "signal-off"
  | "sill-hop"`, `  | "signal-on"
  | "signal"
  | "signal-hold"
  | "signal-off"
  | "sand-on"
  | "sand"
  | "sand-hold"
  | "sand-off"
  | "sill-hop"`, "ts phase", 1);
ts = mustReplace(ts, '  if (key === "fiddler_crab") return SIGNAL;\n  return SILL;', '  if (key === "fiddler_crab") return SIGNAL;\n  if (key === "ghost_crab") return SAND;\n  return SILL;', "ts playFor", 1);
ts = mustReplace(ts, "  if (kind === SIGNAL) return w.width >= 190 && w.height >= 184;", "  if (kind === SIGNAL) return w.width >= 190 && w.height >= 184;\n  if (kind === SAND) return w.width >= 192 && w.height >= 158;", "ts gate", 1);
ts = mustReplace(ts, `      leave: "signals",
      spin: "none",
    };
  }
  if (kind === WRAP) {`, `      leave: "signals",
      spin: "none",
    };
  }
${TS_PICK}  if (kind === WRAP) {`, "ts pick", 1);
ts = mustReplace(ts, `  if (target.kind === SIGNAL) {
    const hold = signalPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }`, `  if (target.kind === SIGNAL) {
    const hold = signalPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }
  if (target.kind === SAND) {
    const hold = sandPoint(win, sprite, work);
    return { ...target, holdX: hold.x, holdLift: hold.lift };
  }`, "ts refit", 1);
ts = mustReplace(ts, "export function beginPlay(", TS_SAND_FNS + "\nexport function beginPlay(", "ts fns", 1);
ts = mustReplace(ts, `      if (target.kind === SIGNAL) {
        return goPhase(next, "signal-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }`, `      if (target.kind === SIGNAL) {
        return goPhase(next, "signal-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }
      if (target.kind === SAND) {
        return goPhase(next, "sand-on", { x: dest, lift: 0 }, { x: target.holdX, lift: target.holdLift }, "walk", dir);
      }`, "ts begin", 1);
ts = mustReplace(ts, `    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }

  if (next.phase === "sill-hop") {`, `    if (u >= 1) return goPhase(next, "land", { x: next.to.x, lift: 0 }, { x: next.to.x, lift: 0 }, "idle", next.facing);
    return next;
  }
${TS_TICK}
  if (next.phase === "sill-hop") {`, "ts tick", 1);
write(TS, ts);
console.log("patched TS");
console.log("core ok");
