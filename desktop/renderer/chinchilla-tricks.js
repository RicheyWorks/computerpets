/** Floss ground tricks while idle. House chinchilla — ash / bound / fluff / chin / sift personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `chinchilla-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, or dragon move clone. Window-play DUST is unchanged — this module never names a trick `dust`. Hedgehog already owns curl/snuffle/anoint/bristle/root and snort/soft/grunt. Ferret already owns tube/romp/steal/puff/noodle. Rabbit already owns groom. Guinea pig already owns popcorn. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/tube/romp/steal/puff/noodle/thread/ball/curl/snuffle/anoint/bristle/root/dust name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "chinchilla";
  const TRICKS = ["ash", "bound", "fluff", "chin", "sift"];
  const HAPPY = ["eep", "coo", "bark"];
  const HAPPY_DUR = { eep: 1.14, coo: 1.3, bark: 1.18 };
  const ASH_HOLD = 9.2;
  const RELEASE_S = 0.64;
  const DUR = { ash: ASH_HOLD + RELEASE_S, bound: 1.28, fluff: 1.36, chin: 1.22, sift: 1.32 };

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
    if (kind === "ash") return 38 + roll * 22;
    if (kind === "bound") return 12 + roll * 9;
    if (kind === "fluff") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "ash";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "ash") {
      if (roll < 0.28) return "bound";
      if (roll < 0.5) return "fluff";
      if (roll < 0.72) return "chin";
      return "sift";
    }
    if (lastKind === "bound") {
      if (roll < 0.3) return "ash";
      if (roll < 0.52) return "fluff";
      if (roll < 0.74) return "chin";
      return "sift";
    }
    if (lastKind === "fluff") {
      if (roll < 0.24) return "ash";
      if (roll < 0.46) return "bound";
      if (roll < 0.68) return "chin";
      return "sift";
    }
    if (roll < 0.22) return "ash";
    if (roll < 0.4) return "bound";
    if (roll < 0.6) return "fluff";
    if (roll < 0.8) return "chin";
    return "sift";
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
    return key === TRICK_KEY || key === "floss";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "eep";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "eep" ? "talk" : name === "coo" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function eepPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.eep));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.6, rot: -s * 6, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      return {
        lift: 2.6 + Math.abs(Math.sin(t * 11)) * 1.6,
        rot: -6 + Math.sin(t * 13) * 5,
        dx: Math.sin(t * 9) * 0.7,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.6 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function cooPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.coo));
    if (u < 0.88) {
      return {
        lift: Math.sin(u * Math.PI) * 1.6,
        rot: 12 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI * 2) * 3.5,
        dx: Math.sin(u * Math.PI) * 1.0,
        anim: "sit",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 2, dx: 0, anim: "idle" };
  }

  function barkPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 10)) * 3.0,
      rot: Math.sin(t * 12) * 10,
      dx: Math.sin(t * 8) * 1.2,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "eep") {
      const pose = eepPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "coo") {
      const pose = cooPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = barkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "ash"
        ? "sit"
        : kind === "bound"
          ? "play"
          : kind === "fluff"
            ? "sit"
            : kind === "chin"
              ? "sit"
              : kind === "sift"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "ash" ? "hold" : "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: anim,
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function ashPose(t) {
    return {
      lift: 0.5 + Math.sin(t * 2.4) * 1.4 + Math.abs(Math.sin(t * 4.2)) * 0.8,
      rot: 48 + Math.sin(t * 3.1) * 28 + Math.sin(t * 5.5) * 12,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (0.5 + 1.4) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 48 * (1 - u) };
  }

  function boundPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bound));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 1.2, rot: -s * 8 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.12) / 0.74;
      const hop = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * (18 * smoothstep(s) + Math.sin(s * Math.PI * 3) * 2),
        lift: 1.2 + Math.abs(hop) * 7.5,
        rot: facing * (-8 + hop * 14),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 18,
      lift: 1.2 * (1 - s),
      rot: facing * -4 * (1 - s),
      anim: "sit",
    };
  }

  function fluffPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fluff));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.8, rot: s * 6 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.4,
        lift: 2.8 + Math.sin(s * Math.PI * 2.5) * 1.6,
        rot: facing * (6 + Math.sin(s * Math.PI * 3) * 8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 2.8 * (1 - s),
      rot: facing * 3 * (1 - s),
      anim: "sit",
    };
  }

  function chinPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chin));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: -s * 2.4, rot: s * 10 * facing, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.16) / 0.66;
      return {
        x: fromX + facing * Math.sin(s * Math.PI * 3) * 2.2,
        lift: -2.4 + Math.abs(Math.sin(s * Math.PI * 4)) * 1.2,
        rot: facing * (10 + Math.sin(s * Math.PI * 5) * 7),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: -2.4 * (1 - s),
      rot: facing * 5 * (1 - s),
      anim: "sit",
    };
  }

  function siftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sift));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return {
        x: fromX,
        lift: s * 2.2,
        rot: -s * 12 * facing,
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const shake = Math.sin(s * Math.PI * 7);
      return {
        x: fromX + facing * shake * 2.8,
        lift: 2.2 + Math.abs(shake) * 2.4,
        rot: facing * (-12 + shake * 22),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 2.2 * (1 - s),
      rot: facing * -6 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "bound" && trick.kind !== "sift") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "ash") {
      if (next.t < ASH_HOLD) {
        const pose = ashPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ASH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ASH_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "bound") {
      const pose = boundPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fluff") {
      const pose = fluffPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chin") {
      const pose = chinPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = siftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    DUR,
    ASH_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    ashPose,
    releasePose,
    boundPose,
    fluffPose,
    chinPose,
    siftPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    eepPose,
    cooPose,
    barkPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetChinchillaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
