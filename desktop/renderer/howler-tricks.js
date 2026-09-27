/** Boom ground tricks while idle — ultra-polish pass. House neighborly Mantled Howler Alouatta palliata desk life (howler / Boom) — hyoidboom / tailbrace / canopylounge / leafchew / mantelstretch / throatpuff / alouattahush personality (hyoidboom hyoid boom roar-cue posture without naming boom or roar or howl alone as wait — distinct from Swing whoopduet and Crow; tailbrace prehensile-tail brace without naming brace or tail or wrap alone as wait — distinct from Sun ringtailcurl and Hang hangsway; canopylounge canopy lounge without naming lounge or canopy or sprawl alone as wait — distinct from Sun bellybask and Hang; leafchew leaf browse without naming chew or leaf or graze alone as wait — distinct from Grasshopper mandiblegraze and Deer; mantelstretch mantle fur stretch without naming stretch or mantle or fur alone as wait — distinct from Glide flapstretch and Sail membranespread; throatpuff throat-sac puff without naming puff or throat or sac alone as wait — distinct from Cicada tymbal and Swing whoopduet; long alouattahush Alouatta palliata hush hold (THE alouattahush sit_hold tell) — never named wait or crouch or sit or boom or still or howler or howl as bare ethogram-only trick kinds; Glide flying_squirrel owns membranelaunch/softland/nestboxhuddle/nocturnalscurry/flapstretch/barksprint/glaucomyshush — do NOT reuse; Swing gibbon owns whoopduet/brachiate/hylobateshush — do NOT reuse; Sun lemur owns lemurhush/ringtailcurl/bellybask — do NOT reuse; Hang sloth owns hangsway — do NOT reuse; Cicada owns tymbal — do NOT reuse; guest slug Boom / key howler only for wantsThankYou matching — accept "howler" and "boom"; do NOT name a trick "howler" or "boom" or "howl" or "gibbon" or "lemur" or "sloth" or "glide" or "flying_squirrel"; not Glide Glaucomys life, not Swing Hylobates life, not Sun Lemur life, not Hang Bradypus life, not Gaze Tarsius life, not Rui. Hyoidboom / tailbrace / canopylounge / leafchew / mantelstretch / throatpuff / alouattahush; densboom / inkboom / densalouatta thank-yous. Same map as web howler-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names boom/sit/still/wait/howler as bare ethogram-only trick kinds. True Mantled Howler Alouatta palliata desk life only — hyoid boom, tail brace, canopy lounge, leaf chew, mantle stretch, throat puff, Alouatta hush. Next house-order ultra: Gaze / tarsier. No cry inventing — howler.wav EXISTS so prefersHouseCry adds howler after flying_squirrel. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "howler";
  const TRICKS = ["hyoidboom", "tailbrace", "canopylounge", "leafchew", "mantelstretch", "throatpuff", "alouattahush"];
  const HAPPY = ["densboom", "inkboom", "densalouatta"];

  const HAPPY_DUR = { densboom: 1.70, inkboom: 1.84, densalouatta: 1.76 };
  const ALOUATTAHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    alouattahush: ALOUATTAHUSH_HOLD + RELEASE_S,
    hyoidboom: 2.48,
    tailbrace: 2.42,
    canopylounge: 2.40,
    leafchew: 2.44,
    mantelstretch: 2.38,
    throatpuff: 2.56,
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
    if (kind === "alouattahush") return 40 + roll * 26;
    if (kind === "mantelstretch" || kind === "hyoidboom" || kind === "leafchew") return 12.8 + roll * 9.4;
    if (kind === "canopylounge" || kind === "tailbrace" || kind === "throatpuff") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "alouattahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "alouattahush") {
      if (roll < 0.17) return "hyoidboom";
      if (roll < 0.33) return "tailbrace";
      if (roll < 0.49) return "canopylounge";
      if (roll < 0.65) return "leafchew";
      if (roll < 0.83) return "mantelstretch";
      return "throatpuff";
    }
    if (lastKind === "hyoidboom") {
      if (roll < 0.16) return "alouattahush";
      if (roll < 0.32) return "tailbrace";
      if (roll < 0.48) return "canopylounge";
      if (roll < 0.64) return "leafchew";
      if (roll < 0.82) return "mantelstretch";
      return "throatpuff";
    }
    if (lastKind === "tailbrace") {
      if (roll < 0.14) return "alouattahush";
      if (roll < 0.3) return "hyoidboom";
      if (roll < 0.46) return "canopylounge";
      if (roll < 0.62) return "leafchew";
      if (roll < 0.8) return "mantelstretch";
      return "throatpuff";
    }
    if (lastKind === "canopylounge") {
      if (roll < 0.15) return "alouattahush";
      if (roll < 0.31) return "hyoidboom";
      if (roll < 0.47) return "tailbrace";
      if (roll < 0.63) return "leafchew";
      if (roll < 0.81) return "mantelstretch";
      return "throatpuff";
    }
    if (lastKind === "leafchew") {
      if (roll < 0.16) return "alouattahush";
      if (roll < 0.32) return "hyoidboom";
      if (roll < 0.48) return "tailbrace";
      if (roll < 0.64) return "canopylounge";
      if (roll < 0.82) return "mantelstretch";
      return "throatpuff";
    }
    if (lastKind === "mantelstretch") {
      if (roll < 0.15) return "alouattahush";
      if (roll < 0.31) return "hyoidboom";
      if (roll < 0.47) return "tailbrace";
      if (roll < 0.63) return "canopylounge";
      if (roll < 0.81) return "leafchew";
      return "throatpuff";
    }
    if (lastKind === "throatpuff") {
      if (roll < 0.16) return "alouattahush";
      if (roll < 0.32) return "hyoidboom";
      if (roll < 0.48) return "tailbrace";
      if (roll < 0.64) return "canopylounge";
      if (roll < 0.82) return "leafchew";
      return "mantelstretch";
    }
    if (roll < 0.14) return "alouattahush";
    if (roll < 0.28) return "hyoidboom";
    if (roll < 0.42) return "tailbrace";
    if (roll < 0.56) return "canopylounge";
    if (roll < 0.7) return "leafchew";
    if (roll < 0.85) return "mantelstretch";
    return "throatpuff";
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
    return key === TRICK_KEY || key === "boom";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densboom";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densboom" ? "sit" : name === "inkboom" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densboomPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densboom));
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

  function inkboomPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkboom));
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

  function densalouattaPose(t) {
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
    if (next.kind === "densboom") {
      const pose = densboomPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkboom") {
      const pose = inkboomPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densalouattaPose(next.t);
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
      kind === "alouattahush"
        ? "sit"
        : kind === "hyoidboom"
          ? "play"
          : kind === "throatpuff"
            ? "talk"
            : kind === "tailbrace"
              ? "walk"
              : kind === "canopylounge"
                ? "sit"
                : kind === "leafchew"
                  ? "play"
                  : kind === "mantelstretch"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "alouattahush" ? "hold" : "go",
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

  function alouattahushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function hyoidboomPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hyoidboom));
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

  function tailbracePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tailbrace));
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

  function throatpuffPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.throatpuff));
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

  function leafchewPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.leafchew));
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

  function canopyloungePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.canopylounge));
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

  function mantelstretchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mantelstretch));
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
      trick.kind !== "hyoidboom" &&
      trick.kind !== "tailbrace" &&
      trick.kind !== "canopylounge" &&
      trick.kind !== "leafchew" &&
      trick.kind !== "mantelstretch" &&
      trick.kind !== "throatpuff"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "alouattahush") {
      if (next.t < ALOUATTAHUSH_HOLD) {
        const pose = alouattahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ALOUATTAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ALOUATTAHUSH_HOLD);
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
    if (next.kind === "hyoidboom") {
      const pose = hyoidboomPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tailbrace") {
      const pose = tailbracePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "canopylounge") {
      const pose = canopyloungePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "leafchew") {
      const pose = leafchewPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mantelstretch") {
      const pose = mantelstretchPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = throatpuffPose(next.t, fromX, trick.facing);
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
    ALOUATTAHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    alouattahushPose,
    releasePose,
    hyoidboomPose,
    tailbracePose,
    throatpuffPose,
    leafchewPose,
    canopyloungePose,
    mantelstretchPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densboomPose,
    inkboomPose,
    densalouattaPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHowlerTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
