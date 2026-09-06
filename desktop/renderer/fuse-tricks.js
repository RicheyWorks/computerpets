/** Fuse ground tricks while idle. Cartridge Dragon — seat / hold-current / blow / reseat personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `fuse-tricks.ts`. Not a Rui or Relay move clone. Window-play `hold` is unchanged. */
(function (root) {
  const TRICK_KEY = "fuse_dragon";
  const TRICKS = ["seat", "current", "blow", "reseat"];
  const HAPPY = ["warm", "snap", "pulse"];
  const HAPPY_DUR = { warm: 1.28, snap: 1.12, pulse: 1.36 };
  const CURRENT_HOLD = 9.5;
  const RELEASE_S = 0.55;
  const DUR = { seat: 1.05, current: CURRENT_HOLD + RELEASE_S, blow: 0.92, reseat: 2.2 };

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
    if (kind === "current") return 42 + roll * 20;
    if (kind === "blow") return 14 + roll * 10;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "current";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "current") {
      if (roll < 0.34) return "seat";
      if (roll < 0.58) return "reseat";
      return "blow";
    }
    if (lastKind === "blow") {
      if (roll < 0.55) return "reseat";
      if (roll < 0.8) return "seat";
      return "current";
    }
    if (roll < 0.28) return "seat";
    if (roll < 0.4) return "current";
    if (roll < 0.62) return "blow";
    return "reseat";
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
    return key === TRICK_KEY || key === "fuse";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "warm";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "snap" ? "sit" : name === "pulse" ? "talk" : "play",
      facing: facing || 1,
      fromX: x,
    };
  }

  function warmPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.warm));
    return {
      lift: Math.sin(u * Math.PI) * 10,
      rot: Math.sin(u * Math.PI * 2) * 6,
      dx: 0,
      anim: "play",
    };
  }

  function snapPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.snap));
    if (u < 0.35) {
      const s = u / 0.35;
      return { lift: (1 - s) * 6, rot: (1 - s) * 8, dx: 0, anim: "sit" };
    }
    if (u < 0.7) {
      return { lift: 0, rot: Math.sin(((u - 0.35) / 0.35) * Math.PI) * 5, dx: 0, anim: "sit" };
    }
    return { lift: 1, rot: 0, dx: 0, anim: "sit" };
  }

  function pulsePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pulse));
    if (u < 0.75) {
      return {
        lift: Math.abs(Math.sin(t * 18)) * 5,
        rot: Math.sin(t * 20) * 7,
        dx: Math.sin(t * 20) * 1.5,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.75) / 0.25) * Math.PI) * 3, dx: 0, anim: "sit" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind] || HAPPY_DUR.warm;
    if (next.kind === "warm") {
      const pose = warmPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "snap") {
      const pose = snapPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pulsePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame() {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim = kind === "seat" || kind === "current" ? "sit" : kind === "blow" ? "play" : "walk";
    return {
      kind,
      phase: kind === "current" ? "hold" : "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim,
      facing: facing || 1,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function seatPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.seat));
    if (u < 0.45) {
      const s = u / 0.45;
      return { lift: (1 - s) * 8, rot: (1 - smoothstep(s)) * 10, anim: "sit" };
    }
    return { lift: 0, rot: Math.sin(((u - 0.45) / 0.55) * Math.PI) * 3, anim: "sit" };
  }

  function currentPose() {
    return { lift: 0, rot: 0 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: Math.sin(u * Math.PI) * 4, rot: Math.sin(u * Math.PI * 2) * 6 };
  }

  function blowPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.blow));
    if (u < 0.22) {
      const s = u / 0.22;
      return { lift: s * 26, rot: s * 28, dx: s * 4, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.22) / 0.33;
      return {
        lift: 26 * (1 - s) + Math.abs(Math.sin(s * Math.PI * 3)) * 4,
        rot: Math.sin(s * Math.PI * 4) * 18,
        dx: Math.sin(s * Math.PI * 4) * 3,
        anim: "play",
      };
    }
    const s = (u - 0.55) / 0.45;
    return { lift: (1 - s) * 4, rot: (1 - s) * 6, dx: 0, anim: "sit" };
  }

  function reseatPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.reseat));
    if (u < 0.45) {
      const s = smoothstep(u / 0.45);
      return { x: fromX + facing * 36 * s, lift: 0, rot: 0, anim: "walk" };
    }
    if (u < 0.7) {
      const s = (u - 0.45) / 0.25;
      return { x: fromX + facing * 36, lift: (1 - s) * 5, rot: (1 - s) * 8, anim: "sit" };
    }
    return { x: fromX + facing * 36, lift: 0, rot: Math.sin(((u - 0.7) / 0.3) * Math.PI) * 3, anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "blow") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "current") {
      if (next.t < CURRENT_HOLD) {
        const pose = currentPose();
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CURRENT_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CURRENT_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "seat") {
      const pose = seatPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "blow") {
      const pose = blowPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = reseatPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
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
    CURRENT_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    seatPose,
    currentPose,
    releasePose,
    blowPose,
    reseatPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    warmPose,
    snapPose,
    pulsePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFuseTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
