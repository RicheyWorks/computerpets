/** Sun ground tricks while idle. House neighborly ring-tailed lemur (Lemur catta / Lemuridae) desk life -- bellybask / ringtailcurl / hopgallop / scentmark / lemurhush personality (bellybask sun-worship belly bask upright distinct from Skink sunbask and Iguana sunPose; ringtailcurl ring-tail curl signal distinct from Millipede coilcurl and Deer flagtail; hopgallop hop-gallop bound distinct from Rabbit hop and Grasshopper leap; scentmark wrist scent-mark rub desk-safe distinct from Hedgehog anoint and Skunk plume; long lemurhush Lemur catta hush -- never named wait; NOT Hang sloth; NOT Rui red panda; NOT primate generic Swing; guest slug Sun / key lemur -- accept lemur and sun; Thank-yous denssun / inksun / denslemur. Sleep, hide, leave, rest, card, ribbon still win. Same map as web lemur-tricks.ts. Next: Swing / gibbon. Catalog 220. */
(function (root) {
  const TRICK_KEY = "lemur";
  const TRICKS = ["bellybask", "ringtailcurl", "hopgallop", "scentmark", "lemurhush"];
  const HAPPY = ["denssun", "inksun", "denslemur"];
  const HAPPY_DUR = { denssun: 2.58, inksun: 2.74, denslemur: 2.46 };
  const LEMURHUSH_HOLD = 30.85;
  const RELEASE_S = 2.28;
  const DUR = { lemurhush: LEMURHUSH_HOLD + RELEASE_S, bellybask: 5.12, ringtailcurl: 4.96, hopgallop: 5.34, scentmark: 4.72 };

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
    if (kind === "lemurhush") return 196 + roll * 20;
    if (kind === "bellybask") return 23.0 + roll * 3.5;
    if (kind === "ringtailcurl") return 24.8 + roll * 3.6;
    if (kind === "hopgallop") return 21.6 + roll * 3.4;
    if (kind === "scentmark") return 25.2 + roll * 3.7;
    return justFinished ? 18.6 + roll * 3.0 : 13.8 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "lemurhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "lemurhush") {
      if (roll < 0.26) return "bellybask";
      if (roll < 0.5) return "ringtailcurl";
      if (roll < 0.74) return "hopgallop";
      return "scentmark";
    }
    if (lastKind === "bellybask") {
      if (roll < 0.26) return "lemurhush";
      if (roll < 0.5) return "ringtailcurl";
      if (roll < 0.74) return "hopgallop";
      return "scentmark";
    }
    if (lastKind === "ringtailcurl") {
      if (roll < 0.22) return "lemurhush";
      if (roll < 0.44) return "bellybask";
      if (roll < 0.68) return "hopgallop";
      return "scentmark";
    }
    if (roll < 0.2) return "lemurhush";
    if (roll < 0.4) return "bellybask";
    if (roll < 0.6) return "ringtailcurl";
    if (roll < 0.8) return "hopgallop";
    return "scentmark";
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
    return key === TRICK_KEY || key === "sun";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denssun";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denssun" ? "sit" : name === "inksun" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denssunPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssun));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0042, rot: s * -0.14, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.25);
      return { lift: 0.0042 + Math.abs(sway) * 0.0012, rot: -0.14 + sway * 0.16, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0042 * (1 - s), rot: -0.14 * (1 - s), anim: "idle" };
  }
  function inksunPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksun));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0031, rot: s * 0.22, anim: "play" };
    }
    if (u < 0.82) {
      const ring = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.05);
      return { lift: 0.0031 + Math.abs(ring) * 0.0018, rot: 0.22 + ring * 0.24, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0031 * (1 - s), rot: 0.22 * (1 - s), anim: "idle" };
  }
  function denslemurPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslemur));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0014, rot: s * 0.15, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.15);
      return { lift: -0.0014 + Math.abs(hush) * 0.0010, rot: 0.15 + hush * 0.14, anim: "play" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: -0.0014 * (1 - s), rot: 0.15 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denssun") {
      const pose = denssunPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inksun") {
      const pose = inksunPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denslemurPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "lemurhush";
    const anim =
      k === "lemurhush"
        ? "sit"
        : k === "bellybask"
          ? "sit"
          : k === "ringtailcurl"
            ? "play"
            : k === "hopgallop"
              ? "walk"
              : k === "scentmark"
                ? "play"
                : "sit";
    return {
      kind: k,
      phase: k === "lemurhush" ? "hold" : "go",
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

  function lemurhushPose(t) {
    const breath = Math.sin(t * 0.00078) + 0.00022 * Math.sin(t * 0.0021);
    const hush = Math.abs(Math.sin(t * 0.00029));
    return { lift: -0.00018 + hush * 0.000042, rot: 0.004 + breath * 0.0020 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00020 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.005 * (1 - u) };
  }

  function bellybaskPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bellybask));
    const face = facing == null ? 1 : facing;
    // sit upright, open chest/belly to sun, soft sway, ease down
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00003, lift: s * 0.0068, rot: s * -0.28 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const bask = (u - 0.16) / 0.66;
      const glow = Math.sin(bask * Math.PI * 1.55);
      return {
        x: fromX + face * (0.00003 + glow * 0.00012),
        lift: 0.0068 + Math.abs(glow) * 0.0014,
        rot: (-0.28 + glow * 0.08) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0068 * (1 - s), rot: -0.28 * (1 - s) * face, anim: "idle" };
  }

  function ringtailcurlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ringtailcurl));
    const face = facing == null ? 1 : facing;
    // plant feet, lift striped ring-tail into question-mark curl signal, flash rings, settle
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00005, lift: s * 0.0045, rot: s * 0.55 * face, anim: "play" };
    }
    if (u < 0.78) {
      const signal = (u - 0.18) / 0.6;
      const curl = Math.sin(signal * Math.PI * 2.4);
      return {
        x: fromX + face * (0.00005 + curl * 0.00022),
        lift: 0.0045 + Math.abs(curl) * 0.0016,
        rot: (0.55 + curl * 0.28) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.00005 * (1 - s), lift: 0.0045 * (1 - s), rot: 0.55 * (1 - s) * face, anim: "idle" };
  }

  function hopgallopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hopgallop));
    const face = facing == null ? 1 : facing;
    // ring-tailed lemur hop-gallop: crouch, bound, plant, bound again, settle
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0008, lift: s * -0.0012, rot: s * -0.12 * face, anim: "walk" };
    }
    if (u < 0.38) {
      const s = smoothstep((u - 0.12) / 0.26);
      const hop = Math.sin(s * Math.PI);
      return {
        x: fromX + face * (0.0008 + s * 0.011),
        lift: -0.0012 + hop * 0.0085,
        rot: (-0.12 + s * 0.18) * face,
        anim: "walk",
      };
    }
    if (u < 0.52) {
      const plant = Math.sin(((u - 0.38) / 0.14) * Math.PI);
      return {
        x: fromX + face * (0.0118 + plant * 0.0003),
        lift: Math.abs(plant) * 0.0010,
        rot: (0.06 + plant * 0.05) * face,
        anim: "walk",
      };
    }
    if (u < 0.82) {
      const s = smoothstep((u - 0.52) / 0.3);
      const hop = Math.sin(s * Math.PI);
      return {
        x: fromX + face * (0.0121 + s * 0.0105),
        lift: hop * 0.0078,
        rot: (0.06 - s * 0.1) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * (0.0226 - s * 0.0012), lift: 0.0004 * (1 - s), rot: -0.04 * (1 - s) * face, anim: "idle" };
  }

  function scentmarkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scentmark));
    const face = facing == null ? 1 : facing;
    // desk-safe wrist/antebrachial scent rub on the sill, pause, settle
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.0004, lift: s * -0.0028, rot: s * 0.36 * face, anim: "play" };
    }
    if (u < 0.78) {
      const rub = (u - 0.14) / 0.64;
      const wipe = Math.sin(rub * Math.PI * 5.2);
      return {
        x: fromX + face * (0.0004 + wipe * 0.00055),
        lift: -0.0028 + Math.abs(wipe) * 0.0007,
        rot: (0.36 + wipe * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * 0.0004 * (1 - s), lift: -0.0028 * (1 - s), rot: 0.36 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "bellybask" && trick.kind !== "ringtailcurl" && trick.kind !== "hopgallop" && trick.kind !== "scentmark") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "lemurhush") {
      if (next.t < LEMURHUSH_HOLD) {
        const pose = lemurhushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LEMURHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LEMURHUSH_HOLD);
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
    if (next.kind === "bellybask") {
      const pose = bellybaskPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ringtailcurl") {
      const pose = ringtailcurlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hopgallop") {
      const pose = hopgallopPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = scentmarkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LEMURHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denssunPose,
    inksunPose,
    denslemurPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    lemurhushPose,
    releasePose,
    bellybaskPose,
    ringtailcurlPose,
    hopgallopPose,
    scentmarkPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetLemurTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
