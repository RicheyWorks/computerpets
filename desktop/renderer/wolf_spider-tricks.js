/** Prowl ground tricks while idle — ultra-polish pass. House neighborly Lycosidae / Tigrosa wetland wolf (wolf_spider / Prowl) desk life — cursor / eggsac / spiderling / eyeshine / spur / apron / tigrosa personality (cursor cursorial litter-walk without naming prowl or hunt or chase or stalk or patrol or track or run or gallop or dash as bare ethogram-only trick kinds, eggsac spinneret egg-sac carry without naming brood or egg or sac or clutch or bundle or wrap or silk or web or carry, spiderling dorsum ride without naming brood or carry or piggyback or hitch or mount or ride or young or baby, eyeshine tapetum night-glint without naming look or stare or eye or gaze or glow or flash or shine or lamp or watch, spur tibial-spur flash without naming kick or jab or spur or tibia or strike or fence, apron burrow-mouth silk-apron settle without naming burrow or dig or hole or den or tunnel or mouth or silk or web, long tigrosa sit_hold under the scrap lamp (THE tigrosa sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or oil or dab or tip or drum or sip or hover as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Rose owns bacteriorhodopsin/saltsquare/gasvesicle/carotenoid/retinal/archaellum/brinedrift; Rod owns runandtumble/binaryfission/pilus/chemotax/nucleoid/fimbria/flagmotor; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Prowl / key wolf_spider only for isKey matching — accept "wolf_spider" and "prowl"; do NOT name a trick "wolf_spider" or "prowl" or "hunt" or "patrol" or "carry" or "brood" or "leap" or "hop" or "silk" or "web" or "gaze" or "still") — not Leap jumping_spider life, not Loom orb_weaver life, not Rose haloarchaea life, not Rod coli life, not Tarantula / Widow / bird life. Cursor litter-walk without naming prowl, eggsac spinneret carry without naming brood, spiderling dorsum ride without naming carry, eyeshine tapetum glint without naming look, spur tibial flash without naming kick, apron burrow-mouth settle without naming burrow, tigrosa long sit_hold under the scrap lamp (THE tigrosa sit_hold tell); helluo / carolinensis / rabida thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web wolf_spider-tricks.ts. Window-play CARRY unchanged. Ethogram softs + freeze — never names prowl/wolf_spider/still/carry/hunt as bare ethogram-only trick kinds. True wetland wolf desk life only — distinct from Leap, Loom, Rose, Rod, Velvet, and birds. Next house-order ultra: Flag / deer. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via wolf_spider.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {
  const TRICK_KEY = "wolf_spider";
  const TRICKS = ["cursor", "eggsac", "spiderling", "eyeshine", "spur", "apron", "tigrosa"];
  const HAPPY = ["helluo", "carolinensis", "rabida"];

  const HAPPY_DUR = { helluo: 1.70, carolinensis: 1.82, rabida: 1.71 };
  const TIGROSA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    tigrosa: TIGROSA_HOLD + RELEASE_S,
    cursor: 2.36,
    eggsac: 2.50,
    spiderling: 2.56,
    eyeshine: 2.42,
    spur: 2.44,
    apron: 2.39,
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
    if (kind === "tigrosa") return 40 + roll * 26;
    if (kind === "spur" || kind === "apron" || kind === "cursor") return 12.8 + roll * 9.4;
    if (kind === "eggsac" || kind === "spiderling" || kind === "eyeshine") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tigrosa";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tigrosa") {
      if (roll < 0.17) return "cursor";
      if (roll < 0.33) return "eggsac";
      if (roll < 0.49) return "spiderling";
      if (roll < 0.65) return "eyeshine";
      if (roll < 0.83) return "spur";
      return "apron";
    }
    if (lastKind === "cursor") {
      if (roll < 0.16) return "tigrosa";
      if (roll < 0.32) return "eggsac";
      if (roll < 0.48) return "spiderling";
      if (roll < 0.64) return "eyeshine";
      if (roll < 0.82) return "spur";
      return "apron";
    }
    if (lastKind === "eggsac") {
      if (roll < 0.14) return "tigrosa";
      if (roll < 0.3) return "cursor";
      if (roll < 0.46) return "spiderling";
      if (roll < 0.62) return "eyeshine";
      if (roll < 0.8) return "spur";
      return "apron";
    }
    if (lastKind === "spur" || lastKind === "apron") {
      if (roll < 0.14) return "tigrosa";
      if (roll < 0.3) return "cursor";
      if (roll < 0.46) return "eggsac";
      if (roll < 0.62) return "spiderling";
      if (roll < 0.78) return "eyeshine";
      return lastKind === "spur" ? ("apron") : ("spur");
    }
    if (roll < 0.14) return "tigrosa";
    if (roll < 0.28) return "cursor";
    if (roll < 0.42) return "eggsac";
    if (roll < 0.56) return "spiderling";
    if (roll < 0.7) return "eyeshine";
    if (roll < 0.85) return "spur";
    return "apron";
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
    return key === TRICK_KEY || key === "prowl";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "helluo";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "helluo" ? "sit" : name === "carolinensis" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function helluoPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.helluo));
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

  function carolinensisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.carolinensis));
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

  function rabidaPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.52) * 6,
      dx: 0,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "helluo") {
      const pose = helluoPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "carolinensis") {
      const pose = carolinensisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = rabidaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "tigrosa"
        ? "sit"
        : kind === "cursor"
          ? "play"
          : kind === "eggsac"
            ? "sit"
            : kind === "spiderling"
              ? "talk"
              : kind === "eyeshine"
                ? "play"
                : kind === "spur"
                  ? "walk"
                  : kind === "apron"
                    ? "sit"
                    : "sit";
    return {
      kind: TRICKS.indexOf(kind) >= 0 ? (kind) : "cursor",
      phase: kind === "tigrosa" ? "hold" : "go",
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

  function tigrosaPose(t) {
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

  function cursorPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cursor));
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

  function eggsacPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.eggsac));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.9, rot: s * -16 * face, anim: "sit" };
    }
    if (u < 0.48) {
      const s = smoothstep((u - 0.12) / 0.36);
      return {
        x: fromX - face * (2.2 + s * 4.5),
        lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
        rot: face * (-16 + s * 22),
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const settle = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - face * (6.7 * (1 - s)),
        lift: 2.4 + Math.abs(settle) * 1.1,
        rot: face * (6 + settle * 8),
        anim: "sit",
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

  function spiderlingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spiderling));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "talk" };
    }
    if (u < 0.72) {
      const mud = Math.sin(t * 1.6);
      return {
        x: fromX + face * (0.8 + mud * 0.4),
        lift: 2.2 + Math.abs(mud) * 1.0,
        rot: face * (8 + mud * 10),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: s > 0.6 ? ("idle") : ("talk"),
    };
  }

  function eyeshinePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.eyeshine));
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

  function spurPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spur));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "walk" };
    }
    if (u < 0.55) {
      const pulse = Math.sin(t * 3.2);
      return {
        x: fromX,
        lift: 2.8 + pulse * 1.6,
        rot: face * (12 + pulse * 14),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const scent = Math.sin(t * 1.1);
      return {
        x: fromX + face * scent * 0.15,
        lift: 4.0 + Math.abs(scent) * 0.6,
        rot: face * (22 + scent * 4),
        anim: "walk",
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

  function apronPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.apron));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "sit" };
    }
    if (u < 0.55) {
      const flash = Math.abs(Math.sin(t * 2.6));
      return {
        x: fromX + face * flash * 0.2,
        lift: 3.4 + flash * 1.4,
        rot: face * (-12 - flash * 10),
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const warn = Math.sin(t * 1.4);
      return {
        x: fromX,
        lift: 4.4 + Math.abs(warn) * 0.7,
        rot: face * (-18 + warn * 6),
        anim: "sit",
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

  function stepTrick(trick, dt, flags) {
    if (shouldAbort(flags)) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "tigrosa") {
      if (next.t < TIGROSA_HOLD) {
        const pose = tigrosaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = pose.anim;
        return next;
      }
      if (next.t < TIGROSA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TIGROSA_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    if (next.kind === "cursor") {
      const pose = cursorPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "eggsac") {
      const pose = eggsacPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spiderling") {
      const pose = spiderlingPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "eyeshine") {
      const pose = eyeshinePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spur") {
      const pose = spurPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = apronPose(next.t, fromX, trick.facing);
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
    TIGROSA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tigrosaPose,
    releasePose,
    cursorPose,
    eggsacPose,
    spiderlingPose,
    eyeshinePose,
    spurPose,
    apronPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    helluoPose,
    carolinensisPose,
    rabidaPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWolfSpiderTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
