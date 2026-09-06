/** Coin ground tricks while idle. House goldfish — drift / gulp / flare / glint / dart personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `goldfish-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, or dragon move clone. Window-play CIRCLE is unchanged — this module never names a trick `circle`. Special Loop is unchanged — never names a trick `loop`. Turtle already owns paddle — dart is a short bowl dash, not a paddle copy. Earth already owns gleam as thank-you — glint is the light-catch tilt. Avoids soak/tuck/crane/plod/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "goldfish";
  const TRICKS = ["drift", "gulp", "flare", "glint", "dart"];
  const HAPPY = ["bubble", "lip", "swish"];
  const HAPPY_DUR = { bubble: 1.28, lip: 1.15, swish: 1.05 };
  const DRIFT_HOLD = 11;
  const RELEASE_S = 0.6;
  const DUR = { drift: DRIFT_HOLD + RELEASE_S, gulp: 1.35, flare: 1.5, glint: 1.28, dart: 1.05 };

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
    if (kind === "drift") return 42 + roll * 22;
    if (kind === "dart") return 15 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "drift";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "drift") {
      if (roll < 0.26) return "gulp";
      if (roll < 0.48) return "flare";
      if (roll < 0.7) return "glint";
      return "dart";
    }
    if (lastKind === "dart") {
      if (roll < 0.36) return "drift";
      if (roll < 0.56) return "gulp";
      if (roll < 0.76) return "flare";
      return "glint";
    }
    if (roll < 0.24) return "drift";
    if (roll < 0.42) return "gulp";
    if (roll < 0.6) return "flare";
    if (roll < 0.8) return "glint";
    return "dart";
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
    return key === TRICK_KEY || key === "coin";
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
    const name = HAPPY.includes(kind) ? kind : "bubble";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "bubble" ? "talk" : name === "lip" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function bubblePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bubble));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 2.5, rot: -s * 4, dx: 0, anim: "talk" };
    }
    if (u < 0.85) {
      return {
        lift: 2.5 + Math.abs(Math.sin(t * 8)) * 2.2,
        rot: -4 + Math.sin(t * 7) * 5,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 2.5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" };
  }

  function lipPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lip));
    if (u < 0.9) {
      return {
        lift: Math.abs(Math.sin(t * 12)) * 1.6,
        rot: Math.sin(t * 14) * 6,
        dx: 0,
        anim: "sit",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.9) / 0.1) * Math.PI) * 2, dx: 0, anim: "idle" };
  }

  function swishPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.swish));
    return {
      lift: Math.sin(u * Math.PI) * 2.8,
      rot: Math.sin(u * Math.PI * 3) * 10,
      dx: Math.sin(u * Math.PI * 2) * 2.5,
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
    if (next.kind === "bubble") {
      const pose = bubblePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lip") {
      const pose = lipPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = swishPose(next.t);
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
      kind === "drift" || kind === "gulp" || kind === "flare" || kind === "glint"
        ? "sit"
        : kind === "dart"
          ? "walk"
          : "sit";
    return {
      kind,
      phase: kind === "drift" ? "hold" : "go",
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

  function driftPose(t) {
    return {
      lift: 3.2 + Math.sin(t * 1.6) * 1.4,
      rot: Math.sin(t * 1.1) * 4,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - u) };
  }

  function gulpPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.gulp));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { lift: s * 4.5, rot: -s * 6, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      return {
        lift: 4.5 + Math.abs(Math.sin(t * 10)) * 1.5,
        rot: -6 + Math.sin(t * 9) * 4,
        dx: 0,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return { lift: 4.5 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function flarePose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.flare));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { lift: s * 2.2, rot: s * 8, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      return {
        lift: 2.2 + Math.abs(Math.sin(t * 5)) * 1.8,
        rot: 8 + Math.sin(t * 6) * 7,
        dx: Math.sin(t * 4) * 1.2,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { lift: 2.2 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "sit" };
  }

  function glintPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.glint));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: s * 1.5, rot: -s * 14, dx: 0, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: 1.5 + Math.sin(t * 3) * 0.6,
        rot: -14 + Math.sin(t * 2.2) * 4,
        dx: Math.sin(t * 2) * 0.6,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: 1.5 * (1 - s), rot: -14 * (1 - s), dx: 0, anim: "sit" };
  }

  function dartPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dart));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 1.2, rot: -s * 5, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const kick = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * 18 * smoothstep(s),
        lift: 1.2 + kick * 3.5,
        rot: -5 + Math.sin(s * Math.PI * 2) * 8,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 18,
      lift: 1.5 * (1 - s),
      rot: 3 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "dart") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "drift") {
      if (next.t < DRIFT_HOLD) {
        const pose = driftPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DRIFT_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DRIFT_HOLD);
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
    if (next.kind === "gulp") {
      const pose = gulpPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "flare") {
      const pose = flarePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "glint") {
      const pose = glintPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dartPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DRIFT_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    driftPose,
    releasePose,
    gulpPose,
    flarePose,
    glintPose,
    dartPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    bubblePose,
    lipPose,
    swishPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGoldfishTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
