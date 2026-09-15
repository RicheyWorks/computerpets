/** Clip ground tricks while idle — ultra-polish pass. House hamster — nest / cheek / scurry / pocket / reel / scrub / seed personality (soft night-shift desk hamster life). Nest drawer-settle without naming loaf or wait or flop or den or sprawl or curl; cheek pouch-fill without naming wash or face_wash eth alone; scurry night-dart without naming zoom or binky or popcorn; pocket paperclip-hoard without naming stash (window-play) or dig; reel wheel-spin-in-place without naming dance or spin alone; scrub face-paw wipe without naming wash or groom or mlem; seed soft forage pick without naming nibble (eth / guinea happy) or nosh or eat-cmd. Window-play STASH drawer unchanged — never names stash. Guest slug Clip / key hamster — accept "hamster" and "clip". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`hamster.wav`). Thank-yous stuff / chitter / sprint. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web hamster-tricks.ts. True house-hamster desk life — not Rui/cat/dog/rabbit/guinea-pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip / Thimble already done; Clip continues mammal ultra-polish. Next guest ultra is Whee / guinea_pig. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`.  hamster.wav EXISTS so prefersHouseCry adds hamster. Amplitudes raised toward Rui richness; denser waits/weights (NEST_HOLD=11.2 RELEASE_S=1.18). Catalog 221. */
(function (root) {
  const TRICK_KEY = "hamster";
  const TRICKS = ["nest", "cheek", "scurry", "pocket", "reel", "scrub", "seed"];
  const HAPPY = ["stuff", "chitter", "sprint"];
  const HAPPY_DUR = { stuff: 1.58, chitter: 1.66, sprint: 1.72 };
  const NEST_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    nest: NEST_HOLD + RELEASE_S,
    cheek: 2.1,
    scurry: 1.85,
    pocket: 2.12,
    reel: 2.08,
    scrub: 2.1,
    seed: 1.95,
  };

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
    if (kind === "nest") return 40 + roll * 26;
    if (kind === "scurry" || kind === "reel" || kind === "pocket") return 12.8 + roll * 9.4;
    if (kind === "cheek" || kind === "scrub" || kind === "seed") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "nest";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "nest" ? 0.72 : k === "cheek" || k === "pocket" || k === "scrub" ? 1.28 : k === "scurry" || k === "reel" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "cheek";
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
    return key === TRICK_KEY || key === "clip";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "stuff";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "chitter" ? "talk" : name === "stuff" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function stuffPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.stuff));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: -s * 4.5, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.85) {
      const buzz = Math.sin(t * 14) + 0.2 * Math.sin(t * 22);
      return {
        lift: -5.4 + Math.abs(buzz) * 3.8,
        rot: 12 + buzz * 11,
        dx: buzz * 0.8,
        anim: "sit",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: -4.5 * (1 - s), rot: Math.sin(s * Math.PI) * 4, dx: 0, anim: "sit" };
  }

  function chitterPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chitter));
    if (u < 0.28) {
      const s = u / 0.28;
      return { lift: s * 5.5, rot: s * 14, dx: 0, anim: "talk" };
    }
    if (u < 0.72) {
      const soft = Math.sin(t * 18);
      return { lift: 6.6 + Math.abs(soft) * 2.6, rot: 17 + soft * 10, dx: 0, anim: "talk" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 5.5 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "sit" };
  }

  function sprintPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sprint));
    return {
      lift: Math.sin(u * Math.PI) * 12,
      rot: Math.sin(u * Math.PI * 2) * 14,
      dx: Math.sin(u * Math.PI) * 8,
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
    if (next.kind === "stuff") {
      const pose = stuffPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chitter") {
      const pose = chitterPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sprintPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame() {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const name = TRICKS.indexOf(kind) >= 0 ? kind : "nest";
    const anim =
      name === "nest" || name === "cheek" || name === "pocket" || name === "scrub" || name === "seed"
        ? "sit"
        : name === "scurry" || name === "reel"
          ? "play"
          : "sit";
    return {
      kind: name,
      phase: name === "nest" ? "hold" : "go",
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

  function nestPose(t) {
    const soft = Math.sin(t * 1.7);
    const breath = Math.sin(t * 2.8);
    return {
      lift: -5.0 + soft * 1.8 + Math.abs(breath) * 1.2,
      rot: -17 + breath * 5 + Math.sin(t * 5.1) * 3.6,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return {
      lift: -4.2 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 6,
      rot: -14 * (1 - u) + Math.sin(u * Math.PI) * 8,
    };
  }

  function cheekPose(t) {
    const press = Math.abs(Math.sin(t * 12));
    return {
      lift: -1.0 + press * 10.5,
      rot: Math.sin(t * 14) * 16,
      dx: 0,
      anim: "sit",
    };
  }

  function pocketPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.pocket));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: -s * 6, rot: s * 12, dx: s * 4, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: -7.2 + Math.sin(t * 14) * 4.2,
        rot: 14 + Math.sin(t * 12) * 9.5,
        dx: 4 + Math.sin(t * 10) * 2,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: -6 * (1 - s), rot: 12 * (1 - s), dx: 4 * (1 - s), anim: "sit" };
  }

  function reelPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.reel));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { lift: s * 4, rot: s * 16, dx: 0, anim: "play" };
    }
    if (u < 0.85) {
      return {
        lift: 4.8 + Math.abs(Math.sin(t * 16)) * 7.2,
        rot: Math.sin(t * 14) * 28,
        dx: Math.sin(t * 12) * 4,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { lift: 4 * (1 - s), rot: 16 * (1 - s), dx: 0, anim: "sit" };
  }

  function scurryPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scurry));
    const face = facing == null ? 1 : facing;
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: -s * 6, rot: s * 12, anim: "sit" };
    }
    if (u < 0.75) {
      const s = (u - 0.2) / 0.55;
      return {
        x: fromX + face * 28 * smoothstep(s),
        lift: Math.abs(Math.sin(s * Math.PI * 3)) * 10,
        rot: Math.sin(s * Math.PI * 4) * 16,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return {
      x: fromX + face * 28,
      lift: 3 * (1 - s),
      rot: 4 * (1 - s),
      anim: "sit",
    };
  }

  function scrubPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scrub));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: -s * 5, rot: s * 14 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const wipe = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + face * (2 + wipe * 2),
        lift: -6 + Math.abs(wipe) * 9.5,
        rot: 17 * face + wipe * 12,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: -5 * (1 - s), rot: 14 * face * (1 - s), anim: "sit" };
  }

  function seedPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.seed));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -s * 4, rot: s * 8 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const pick = Math.sin(s * Math.PI * 6);
      return {
        x: fromX + face * pick * 1.2,
        lift: -4.8 + Math.abs(pick) * 6.6,
        rot: 10 * face + pick * 8.5,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: -4 * (1 - s), rot: 8 * face * (1 - s), anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "scurry") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "nest") {
      if (next.t < NEST_HOLD) {
        const pose = nestPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < NEST_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - NEST_HOLD);
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
    const face = trick.facing;
    if (next.kind === "cheek") {
      const pose = cheekPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pocket") {
      const pose = pocketPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "reel") {
      const pose = reelPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "scrub") {
      const pose = scrubPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "seed") {
      const pose = seedPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = scurryPose(next.t, fromX, face);
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
    NEST_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    nestPose,
    releasePose,
    cheekPose,
    pocketPose,
    reelPose,
    scurryPose,
    scrubPose,
    seedPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    stuffPose,
    chitterPose,
    sprintPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHamsterTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
