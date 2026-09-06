/** Sash ground tricks while idle. House common garter — seam / rounds / moss / fork / lap personality (stripe/patrol/moss desk life; damp-moss desk officer). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `garter-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play PATROL unchanged — never names `patrol`. Nori owns orb/taste/unroll; Sol owns flick; Ember owns settle; Saffron owns scribble/comma; Bandit owns stripe/verdict; Jade owns bracelet/jewel/bough; Bluff owns hood/gape/encore; Burr owns root; Coin owns flare; Thimble owns dig; Fox window owns scent. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "garter";
  const TRICKS = ["seam", "rounds", "moss", "fork", "lap"];
  const HAPPY = ["copy", "brief", "visa"];
  const HAPPY_DUR = { copy: 1.14, brief: 1.18, visa: 1.26 };
  const SEAM_HOLD = 10.2;
  const RELEASE_S = 0.56;
  const DUR = { seam: SEAM_HOLD + RELEASE_S, rounds: 1.48, moss: 1.36, fork: 1.24, lap: 1.42 };

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
    if (kind === "seam") return 44 + roll * 24;
    if (kind === "rounds") return 15 + roll * 10;
    if (kind === "fork") return 13 + roll * 9;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "seam";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "seam") {
      if (roll < 0.28) return "rounds";
      if (roll < 0.5) return "moss";
      if (roll < 0.72) return "fork";
      return "lap";
    }
    if (lastKind === "rounds") {
      if (roll < 0.3) return "seam";
      if (roll < 0.52) return "moss";
      if (roll < 0.74) return "fork";
      return "lap";
    }
    if (lastKind === "fork") {
      if (roll < 0.24) return "seam";
      if (roll < 0.46) return "rounds";
      if (roll < 0.68) return "moss";
      return "lap";
    }
    if (roll < 0.22) return "seam";
    if (roll < 0.42) return "rounds";
    if (roll < 0.6) return "moss";
    if (roll < 0.8) return "fork";
    return "lap";
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
    return key === TRICK_KEY || key === "sash";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "copy";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "copy" ? "sit" : name === "brief" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function copyPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.copy));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.85, rot: s * -7, dx: 0, anim: "sit" };
  }
  if (u < 0.8) {
    return {
      lift: 1.85 + Math.abs(Math.sin(t * 3.4)) * 0.55,
      rot: -7 + Math.sin(t * 2.4) * 4.5,
      dx: Math.sin(t * 1.7) * 0.32,
      anim: "sit",
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.85 * (1 - s), rot: -7 * (1 - s), dx: 0, anim: "idle" };
}

  function briefPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.brief));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 2.05, rot: s * 8, dx: 0, anim: "talk" };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 5.6);
    return {
      lift: 2.05 + Math.abs(tick) * 0.45,
      rot: 8 + tick * 6,
      dx: tick * 0.3,
      anim: "talk",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.05 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "sit" };
}

  function visaPose(t) {
  return {
    lift: Math.abs(Math.sin(t * 2.0)) * 0.95 + 0.95,
    rot: -9 + Math.sin(t * 1.7) * 4.8,
    dx: Math.sin(t * 1.45) * 0.38,
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
    if (next.kind === "copy") {
      const pose = copyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "brief") {
      const pose = briefPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = visaPose(next.t);
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
      kind === "seam"
        ? "sit"
        : kind === "rounds"
          ? "walk"
          : kind === "moss"
            ? "sit"
            : kind === "fork"
              ? "talk"
              : kind === "lap"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "seam" ? "hold" : "go",
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

  function seamPose(t) {
  return {
    lift: 1.35 + Math.sin(t * 0.85) * 0.18,
    rot: -12 + Math.sin(t * 0.72) * 2.1 + Math.sin(t * 1.9) * 1.0,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.35 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -12 * (1 - u) };
}

  function roundsPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.rounds));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.2, lift: s * 0.7, rot: s * 6 * facing, anim: "walk" };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * (1.2 + smoothstep(s) * 5.5),
      lift: 0.7 + Math.sin(s * Math.PI * 2.2) * 0.35,
      rot: facing * (6 + Math.sin(s * Math.PI * 3) * 5),
      anim: "walk",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * (6.7 - smoothstep(s) * 3.2),
      lift: 0.75 + Math.abs(Math.sin(s * Math.PI * 2)) * 0.25,
      rot: facing * (4 - s * 8),
      anim: "walk",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (3.5 * (1 - s)),
    lift: 0.75 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit",
  };
}

  function mossPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.moss));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + facing * s * 0.6, lift: s * 0.45, rot: s * 16 * facing, anim: "sit" };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const nudge = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * (0.6 + nudge * 0.4),
      lift: 0.35 + Math.abs(nudge) * 0.2,
      rot: facing * (16 + nudge * 5),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (0.6 * (1 - s)),
    lift: 0.35 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "idle",
  };
}

  function forkPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.fork));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.15, rot: s * -10 * facing, anim: "talk" };
  }
  if (u < 0.82) {
    const s = (u - 0.12) / 0.7;
    const flick = Math.sin(s * Math.PI * 5.2);
    return {
      x: fromX + facing * flick * 0.45,
      lift: 2.15 + Math.abs(flick) * 0.28,
      rot: facing * (-10 + flick * 9),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 2.15 * (1 - s),
    rot: facing * -3 * (1 - s),
    anim: "sit",
  };
}

  function lapPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.lap));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.0, rot: -s * 8 * facing, anim: "play" };
  }
  if (u < 0.5) {
    const s = (u - 0.12) / 0.38;
    return {
      x: fromX + facing * smoothstep(s) * 4.8,
      lift: 2.0 + Math.sin(s * Math.PI) * 0.75,
      rot: facing * (-8 + s * 20),
      anim: "play",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.5) / 0.28;
    return {
      x: fromX + facing * 4.8,
      lift: 2.3 + Math.sin(s * Math.PI * 1.5) * 0.35,
      rot: facing * (12 - s * 5),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (4.8 * (1 - s)),
    lift: 2.3 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lap" && trick.kind !== "rounds") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "seam") {
      if (next.t < SEAM_HOLD) {
        const pose = seamPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SEAM_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SEAM_HOLD);
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
    if (next.kind === "rounds") {
      const pose = roundsPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "moss") {
      const pose = mossPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fork") {
      const pose = forkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = lapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SEAM_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    seamPose,
    releasePose,
    roundsPose,
    mossPose,
    forkPose,
    lapPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    copyPose,
    briefPose,
    visaPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGarterTricks = api;
})(typeof window !== "undefined" ? window : globalThis);