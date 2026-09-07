/** Soot ground tricks while idle. House neighborly Corvidae American crow desk life — hopwalk / monocle / fossick / anting / corvid personality (hopwalk bipedal ground hop without naming hop or caw or cache or walk or strut or fan, monocle monocular head-cock gaze without naming gaze or cock or look or peer or caw, fossick bill-probe forage without naming probe or cache or dig or peck or bill or caw, anting formic acid feather-rub without naming preen or ant or rub or fan or silk or stream, long corvid Corvus desk perch on the ledge — never named wait or wake or still or hide or cover or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play CAW owns caw; window-play CACHE owns cache; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean; Ghost owns luna moth life; Spark owns firefly life; guest slug Soot / key crow only for isKey matching — accept "crow" and "soot"; do NOT name a trick "crow" or "soot" or "caw" or "cache" or "hop" or "preen" or "probe" or "fan" or "strut" or "roost") — not Quill macaw life, not Echo budgie life, not Wedge raven life, not Prickle stickleback life, not Latch leech life, not Ghost luna, not Spark firefly. hopwalk desk hop-gait on the blotter without naming hop, monocle head-cock without naming look, fossick bill-probe without naming cache, anting feather-rub without naming preen, corvid long Corvus metabolic perch on the scrap ledge with brachyrhynchos / ossifragus / corone cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play CAW do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop crow-tricks.js. Window-play CAW unchanged — never names caw. Window-play CACHE unchanged — never names cache. True Corvidae American crow desk life only — distinct from Quill macaw, Echo budgie, Wedge raven, Prickle stickleback, Latch leech, Ghost luna, and Spark firefly. Wedge owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "crow";
  const TRICKS = ["hopwalk", "monocle", "fossick", "anting", "corvid"];
  const HAPPY = ["brachyrhynchos", "ossifragus", "corone"];
  const HAPPY_DUR = { brachyrhynchos: 1.61, ossifragus: 1.74, corone: 1.68 };
  const CORVID_HOLD = 18.42;
  const RELEASE_S = 1.12;
  const DUR = { corvid: CORVID_HOLD + RELEASE_S, hopwalk: 2.34, monocle: 2.48, fossick: 2.22, anting: 2.56 };

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
      if (kind === "corvid") return 76 + roll * 46;
  if (kind === "hopwalk") return 16.4 + roll * 12.8;
  if (kind === "monocle") return 18.6 + roll * 13.2;
  if (kind === "anting") return 21.8 + roll * 14.6;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "corvid";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "corvid") {
      if (roll < 0.26) return "hopwalk";
      if (roll < 0.5) return "monocle";
      if (roll < 0.74) return "fossick";
      return "anting";
    }
    if (lastKind === "hopwalk") {
      if (roll < 0.26) return "corvid";
      if (roll < 0.5) return "monocle";
      if (roll < 0.74) return "fossick";
      return "anting";
    }
    if (lastKind === "monocle") {
      if (roll < 0.22) return "corvid";
      if (roll < 0.44) return "hopwalk";
      if (roll < 0.68) return "fossick";
      return "anting";
    }
    if (roll < 0.2) return "corvid";
    if (roll < 0.4) return "hopwalk";
    if (roll < 0.6) return "monocle";
    if (roll < 0.8) return "fossick";
    return "anting";
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
      anim: name === "brachyrhynchos" ? "sit" : name === "ossifragus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

                      function brachyrhynchosPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.brachyrhynchos));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.022, rot: s * 1.40, dx: 0, anim: "sit" };
    }
    if (u < 0.80) {
      const flash = Math.sin(t * 6.9) + 0.30 * Math.sin(t * 13.8);
      return {
        lift: 0.022 + Math.abs(flash) * 0.016,
        rot: 1.40 + flash * 1.35,
        dx: flash * 0.0012,
        anim: "sit",
      };
    }
    const s = (u - 0.80) / 0.20;
    return { lift: 0.009 * (1 - s), rot: 0.42 * (1 - s), dx: 0, anim: "idle" };
  }
  function ossifragusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ossifragus));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.036, rot: s * -1.70, dx: s * 0.0016, anim: "play" };
    }
    if (u < 0.84) {
      const wriggle = Math.sin(t * 4.9) + 0.22 * Math.sin(t * 8.7);
      return {
        lift: 0.036 + Math.abs(wriggle) * 0.022,
        rot: -1.70 + wriggle * 2.85,
        dx: wriggle * 0.0026,
        anim: "play",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.011 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" };
  }
  function coronePose(t) {
    return {
      lift: 0.008 + Math.abs(Math.sin(t * 0.33)) * 0.017,
      rot: Math.sin(t * 0.33) * 1.05,
      dx: Math.sin(t * 0.27) * 0.0013,
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
        : kind === "hopwalk"
          ? "walk"
          : kind === "monocle"
            ? "sit"
            : kind === "fossick"
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
    const breath = Math.sin(t * 0.12) + 0.07 * Math.sin(t * 0.33);
    const soft = Math.abs(Math.sin(t * 0.17));
    return {
      lift: 0.004 + soft * 0.013,
      rot: -0.28 + breath * 0.55,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.005 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.20 * (1 - u) };
  }

  function hopwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hopwalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      // bipedal crow hop settles onto the blotter
      return { x: fromX, lift: s * 0.034, rot: s * -0.55 * face, anim: "walk" };
    }
    if (u < 0.88) {
      const s = (u - 0.10) / 0.78;
      // double-hop ground gait — bounce without naming hop
      const bounce = Math.abs(Math.sin(s * Math.PI * 4.0));
      const drift = Math.sin(s * Math.PI * 2.0);
      return {
        x: fromX + face * (0.055 * s + drift * 0.012),
        lift: 0.012 + bounce * 0.046,
        rot: (-0.55 + drift * 1.15) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + face * 0.055 * (1 - s),
      lift: 0.012 * (1 - s),
      rot: -0.18 * (1 - s) * face,
      anim: "idle",
    };
  }
  function monoclePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.monocle));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      // monocular head-cock settles
      return { x: fromX, lift: s * 0.018, rot: s * 2.85 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const pulse = Math.sin(t * 3.2) + 0.18 * Math.sin(t * 7.1);
      return {
        x: fromX + face * pulse * 0.0025,
        lift: 0.018 + Math.abs(pulse) * 0.008,
        rot: (2.85 + pulse * 0.55) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.008 * (1 - s),
      rot: 0.55 * (1 - s) * face,
      anim: "idle",
    };
  }
  function fossickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fossick));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      // bill tip drops toward the blotter scrap
      return { x: fromX, lift: s * 0.008, rot: s * -2.45 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const peck = Math.sin(t * 7.6) + 0.24 * Math.sin(t * 15.2);
      const bite = peck > 0.35 ? 0.9 : peck < -0.35 ? -0.5 : peck * 0.4;
      return {
        x: fromX + face * bite * 0.004,
        lift: 0.006 + Math.abs(peck) * 0.014,
        rot: (-2.45 + bite * 1.6) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 0.004 * (1 - s), rot: -0.35 * (1 - s) * face, anim: "idle" };
  }
  function antingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.anting));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX, lift: s * 0.028, rot: s * -1.65 * face, anim: "play" };
    }
    if (u < 0.88) {
      // formic rub — wing-over-feather without naming preen
      const rub = Math.sin(t * 5.8) + 0.22 * Math.sin(t * 11.6);
      return {
        x: fromX + face * rub * 0.008,
        lift: 0.022 + Math.abs(rub) * 0.018,
        rot: (-1.65 + rub * 2.1) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 0.008 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "hopwalk" && trick.kind !== "monocle" && trick.kind !== "fossick" && trick.kind !== "anting") {
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
    if (next.kind === "hopwalk") {
      const pose = hopwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "monocle") {
      const pose = monoclePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fossick") {
      const pose = fossickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = antingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
