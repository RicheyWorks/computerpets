/** Coin ground tricks while idle — ultra-polish pass. House goldfish — drift / gulp / flare / glint / dart / yawn / forage personality (soft bowl-goldfish life). Drift mid-bowl hang without naming circle (window-play) or soak or potato or loaf or nest; gulp surface-mouth without naming drink or eat-cmd; flare fin-pulse without naming flash or puff; glint lamp-catch tilt without naming gleam (Earth thank-you) or wash; dart short bowl dash without naming zoom or scurry or zig or paddle (turtle); yawn wide-mouth gape without naming gape-snake or stretch; forage gravel-mouth pick without naming dig or nosh or hay or seed or browse. Window-play CIRCLE unchanged — never names a trick `circle`. Special Loop unchanged — never names `loop`. Guest slug Coin / key goldfish — accept "goldfish" and "coin". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`goldfish.wav`). Thank-yous bubble / lip / swish. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `goldfish-tricks.ts`. True house-goldfish desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble / Clip / Whee / Ink already done; Echo/budgie skip (bird-ultra); Peck/penguin skip (bird). Coin continues house-order ultra-polish. Next guest ultra is Rue / fox. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`.  goldfish.wav EXISTS so prefersHouseCry adds goldfish. Amplitudes raised toward Rui richness; denser waits/weights (DRIFT_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */

(function (root) {
  const TRICK_KEY = "goldfish";
  const TRICKS = ["drift", "gulp", "flare", "glint", "dart", "yawn", "forage"];
  const HAPPY = ["bubble", "lip", "swish"];
  const HAPPY_DUR = { bubble: 1.58, lip: 1.55, swish: 1.48 };
  const DRIFT_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = { drift: DRIFT_HOLD + RELEASE_S, gulp: 1.85, flare: 2.05, glint: 1.95, dart: 1.75, yawn: 2.08, forage: 2.10 };

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
    if (kind === "drift") return 40 + roll * 26;
    if (kind === "dart" || kind === "forage" || kind === "flare") return 12.8 + roll * 9.4;
    if (kind === "gulp" || kind === "yawn" || kind === "glint") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "drift";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "drift" ? 0.72 : k === "yawn" || k === "gulp" || k === "flare" ? 1.28 : k === "dart" || k === "forage" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "drift";
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
    return key === TRICK_KEY || key === "coin";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "bubble";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "bubble" ? "talk" : name === "lip" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function bubblePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bubble));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 6.6, rot: -s * 9.6, dx: 0, anim: "talk" };
    }
    if (u < 0.85) {
      return {
        lift: 6.6 + Math.abs(Math.sin(t * 8)) * 4.6,
        rot: -9.6 + Math.sin(t * 7) * 10.8,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 6.6 * (1 - s), rot: -9.6 * (1 - s), dx: 0, anim: "sit" };
  }

  function lipPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lip));
    if (u < 0.9) {
      return {
        lift: Math.abs(Math.sin(t * 12)) * 5.4,
        rot: Math.sin(t * 14) * 14.4,
        dx: 0,
        anim: "sit",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.9) / 0.1) * Math.PI) * 2, dx: 0, anim: "idle" };
  }

  function swishPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.swish));
    return {
      lift: Math.sin(u * Math.PI) * 7.8,
      rot: Math.sin(u * Math.PI * 3) * 19.2,
      dx: Math.sin(u * Math.PI * 2) * 6,
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
    if (next.kind === "bubble") {
      const pose = bubblePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lip") {
      const pose = lipPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = swishPose(next.t);
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
    const name = TRICKS.indexOf(kind) >= 0 ? kind : "drift";
    const anim =
      name === "drift" || name === "gulp" || name === "flare" || name === "glint" || name === "yawn" || name === "forage"
        ? "sit"
        : name === "dart"
          ? "walk"
          : "sit";
    return {
      kind: name,
      phase: name === "drift" ? "hold" : "go",
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

  function driftPose(t) {
    return {
      lift: 7.8 + Math.sin(t * 1.6) * 2.6,
      rot: Math.sin(t * 1.1) * 9.6,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 7.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 9.6 * (1 - u) };
  }

  function gulpPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.gulp));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { lift: s * 11.4, rot: -s * 14.4, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      return {
        lift: 11.4 + Math.abs(Math.sin(t * 10)) * 3.4,
        rot: -14.4 + Math.sin(t * 9) * 8.4,
        dx: 0,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return { lift: 11.4 * (1 - s), rot: -14.4 * (1 - s), dx: 0, anim: "sit" };
  }

  function flarePose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.flare));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { lift: s * 6.6, rot: s * 19.2, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      return {
        lift: 6.6 + Math.abs(Math.sin(t * 5)) * 3.8,
        rot: 19.2 + Math.sin(t * 6) * 14.4,
        dx: Math.sin(t * 4) * 2.9,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { lift: 6.6 * (1 - s), rot: 19.2 * (1 - s), dx: 0, anim: "sit" };
  }

  function glintPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.glint));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: s * 4.2, rot: -s * 28.8, dx: 0, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: 4.2 + Math.sin(t * 3) * 1.4,
        rot: -28.8 + Math.sin(t * 2.2) * 8.4,
        dx: Math.sin(t * 2) * 1.4,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: 4.2 * (1 - s), rot: -28.8 * (1 - s), dx: 0, anim: "sit" };
  }

  function dartPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dart));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: -s * 9.6, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const kick = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * 28 * smoothstep(s),
        lift: 2.6 + kick * 8.4,
        rot: -9.6 + Math.sin(s * Math.PI * 2) * 16.8,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 28,
      lift: 3.0 * (1 - s),
      rot: 6 * (1 - s),
      anim: "sit",
    };
  }

  function yawnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.yawn));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 5.4, rot: -s * 7.2 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.18) / 0.6;
      const gape = Math.sin(s * Math.PI);
      return {
        x: fromX,
        lift: 5.4 + gape * 2.6,
        rot: -7.2 * face + gape * 12 * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX, lift: 5.4 * (1 - s), rot: -7.2 * face * (1 - s), anim: "sit" };
  }

  function foragePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.forage));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: -s * 6.6, rot: s * 12 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const peck = Math.sin(t * 11);
      return {
        x: fromX + face * peck * 2.6,
        lift: -6.6 + Math.abs(peck) * 3.4,
        rot: 12 * face + peck * 9.6,
        anim: "eat",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: -6.6 * (1 - s), rot: 12 * face * (1 - s), anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "dart" && trick.kind !== "forage") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "drift") {
      if (next.t < DRIFT_HOLD) {
        const pose = driftPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DRIFT_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DRIFT_HOLD);
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
    if (next.kind === "gulp") {
      const pose = gulpPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "flare") {
      const pose = flarePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "glint") {
      const pose = glintPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "yawn") {
      const pose = yawnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "forage") {
      const pose = foragePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dartPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  const api = {
    TRICK_KEY: TRICK_KEY,
    TRICKS: TRICKS,
    HAPPY: HAPPY,
    HAPPY_DUR: HAPPY_DUR,
    DUR: DUR,
    DRIFT_HOLD: DRIFT_HOLD,
    RELEASE_S: RELEASE_S,
    canStart: canStart,
    shouldAbort: shouldAbort,
    nextTrickWait: nextTrickWait,
    pickTrick: pickTrick,
    happyCanStart: happyCanStart,
    happyShouldAbort: happyShouldAbort,
    wantsThankYou: wantsThankYou,
    startThankYou: startThankYou,
    pickHappy: pickHappy,
    beginHappy: beginHappy,
    bubblePose: bubblePose,
    lipPose: lipPose,
    swishPose: swishPose,
    stepHappy: stepHappy,
    sleepHoldFrame: sleepHoldFrame,
    beginTrick: beginTrick,
    driftPose: driftPose,
    releasePose: releasePose,
    gulpPose: gulpPose,
    flarePose: flarePose,
    glintPose: glintPose,
    dartPose: dartPose,
    yawnPose: yawnPose,
    foragePose: foragePose,
    stepTrick: stepTrick,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.PetGoldfishTricks = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : /** @type {any} */ (this));
