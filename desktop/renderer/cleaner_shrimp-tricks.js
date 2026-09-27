/** Scrub ground tricks while idle — ultra-polish pass. House neighborly Pacific Cleaner Shrimp Lysmata amboinensis / Hippolytidae cleaner shrimp desk life (cleaner_shrimp / Scrub) — antennawaveadvertise / dancescrubclientcue / rockcreviceretreat / bipedalwalktick / whitebandflash / clientstation / lysmatahush personality (antennawaveadvertise antenna-wave station advertise without naming antenna or wave or advertise alone as wait; dancescrubclientcue dance-scrub client cue without naming dance or scrub or client alone as wait — Lysmata cleaning-dance tell; rockcreviceretreat rock-crevice retreat without naming rock or crevice or retreat alone as wait — shelter tell; bipedalwalktick bipedal walk tick without naming bipedal or walk or tick alone as wait — Hippolytidae gait; whitebandflash white-band midbody flash without naming white or band or flash alone as wait — L. amboinensis color tell; clientstation client cleaning-station hold without naming client or station alone as wait — reef station tell; long lysmatahush Lysmata hush hold (THE lysmatahush sit_hold tell) — never named wait or crouch or sit or still or cleaner_shrimp or scrub as bare ethogram-only trick kinds; Scrape parrotfish owns beakscrapegraze/scarushush/pharyngealmill — do NOT reuse; Paint clownfish owns peckcleanhost/amphiprionhush — do NOT reuse; Wreath anemone owns oraldiskwreathsway/nematocysttuck/actiniahush — do NOT reuse; hermit crab Tenant owns scurry/curl — do NOT reuse; Click feelertick — do NOT reuse; goldfish Coin owns drift/gulp/flare — do NOT reuse; Tube sea_cucumber comes next — do NOT start; guest slug Scrub / key cleaner_shrimp only for wantsThankYou matching — accept "cleaner_shrimp" and "scrub"; do NOT name a trick "cleaner_shrimp" or "scrub" or "parrotfish" or "scrape" or "clownfish" or "paint" or "anemone" or "wreath" or "sea_cucumber" or "tube" or "goldfish" or "coin"; not Scrape Scaridae life, not Paint Amphiprion life, not Wreath Actiniaria life, not Coin Carassius life, not Tube Holothuroidea life, not Rui. Antennawaveadvertise / dancescrubclientcue / rockcreviceretreat / bipedalwalktick / whitebandflash / clientstation / lysmatahush; densscrub / inkscrub / denslysmata thank-yous. Same map as web cleaner_shrimp-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names wave/wait/still/scrub/cleaner_shrimp as bare ethogram-only trick kinds. True Pacific Cleaner Shrimp Lysmata amboinensis desk life only — antenna wave advertise, dance-scrub client cue, rock-crevice retreat, bipedal walk tick, white-band flash, client station, Lysmata hush. Next house-order ultra: Tube / sea_cucumber. No cry inventing — cleaner_shrimp.wav EXISTS so prefersHouseCry adds cleaner_shrimp after parrotfish. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "cleaner_shrimp";
  const TRICKS = ["antennawaveadvertise", "dancescrubclientcue", "rockcreviceretreat", "bipedalwalktick", "whitebandflash", "clientstation", "lysmatahush"];
  const HAPPY = ["densscrub", "inkscrub", "denslysmata"];

  const HAPPY_DUR = { densscrub: 1.70, inkscrub: 1.84, denslysmata: 1.76 };
  const LYSMATAHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    lysmatahush: LYSMATAHUSH_HOLD + RELEASE_S,
    antennawaveadvertise: 2.48,
    dancescrubclientcue: 2.42,
    rockcreviceretreat: 2.40,
    bipedalwalktick: 2.44,
    whitebandflash: 2.38,
    clientstation: 2.56,
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
    if (kind === "lysmatahush") return 40 + roll * 26;
    if (kind === "whitebandflash" || kind === "antennawaveadvertise" || kind === "clientstation") return 12.8 + roll * 9.4;
    if (kind === "rockcreviceretreat" || kind === "dancescrubclientcue" || kind === "bipedalwalktick") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "lysmatahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "lysmatahush") {
      if (roll < 0.17) return "antennawaveadvertise";
      if (roll < 0.33) return "dancescrubclientcue";
      if (roll < 0.49) return "rockcreviceretreat";
      if (roll < 0.65) return "bipedalwalktick";
      if (roll < 0.83) return "whitebandflash";
      return "clientstation";
    }
    if (lastKind === "antennawaveadvertise") {
      if (roll < 0.16) return "lysmatahush";
      if (roll < 0.32) return "dancescrubclientcue";
      if (roll < 0.48) return "rockcreviceretreat";
      if (roll < 0.64) return "bipedalwalktick";
      if (roll < 0.82) return "whitebandflash";
      return "clientstation";
    }
    if (lastKind === "dancescrubclientcue") {
      if (roll < 0.14) return "lysmatahush";
      if (roll < 0.3) return "antennawaveadvertise";
      if (roll < 0.46) return "rockcreviceretreat";
      if (roll < 0.62) return "bipedalwalktick";
      if (roll < 0.8) return "whitebandflash";
      return "clientstation";
    }
    if (lastKind === "rockcreviceretreat") {
      if (roll < 0.15) return "lysmatahush";
      if (roll < 0.31) return "antennawaveadvertise";
      if (roll < 0.47) return "dancescrubclientcue";
      if (roll < 0.63) return "bipedalwalktick";
      if (roll < 0.81) return "whitebandflash";
      return "clientstation";
    }
    if (lastKind === "bipedalwalktick") {
      if (roll < 0.16) return "lysmatahush";
      if (roll < 0.32) return "antennawaveadvertise";
      if (roll < 0.48) return "dancescrubclientcue";
      if (roll < 0.64) return "rockcreviceretreat";
      if (roll < 0.82) return "whitebandflash";
      return "clientstation";
    }
    if (lastKind === "whitebandflash") {
      if (roll < 0.15) return "lysmatahush";
      if (roll < 0.31) return "antennawaveadvertise";
      if (roll < 0.47) return "dancescrubclientcue";
      if (roll < 0.63) return "rockcreviceretreat";
      if (roll < 0.81) return "bipedalwalktick";
      return "clientstation";
    }
    if (lastKind === "clientstation") {
      if (roll < 0.16) return "lysmatahush";
      if (roll < 0.32) return "antennawaveadvertise";
      if (roll < 0.48) return "dancescrubclientcue";
      if (roll < 0.64) return "rockcreviceretreat";
      if (roll < 0.82) return "bipedalwalktick";
      return "whitebandflash";
    }
    if (roll < 0.14) return "lysmatahush";
    if (roll < 0.28) return "antennawaveadvertise";
    if (roll < 0.42) return "dancescrubclientcue";
    if (roll < 0.56) return "rockcreviceretreat";
    if (roll < 0.7) return "bipedalwalktick";
    if (roll < 0.85) return "whitebandflash";
    return "clientstation";
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
    return key === TRICK_KEY || key === "scrub";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densscrub";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densscrub" ? "sit" : name === "inkscrub" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densscrubPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densscrub));
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

  function inkscrubPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkscrub));
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

  function denslysmataPose(t) {
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
    if (next.kind === "densscrub") {
      const pose = densscrubPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkscrub") {
      const pose = inkscrubPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denslysmataPose(next.t);
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
      kind === "lysmatahush"
        ? "sit"
        : kind === "antennawaveadvertise"
          ? "sit"
          : kind === "clientstation"
            ? "talk"
            : kind === "dancescrubclientcue"
              ? "play"
              : kind === "rockcreviceretreat"
                ? "sit"
                : kind === "bipedalwalktick"
                  ? "sit"
                  : kind === "whitebandflash"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "lysmatahush" ? "hold" : "go",
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

  function lysmatahushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function antennawaveadvertisePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.antennawaveadvertise));
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

  function dancescrubclientcuePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dancescrubclientcue));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "play" };
    }
    if (u < 0.78) {
      const bob = Math.sin(t * 2.2);
      return {
        x: fromX + face * bob * 0.12,
        lift: 2.6 + Math.abs(bob) * 1.3,
        rot: face * (10 + bob * 8),
        anim: "play",
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

  function clientstationPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clientstation));
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

  function bipedalwalktickPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bipedalwalktick));
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

  function rockcreviceretreatPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rockcreviceretreat));
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

  function whitebandflashPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.whitebandflash));
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
      trick.kind !== "antennawaveadvertise" &&
      trick.kind !== "dancescrubclientcue" &&
      trick.kind !== "rockcreviceretreat" &&
      trick.kind !== "bipedalwalktick" &&
      trick.kind !== "whitebandflash" &&
      trick.kind !== "clientstation"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "lysmatahush") {
      if (next.t < LYSMATAHUSH_HOLD) {
        const pose = lysmatahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LYSMATAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LYSMATAHUSH_HOLD);
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
    if (next.kind === "antennawaveadvertise") {
      const pose = antennawaveadvertisePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dancescrubclientcue") {
      const pose = dancescrubclientcuePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rockcreviceretreat") {
      const pose = rockcreviceretreatPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bipedalwalktick") {
      const pose = bipedalwalktickPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "whitebandflash") {
      const pose = whitebandflashPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = clientstationPose(next.t, fromX, trick.facing);
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
    LYSMATAHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    lysmatahushPose,
    releasePose,
    antennawaveadvertisePose,
    dancescrubclientcuePose,
    clientstationPose,
    bipedalwalktickPose,
    rockcreviceretreatPose,
    whitebandflashPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densscrubPose,
    inkscrubPose,
    denslysmataPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCleanerShrimpTricks = api;
})(typeof window !== "undefined" ? window : globalThis);