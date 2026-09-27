/** Gum ground tricks while idle — ultra-polish pass. House neighborly Koala Phascolarctos cinereus / Phascolarctidae desk life (koala / Gum) — eucchewbrowse / forkbranchperch / sleepychintuck / climbhugtrunk / pouchpress / eardroop / phascolarctoshush personality (eucchewbrowse eucalyptus leaf chew-browse without naming chew or browse or leaf alone as wait — distinct from Boom leafchew and Still gumscrape; forkbranchperch fork-branch perch without naming perch or branch or sit alone as wait — distinct from Hang hangsway and Sail clingclimb; sleepychintuck sleepy chin-tuck without naming sleep or chin or tuck alone as wait — distinct from Gaze stillstare; climbhugtrunk climb-hug trunk without naming climb or hug or trunk alone as wait — distinct from Hang clawhook and Sail clingclimb; pouchpress pouch press settle without naming pouch or press or cling alone as wait — koala marsupial tell; eardroop fuzzy ear droop without naming ear or droop or listen alone as wait — distinct from Gaze earfan; long phascolarctoshush Phascolarctos hush hold (THE phascolarctoshush sit_hold tell) — never named wait or crouch or sit or still or koala or gum or chew or cling as bare ethogram-only trick kinds; Still potto owns scapularshield/crypticcreep/gumscrape/gripclamp/neckspine/branchfreeze/perodicticushush — do NOT reuse gumscrape; Hang sloth owns headturnstare/hangsway/clawhook — do NOT reuse; Boom howler owns hyoidboom/leafchew/alouattahush — do NOT reuse; Gaze tarsier owns eyeswivel/earfan/tarsiushush — do NOT reuse; guest slug Gum / key koala only for wantsThankYou matching — accept "koala" and "gum"; do NOT name a trick "koala" or "gum" or "potto" or "still" or "sloth" or "hang" or "howler" or "boom"; not Still Perodicticus life, not Hang Bradypus life, not Boom Alouatta life, not Gaze Carlito life, not Rui. Eucchewbrowse / forkbranchperch / sleepychintuck / climbhugtrunk / pouchpress / eardroop / phascolarctoshush; densgum / inkgum / densphascolarctos thank-yous. Same map as web koala-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names chew/cling/still/walk/sit/wait/koala/gum as bare ethogram-only trick kinds. True Koala Phascolarctos cinereus desk life only — euc chew browse, fork branch perch, sleepy chin tuck, climb hug trunk, pouch press, ear droop, Phascolarctos hush. Next house-order ultra: Ridge / brain_coral. No cry inventing — koala.wav EXISTS so prefersHouseCry adds koala after potto. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "koala";
  const TRICKS = ["eucchewbrowse", "forkbranchperch", "sleepychintuck", "climbhugtrunk", "pouchpress", "eardroop", "phascolarctoshush"];
  const HAPPY = ["densgum", "inkgum", "densphascolarctos"];

  const HAPPY_DUR = { densgum: 1.70, inkgum: 1.84, densphascolarctos: 1.76 };
  const PHASCOLARCTOSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    phascolarctoshush: PHASCOLARCTOSHUSH_HOLD + RELEASE_S,
    eucchewbrowse: 2.48,
    forkbranchperch: 2.42,
    sleepychintuck: 2.40,
    climbhugtrunk: 2.44,
    pouchpress: 2.38,
    eardroop: 2.56,
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
    if (kind === "phascolarctoshush") return 40 + roll * 26;
    if (kind === "pouchpress" || kind === "eucchewbrowse" || kind === "eardroop") return 12.8 + roll * 9.4;
    if (kind === "sleepychintuck" || kind === "forkbranchperch" || kind === "climbhugtrunk") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "phascolarctoshush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "phascolarctoshush") {
      if (roll < 0.17) return "eucchewbrowse";
      if (roll < 0.33) return "forkbranchperch";
      if (roll < 0.49) return "sleepychintuck";
      if (roll < 0.65) return "climbhugtrunk";
      if (roll < 0.83) return "pouchpress";
      return "eardroop";
    }
    if (lastKind === "eucchewbrowse") {
      if (roll < 0.16) return "phascolarctoshush";
      if (roll < 0.32) return "forkbranchperch";
      if (roll < 0.48) return "sleepychintuck";
      if (roll < 0.64) return "climbhugtrunk";
      if (roll < 0.82) return "pouchpress";
      return "eardroop";
    }
    if (lastKind === "forkbranchperch") {
      if (roll < 0.14) return "phascolarctoshush";
      if (roll < 0.3) return "eucchewbrowse";
      if (roll < 0.46) return "sleepychintuck";
      if (roll < 0.62) return "climbhugtrunk";
      if (roll < 0.8) return "pouchpress";
      return "eardroop";
    }
    if (lastKind === "sleepychintuck") {
      if (roll < 0.15) return "phascolarctoshush";
      if (roll < 0.31) return "eucchewbrowse";
      if (roll < 0.47) return "forkbranchperch";
      if (roll < 0.63) return "climbhugtrunk";
      if (roll < 0.81) return "pouchpress";
      return "eardroop";
    }
    if (lastKind === "climbhugtrunk") {
      if (roll < 0.16) return "phascolarctoshush";
      if (roll < 0.32) return "eucchewbrowse";
      if (roll < 0.48) return "forkbranchperch";
      if (roll < 0.64) return "sleepychintuck";
      if (roll < 0.82) return "pouchpress";
      return "eardroop";
    }
    if (lastKind === "pouchpress") {
      if (roll < 0.15) return "phascolarctoshush";
      if (roll < 0.31) return "eucchewbrowse";
      if (roll < 0.47) return "forkbranchperch";
      if (roll < 0.63) return "sleepychintuck";
      if (roll < 0.81) return "climbhugtrunk";
      return "eardroop";
    }
    if (lastKind === "eardroop") {
      if (roll < 0.16) return "phascolarctoshush";
      if (roll < 0.32) return "eucchewbrowse";
      if (roll < 0.48) return "forkbranchperch";
      if (roll < 0.64) return "sleepychintuck";
      if (roll < 0.82) return "climbhugtrunk";
      return "pouchpress";
    }
    if (roll < 0.14) return "phascolarctoshush";
    if (roll < 0.28) return "eucchewbrowse";
    if (roll < 0.42) return "forkbranchperch";
    if (roll < 0.56) return "sleepychintuck";
    if (roll < 0.7) return "climbhugtrunk";
    if (roll < 0.85) return "pouchpress";
    return "eardroop";
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
    return key === TRICK_KEY || key === "gum";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densgum";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densgum" ? "sit" : name === "inkgum" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densgumPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgum));
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

  function inkgumPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgum));
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

  function densphascolarctosPose(t) {
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
    if (next.kind === "densgum") {
      const pose = densgumPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkgum") {
      const pose = inkgumPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densphascolarctosPose(next.t);
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
      kind === "phascolarctoshush"
        ? "sit"
        : kind === "eucchewbrowse"
          ? "sit"
          : kind === "eardroop"
            ? "talk"
            : kind === "forkbranchperch"
              ? "sit"
              : kind === "sleepychintuck"
                ? "sit"
                : kind === "climbhugtrunk"
                  ? "walk"
                  : kind === "pouchpress"
                    ? "sit"
                    : "sit";
    return {
      kind,
      phase: kind === "phascolarctoshush" ? "hold" : "go",
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

  function phascolarctoshushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function eucchewbrowsePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.eucchewbrowse));
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

  function forkbranchperchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.forkbranchperch));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "sit",
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

  function eardroopPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.eardroop));
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

  function climbhugtrunkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.climbhugtrunk));
    const face = facing == null ? 1 : facing;
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "walk" };
    }
    if (u < 0.8) {
      const thrash = Math.sin(t * 3.6);
      return {
        x: fromX + face * (1.0 + thrash * 0.22),
        lift: 3.6 + Math.abs(thrash) * 2.0,
        rot: face * (18 + thrash * 14),
        anim: "walk",
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

  function sleepychintuckPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sleepychintuck));
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

  function pouchpressPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pouchpress));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const cast = Math.sin(t * 2.8);
      return {
        x: fromX + face * (0.6 + cast * 0.16),
        lift: 2.8 + Math.abs(cast) * 1.6,
        rot: face * (12 + cast * 10),
        anim: "sit",
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
      trick.kind !== "eucchewbrowse" &&
      trick.kind !== "forkbranchperch" &&
      trick.kind !== "sleepychintuck" &&
      trick.kind !== "climbhugtrunk" &&
      trick.kind !== "pouchpress" &&
      trick.kind !== "eardroop"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "phascolarctoshush") {
      if (next.t < PHASCOLARCTOSHUSH_HOLD) {
        const pose = phascolarctoshushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PHASCOLARCTOSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PHASCOLARCTOSHUSH_HOLD);
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
    if (next.kind === "eucchewbrowse") {
      const pose = eucchewbrowsePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "forkbranchperch") {
      const pose = forkbranchperchPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sleepychintuck") {
      const pose = sleepychintuckPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "climbhugtrunk") {
      const pose = climbhugtrunkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pouchpress") {
      const pose = pouchpressPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = eardroopPose(next.t, fromX, trick.facing);
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
    PHASCOLARCTOSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    phascolarctoshushPose,
    releasePose,
    eucchewbrowsePose,
    forkbranchperchPose,
    eardroopPose,
    climbhugtrunkPose,
    sleepychintuckPose,
    pouchpressPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densgumPose,
    inkgumPose,
    densphascolarctosPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetKoalaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);