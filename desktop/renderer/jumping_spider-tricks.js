/** Leap ground tricks while idle — ultra-polish pass. House neighborly Salticidae / Phidippus bold jumper (jumping_spider / Leap) desk life — orient / saccade / palp / safetyline / ame / scopula / phidippus personality (orient prey-target body-turn without naming stalk or hunt or aim or turn or face or lock or track as bare ethogram-only trick kinds, saccade AME gaze-flick without naming look or stare or eye or gaze or track or scan or watch or nod, palp pedipalp courtship raise without naming wave or dance or court or display or semaphore or strut or fan, safetyline Salticid safety-line settle without naming silk or web or abseil or belay or tether or jump or leap or pounce or hop or dragline, ame principal-eye AME lock without naming gaze or stare or look or eye or monocle, scopula adhesive foot-pad cling without naming grip or cling or pad or foot or walk, long phidippus sit_hold under the scrap lamp (THE phidippus sit_hold tell) — never named wait or wake or still or hide or cover or glue or flare or dart or nest or zig or swim or gulp or drift or glint or hinge or sucker or latch or crawl or dig or burrow or blush or pink or leap or hop or pounce or look or stalk or silk or web or wave or gaze or dragline or radiate or stabilimentum or swathe or strum or araneus or viscid as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play POUNCE unchanged if already fine; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Rose owns bacteriorhodopsin/saltsquare/gasvesicle/carotenoid/retinal/archaellum/brinedrift; Rod owns runandtumble/binaryfission/pilus/chemotax/nucleoid/fimbria/flagmotor; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Leap / key jumping_spider only for isKey matching — accept "jumping_spider" and "leap"; do NOT name a trick "jumping_spider" or "leap" or "hop" or "pounce" or "stalk" or "look" or "silk" or "web" or "wave" or "gaze" or "dragline" or "still") — not Loom orb_weaver life, not Rose haloarchaea life, not Rod coli life, not Wolf Spider / Tarantula / Widow / bird life. Orient body-turn without naming stalk, saccade AME flick without naming look, palp pedipalp raise without naming wave, safetyline settle without naming silk, ame principal-eye lock without naming gaze, scopula foot-pad cling without naming grip, phidippus long sit_hold under the scrap lamp (THE phidippus sit_hold tell); audax / johnsoni / regius thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web jumping_spider-tricks.ts. Window-play POUNCE unchanged. Ethogram softs + freeze — never names leap/jumping_spider/still/look/hop as bare ethogram-only trick kinds. True bold jumper desk life only — distinct from Loom, Rose, Rod, Prowl, and birds. Next house-order ultra: Flag / deer. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via jumping_spider.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "jumping_spider";
  const TRICKS = ["orient", "saccade", "palp", "safetyline", "ame", "scopula", "phidippus"];
  const HAPPY = ["audax", "johnsoni", "regius"];

  const HAPPY_DUR = { audax: 1.70, johnsoni: 1.82, regius: 1.71 };
  const PHIDIPPUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    phidippus: PHIDIPPUS_HOLD + RELEASE_S,
    orient: 2.36,
    saccade: 2.50,
    palp: 2.56,
    safetyline: 2.42,
    ame: 2.44,
    scopula: 2.39,
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

  function nextTrickWait(justFinished,rand,kind) {
    const roll = rand == null ? Math.random() : rand;
    if (kind === "phidippus") return 40 + roll * 26;
    if (kind === "ame" || kind === "scopula" || kind === "orient") return 12.8 + roll * 9.4;
    if (kind === "saccade" || kind === "palp" || kind === "safetyline") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand,musicOn,lastKind) {
    if (musicOn) return "phidippus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "phidippus") {
      if (roll < 0.17) return "orient";
      if (roll < 0.33) return "saccade";
      if (roll < 0.49) return "palp";
      if (roll < 0.65) return "safetyline";
      if (roll < 0.83) return "ame";
      return "scopula";
    }
    if (lastKind === "orient") {
      if (roll < 0.16) return "phidippus";
      if (roll < 0.32) return "saccade";
      if (roll < 0.48) return "palp";
      if (roll < 0.64) return "safetyline";
      if (roll < 0.82) return "ame";
      return "scopula";
    }
    if (lastKind === "saccade") {
      if (roll < 0.14) return "phidippus";
      if (roll < 0.3) return "orient";
      if (roll < 0.46) return "palp";
      if (roll < 0.62) return "safetyline";
      if (roll < 0.8) return "ame";
      return "scopula";
    }
    if (lastKind === "ame" || lastKind === "scopula") {
      if (roll < 0.14) return "phidippus";
      if (roll < 0.3) return "orient";
      if (roll < 0.46) return "saccade";
      if (roll < 0.62) return "palp";
      if (roll < 0.78) return "safetyline";
      return lastKind === "ame" ? ("scopula") : ("ame");
    }
    if (roll < 0.14) return "phidippus";
    if (roll < 0.28) return "orient";
    if (roll < 0.42) return "saccade";
    if (roll < 0.56) return "palp";
    if (roll < 0.7) return "safetyline";
    if (roll < 0.85) return "ame";
    return "scopula";
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
    return key === TRICK_KEY || key === "leap";
  }

  function startThankYou(key,lastKind,x,
    facing,flags,
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind,rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind,x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "audax";
    return {
      kind: name, happy: true,
      phase: "go",
      t: 0,x,
      lift: 0,
      rot: 0,
      anim: name === "audax" ? "sit" : name === "johnsoni" ? "play" : "sit",
      facing: facing == null ? 1 : facing, fromX: x,
    };
  }

  function audaxPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.audax));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 1.72);
      return {
        lift: 2.8 + Math.abs(flash) * 1.4,
        rot: 12 + flash * 8,
        dx: 0,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function johnsoniPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.johnsoni));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 2.1);
      return {
        lift: 3.4 + Math.abs(wriggle) * 1.6,
        rot: -14 + wriggle * 10,
        dx: 0.08,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function regiusPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.52) * 6,
      dx: 0,
      anim: "sit",
    };
  }

  function stepHappy(happy,dt,flags) {
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "audax") {
      const pose = audaxPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "johnsoni") {
      const pose = johnsoniPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = regiusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key,_frameCount) {
    return null;
  }

  function beginTrick(kind,x, facing) {
    const anim =
      kind === "phidippus"
        ? "sit"
        : kind === "orient"
          ? "play"
          : kind === "saccade"
            ? "talk"
            : kind === "palp"
              ? "sit"
              : kind === "safetyline"
                ? "play"
                : kind === "ame"
                  ? "sit"
                  : kind === "scopula"
                    ? "walk"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? (kind) : "orient",
      phase: kind === "phidippus" ? "hold" : "go",
      t: 0,x,
      lift: 0,
      rot: 0,anim,
      facing: facing == null ? 1 : facing, fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  function phidippusPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.14) * 4,
      anim: "sit",
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function orientPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.orient));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.5, rot: s * 14 * face, anim: "play" };
    }
    if (u < 0.78) {
      const snap = Math.sin(t * 2.4);
      return {
        x: fromX + face * snap * 0.14,
        lift: 3.5 + Math.abs(snap) * 1.5,
        rot: face * (15 + snap * 11),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function saccadePose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.saccade));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.9, rot: s * -16 * face, anim: "talk" };
    }
    if (u < 0.48) {
      const s = smoothstep((u - 0.12) / 0.36);
      return {
        x: fromX - face * (2.2 + s * 4.5),
        lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
        rot: face * (-16 + s * 22),
        anim: "talk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const settle = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - face * (6.7 * (1 - s)),
        lift: 2.4 + Math.abs(settle) * 1.1,
        rot: face * (6 + settle * 8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function palpPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.palp));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "sit" };
    }
    if (u < 0.72) {
      const mud = Math.sin(t * 1.6);
      return {
        x: fromX + face * (0.8 + mud * 0.4),
        lift: 2.2 + Math.abs(mud) * 1.0,
        rot: face * (8 + mud * 10),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: s > 0.6 ? ("idle") : ("sit"),
    };
  }

  function safetylinePose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.safetyline));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.4, rot: s * 10 * face, anim: "play" };
    }
    if (u < 0.84) {
      const tap = Math.sin(t * 2.8);
      return {
        x: fromX + face * tap * 0.2,
        lift: 2.4 + Math.abs(tap) * 1.1,
        rot: face * (10 + tap * 12),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function amePose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ame));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "sit" };
    }
    if (u < 0.55) {
      const pulse = Math.sin(t * 3.2);
      return {
        x: fromX,
        lift: 2.8 + pulse * 1.6,
        rot: face * (12 + pulse * 14),
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const scent = Math.sin(t * 1.1);
      return {
        x: fromX + face * scent * 0.15,
        lift: 4.0 + Math.abs(scent) * 0.6,
        rot: face * (22 + scent * 4),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.0 * (1 - s),
      rot: face * (8 * (1 - s)),
      anim: "idle",
    };
  }

  function scopulaPose(t,fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scopula));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "walk" };
    }
    if (u < 0.55) {
      const flash = Math.abs(Math.sin(t * 2.6));
      return {
        x: fromX + face * flash * 0.2,
        lift: 3.4 + flash * 1.4,
        rot: face * (-12 - flash * 10),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const warn = Math.sin(t * 1.4);
      return {
        x: fromX,
        lift: 4.4 + Math.abs(warn) * 0.7,
        rot: face * (-18 + warn * 6),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.8 * (1 - s),
      rot: face * (-5 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick,dt,flags) {
    if (shouldAbort(flags)) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "phidippus") {
      if (next.t < PHIDIPPUS_HOLD) {
        const pose = phidippusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < PHIDIPPUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PHIDIPPUS_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    if (next.kind === "orient") {
      const pose = orientPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "saccade") {
      const pose = saccadePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "palp") {
      const pose = palpPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "safetyline") {
      const pose = safetylinePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ame") {
      const pose = amePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = scopulaPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    PHIDIPPUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    phidippusPose,
    releasePose,
    orientPose,
    saccadePose,
    palpPose,
    safetylinePose,
    amePose,
    scopulaPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    audaxPose,
    johnsoniPose,
    regiusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetJumpingSpiderTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
