/** Dee ground tricks while idle — ultra-polish pass. House neighborly Paridae / Poecile black-capped chickadee desk life — feebee / gargle / hangup / cache / capflash / seedhammer / poecile personality (feebee fee-bee song stance without naming sing or song or cry or call or talk-cry, gargle gargle-threat bob without naming hiss or cronk or snore or keeyer, hangup hang-upside forage without naming tumble or dihedral or softcrouch or plunge, cache seed-cache stash without naming fossick or mantle or bury-cry, capflash black-cap feather flash without naming strut or fan or crest-cry or flash-of-hawk, seedhammer seed-pound on perch without naming peck or dig or probe or billtap or fossick, long poecile Poecile atricapillus black-cap desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo; window-play leaves chickadee fly alone; Soot/Wedge/Heart/Hook own their tricks; guest slug Dee / key chickadee — accept "chickadee" and "dee"; do NOT name a trick chickadee or dee or fee-bee or hang or soar or mantle or cap or hammer). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous atricapillus / practicus / turneri. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as desktop chickadee-tricks.js. Window-play unchanged. True black-capped chickadee desk life — not hawk/owl/crow/raven clones. Brick owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via chickadee.wav. Amplitudes raised toward Rui richness; denser waits/weights (POECILE_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names chickadee/dee/fee-bee/hang as bare ethogram-only trick kinds. Window-play unchanged. Next leftover Brick / robin. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "chickadee";
  const TRICKS = ["feebee", "gargle", "hangup", "cache", "capflash", "seedhammer", "poecile"];
  const HAPPY = ["atricapillus", "practicus", "turneri"];
  const HAPPY_DUR = { atricapillus: 1.58, practicus: 1.72, turneri: 1.65 };
  const POECILE_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    poecile: POECILE_HOLD + RELEASE_S,
    feebee: 2.48,
    gargle: 2.36,
    hangup: 2.52,
    cache: 2.42,
    capflash: 2.34,
    seedhammer: 2.46,
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
    if (kind === "poecile") return 40 + roll * 26;
    if (kind === "feebee" || kind === "gargle" || kind === "hangup" || kind === "cache" || kind === "capflash" || kind === "seedhammer") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "poecile";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) => (k === "poecile" ? 0.72 : k === "feebee" || k === "hangup" ? 1.28 : k === "gargle" || k === "seedhammer" ? 1.18 : 1.08));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "feebee";
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
    return key === TRICK_KEY || key === "dee";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "atricapillus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "practicus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function atricapillusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.atricapillus));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 7.2, rot: s * 14.4, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
      return { lift: 7.2 + Math.abs(flash) * 6, rot: 14.4 + flash * 9.6, dx: flash * 2.64, anim: "sit" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function practicusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.practicus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
      return { lift: 14.4 + Math.abs(wriggle) * 12, rot: -12 + wriggle * 16.8, dx: wriggle * 4.8, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
  }

  function turneriPose(t) {
    return {
      lift: 3.6 + Math.abs(Math.sin(t * 4.0)) * 8.4,
      rot: Math.sin(t * 3.4) * 10.8,
      dx: Math.sin(t * 2.6) * 3.6,
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
      next.kind === "atricapillus"
        ? atricapillusPose(next.t)
        : next.kind === "practicus"
          ? practicusPose(next.t)
          : turneriPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "poecile" || kind === "cache" || kind === "capflash"
        ? "sit"
        : kind === "gargle" || kind === "hangup" || kind === "seedhammer"
          ? "play"
          : kind === "feebee"
            ? "talk"
            : "sit";
    return {
      kind: kind,
      phase: kind === "poecile" ? "hold" : "go",
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

  function poecilePose(t) {
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return { lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8, rot: -2.4 + breath * 4.8 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
  }

  function feebeePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.feebee));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * 7.2, rot: s * 16.8 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.11) / 0.75;
      const scan = Math.sin(s * Math.PI * 1.35);
      const settle = Math.abs(Math.sin(s * Math.PI * 2.1));
      return {
        x: fromX + face * (4 * s + scan * 2.88),
        lift: 6 + settle * 4.8,
        rot: (16.8 + scan * 7.2) * face,
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + face * 4 * (1 - s),
      lift: 3.6 * (1 - s),
      rot: 4.8 * (1 - s) * face,
      anim: "idle",
    };
  }

  function garglePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gargle));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * -9.6, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.80) {
      const hush = Math.sin(t * 2.2) + 0.18 * Math.sin(t * 5.1);
      return {
        x: fromX + face * hush * 2.64,
        lift: -9.6 + Math.abs(hush) * 3.6,
        rot: (-12 + hush * 6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.80) / 0.20);
    return {
      x: fromX,
      lift: -4.8 * (1 - s),
      rot: -3 * (1 - s) * face,
      anim: "idle",
    };
  }

  function hangupPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hangup));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 12, rot: s * 168 * face, anim: "play" };
    }
    if (u < 0.86) {
      const swing = Math.sin(t * 3.5) + 0.30 * Math.sin(t * 7.0);
      return {
        x: fromX + face * swing * 9.6,
        lift: 9.6 + Math.abs(swing) * 7.2,
        rot: (168 + swing * 12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 6 * (1 - s), rot: 14.4 * (1 - s) * face, anim: "idle" };
  }

  function cachePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cache));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 7.2, rot: s * -14.4 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const pulse = Math.sin(t * 2.8) + 0.24 * Math.sin(t * 5.6);
      return {
        x: fromX + face * pulse * 3,
        lift: 6 + Math.abs(pulse) * 6,
        rot: (-14.4 + pulse * 8.4) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function capflashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.capflash));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 8.4, rot: s * -16.8 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const flash = Math.sin(t * 5.1) + 0.3 * Math.sin(t * 10.2);
      return {
        x: fromX + face * flash * 3.6,
        lift: 7.2 + Math.abs(flash) * 7.2,
        rot: (-16.8 + flash * 12) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function seedhammerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.seedhammer));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 14.4, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.88) {
      const pound = Math.sin(t * 6.2) + 0.22 * Math.sin(t * 12.4);
      const dip = Math.abs(Math.sin(t * 3.1));
      return {
        x: fromX + face * pound * 3,
        lift: 4.8 + dip * 14.4 + Math.abs(pound) * 3.6,
        rot: (-12 + pound * 9.6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 4.8 * (1 - s), rot: -3.6 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    const short =
      trick.kind === "feebee" ||
      trick.kind === "gargle" ||
      trick.kind === "hangup" ||
      trick.kind === "cache" ||
      trick.kind === "capflash" ||
      trick.kind === "seedhammer";
    if (shouldAbort(flags) && !short) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "poecile") {
      if (next.t < POECILE_HOLD) {
        const pose = poecilePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < POECILE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - POECILE_HOLD);
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
      feebee: feebeePose,
      gargle: garglePose,
      hangup: hangupPose,
      cache: cachePose,
      capflash: capflashPose,
      seedhammer: seedhammerPose,
    }[next.kind];
    const pose = poseFn(next.t, from, trick.facing);
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
    POECILE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    poecilePose,
    releasePose,
    feebeePose,
    garglePose,
    hangupPose,
    cachePose,
    capflashPose,
    seedhammerPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    atricapillusPose,
    practicusPose,
    turneriPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetChickadeeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
