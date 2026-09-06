/** Quill ground tricks while idle. House parrot — quote / strut / fan / crack / flash personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `parrot-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, or dragon move clone. Window-play HOOK is unchanged — this module never names a trick `hook`. Budgie already owns preen/mimic/bobble/sidle/dangle and whistle/trill/ruffle. Penguin already owns beak as thank-you. Pip already owns bow. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/hook name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "parrot";
  const TRICKS = ["quote", "strut", "fan", "crack", "flash"];
  const HAPPY = ["squawk", "bravo", "scissor"];
  const HAPPY_DUR = { squawk: 1.24, bravo: 1.16, scissor: 1.1 };
  const QUOTE_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { quote: QUOTE_HOLD + RELEASE_S, strut: 1.38, fan: 1.28, crack: 1.22, flash: 1.18 };

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
    if (kind === "quote") return 40 + roll * 20;
    if (kind === "strut") return 14 + roll * 10;
    if (kind === "flash") return 12 + roll * 9;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "quote";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "quote") {
      if (roll < 0.26) return "strut";
      if (roll < 0.48) return "fan";
      if (roll < 0.72) return "crack";
      return "flash";
    }
    if (lastKind === "strut") {
      if (roll < 0.34) return "quote";
      if (roll < 0.54) return "fan";
      if (roll < 0.76) return "crack";
      return "flash";
    }
    if (lastKind === "flash") {
      if (roll < 0.22) return "quote";
      if (roll < 0.42) return "strut";
      if (roll < 0.66) return "fan";
      return "crack";
    }
    if (roll < 0.22) return "quote";
    if (roll < 0.4) return "strut";
    if (roll < 0.6) return "fan";
    if (roll < 0.8) return "crack";
    return "flash";
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
    return key === TRICK_KEY || key === "quill";
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
    const name = HAPPY.includes(kind) ? kind : "squawk";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "squawk" ? "talk" : name === "bravo" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function squawkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.squawk));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 4.2, rot: -s * 10, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      return {
        lift: 4.2 + Math.abs(Math.sin(t * 11)) * 2.4,
        rot: -10 + Math.sin(t * 13) * 7,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 4.2 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" };
  }

  function bravoPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bravo));
    if (u < 0.88) {
      return {
        lift: Math.abs(Math.sin(t * 13)) * 4.5,
        rot: Math.sin(t * 15) * 14,
        dx: Math.sin(t * 9) * 1.4,
        anim: "play",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 3, dx: 0, anim: "idle" };
  }

  function scissorPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scissor));
    return {
      lift: Math.sin(u * Math.PI) * 1.4,
      rot: Math.sin(u * Math.PI * 5) * 8,
      dx: Math.sin(u * Math.PI * 2) * 1.6,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "squawk") {
      const pose = squawkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bravo") {
      const pose = bravoPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = scissorPose(next.t);
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
      kind === "quote"
        ? "talk"
        : kind === "strut"
          ? "walk"
          : kind === "fan"
            ? "play"
            : kind === "crack"
              ? "sit"
              : kind === "flash"
                ? "play"
                : "sit";
    return {
      kind,
      phase: kind === "quote" ? "hold" : "go",
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

  function quotePose(t) {
    return {
      lift: 2.2 + Math.sin(t * 1.8) * 0.7,
      rot: -14 + Math.sin(t * 2.1) * 4 + Math.sin(t * 5.2) * 2.5,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -14 * (1 - u) };
  }

  function strutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.strut));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 1.8, rot: s * 10 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const step = Math.sin(s * Math.PI * 4.5);
      return {
        x: fromX + facing * 22 * smoothstep(s),
        lift: 1.8 + Math.abs(step) * 3.2,
        rot: facing * (10 + step * 12),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 22,
      lift: 1.8 * (1 - s),
      rot: facing * 5 * (1 - s),
      anim: "sit",
    };
  }

  function fanPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fan));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.5, rot: -s * 6, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.16) / 0.62;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 2,
        lift: 3.5 + Math.sin(s * Math.PI) * 4.5,
        rot: -6 + Math.sin(s * Math.PI * 2) * 16,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 3.5 * (1 - s),
      rot: 2 * (1 - s),
      anim: "sit",
    };
  }

  function crackPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.crack));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 1.5, rot: s * 8 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.12) / 0.74;
      const bite = Math.sin(s * Math.PI * 6);
      return {
        x: fromX + facing * Math.abs(bite) * 1.8,
        lift: -1.5 + Math.abs(bite) * 2.2,
        rot: facing * (8 + bite * 10),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: -1.5 * (1 - s),
      rot: facing * 4 * (1 - s),
      anim: "sit",
    };
  }

  function flashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flash));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return {
        x: fromX,
        lift: s * 7,
        rot: -s * 14,
        anim: "play",
      };
    }
    if (u < 0.72) {
      return {
        x: fromX + facing * Math.sin(t * 8) * 1.5,
        lift: 7 + Math.abs(Math.sin(t * 10)) * 2,
        rot: -14 + Math.sin(t * 9) * 10,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 7 * (1 - s),
      rot: -14 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "strut" && trick.kind !== "flash") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "quote") {
      if (next.t < QUOTE_HOLD) {
        const pose = quotePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "talk";
        return next;
      }
      if (next.t < QUOTE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - QUOTE_HOLD);
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
    if (next.kind === "strut") {
      const pose = strutPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fan") {
      const pose = fanPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "crack") {
      const pose = crackPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = flashPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    QUOTE_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    quotePose,
    releasePose,
    strutPose,
    fanPose,
    crackPose,
    flashPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    squawkPose,
    bravoPose,
    scissorPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetParrotTricks = api;
})(typeof window !== "undefined" ? window : globalThis);