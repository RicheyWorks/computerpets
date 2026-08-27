/** Rui ground tricks while idle. Sleep, hide, card, and window-play still win. */
(function (root) {
  const TRICK_KEY = "red_panda";
  const TRICKS = ["somersault", "lie", "scratch", "wave", "dance"];
  const DUR = { somersault: 0.92, lie: 2.4, scratch: 1.35, wave: 1.15, dance: 2.8 };

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
    if (state.asleep || state.hidden || state.leaving || state.windowPlay) return true;
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

  function nextTrickWait(justFinished, rand) {
    const roll = rand == null ? Math.random() : rand;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn) {
    if (musicOn) return "dance";
    const roll = rand == null ? Math.random() : rand;
    if (roll < 0.18) return "somersault";
    if (roll < 0.38) return "lie";
    if (roll < 0.58) return "scratch";
    if (roll < 0.76) return "wave";
    return "dance";
  }

  function beginTrick(kind, x, facing) {
    const anim = kind === "lie" ? "sleep" : kind === "scratch" ? "sit" : kind === "wave" ? "talk" : "play";
    return { kind, phase: "go", t: 0, x: x, lift: 0, rot: 0, anim, facing: facing || 1 };
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
    return { lift: -6, rot: -18 };
  }

  function dancePose(t) {
    return { lift: Math.abs(Math.sin(t * 8)) * 10, rot: Math.sin(t * 6) * 12, dx: Math.sin(t * 5) * 6 };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "somersault") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "somersault") {
      const pose = somersaultPath(Math.min(1, u), trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "play";
    } else if (next.kind === "lie") {
      const pose = liePose();
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sleep";
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
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    beginTrick,
    somersaultPath,
    wavePose,
    scratchPose,
    liePose,
    dancePose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRuiTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
