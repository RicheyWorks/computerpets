/** Hide ground tricks while idle. House neighborly Nassau Grouper (Epinephelus striatus / Epinephelinae grouper) desk life -- cavern ambush settle / gular gulp inhale / color-pattern flush / slow caudal hover / long epinephelus hush; NOT Soar eagle ray (esp. not wingsoarflapglide/cephaliclobesift/sanddigbury/leapbreachcue/longaetobatushush); NOT Gate giant clam; NOT Veil lionfish; NOT Lunge bass (esp. not coverstrike/bedfan/surboil/latline/salmoides); NOT window-play holes (idle ids stay off holes/hide as trick id); NOT Rui; guest slug Hide / key grouper -- accept grouper and hide; Thank-yous densgrouper / inkgrouper / densepinephelus (not denshide — hide UI owns hide). Sleep, hide, leave, rest, card, ribbon still win. Same map as web grouper-tricks.ts. Next: Arc / cyber_dragon. Catalog 220. */
(function (root) {
  const TRICK_KEY = "grouper";
  const TRICKS = ["cavernambushsettle", "gulargulpinhale", "colorpatternflush", "slowcaudalhover", "longepinephelushush"];
  const HAPPY = ["densgrouper", "inkgrouper", "densepinephelus"];
  const HAPPY_DUR = { densgrouper: 2.97, inkgrouper: 2.91, densepinephelus: 2.84 };
  const LONGEPINEPHELUSHUSH_HOLD = 34.76;
  const RELEASE_S = 2.61;
  const DUR = { longepinephelushush: LONGEPINEPHELUSHUSH_HOLD + RELEASE_S, cavernambushsettle: 5.97, gulargulpinhale: 5.73, colorpatternflush: 5.79, slowcaudalhover: 5.88 };

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
    if (kind === "longepinephelushush") return 214 + roll * 31;
    if (kind === "gulargulpinhale") return 26.6 + roll * 3.5;
    if (kind === "slowcaudalhover") return 25.7 + roll * 3.3;
    if (kind === "cavernambushsettle") return 25.1 + roll * 3.4;
    if (kind === "colorpatternflush") return 26.1 + roll * 3.1;
    return justFinished ? 19.1 + roll * 3.2 : 14.3 + roll * 2.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longepinephelushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longepinephelushush") {
      if (roll < 0.26) return "gulargulpinhale";
      if (roll < 0.5) return "slowcaudalhover";
      if (roll < 0.74) return "cavernambushsettle";
      return "colorpatternflush";
    }
    if (lastKind === "gulargulpinhale") {
      if (roll < 0.26) return "longepinephelushush";
      if (roll < 0.5) return "slowcaudalhover";
      if (roll < 0.74) return "cavernambushsettle";
      return "colorpatternflush";
    }
    if (lastKind === "slowcaudalhover") {
      if (roll < 0.22) return "longepinephelushush";
      if (roll < 0.44) return "gulargulpinhale";
      if (roll < 0.68) return "cavernambushsettle";
      return "colorpatternflush";
    }
    if (roll < 0.2) return "longepinephelushush";
    if (roll < 0.4) return "gulargulpinhale";
    if (roll < 0.6) return "slowcaudalhover";
    if (roll < 0.8) return "cavernambushsettle";
    return "colorpatternflush";
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
    return key === TRICK_KEY || key === "hide";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densgrouper";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densgrouper" ? "sit" : name === "inkgrouper" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }


  function densgrouperPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgrouper));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0044, rot: s * -0.28, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.48);
      return { lift: 0.0044 + Math.abs(sway) * 0.0013, rot: -0.28 + sway * 0.2, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0044 * (1 - s), rot: -0.28 * (1 - s), anim: "idle" };
  }
  function inkgrouperPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgrouper));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0051, rot: s * 0.34, anim: "play" };
    }
    if (u < 0.86) {
      const bob = Math.sin(((u - 0.12) / 0.74) * Math.PI * 2.1);
      return { lift: 0.0051 + Math.abs(bob) * 0.0016, rot: 0.34 + bob * 0.18, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0051 * (1 - s), rot: 0.34 * (1 - s), anim: "idle" };
  }
  function densepinephelusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densepinephelus));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.0038, rot: s * -0.19, anim: "play" };
    }
    if (u < 0.86) {
      const hush = Math.sin(((u - 0.14) / 0.72) * Math.PI * 1.8);
      return { lift: 0.0038 + Math.abs(hush) * 0.0011, rot: -0.19 + hush * 0.14, anim: "play" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: 0.0038 * (1 - s), rot: -0.19 * (1 - s), anim: "idle" };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
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
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longepinephelushush";
    const anim =
      k === "longepinephelushush"
        ? "sit"
        : k === "gulargulpinhale"
          ? "play"
          : k === "slowcaudalhover"
            ? "sit"
            : k === "colorpatternflush"
              ? "sit"
              : k === "cavernambushsettle"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "longepinephelushush" ? "hold" : "go",
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


  function longepinephelushushPose(t) {
    const breath = Math.sin(t * 0.00029) + 0.00012 * Math.sin(t * 0.00097);
    const hush = Math.abs(Math.sin(t * 0.00019));
    return { lift: -0.00013 + hush * 0.00011, rot: 0.0007 + breath * 0.0016 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0024 * (1 - u) };
  }

  function gulargulpinhalePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gulargulpinhale));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00005, lift: s * -0.0064, rot: s * 0.11 * face, anim: "play" };
    }
    if (u < 0.72) {
      const gulp = Math.sin(((u - 0.18) / 0.54) * Math.PI * 2.7);
      return {
        x: fromX + face * (0.00005 + gulp * 0.000035),
        lift: -0.0064 + Math.abs(gulp) * 0.0021,
        rot: (0.11 + gulp * 0.1) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * 0.00005 * (1 - s), lift: -0.0064 * (1 - s), rot: 0.11 * (1 - s) * face, anim: "idle" };
  }
  function slowcaudalhoverPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.slowcaudalhover));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00009, lift: s * 0.0048, rot: s * -0.06 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const drift = Math.sin(((u - 0.16) / 0.68) * Math.PI * 1.9);
      return {
        x: fromX + face * (0.00009 + drift * 0.00018),
        lift: 0.0048 + Math.abs(drift) * 0.0016,
        rot: (-0.06 + drift * 0.09) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00009 * (1 - s), lift: 0.0048 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" };
  }
  function cavernambushsettlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cavernambushsettle));
    const face = facing == null ? 1 : facing;
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX + face * s * -0.00004, lift: s * -0.0082, rot: s * 0.06 * face, anim: "sit" };
    }
    if (u < 0.78) {
      const settle = Math.sin(((u - 0.22) / 0.56) * Math.PI * 1.4);
      return {
        x: fromX + face * (-0.00004 + settle * 0.00003),
        lift: -0.0082 + Math.abs(settle) * 0.0007,
        rot: (0.06 + settle * 0.04) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * -0.00004 * (1 - s), lift: -0.0082 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" };
  }
  function colorpatternflushPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.colorpatternflush));
    const face = facing == null ? 1 : facing;
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX + face * s * 0.00003, lift: s * 0.0036, rot: s * 0.22 * face, anim: "sit" };
    }
    if (u < 0.8) {
      const flush = Math.sin(((u - 0.2) / 0.6) * Math.PI * 2.4);
      return {
        x: fromX + face * (0.00003 + flush * 0.00008),
        lift: 0.0036 + Math.abs(flush) * 0.0028,
        rot: (0.22 + flush * 0.28) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return { x: fromX + face * 0.00003 * (1 - s), lift: 0.0036 * (1 - s), rot: 0.22 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "gulargulpinhale" && trick.kind !== "slowcaudalhover" && trick.kind !== "cavernambushsettle" && trick.kind !== "colorpatternflush") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longepinephelushush") {
      if (next.t < LONGEPINEPHELUSHUSH_HOLD) {
        const pose = longepinephelushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGEPINEPHELUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGEPINEPHELUSHUSH_HOLD);
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
    if (next.kind === "gulargulpinhale") {
      const pose = gulargulpinhalePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "slowcaudalhover") {
      const pose = slowcaudalhoverPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cavernambushsettle") {
      const pose = cavernambushsettlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = colorpatternflushPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGEPINEPHELUSHUSH_HOLD,
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
    densgrouperPose,
    inkgrouperPose,
    densepinephelusPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longepinephelushushPose,
    releasePose,
    gulargulpinhalePose,
    slowcaudalhoverPose,
    cavernambushsettlePose,
    colorpatternflushPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGrouperTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
