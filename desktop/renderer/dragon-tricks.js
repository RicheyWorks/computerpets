/** Vesper ground tricks while idle — ultra-polish pass. House dragon — sprawl / guard / smolder / claim / fold / ruff / scrape personality (wyrm on the mantel; sleeping-dragon desk life). Sprawl heat-hold without naming bask/flatten/drape; guard watchful rise; smolder breath-glow; claim blotter plant without naming hoard; fold wing-tuck without naming curl/coil; ruff neck-ruff flare without naming dewlap/fan/frill; scrape claw-scrape without naming scratch/dig. Window-play DRAPE/BASK/COIL untouched. Guest slug Vesper / key dragon. Amplitudes Rui-rich; denser waits/weights; prefersHouseCry via dragon.wav. Same map as web `dragon-tricks.ts`. Next ultra Nori / ball_python (skip Ember). Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "dragon";
  const TRICKS = ["sprawl", "guard", "smolder", "claim", "fold", "ruff", "scrape"];
  const HAPPY = ["thrum", "glow", "incline"];
  const HAPPY_DUR = { thrum: 1.55, glow: 1.62, incline: 1.58 };
  const SPRAWL_HOLD = 12.8;
  const RELEASE_S = 0.88;
  const DUR = { sprawl: SPRAWL_HOLD + RELEASE_S, guard: 1.82, smolder: 1.76, claim: 1.88, fold: 1.72, ruff: 2.02, scrape: 2.1 };

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
    if (kind === "sprawl") return 38 + roll * 24;
    if (kind === "guard" || kind === "smolder") return 11 + roll * 8;
    if (kind === "claim" || kind === "fold" || kind === "scrape") return 10 + roll * 8;
    if (kind === "ruff") return 12 + roll * 9;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "sprawl";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter(function (k) { return k !== lastKind; });
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map(function (k) {
      return k === "sprawl" ? 0.55 : k === "guard" || k === "ruff" || k === "smolder" ? 1.15 : 1;
    });
    var total = 0;
    for (var i = 0; i < weights.length; i++) total += weights[i];
    var r = roll * total;
    for (var j = 0; j < list.length; j++) {
      r -= weights[j];
      if (r <= 0) return list[j];
    }
    return list[list.length - 1] || "sprawl";
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
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 4.4, rot: s * 14, dx: 0, anim: "sit" };
  }
  if (u < 0.78) {
    return {
      lift: 4.4 + Math.abs(Math.sin(t * 5.2)) * 2.6,
      rot: 14 + Math.sin(t * 4.4) * 10,
      dx: 0,
      anim: "sit",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 4.4 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "idle" };
}

  function glowPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glow));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 5.6, rot: -s * 16, dx: 0, anim: "sit" };
  }
  if (u < 0.86) {
    return {
      lift: 5.6 + Math.abs(Math.sin(t * 10)) * 3.2,
      rot: -16 + Math.sin(t * 12) * 18,
      dx: Math.sin(t * 6) * 1.2,
      anim: "sit",
    };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 5.6 * (1 - s), rot: -16 * (1 - s), dx: 0, anim: "sit" };
}

  function inclinePose(t) {
  return {
    lift: Math.abs(Math.sin(t * 3.4)) * 3.8 + 1.2,
    rot: -14 + Math.sin(t * 3.0) * 12,
    dx: Math.sin(t * 2.4) * 1.4,
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
                : kind === "ruff"
                  ? "talk"
                  : kind === "scrape"
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
    lift: 2.2 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: 30 + Math.sin(t * 2.4) * 12 + Math.sin(t * 4.6) * 6,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.2 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 30 * (1 - u) };
}

  function guardPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.guard));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.6, rot: s * 18 * facing, anim: "sit" };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const sweep = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.6,
      lift: 4.6 + Math.abs(sweep) * 4.2,
      rot: facing * (18 + sweep * 16),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 4.6 * (1 - s),
    rot: facing * 9 * (1 - s),
    anim: "sit",
  };
}

  function smolderPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.smolder));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.8, rot: s * 12 * facing, anim: "sit" };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const breath = Math.abs(Math.sin(s * Math.PI * 3.2));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.2,
      lift: 3.8 + breath * 4.6,
      rot: facing * (12 + breath * 14),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 3.8 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit",
  };
}

  function claimPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.claim));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 5.2, rot: -s * 14 * facing, anim: "sit" };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const plant = Math.abs(Math.sin(s * Math.PI * 2.4));
    return {
      x: fromX + facing * (5.5 * smoothstep(s) + plant * 1.4),
      lift: 5.2 + plant * 4.8,
      rot: facing * (-14 + plant * 18),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX + facing * 5.5,
    lift: 5.2 * (1 - s),
    rot: facing * -7 * (1 - s),
    anim: "sit",
  };
}

  function foldPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.fold));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 5.0, rot: -s * 22 * facing, anim: "play" };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    const tuck = smoothstep(s);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.8,
      lift: 5.0 * (1 - tuck * 0.45),
      rot: facing * (-22 + tuck * 28),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 5.0 * 0.55 * (1 - s),
    rot: facing * 8 * (1 - s),
    anim: "sit",
  };
}


  function ruffPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.ruff));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.8, rot: s * 20 * facing, anim: "talk" };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    const flare = Math.abs(Math.sin(s * Math.PI * 2.8));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 1.4,
      lift: 4.8 + flare * 5.2,
      rot: facing * (20 + flare * 18),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 4.8 * (1 - s),
    rot: facing * 10 * (1 - s),
    anim: "sit",
  };
}

  function scrapePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.scrape));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.8, rot: s * 16 * facing, anim: "sit" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const drag = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (Math.abs(drag) * 8.5 + s * 2.2),
      lift: 2.8 + Math.abs(drag) * 7.2,
      rot: facing * (16 + drag * 32),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 6.0,
    lift: 2.8 * (1 - s),
    rot: facing * 8 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "claim" && trick.kind !== "fold" && trick.kind !== "scrape") {
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "guard") {
      const pose = guardPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "smolder") {
      const pose = smolderPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "claim") {
      const pose = claimPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fold") {
      const pose = foldPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ruff") {
      const pose = ruffPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = scrapePose(next.t, fromX, trick.facing);
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
    ruffPose,
    scrapePose,
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