/** Jade ground tricks while idle. House green tree python — bracelet / sway / jewel / heat / bough personality (arboreal perch/coil desk life; lamp-arm jewelry above the work). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `green-tree-python-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play SADDLE unchanged — never names `saddle`. Nori owns orb/taste/unroll; Sol owns flick; Ember owns settle; Saffron owns scribble/comma; Bandit owns stripe/verdict. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "green_tree_python";
  const TRICKS = ["bracelet", "sway", "jewel", "heat", "bough"];
  const HAPPY = ["pendant", "treaty", "emerald"];
  const HAPPY_DUR = { pendant: 1.18, treaty: 1.22, emerald: 1.3 };
  const BRACELET_HOLD = 10.6;
  const RELEASE_S = 0.6;
  const DUR = { bracelet: BRACELET_HOLD + RELEASE_S, sway: 1.4, jewel: 1.36, heat: 1.3, bough: 1.48 };

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
    if (kind === "bracelet") return 44 + roll * 24;
    if (kind === "jewel") return 16 + roll * 10;
    if (kind === "heat") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "bracelet";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "bracelet") {
      if (roll < 0.28) return "sway";
      if (roll < 0.5) return "jewel";
      if (roll < 0.72) return "heat";
      return "bough";
    }
    if (lastKind === "jewel") {
      if (roll < 0.3) return "bracelet";
      if (roll < 0.52) return "sway";
      if (roll < 0.74) return "heat";
      return "bough";
    }
    if (lastKind === "heat") {
      if (roll < 0.24) return "bracelet";
      if (roll < 0.46) return "sway";
      if (roll < 0.68) return "jewel";
      return "bough";
    }
    if (roll < 0.22) return "bracelet";
    if (roll < 0.42) return "sway";
    if (roll < 0.6) return "jewel";
    if (roll < 0.8) return "heat";
    return "bough";
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
    return key === TRICK_KEY || key === "jade";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "pendant";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "pendant" ? "sit" : name === "treaty" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function pendantPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pendant));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.2, rot: s * -6, dx: 0, anim: "sit" };
  }
  if (u < 0.8) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 3.8)) * 0.7,
      rot: -6 + Math.sin(t * 2.8) * 4.2,
      dx: Math.sin(t * 1.9) * 0.25,
      anim: "sit",
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" };
}

  function treatyPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.treaty));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.8, rot: s * 7, dx: 0, anim: "talk" };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 5.8);
    return {
      lift: 1.8 + Math.abs(tick) * 0.55,
      rot: 7 + tick * 8,
      dx: tick * 0.3,
      anim: "talk",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.8 * (1 - s), rot: 7 * (1 - s), dx: 0, anim: "sit" };
}

  function emeraldPose(t) {
  return {
    lift: Math.abs(Math.sin(t * 2.0)) * 0.95 + 1.1,
    rot: -8 + Math.sin(t * 1.7) * 4.5,
    dx: Math.sin(t * 1.4) * 0.35,
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
    if (next.kind === "pendant") {
      const pose = pendantPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "treaty") {
      const pose = treatyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = emeraldPose(next.t);
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
      kind === "bracelet"
        ? "sit"
        : kind === "jewel"
          ? "sit"
          : kind === "heat"
            ? "talk"
            : kind === "sway"
              ? "play"
              : kind === "bough"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "bracelet" ? "hold" : "go",
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

  function braceletPose(t) {
  return {
    lift: 1.35 + Math.sin(t * 0.95) * 0.22,
    rot: -14 + Math.sin(t * 0.82) * 2.2 + Math.sin(t * 2.0) * 1.1,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -14 * (1 - u) };
}

  function swayPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.sway));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.0, rot: s * -10 * facing, anim: "play" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const rock = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * rock * 1.6,
      lift: 2.0 + Math.abs(rock) * 0.55,
      rot: facing * (-10 + rock * 18),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit",
  };
}

  function jewelPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.jewel));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.9, rot: s * -12 * facing, anim: "sit" };
  }
  if (u < 0.82) {
    const s = (u - 0.14) / 0.68;
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 1.2) * 0.45,
      lift: 1.9 + Math.sin(s * Math.PI * 2.0) * 0.2,
      rot: facing * (-12 + Math.sin(s * Math.PI * 1.6) * 3.5),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 1.9 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit",
  };
}

  function heatPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.heat));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.6, lift: s * 2.1, rot: s * 8 * facing, anim: "talk" };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const lean = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * (0.6 + lean * 1.1),
      lift: 2.1 + Math.abs(Math.sin(s * Math.PI * 2.8)) * 0.4,
      rot: facing * (8 + lean * 12),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * (0.6 * (1 - s)),
    lift: 2.1 * (1 - s),
    rot: facing * 3 * (1 - s),
    anim: "sit",
  };
}

  function boughPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.bough));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: -s * 8 * facing, anim: "play" };
  }
  if (u < 0.48) {
    const s = (u - 0.12) / 0.36;
    return {
      x: fromX + facing * smoothstep(s) * 5.4,
      lift: 2.6 + Math.sin(s * Math.PI) * 0.7,
      rot: facing * (-8 + s * 16),
      anim: "play",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    return {
      x: fromX + facing * 5.4,
      lift: 2.8 + Math.sin(s * Math.PI * 1.5) * 0.35,
      rot: facing * (8 - s * 4),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (5.4 * (1 - s)),
    lift: 2.8 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "sway" && trick.kind !== "bough") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "bracelet") {
      if (next.t < BRACELET_HOLD) {
        const pose = braceletPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BRACELET_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BRACELET_HOLD);
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
    if (next.kind === "sway") {
      const pose = swayPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "jewel") {
      const pose = jewelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "heat") {
      const pose = heatPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = boughPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    BRACELET_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    braceletPose,
    releasePose,
    swayPose,
    jewelPose,
    heatPose,
    boughPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    pendantPose,
    treatyPose,
    emeraldPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGreenTreePythonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
