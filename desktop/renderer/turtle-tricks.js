/** Ink ground tricks while idle — ultra-polish pass. House turtle — soak / tuck / crane / plod / paddle / snorkel / wipe personality (soft blotter turtle life). Soak lamp-settle without naming bask (window-play) or loaf or potato or nest or flop; tuck shell-withdraw without naming nest or bun; crane neck-survey without naming stretch (cat) or periscope (rabbit); plod deliberate crawl without naming zoom or scurry or zig; paddle soft swimming-feet without naming wag or buzz; snorkel air-gulp neck-rise without naming rise-cmd or periscope; wipe eye-foot scrub without naming wash or groom-trick or scrub (hamster). Window-play BASK unchanged — never names bask. Guest slug Ink / key turtle — accept "turtle" and "ink". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`turtle.wav`). Thank-yous munch / bob / huff. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `turtle-tricks.ts`. True house-turtle desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble / Clip / Whee already done; Ink continues house-order ultra-polish. Next guest ultra is Coin / goldfish (Echo/budgie already bird-ultra — skip). No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. */
(function (root) {
  const TRICK_KEY = "turtle";
  const TRICKS = ["soak", "tuck", "crane", "plod", "paddle", "snorkel", "wipe"];
  const HAPPY = ["munch", "bob", "huff"];
  const HAPPY_DUR = { munch: 1.58, bob: 1.55, huff: 1.48 };
  const SOAK_HOLD = 14.4;
  const RELEASE_S = 1.0;
  const DUR = { soak: SOAK_HOLD + RELEASE_S, tuck: 1.85, crane: 2.05, plod: 1.75, paddle: 1.65, snorkel: 2.08, wipe: 1.95 };

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
    if (kind === "soak") return 42 + roll * 28;
    if (kind === "plod" || kind === "paddle") return 12 + roll * 9;
    if (kind === "snorkel" || kind === "wipe") return 11 + roll * 8;
    if (kind === "tuck" || kind === "crane") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "soak";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "soak" ? 0.55 : k === "crane" || k === "tuck" || k === "snorkel" ? 1.15 : 1
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "soak";
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
    return key === TRICK_KEY || key === "ink";
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
    const name = HAPPY.includes(kind) ? kind : "munch";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "munch" ? "sit" : name === "bob" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function munchPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.munch));
    if (u < 0.25) {
      const s = u / 0.25;
      return { lift: -s * 4, rot: s * 10, dx: 0, anim: "sit" };
    }
    if (u < 0.85) {
      return {
        lift: -4 + Math.abs(Math.sin(t * 9)) * 3.2,
        rot: 10 + Math.sin(t * 8) * 7,
        dx: 0,
        anim: "sit",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: -4 * (1 - s), rot: 10 * (1 - s), dx: 0, anim: "sit" };
  }

  function bobPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bob));
    if (u < 0.9) {
      return {
        lift: Math.abs(Math.sin(t * 11)) * 6.5,
        rot: Math.sin(t * 10) * 10,
        dx: 0,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.9) / 0.1) * Math.PI) * 2, dx: 0, anim: "sit" };
  }

  function huffPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.huff));
    return {
      lift: Math.sin(u * Math.PI) * 7.5,
      rot: Math.sin(u * Math.PI * 2) * 9,
      dx: Math.sin(u * Math.PI) * 3.5,
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
    if (next.kind === "munch") {
      const pose = munchPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bob") {
      const pose = bobPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = huffPose(next.t);
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
    const name = TRICKS.indexOf(kind) >= 0 ? kind : "soak";
    const anim =
      name === "plod" || name === "paddle"
        ? "walk"
        : "sit";
    return {
      kind: name,
      phase: name === "soak" ? "hold" : "go",
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

  function soakPose() {
    return { lift: -5.5, rot: 8 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -5.5 + Math.sin(u * Math.PI) * 7, rot: 8 - Math.sin(u * Math.PI) * 8 };
  }

  function tuckPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.tuck));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { lift: -s * 6.5, rot: s * 6, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      return {
        lift: -6.5 + Math.abs(Math.sin(t * 4)) * 1.4,
        rot: 6 + Math.sin(t * 3) * 3.5,
        dx: 0,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { lift: -6.5 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" };
  }

  function cranePose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.crane));
    if (u < 0.28) {
      const s = smoothstep(u / 0.28);
      return { lift: s * 11, rot: -s * 16, dx: 0, anim: "sit" };
    }
    if (u < 0.72) {
      return {
        lift: 11 + Math.sin(t * 3) * 1.6,
        rot: -16 + Math.sin(t * 2.5) * 5,
        dx: Math.sin(t * 2) * 1.6,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { lift: 11 * (1 - s), rot: -16 * (1 - s), dx: 0, anim: "sit" };
  }

  function plodPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.plod));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: -s * 2, rot: s * 6, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.15) / 0.73;
      const rock = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * 22 * smoothstep(s),
        lift: Math.abs(rock) * 4.5,
        rot: rock * 12,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 22,
      lift: 2 * (1 - s),
      rot: 4 * (1 - s),
      anim: "sit",
    };
  }

  function paddlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.paddle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 1.5, rot: s * 4, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const stroke = Math.sin(s * Math.PI * 4);
      return {
        x: fromX + facing * 8 * Math.sin(s * Math.PI),
        lift: Math.abs(stroke) * 5.5,
        rot: stroke * 14,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 1.5 * (1 - s),
      rot: 3 * (1 - s),
      anim: "sit",
    };
  }

  function snorkelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snorkel));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 12, rot: -s * 6 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.18) / 0.64;
      const gulp = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + face * Math.sin(s * Math.PI) * 1.5,
        lift: 12 + Math.abs(gulp) * 2.5,
        rot: -6 * face + gulp * 5,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX, lift: 12 * (1 - s), rot: -6 * face * (1 - s), anim: "sit" };
  }

  function wipePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wipe));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: -s * 3.5, rot: s * 14 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const wipe = Math.sin(t * 14);
      return {
        x: fromX + face * wipe * 1.2,
        lift: -3.5 + Math.abs(wipe) * 2.8,
        rot: 14 * face + wipe * 10,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: -3.5 * (1 - s), rot: 14 * face * (1 - s), anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "plod" && trick.kind !== "paddle") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "soak") {
      if (next.t < SOAK_HOLD) {
        const pose = soakPose();
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SOAK_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SOAK_HOLD);
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
    if (next.kind === "tuck") {
      const pose = tuckPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "crane") {
      const pose = cranePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "plod") {
      const pose = plodPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "paddle") {
      const pose = paddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "snorkel") {
      const pose = snorkelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = wipePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SOAK_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    soakPose,
    releasePose,
    tuckPose,
    cranePose,
    plodPose,
    paddlePose,
    snorkelPose,
    wipePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    munchPose,
    bobPose,
    huffPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetTurtleTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
