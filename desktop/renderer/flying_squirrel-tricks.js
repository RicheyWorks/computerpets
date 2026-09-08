/** Glide ground tricks while idle. House neighborly southern flying squirrel (Glaucomys volans / Sciuridae Pteromyini) desk life -- membranelaunch / softland / nestboxhuddle / nocturnalscurry / glaucomyshush personality (membranelaunch membrane-stretch launch distinct from Sail patagiumglide; softland soft desk land distinct from Sail clingclimb; nestboxhuddle nest-box huddle distinct from Sail headdownhang; nocturnalscurry night scurry distinct from Cache nutbury/branchleap and Sail leaffoldsettle; long glaucomyshush Glaucomys volans hush -- never named wait; NOT Sail colugo; NOT Cache squirrel; NOT Cape bat; NOT Wrist kinkajou; NOT Swing gibbon; NOT Hang sloth; guest slug Glide / key flying_squirrel -- accept flying_squirrel and glide; Thank-yous densglide / inkglide / densglaucomys. Sleep, hide, leave, rest, card, ribbon still win. Same map as web flying_squirrel-tricks.ts. Next: Boom / howler. Catalog 220. */
(function (root) {
  const TRICK_KEY = "flying_squirrel";
  const TRICKS = ["membranelaunch", "softland", "nestboxhuddle", "nocturnalscurry", "glaucomyshush"];
  const HAPPY = ["densglide", "inkglide", "densglaucomys"];
  const HAPPY_DUR = { densglide: 2.58, inkglide: 2.71, densglaucomys: 2.44 };
  const GLAUCOMYSHUSH_HOLD = 31.12;
  const RELEASE_S = 2.31;
  const DUR = { glaucomyshush: GLAUCOMYSHUSH_HOLD + RELEASE_S, membranelaunch: 5.36, softland: 5.08, nestboxhuddle: 5.22, nocturnalscurry: 4.96 };

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
    if (kind === "glaucomyshush") return 198 + roll * 21;
    if (kind === "membranelaunch") return 24.1 + roll * 3.6;
    if (kind === "softland") return 23.4 + roll * 3.3;
    if (kind === "nestboxhuddle") return 25.6 + roll * 3.5;
    if (kind === "nocturnalscurry") return 22.2 + roll * 3.4;
    return justFinished ? 18.6 + roll * 2.9 : 13.9 + roll * 2.5;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "glaucomyshush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "glaucomyshush") {
      if (roll < 0.26) return "membranelaunch";
      if (roll < 0.5) return "softland";
      if (roll < 0.74) return "nestboxhuddle";
      return "nocturnalscurry";
    }
    if (lastKind === "membranelaunch") {
      if (roll < 0.26) return "glaucomyshush";
      if (roll < 0.5) return "softland";
      if (roll < 0.74) return "nestboxhuddle";
      return "nocturnalscurry";
    }
    if (lastKind === "softland") {
      if (roll < 0.22) return "glaucomyshush";
      if (roll < 0.44) return "membranelaunch";
      if (roll < 0.68) return "nestboxhuddle";
      return "nocturnalscurry";
    }
    if (roll < 0.2) return "glaucomyshush";
    if (roll < 0.4) return "membranelaunch";
    if (roll < 0.6) return "softland";
    if (roll < 0.8) return "nestboxhuddle";
    return "nocturnalscurry";
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
    return key === TRICK_KEY || key === "glide";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "densglide";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "densglide" ? "sit" : name === "inkglide" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function densglidePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densglide));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0041, rot: s * -0.15, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.08);
      return { lift: 0.0041 + Math.abs(sway) * 0.0013, rot: -0.15 + sway * 0.16, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0041 * (1 - s), rot: -0.15 * (1 - s), anim: "idle" };
  }
  function inkglidePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkglide));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0033, rot: s * 0.24, anim: "play" };
    }
    if (u < 0.82) {
      const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 3.05);
      return { lift: 0.0033 + Math.abs(arc) * 0.0019, rot: 0.24 + arc * 0.26, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0033 * (1 - s), rot: 0.24 * (1 - s), anim: "idle" };
  }
  function densglaucomysPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densglaucomys));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0015, rot: s * 0.16, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.08);
      return { lift: -0.0015 + Math.abs(hush) * 0.0011, rot: 0.16 + hush * 0.15, anim: "play" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: -0.0015 * (1 - s), rot: 0.16 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "densglide") {
      const pose = densglidePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkglide") {
      const pose = inkglidePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densglaucomysPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "glaucomyshush";
    const anim =
      k === "glaucomyshush"
        ? "sit"
        : k === "membranelaunch"
          ? "play"
          : k === "softland"
            ? "play"
            : k === "nocturnalscurry"
              ? "walk"
              : k === "nestboxhuddle"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "glaucomyshush" ? "hold" : "go",
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

  function glaucomyshushPose(t) {
    const breath = Math.sin(t * 0.00061) + 0.00019 * Math.sin(t * 0.00172);
    const hush = Math.abs(Math.sin(t * 0.00031));
    return { lift: -0.00018 + hush * 0.00005, rot: 0.0024 + breath * 0.0016 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00017 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0038 * (1 - u) };
  }

  function membranelaunchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.membranelaunch));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.0004, lift: s * -0.0024, rot: s * 0.12 * face, anim: "play" };
    }
    if (u < 0.34) {
      const s = smoothstep((u - 0.16) / 0.18);
      return { x: fromX + face * (0.0004 + s * 0.0012), lift: -0.0024 + s * 0.0148, rot: (0.12 - s * 0.34) * face, anim: "play" };
    }
    if (u < 0.78) {
      const glide = (u - 0.34) / 0.44;
      const flap = Math.sin(glide * Math.PI * 1.85);
      return {
        x: fromX + face * (0.0016 + glide * 0.034),
        lift: 0.0124 - glide * 0.0055 + Math.abs(flap) * 0.0014,
        rot: (-0.22 + flap * 0.09) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return { x: fromX + face * (0.0356 - s * 0.0005), lift: 0.0069 * (1 - s), rot: -0.14 * (1 - s) * face, anim: "idle" };
  }
  function softlandPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.softland));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.0011, lift: 0.0095 - s * 0.0068, rot: s * -0.16 * face, anim: "play" };
    }
    if (u < 0.55) {
      const settle = (u - 0.18) / 0.37;
      const bounce = Math.sin(settle * Math.PI * 2.2) * (1 - settle);
      return {
        x: fromX + face * (0.0011 + settle * 0.0018),
        lift: 0.0027 + bounce * 0.0024,
        rot: (-0.16 + bounce * 0.12) * face,
        anim: "play",
      };
    }
    if (u < 0.82) {
      const hush = Math.sin(((u - 0.55) / 0.27) * Math.PI * 1.4);
      return {
        x: fromX + face * (0.0029 + Math.abs(hush) * 0.00035),
        lift: 0.0011 + Math.abs(hush) * 0.0007,
        rot: (-0.06 + hush * 0.08) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.0031 * (1 - s), lift: 0.0011 * (1 - s), rot: -0.06 * (1 - s) * face, anim: "idle" };
  }
  function nestboxhuddlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nestboxhuddle));
    const face = facing == null ? 1 : facing;
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX + face * s * 0.0007, lift: s * -0.0046, rot: s * 0.28 * face, anim: "sit" };
    }
    if (u < 0.76) {
      const huddle = Math.sin(((u - 0.2) / 0.56) * Math.PI * 1.65);
      return {
        x: fromX + face * (0.0007 + Math.abs(huddle) * 0.0004),
        lift: -0.0046 + Math.abs(huddle) * 0.0012,
        rot: (0.28 + huddle * 0.11) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return { x: fromX + face * 0.0008 * (1 - s), lift: -0.0046 * (1 - s), rot: 0.28 * (1 - s) * face, anim: "idle" };
  }
  function nocturnalscurryPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nocturnalscurry));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.0014, lift: s * 0.0028, rot: s * -0.1 * face, anim: "walk" };
    }
    if (u < 0.84) {
      const scurry = (u - 0.12) / 0.72;
      const dart = Math.sin(scurry * Math.PI * 5.6);
      return {
        x: fromX + face * (0.0014 + scurry * 0.022 + dart * 0.0011),
        lift: 0.0028 + Math.abs(dart) * 0.0022,
        rot: (-0.1 + dart * 0.16) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * (0.0234 - s * 0.0006), lift: 0.0028 * (1 - s), rot: -0.08 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "membranelaunch" && trick.kind !== "softland" && trick.kind !== "nestboxhuddle" && trick.kind !== "nocturnalscurry") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "glaucomyshush") {
      if (next.t < GLAUCOMYSHUSH_HOLD) {
        const pose = glaucomyshushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < GLAUCOMYSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GLAUCOMYSHUSH_HOLD);
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
    if (next.kind === "membranelaunch") {
      const pose = membranelaunchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "softland") {
      const pose = softlandPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nestboxhuddle") {
      const pose = nestboxhuddlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = nocturnalscurryPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    GLAUCOMYSHUSH_HOLD,
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
    densglidePose,
    inkglidePose,
    densglaucomysPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    glaucomyshushPose,
    releasePose,
    membranelaunchPose,
    softlandPose,
    nestboxhuddlePose,
    nocturnalscurryPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFlyingSquirrelTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
