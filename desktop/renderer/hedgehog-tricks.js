/** Burr ground tricks while idle. House hedgehog — curl / snuffle / anoint / bristle / root personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `hedgehog-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, or dragon move clone. Window-play BALL is unchanged — this module never names a trick `ball`. Ferret already owns tube/romp/steal/puff/noodle and dook/kiss/chuckle. Turtle already owns huff as thank-you. Rui already owns shuffle as thank-you. Guinea pig already owns nibble as thank-you. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/tube/romp/steal/puff/noodle/thread/ball name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "hedgehog";
  const TRICKS = ["curl", "snuffle", "anoint", "bristle", "root"];
  const HAPPY = ["snort", "soft", "grunt"];
  const HAPPY_DUR = { snort: 1.16, soft: 1.28, grunt: 1.2 };
  const CURL_HOLD = 9.5;
  const RELEASE_S = 0.62;
  const DUR = { curl: CURL_HOLD + RELEASE_S, snuffle: 1.34, anoint: 1.42, bristle: 1.18, root: 1.3 };

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
    if (kind === "curl") return 38 + roll * 22;
    if (kind === "snuffle") return 13 + roll * 10;
    if (kind === "anoint") return 15 + roll * 11;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "curl";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "curl") {
      if (roll < 0.28) return "snuffle";
      if (roll < 0.5) return "anoint";
      if (roll < 0.72) return "bristle";
      return "root";
    }
    if (lastKind === "snuffle") {
      if (roll < 0.3) return "curl";
      if (roll < 0.52) return "anoint";
      if (roll < 0.74) return "bristle";
      return "root";
    }
    if (lastKind === "anoint") {
      if (roll < 0.24) return "curl";
      if (roll < 0.46) return "snuffle";
      if (roll < 0.68) return "bristle";
      return "root";
    }
    if (roll < 0.22) return "curl";
    if (roll < 0.4) return "snuffle";
    if (roll < 0.6) return "anoint";
    if (roll < 0.8) return "bristle";
    return "root";
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
    return key === TRICK_KEY || key === "burr";
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
    const name = HAPPY.includes(kind) ? kind : "snort";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "snort" ? "talk" : name === "soft" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function snortPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.snort));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.4, rot: -s * 7, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      return {
        lift: 2.4 + Math.abs(Math.sin(t * 10)) * 1.8,
        rot: -7 + Math.sin(t * 12) * 6,
        dx: Math.sin(t * 8) * 0.8,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.4 * (1 - s), rot: -7 * (1 - s), dx: 0, anim: "sit" };
  }

  function softPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.soft));
    if (u < 0.88) {
      return {
        lift: Math.sin(u * Math.PI) * 1.8,
        rot: 14 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI * 2) * 4,
        dx: Math.sin(u * Math.PI) * 1.2,
        anim: "sit",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 2, dx: 0, anim: "idle" };
  }

  function gruntPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 9)) * 2.8,
      rot: Math.sin(t * 11) * 9,
      dx: Math.sin(t * 7) * 1.1,
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
    if (next.kind === "snort") {
      const pose = snortPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "soft") {
      const pose = softPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gruntPose(next.t);
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
      kind === "curl"
        ? "sit"
        : kind === "snuffle"
          ? "walk"
          : kind === "anoint"
            ? "sit"
            : kind === "bristle"
              ? "sit"
              : kind === "root"
                ? "play"
                : "sit";
    return {
      kind,
      phase: kind === "curl" ? "hold" : "go",
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

  function curlPose(t) {
    return {
      lift: 0.4 + Math.sin(t * 1.3) * 0.35,
      rot: 22 + Math.sin(t * 1.6) * 2.5 + Math.sin(t * 2.8) * 1.5,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 22 * (1 - u) };
  }

  function snufflePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snuffle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 2.2, rot: s * 8 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.12) / 0.74;
      return {
        x: fromX + facing * (12 * smoothstep(s) + Math.sin(s * Math.PI * 4) * 2.5),
        lift: -2.2 + Math.abs(Math.sin(s * Math.PI * 5)) * 1.4,
        rot: facing * (8 + Math.sin(s * Math.PI * 6) * 6),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 12,
      lift: -2.2 * (1 - s),
      rot: facing * 4 * (1 - s),
      anim: "sit",
    };
  }

  function anointPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.anoint));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 1.6, rot: -s * 18 * facing, anim: "sit" };
    }
    if (u < 0.45) {
      const s = (u - 0.14) / 0.31;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.2,
        lift: 1.6 + Math.sin(s * Math.PI * 2) * 1.1,
        rot: facing * (-18 + Math.sin(s * Math.PI * 3) * 8),
        anim: "sit",
      };
    }
    if (u < 0.86) {
      const s = (u - 0.45) / 0.41;
      return {
        x: fromX,
        lift: 1.2 + Math.abs(Math.sin(s * Math.PI * 4)) * 2.4,
        rot: facing * (12 + Math.sin(s * Math.PI * 5) * 16),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: facing * 6 * (1 - s),
      anim: "sit",
    };
  }

  function bristlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bristle));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 3.2, rot: -s * 10, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.18) / 0.6;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 0.8,
        lift: 3.2 + Math.sin(s * Math.PI * 2) * 0.9,
        rot: -10 + Math.sin(s * Math.PI * 3) * 5,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 3.2 * (1 - s),
      rot: -5 * (1 - s),
      anim: "sit",
    };
  }

  function rootPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.root));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return {
        x: fromX,
        lift: -s * 1.8,
        rot: s * 12 * facing,
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const shove = Math.sin(s * Math.PI * 4.5);
      return {
        x: fromX + facing * (8 * smoothstep(s) + shove * 3),
        lift: -1.8 + Math.abs(shove) * 2.6,
        rot: facing * (12 + shove * 14),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 8,
      lift: -1.8 * (1 - s),
      rot: facing * 6 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "snuffle" && trick.kind !== "root") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "curl") {
      if (next.t < CURL_HOLD) {
        const pose = curlPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CURL_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CURL_HOLD);
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
    if (next.kind === "snuffle") {
      const pose = snufflePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "anoint") {
      const pose = anointPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bristle") {
      const pose = bristlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = rootPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CURL_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    curlPose,
    releasePose,
    snufflePose,
    anointPose,
    bristlePose,
    rootPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    snortPose,
    softPose,
    gruntPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHedgehogTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
