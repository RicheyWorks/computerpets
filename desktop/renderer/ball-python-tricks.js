/** Nori ground tricks while idle. House ball python — orb / nook / taste / inch / unroll personality (ball/hide/tongue desk life; shy inkwell bun). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `ball-python-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play BUN unchanged — never names `bun`. Hedgehog owns curl/ball; Ember owns settle; Vesper owns fold; Sol owns flick. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "ball_python";
  const TRICKS = ["orb", "nook", "taste", "inch", "unroll"];
  const HAPPY = ["savor", "nestle", "center"];
  const HAPPY_DUR = { savor: 1.16, nestle: 1.2, center: 1.28 };
  const ORB_HOLD = 10.4;
  const RELEASE_S = 0.64;
  const DUR = { orb: ORB_HOLD + RELEASE_S, nook: 1.36, taste: 1.28, inch: 1.42, unroll: 1.3 };

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
    if (kind === "orb") return 42 + roll * 26;
    if (kind === "nook") return 15 + roll * 10;
    if (kind === "taste") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "orb";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "orb") {
      if (roll < 0.28) return "nook";
      if (roll < 0.5) return "taste";
      if (roll < 0.72) return "inch";
      return "unroll";
    }
    if (lastKind === "nook") {
      if (roll < 0.3) return "orb";
      if (roll < 0.52) return "taste";
      if (roll < 0.74) return "inch";
      return "unroll";
    }
    if (lastKind === "taste") {
      if (roll < 0.24) return "orb";
      if (roll < 0.46) return "nook";
      if (roll < 0.68) return "inch";
      return "unroll";
    }
    if (roll < 0.22) return "orb";
    if (roll < 0.4) return "nook";
    if (roll < 0.6) return "taste";
    if (roll < 0.8) return "inch";
    return "unroll";
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
    return key === TRICK_KEY || key === "nori";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "savor";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "savor" ? "sit" : name === "nestle" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function savorPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.savor));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 1.6, rot: s * 6, dx: 0, anim: "sit" };
  }
  if (u < 0.82) {
    return {
      lift: 1.6 + Math.abs(Math.sin(t * 4.6)) * 1.0,
      rot: 6 + Math.sin(t * 3.4) * 4,
      dx: 0,
      anim: "sit",
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 1.6 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
}

  function nestlePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nestle));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.6, rot: s * -10, dx: 0, anim: "sit" };
  }
  if (u < 0.78) {
    return {
      lift: 0.6 + Math.abs(Math.sin(t * 3.2)) * 0.9,
      rot: -10 + Math.sin(t * 2.8) * 5,
      dx: Math.sin(t * 2.1) * 0.25,
      anim: "sit",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.6 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" };
}

  function centerPose(t) {
  return {
    lift: Math.abs(Math.sin(t * 2.2)) * 1.0 + 0.4,
    rot: -5 + Math.sin(t * 1.9) * 5,
    dx: Math.sin(t * 1.5) * 0.3,
    anim: "talk",
  };
}

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "savor") {
      const pose = savorPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nestle") {
      const pose = nestlePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = centerPose(next.t);
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
      kind === "orb"
        ? "sit"
        : kind === "nook"
          ? "sit"
          : kind === "taste"
            ? "talk"
            : kind === "inch"
              ? "play"
              : kind === "unroll"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "orb" ? "hold" : "go",
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

  function orbPose(t) {
  return {
    lift: 0.1 + Math.sin(t * 1.05) * 0.22,
    rot: 6 + Math.sin(t * 0.9) * 1.6 + Math.sin(t * 2.2) * 0.9,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 6 * (1 - u) };
}

  function nookPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.nook));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.4, rot: s * -12 * facing, anim: "sit" };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const tuck = Math.abs(Math.sin(s * Math.PI * 1.6));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.3,
      lift: 0.4 + tuck * 0.5,
      rot: facing * (-12 - tuck * 4),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 0.4 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit",
  };
}

  function tastePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.taste));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.2, rot: s * 4 * facing, anim: "talk" };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const flick = Math.sin(s * Math.PI * 6.5);
    return {
      x: fromX + facing * flick * 0.35,
      lift: 1.2 + Math.abs(flick) * 0.9,
      rot: facing * (4 + flick * 10),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * 2 * (1 - s),
    anim: "sit",
  };
}

  function inchPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.inch));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.6, rot: -s * 8 * facing, anim: "play" };
  }
  if (u < 0.5) {
    const s = (u - 0.14) / 0.36;
    return {
      x: fromX + facing * smoothstep(s) * 4.2,
      lift: 1.6 + Math.sin(s * Math.PI) * 0.8,
      rot: facing * (-8 + s * 14),
      anim: "play",
    };
  }
  if (u < 0.82) {
    const s = (u - 0.5) / 0.32;
    const home = smoothstep(s);
    return {
      x: fromX + facing * (4.2 * (1 - home)),
      lift: 1.6 * (1 - home * 0.5) + Math.sin(s * Math.PI) * 0.4,
      rot: facing * (6 - home * 10),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 1.6 * 0.5 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit",
  };
}

  function unrollPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.unroll));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX + facing * s * 2.4, lift: s * 1.1, rot: s * -6 * facing, anim: "play" };
  }
  if (u < 0.62) {
    const s = (u - 0.18) / 0.44;
    const wave = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * (2.4 + s * 2.8 + wave * 0.4),
      lift: 1.1 + Math.abs(wave) * 0.7,
      rot: facing * (-6 + wave * 8),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.62) / 0.38);
  return {
    x: fromX + facing * (5.2 * (1 - s)),
    lift: 1.1 * (1 - s) * 0.45,
    rot: facing * (-2 + s * 8),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "inch" && trick.kind !== "unroll") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "orb") {
      if (next.t < ORB_HOLD) {
        const pose = orbPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ORB_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ORB_HOLD);
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
    if (next.kind === "nook") {
      const pose = nookPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "taste") {
      const pose = tastePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inch") {
      const pose = inchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = unrollPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ORB_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    orbPose,
    releasePose,
    nookPose,
    tastePose,
    inchPose,
    unrollPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    savorPose,
    nestlePose,
    centerPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBallPythonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);