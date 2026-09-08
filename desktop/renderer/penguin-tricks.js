/** Peck ground tricks while idle — ultra-polish pass. House Aptenodytes desk-colony life — huddle / toboggan / waddle / porpoise / trumpet / rockhop / ecstatic personality (huddle formal heat-ball without naming loaf or nest or den or bed or potato, toboggan belly-slide without naming soak or paddle or drift or gulp or bellyflop, waddle side-to-side walk without naming plod or zig or scurry or sidle or hopwalk, porpoise porpoising leap without naming dart or zoom or tumble or flap or leapbreach, trumpet ecstatic-call stretch without naming honk or bray or quack or carol or keeyer, rockhop bounce-hop without naming hop or binky or popcorn or zoom or prance, ecstatic flipper-ecstatic display without naming fan or flash or strut or triumph or chinstrap; window-play BOW leaves penguin alone — never name a trick bow; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip/Echo own their tricks; guest slug Peck / key penguin — accept "penguin" and "peck"; do NOT name a trick penguin or peck or bow or preen or paddle or quote or crack). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous bray / beak / shimmy. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map penguin-tricks.ts. Window-play BOW unchanged. True penguin desk life — not budgie/hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven/parrot clones. Quill owns the next seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "penguin";
  const TRICKS = ["huddle", "toboggan", "waddle", "porpoise", "trumpet", "rockhop", "ecstatic"];
  const HAPPY = ["bray", "beak", "shimmy"];
  const HAPPY_DUR = { bray: 1.64, beak: 1.72, shimmy: 1.58 };
  const HUDDLE_HOLD = 14.6;
  const RELEASE_S = 1.06;
  const DUR = {
  huddle: HUDDLE_HOLD + RELEASE_S,
  toboggan: 2.40,
  waddle: 2.52,
  porpoise: 2.28,
  trumpet: 2.36,
  rockhop: 2.44,
  ecstatic: 2.50,
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
  if (kind === "huddle") return 44 + roll * 30;
  if (kind === "toboggan" || kind === "rockhop") return 13 + roll * 9;
  if (kind === "trumpet" || kind === "ecstatic") return 12 + roll * 9;
  if (kind === "waddle" || kind === "porpoise") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

  function pickTrick(rand, musicOn = false, lastKind) {
  if (musicOn) return "huddle";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "huddle" ? 0.55 : k === "waddle" || k === "trumpet" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "waddle";
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
  return key === TRICK_KEY || key === "peck";
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
  const name = HAPPY.indexOf(kind) >= 0 ? kind : "bray";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "bray" ? "talk" : name === "shimmy" ? "play" : "sit"),
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

  function brayPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bray));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 6, rot: -s * 12, dx: 0, anim: "talk" };
  }
  if (u < 0.82) {
    const phrase = Math.sin(t * 10) + 0.26 * Math.sin(t * 18);
    return {
      lift: 6 + Math.abs(phrase) * 4,
      rot: -12 + phrase * 8,
      dx: phrase * 1.6,
      anim: "talk",
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
}

  function beakPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.beak));
  return {
    lift: 4 + Math.sin(u * Math.PI) * 5,
    rot: Math.sin(u * Math.PI * 3) * 14,
    dx: Math.sin(u * Math.PI) * 3.2,
    anim: "sit",
  };
}

  function shimmyPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shimmy));
  if (u < 0.88) {
    const buzz = Math.sin(t * 14) + 0.22 * Math.sin(t * 26);
    return {
      lift: 4 + Math.abs(buzz) * 5,
      rot: buzz * 14,
      dx: Math.sin(t * 11) * 2.4,
      anim: "play",
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 4, dx: 0, anim: "idle" };
}

  function stepHappy(happy, dt, flags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
  const hold = HAPPY_DUR[next.kind];
  const pose =
    next.kind === "bray" ? brayPose(next.t) : next.kind === "beak" ? beakPose(next.t) : shimmyPose(next.t);
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
    kind === "huddle" || kind === "ecstatic"
      ? ("sit")
      : kind === "toboggan" || kind === "porpoise" || kind === "rockhop"
        ? ("play")
        : kind === "waddle"
          ? ("walk")
          : kind === "trumpet"
            ? ("talk")
            : ("sit");
  return {
    kind,
    phase: kind === "huddle" ? ("hold") : ("go"),
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

  function huddlePose(t) {
  const soft = Math.sin(t * 1.5);
  const breath = Math.sin(t * 2.8);
  return { lift: 3 + soft * 4 + Math.abs(breath) * 1.5, rot: 12 + breath * 8 + Math.sin(t * 2.1) * 5 };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 12 * (1 - u) };
}

  function tobogganPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.toboggan));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: -s * 5, rot: s * 28 * face, anim: "sit" };
  }
  if (u < 0.82) {
    const s = (u - 0.14) / 0.68;
    return {
      x: fromX + face * 36 * smoothstep(s),
      lift: -5 + Math.sin(s * Math.PI) * 2.5,
      rot: face * (28 - s * 8),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + face * 36,
    lift: -5 * (1 - s),
    rot: face * 16 * (1 - s),
    anim: "sit",
  };
}

  function waddlePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.waddle));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 4, rot: s * 12 * face, anim: "sit" };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const step = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + face * 22 * smoothstep(s),
      lift: 4 + Math.abs(step) * 5,
      rot: face * (12 + step * 14),
      anim: "walk",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 22,
    lift: 3 * (1 - s),
    rot: face * 6 * (1 - s),
    anim: "sit",
  };
}

  function porpoisePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.porpoise));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4, rot: -s * 10, anim: "sit" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const arc = Math.sin(s * Math.PI * 2.5);
    return {
      x: fromX + face * 32 * smoothstep(s),
      lift: 4 + Math.max(0, arc) * 16,
      rot: face * (arc * 22),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 32,
    lift: 3 * (1 - s),
    rot: face * 6 * (1 - s),
    anim: "sit",
  };
}

  function trumpetPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.trumpet));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 8, rot: -s * 16, anim: "talk" };
  }
  if (u < 0.82) {
    const call = Math.sin(t * 9) + 0.24 * Math.sin(t * 17);
    return {
      x: fromX + face * Math.sin(t * 7) * 2.2,
      lift: 8 + Math.abs(call) * 5,
      rot: -16 + call * 10,
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 5 * (1 - s),
    rot: -8 * (1 - s),
    anim: "sit",
  };
}

  function rockhopPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.rockhop));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 5, rot: s * -6 * face, anim: "sit" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const hop = Math.abs(Math.sin(s * Math.PI * 4));
    return {
      x: fromX + face * 26 * smoothstep(s),
      lift: 5 + hop * 10,
      rot: face * (-6 + Math.sin(s * Math.PI * 4) * 14),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 26,
    lift: 3 * (1 - s),
    rot: -3 * (1 - s) * face,
    anim: "idle",
  };
}

  function ecstaticPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.ecstatic));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 9, rot: s * 18 * face, anim: "talk" };
  }
  if (u < 0.86) {
    const flap = Math.sin(t * 12) + 0.2 * Math.sin(t * 24);
    return {
      x: fromX + face * Math.sin(t * 6) * 2.5,
      lift: 9 + Math.abs(flap) * 5,
      rot: (18 + flap * 12) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 5 * (1 - s),
    rot: 8 * (1 - s) * face,
    anim: "idle",
  };
}

  function stepTrick(trick, dt, flags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "toboggan" && trick.kind !== "porpoise" && trick.kind !== "rockhop") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "huddle") {
    if (next.t < HUDDLE_HOLD) {
      const pose = huddlePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < HUDDLE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HUDDLE_HOLD);
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
  if (next.kind === "toboggan") {
    const pose = tobogganPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "waddle") {
    const pose = waddlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "porpoise") {
    const pose = porpoisePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "trumpet") {
    const pose = trumpetPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rockhop") {
    const pose = rockhopPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ecstaticPose(next.t, fromX, trick.facing);
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
    HUDDLE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    huddlePose,
    releasePose,
    tobogganPose,
    waddlePose,
    porpoisePose,
    trumpetPose,
    rockhopPose,
    ecstaticPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    brayPose,
    beakPose,
    shimmyPose,
    stepHappy,
    smoothstep,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPenguinTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
