/** Wick ground tricks while idle. House ferret — tube / romp / steal / puff / noodle personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `ferret-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, or dragon move clone. Window-play THREAD is unchanged — this module never names a trick `thread`. Hamster already owns scurry/nest/cheek/pocket/reel and chitter. Fox already owns den/mouser/stalk/trot/prance. Dog already owns zoom/bow. Rabbit already owns dig/flop/binky. Cat already owns pounce. Rui already owns dance/bounce. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/thread name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "ferret";
  const TRICKS = ["tube", "romp", "steal", "puff", "noodle"];
  const HAPPY = ["dook", "kiss", "chuckle"];
  const HAPPY_DUR = { dook: 1.22, kiss: 1.14, chuckle: 1.18 };
  const TUBE_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { tube: TUBE_HOLD + RELEASE_S, romp: 1.36, steal: 1.28, puff: 1.2, noodle: 1.24 };

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
    if (kind === "tube") return 40 + roll * 20;
    if (kind === "romp") return 14 + roll * 10;
    if (kind === "steal") return 12 + roll * 9;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tube";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tube") {
      if (roll < 0.28) return "romp";
      if (roll < 0.5) return "steal";
      if (roll < 0.72) return "puff";
      return "noodle";
    }
    if (lastKind === "romp") {
      if (roll < 0.32) return "tube";
      if (roll < 0.52) return "steal";
      if (roll < 0.74) return "puff";
      return "noodle";
    }
    if (lastKind === "steal") {
      if (roll < 0.24) return "tube";
      if (roll < 0.44) return "romp";
      if (roll < 0.68) return "puff";
      return "noodle";
    }
    if (roll < 0.22) return "tube";
    if (roll < 0.4) return "romp";
    if (roll < 0.6) return "steal";
    if (roll < 0.8) return "puff";
    return "noodle";
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
    return key === TRICK_KEY || key === "wick";
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
    const name = HAPPY.includes(kind) ? kind : "dook";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "dook" ? "talk" : name === "kiss" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function dookPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dook));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 3.8, rot: -s * 9, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      return {
        lift: 3.8 + Math.abs(Math.sin(t * 12)) * 2.6,
        rot: -9 + Math.sin(t * 14) * 8,
        dx: Math.sin(t * 10) * 1.2,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 3.8 * (1 - s), rot: -9 * (1 - s), dx: 0, anim: "sit" };
  }

  function kissPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.kiss));
    if (u < 0.86) {
      return {
        lift: Math.sin(u * Math.PI) * 2.2,
        rot: Math.sin(u * Math.PI * 4) * 7,
        dx: Math.sin(u * Math.PI * 2) * 1.8,
        anim: "sit",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.86) / 0.14) * Math.PI) * 2, dx: 0, anim: "idle" };
  }

  function chucklePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chuckle));
    return {
      lift: Math.abs(Math.sin(t * 11)) * 3.4,
      rot: Math.sin(t * 13) * 11,
      dx: Math.sin(t * 8) * 1.5,
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
    if (next.kind === "dook") {
      const pose = dookPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "kiss") {
      const pose = kissPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = chucklePose(next.t);
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
      kind === "tube"
        ? "sit"
        : kind === "romp"
          ? "play"
          : kind === "steal"
            ? "walk"
            : kind === "puff"
              ? "sit"
              : kind === "noodle"
                ? "play"
                : "sit";
    return {
      kind,
      phase: kind === "tube" ? "hold" : "go",
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

  function tubePose(t) {
    return {
      lift: 0.6 + Math.sin(t * 1.5) * 0.4,
      rot: 18 + Math.sin(t * 1.7) * 3 + Math.sin(t * 3.1) * 2,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 18 * (1 - u) };
  }

  function rompPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.romp));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 3, rot: -s * 16, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const hop = Math.sin(s * Math.PI * 5.5);
      const side = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * (14 * smoothstep(s) + side * 5),
        lift: 3 + Math.abs(hop) * 8,
        rot: -16 + hop * 22 + side * 10,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 14,
      lift: 3 * (1 - s),
      rot: -8 * (1 - s),
      anim: "sit",
    };
  }

  function stealPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.steal));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 1.4, rot: s * 6 * facing, anim: "sit" };
    }
    if (u < 0.5) {
      const s = smoothstep((u - 0.12) / 0.38);
      return {
        x: fromX + facing * 10 * s,
        lift: -1.4 + Math.abs(Math.sin(s * Math.PI * 3)) * 2,
        rot: facing * (6 + Math.sin(s * Math.PI * 4) * 5),
        anim: "walk",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.5) / 0.38;
      const dash = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * (10 + 16 * smoothstep(s)),
        lift: 1.5 + Math.abs(dash) * 4,
        rot: facing * (4 + dash * 12),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 26,
      lift: 1.5 * (1 - s),
      rot: facing * 3 * (1 - s),
      anim: "sit",
    };
  }

  function puffPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.puff));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.5, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.16) / 0.62;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.5,
        lift: 2.5 + Math.sin(s * Math.PI) * 2.2,
        rot: facing * (12 + Math.sin(s * Math.PI * 3) * 10),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.5 * (1 - s),
      rot: facing * 6 * (1 - s),
      anim: "sit",
    };
  }

  function noodlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.noodle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return {
        x: fromX,
        lift: s * 1.5,
        rot: -s * 20,
        anim: "play",
      };
    }
    if (u < 0.86) {
      return {
        x: fromX + facing * Math.sin(t * 7) * 4,
        lift: 1.5 + Math.abs(Math.sin(t * 9)) * 3.5,
        rot: -20 + Math.sin(t * 8) * 28,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 1.5 * (1 - s),
      rot: -20 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "romp" && trick.kind !== "steal") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "tube") {
      if (next.t < TUBE_HOLD) {
        const pose = tubePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TUBE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TUBE_HOLD);
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
    if (next.kind === "romp") {
      const pose = rompPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "steal") {
      const pose = stealPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "puff") {
      const pose = puffPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = noodlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    TUBE_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tubePose,
    releasePose,
    rompPose,
    stealPose,
    puffPose,
    noodlePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    dookPose,
    kissPose,
    chucklePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFerretTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
