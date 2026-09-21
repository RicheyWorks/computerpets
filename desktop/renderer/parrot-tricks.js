/** Quill ground tricks while idle — ultra-polish pass. House Ara macaw desk-colony life — quote / strut / fan / crack / flash / pineye / invert personality (quote theatrical chest delivery without naming mimic or trumpet or carol or chatter or talkalong, strut macaw swagger walk without naming trot or prance or waddle or sidle or hopwalk, fan wing-and-tail fan without naming flare or flashwing or prance or plume or triumph, crack hooked-bill nut work without naming beakgrind or shellout or chew or nibble or seedhammer, flash sudden wing-flash without naming wave or dangle or porpoise or zoom or flapburst, pineye pupil-pin excitement without naming bobble or nod or listen or feebee or glare, invert upside-down hang display without naming dangle or hangup or toboggan or tumble or hang; window-play HOOK leaves parrot alone — never name a trick hook; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Echo/Peck own their tricks; guest slug Quill / key parrot — accept "parrot" and "quill"; do NOT name a trick parrot or quill or hook or preen or mimic or beak or roost or berry). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous squawk / bravo / scissor. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map parrot-tricks.ts. Window-play HOOK unchanged. True macaw desk life — not penguin/budgie/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven/toucan clones. Brood owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via parrot.wav. Amplitudes raised toward Rui richness; denser waits/weights (QUOTE_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names parrot/quill/hook/loaf as bare ethogram-only trick kinds. Window-play HOOK unchanged. Next leftover Brood / cicada. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "parrot";
  const TRICKS = ["quote", "strut", "fan", "crack", "flash", "pineye", "invert"];
  const HAPPY = ["squawk", "bravo", "scissor"];
  const HAPPY_DUR = { squawk: 1.64, bravo: 1.72, scissor: 1.58 };
  const QUOTE_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
  quote: QUOTE_HOLD + RELEASE_S,
  strut: 2.40,
  fan: 2.52,
  crack: 2.28,
  flash: 2.36,
  pineye: 2.44,
  invert: 2.50,
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
  if (kind === "quote") return 40 + roll * 26;
  if (kind === "strut" || kind === "fan" || kind === "crack" || kind === "flash" || kind === "pineye" || kind === "invert") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

  function pickTrick(rand, musicOn = false, lastKind) {
  if (musicOn) return "quote";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "quote" ? 0.72 : k === "strut" || k === "fan" ? 1.28 : k === "invert" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "strut";
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
  return key === TRICK_KEY || key === "quill";
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
  const name = HAPPY.indexOf(kind) >= 0 ? kind : "squawk";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "squawk" ? "talk" : name === "bravo" ? "play" : "sit"),
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

  function squawkPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.squawk));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 7.2, rot: -s * 14.4, dx: 0, anim: "talk" };
  }
  if (u < 0.82) {
    const phrase = Math.sin(t * 10) + 0.26 * Math.sin(t * 18);
    return {
      lift: 7.2 + Math.abs(phrase) * 4.8,
      rot: -14.4 + phrase * 9.6,
      dx: phrase * 1.92,
      anim: "talk",
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4.8 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "sit" };
}

  function bravoPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bravo));
  if (u < 0.88) {
    const buzz = Math.sin(t * 14) + 0.22 * Math.sin(t * 26);
    return {
      lift: 4.8 + Math.abs(buzz) * 6,
      rot: buzz * 16.8,
      dx: Math.sin(t * 11) * 2.88,
      anim: "play",
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 4.8, dx: 0, anim: "idle" };
}

  function scissorPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scissor));
  return {
    lift: 4.8 + Math.sin(u * Math.PI) * 6,
    rot: Math.sin(u * Math.PI * 5) * 16.8,
    dx: Math.sin(u * Math.PI * 2) * 3.84,
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
  const pose =
    next.kind === "squawk" ? squawkPose(next.t) : next.kind === "bravo" ? bravoPose(next.t) : scissorPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.dx = pose.dx;
  next.anim = pose.anim;
  if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

  function sleepHoldFrame(_key, _frameCount) {
  return null;
}

  function beginTrick(kind, x, facing) {
  const anim =
    kind === "quote"
      ? ("talk")
      : kind === "strut"
        ? ("walk")
        : kind === "fan" || kind === "flash" || kind === "invert"
          ? ("play")
          : kind === "crack" || kind === "pineye"
            ? ("sit")
            : ("sit");
  return {
    kind,
    phase: kind === "quote" ? ("hold") : ("go"),
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

  function quotePose(t) {
  const soft = Math.sin(t * 1.8);
  const breath = Math.sin(t * 2.8);
  return { lift: 6 + soft * 4.8 + Math.abs(breath) * 2.4, rot: -26.4 + breath * 7.2 + Math.sin(t * 5.2) * 7.2 };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -26.4 * (1 - u) };
}

  function strutPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.strut));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 4.8, rot: s * 14.4 * face, anim: "sit" };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const step = Math.sin(s * Math.PI * 4.5);
    return {
      x: fromX + face * 31.2 * smoothstep(s),
      lift: 4.8 + Math.abs(step) * 6,
      rot: face * (14.4 + step * 16.8),
      anim: "walk",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 31.2,
    lift: 3.6 * (1 - s),
    rot: face * 7.2 * (1 - s),
    anim: "sit",
  };
}

  function fanPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.fan));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 8.4, rot: -s * 12, anim: "sit" };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    return {
      x: fromX + face * Math.sin(s * Math.PI) * 3,
      lift: 8.4 + Math.sin(s * Math.PI) * 7.2,
      rot: -12 + Math.sin(s * Math.PI * 2) * 21.6,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 6 * (1 - s),
    rot: 3.6 * (1 - s),
    anim: "sit",
  };
}

  function crackPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.crack));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: -s * 3.6, rot: s * 14.4 * face, anim: "sit" };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const bite = Math.sin(s * Math.PI * 6);
    return {
      x: fromX + face * Math.abs(bite) * 2.88,
      lift: -3.6 + Math.abs(bite) * 6,
      rot: face * (14.4 + bite * 16.8),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: -2.4 * (1 - s),
    rot: face * 6 * (1 - s),
    anim: "sit",
  };
}

  function flashPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.flash));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return {
      x: fromX,
      lift: s * 12,
      rot: -s * 21.6,
      anim: "play",
    };
  }
  if (u < 0.72) {
    return {
      x: fromX + face * Math.sin(t * 8) * 2.64,
      lift: 12 + Math.abs(Math.sin(t * 10)) * 4.8,
      rot: -21.6 + Math.sin(t * 9) * 14.4,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 8.4 * (1 - s),
    rot: -14.4 * (1 - s),
    anim: "sit",
  };
}

  function pineyePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.pineye));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6, rot: -s * 9.6 * face, anim: "sit" };
  }
  if (u < 0.88) {
    const pin = Math.sin(t * 11) + 0.28 * Math.sin(t * 23);
    return {
      x: fromX + face * Math.sin(t * 6) * 2.16,
      lift: 6 + Math.abs(pin) * 4.8,
      rot: face * (-9.6 + pin * 19.2),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 3.6 * (1 - s),
    rot: -4.8 * (1 - s) * face,
    anim: "sit",
  };
}

  function invertPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.invert));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 9.6, rot: s * 192 * face, anim: "play" };
  }
  if (u < 0.82) {
    const sway = Math.sin(t * 7) + 0.2 * Math.sin(t * 15);
    return {
      x: fromX + face * sway * 2.64,
      lift: 9.6 + Math.abs(sway) * 3.6,
      rot: face * (192 + sway * 21.6),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 6 * (1 - s),
    rot: face * 192 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "strut" && trick.kind !== "flash" && trick.kind !== "invert") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "quote") {
    if (next.t < QUOTE_HOLD) {
      const pose = quotePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "talk";
      return next;
    }
    if (next.t < QUOTE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - QUOTE_HOLD);
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
  if (next.kind === "strut") {
    const pose = strutPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fan") {
    const pose = fanPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "crack") {
    const pose = crackPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "flash") {
    const pose = flashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pineye") {
    const pose = pineyePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = invertPose(next.t, fromX, trick.facing);
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
    QUOTE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    quotePose,
    releasePose,
    strutPose,
    fanPose,
    crackPose,
    flashPose,
    pineyePose,
    invertPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    squawkPose,
    bravoPose,
    scissorPose,
    stepHappy,
    smoothstep,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetParrotTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
