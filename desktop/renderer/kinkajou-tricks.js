/** Wrist ground tricks while idle — ultra-polish pass. House neighborly Potos flavus / Kinkajou desk life (kinkajou / Wrist) — pretailhang / nectarsip / wristrotate / nightscamper / honeylap / tailcoil / potoshush personality (pretailhang prehensile-tail hang without naming hang or tail or kinkajou alone as wait — distinct from Swing brachiate, Hang hangsway, and Opossum hang; nectarsip long-tongue nectar sip without naming sip or nectar or tongue alone as wait — distinct from Hummingbird hover and Cicada tymbal; wristrotate forearm wrist-rotate reach without naming wrist or rotate or reach alone as wait — distinct from Hang reachcrawl and Ferret barrel; nightscamper nocturnal scamper without naming scamper or night or run alone as wait — distinct from Sun hopgallop and Squirrel scurry; honeylap honey/fruit lap without naming honey or lap or lick alone as wait — distinct from Hang algaescratch and Ferret barrel; tailcoil prehensile tail-coil perch without naming coil or wrap or curl alone as wait — distinct from Sun ringtailcurl and Hang clawhook; long potoshush Potos flavus hush hold (THE potoshush sit_hold tell) — never named wait or crouch or sit or wrap or lick or still or kinkajou or wrist as bare ethogram-only trick kinds; Swing gibbon owns brachiate/whoopduet/bipedalstrut/hangreach/armhook/duetbow/hylobateshush — do NOT reuse; Sun lemur owns bellybask/ringtailcurl/hopgallop/scentmark/stinkfight/sunworship/lemurhush — do NOT reuse; Hang sloth owns hangsway/reachcrawl/algaescratch/headturnstare/clawhook/slowdrip/bradypushush — do NOT reuse; guest slug Wrist / key kinkajou only for wantsThankYou matching — accept "kinkajou" and "wrist"; do NOT name a trick "kinkajou" or "wrist" or "gibbon" or "swing" or "lemur" or "sun" or "sloth" or "hang"; not Swing Hylobates life, not Sun Lemur catta life, not Hang Choloepus life, not Sail colugo, not Rui. Pretailhang / nectarsip / wristrotate / nightscamper / honeylap / tailcoil / potoshush; denswrist / inkwrist / denspotos thank-yous. Same map as web kinkajou-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names wrap/lick/still/sit/wait/kinkajou as bare ethogram-only trick kinds. True Kinkajou Potos flavus desk life only — prehensile-tail hang, nectar sip, wrist-rotate, night scamper, honey lap, tail coil, Potos hush. Next house-order ultra: Sail / colugo. No cry inventing — kinkajou.wav EXISTS so prefersHouseCry adds kinkajou after gibbon. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "kinkajou";
  const TRICKS = ["pretailhang", "nectarsip", "wristrotate", "nightscamper", "honeylap", "tailcoil", "potoshush"];
  const HAPPY = ["denswrist", "inkwrist", "denspotos"];

  const HAPPY_DUR = { denswrist: 1.70, inkwrist: 1.84, denspotos: 1.76 };
  const POTOSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    potoshush: POTOSHUSH_HOLD + RELEASE_S,
    pretailhang: 2.48,
    nectarsip: 2.42,
    wristrotate: 2.40,
    nightscamper: 2.44,
    honeylap: 2.38,
    tailcoil: 2.56,
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
    if (kind === "potoshush") return 40 + roll * 26;
    if (kind === "honeylap" || kind === "pretailhang" || kind === "nightscamper") return 12.8 + roll * 9.4;
    if (kind === "wristrotate" || kind === "nectarsip" || kind === "tailcoil") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "potoshush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "potoshush") {
      if (roll < 0.17) return "pretailhang";
      if (roll < 0.33) return "nectarsip";
      if (roll < 0.49) return "wristrotate";
      if (roll < 0.65) return "nightscamper";
      if (roll < 0.83) return "honeylap";
      return "tailcoil";
    }
    if (lastKind === "pretailhang") {
      if (roll < 0.16) return "potoshush";
      if (roll < 0.32) return "nectarsip";
      if (roll < 0.48) return "wristrotate";
      if (roll < 0.64) return "nightscamper";
      if (roll < 0.82) return "honeylap";
      return "tailcoil";
    }
    if (lastKind === "nectarsip") {
      if (roll < 0.14) return "potoshush";
      if (roll < 0.3) return "pretailhang";
      if (roll < 0.46) return "wristrotate";
      if (roll < 0.62) return "nightscamper";
      if (roll < 0.8) return "honeylap";
      return "tailcoil";
    }
    if (lastKind === "wristrotate") {
      if (roll < 0.15) return "potoshush";
      if (roll < 0.31) return "pretailhang";
      if (roll < 0.47) return "nectarsip";
      if (roll < 0.63) return "nightscamper";
      if (roll < 0.81) return "honeylap";
      return "tailcoil";
    }
    if (lastKind === "nightscamper") {
      if (roll < 0.16) return "potoshush";
      if (roll < 0.32) return "pretailhang";
      if (roll < 0.48) return "nectarsip";
      if (roll < 0.64) return "wristrotate";
      if (roll < 0.82) return "honeylap";
      return "tailcoil";
    }
    if (lastKind === "honeylap") {
      if (roll < 0.15) return "potoshush";
      if (roll < 0.31) return "pretailhang";
      if (roll < 0.47) return "nectarsip";
      if (roll < 0.63) return "wristrotate";
      if (roll < 0.81) return "nightscamper";
      return "tailcoil";
    }
    if (lastKind === "tailcoil") {
      if (roll < 0.16) return "potoshush";
      if (roll < 0.32) return "pretailhang";
      if (roll < 0.48) return "nectarsip";
      if (roll < 0.64) return "wristrotate";
      if (roll < 0.82) return "nightscamper";
      return "honeylap";
    }
    if (roll < 0.14) return "potoshush";
    if (roll < 0.28) return "pretailhang";
    if (roll < 0.42) return "nectarsip";
    if (roll < 0.56) return "wristrotate";
    if (roll < 0.7) return "nightscamper";
    if (roll < 0.85) return "honeylap";
    return "tailcoil";
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
    return key === TRICK_KEY || key === "wrist";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denswrist";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denswrist" ? "sit" : name === "inkwrist" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denswristPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswrist));
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

  function inkwristPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwrist));
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

  function denspotosPose(t) {
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
    if (next.kind === "denswrist") {
      const pose = denswristPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkwrist") {
      const pose = inkwristPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denspotosPose(next.t);
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
      kind === "potoshush"
        ? "sit"
        : kind === "pretailhang"
          ? "play"
          : kind === "tailcoil"
            ? "talk"
            : kind === "nectarsip"
              ? "walk"
              : kind === "wristrotate"
                ? "sit"
                : kind === "nightscamper"
                  ? "play"
                  : kind === "honeylap"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "potoshush" ? "hold" : "go",
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

  function potoshushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function pretailhangPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pretailhang));
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

  function nectarsipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nectarsip));
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

  function tailcoilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tailcoil));
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

  function nightscamperPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nightscamper));
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

  function wristrotatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wristrotate));
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

  function honeylapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.honeylap));
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
      trick.kind !== "pretailhang" &&
      trick.kind !== "nectarsip" &&
      trick.kind !== "wristrotate" &&
      trick.kind !== "nightscamper" &&
      trick.kind !== "honeylap" &&
      trick.kind !== "tailcoil"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "potoshush") {
      if (next.t < POTOSHUSH_HOLD) {
        const pose = potoshushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < POTOSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - POTOSHUSH_HOLD);
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
    if (next.kind === "pretailhang") {
      const pose = pretailhangPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nectarsip") {
      const pose = nectarsipPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "wristrotate") {
      const pose = wristrotatePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nightscamper") {
      const pose = nightscamperPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "honeylap") {
      const pose = honeylapPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tailcoilPose(next.t, fromX, trick.facing);
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
    POTOSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    potoshushPose,
    releasePose,
    pretailhangPose,
    nectarsipPose,
    tailcoilPose,
    nightscamperPose,
    wristrotatePose,
    honeylapPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denswristPose,
    inkwristPose,
    denspotosPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetKinkajouTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
