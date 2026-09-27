/** Glide ground tricks while idle — ultra-polish pass. House neighborly Glaucomys volans / Southern Flying Squirrel desk life (flying_squirrel / Glide) — membranelaunch / softland / nestboxhuddle / nocturnalscurry / flapstretch / barksprint / glaucomyshush personality (membranelaunch membrane launch without naming glide or membrane or launch alone as wait — distinct from Sail patagiumglide and sugar glider; softland soft landing without naming land or soft or hop alone as wait — distinct from Sail clingclimb and Squirrel scurry; nestboxhuddle nest-box huddle without naming nest or box or huddle alone as wait — distinct from Cape and Wrist; nocturnalscurry nocturnal scurry without naming scurry or night or walk alone as wait — distinct from Squirrel scurry and Wrist nightscamper; flapstretch flap-membrane stretch without naming flap or stretch or wing alone as wait — distinct from Sail membranespread and Bat; barksprint bark sprint without naming bark or sprint or run alone as wait — distinct from Sail barkclamp and Squirrel; long glaucomyshush Glaucomys volans hush hold (THE glaucomyshush sit_hold tell) — never named wait or crouch or sit or glide or hop or still or flying_squirrel or glide as bare ethogram-only trick kinds; Sail colugo owns patagiumglide/clingclimb/headdownhang/leaffoldsettle/membranespread/barkclamp/galeopterushush — do NOT reuse; Wrist kinkajou owns pretailhang/nectarsip/wristrotate/nightscamper/honeylap/tailcoil/potoshush — do NOT reuse; Squirrel owns scurry and Cache dens — do NOT reuse bare scurry; guest slug Glide / key flying_squirrel only for wantsThankYou matching — accept "flying_squirrel" and "glide"; do NOT name a trick "flying_squirrel" or "glide" or "colugo" or "sail" or "squirrel" or "cache" or "howler" or "boom"; not Sail Galeopterus life, not Wrist Potos life, not Squirrel Sciurus life, not Boom Alouatta life, not Rui. Membranelaunch / softland / nestboxhuddle / nocturnalscurry / flapstretch / barksprint / glaucomyshush; densglide / inkglide / densglaucomys thank-yous. Same map as web flying_squirrel-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names glide/hop/still/sit/wait/flying_squirrel as bare ethogram-only trick kinds. True Southern Flying Squirrel Glaucomys volans desk life only — membrane launch, soft land, nest-box huddle, nocturnal scurry, flap stretch, bark sprint, Glaucomys hush. Next house-order ultra: Boom / howler. No cry inventing — flying_squirrel.wav EXISTS so prefersHouseCry adds flying_squirrel after colugo. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "flying_squirrel";
  const TRICKS = ["membranelaunch", "softland", "nestboxhuddle", "nocturnalscurry", "flapstretch", "barksprint", "glaucomyshush"];
  const HAPPY = ["densglide", "inkglide", "densglaucomys"];

  const HAPPY_DUR = { densglide: 1.70, inkglide: 1.84, densglaucomys: 1.76 };
  const GLAUCOMYSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    glaucomyshush: GLAUCOMYSHUSH_HOLD + RELEASE_S,
    membranelaunch: 2.48,
    softland: 2.42,
    nestboxhuddle: 2.40,
    nocturnalscurry: 2.44,
    flapstretch: 2.38,
    barksprint: 2.56,
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
    if (kind === "glaucomyshush") return 40 + roll * 26;
    if (kind === "flapstretch" || kind === "membranelaunch" || kind === "nocturnalscurry") return 12.8 + roll * 9.4;
    if (kind === "nestboxhuddle" || kind === "softland" || kind === "barksprint") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "glaucomyshush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "glaucomyshush") {
      if (roll < 0.17) return "membranelaunch";
      if (roll < 0.33) return "softland";
      if (roll < 0.49) return "nestboxhuddle";
      if (roll < 0.65) return "nocturnalscurry";
      if (roll < 0.83) return "flapstretch";
      return "barksprint";
    }
    if (lastKind === "membranelaunch") {
      if (roll < 0.16) return "glaucomyshush";
      if (roll < 0.32) return "softland";
      if (roll < 0.48) return "nestboxhuddle";
      if (roll < 0.64) return "nocturnalscurry";
      if (roll < 0.82) return "flapstretch";
      return "barksprint";
    }
    if (lastKind === "softland") {
      if (roll < 0.14) return "glaucomyshush";
      if (roll < 0.3) return "membranelaunch";
      if (roll < 0.46) return "nestboxhuddle";
      if (roll < 0.62) return "nocturnalscurry";
      if (roll < 0.8) return "flapstretch";
      return "barksprint";
    }
    if (lastKind === "nestboxhuddle") {
      if (roll < 0.15) return "glaucomyshush";
      if (roll < 0.31) return "membranelaunch";
      if (roll < 0.47) return "softland";
      if (roll < 0.63) return "nocturnalscurry";
      if (roll < 0.81) return "flapstretch";
      return "barksprint";
    }
    if (lastKind === "nocturnalscurry") {
      if (roll < 0.16) return "glaucomyshush";
      if (roll < 0.32) return "membranelaunch";
      if (roll < 0.48) return "softland";
      if (roll < 0.64) return "nestboxhuddle";
      if (roll < 0.82) return "flapstretch";
      return "barksprint";
    }
    if (lastKind === "flapstretch") {
      if (roll < 0.15) return "glaucomyshush";
      if (roll < 0.31) return "membranelaunch";
      if (roll < 0.47) return "softland";
      if (roll < 0.63) return "nestboxhuddle";
      if (roll < 0.81) return "nocturnalscurry";
      return "barksprint";
    }
    if (lastKind === "barksprint") {
      if (roll < 0.16) return "glaucomyshush";
      if (roll < 0.32) return "membranelaunch";
      if (roll < 0.48) return "softland";
      if (roll < 0.64) return "nestboxhuddle";
      if (roll < 0.82) return "nocturnalscurry";
      return "flapstretch";
    }
    if (roll < 0.14) return "glaucomyshush";
    if (roll < 0.28) return "membranelaunch";
    if (roll < 0.42) return "softland";
    if (roll < 0.56) return "nestboxhuddle";
    if (roll < 0.7) return "nocturnalscurry";
    if (roll < 0.85) return "flapstretch";
    return "barksprint";
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
    return key === TRICK_KEY || key === "glide";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densglide";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densglide" ? "sit" : name === "inkglide" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densglidePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densglide));
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

  function inkglidePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkglide));
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

  function densglaucomysPose(t) {
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
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "glaucomyshush"
        ? "sit"
        : kind === "membranelaunch"
          ? "play"
          : kind === "barksprint"
            ? "talk"
            : kind === "softland"
              ? "walk"
              : kind === "nestboxhuddle"
                ? "sit"
                : kind === "nocturnalscurry"
                  ? "play"
                  : kind === "flapstretch"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "glaucomyshush" ? "hold" : "go",
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

  function glaucomyshushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function membranelaunchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.membranelaunch));
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

  function softlandPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.softland));
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

  function barksprintPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.barksprint));
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

  function nocturnalscurryPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nocturnalscurry));
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

  function nestboxhuddlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nestboxhuddle));
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

  function flapstretchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.flapstretch));
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
      trick.kind !== "membranelaunch" &&
      trick.kind !== "softland" &&
      trick.kind !== "nestboxhuddle" &&
      trick.kind !== "nocturnalscurry" &&
      trick.kind !== "flapstretch" &&
      trick.kind !== "barksprint"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
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
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "membranelaunch") {
      const pose = membranelaunchPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "softland") {
      const pose = softlandPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nestboxhuddle") {
      const pose = nestboxhuddlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nocturnalscurry") {
      const pose = nocturnalscurryPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "flapstretch") {
      const pose = flapstretchPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = barksprintPose(next.t, fromX, trick.facing);
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
    GLAUCOMYSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    glaucomyshushPose,
    releasePose,
    membranelaunchPose,
    softlandPose,
    barksprintPose,
    nocturnalscurryPose,
    nestboxhuddlePose,
    flapstretchPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densglidePose,
    inkglidePose,
    densglaucomysPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFlyingSquirrelTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
