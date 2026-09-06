/** Peck ground tricks while idle. House penguin — huddle / toboggan / waddle / porpoise / trumpet personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `penguin-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, or dragon move clone. Window-play BOW is unchanged — this module never names a trick `bow`. Pip already owns bow. Budgie already owns preen. Turtle already owns paddle. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "penguin";
  const TRICKS = ["huddle", "toboggan", "waddle", "porpoise", "trumpet"];
  const HAPPY = ["bray", "beak", "shimmy"];
  const HAPPY_DUR = { bray: 1.22, beak: 1.12, shimmy: 1.18 };
  const HUDDLE_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { huddle: HUDDLE_HOLD + RELEASE_S, toboggan: 1.32, waddle: 1.4, porpoise: 1.26, trumpet: 1.2 };

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
    if (kind === "huddle") return 40 + roll * 20;
    if (kind === "toboggan") return 15 + roll * 10;
    if (kind === "trumpet") return 12 + roll * 9;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "huddle";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "huddle") {
      if (roll < 0.26) return "toboggan";
      if (roll < 0.48) return "waddle";
      if (roll < 0.72) return "porpoise";
      return "trumpet";
    }
    if (lastKind === "toboggan") {
      if (roll < 0.34) return "huddle";
      if (roll < 0.54) return "waddle";
      if (roll < 0.76) return "porpoise";
      return "trumpet";
    }
    if (lastKind === "trumpet") {
      if (roll < 0.22) return "huddle";
      if (roll < 0.42) return "toboggan";
      if (roll < 0.66) return "waddle";
      return "porpoise";
    }
    if (roll < 0.22) return "huddle";
    if (roll < 0.4) return "toboggan";
    if (roll < 0.6) return "waddle";
    if (roll < 0.8) return "porpoise";
    return "trumpet";
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
    return key === TRICK_KEY || key === "peck";
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
    const name = HAPPY.includes(kind) ? kind : "bray";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "bray" ? "talk" : name === "shimmy" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function brayPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bray));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 3.5, rot: -s * 8, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      return {
        lift: 3.5 + Math.abs(Math.sin(t * 10)) * 2,
        rot: -8 + Math.sin(t * 12) * 6,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 3.5 * (1 - s), rot: -8 * (1 - s), dx: 0, anim: "sit" };
  }

  function beakPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.beak));
    return {
      lift: Math.sin(u * Math.PI) * 1.8,
      rot: Math.sin(u * Math.PI * 3) * 9,
      dx: Math.sin(u * Math.PI) * 2.8,
      anim: "sit",
    };
  }

  function shimmyPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shimmy));
    if (u < 0.88) {
      return {
        lift: Math.abs(Math.sin(t * 14)) * 3.2,
        rot: Math.sin(t * 16) * 12,
        dx: Math.sin(t * 11) * 1.6,
        anim: "play",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 3, dx: 0, anim: "idle" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "bray") {
      const pose = brayPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "beak") {
      const pose = beakPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = shimmyPose(next.t);
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
      kind === "huddle"
        ? "sit"
        : kind === "toboggan"
          ? "play"
          : kind === "waddle"
            ? "walk"
            : kind === "porpoise"
              ? "play"
              : kind === "trumpet"
                ? "talk"
                : "sit";
    return {
      kind,
      phase: kind === "huddle" ? "hold" : "go",
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

  function huddlePose(t) {
    return {
      lift: 0.6 + Math.sin(t * 1.5) * 0.35,
      rot: 10 + Math.sin(t * 1.3) * 3.5 + Math.sin(t * 2.6) * 1.8,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 10 * (1 - u) };
  }

  function tobogganPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.toboggan));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: -s * 2.5, rot: s * 18 * facing, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.14) / 0.68;
      return {
        x: fromX + facing * 28 * smoothstep(s),
        lift: -2.5 + Math.sin(s * Math.PI) * 1.2,
        rot: facing * (18 - s * 6),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 28,
      lift: -2.5 * (1 - s),
      rot: facing * 12 * (1 - s),
      anim: "sit",
    };
  }

  function waddlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.waddle));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 1.2, rot: s * 8 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const step = Math.sin(s * Math.PI * 5);
      return {
        x: fromX + facing * 16 * smoothstep(s),
        lift: 1.2 + Math.abs(step) * 2.2,
        rot: facing * (8 + step * 10),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 16,
      lift: 1.2 * (1 - s),
      rot: facing * 4 * (1 - s),
      anim: "sit",
    };
  }

  function porpoisePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.porpoise));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2, rot: -s * 6, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const arc = Math.sin(s * Math.PI * 2.5);
      return {
        x: fromX + facing * 24 * smoothstep(s),
        lift: 2 + Math.max(0, arc) * 12,
        rot: facing * (arc * 16),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 24,
      lift: 2 * (1 - s),
      rot: facing * 4 * (1 - s),
      anim: "sit",
    };
  }

  function trumpetPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.trumpet));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return {
        x: fromX,
        lift: s * 5,
        rot: -s * 12,
        anim: "talk",
      };
    }
    if (u < 0.82) {
      return {
        x: fromX + facing * Math.sin(t * 7) * 1.2,
        lift: 5 + Math.abs(Math.sin(t * 9)) * 2.5,
        rot: -12 + Math.sin(t * 8) * 8,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 5 * (1 - s),
      rot: -12 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "toboggan" && trick.kind !== "porpoise") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "huddle") {
      if (next.t < HUDDLE_HOLD) {
        const pose = huddlePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HUDDLE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HUDDLE_HOLD);
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
    if (next.kind === "toboggan") {
      const pose = tobogganPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "waddle") {
      const pose = waddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "porpoise") {
      const pose = porpoisePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = trumpetPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    HUDDLE_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    huddlePose,
    releasePose,
    tobogganPose,
    waddlePose,
    porpoisePose,
    trumpetPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    brayPose,
    beakPose,
    shimmyPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPenguinTricks = api;
})(typeof window !== "undefined" ? window : globalThis);