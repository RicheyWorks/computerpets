/** Gaze ground tricks while idle — ultra-polish pass. House neighborly Philippine Tarsier Carlito syrichta / Tarsius syrichta / Tarsiidae desk life (tarsier / Gaze) — eyeswivel / clingleap / insectpounce / stillstare / earfan / verticalcling / tarsiushush personality (eyeswivel huge-eye head swivel without naming swivel or gaze or stare alone as wait — distinct from Owl headturn and Hang headturnstare; clingleap vertical cling-leap without naming leap or cling or hop alone as wait — distinct from Sun hopgallop and Sail clingclimb; insectpounce insect-snatch pounce without naming pounce or snatch or strike alone as wait — distinct from Jumping spider pounce and Rob midsnatch; stillstare freeze-still stare without naming freeze or still or stare alone as wait — distinct from Deer freeze and Click clickfreeze; earfan membranous ear fan without naming ear or fan or listen alone as wait — distinct from Bat earchirp and Owl; verticalcling upright vertical cling without naming cling or vertical or perch alone as wait — distinct from Sail clingclimb and Hang hangsway; long tarsiushush Carlito/Tarsius hush hold (THE tarsiushush sit_hold tell) — never named wait or crouch or sit or gaze or still or tarsier or leap as bare ethogram-only trick kinds; Boom howler owns hyoidboom/tailbrace/canopylounge/leafchew/mantelstretch/throatpuff/alouattahush — do NOT reuse; Hang sloth owns headturnstare/hangsway — do NOT reuse; Owl barn_owl owns headturn — do NOT reuse; Jumping spider owns pounce — do NOT reuse; Deer owns freeze — do NOT reuse; guest slug Gaze / key tarsier only for wantsThankYou matching — accept "tarsier" and "gaze"; do NOT name a trick "tarsier" or "gaze" or "howler" or "boom" or "owl" or "sloth" or "hang" or "potto" or "still"; not Boom Alouatta life, not Hang Bradypus life, not Owl Tyto life, not Still Perodicticus life, not Rui. Eyeswivel / clingleap / insectpounce / stillstare / earfan / verticalcling / tarsiushush; densgaze / inkgaze / denstarsius thank-yous. Same map as web tarsier-tricks.ts. Window-play unchanged. Ethogram softs + freeze — never names gaze/leap/still/sit/wait/tarsier as bare ethogram-only trick kinds. True Philippine Tarsier Carlito/Tarsius syrichta desk life only — eye swivel, cling leap, insect pounce, still stare, ear fan, vertical cling, Tarsius hush. Next house-order ultra: Still / potto. No cry inventing — tarsier.wav EXISTS so prefersHouseCry adds tarsier after howler. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "tarsier";
  const TRICKS = ["eyeswivel", "clingleap", "insectpounce", "stillstare", "earfan", "verticalcling", "tarsiushush"];
  const HAPPY = ["densgaze", "inkgaze", "denstarsius"];

  const HAPPY_DUR = { densgaze: 1.70, inkgaze: 1.84, denstarsius: 1.76 };
  const TARSIUSHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    tarsiushush: TARSIUSHUSH_HOLD + RELEASE_S,
    eyeswivel: 2.48,
    clingleap: 2.42,
    insectpounce: 2.40,
    stillstare: 2.44,
    earfan: 2.38,
    verticalcling: 2.56,
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
    if (kind === "tarsiushush") return 40 + roll * 26;
    if (kind === "earfan" || kind === "eyeswivel" || kind === "stillstare") return 12.8 + roll * 9.4;
    if (kind === "insectpounce" || kind === "clingleap" || kind === "verticalcling") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tarsiushush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tarsiushush") {
      if (roll < 0.17) return "eyeswivel";
      if (roll < 0.33) return "clingleap";
      if (roll < 0.49) return "insectpounce";
      if (roll < 0.65) return "stillstare";
      if (roll < 0.83) return "earfan";
      return "verticalcling";
    }
    if (lastKind === "eyeswivel") {
      if (roll < 0.16) return "tarsiushush";
      if (roll < 0.32) return "clingleap";
      if (roll < 0.48) return "insectpounce";
      if (roll < 0.64) return "stillstare";
      if (roll < 0.82) return "earfan";
      return "verticalcling";
    }
    if (lastKind === "clingleap") {
      if (roll < 0.14) return "tarsiushush";
      if (roll < 0.3) return "eyeswivel";
      if (roll < 0.46) return "insectpounce";
      if (roll < 0.62) return "stillstare";
      if (roll < 0.8) return "earfan";
      return "verticalcling";
    }
    if (lastKind === "insectpounce") {
      if (roll < 0.15) return "tarsiushush";
      if (roll < 0.31) return "eyeswivel";
      if (roll < 0.47) return "clingleap";
      if (roll < 0.63) return "stillstare";
      if (roll < 0.81) return "earfan";
      return "verticalcling";
    }
    if (lastKind === "stillstare") {
      if (roll < 0.16) return "tarsiushush";
      if (roll < 0.32) return "eyeswivel";
      if (roll < 0.48) return "clingleap";
      if (roll < 0.64) return "insectpounce";
      if (roll < 0.82) return "earfan";
      return "verticalcling";
    }
    if (lastKind === "earfan") {
      if (roll < 0.15) return "tarsiushush";
      if (roll < 0.31) return "eyeswivel";
      if (roll < 0.47) return "clingleap";
      if (roll < 0.63) return "insectpounce";
      if (roll < 0.81) return "stillstare";
      return "verticalcling";
    }
    if (lastKind === "verticalcling") {
      if (roll < 0.16) return "tarsiushush";
      if (roll < 0.32) return "eyeswivel";
      if (roll < 0.48) return "clingleap";
      if (roll < 0.64) return "insectpounce";
      if (roll < 0.82) return "stillstare";
      return "earfan";
    }
    if (roll < 0.14) return "tarsiushush";
    if (roll < 0.28) return "eyeswivel";
    if (roll < 0.42) return "clingleap";
    if (roll < 0.56) return "insectpounce";
    if (roll < 0.7) return "stillstare";
    if (roll < 0.85) return "earfan";
    return "verticalcling";
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
    return key === TRICK_KEY || key === "gaze";
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
    const name = (HAPPY).includes(kind) ? (kind) : "densgaze";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "densgaze" ? "sit" : name === "inkgaze" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function densgazePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densgaze));
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

  function inkgazePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkgaze));
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

  function denstarsiusPose(t) {
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
    if (next.kind === "densgaze") {
      const pose = densgazePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkgaze") {
      const pose = inkgazePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denstarsiusPose(next.t);
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
      kind === "tarsiushush"
        ? "sit"
        : kind === "eyeswivel"
          ? "play"
          : kind === "verticalcling"
            ? "talk"
            : kind === "clingleap"
              ? "walk"
              : kind === "insectpounce"
                ? "sit"
                : kind === "stillstare"
                  ? "play"
                  : kind === "earfan"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "tarsiushush" ? "hold" : "go",
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

  function tarsiushushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function eyeswivelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.eyeswivel));
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

  function clingleapPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clingleap));
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

  function verticalclingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.verticalcling));
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

  function stillstarePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stillstare));
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

  function insectpouncePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.insectpounce));
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

  function earfanPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.earfan));
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
      trick.kind !== "eyeswivel" &&
      trick.kind !== "clingleap" &&
      trick.kind !== "insectpounce" &&
      trick.kind !== "stillstare" &&
      trick.kind !== "earfan" &&
      trick.kind !== "verticalcling"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "tarsiushush") {
      if (next.t < TARSIUSHUSH_HOLD) {
        const pose = tarsiushushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TARSIUSHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TARSIUSHUSH_HOLD);
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
    if (next.kind === "eyeswivel") {
      const pose = eyeswivelPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "clingleap") {
      const pose = clingleapPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "insectpounce") {
      const pose = insectpouncePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stillstare") {
      const pose = stillstarePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "earfan") {
      const pose = earfanPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = verticalclingPose(next.t, fromX, trick.facing);
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
    TARSIUSHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tarsiushushPose,
    releasePose,
    eyeswivelPose,
    clingleapPose,
    verticalclingPose,
    stillstarePose,
    insectpouncePose,
    earfanPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    densgazePose,
    inkgazePose,
    denstarsiusPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetTarsierTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
