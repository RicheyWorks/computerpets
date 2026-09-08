/** Soar ground tricks while idle. House neighborly Spotted Eagle Ray (Aetobatus narinari / Aetobatinae eagle ray) desk life -- wing-soar flap glide / cephalic lobe sift / sand dig bury / leap breach cue (desk-safe) / long aetobatus hush; NOT Gate giant clam (esp. not mantlecurtainpulse/siphonjetpuff/shellgapeclosegate/zooxanthellaesunbask/longtridacnahush); NOT Veil lionfish; NOT Tube sea cucumber; NOT Kite manta (esp. not wing/lobe/gyre/vault/span); NOT Hook soar (red_tail kettle/stoop); NOT window-play spots (idle ids stay off spots); NOT Rui; guest slug Soar / key eagle_ray -- accept eagle_ray and soar; Thank-yous denssoar / inksoar / densaetobatus. Sleep, hide, leave, rest, card, ribbon still win. Same map as web eagle_ray-tricks.ts. Next: Hide / grouper. Catalog 220. */
(function (root) {
  const TRICK_KEY = "eagle_ray";
  const TRICKS = ["wingsoarflapglide", "cephaliclobesift", "sanddigbury", "leapbreachcue", "longaetobatushush"];
  const HAPPY = ["denssoar", "inksoar", "densaetobatus"];
  const HAPPY_DUR = { denssoar: 2.93, inksoar: 2.86, densaetobatus: 2.79 };
  const LONGAETOBATUSHUSH_HOLD = 34.48;
  const RELEASE_S = 2.57;
  const DUR = { longaetobatushush: LONGAETOBATUSHUSH_HOLD + RELEASE_S, wingsoarflapglide: 5.84, cephaliclobesift: 5.61, sanddigbury: 5.68, leapbreachcue: 5.92 };

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
    if (kind === "longaetobatushush") return 211 + roll * 30;
    if (kind === "cephaliclobesift") return 26.2 + roll * 3.4;
    if (kind === "leapbreachcue") return 25.3 + roll * 3.2;
    if (kind === "wingsoarflapglide") return 24.6 + roll * 3.3;
    if (kind === "sanddigbury") return 25.8 + roll * 3.2;
    return justFinished ? 19.1 + roll * 3.2 : 14.3 + roll * 2.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "longaetobatushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "longaetobatushush") {
      if (roll < 0.26) return "cephaliclobesift";
      if (roll < 0.5) return "leapbreachcue";
      if (roll < 0.74) return "wingsoarflapglide";
      return "sanddigbury";
    }
    if (lastKind === "cephaliclobesift") {
      if (roll < 0.26) return "longaetobatushush";
      if (roll < 0.5) return "leapbreachcue";
      if (roll < 0.74) return "wingsoarflapglide";
      return "sanddigbury";
    }
    if (lastKind === "leapbreachcue") {
      if (roll < 0.22) return "longaetobatushush";
      if (roll < 0.44) return "cephaliclobesift";
      if (roll < 0.68) return "wingsoarflapglide";
      return "sanddigbury";
    }
    if (roll < 0.2) return "longaetobatushush";
    if (roll < 0.4) return "cephaliclobesift";
    if (roll < 0.6) return "leapbreachcue";
    if (roll < 0.8) return "wingsoarflapglide";
    return "sanddigbury";
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
    return key === TRICK_KEY || key === "soar";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denssoar";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denssoar" ? "sit" : name === "inksoar" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denssoarPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssoar));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0041, rot: s * -0.31, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.62);
      return { lift: 0.0041 + Math.abs(sway) * 0.0012, rot: -0.31 + sway * 0.22, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0041 * (1 - s), rot: -0.31 * (1 - s), anim: "idle" };
  }
  function inksoarPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksoar));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0045, rot: s * 0.35, anim: "play" };
    }
    if (u < 0.82) {
      const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.2);
      return { lift: 0.0045 + Math.abs(arc) * 0.0024, rot: 0.35 + arc * 0.34, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0045 * (1 - s), rot: 0.35 * (1 - s), anim: "idle" };
  }
  function densaetobatusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densaetobatus));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0014, rot: s * 0.21, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.12);
      return { lift: -0.0014 + Math.abs(hush) * 0.0010, rot: 0.21 + hush * 0.14, anim: "play" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: -0.0014 * (1 - s), rot: 0.21 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denssoar") {
      const pose = denssoarPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inksoar") {
      const pose = inksoarPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densaetobatusPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "longaetobatushush";
    const anim =
      k === "longaetobatushush"
        ? "sit"
        : k === "cephaliclobesift"
          ? "play"
          : k === "leapbreachcue"
            ? "sit"
            : k === "sanddigbury"
              ? "sit"
              : k === "wingsoarflapglide"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "longaetobatushush" ? "hold" : "go",
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

  function longaetobatushushPose(t) {
    const breath = Math.sin(t * 0.00031) + 0.0001 * Math.sin(t * 0.00104);
    const hush = Math.abs(Math.sin(t * 0.00017));
    return { lift: -0.00011 + hush * 0.00009, rot: 0.0008 + breath * 0.0014 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00011 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0022 * (1 - u) };
  }

  function cephaliclobesiftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cephaliclobesift));
    const face = facing == null ? 1 : facing;
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX + face * s * 0.00006, lift: s * -0.0058, rot: s * 0.14 * face, anim: "play" };
    }
    if (u < 0.7) {
      const gulp = Math.sin(((u - 0.2) / 0.5) * Math.PI * 2.5);
      return {
        x: fromX + face * (0.00006 + gulp * 0.00004),
        lift: -0.0058 + Math.abs(gulp) * 0.0018,
        rot: (0.14 + gulp * 0.09) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return { x: fromX + face * 0.00006 * (1 - s), lift: -0.0058 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" };
  }
  function leapbreachcuePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.leapbreachcue));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00012, lift: s * 0.0115, rot: s * -0.08 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const drift = Math.sin(((u - 0.18) / 0.64) * Math.PI * 1.7);
      return {
        x: fromX + face * (0.00012 + drift * 0.00022),
        lift: 0.0115 + Math.abs(drift) * 0.0022,
        rot: (-0.08 + drift * 0.11) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.00012 * (1 - s), lift: 0.0115 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" };
  }
  function wingsoarflapglidePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.wingsoarflapglide));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * -0.00003, lift: s * 0.0062, rot: s * 0.48 * face, anim: "sit" };
    }
    if (u < 0.86) {
      const fan = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.8);
      return {
        x: fromX + face * (-0.00003 + fan * 0.0001),
        lift: 0.0062 + Math.abs(fan) * 0.0041,
        rot: (0.48 + fan * 0.52) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return { x: fromX + face * -0.00003 * (1 - s), lift: 0.0062 * (1 - s), rot: 0.48 * (1 - s) * face, anim: "idle" };
  }
  function sanddigburyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sanddigbury));
    const face = facing == null ? 1 : facing;
    if (u < 0.3) {
      const s = smoothstep(u / 0.3);
      return { x: fromX + face * s * -0.00002, lift: s * -0.0074, rot: s * 0.04 * face, anim: "sit" };
    }
    if (u < 0.72) {
      const warn = Math.sin(((u - 0.3) / 0.42) * Math.PI);
      return {
        x: fromX + face * -0.00002,
        lift: -0.0074 + warn * 0.0009,
        rot: (0.04 + warn * 0.05) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * -0.00002 * (1 - s), lift: -0.0074 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "cephaliclobesift" && trick.kind !== "leapbreachcue" && trick.kind !== "wingsoarflapglide" && trick.kind !== "sanddigbury") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "longaetobatushush") {
      if (next.t < LONGAETOBATUSHUSH_HOLD) {
        const pose = longaetobatushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LONGAETOBATUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LONGAETOBATUSHUSH_HOLD);
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
    if (next.kind === "cephaliclobesift") {
      const pose = cephaliclobesiftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "leapbreachcue") {
      const pose = leapbreachcuePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "wingsoarflapglide") {
      const pose = wingsoarflapglidePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sanddigburyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    LONGAETOBATUSHUSH_HOLD,
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
    denssoarPose,
    inksoarPose,
    densaetobatusPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    longaetobatushushPose,
    releasePose,
    cephaliclobesiftPose,
    leapbreachcuePose,
    wingsoarflapglidePose,
    sanddigburyPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetEagleRayTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
