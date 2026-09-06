/** Thimble ground tricks while idle. House rabbit — flop / groom / periscope / dig / binky personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `rabbit-tricks.ts`. Not a Rui, cat, dog, or dragon move clone. Window-play floor thump is unchanged — this module never names a trick `thump` or `bow`. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. */
(function (root) {
  const TRICK_KEY = "rabbit";
  const TRICKS = ["flop", "groom", "periscope", "dig", "binky"];
  const HAPPY = ["twitch", "ears", "nudge"];
  const HAPPY_DUR = { twitch: 1.28, ears: 1.2, nudge: 1.1 };
  const FLOP_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { flop: FLOP_HOLD + RELEASE_S, groom: 1.5, periscope: 1.45, dig: 1.4, binky: 1.05 };

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
    if (kind === "flop") return 40 + roll * 20;
    if (kind === "binky") return 14 + roll * 10;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "flop";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "flop") {
      if (roll < 0.3) return "groom";
      if (roll < 0.52) return "periscope";
      if (roll < 0.74) return "dig";
      return "binky";
    }
    if (lastKind === "binky") {
      if (roll < 0.4) return "flop";
      if (roll < 0.65) return "groom";
      if (roll < 0.85) return "periscope";
      return "dig";
    }
    if (roll < 0.24) return "flop";
    if (roll < 0.42) return "groom";
    if (roll < 0.6) return "periscope";
    if (roll < 0.8) return "dig";
    return "binky";
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
    return key === TRICK_KEY || key === "thimble";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.includes(kind) ? kind : "twitch";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "ears" ? "sit" : name === "twitch" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function twitchPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.twitch));
    if (u < 0.85) {
      return {
        lift: Math.abs(Math.sin(t * 22)) * 1.8,
        rot: Math.sin(t * 20) * 4,
        dx: 0,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.85) / 0.15) * Math.PI) * 1.5, dx: 0, anim: "sit" };
  }

  function earsPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ears));
    if (u < 0.3) {
      const s = u / 0.3;
      return { lift: -s * 1.2, rot: s * 10, dx: 0, anim: "sit" };
    }
    if (u < 0.7) {
      return { lift: -1.2, rot: 10 + Math.sin(t * 6) * 2, dx: 0, anim: "sit" };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: -1.2 * (1 - s), rot: 10 * (1 - s), dx: 0, anim: "sit" };
  }

  function nudgePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nudge));
    return {
      lift: Math.sin(u * Math.PI) * 6,
      rot: Math.sin(u * Math.PI * 2) * 4,
      dx: Math.sin(u * Math.PI) * 3,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "twitch") {
      const pose = twitchPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ears") {
      const pose = earsPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = nudgePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "flop" || kind === "groom" || kind === "periscope" || kind === "dig"
        ? "sit"
        : kind === "binky"
          ? "play"
          : "sit";
    return {
      kind,
      phase: kind === "flop" ? "hold" : "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim,
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function flopPose() {
    return { lift: -3, rot: -8 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -3 + Math.sin(u * Math.PI) * 4, rot: -8 + Math.sin(u * Math.PI) * 8 };
  }

  function groomPose(t) {
    return {
      lift: -1.2 + Math.abs(Math.sin(t * 9)) * 1.8,
      rot: Math.sin(t * 10) * 7,
      dx: 0,
      anim: "sit",
    };
  }

  function periscopePose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.periscope));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: s * 8, rot: s * 3, dx: 0, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: 8 + Math.sin(t * 4) * 1.2,
        rot: 3 + Math.sin(t * 5) * 4,
        dx: Math.sin(t * 3) * 1.5,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: 8 * (1 - s), rot: 3 * (1 - s), dx: 0, anim: "sit" };
  }

  function digPose(t) {
    return {
      lift: -2 + Math.abs(Math.sin(t * 14)) * 3.5,
      rot: Math.sin(t * 12) * 6,
      dx: Math.sin(t * 10) * 2,
      anim: "sit",
    };
  }

  function binkyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.binky));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: -s * 3, rot: s * 5, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.22) / 0.5;
      return {
        x: fromX + facing * 18 * smoothstep(s),
        lift: Math.sin(s * Math.PI) * 16,
        rot: Math.sin(s * Math.PI * 2) * 18,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 18,
      lift: 2 * (1 - s),
      rot: 4 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "binky") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "flop") {
      if (next.t < FLOP_HOLD) {
        const pose = flopPose();
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < FLOP_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - FLOP_HOLD);
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
    if (next.kind === "groom") {
      const pose = groomPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "periscope") {
      const pose = periscopePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dig") {
      const pose = digPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = binkyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    FLOP_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    flopPose,
    releasePose,
    groomPose,
    periscopePose,
    digPose,
    binkyPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    twitchPose,
    earsPose,
    nudgePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRabbitTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
