/** Brick the American robin. One dest. Flies like Sip, lands, stays, sings, flies off. */
(function (root) {
  const ROBIN_KEY = "robin";
  const ROBIN_NAME = "Brick";
  const ROBIN_SLUG = "brick";
  const PERCH_HOST = "red_panda";
  const ROBIN_SONG = "I sang. The worm can wait.";
  const MIN_STAY_S = 24;
  const SONG_EVERY_S = 8;
  const LAND_S = 0.82;
  const LIFT_S = 0.7;
  const LEAVE_S = 1.15;
  const DEST_PX = 112;
  const SHOULDER_X = 36;
  const SHOULDER_LIFT = 36;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function flyLerp(u, from, to, arc) {
    const t = smoothstep(Math.max(0, Math.min(1, u)));
    return from + (to - from) * t + Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * arc;
  }

  function canStart(state) {
    if (!state) return true;
    return !state.hidden;
  }

  function shouldAbort(state) {
    return !!(state && state.hidden);
  }

  function shouldPerch(flags) {
    if (!flags || flags.hidden) return false;
    if (flags.hostKey && flags.hostKey !== PERCH_HOST) return false;
    return !!flags.hostSleeping;
  }

  function perchPoint(hostX, hostFacing, hostLift) {
    const face = hostFacing < 0 ? -1 : 1;
    return {
      x: (hostX || 0) + face * SHOULDER_X,
      lift: (hostLift || 0) + SHOULDER_LIFT,
    };
  }

  function beginRobinFly(width, height, fromRight) {
    const w = Math.max(320, width || 800);
    const h = Math.max(240, height || 480);
    const right = fromRight !== false;
    const startX = right ? w + 24 : -80;
    const destX = clamp(w * (right ? 0.68 : 0.32), 48, w - 130);
    const destLift = clamp(h * 0.28, 64, h - 90);
    return {
      key: ROBIN_KEY,
      phase: "enter",
      t: 0,
      age: 0,
      x: startX,
      lift: destLift + 36,
      rot: 0,
      facing: right ? -1 : 1,
      fromX: startX,
      toX: destX,
      fromLift: destLift + 36,
      toLift: destLift,
      sungAt: 0,
      flap: 0,
    };
  }

  function goLand(fly, width) {
    const w = Math.max(320, width || 800);
    const destX = clamp(fly.toX || fly.x, 48, w - 130);
    return {
      ...fly,
      phase: "land",
      t: 0,
      fromX: fly.x,
      toX: destX,
      fromLift: fly.lift,
      toLift: 0,
      facing: destX >= fly.x ? 1 : -1,
    };
  }

  function goLeave(fly, width) {
    const w = Math.max(320, width || 800);
    const out = fly.facing < 0 ? -120 : w + 40;
    return {
      ...fly,
      phase: "leave",
      t: 0,
      fromX: fly.x,
      toX: out,
      fromLift: fly.lift || 0,
      toLift: (fly.lift || 0) + 56,
      facing: out >= fly.x ? 1 : -1,
    };
  }

  function goPerch(fly, flags) {
    const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
    return {
      ...fly,
      phase: "approach-perch",
      t: 0,
      fromX: fly.x,
      toX: hold.x,
      fromLift: fly.lift || 0,
      toLift: hold.lift,
      facing: hold.x >= fly.x ? 1 : -1,
    };
  }

  function isFlying(phase) {
    return phase === "enter" || phase === "cruise" || phase === "land" || phase === "lift" || phase === "leave" || phase === "approach-perch";
  }

  function wingBeat(age, phase) {
    if (!isFlying(phase)) return 1;
    return 0.84 + 0.16 * Math.abs(Math.sin((age || 0) * 16));
  }

  function destStyle() {
    return {
      width: DEST_PX + "px",
      height: DEST_PX + "px",
      objectFit: "contain",
      objectPosition: "bottom",
      border: "0",
      outline: "none",
      background: "transparent",
      boxShadow: "none",
    };
  }

  function applyDest(img) {
    if (!img) return false;
    const style = destStyle();
    if (img.style) Object.assign(img.style, style);
    // Width and height attributes clear a canvas backing store. The sprite surface owns that bitmap.
    if (img.setAttribute && typeof img.getContext !== "function") {
      img.setAttribute("width", String(DEST_PX));
      img.setAttribute("height", String(DEST_PX));
    }
    return true;
  }

  function poseKind(fly) {
    if (!fly) return "idle";
    if (isFlying(fly.phase)) return "play";
    if (fly.phase === "perch" || fly.phase === "stay") return "sit";
    return "idle";
  }

  function destSrc(fly, sprites) {
    const pack = sprites && typeof sprites === "object" ? sprites : {};
    const kind = poseKind(fly);
    const play = Array.isArray(pack.play) ? pack.play.filter(Boolean) : [];
    const sit = Array.isArray(pack.sit) ? pack.sit.filter(Boolean) : [];
    const idle = Array.isArray(pack.idle) ? pack.idle.filter(Boolean) : [];
    const walk = Array.isArray(pack.walk) ? pack.walk.filter(Boolean) : [];
    let frames = kind === "play" ? play : kind === "sit" ? sit : idle;
    if (!frames.length) frames = play.length ? play : sit.length ? sit : idle.length ? idle : walk;
    if (!frames.length) return "";
    const i = Math.abs((fly && fly.frame) || 0) % frames.length;
    return frames[i] || frames[0];
  }

  function shouldSing(fly) {
    if (!fly || (fly.phase !== "stay" && fly.phase !== "perch")) return false;
    return fly.age + 0.0001 >= (fly.sungAt || 0);
  }

  function markSung(fly) {
    return { ...fly, sungAt: (fly.age || 0) + SONG_EVERY_S };
  }

  function stillVisible(fly) {
    return !!(fly && fly.phase !== "done");
  }

  function asPeer(fly) {
    if (!stillVisible(fly)) return null;
    return { key: ROBIN_KEY, x: fly.x, lift: fly.lift || 0, phase: fly.phase === "stay" ? "stay" : fly.phase === "perch" ? "perch" : "in" };
  }

  function stepRobinFly(fly, dt, width, height, flags) {
    if (!fly || fly.phase === "done") return fly;
    if (shouldAbort(flags)) return { ...fly, phase: "done" };
    const next = { ...fly, t: fly.t + Math.max(0, dt), age: fly.age + Math.max(0, dt) };
    next.flap = wingBeat(next.age, next.phase);
    const perchNow = shouldPerch(flags);
    if (perchNow && next.phase !== "approach-perch" && next.phase !== "perch" && next.phase !== "leave") {
      return goPerch(next, flags);
    }
    if (!perchNow && (next.phase === "approach-perch" || next.phase === "perch")) {
      return { ...next, phase: "lift", t: 0, fromX: next.x, toX: next.x, fromLift: next.lift || 0, toLift: (next.lift || 0) + 40 };
    }

    if (next.phase === "enter") {
      const u = next.t / 1.2;
      next.x = flyLerp(u, next.fromX, next.toX, 0);
      next.lift = flyLerp(u, next.fromLift, next.toLift, 22);
      next.rot = Math.sin(u * Math.PI) * 10 * next.facing;
      if (u >= 1) return { ...next, phase: "cruise", t: 0, x: next.toX, lift: next.toLift };
      return next;
    }
    if (next.phase === "cruise") {
      next.x = next.toX + Math.sin(next.age * 2.4) * 12;
      next.lift = next.toLift + Math.sin(next.age * 9) * 6;
      next.rot = Math.sin(next.age * 8) * 7;
      if (next.t >= 1.8) return goLand(next, width);
      return next;
    }
    if (next.phase === "land") {
      const u = next.t / LAND_S;
      next.x = flyLerp(u, next.fromX, next.toX, 8);
      next.lift = flyLerp(u, next.fromLift, 0, 14);
      next.rot = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * 6 * next.facing;
      if (u >= 1) return { ...next, phase: "stay", t: 0, x: next.toX, lift: 0, rot: 0, flap: 1 };
      return next;
    }
    if (next.phase === "stay") {
      next.lift = 0;
      next.rot = Math.sin(next.age * 1.6) * 1.2;
      next.flap = 1;
      if (next.t >= MIN_STAY_S) return goLeave(next, width);
      return next;
    }
    if (next.phase === "approach-perch") {
      const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
      next.toX = hold.x;
      next.toLift = hold.lift;
      const u = next.t / LAND_S;
      next.x = flyLerp(u, next.fromX, hold.x, 8);
      next.lift = flyLerp(u, next.fromLift, hold.lift, 10);
      next.rot = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * 6 * next.facing;
      if (u >= 1) return { ...next, phase: "perch", t: 0, x: hold.x, lift: hold.lift, rot: 0, flap: 1 };
      return next;
    }
    if (next.phase === "perch") {
      const hold = perchPoint(flags && flags.hostX, flags && flags.hostFacing, flags && flags.hostLift);
      next.x = hold.x + Math.sin(next.age * 1.3) * 1.1;
      next.lift = hold.lift + Math.sin(next.age * 2) * 0.7;
      next.rot = Math.sin(next.age * 2.2) * 1.4;
      next.flap = 1;
      return next;
    }
    if (next.phase === "lift") {
      const u = next.t / LIFT_S;
      next.x = flyLerp(u, next.fromX, next.toX, 0);
      next.lift = flyLerp(u, next.fromLift, next.toLift, 8);
      next.rot = Math.sin(Math.max(0, Math.min(1, u)) * Math.PI) * 5;
      if (u >= 1) return goLeave(next, width);
      return next;
    }
    if (next.phase === "leave") {
      const u = next.t / LEAVE_S;
      next.x = flyLerp(u, next.fromX, next.toX, 0);
      next.lift = flyLerp(u, next.fromLift, next.toLift, 16);
      next.rot = Math.sin(u * Math.PI) * 8 * next.facing;
      if (u >= 1) return { ...next, phase: "done" };
      return next;
    }
    return next;
  }

  const api = {
    ROBIN_KEY,
    ROBIN_NAME,
    ROBIN_SLUG,
    PERCH_HOST,
    ROBIN_SONG,
    MIN_STAY_S,
    SONG_EVERY_S,
    DEST_PX,
    canStart,
    shouldAbort,
    shouldPerch,
    perchPoint,
    beginRobinFly,
    stepRobinFly,
    shouldSing,
    markSung,
    stillVisible,
    isFlying,
    wingBeat,
    destStyle,
    applyDest,
    destSrc,
    poseKind,
    asPeer,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRobinFly = api;
})(typeof window !== "undefined" ? window : globalThis);
