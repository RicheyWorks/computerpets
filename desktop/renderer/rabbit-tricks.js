/** Thimble ground tricks while idle — ultra-polish pass. House rabbit — flop / groom / periscope / dig / binky / rub / nosh personality (soft hearth-rug desk rabbit life). Flop side-tipple without naming loaf or wait or nest or den or sprawl or curl; groom face-and-shoulder without naming wash or face_wash eth alone; periscope haunch-scan without naming beg or rise alone; dig carpet scrape without naming scratch (ethogram) or knead; binky twist-leap without naming zoom or somersault or pounce or popcorn; rub chin-scent mark without naming chin (chinchilla) or bunting; nosh soft forage chew without naming nibble (hamster eth / guinea happy) or mlem or eat-cmd. Window-play FLOOR thump unchanged — never names thump or bow. Guest slug Thimble / key rabbit — accept "rabbit" and "thimble". Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk (`rabbit.wav`). Thank-yous twitch / ears / nudge. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web `rabbit-tricks.ts`. True house-rabbit desk life — not Rui/cat/dog/hamster/guinea-pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/dragon/Vesper or *Dragon electrical clones. Bird ultra line (Soot→Ember) and Miso / Pip already done; Thimble continues mammal ultra-polish. Next guest ultra is Clip / hamster. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. */
(function (root) {
  const TRICK_KEY = "rabbit";
  const TRICKS = ["flop", "groom", "periscope", "dig", "binky", "rub", "nosh"];
  const HAPPY = ["twitch", "ears", "nudge"];
  const HAPPY_DUR = { twitch: 1.58, ears: 1.66, nudge: 1.72 };
  const FLOP_HOLD = 14.4;
  const RELEASE_S = 1.02;
  const DUR = {
    flop: FLOP_HOLD + RELEASE_S,
    groom: 2.1,
    periscope: 2.18,
    dig: 2.12,
    binky: 1.85,
    rub: 2.08,
    nosh: 1.95,
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
    if (kind === "flop") return 42 + roll * 28;
    if (kind === "binky") return 12 + roll * 9;
    if (kind === "rub" || kind === "nosh") return 11 + roll * 8;
    if (kind === "groom" || kind === "periscope") return 11 + roll * 8;
    if (kind === "dig") return 10 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "flop";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) => (k === "flop" ? 0.55 : k === "groom" || k === "periscope" || k === "rub" ? 1.15 : 1));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "groom";
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
    return key === TRICK_KEY || key === "thimble";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "twitch";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "ears" ? "sit" : name === "twitch" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function twitchPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.twitch));
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

  function earsPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ears));
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

  function nudgePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nudge));
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
    if (next.kind === "twitch") {
      const pose = twitchPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ears") {
      const pose = earsPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = nudgePose(next.t);
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
    const name = TRICKS.indexOf(kind) >= 0 ? kind : "flop";
    const anim =
      name === "flop" || name === "groom" || name === "periscope" || name === "dig" || name === "rub" || name === "nosh"
        ? "sit"
        : name === "binky"
          ? "play"
          : "sit";
    return {
      kind: name,
      phase: name === "flop" ? "hold" : "go",
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

  function flopPose(t) {
    const soft = Math.sin(t * 1.7);
    const breath = Math.sin(t * 2.8);
    return {
      lift: -4.2 + soft * 1.5 + Math.abs(breath) * 1.0,
      rot: -14 + breath * 4 + Math.sin(t * 5.1) * 3,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return {
      lift: -4.2 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 6,
      rot: -14 * (1 - u) + Math.sin(u * Math.PI) * 8,
    };
  }

  function groomPose(t) {
    const press = Math.abs(Math.sin(t * 12));
    return {
      lift: -1.0 + press * 10.5,
      rot: Math.sin(t * 14) * 16,
      dx: 0,
      anim: "sit",
    };
  }

  function periscopePose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.periscope));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: s * 12, rot: s * 6, dx: 0, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: 12 + Math.sin(t * 4) * 2.2,
        rot: 6 + Math.sin(t * 5) * 6,
        dx: Math.sin(t * 3) * 2,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: 12 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" };
  }

  function digPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.dig));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: -s * 6, rot: s * 12, dx: s * 4, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: -6 + Math.sin(t * 14) * 3.5,
        rot: 12 + Math.sin(t * 12) * 8,
        dx: 4 + Math.sin(t * 10) * 2.5,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: -6 * (1 - s), rot: 12 * (1 - s), dx: 4 * (1 - s), anim: "sit" };
  }

  function binkyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.binky));
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
        rot: Math.sin(s * Math.PI * 2) * 20,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + face * 28,
      lift: 3 * (1 - s),
      rot: 5 * (1 - s),
      anim: "sit",
    };
  }

  function rubPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rub));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: -s * 5, rot: s * 14 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const sway = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + face * (3 + sway * 2.5),
        lift: -5 + Math.abs(sway) * 4,
        rot: (12 + sway * 8) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: -5 * (1 - s), rot: 12 * face * (1 - s), anim: "sit" };
  }

  function noshPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nosh));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -4, rot: s * 8 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const chew = Math.sin(s * Math.PI * 6);
      return {
        x: fromX + face * chew * 1.2,
        lift: -4 + Math.abs(chew) * 5.5,
        rot: (6 + chew * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: -4 * (1 - s), rot: 6 * face * (1 - s), anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "binky") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "flop") {
      if (next.t < FLOP_HOLD) {
        const pose = flopPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < FLOP_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - FLOP_HOLD);
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
    if (next.kind === "groom") {
      const pose = groomPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "periscope") {
      const pose = periscopePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dig") {
      const pose = digPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rub") {
      const pose = rubPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nosh") {
      const pose = noshPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = binkyPose(next.t, fromX, face);
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
    FLOP_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    flopPose,
    releasePose,
    groomPose,
    periscopePose,
    digPose,
    binkyPose,
    rubPose,
    noshPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    twitchPose,
    earsPose,
    nudgePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRabbitTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
