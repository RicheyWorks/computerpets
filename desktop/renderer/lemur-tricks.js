/** Sun ground tricks while idle — ultra-polish pass. House neighborly Lemur catta / ring-tailed lemur desk life (lemur / Sun) — bellybask / ringtailcurl / hopgallop / scentmark / stinkfight / sunworship / lemurhush personality (bellybask sun-worship belly bask upright without naming bask or sun or sit alone as wait — distinct from Skink sunbask and Iguana bask; ringtailcurl ring-tail curl signal without naming curl or flag or coil alone as wait — distinct from Millipede coilcurl and Deer flagtail; hopgallop hop-gallop bound without naming hop or leap or gallop alone as wait — distinct from Rabbit hop and Grasshopper leap; scentmark wrist scent-mark rub without naming scent or mark or anoint alone as wait — distinct from Hedgehog anoint and Skunk plume; stinkfight male stink-fight tail-wave without naming fight or stink or plume alone as wait — distinct from Skunk plume and Hang hangsway; sunworship upright sun-worship settle without naming sun or worship or bask alone as wait — distinct from Skink sunbask and bellybask; long lemurhush Lemur catta hush hold (THE lemurhush sit_hold tell) — never named wait or crouch or sit or walk or sun or lemur as bare ethogram-only trick kinds; Hang sloth owns hangsway/reachcrawl/algaescratch/headturnstare/clawhook/slowdrip/bradypushush — do NOT reuse; Rob robber_fly owns sallyhawk/beardgroom/midsnatch/stiltsstance/mystaxwipe/perchsally/asilushush — do NOT reuse; Click click_beetle owns clickjack/eyespotflash/clickfreeze/tickwalk/feelertick/rightingclick/elaterhush — do NOT reuse; guest slug Sun / key lemur only for wantsThankYou matching — accept "lemur" and "sun"; do NOT name a trick "lemur" or "sun" or "sloth" or "hang" or "gibbon" or "swing" or "bradypushush" or "hangsway"; not Hang Choloepus life, not Swing gibbon brachiation, not Rui. Bellybask / ringtailcurl / hopgallop / scentmark / stinkfight / sunworship / lemurhush; denssun / inksun / denslemur thank-yous. Same map as web lemur-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names sun/flag/walk/sit/wait/lemur as bare ethogram-only trick kinds. True ring-tailed lemur Lemur catta desk life only — belly bask, ring-tail curl, hop-gallop, scent-mark, stink-fight, sun-worship, Lemur hush. Next house-order ultra: Swing / gibbon. No cry inventing — lemur.wav EXISTS so prefersHouseCry adds lemur after sloth. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "lemur";
  const TRICKS = ["bellybask", "ringtailcurl", "hopgallop", "scentmark", "stinkfight", "sunworship", "lemurhush"];
  const HAPPY = ["denssun", "inksun", "denslemur"];

  const HAPPY_DUR = { denssun: 1.70, inksun: 1.84, denslemur: 1.76 };
  const LEMURHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    lemurhush: LEMURHUSH_HOLD + RELEASE_S,
    bellybask: 2.48,
    ringtailcurl: 2.42,
    hopgallop: 2.40,
    scentmark: 2.44,
    stinkfight: 2.38,
    sunworship: 2.56,
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
    if (kind === "lemurhush") return 40 + roll * 26;
    if (kind === "stinkfight" || kind === "bellybask" || kind === "scentmark") return 12.8 + roll * 9.4;
    if (kind === "hopgallop" || kind === "ringtailcurl" || kind === "sunworship") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "lemurhush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "lemurhush") {
      if (roll < 0.17) return "bellybask";
      if (roll < 0.33) return "ringtailcurl";
      if (roll < 0.49) return "hopgallop";
      if (roll < 0.65) return "scentmark";
      if (roll < 0.83) return "stinkfight";
      return "sunworship";
    }
    if (lastKind === "bellybask") {
      if (roll < 0.16) return "lemurhush";
      if (roll < 0.32) return "ringtailcurl";
      if (roll < 0.48) return "hopgallop";
      if (roll < 0.64) return "scentmark";
      if (roll < 0.82) return "stinkfight";
      return "sunworship";
    }
    if (lastKind === "ringtailcurl") {
      if (roll < 0.14) return "lemurhush";
      if (roll < 0.3) return "bellybask";
      if (roll < 0.46) return "hopgallop";
      if (roll < 0.62) return "scentmark";
      if (roll < 0.8) return "stinkfight";
      return "sunworship";
    }
    if (lastKind === "hopgallop") {
      if (roll < 0.15) return "lemurhush";
      if (roll < 0.31) return "bellybask";
      if (roll < 0.47) return "ringtailcurl";
      if (roll < 0.63) return "scentmark";
      if (roll < 0.81) return "stinkfight";
      return "sunworship";
    }
    if (lastKind === "scentmark") {
      if (roll < 0.16) return "lemurhush";
      if (roll < 0.32) return "bellybask";
      if (roll < 0.48) return "ringtailcurl";
      if (roll < 0.64) return "hopgallop";
      if (roll < 0.82) return "stinkfight";
      return "sunworship";
    }
    if (lastKind === "stinkfight") {
      if (roll < 0.15) return "lemurhush";
      if (roll < 0.31) return "bellybask";
      if (roll < 0.47) return "ringtailcurl";
      if (roll < 0.63) return "hopgallop";
      if (roll < 0.81) return "scentmark";
      return "sunworship";
    }
    if (lastKind === "sunworship") {
      if (roll < 0.16) return "lemurhush";
      if (roll < 0.32) return "bellybask";
      if (roll < 0.48) return "ringtailcurl";
      if (roll < 0.64) return "hopgallop";
      if (roll < 0.82) return "scentmark";
      return "stinkfight";
    }
    if (roll < 0.14) return "lemurhush";
    if (roll < 0.28) return "bellybask";
    if (roll < 0.42) return "ringtailcurl";
    if (roll < 0.56) return "hopgallop";
    if (roll < 0.7) return "scentmark";
    if (roll < 0.85) return "stinkfight";
    return "sunworship";
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

  function wantsThankYou(key  ) {
    return key === TRICK_KEY || key === "sun";
  }

  function startThankYou(
    key  ,
    lastKind,
    x,
    facing,
    flags
  ) {
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
    const name = (HAPPY).includes(kind) ? (kind) : "denssun";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denssun" ? "sit" : name === "inksun" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denssunPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssun));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const flash = Math.sin(t * 2.2);
      return {
        lift: 2.8 + Math.abs(flash) * 1.4,
        rot: 12 + flash * 8,
        dx: flash * 0.08,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function inksunPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksun));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" };
    }
    if (u < 0.8) {
      const wriggle = Math.sin(t * 2.6);
      return {
        lift: 3.4 + Math.abs(wriggle) * 1.6,
        rot: -14 + wriggle * 10,
        dx: wriggle * 0.12,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" };
  }

  function denslemurPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.58) * 8,
      dx: Math.sin(t * 0.4) * 0.06,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
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
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "lemurhush"
        ? "sit"
        : kind === "bellybask"
          ? "play"
          : kind === "sunworship"
            ? "talk"
            : kind === "ringtailcurl"
              ? "walk"
              : kind === "hopgallop"
                ? "sit"
                : kind === "scentmark"
                  ? "play"
                  : kind === "stinkfight"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "lemurhush" ? "hold" : "go",
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

  function lemurhushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function bellybaskPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bellybask));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.8 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (-4 * (1 - s)),
      anim: "idle",
    };
  }

  function ringtailcurlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ringtailcurl));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function sunworshipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sunworship));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" };
    }
    if (u < 0.8) {
      const cloud = Math.sin(t * 3.0);
      return {
        x: fromX + face * (0.6 + cloud * 0.18),
        lift: 3.0 + Math.abs(cloud) * 1.8,
        rot: face * (14 + cloud * 12),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.5 * (1 - s),
      rot: face * (5 * (1 - s)),
      anim: "idle",
    };
  }

  function scentmarkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scentmark));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "play" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 1.0 * (1 - s),
      lift: 1.6 * (1 - s),
      rot: face * (6 * (1 - s)),
      anim: "idle",
    };
  }

  function hopgallopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hopgallop));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const hang = Math.sin(t * 2.0);
      return {
        x: fromX + face * (0.5 + hang * 0.1),
        lift: 2.8 + Math.abs(hang) * 1.2,
        rot: face * (11 + hang * 8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + face * 0.5 * (1 - s),
      lift: 1.3 * (1 - s),
      rot: face * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function stinkfightPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stinkfight));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + face * 0.6 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: face * (4 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "bellybask" &&
      trick.kind !== "ringtailcurl" &&
      trick.kind !== "hopgallop" &&
      trick.kind !== "scentmark" &&
      trick.kind !== "stinkfight" &&
      trick.kind !== "sunworship"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
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
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "bellybask") {
      const pose = bellybaskPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ringtailcurl") {
      const pose = ringtailcurlPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hopgallop") {
      const pose = hopgallopPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "scentmark") {
      const pose = scentmarkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stinkfight") {
      const pose = stinkfightPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sunworshipPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
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
    sleepHoldFrame,
    beginTrick,
    lemurhushPose,
    releasePose,
    bellybaskPose,
    ringtailcurlPose,
    sunworshipPose,
    scentmarkPose,
    hopgallopPose,
    stinkfightPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denssunPose,
    inksunPose,
    denslemurPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetLemurTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
