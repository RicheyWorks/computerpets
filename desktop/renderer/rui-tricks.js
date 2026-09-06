/** Rui ground tricks while idle. Feed-happy dances sit after eat. Card-open freeze and leftover window-play do not swallow a thank-you. Sleep, hide, and leave still win. */
(function (root) {
  const TRICK_KEY = "red_panda";
  const TRICKS = ["somersault", "lie", "scratch", "wave", "dance"];
  const HAPPY = ["twirl", "bounce", "shuffle"];
  const HAPPY_DUR = { twirl: 1.35, bounce: 1.22, shuffle: 1.58 };
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
    if (kind === "lie") return 48 + roll * 24;
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
    if (roll < 0.26) return "lie";
    if (roll < 0.52) return "scratch";
    if (roll < 0.74) return "wave";
    return "dance";
  }

  function happyCanStart(state) {
    if (!state) return false;
    if (state.asleep || state.hidden || state.leaving) return false;
    const cmd = String(state.cmd || "");
    if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
    if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
    return true;
  }

  function happyShouldAbort(state) {
    if (!state) return true;
    if (state.asleep || state.hidden || state.leaving) return true;
    const cmd = String(state.cmd || "");
    return (
      cmd === "sleep" ||
      cmd === "leave" ||
      cmd === "hide" ||
      cmd === "rest" ||
      cmd === "seek" ||
      cmd === "play" ||
      cmd === "talk" ||
      cmd === "enter"
    );
  }

  function wantsThankYou(key) {
    return key === TRICK_KEY || key === "rui";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY;
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "twirl";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "shuffle" ? "walk" : "play",
      facing: facing || 1,
      fromX: x,
    };
  }

  function twirlPose(t, facing) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.twirl));
    return {
      lift: Math.abs(Math.sin(u * Math.PI * 2)) * 16,
      rot: facing * 320 * u,
      dx: 0,
      anim: "play",
    };
  }

  function bouncePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bounce));
    return {
      lift: Math.abs(Math.sin(u * Math.PI * 3)) * 28,
      rot: Math.sin(u * Math.PI * 3) * 10,
      dx: Math.sin(u * Math.PI * 3) * 4,
      anim: "play",
    };
  }

  function shufflePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shuffle));
    if (u < 0.38) {
      const s = u / 0.38;
      return { x: fromX + facing * 36 * s, lift: 0, rot: 0, anim: "walk" };
    }
    if (u < 0.76) {
      const s = (u - 0.38) / 0.38;
      return { x: fromX + facing * 36 * (1 - s), lift: 0, rot: 0, anim: "walk" };
    }
    return { x: fromX, lift: 2, rot: Math.sin((u - 0.76) / 0.24 * Math.PI) * 8, anim: "sit" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind] || HAPPY_DUR.twirl;
    if (next.kind === "twirl") {
      const pose = twirlPose(next.t, next.facing);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bounce") {
      const pose = bouncePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = shufflePose(next.t, next.fromX != null ? next.fromX : next.x, next.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
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
    HAPPY,
    HAPPY_DUR,
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
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    twirlPose,
    bouncePose,
    shufflePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRuiTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
