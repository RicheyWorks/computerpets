/** Hide ground tricks while idle — ultra-polish pass. House neighborly Nassau Grouper Epinephelus striatus / Epinephelinae / Perciformes grouper desk life (grouper / Hide) — cavernambushsettle / gulargulpinhale / colorpatternflush / slowcaudalhover / jawsnap / stripeband / epinephelushush personality (cavernambushsettle cavern ambush settle without naming cavern or ambush or settle alone as wait — reef-crevice ambush tell; gulargulpinhale gular gulp inhale without naming gular or gulp or inhale alone as wait — suction-feed tell (distinct from Veil gulpinginhalecue); colorpatternflush color-pattern flush without naming color or pattern or flush alone as wait — barred-pattern flush tell; slowcaudalhover slow caudal hover without naming caudal or hover alone as wait — station-keeping hover tell; jawsnap jaw-snap without naming jaw or snap alone as wait — predatory jaw cue tell (distinct from Lunge coverstrike); stripeband stripe-band without naming stripe or band alone as wait — vertical-bar flash tell (distinct from Lunge latline); epinephelushush Epinephelus hush hold (THE epinephelushush sit_hold tell) — never named wait or crouch or sit or still or grouper or hide as bare ethogram-only trick kinds; Soar eagle_ray owns wingsoarflapglide/cephaliclobesift/sanddigbury/leapbreachcue/spotflash/wingbank/aetobatushush — do NOT reuse; Veil lionfish owns gulpinginhalecue/pteroishush — do NOT reuse; Lunge bass owns coverstrike/bedfan/surboil/latline/salmoides — do NOT reuse; Gate giant_clam owns tridacnahush — do NOT reuse; Arc cyber_dragon comes next — do NOT start; guest slug Hide / key grouper only for wantsThankYou matching — accept "grouper" and "hide"; do NOT name a trick "grouper" or "hide" or "eagle_ray" or "soar" or "bass" or "lunge" or "lionfish" or "veil" or "cyber_dragon" or "arc"; not Soar Aetobatus life, not Veil Pterois life, not Lunge Micropterus life, not Gate Tridacna life, not Arc cyber_dragon life, not Rui. Cavernambushsettle / gulargulpinhale / colorpatternflush / slowcaudalhover / jawsnap / stripeband / epinephelushush; densgrouper / inkgrouper / densepinephelus thank-yous (not denshide — hide UI owns hide). Same map as web grouper-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names hide/gape/still/wait/grouper as bare ethogram-only trick kinds. True Nassau Grouper Epinephelus striatus desk life only — cavern ambush settle, gular gulp inhale, color-pattern flush, slow caudal hover, jaw snap, stripe band, Epinephelus hush. Next house-order ultra: Arc / cyber_dragon. No cry inventing — grouper.wav EXISTS so prefersHouseCry adds grouper after eagle_ray. Amplitudes raised toward Rui richness; denser waits/weights; EPINEPHELUSHUSH_HOLD=11.2 RELEASE_S=1.18 (not 34.76/2.61). Catalog 221. */
(function (root) {

  const TRICK_KEY = "grouper";
  const TRICKS = ["cavernambushsettle", "gulargulpinhale", "colorpatternflush", "slowcaudalhover", "jawsnap", "stripeband", "epinephelushush"];
  const HAPPY = ["densgrouper", "inkgrouper", "densepinephelus"];

  const HAPPY_DUR = { densgrouper: 1.70, inkgrouper: 1.84, densepinephelus: 1.76 };
  const EPINEPHELUSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    epinephelushush: EPINEPHELUSHUSH_HOLD + RELEASE_S,
    cavernambushsettle: 2.48,
    gulargulpinhale: 2.42,
    colorpatternflush: 2.40,
    slowcaudalhover: 2.44,
    jawsnap: 2.38,
    stripeband: 2.56,
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
    if (kind === "epinephelushush") return 40 + roll * 26;
    if (kind === "jawsnap" || kind === "cavernambushsettle" || kind === "stripeband") return 12.8 + roll * 9.4;
    if (kind === "colorpatternflush" || kind === "gulargulpinhale" || kind === "slowcaudalhover") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "epinephelushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "epinephelushush") {
      if (roll < 0.17) return "cavernambushsettle";
      if (roll < 0.33) return "gulargulpinhale";
      if (roll < 0.49) return "colorpatternflush";
      if (roll < 0.65) return "slowcaudalhover";
      if (roll < 0.83) return "jawsnap";
      return "stripeband";
    }
    if (lastKind === "cavernambushsettle") {
      if (roll < 0.16) return "epinephelushush";
      if (roll < 0.32) return "gulargulpinhale";
      if (roll < 0.48) return "colorpatternflush";
      if (roll < 0.64) return "slowcaudalhover";
      if (roll < 0.82) return "jawsnap";
      return "stripeband";
    }
    if (lastKind === "gulargulpinhale") {
      if (roll < 0.14) return "epinephelushush";
      if (roll < 0.3) return "cavernambushsettle";
      if (roll < 0.46) return "colorpatternflush";
      if (roll < 0.62) return "slowcaudalhover";
      if (roll < 0.8) return "jawsnap";
      return "stripeband";
    }
    if (lastKind === "colorpatternflush") {
      if (roll < 0.15) return "epinephelushush";
      if (roll < 0.31) return "cavernambushsettle";
      if (roll < 0.47) return "gulargulpinhale";
      if (roll < 0.63) return "slowcaudalhover";
      if (roll < 0.81) return "jawsnap";
      return "stripeband";
    }
    if (lastKind === "slowcaudalhover") {
      if (roll < 0.16) return "epinephelushush";
      if (roll < 0.32) return "cavernambushsettle";
      if (roll < 0.48) return "gulargulpinhale";
      if (roll < 0.64) return "colorpatternflush";
      if (roll < 0.82) return "jawsnap";
      return "stripeband";
    }
    if (lastKind === "jawsnap") {
      if (roll < 0.15) return "epinephelushush";
      if (roll < 0.31) return "cavernambushsettle";
      if (roll < 0.47) return "gulargulpinhale";
      if (roll < 0.63) return "colorpatternflush";
      if (roll < 0.81) return "slowcaudalhover";
      return "stripeband";
    }
    if (lastKind === "stripeband") {
      if (roll < 0.16) return "epinephelushush";
      if (roll < 0.32) return "cavernambushsettle";
      if (roll < 0.48) return "gulargulpinhale";
      if (roll < 0.64) return "colorpatternflush";
      if (roll < 0.82) return "slowcaudalhover";
      return "jawsnap";
    }
    if (roll < 0.14) return "epinephelushush";
    if (roll < 0.28) return "cavernambushsettle";
    if (roll < 0.42) return "gulargulpinhale";
    if (roll < 0.56) return "colorpatternflush";
    if (roll < 0.7) return "slowcaudalhover";
    if (roll < 0.85) return "jawsnap";
    return "stripeband";
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
    return key === TRICK_KEY || key === "hide";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densgrouper";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densgrouper" ? "sit" : name === "inkgrouper" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densgrouperPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgrouper));
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

  function inkgrouperPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgrouper));
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

  function densepinephelusPose(t) {
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
    if (next.kind === "densgrouper") {
      const pose = densgrouperPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkgrouper") {
      const pose = inkgrouperPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densepinephelusPose(next.t);
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
      kind === "epinephelushush"
        ? "sit"
        : kind === "cavernambushsettle"
          ? "sit"
          : kind === "stripeband"
            ? "talk"
            : kind === "gulargulpinhale"
              ? "play"
              : kind === "colorpatternflush"
                ? "sit"
                : kind === "slowcaudalhover"
                  ? "sit"
                  : kind === "jawsnap"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "epinephelushush" ? "hold" : "go",
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

  function epinephelushushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function cavernambushsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cavernambushsettle));
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

  function gulargulpinhalePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gulargulpinhale));
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

  function stripebandPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stripeband));
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

  function slowcaudalhoverPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.slowcaudalhover));
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

  function colorpatternflushPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.colorpatternflush));
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

  function jawsnapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.jawsnap));
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
      trick.kind !== "cavernambushsettle" &&
      trick.kind !== "gulargulpinhale" &&
      trick.kind !== "colorpatternflush" &&
      trick.kind !== "slowcaudalhover" &&
      trick.kind !== "jawsnap" &&
      trick.kind !== "stripeband"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "epinephelushush") {
      if (next.t < EPINEPHELUSHUSH_HOLD) {
        const pose = epinephelushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < EPINEPHELUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - EPINEPHELUSHUSH_HOLD);
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
    if (next.kind === "cavernambushsettle") {
      const pose = cavernambushsettlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gulargulpinhale") {
      const pose = gulargulpinhalePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "colorpatternflush") {
      const pose = colorpatternflushPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "slowcaudalhover") {
      const pose = slowcaudalhoverPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "jawsnap") {
      const pose = jawsnapPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = stripebandPose(next.t, fromX, trick.facing);
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
    EPINEPHELUSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    epinephelushushPose,
    releasePose,
    cavernambushsettlePose,
    gulargulpinhalePose,
    stripebandPose,
    slowcaudalhoverPose,
    colorpatternflushPose,
    jawsnapPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densgrouperPose,
    inkgrouperPose,
    densepinephelusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCleanerShrimpTricks = api;
})(typeof window !== "undefined" ? window : globalThis);