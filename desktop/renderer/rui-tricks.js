/** Rui ground tricks while idle. Sleep, hide, card, and window-play still win. */
(function (root) {
  const TRICK_KEY = "red_panda";
  const TRICKS = ["somersault", "lie", "scratch", "wave", "dance"];
  /** sleep/2.png — lying down, eyes closed. Frames 3–4 are standing and must not loop. */
  const SLEEP_HOLD_FRAME = 1;
  const LIE_HOLD = 12;
  const STRETCH_S = 1.4;
  const FLIP_S = 0.92;
  const DUR = { somersault: 0.92, lie: LIE_HOLD + STRETCH_S + FLIP_S, scratch: 1.35, wave: 1.15, dance: 2.8 };

  function canStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function shouldAbort(state) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return true;
    const cmd = String(state.cmd || "");
    return (
      cmd === "sleep" ||
      cmd === "leave" ||
      cmd === "hide" ||
      cmd === "rest" ||
      cmd === "seek" ||
      cmd === "eat" ||
      cmd === "play" ||
      cmd === "talk" ||
      cmd === "enter"
    );
  }

  function nextTrickWait(justFinished, rand, kind) {
    const roll = rand == null ? Math.random() : rand;
    if (kind === "lie") return 16 + roll * 10;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "dance";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "lie") {
      if (roll < 0.28) return "somersault";
      if (roll < 0.5) return "scratch";
      if (roll < 0.72) return "wave";
      return "dance";
    }
    if (roll < 0.18) return "somersault";
    if (roll < 0.38) return "lie";
    if (roll < 0.58) return "scratch";
    if (roll < 0.76) return "wave";
    return "dance";
  }

  function sleepHoldFrame(key, frameCount) {
    if (key !== TRICK_KEY) return null;
    const len = Number(frameCount) || 0;
    if (len <= 0) return SLEEP_HOLD_FRAME;
    return Math.min(SLEEP_HOLD_FRAME, len - 1);
  }

  function beginTrick(kind, x, facing) {
    const anim = kind === "lie" ? "sleep" : kind === "scratch" ? "sit" : kind === "wave" ? "talk" : "play";
    return {
      kind,
      phase: kind === "lie" ? "lie" : "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim,
      facing: facing || 1,
      fromX: x,
      flipFrom: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function somersaultPath(u, fromX, facing) {
    const t = Math.max(0, Math.min(1, u));
    const ease = smoothstep(t);
    return { x: fromX + facing * 92 * ease, lift: Math.sin(t * Math.PI) * 46, rot: facing * 360 * t };
  }

  function wavePose(t) {
    return { lift: 4 + Math.abs(Math.sin(t * 10)) * 6, rot: Math.sin(t * 10) * 14 };
  }

  function scratchPose(t) {
    return { lift: 0, rot: Math.sin(t * 22) * 8, dx: Math.sin(t * 22) * 3 };
  }

  function liePose() {
    return { lift: 0, rot: 0 };
  }

  function stretchPose(t) {
    const u = Math.max(0, Math.min(1, t / STRETCH_S));
    return { lift: Math.sin(u * Math.PI) * 8, rot: Math.sin(u * Math.PI) * 6 };
  }

  function dancePose(t) {
    return { lift: Math.abs(Math.sin(t * 8)) * 10, rot: Math.sin(t * 6) * 12, dx: Math.sin(t * 5) * 6 };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "somersault" && trick.phase !== "flip") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "lie") {
      if (next.t < LIE_HOLD) {
        const pose = liePose();
        next.phase = "lie";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sleep";
        return next;
      }
      if (next.t < LIE_HOLD + STRETCH_S) {
        const pose = stretchPose(next.t - LIE_HOLD);
        next.phase = "stretch";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        next.flipFrom = next.x;
        return next;
      }
      if (next.t < LIE_HOLD + STRETCH_S + FLIP_S) {
        const u = (next.t - LIE_HOLD - STRETCH_S) / FLIP_S;
        const from = trick.flipFrom != null ? trick.flipFrom : trick.x;
        const pose = somersaultPath(Math.min(1, u), from, trick.facing);
        next.phase = "flip";
        next.x = pose.x;
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "play";
        next.flipFrom = from;
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "somersault") {
      const pose = somersaultPath(Math.min(1, u), trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
    } else if (next.kind === "scratch") {
      const pose = scratchPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
    } else if (next.kind === "wave") {
      const pose = wavePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "talk";
    } else {
      const pose = dancePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
    }
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    DUR,
    SLEEP_HOLD_FRAME,
    LIE_HOLD,
    STRETCH_S,
    FLIP_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    somersaultPath,
    wavePose,
    scratchPose,
    liePose,
    stretchPose,
    dancePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRuiTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
