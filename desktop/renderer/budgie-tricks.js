/** Echo ground tricks while idle — ultra-polish pass. House neighborly Melopsittacus undulatus budgerigar desk life — preen / bobble / mimic / sidle / dangle / beakgrind / shellout personality (preen Melopsittacus feather-work without naming groom or wash or scratch or anting or oil, bobble head-bob display without naming bob or nod or bow or listen or feebee, mimic talk-along without naming quote or chatter or carol or whistle or trill or song or sing or cry or call, sidle sideways perch-walk without naming hopwalk or waddle or plod or scurry or zig or zoom, dangle upside hang without naming toboggan or porpoise or tumble or hangup or flap, beakgrind contented beak-grind without naming grind or crack or flash or fan or strut or chew or nibble, shellout seed-husk tongue-work without naming crack or gulp or munch or eat or cache or seedhammer; window-play PERCH leaves budgie alone — never name a trick perch; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own their tricks; guest slug Echo / key budgie — accept "budgie" and "echo"; do NOT name a trick budgie or echo or perch or groom or wash or chirp or chatter). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous whistle / trill / ruffle. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web budgie-tricks.ts. Window-play PERCH unchanged. True budgerigar desk life — not hummingbird/woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven/parrot clones. Peck owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via budgie.wav. Amplitudes raised toward Rui richness; denser waits/weights (PREEN_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names budgie/echo/perch/loaf as bare ethogram-only trick kinds. Window-play PERCH unchanged. Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; Cap now Rue-dense; Lattice now Rue-dense; Horn now Rue-dense; next leftover Ring / turkey_tail. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "budgie";
  const TRICKS = ["preen", "bobble", "mimic", "sidle", "dangle", "beakgrind", "shellout"];
  const HAPPY = ["whistle", "trill", "ruffle"];
  const HAPPY_DUR = { whistle: 1.64, trill: 1.72, ruffle: 1.58 };
  const PREEN_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
  preen: PREEN_HOLD + RELEASE_S,
  bobble: 2.40,
  mimic: 2.52,
  sidle: 2.28,
  dangle: 2.36,
  beakgrind: 2.44,
  shellout: 2.50,
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
  if (kind === "preen") return 40 + roll * 26;
  if (kind === "bobble" || kind === "mimic" || kind === "sidle" || kind === "dangle" || kind === "beakgrind" || kind === "shellout") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

  function pickTrick(rand, musicOn = false, lastKind) {
  if (musicOn) return "mimic";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "preen" ? 0.72 : k === "mimic" || k === "bobble" ? 1.28 : k === "beakgrind" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "bobble";
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
  return key === TRICK_KEY || key === "echo";
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
  const name = HAPPY.indexOf(kind) >= 0 ? kind : "whistle";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "whistle" ? "talk" : name === "trill" ? "talk" : "play"),
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

  function whistlePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.whistle));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 7.2, rot: -s * 12, dx: 0, anim: "talk" };
  }
  if (u < 0.82) {
    const phrase = Math.sin(t * 9) + 0.26 * Math.sin(t * 18);
    return {
      lift: 7.2 + Math.abs(phrase) * 4.8,
      rot: -12 + phrase * 8.4,
      dx: phrase * 2.16,
      anim: "talk",
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4.8 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
}

  function trillPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.trill));
  if (u < 0.88) {
    const buzz = Math.sin(t * 14) + 0.22 * Math.sin(t * 28);
    return {
      lift: 4.8 + Math.abs(buzz) * 6,
      rot: buzz * 14.4,
      dx: Math.sin(t * 10) * 2.64,
      anim: "talk",
    };
  }
  return { lift: 0, rot: Math.sin(((u - 0.88) / 0.12) * Math.PI) * 4.8, dx: 0, anim: "idle" };
}

  function rufflePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ruffle));
  return {
    lift: 4.8 + Math.sin(u * Math.PI) * 7.2,
    rot: Math.sin(u * Math.PI * 4) * 19.2,
    dx: Math.sin(u * Math.PI * 2) * 4.2,
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
  const pose =
    next.kind === "whistle" ? whistlePose(next.t) : next.kind === "trill" ? trillPose(next.t) : rufflePose(next.t);
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
    kind === "preen" || kind === "bobble" || kind === "beakgrind"
      ? ("sit")
      : kind === "mimic"
        ? ("talk")
        : kind === "sidle"
          ? ("walk")
          : kind === "dangle" || kind === "shellout"
            ? ("play")
            : ("sit");
  return {
    kind,
    phase: kind === "preen" ? ("hold") : ("go"),
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

  function preenPose(t) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return { lift: 3.6 + soft * 4.8 + Math.abs(breath) * 1.8, rot: -3.6 + breath * 9.6 + Math.sin(t * 2.1) * 6 };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 4.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 7.2 * (1 - u) };
}

  function bobblePose(t) {
  const u = Math.max(0, Math.min(1, t / DUR.bobble));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { lift: s * 6, rot: -s * 9.6, dx: 0, anim: "sit" };
  }
  if (u < 0.86) {
    const bob = Math.sin(t * 11) + 0.24 * Math.sin(t * 22);
    return {
      lift: 6 + Math.abs(bob) * 7.2,
      rot: -9.6 + bob * 10.8,
      dx: 0,
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { lift: 3.6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
}

  function mimicPose(t) {
  const u = Math.max(0, Math.min(1, t / DUR.mimic));
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { lift: s * 8.4, rot: s * 12, dx: 0, anim: "talk" };
  }
  if (u < 0.88) {
    const chatter = Math.sin(t * 8) + 0.28 * Math.sin(t * 16);
    return {
      lift: 8.4 + Math.abs(chatter) * 6,
      rot: 12 + chatter * 10.8,
      dx: Math.sin(t * 5) * 3,
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "sit" };
}

  function sidlePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.sidle));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 4.8, rot: s * 12 * face, anim: "sit" };
  }
  if (u < 0.85) {
    const s = (u - 0.10) / 0.75;
    const step = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + face * 21.6 * smoothstep(s),
      lift: 4.8 + Math.abs(step) * 4.8,
      rot: face * (12 + step * 12),
      anim: "walk",
    };
  }
  const s = smoothstep((u - 0.85) / 0.15);
  return {
    x: fromX + face * 21.6,
    lift: 3.6 * (1 - s),
    rot: face * 6 * (1 - s),
    anim: "sit",
  };
}

  function danglePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.dangle));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 14.4, rot: -s * 48, anim: "play" };
  }
  if (u < 0.78) {
    const sway = Math.sin(t * 6) + 0.22 * Math.sin(t * 12);
    return {
      x: fromX + face * sway * 3.6,
      lift: 14.4 + Math.abs(sway) * 3.6,
      rot: -180 + sway * 19.2,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 9.6 * (1 - s),
    rot: -180 * (1 - s),
    anim: "sit",
  };
}

  function beakgrindPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.beakgrind));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6, rot: s * -7.2 * face, anim: "sit" };
  }
  if (u < 0.88) {
    const grind = Math.sin(t * 7.5) + 0.3 * Math.sin(t * 15);
    return {
      x: fromX + face * grind * 1.8,
      lift: 6 + Math.abs(grind) * 3.6,
      rot: (-7.2 + grind * 6) * face,
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3.6 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
}

  function shelloutPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.shellout));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 9.6, rot: s * 16.8 * face, anim: "play" };
  }
  if (u < 0.86) {
    const husk = Math.sin(t * 9.2) + 0.26 * Math.sin(t * 18.4);
    const tip = Math.abs(Math.sin(t * 4.6));
    return {
      x: fromX + face * husk * 3,
      lift: 9.6 + tip * 6,
      rot: (16.8 + husk * 9.6) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 4.8 * (1 - s), rot: 4.8 * (1 - s) * face, anim: "idle" };
}

  function stepTrick(trick, dt, flags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "dangle" && trick.kind !== "sidle") {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "preen") {
    if (next.t < PREEN_HOLD) {
      const pose = preenPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PREEN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PREEN_HOLD);
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
  if (next.kind === "bobble") {
    const pose = bobblePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mimic") {
    const pose = mimicPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sidle") {
    const pose = sidlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dangle") {
    const pose = danglePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "beakgrind") {
    const pose = beakgrindPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = shelloutPose(next.t, fromX, trick.facing);
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
    PREEN_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    preenPose,
    releasePose,
    bobblePose,
    mimicPose,
    sidlePose,
    danglePose,
    beakgrindPose,
    shelloutPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    whistlePose,
    trillPose,
    rufflePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBudgieTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
