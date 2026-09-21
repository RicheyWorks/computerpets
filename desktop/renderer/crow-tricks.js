/** Soot ground tricks while idle — ultra-polish pass. House neighborly Corvidae American crow desk life — hopwalk / monocle / fossick / anting / scrutinize / glean / corvid personality (hopwalk bipedal ground hop without naming hop or caw or cache or walk or strut or fan, monocle monocular head-cock gaze without naming gaze or cock or look or peer or caw, fossick bill-probe forage without naming probe or cache or dig or peck or bill or caw, anting formic acid feather-rub without naming preen or ant or rub or fan or silk or stream, scrutinize hard monocular stare without naming gaze or cock or look or peer, glean blotter forage-amble without naming walk or hop or cache or probe, long corvid Corvus desk perch on the ledge — never named wait or wake or still or hide or cover or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play CAW owns caw; window-play CACHE owns cache; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; guest slug Soot / key crow only for isKey matching — accept "crow" and "soot"; do NOT name a trick "crow" or "soot" or "caw" or "cache" or "hop" or "preen" or "probe" or "fan" or "strut" or "roost") — not Quill macaw life, not Echo budgie life, not Wedge raven life. Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Feed-happy thank-yous sit after eat. Card-open freeze and window-play CAW do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop crow-tricks.js. Window-play CAW unchanged — never names caw. True Corvidae American crow desk life only. Wedge now Rue-dense; Heart owns the next leftover. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via crow.wav. Amplitudes raised toward Rui richness; denser waits/weights (CORVID_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names crow/soot/caw/cache as bare ethogram-only trick kinds. Window-play CAW unchanged. Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; Drum now Rue-dense; next leftover Sip / hummingbird. Catalog 221. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "crow";
  const TRICKS = ["hopwalk", "monocle", "fossick", "anting", "scrutinize", "glean", "corvid"];
  const HAPPY = ["brachyrhynchos", "ossifragus", "corone"];
  const HAPPY_DUR = { brachyrhynchos: 1.48, ossifragus: 1.62, corone: 1.54 };
  const CORVID_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    corvid: CORVID_HOLD + RELEASE_S,
    hopwalk: 2.18,
    monocle: 2.28,
    fossick: 2.12,
    anting: 2.36,
    scrutinize: 2.42,
    glean: 2.24,
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
    if (kind === "corvid") return 40 + roll * 26;
    if (kind === "hopwalk" || kind === "monocle" || kind === "fossick" || kind === "anting" || kind === "scrutinize" || kind === "glean") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "corvid";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    // weight corvid lower so short acts dominate (Rui-dense feel)
    const weights = list.map((k) => (k === "corvid" ? 0.72 : k === "scrutinize" || k === "anting" ? 1.28 : k === "hopwalk" || k === "monocle" || k === "fossick" ? 1.18 : 1.08));
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "hopwalk";
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
    return key === TRICK_KEY || key === "soot";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "brachyrhynchos";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "ossifragus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function brachyrhynchosPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.brachyrhynchos));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 7.2, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const flash = Math.sin(t * 7.2) + 0.28 * Math.sin(t * 14.4);
      return {
        lift: 7.2 + Math.abs(flash) * 6,
        rot: 12 + flash * 10.8,
        dx: flash * 2.64,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 4.8 * (1 - s), rot: 4.8 * (1 - s), dx: 0, anim: "idle" };
  }

  function ossifragusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ossifragus));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 16.8, rot: s * -14.4, dx: s * 3.6, anim: "play" };
    }
    if (u < 0.86) {
      const wriggle = Math.sin(t * 5.4) + 0.24 * Math.sin(t * 10.2);
      return {
        lift: 14.4 + Math.abs(wriggle) * 12,
        rot: -12 + wriggle * 16.8,
        dx: wriggle * 4.8,
        anim: "play",
      };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 6 * (1 - s), rot: -4.8 * (1 - s), dx: 0, anim: "sit" };
  }

  function coronePose(t) {
    return {
      lift: 3.6 + Math.abs(Math.sin(t * 4.2)) * 8.4,
      rot: Math.sin(t * 3.6) * 9.6,
      dx: Math.sin(t * 2.8) * 3.6,
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
    if (next.kind === "brachyrhynchos") {
      const pose = brachyrhynchosPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ossifragus") {
      const pose = ossifragusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = coronePose(next.t);
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
    const anim =
      kind === "corvid"
        ? "sit"
        : kind === "hopwalk" || kind === "glean"
          ? "walk"
          : kind === "monocle" || kind === "fossick" || kind === "scrutinize"
            ? "sit"
            : kind === "anting"
              ? "play"
              : "sit";
    return {
      kind: kind,
      phase: kind === "corvid" ? "hold" : "go",
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

  function corvidPose(t) {
    const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
    const soft = Math.abs(Math.sin(t * 0.9));
    return {
      lift: 2.4 + soft * 4.8 + Math.abs(breath) * 1.8,
      rot: -2.4 + breath * 4.8,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 3.6 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3.6 * (1 - u) };
  }

  function hopwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hopwalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 12, rot: s * -7.2 * face, anim: "walk" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const bounce = Math.abs(Math.sin(s * Math.PI * 4.2));
      const drift = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX + face * (28 * s + drift * 7.2),
        lift: 7.2 + bounce * 21.6,
        rot: (-7.2 + drift * 12) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + face * 28 * (1 - s),
      lift: 7.2 * (1 - s),
      rot: -3.6 * (1 - s) * face,
      anim: "idle",
    };
  }

  function monoclePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.monocle));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 6, rot: s * 19.2 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const pulse = Math.sin(t * 3.6) + 0.22 * Math.sin(t * 8.1);
      return {
        x: fromX + face * pulse * 2.88,
        lift: 6 + Math.abs(pulse) * 4.2,
        rot: (19.2 + pulse * 6) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 3.6 * (1 - s),
      rot: 6 * (1 - s) * face,
      anim: "idle",
    };
  }

  function fossickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fossick));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 3.6, rot: s * -16.8 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const peck = Math.sin(t * 8.4) + 0.26 * Math.sin(t * 16.8);
      const bite = peck > 0.35 ? 1 : peck < -0.35 ? -0.6 : peck * 0.45;
      return {
        x: fromX + face * bite * 3.84,
        lift: 2.4 + Math.abs(peck) * 8.4,
        rot: (-16.8 + bite * 10.8) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX, lift: 2.4 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" };
  }

  function antingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.anting));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 12, rot: s * -14.4 * face, anim: "play" };
    }
    if (u < 0.88) {
      const rub = Math.sin(t * 6.2) + 0.24 * Math.sin(t * 12.4);
      return {
        x: fromX + face * rub * 6,
        lift: 9.6 + Math.abs(rub) * 9.6,
        rot: (-14.4 + rub * 16.8) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 4.8 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" };
  }

  function scrutinizePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scrutinize));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 4.8, rot: s * 21.6 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const tick = Math.sin(t * 2.4) + 0.35 * Math.sin(t * 9.6);
      const flick = Math.sin(t * 14) * 0.4;
      return {
        x: fromX + face * (tick * 2.16 + flick * 0.96),
        lift: 4.8 + Math.abs(tick) * 3,
        rot: (21.6 + tick * 4.8 + flick * 3.6) * face,
        anim: "sit",
      };
    }
    if (u < 0.9) {
      // switch eye — reverse the cock
      const s = (u - 0.78) / 0.12;
      return {
        x: fromX,
        lift: 4.8,
        rot: (21.6 - s * 43.2) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return { x: fromX, lift: 3.6 * (1 - s), rot: -4.8 * (1 - s) * face, anim: "idle" };
  }

  function gleanPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.glean));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 9.6, rot: s * -6 * face, anim: "walk" };
    }
    if (u < 0.55) {
      const s = (u - 0.1) / 0.45;
      const bounce = Math.abs(Math.sin(s * Math.PI * 3));
      return {
        x: fromX + face * 22 * s,
        lift: 6 + bounce * 16.8,
        rot: (-6 + Math.sin(s * Math.PI * 3) * 9.6) * face,
        anim: "walk",
      };
    }
    if (u < 0.88) {
      // stop and glean
      const s = (u - 0.55) / 0.33;
      const peck = Math.sin(s * Math.PI * 5);
      return {
        x: fromX + face * 22,
        lift: 3.6 + Math.abs(peck) * 7.2,
        rot: (-12 + peck * 9.6) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + face * 22 * (1 - s * 0.35),
      lift: 3.6 * (1 - s),
      rot: -3.6 * (1 - s) * face,
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "hopwalk" &&
      trick.kind !== "monocle" &&
      trick.kind !== "fossick" &&
      trick.kind !== "anting" &&
      trick.kind !== "scrutinize" &&
      trick.kind !== "glean"
    ) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "corvid") {
      if (next.t < CORVID_HOLD) {
        const pose = corvidPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CORVID_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CORVID_HOLD);
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
    if (next.kind === "hopwalk") {
      const pose = hopwalkPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "monocle") {
      const pose = monoclePose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fossick") {
      const pose = fossickPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "anting") {
      const pose = antingPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "scrutinize") {
      const pose = scrutinizePose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gleanPose(next.t, from, trick.facing);
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
    CORVID_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    corvidPose,
    releasePose,
    hopwalkPose,
    monoclePose,
    fossickPose,
    antingPose,
    scrutinizePose,
    gleanPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    brachyrhynchosPose,
    ossifragusPose,
    coronePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCrowTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
