/** Snout ground tricks while idle. House neighborly Curculionidae / Curculio acorn weevil desk life -- rostrumdrill / acornroll / dropthanatosis / snoutwalk / curculiohush personality (rostrumdrill long-rostrum drill-probe into an imaginary acorn cup distinct from Auger rasp/carpenter_bee and Forceps cercithreat; acornroll desk acorn push-roll distinct from Cache nutbury and Mast seed; dropthanatosis drop-thanatosis freeze distinct from Armor conglobate/volvation; snoutwalk slow Curculio desk walk distinct from Forceps nightscuttle and Haste fleetlegs; long curculiohush Curculio weevil hush -- never named wait; NOT Forceps earwig; NOT Lace; NOT Jewel; NOT Auger; NOT Armor; NOT Seven; NOT Cache; guest slug Snout / key acorn_weevil -- accept acorn_weevil and snout; Thank-yous denssnout / inksnout / denscurculio. Sleep, hide, leave, rest, card, ribbon still win. Same map as web acorn_weevil-tricks.ts. Next: Click / click_beetle. Catalog 220. */
(function (root) {
  const TRICK_KEY = "acorn_weevil";
  const TRICKS = ["rostrumdrill", "acornroll", "dropthanatosis", "snoutwalk", "curculiohush"];
  const HAPPY = ["denssnout", "inksnout", "denscurculio"];
  const HAPPY_DUR = { denssnout: 2.52, inksnout: 2.64, denscurculio: 2.40 };
  const CURCULIOHUSH_HOLD = 29.20;
  const RELEASE_S = 2.12;
  const DUR = { curculiohush: CURCULIOHUSH_HOLD + RELEASE_S, rostrumdrill: 4.26, acornroll: 4.48, snoutwalk: 4.72, dropthanatosis: 4.12 };

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
    if (kind === "curculiohush") return 192 + roll * 18;
    if (kind === "rostrumdrill") return 21.4 + roll * 3.4;
    if (kind === "acornroll") return 23.6 + roll * 3.6;
    if (kind === "snoutwalk") return 26.0 + roll * 4.0;
    if (kind === "dropthanatosis") return 24.2 + roll * 3.5;
    return justFinished ? 18.2 + roll * 2.8 : 13.6 + roll * 2.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "curculiohush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "curculiohush") {
      if (roll < 0.26) return "rostrumdrill";
      if (roll < 0.5) return "acornroll";
      if (roll < 0.74) return "snoutwalk";
      return "dropthanatosis";
    }
    if (lastKind === "rostrumdrill") {
      if (roll < 0.26) return "curculiohush";
      if (roll < 0.5) return "acornroll";
      if (roll < 0.74) return "snoutwalk";
      return "dropthanatosis";
    }
    if (lastKind === "acornroll") {
      if (roll < 0.22) return "curculiohush";
      if (roll < 0.44) return "rostrumdrill";
      if (roll < 0.68) return "snoutwalk";
      return "dropthanatosis";
    }
    if (roll < 0.2) return "curculiohush";
    if (roll < 0.4) return "rostrumdrill";
    if (roll < 0.6) return "acornroll";
    if (roll < 0.8) return "snoutwalk";
    return "dropthanatosis";
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
    return key === TRICK_KEY || key === "snout";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denssnout";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denssnout" ? "sit" : name === "inksnout" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denssnoutPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denssnout));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0024, rot: s * 0.11, anim: "sit" };
    }
    if (u < 0.86) {
      const cerci = Math.sin(((u - 0.14) / 0.72) * Math.PI * 2.35);
      return { lift: -0.0024 + Math.abs(cerci) * 0.00135, rot: 0.11 + cerci * 0.16, anim: "sit" };
    }
    const s = (u - 0.86) / 0.14;
    return { lift: -0.0024 * (1 - s), rot: 0.11 * (1 - s), anim: "idle" };
  }
  function inksnoutPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inksnout));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0038, rot: s * -0.22, anim: "play" };
    }
    if (u < 0.84) {
      const pulse = Math.sin(((u - 0.12) / 0.72) * Math.PI * 3.05);
      return { lift: 0.0038 + Math.abs(pulse) * 0.00185, rot: -0.22 + pulse * 0.26, anim: "play" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0038 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function denscurculioPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscurculio));
    if (u < 0.13) {
      const s = u / 0.13;
      return { lift: s * 0.0016, rot: s * 0.14, anim: "play" };
    }
    if (u < 0.82) {
      const flash = Math.sin(((u - 0.13) / 0.69) * Math.PI * 2.15);
      return { lift: 0.0016 + Math.abs(flash) * 0.00112, rot: 0.14 + flash * 0.15, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0016 * (1 - s), rot: 0.14 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
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
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "curculiohush";
    const anim =
      k === "curculiohush"
        ? "sit"
        : k === "rostrumdrill"
          ? "play"
          : k === "acornroll"
            ? "play"
            : k === "dropthanatosis"
              ? "sit"
              : k === "snoutwalk"
                ? "walk"
                : "sit";
    return {
      kind: k,
      phase: k === "curculiohush" ? "hold" : "go",
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

  function curculiohushPose(t) {
    const breath = Math.sin(t * 0.00092) + 0.00034 * Math.sin(t * 0.0027);
    const hush = Math.abs(Math.sin(t * 0.00036));
    return { lift: -0.00022 + hush * 0.00006, rot: 0.006 + breath * 0.0024 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.006 * (1 - u) };
  }

  function rostrumdrillPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rostrumdrill));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + face * s * 0.00004, lift: s * -0.0018, rot: s * 0.38 * face, anim: "play" };
    }
    if (u < 0.55) {
      const threat = Math.sin((u - 0.12) / 0.43 * Math.PI * 3.4);
      return {
        x: fromX + face * (0.00004 + threat * 0.00012),
        lift: -0.0012 + Math.abs(threat) * 0.00055,
        rot: (0.32 + threat * 0.28) * face,
        anim: "play",
      };
    }
    if (u < 0.88) {
      const groom = Math.sin((u - 0.55) / 0.33 * Math.PI * 4.2);
      return {
        x: fromX + face * (0.00004 + groom * 0.00006),
        lift: -0.0006 + Math.abs(groom) * 0.0009,
        rot: (0.12 + groom * 0.14) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00004 * (1 - s), lift: -0.0003 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }

  function acornrollPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.acornroll));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00005, lift: s * 0.0036, rot: s * -0.18 * face, anim: "play" };
    }
    if (u < 0.72) {
      const fan = Math.sin((u - 0.14) / 0.58 * Math.PI);
      const shimmer = Math.sin(t * 8.4) * 0.012;
      return {
        x: fromX + face * (0.00005 + fan * 0.0001),
        lift: 0.0036 + fan * 0.0042 + Math.abs(shimmer) * 0.0004,
        rot: (-0.18 + fan * 0.42 + shimmer) * face,
        anim: "play",
      };
    }
    if (u < 0.88) {
      const s = smoothstep((u - 0.72) / 0.16);
      return { x: fromX + face * 0.00015, lift: 0.0078 - s * 0.0042, rot: (0.24 - s * 0.2) * face, anim: "play" };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00015 * (1 - s), lift: 0.0036 * (1 - s), rot: 0.04 * (1 - s) * face, anim: "idle" };
  }

  function snoutwalkPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snoutwalk));
    const face = facing == null ? 1 : facing;
    if (u < 0.10) {
      const s = smoothstep(u / 0.10);
      return { x: fromX + face * s * 0.0002, lift: s * 0.0007, rot: s * -0.08 * face, anim: "walk" };
    }
    if (u < 0.88) {
      const dash = (u - 0.10) / 0.78;
      const scuttle = Math.sin(dash * Math.PI * 6.4);
      const bob = Math.abs(Math.sin(dash * Math.PI * 5.1));
      return {
        x: fromX + face * (0.0002 + dash * 0.018 + scuttle * 0.00045),
        lift: 0.0007 + bob * 0.0011,
        rot: (-0.08 + scuttle * 0.12) * face,
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.0282 * (1 - s * 0.015), lift: 0.0007 * (1 - s), rot: -0.02 * (1 - s) * face, anim: "idle" };
  }

  function dropthanatosisPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dropthanatosis));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX + face * s * 0.00003, lift: s * -0.0042, rot: s * 0.08 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const guard = Math.sin((u - 0.16) / 0.68 * Math.PI * 1.8);
      const nest = Math.abs(Math.sin(t * 1.35));
      return {
        x: fromX + face * (0.00003 + guard * 0.00008),
        lift: -0.0042 - nest * 0.0002,
        rot: (0.08 + guard * 0.04) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX + face * 0.00003 * (1 - s), lift: -0.0042 * (1 - s), rot: 0.02 * (1 - s) * face, anim: "idle" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "rostrumdrill" && trick.kind !== "acornroll" && trick.kind !== "dropthanatosis" && trick.kind !== "snoutwalk") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
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
      return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    if (next.kind === "rostrumdrill") {
      const pose = rostrumdrillPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "acornroll") {
      const pose = acornrollPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "snoutwalk") {
      const pose = snoutwalkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dropthanatosisPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CURCULIOHUSH_HOLD,
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
    denssnoutPose,
    inksnoutPose,
    denscurculioPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    curculiohushPose,
    releasePose,
    rostrumdrillPose,
    acornrollPose,
    snoutwalkPose,
    dropthanatosisPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAcornWeevilTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
