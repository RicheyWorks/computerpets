/** Still ground tricks while idle — ultra-polish pass. House neighborly Potto Perodicticus potto / Lorisidae Perodicticinae desk life (potto / Still) — scapularshield / crypticcreep / gumscrape / gripclamp / neckspine / branchfreeze / perodicticushush personality (scapularshield scapular defensive shield without naming shield or still or freeze alone as wait — distinct from Still gripclamp and Deer freeze; crypticcreep cryptic slow creep without naming creep or crawl or walk alone as wait — distinct from Hang clawhook and Sail clingclimb; gumscrape gum-exudate scrape feed without naming scrape or gum or chew alone as wait — distinct from Boom leafchew and Gum/koala next seat; gripclamp vice grip clamp without naming grip or clamp or cling alone as wait — distinct from Hang hangsway and Sail clingclimb; neckspine nuchal spine raise without naming spine or neck or bristle alone as wait — distinct from Porcupine and Click; branchfreeze branch freeze-hold without naming freeze or still or branch alone as wait — distinct from Still gripclamp and Deer freeze; long perodicticushush Perodicticus hush hold (THE perodicticushush sit_hold tell) — never named wait or crouch or sit or still or potto or cling as bare ethogram-only trick kinds; Still tarsier owns scapularshield/crypticcreep/gumscrape/gripclamp/neckspine/branchfreeze/perodicticushush — do NOT reuse; Hang sloth owns headturnstare/hangsway/clawhook — do NOT reuse; Boom howler owns hyoidboom/alouattahush — do NOT reuse; Sail colugo owns clingclimb — do NOT reuse; guest slug Still / key potto only for wantsThankYou matching — accept "potto" and "still"; do NOT name a trick "potto" or "still" or "potto" or "gaze" or "howler" or "boom" or "sloth" or "hang" or "koala" or "gum"; not Still Carlito life, not Hang Bradypus life, not Boom Alouatta life, not Gum Phascolarctos life, not Rui. Scapularshield / crypticcreep / gumscrape / gripclamp / neckspine / branchfreeze / perodicticushush; densstill / inkstill / densperodicticus thank-yous. Same map as web potto-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names still/cling/walk/sit/wait/potto as bare ethogram-only trick kinds. True Potto Perodicticus potto desk life only — scapular shield, cryptic creep, gum scrape, grip clamp, neck spine, branch freeze, Perodicticus hush. Next house-order ultra: Gum / koala. No cry inventing — potto.wav EXISTS so prefersHouseCry adds potto after tarsier. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "potto";
  const TRICKS = ["scapularshield", "crypticcreep", "gumscrape", "gripclamp", "neckspine", "branchfreeze", "perodicticushush"];
  const HAPPY = ["densstill", "inkstill", "densperodicticus"];

  const HAPPY_DUR = { densstill: 1.70, inkstill: 1.84, densperodicticus: 1.76 };
  const PERODICTICUSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    perodicticushush: PERODICTICUSHUSH_HOLD + RELEASE_S,
    scapularshield: 2.48,
    crypticcreep: 2.42,
    gumscrape: 2.40,
    gripclamp: 2.44,
    neckspine: 2.38,
    branchfreeze: 2.56,
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
    if (kind === "perodicticushush") return 40 + roll * 26;
    if (kind === "neckspine" || kind === "scapularshield" || kind === "branchfreeze") return 12.8 + roll * 9.4;
    if (kind === "gumscrape" || kind === "crypticcreep" || kind === "gripclamp") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "perodicticushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "perodicticushush") {
      if (roll < 0.17) return "scapularshield";
      if (roll < 0.33) return "crypticcreep";
      if (roll < 0.49) return "gumscrape";
      if (roll < 0.65) return "gripclamp";
      if (roll < 0.83) return "neckspine";
      return "branchfreeze";
    }
    if (lastKind === "scapularshield") {
      if (roll < 0.16) return "perodicticushush";
      if (roll < 0.32) return "crypticcreep";
      if (roll < 0.48) return "gumscrape";
      if (roll < 0.64) return "gripclamp";
      if (roll < 0.82) return "neckspine";
      return "branchfreeze";
    }
    if (lastKind === "crypticcreep") {
      if (roll < 0.14) return "perodicticushush";
      if (roll < 0.3) return "scapularshield";
      if (roll < 0.46) return "gumscrape";
      if (roll < 0.62) return "gripclamp";
      if (roll < 0.8) return "neckspine";
      return "branchfreeze";
    }
    if (lastKind === "gumscrape") {
      if (roll < 0.15) return "perodicticushush";
      if (roll < 0.31) return "scapularshield";
      if (roll < 0.47) return "crypticcreep";
      if (roll < 0.63) return "gripclamp";
      if (roll < 0.81) return "neckspine";
      return "branchfreeze";
    }
    if (lastKind === "gripclamp") {
      if (roll < 0.16) return "perodicticushush";
      if (roll < 0.32) return "scapularshield";
      if (roll < 0.48) return "crypticcreep";
      if (roll < 0.64) return "gumscrape";
      if (roll < 0.82) return "neckspine";
      return "branchfreeze";
    }
    if (lastKind === "neckspine") {
      if (roll < 0.15) return "perodicticushush";
      if (roll < 0.31) return "scapularshield";
      if (roll < 0.47) return "crypticcreep";
      if (roll < 0.63) return "gumscrape";
      if (roll < 0.81) return "gripclamp";
      return "branchfreeze";
    }
    if (lastKind === "branchfreeze") {
      if (roll < 0.16) return "perodicticushush";
      if (roll < 0.32) return "scapularshield";
      if (roll < 0.48) return "crypticcreep";
      if (roll < 0.64) return "gumscrape";
      if (roll < 0.82) return "gripclamp";
      return "neckspine";
    }
    if (roll < 0.14) return "perodicticushush";
    if (roll < 0.28) return "scapularshield";
    if (roll < 0.42) return "crypticcreep";
    if (roll < 0.56) return "gumscrape";
    if (roll < 0.7) return "gripclamp";
    if (roll < 0.85) return "neckspine";
    return "branchfreeze";
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
    return key === TRICK_KEY || key === "still";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densstill";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densstill" ? "sit" : name === "inkstill" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densstillPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densstill));
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

  function inkstillPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkstill));
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

  function densperodicticusPose(t) {
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
    if (next.kind === "densstill") {
      const pose = densstillPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkstill") {
      const pose = inkstillPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densperodicticusPose(next.t);
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
      kind === "perodicticushush"
        ? "sit"
        : kind === "scapularshield"
          ? "sit"
          : kind === "branchfreeze"
            ? "talk"
            : kind === "crypticcreep"
              ? "walk"
              : kind === "gumscrape"
                ? "sit"
                : kind === "gripclamp"
                  ? "sit"
                  : kind === "neckspine"
                    ? "play"
                    : "sit";
    return {
      kind,
      phase: kind === "perodicticushush" ? "hold" : "go",
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

  function perodicticushushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function scapularshieldPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scapularshield));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const bar = Math.sin(t * 2.4);
      return {
        x: fromX + face * (0.8 + bar * 0.16),
        lift: 2.8 + Math.abs(bar) * 1.5,
        rot: face * (-12 + bar * 10),
        anim: "sit",
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

  function crypticcreepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.crypticcreep));
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

  function branchfreezePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.branchfreeze));
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

  function gripclampPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gripclamp));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "sit",
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

  function gumscrapePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gumscrape));
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

  function neckspinePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.neckspine));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "play" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "play",
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
      trick.kind !== "scapularshield" &&
      trick.kind !== "crypticcreep" &&
      trick.kind !== "gumscrape" &&
      trick.kind !== "gripclamp" &&
      trick.kind !== "neckspine" &&
      trick.kind !== "branchfreeze"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "perodicticushush") {
      if (next.t < PERODICTICUSHUSH_HOLD) {
        const pose = perodicticushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PERODICTICUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PERODICTICUSHUSH_HOLD);
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
    if (next.kind === "scapularshield") {
      const pose = scapularshieldPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "crypticcreep") {
      const pose = crypticcreepPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gumscrape") {
      const pose = gumscrapePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gripclamp") {
      const pose = gripclampPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "neckspine") {
      const pose = neckspinePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = branchfreezePose(next.t, fromX, trick.facing);
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
    PERODICTICUSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    perodicticushushPose,
    releasePose,
    scapularshieldPose,
    crypticcreepPose,
    branchfreezePose,
    gripclampPose,
    gumscrapePose,
    neckspinePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densstillPose,
    inkstillPose,
    densperodicticusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPottoTricks = api;
})(typeof window !== "undefined" ? window : globalThis);