/** Drum ground tricks while idle — ultra-polish pass. House neighborly Picidae / Dryocopus pileated woodpecker desk life — excavate / hitch / crestflare / kuk / tongueprobe / chipcast / dryocopus personality (excavate gallery-chisel bill-strike without naming drum or drumming or tip or dabble or graze or billtap, hitch trunk-hitch climb without naming hop or hopwalk or soar or climb-cry or runstop, crestflare scarlet crest-raise without naming crest or flare or hackles or fan or strut, kuk kuk-call chin-bob without naming cry or call or song or sing or feebee or carol or honk or gruntwhistle, tongueprobe long barbed tongue into carpenter-ant gallery without naming anting or fossick or glean or hangup or cache, chipcast toss wood chips from gallery without naming tumble or billtap or tip or dab, long dryocopus Dryocopus pileatus red-crest desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo or feebee or gargle or hangup or cache or capflash or seedhammer or poecile or runstop or listen or carol or tug or rufous or tailcock or turdus or dabble or upend or headshake or gruntwhistle or speculum or nodswim or anas or graze or hiss or nestguard or honk or triumph or chinstrap or branta or oil or dab or tip or drum; window-play leaves pileated alone; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee own their tricks; guest slug Drum / key pileated — accept "pileated" and "drum"; do NOT name a trick pileated or drum or woodpecker or crest or flare or hop or soar or mantle). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous pileatus / abieticola / floridanus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web pileated-tricks.ts. Window-play unchanged. True pileated woodpecker desk life — not goose/mallard/robin/chickadee/hawk/owl/crow/raven clones. Sip owns the next seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "pileated";
  const TRICKS = ["excavate", "hitch", "crestflare", "kuk", "tongueprobe", "chipcast", "dryocopus"];
  const HAPPY = ["pileatus", "abieticola", "floridanus"];
  const HAPPY_DUR = { pileatus: 1.69, abieticola: 1.84, floridanus: 1.75 };
  const DRYOCOPUS_HOLD = 14.8;
  const RELEASE_S = 1.08;
  const DUR = {
    dryocopus: DRYOCOPUS_HOLD + RELEASE_S,
    excavate: 2.58,
    hitch: 2.44,
    crestflare: 2.38,
    kuk: 2.66,
    tongueprobe: 2.48,
    chipcast: 2.42,
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
    if (kind === "dryocopus") return 44 + roll * 30;
    if (kind === "excavate" || kind === "chipcast") return 13 + roll * 9;
    if (kind === "hitch" || kind === "tongueprobe") return 12 + roll * 9;
    if (kind === "kuk" || kind === "crestflare") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "dryocopus";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "dryocopus" ? 0.55 : k === "excavate" || k === "kuk" ? 1.15 : 1
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "excavate";
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
    return key === TRICK_KEY || key === "drum";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "pileatus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "abieticola" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function pileatusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pileatus));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 6, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 5.5) + 0.26 * Math.sin(t * 11.2);
      return { lift: 6 + Math.abs(flash) * 5, rot: 12 + flash * 8, dx: flash * 2.2, anim: "sit" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "idle" };
  }

  function abieticolaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.abieticola));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 14, rot: s * -12, dx: s * 3, anim: "play" };
    }
    if (u < 0.85) {
      const wriggle = Math.sin(t * 4.2) + 0.25 * Math.sin(t * 7.6);
      return { lift: 12 + Math.abs(wriggle) * 10, rot: -10 + wriggle * 14, dx: wriggle * 4, anim: "play" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" };
  }

  function floridanusPose(t) {
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
      next.kind === "pileatus"
        ? pileatusPose(next.t)
        : next.kind === "abieticola"
          ? abieticolaPose(next.t)
          : floridanusPose(next.t);
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
      kind === "dryocopus" || kind === "crestflare"
        ? "sit"
        : kind === "excavate" || kind === "hitch" || kind === "tongueprobe" || kind === "chipcast"
          ? "play"
          : kind === "kuk"
            ? "talk"
            : "sit";
    return {
      kind: kind,
      phase: kind === "dryocopus" ? "hold" : "go",
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

  function dryocopusPose(t) {
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return { lift: 2 + soft * 4 + Math.abs(breath) * 1.5, rot: -2 + breath * 4 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
  }

  function excavatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.excavate));
    const face = facing == null ? 1 : facing;
    if (u < 0.11) {
      const s = smoothstep(u / 0.11);
      return { x: fromX, lift: s * -8, rot: s * 22 * face, anim: "play" };
    }
    if (u < 0.88) {
      const chisel = Math.sin(t * 18.5) + 0.32 * Math.sin(t * 37.0);
      return {
        x: fromX + face * chisel * 3,
        lift: -8 + Math.abs(chisel) * 5,
        rot: (22 + chisel * 6) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: -3 * (1 - s), rot: 5 * (1 - s) * face, anim: "idle" };
  }

  function hitchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hitch));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 4, lift: s * 10, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.86) {
      const step = Math.sin(t * 4.6) + 0.22 * Math.sin(t * 9.2);
      return {
        x: fromX + face * (4 + step * 3),
        lift: 9 + Math.abs(step) * 6,
        rot: (-12 + step * 7) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * 4 * (1 - s), lift: 3 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" };
  }

  function crestflarePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.crestflare));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 8, rot: s * -10 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const rise = Math.sin(t * 2.4) + 0.2 * Math.sin(t * 4.8);
      return {
        x: fromX + face * rise * 2.5,
        lift: 8 + Math.abs(rise) * 5,
        rot: (-10 + rise * 7) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" };
  }

  function kukPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.kuk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 10, rot: s * 14 * face, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.10) / 0.76;
      const phrase = Math.sin(s * Math.PI * 4.2);
      const settle = Math.abs(Math.sin(s * Math.PI * 8.4));
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

  function tongueprobePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tongueprobe));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -6, rot: s * 16 * face, anim: "play" };
    }
    if (u < 0.86) {
      const flick = Math.sin(t * 7.2) + 0.3 * Math.sin(t * 14.4);
      return {
        x: fromX + face * flick * 2.5,
        lift: -6 + Math.abs(flick) * 5,
        rot: (16 + flick * 8) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: -2 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" };
  }

  function chipcastPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chipcast));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 12, rot: s * -8 * face, anim: "play" };
    }
    if (u < 0.86) {
      const toss = Math.sin(t * 5.0) + 0.28 * Math.sin(t * 10.0);
      return {
        x: fromX + face * toss * 3.5,
        lift: 11 + Math.abs(toss) * 7,
        rot: (-8 + toss * 12) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 4 * (1 - s), rot: -2 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    const short =
      trick.kind === "excavate" ||
      trick.kind === "hitch" ||
      trick.kind === "crestflare" ||
      trick.kind === "kuk" ||
      trick.kind === "tongueprobe" ||
      trick.kind === "chipcast";
    if (shouldAbort(flags) && !short) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "dryocopus") {
      if (next.t < DRYOCOPUS_HOLD) {
        const pose = dryocopusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DRYOCOPUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DRYOCOPUS_HOLD);
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
      excavate: excavatePose,
      hitch: hitchPose,
      crestflare: crestflarePose,
      kuk: kukPose,
      tongueprobe: tongueprobePose,
      chipcast: chipcastPose,
    };
    const fn = poseFn[next.kind] || excavatePose;
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
    DRYOCOPUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    dryocopusPose,
    releasePose,
    excavatePose,
    hitchPose,
    crestflarePose,
    kukPose,
    tongueprobePose,
    chipcastPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    pileatusPose,
    abieticolaPose,
    floridanusPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPileatedTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
