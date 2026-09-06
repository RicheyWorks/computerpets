/** Bluff ground tricks while idle. House western hognose — hood / feign / shovel / gape / encore personality (bluff/death-feign/nose desk life; eraser-dish theater). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `hognose-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play FLIP unchanged — never names `flip`. Nori owns orb/taste/unroll; Sol owns flick; Ember owns settle; Saffron owns scribble/comma; Bandit owns stripe/verdict; Jade owns bracelet/jewel/bough; Burr owns root; Coin owns flare; Thimble owns dig. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "hognose";
  const TRICKS = ["hood", "feign", "shovel", "gape", "encore"];
  const HAPPY = ["aside", "cue", "ovation"];
  const HAPPY_DUR = { aside: 1.16, cue: 1.2, ovation: 1.28 };
  const HOOD_HOLD = 10.4;
  const RELEASE_S = 0.58;
  const DUR = { hood: HOOD_HOLD + RELEASE_S, feign: 1.52, shovel: 1.34, gape: 1.28, encore: 1.44 };

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
    if (kind === "hood") return 44 + roll * 24;
    if (kind === "feign") return 16 + roll * 10;
    if (kind === "gape") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "hood";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "hood") {
      if (roll < 0.28) return "feign";
      if (roll < 0.5) return "shovel";
      if (roll < 0.72) return "gape";
      return "encore";
    }
    if (lastKind === "feign") {
      if (roll < 0.3) return "hood";
      if (roll < 0.52) return "shovel";
      if (roll < 0.74) return "gape";
      return "encore";
    }
    if (lastKind === "gape") {
      if (roll < 0.24) return "hood";
      if (roll < 0.46) return "feign";
      if (roll < 0.68) return "shovel";
      return "encore";
    }
    if (roll < 0.22) return "hood";
    if (roll < 0.42) return "feign";
    if (roll < 0.6) return "shovel";
    if (roll < 0.8) return "gape";
    return "encore";
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
    return key === TRICK_KEY || key === "bluff";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "aside";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "aside" ? "sit" : name === "cue" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function asidePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.aside));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.0, rot: s * -8, dx: 0, anim: "sit" };
  }
  if (u < 0.8) {
    return {
      lift: 2.0 + Math.abs(Math.sin(t * 3.6)) * 0.65,
      rot: -8 + Math.sin(t * 2.6) * 5,
      dx: Math.sin(t * 1.8) * 0.28,
      anim: "sit",
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.0 * (1 - s), rot: -8 * (1 - s), dx: 0, anim: "idle" };
}

  function cuePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cue));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 2.2, rot: s * 9, dx: 0, anim: "talk" };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 6.0);
    return {
      lift: 2.2 + Math.abs(tick) * 0.5,
      rot: 9 + tick * 7,
      dx: tick * 0.32,
      anim: "talk",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.2 * (1 - s), rot: 9 * (1 - s), dx: 0, anim: "sit" };
}

  function ovationPose(t) {
  return {
    lift: Math.abs(Math.sin(t * 2.1)) * 1.05 + 1.0,
    rot: -10 + Math.sin(t * 1.8) * 5.2,
    dx: Math.sin(t * 1.5) * 0.4,
    anim: "sit",
  };
}

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "aside") {
      const pose = asidePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cue") {
      const pose = cuePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = ovationPose(next.t);
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
      kind === "hood"
        ? "sit"
        : kind === "feign"
          ? "sit"
          : kind === "shovel"
            ? "talk"
            : kind === "gape"
              ? "talk"
              : kind === "encore"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "hood" ? "hold" : "go",
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

  function hoodPose(t) {
  return {
    lift: 1.55 + Math.sin(t * 0.9) * 0.2,
    rot: -18 + Math.sin(t * 0.78) * 2.4 + Math.sin(t * 2.1) * 1.2,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.55 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -18 * (1 - u) };
}

  function feignPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.feign));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.2, rot: s * 95 * facing, anim: "play" };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 0.8) * 0.35,
      lift: 0.35 + Math.sin(s * Math.PI * 1.2) * 0.12,
      rot: facing * (95 + Math.sin(s * Math.PI * 1.4) * 4),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 0.35 * (1 - s) + s * 0.8,
    rot: facing * (95 * (1 - s) + s * -6),
    anim: "sit",
  };
}

  function shovelPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.shovel));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.8, lift: s * 0.6, rot: s * 14 * facing, anim: "talk" };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const dig = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (0.8 + dig * 1.4),
      lift: 0.55 + Math.abs(dig) * 0.35,
      rot: facing * (14 + dig * 10),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * (0.8 * (1 - s)),
    lift: 0.55 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit",
  };
}

  function gapePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.gape));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.4, rot: s * -12 * facing, anim: "talk" };
  }
  if (u < 0.82) {
    const s = (u - 0.12) / 0.7;
    const hiss = Math.sin(s * Math.PI * 2.6);
    return {
      x: fromX + facing * hiss * 0.55,
      lift: 2.4 + Math.abs(hiss) * 0.35,
      rot: facing * (-12 + hiss * 8),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit",
  };
}

  function encorePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.encore));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.2, rot: -s * 10 * facing, anim: "play" };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * smoothstep(s) * 4.2,
      lift: 2.2 + Math.sin(s * Math.PI) * 0.8,
      rot: facing * (-10 + s * 22),
      anim: "play",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * 4.2,
      lift: 2.5 + Math.sin(s * Math.PI * 1.6) * 0.4,
      rot: facing * (12 - s * 6),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (4.2 * (1 - s)),
    lift: 2.5 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "encore" && trick.kind !== "feign") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "hood") {
      if (next.t < HOOD_HOLD) {
        const pose = hoodPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HOOD_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HOOD_HOLD);
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
    if (next.kind === "feign") {
      const pose = feignPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "shovel") {
      const pose = shovelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gape") {
      const pose = gapePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = encorePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    HOOD_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    hoodPose,
    releasePose,
    feignPose,
    shovelPose,
    gapePose,
    encorePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    asidePose,
    cuePose,
    ovationPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHognoseTricks = api;
})(typeof window !== "undefined" ? window : globalThis);