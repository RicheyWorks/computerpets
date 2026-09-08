/** Sip ground tricks while idle — ultra-polish pass. House neighborly Trochilidae / Archilochus ruby-throated hummingbird desk life — nectary / shuttle / gorget / chip / trapline / gnatsnap / archilochus personality (nectary flower-nectar bill-dip without naming sip or hover or probe or dart or drink or siphon or nectar or bloomfeed, shuttle courtship shuttle-dive without naming dive or stoop or soar or hover or pendulum or kettle or bind, gorget iridescent throat-flash without naming flash or flare or crest or hackles or fan or strut or jewel, chip chip-call chin-bob without naming cry or call or song or sing or feebee or carol or honk or kuk or zeet, trapline sequential blotter-bloom circuit without naming sip or hover or nectar or dart or probe, gnatsnap aerial insect-snap without naming dart or hover or soar or stoop or bind or kettle, long archilochus Archilochus colubris ruby-throat desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo or feebee or gargle or hangup or cache or capflash or seedhammer or poecile or runstop or listen or carol or tug or rufous or tailcock or turdus or dabble or upend or headshake or gruntwhistle or speculum or nodswim or anas or graze or hiss or nestguard or honk or triumph or chinstrap or branta or excavate or hitch or crestflare or kuk or tongueprobe or chipcast or dryocopus or oil or dab or tip or drum or sip or hover; window-play SIP and bird-fly Call Sip leave hummingbird alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own their tricks; guest slug Sip / key hummingbird — accept "hummingbird" and "sip"; do NOT name a trick hummingbird or sip or hover or nectar or dive or flash or chipcall or mantle). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous colubris / alexandri / calliope. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web hummingbird-tricks.ts. Window-play SIP and bird-fly unchanged. True ruby-throated hummingbird desk life — not woodpecker/goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Echo owns the next seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "hummingbird";
  const TRICKS = ["nectary", "shuttle", "gorget", "chip", "trapline", "gnatsnap", "archilochus"];
  const HAPPY = ["colubris", "alexandri", "calliope"];
  const HAPPY_DUR = { colubris: 1.64, alexandri: 1.78, calliope: 1.70 };
  const ARCHILOCHUS_HOLD = 14.6;
  const RELEASE_S = 1.06;
  const DUR = {
  archilochus: ARCHILOCHUS_HOLD + RELEASE_S,
  nectary: 2.52,
  shuttle: 2.60,
  gorget: 2.34,
  chip: 2.48,
  trapline: 2.54,
  gnatsnap: 2.40,
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
  if (kind === "archilochus") return 44 + roll * 30;
  if (kind === "nectary" || kind === "trapline") return 13 + roll * 9;
  if (kind === "shuttle" || kind === "gnatsnap") return 12 + roll * 9;
  if (kind === "chip" || kind === "gorget") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

  function pickTrick(rand, musicOn, lastKind) {
  if (musicOn) return "archilochus";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) =>
    k === "archilochus" ? 0.55 : k === "nectary" || k === "chip" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "nectary";
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
  return key === TRICK_KEY || key === "sip";
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
  const name = HAPPY.indexOf(kind) >= 0 ? kind : "colubris";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "colubris" ? "sit" : name === "alexandri" ? "play" : "sit"),
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

  function colubrisPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.colubris));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 6, rot: s * 12, dx: 0, anim: "sit" };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 5.5) + 0.26 * Math.sin(t * 11.2);
    return { lift: 6 + Math.abs(flash) * 5, rot: 12 + flash * 8, dx: flash * 2.2, anim: "sit" };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "idle" };
}

  function alexandriPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.alexandri));
  if (u < 0.11) {
    const s = u / 0.11;
    return { lift: s * 14, rot: s * -12, dx: s * 3, anim: "play" };
  }
  if (u < 0.85) {
    const wriggle = Math.sin(t * 4.2) + 0.25 * Math.sin(t * 7.6);
    return { lift: 12 + Math.abs(wriggle) * 10, rot: -10 + wriggle * 14, dx: wriggle * 4, anim: "play" };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" };
}

  function calliopePose(t) {
  return {
    lift: 3 + Math.abs(Math.sin(t * 4.0)) * 7,
    rot: Math.sin(t * 3.4) * 9,
    dx: Math.sin(t * 2.6) * 3,
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
    next.kind === "colubris" ? colubrisPose(next.t) : next.kind === "alexandri" ? alexandriPose(next.t) : calliopePose(next.t);
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
    kind === "archilochus" || kind === "gorget"
      ? "sit"
      : kind === "nectary" || kind === "shuttle" || kind === "trapline" || kind === "gnatsnap"
        ? "play"
        : kind === "chip"
          ? "talk"
          : "sit";
  return {
    kind,
    phase: kind === "archilochus" ? "hold" : "go",
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

  function archilochusPose(t) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return { lift: 2 + soft * 4 + Math.abs(breath) * 1.5, rot: -2 + breath * 4 };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
}

  function nectaryPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.nectary));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 10, rot: s * 18 * face, anim: "play" };
  }
  if (u < 0.88) {
    const sip = Math.sin(t * 22.0) + 0.28 * Math.sin(t * 44.0);
    return {
      x: fromX + face * sip * 3,
      lift: 9 + Math.abs(sip) * 5,
      rot: (18 + sip * 6) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" };
}

  function shuttlePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.shuttle));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 4, lift: s * 14, rot: s * -12 * face, anim: "play" };
  }
  if (u < 0.86) {
    const arc = Math.sin(((u - 0.14) / 0.72) * Math.PI);
    const wobble = Math.sin(t * 6.2) + 0.2 * Math.sin(t * 12.4);
    return {
      x: fromX + face * (4 + arc * 6 + wobble * 2.5),
      lift: 12 + arc * 8 + Math.abs(wobble) * 4,
      rot: (-12 + arc * 20 + wobble * 5) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 4 * (1 - s), lift: 4 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" };
}

  function gorgetPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.gorget));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 8, rot: s * -10 * face, anim: "sit" };
  }
  if (u < 0.88) {
    const gleam = Math.sin(t * 3.1) + 0.22 * Math.sin(t * 6.2);
    return {
      x: fromX + face * gleam * 2.5,
      lift: 8 + Math.abs(gleam) * 5,
      rot: (-10 + gleam * 7) * face,
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" };
}

  function chipPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.chip));
  const face = facing == null ? 1 : facing;
  if (u < 0.09) {
    const s = smoothstep(u / 0.09);
    return { x: fromX, lift: s * 10, rot: s * 14 * face, anim: "talk" };
  }
  if (u < 0.86) {
    const s = (u - 0.09) / 0.77;
    const phrase = Math.sin(s * Math.PI * 5.4);
    const settle = Math.abs(Math.sin(s * Math.PI * 10.8));
    return {
      x: fromX + face * (3 * s + phrase * 3),
      lift: 9 + settle * 5,
      rot: (14 + phrase * 8) * face,
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 3 * (1 - s), lift: 4 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" };
}

  function traplinePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.trapline));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 5, lift: s * 11, rot: s * -8 * face, anim: "play" };
  }
  if (u < 0.86) {
    const circuit = Math.sin(t * 4.8) + 0.28 * Math.sin(t * 9.6);
    const station = Math.abs(Math.sin(t * 2.4));
    return {
      x: fromX + face * (5 + circuit * 4 + station * 2),
      lift: 10 + Math.abs(circuit) * 6 + station * 3,
      rot: (-8 + circuit * 10) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 5 * (1 - s), lift: 3 * (1 - s), rot: -2 * (1 - s) * face, anim: "idle" };
}

  function gnatsnapPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.gnatsnap));
  const face = facing == null ? 1 : facing;
  if (u < 0.11) {
    const s = smoothstep(u / 0.11);
    return { x: fromX, lift: s * 13, rot: s * 10 * face, anim: "play" };
  }
  if (u < 0.86) {
    const snap = Math.sin(t * 9.5) + 0.3 * Math.sin(t * 19.0);
    return {
      x: fromX + face * snap * 3.5,
      lift: 12 + Math.abs(snap) * 7,
      rot: (10 + snap * 9) * face,
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 4 * (1 - s), rot: 3 * (1 - s) * face, anim: "idle" };
}

  function stepTrick(trick, dt, flags) {
  if (!trick || trick.phase === "done") return trick;
  const short =
    trick.kind === "nectary" ||
    trick.kind === "shuttle" ||
    trick.kind === "gorget" ||
    trick.kind === "chip" ||
    trick.kind === "trapline" ||
    trick.kind === "gnatsnap";
  if (shouldAbort(flags) && !short) {
    return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
  }
  const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
  if (next.kind === "archilochus") {
    if (next.t < ARCHILOCHUS_HOLD) {
      const pose = archilochusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ARCHILOCHUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ARCHILOCHUS_HOLD);
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
  const from = trick.fromX != null ? trick.fromX : trick.x;
  const poseFn = {
    nectary: nectaryPose,
    shuttle: shuttlePose,
    gorget: gorgetPose,
    chip: chipPose,
    trapline: traplinePose,
    gnatsnap: gnatsnapPose,
  };
  const fn = poseFn[next.kind] || nectaryPose;
  const pose = fn(next.t, from, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
  return next;
}

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    ARCHILOCHUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    archilochusPose,
    releasePose,
    nectaryPose,
    shuttlePose,
    gorgetPose,
    chipPose,
    traplinePose,
    gnatsnapPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    colubrisPose,
    alexandriPose,
    calliopePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHummingbirdTricks = api;
})(typeof window !== "undefined" ? window : globalThis);