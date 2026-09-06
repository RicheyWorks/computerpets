/** Vesper ground tricks while idle. House dragon — sprawl / guard / smolder / claim / fold personality (wyrm on the mantel; sleeping-dragon desk life). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `dragon-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play DRAPE unchanged — never names `drape`. Window-play BASK/COIL untouched — never names `bask` or `coil`. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "dragon";
  const TRICKS = ["sprawl", "guard", "smolder", "claim", "fold"];
  const HAPPY = ["thrum", "glow", "incline"];
  const HAPPY_DUR = { thrum: 1.18, glow: 1.22, incline: 1.3 };
  const SPRAWL_HOLD = 10.4;
  const RELEASE_S = 0.64;
  const DUR = { sprawl: SPRAWL_HOLD + RELEASE_S, guard: 1.38, smolder: 1.34, claim: 1.4, fold: 1.24 };

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
    if (kind === "sprawl") return 42 + roll * 26;
    if (kind === "guard") return 15 + roll * 10;
    if (kind === "smolder") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "sprawl";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "sprawl") {
      if (roll < 0.28) return "guard";
      if (roll < 0.5) return "smolder";
      if (roll < 0.72) return "claim";
      return "fold";
    }
    if (lastKind === "guard") {
      if (roll < 0.3) return "sprawl";
      if (roll < 0.52) return "smolder";
      if (roll < 0.74) return "claim";
      return "fold";
    }
    if (lastKind === "smolder") {
      if (roll < 0.24) return "sprawl";
      if (roll < 0.46) return "guard";
      if (roll < 0.68) return "claim";
      return "fold";
    }
    if (roll < 0.22) return "sprawl";
    if (roll < 0.4) return "guard";
    if (roll < 0.6) return "smolder";
    if (roll < 0.8) return "claim";
    return "fold";
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
    return key === TRICK_KEY || key === "vesper";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "thrum";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "thrum" ? "sit" : name === "glow" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function thrumPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.thrum));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 1.4, rot: s * 5, dx: 0, anim: "sit" };
  }
  if (u < 0.8) {
    return {
      lift: 1.4 + Math.abs(Math.sin(t * 4.2)) * 1.1,
      rot: 5 + Math.sin(t * 3.6) * 3.5,
      dx: 0,
      anim: "sit",
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.4 * (1 - s), rot: 5 * (1 - s), dx: 0, anim: "idle" };
}

  function glowPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glow));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.8, rot: s * 8, dx: 0, anim: "sit" };
  }
  if (u < 0.84) {
    return {
      lift: 1.8 + Math.abs(Math.sin(t * 3.8)) * 1.2,
      rot: 8 + Math.sin(t * 3.2) * 6,
      dx: Math.sin(t * 2.4) * 0.3,
      anim: "sit",
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 1.8 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "sit" };
}

  function inclinePose(t) {
  return {
    lift: Math.abs(Math.sin(t * 2.6)) * 1.2 + 0.5,
    rot: -8 + Math.sin(t * 2.2) * 6,
    dx: Math.sin(t * 1.8) * 0.35,
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
    if (next.kind === "thrum") {
      const pose = thrumPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "glow") {
      const pose = glowPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = inclinePose(next.t);
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
      kind === "sprawl"
        ? "sit"
        : kind === "guard"
          ? "sit"
          : kind === "smolder"
            ? "sit"
            : kind === "claim"
              ? "play"
              : kind === "fold"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "sprawl" ? "hold" : "go",
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

  function sprawlPose(t) {
  return {
    lift: 0.1 + Math.sin(t * 0.9) * 0.35,
    rot: 12 + Math.sin(t * 1.05) * 2.2 + Math.sin(t * 2.1) * 1.4,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 8 * (1 - u) };
}

  function guardPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.guard));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.2, rot: s * 14 * facing, anim: "sit" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const sweep = Math.sin(s * Math.PI * 2);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.6,
      lift: 1.2 + Math.abs(sweep) * 0.8,
      rot: facing * (14 + sweep * 10),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 1.2 * (1 - s) * 0.2,
    rot: facing * 6 * (1 - s),
    anim: "sit",
  };
}

  function smolderPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.smolder));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.8, rot: s * 4 * facing, anim: "sit" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const breath = Math.abs(Math.sin(s * Math.PI * 3));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.3,
      lift: 0.8 + breath * 1.6,
      rot: facing * (4 + breath * 5),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 0.8 * (1 - s),
    rot: facing * 2 * (1 - s),
    anim: "sit",
  };
}

  function claimPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.claim));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.6, rot: -s * 8 * facing, anim: "sit" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const plant = Math.abs(Math.sin(s * Math.PI * 2.2));
    return {
      x: fromX + facing * (2.4 * smoothstep(s) + plant * 0.4),
      lift: 1.6 + plant * 2.2,
      rot: facing * (-8 + plant * 10),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 2.4,
    lift: 1.6 * (1 - s),
    rot: facing * -3 * (1 - s),
    anim: "sit",
  };
}

  function foldPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.fold));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.0, rot: -s * 16 * facing, anim: "play" };
  }
  if (u < 0.72) {
    const s = (u - 0.18) / 0.54;
    const tuck = smoothstep(s);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.5,
      lift: 2.0 * (1 - tuck * 0.55),
      rot: facing * (-16 + tuck * 22),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 2.0 * 0.45 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "claim" && trick.kind !== "fold") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "sprawl") {
      if (next.t < SPRAWL_HOLD) {
        const pose = sprawlPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SPRAWL_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SPRAWL_HOLD);
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
    if (next.kind === "guard") {
      const pose = guardPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "smolder") {
      const pose = smolderPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "claim") {
      const pose = claimPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = foldPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SPRAWL_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    sprawlPose,
    releasePose,
    guardPose,
    smolderPose,
    claimPose,
    foldPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    thrumPose,
    glowPose,
    inclinePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDragonTricks = api;
})(typeof window !== "undefined" ? window : globalThis);