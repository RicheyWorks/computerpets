/** Snout ground tricks while idle — ultra-polish pass. House neighborly Curculionidae / Curculio acorn weevil desk life (acorn_weevil / Snout) — rostrumdrill / acornroll / dropthanatosis / snoutwalk / elytraclamp / cupprobe / curculiohush personality; denssnout / inksnout / denscurculio thank-yous; accept acorn_weevil and snout; NOT Forceps earwig cercithreat/fanwing/nightscuttle/broodguard/tegminacurl/cerciwhip/forficulahush; NOT Armor conglobate/volvation; NOT Cache nutbury; NOT Auger rasp; NOT bare acorn_weevil/snout/click as trick kinds; ethogram softs + freeze; window-play unchanged; Same map as web acorn_weevil-tricks.ts. True Acorn Weevil Curculio Curculionidae desk life. Next house-order ultra: Click / click_beetle. acorn_weevil.wav EXISTS so prefersHouseCry adds acorn_weevil after earwig. Rui amplitudes; denser waits/weights. Catalog 221. */
(function (root) {

  const TRICK_KEY = "acorn_weevil";
  const TRICKS = ["rostrumdrill", "acornroll", "dropthanatosis", "snoutwalk", "elytraclamp", "cupprobe", "curculiohush"];
  const HAPPY = ["denssnout", "inksnout", "denscurculio"];

  const HAPPY_DUR = { denssnout: 1.70, inksnout: 1.84, denscurculio: 1.76 };
  const CURCULIOHUSH_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    curculiohush: CURCULIOHUSH_HOLD + RELEASE_S,
    rostrumdrill: 2.48,
    acornroll: 2.42,
    dropthanatosis: 2.40,
    snoutwalk: 2.44,
    elytraclamp: 2.38,
    cupprobe: 2.56,
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
    if (kind === "curculiohush") return 40 + roll * 26;
    if (kind === "elytraclamp" || kind === "rostrumdrill" || kind === "snoutwalk") return 12.8 + roll * 9.4;
    if (kind === "dropthanatosis" || kind === "acornroll" || kind === "cupprobe") return 11.6 + roll * 8.5;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

    function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "curculiohush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "curculiohush") {
      if (roll < 0.17) return "rostrumdrill";
      if (roll < 0.33) return "acornroll";
      if (roll < 0.49) return "dropthanatosis";
      if (roll < 0.65) return "snoutwalk";
      if (roll < 0.83) return "elytraclamp";
      return "cupprobe";
    }
    if (lastKind === "rostrumdrill") {
      if (roll < 0.16) return "curculiohush";
      if (roll < 0.32) return "acornroll";
      if (roll < 0.48) return "dropthanatosis";
      if (roll < 0.64) return "snoutwalk";
      if (roll < 0.82) return "elytraclamp";
      return "cupprobe";
    }
    if (lastKind === "acornroll") {
      if (roll < 0.14) return "curculiohush";
      if (roll < 0.3) return "rostrumdrill";
      if (roll < 0.46) return "dropthanatosis";
      if (roll < 0.62) return "snoutwalk";
      if (roll < 0.8) return "elytraclamp";
      return "cupprobe";
    }
    if (lastKind === "dropthanatosis") {
      if (roll < 0.15) return "curculiohush";
      if (roll < 0.31) return "rostrumdrill";
      if (roll < 0.47) return "acornroll";
      if (roll < 0.63) return "snoutwalk";
      if (roll < 0.81) return "elytraclamp";
      return "cupprobe";
    }
    if (lastKind === "snoutwalk") {
      if (roll < 0.16) return "curculiohush";
      if (roll < 0.32) return "rostrumdrill";
      if (roll < 0.48) return "acornroll";
      if (roll < 0.64) return "dropthanatosis";
      if (roll < 0.82) return "elytraclamp";
      return "cupprobe";
    }
    if (lastKind === "elytraclamp") {
      if (roll < 0.15) return "curculiohush";
      if (roll < 0.31) return "rostrumdrill";
      if (roll < 0.47) return "acornroll";
      if (roll < 0.63) return "dropthanatosis";
      if (roll < 0.81) return "snoutwalk";
      return "cupprobe";
    }
    if (lastKind === "cupprobe") {
      if (roll < 0.16) return "curculiohush";
      if (roll < 0.32) return "rostrumdrill";
      if (roll < 0.48) return "acornroll";
      if (roll < 0.64) return "dropthanatosis";
      if (roll < 0.82) return "snoutwalk";
      return "elytraclamp";
    }
    if (roll < 0.14) return "curculiohush";
    if (roll < 0.28) return "rostrumdrill";
    if (roll < 0.42) return "acornroll";
    if (roll < 0.56) return "dropthanatosis";
    if (roll < 0.7) return "snoutwalk";
    if (roll < 0.85) return "elytraclamp";
    return "cupprobe";
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
    return key === TRICK_KEY || key === "snout";
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
    const name = (HAPPY).includes(kind) ? (kind) : "denssnout";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: (name === "denssnout" ? "sit" : name === "inksnout" ? "play" : "play"),
      facing: (facing == null ? 1 : facing),
      fromX: x,
    };
  }

  function denssnoutPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssnout));
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

  function inksnoutPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksnout));
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

  function denscurculioPose(t) {
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
    if (next.kind === "denssnout") {
      const pose = denssnoutPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inksnout") {
      const pose = inksnoutPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = denscurculioPose(next.t);
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
      kind === "curculiohush"
        ? "sit"
        : kind === "rostrumdrill"
          ? "play"
          : kind === "cupprobe"
            ? "talk"
            : kind === "acornroll"
              ? "walk"
              : kind === "dropthanatosis"
                ? "sit"
                : kind === "snoutwalk"
                  ? "play"
                  : kind === "elytraclamp"
                    ? "walk"
                    : "sit";
    return {
      kind,
      phase: kind === "curculiohush" ? "hold" : "go",
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

  function curculiohushPose(t) {
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: -0.18 + Math.sin(t * 0.36) * 0.35,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
  }

  function rostrumdrillPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rostrumdrill));
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

  function acornrollPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.acornroll));
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

  function cupprobePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cupprobe));
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

  function snoutwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snoutwalk));
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

  function dropthanatosisPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dropthanatosis));
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

  function elytraclampPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.elytraclamp));
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
      trick.kind !== "rostrumdrill" &&
      trick.kind !== "acornroll" &&
      trick.kind !== "dropthanatosis" &&
      trick.kind !== "snoutwalk" &&
      trick.kind !== "elytraclamp" &&
      trick.kind !== "cupprobe"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "curculiohush") {
      if (next.t < CURCULIOHUSH_HOLD) {
        const pose = curculiohushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CURCULIOHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CURCULIOHUSH_HOLD);
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
    if (next.kind === "rostrumdrill") {
      const pose = rostrumdrillPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "acornroll") {
      const pose = acornrollPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dropthanatosis") {
      const pose = dropthanatosisPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "snoutwalk") {
      const pose = snoutwalkPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "elytraclamp") {
      const pose = elytraclampPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cupprobePose(next.t, fromX, trick.facing);
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
    CURCULIOHUSH_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    curculiohushPose,
    releasePose,
    rostrumdrillPose,
    acornrollPose,
    cupprobePose,
    snoutwalkPose,
    dropthanatosisPose,
    elytraclampPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    denssnoutPose,
    inksnoutPose,
    denscurculioPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAcornWeevilTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
