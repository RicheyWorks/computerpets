/** Rue ground tricks while idle. House fox — den / mouser / stalk / trot / prance personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `fox-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, or dragon move clone. Window-play SCENT is unchanged — this module never names a trick `scent`. Dog already owns sniff/bow/zoom/wag/wait — Rue is Vulpes, not a corgi. Cat already owns pounce — mouser is the vertical hunting leap. Rabbit already owns dig — no dig here. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "fox";
  const TRICKS = ["den", "mouser", "stalk", "trot", "prance"];
  const HAPPY = ["yip", "chuff", "nuzzle"];
  const HAPPY_DUR = { yip: 1.18, chuff: 1.15, nuzzle: 1.28 };
  const DEN_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { den: DEN_HOLD + RELEASE_S, mouser: 1.28, stalk: 1.45, trot: 1.22, prance: 1.12 };

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
    if (kind === "den") return 40 + roll * 20;
    if (kind === "mouser") return 15 + roll * 10;
    if (kind === "prance") return 12 + roll * 9;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "den";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "den") {
      if (roll < 0.26) return "mouser";
      if (roll < 0.48) return "stalk";
      if (roll < 0.72) return "trot";
      return "prance";
    }
    if (lastKind === "mouser") {
      if (roll < 0.34) return "den";
      if (roll < 0.54) return "stalk";
      if (roll < 0.76) return "trot";
      return "prance";
    }
    if (lastKind === "prance") {
      if (roll < 0.22) return "den";
      if (roll < 0.42) return "mouser";
      if (roll < 0.66) return "stalk";
      return "trot";
    }
    if (roll < 0.22) return "den";
    if (roll < 0.4) return "mouser";
    if (roll < 0.6) return "stalk";
    if (roll < 0.8) return "trot";
    return "prance";
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
    return key === TRICK_KEY || key === "rue";
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
    const name = HAPPY.includes(kind) ? kind : "yip";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "yip" ? "talk" : name === "chuff" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function yipPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.yip));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 4, rot: -s * 6, dx: 0, anim: "talk" };
    }
    if (u < 0.78) {
      return {
        lift: 4 + Math.abs(Math.sin(t * 11)) * 2.2,
        rot: -6 + Math.sin(t * 14) * 5,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 4 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function chuffPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chuff));
    if (u < 0.88) {
      return {
        lift: Math.abs(Math.sin(t * 8)) * 1.8,
        rot: Math.sin(t * 7) * 6,
        dx: Math.sin(t * 5) * 1.1,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 2.5, dx: 0, anim: "idle" };
  }

  function nuzzlePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nuzzle));
    return {
      lift: Math.sin(u * Math.PI) * 2.2,
      rot: Math.sin(u * Math.PI * 2) * 10,
      dx: Math.sin(u * Math.PI) * 3.5,
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
    if (next.kind === "yip") {
      const pose = yipPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chuff") {
      const pose = chuffPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = nuzzlePose(next.t);
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
      kind === "den" || kind === "stalk"
        ? "sit"
        : kind === "mouser"
          ? "play"
          : kind === "trot"
            ? "walk"
            : kind === "prance"
              ? "play"
              : "sit";
    return {
      kind,
      phase: kind === "den" ? "hold" : "go",
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

  function denPose(t) {
    return {
      lift: 0.8 + Math.sin(t * 1.6) * 0.45,
      rot: 12 + Math.sin(t * 1.4) * 4 + Math.sin(t * 2.8) * 2,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 12 * (1 - u) };
  }

  function mouserPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mouser));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 2, rot: -s * 8, anim: "sit" };
    }
    if (u < 0.42) {
      const s = smoothstep((u - 0.18) / 0.24);
      return {
        x: fromX + facing * 4 * s,
        lift: 2 + s * 16,
        rot: -8 + s * 18,
        anim: "play",
      };
    }
    if (u < 0.72) {
      const s = smoothstep((u - 0.42) / 0.3);
      return {
        x: fromX + facing * (4 + 6 * s),
        lift: 18 * (1 - s) + 1.5,
        rot: 10 - s * 14,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 10,
      lift: 1.5 * (1 - s),
      rot: -4 * (1 - s),
      anim: "sit",
    };
  }

  function stalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stalk));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 1.2, rot: s * 3 * facing, anim: "sit" };
    }
    if (u < 0.85) {
      const s = (u - 0.12) / 0.73;
      const step = Math.sin(s * Math.PI * 4);
      return {
        x: fromX + facing * 18 * smoothstep(s),
        lift: -1.2 + Math.abs(step) * 1.4,
        rot: facing * (3 + step * 5),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return {
      x: fromX + facing * 18,
      lift: -1.2 * (1 - s),
      rot: facing * 2 * (1 - s),
      anim: "sit",
    };
  }

  function trotPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.trot));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 2.2, rot: s * 5 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const step = Math.sin(s * Math.PI * 5);
      return {
        x: fromX + facing * 22 * smoothstep(s),
        lift: 2.2 + Math.abs(step) * 3.5,
        rot: facing * (5 + step * 7),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 22,
      lift: 2.2 * (1 - s),
      rot: facing * 3 * (1 - s),
      anim: "sit",
    };
  }

  function prancePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.prance));
    if (u < 0.9) {
      return {
        x: fromX + facing * Math.sin(t * 9) * 3,
        lift: Math.abs(Math.sin(t * 12)) * 7,
        rot: Math.sin(t * 10) * 14,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return {
      x: fromX,
      lift: 0,
      rot: 8 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "mouser" && trick.kind !== "trot") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "den") {
      if (next.t < DEN_HOLD) {
        const pose = denPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DEN_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DEN_HOLD);
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
    if (next.kind === "mouser") {
      const pose = mouserPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stalk") {
      const pose = stalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "trot") {
      const pose = trotPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = prancePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DEN_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    denPose,
    releasePose,
    mouserPose,
    stalkPose,
    trotPose,
    prancePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    yipPose,
    chuffPose,
    nuzzlePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFoxTricks = api;
})(typeof window !== "undefined" ? window : globalThis);