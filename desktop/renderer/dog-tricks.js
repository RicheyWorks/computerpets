/** Pip ground tricks while idle — ultra-polish pass. House dog — wait / wag / sniff / bow / zoom / beg / pant personality (loyal hearth-rug desk dog life). Wait sit-stay without naming loaf or nest or den or sprawl or curl; wag whole-body without naming wave (Rui) or knead; sniff nose-to-rug without naming fossick or wash; bow play-invite without naming Earth's happy bow clone or stretch alone; zoom short dash without naming pounce or somersault or hunt; beg sit-up treat-ask without naming rise ethogram alone or paw-offer name collision; pant warm rhythmic breath without naming mlem or howl or talk. Window-play FLOOR watch unchanged — never renames floor watch. Guest slug Pip / key dog — accept "dog" and "pip". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`dog.wav`). Thank-yous tail / tilt / woof. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `dog-tricks.ts`. True house-dog desk life — not Rui/cat/rabbit/hamster/guinea-pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / cat already done; Pip continues mammal ultra-polish. Next guest ultra is Thimble / rabbit. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. */
(function (root) {
  const TRICK_KEY = "dog";
  const TRICKS = ["wait", "wag", "sniff", "bow", "zoom", "beg", "pant"];
  const HAPPY = ["tail", "tilt", "woof"];
  const HAPPY_DUR = { tail: 1.58, tilt: 1.66, woof: 1.72 };
  const WAIT_HOLD = 14.4;
  const RELEASE_S = 1.02;
  const DUR = {
    wait: WAIT_HOLD + RELEASE_S,
    wag: 2.1,
    sniff: 2.18,
    bow: 2.12,
    zoom: 1.85,
    beg: 2.08,
    pant: 1.95,
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
    if (kind === "wait") return 42 + roll * 28;
    if (kind === "zoom") return 12 + roll * 9;
    if (kind === "beg" || kind === "pant") return 11 + roll * 8;
    if (kind === "wag" || kind === "sniff") return 11 + roll * 8;
    if (kind === "bow") return 10 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "wait";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) => (k === "wait" ? 0.55 : k === "wag" || k === "sniff" || k === "beg" ? 1.15 : 1));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "wag";
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
    return key === TRICK_KEY || key === "pip";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "tail";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "tilt" ? "sit" : name === "tail" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function tailPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tail));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 4.5, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.85) {
      const buzz = Math.sin(t * 16) + 0.2 * Math.sin(t * 26);
      return {
        lift: 4.5 + Math.abs(buzz) * 3.2,
        rot: 10 + buzz * 9,
        dx: buzz * 0.8,
        anim: "talk",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 4.5 * (1 - s), rot: Math.sin(s * Math.PI) * 4, dx: 0, anim: "sit" };
  }

  function tiltPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tilt));
    if (u < 0.28) {
      const s = u / 0.28;
      return { lift: -s * 5.5, rot: s * 14, dx: 0, anim: "sit" };
    }
    if (u < 0.72) {
      const soft = Math.sin(t * 6);
      return { lift: -5.5 + soft * 1.2, rot: 14 + soft * 4, dx: 0, anim: "sit" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: -5.5 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "sit" };
  }

  function woofPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.woof));
    return {
      lift: Math.sin(u * Math.PI) * 12,
      rot: Math.sin(u * Math.PI * 2) * 14,
      dx: Math.sin(u * Math.PI) * 3.5,
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
    if (next.kind === "tail") {
      const pose = tailPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tilt") {
      const pose = tiltPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = woofPose(next.t);
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
    const name = TRICKS.indexOf(kind) >= 0 ? kind : "wait";
    const anim =
      name === "wait" || name === "wag" || name === "sniff" || name === "bow" || name === "beg" || name === "pant"
        ? "sit"
        : name === "zoom"
          ? "play"
          : "sit";
    return {
      kind: name,
      phase: name === "wait" ? "hold" : "go",
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

  function waitPose(t) {
    const soft = Math.sin(t * 1.7);
    const breath = Math.sin(t * 2.8);
    return {
      lift: -4.2 + soft * 1.5 + Math.abs(breath) * 1.0,
      rot: 8 + breath * 5 + Math.sin(t * 5.1) * 3.5,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return {
      lift: -4.2 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 6,
      rot: 8 * (1 - u) + Math.sin(u * Math.PI) * 8,
    };
  }

  function wagPose(t) {
    const press = Math.abs(Math.sin(t * 12));
    return {
      lift: -1.0 + press * 10.5,
      rot: Math.sin(t * 14) * 16,
      dx: 0,
      anim: "sit",
    };
  }

  function sniffPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.sniff));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: -s * 6, rot: s * 12, dx: s * 4, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: -6 + Math.sin(t * 9) * 2.2,
        rot: 12 + Math.sin(t * 7) * 6,
        dx: 4 + Math.sin(t * 5) * 2,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: -6 * (1 - s), rot: 12 * (1 - s), dx: 4 * (1 - s), anim: "sit" };
  }

  function bowPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.bow));
    if (u < 0.28) {
      const s = smoothstep(u / 0.28);
      return { lift: -s * 7, rot: -s * 20, dx: s * 3, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.28) / 0.44;
      return {
        lift: -7 + Math.sin(s * Math.PI) * 3,
        rot: -20 + Math.sin(s * Math.PI) * 5,
        dx: 3,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { lift: -7 * (1 - s), rot: -20 * (1 - s), dx: 3 * (1 - s), anim: "sit" };
  }

  function zoomPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.zoom));
    const face = facing == null ? 1 : facing;
    if (u < 0.24) {
      const s = smoothstep(u / 0.24);
      return { x: fromX, lift: -s * 6, rot: s * 12, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.24) / 0.46;
      return {
        x: fromX + face * 28 * smoothstep(s),
        lift: Math.sin(s * Math.PI) * 18,
        rot: Math.sin(s * Math.PI) * -14,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + face * 28,
      lift: 3 * (1 - s),
      rot: -5 * (1 - s),
      anim: "sit",
    };
  }

  function begPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.beg));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 10, rot: s * 12 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const sway = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + face * sway * 2.5,
        lift: 10 + Math.abs(sway) * 4,
        rot: (10 + sway * 8) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 10 * (1 - s), rot: 10 * face * (1 - s), anim: "sit" };
  }

  function pantPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pant));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4, rot: s * 8 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const huff = Math.sin(s * Math.PI * 6);
      return {
        x: fromX + face * huff * 1.2,
        lift: 4 + Math.abs(huff) * 5.5,
        rot: (6 + huff * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 4 * (1 - s), rot: 6 * face * (1 - s), anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "zoom") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "wait") {
      if (next.t < WAIT_HOLD) {
        const pose = waitPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < WAIT_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - WAIT_HOLD);
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
    if (next.kind === "wag") {
      const pose = wagPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sniff") {
      const pose = sniffPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bow") {
      const pose = bowPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "beg") {
      const pose = begPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pant") {
      const pose = pantPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = zoomPose(next.t, fromX, face);
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
    WAIT_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    waitPose,
    releasePose,
    wagPose,
    sniffPose,
    bowPose,
    zoomPose,
    begPose,
    pantPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    tailPose,
    tiltPose,
    woofPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDogTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
