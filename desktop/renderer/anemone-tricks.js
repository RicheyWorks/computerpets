/** Wreath ground tricks while idle. House neighborly magnificent sea anemone (Heteractis magnifica / Actiniaria) desk life -- oral-disk wreath sway / nematocyst tuck / pedal-disk walk creep / retract-into-column / long actinia hush; NOT Ridge brain_coral (esp. not polyptentaclewave); NOT Gum/Still; NOT jellyfish; NOT coral; NOT Rui; guest slug Wreath / key anemone -- accept anemone and wreath; Thank-yous denswreath / inkwreath / densactinia. Sleep, hide, leave, rest, card, ribbon still win. Same map as web anemone-tricks.ts. Next: Paint / clownfish. Catalog 220. */
(function (root) {
  const TRICK_KEY = "anemone";
  const TRICKS = ["oraldiskwreathsway", "nematocysttuck", "pedaldiskwalkcreep", "retractintocolumn", "actiniahush"];
  const HAPPY = ["denswreath", "inkwreath", "densactinia"];
  const HAPPY_DUR = { denswreath: 2.71, inkwreath: 2.88, densactinia: 2.69 };
  const ACTINIAHUSH_HOLD = 33.84;
  const RELEASE_S = 2.55;
  const DUR = { actiniahush: ACTINIAHUSH_HOLD + RELEASE_S, oraldiskwreathsway: 5.56, nematocysttuck: 5.22, pedaldiskwalkcreep: 5.72, retractintocolumn: 5.48 };

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
    if (kind === "actiniahush") return 214 + roll * 24;
    if (kind === "nematocysttuck") return 26.4 + roll * 3.2;
    if (kind === "retractintocolumn") return 25.1 + roll * 3.3;
    if (kind === "oraldiskwreathsway") return 24.8 + roll * 3.4;
    if (kind === "pedaldiskwalkcreep") return 26.0 + roll * 3.5;
    return justFinished ? 19.1 + roll * 3.0 : 14.2 + roll * 2.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "actiniahush";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "actiniahush") {
      if (roll < 0.26) return "nematocysttuck";
      if (roll < 0.5) return "retractintocolumn";
      if (roll < 0.74) return "oraldiskwreathsway";
      return "pedaldiskwalkcreep";
    }
    if (lastKind === "nematocysttuck") {
      if (roll < 0.26) return "actiniahush";
      if (roll < 0.5) return "retractintocolumn";
      if (roll < 0.74) return "oraldiskwreathsway";
      return "pedaldiskwalkcreep";
    }
    if (lastKind === "retractintocolumn") {
      if (roll < 0.22) return "actiniahush";
      if (roll < 0.44) return "nematocysttuck";
      if (roll < 0.68) return "oraldiskwreathsway";
      return "pedaldiskwalkcreep";
    }
    if (roll < 0.2) return "actiniahush";
    if (roll < 0.4) return "nematocysttuck";
    if (roll < 0.6) return "retractintocolumn";
    if (roll < 0.8) return "oraldiskwreathsway";
    return "pedaldiskwalkcreep";
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
    return key === TRICK_KEY || key === "wreath";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "denswreath";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "denswreath" ? "sit" : name === "inkwreath" ? "play" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function denswreathPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswreath));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.0034, rot: s * -0.22, anim: "sit" };
    }
    if (u < 0.84) {
      const sway = Math.sin(((u - 0.15) / 0.69) * Math.PI * 2.35);
      return { lift: 0.0034 + Math.abs(sway) * 0.0009, rot: -0.22 + sway * 0.16, anim: "sit" };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 0.0034 * (1 - s), rot: -0.22 * (1 - s), anim: "idle" };
  }
  function inkwreathPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwreath));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.0035, rot: s * 0.26, anim: "play" };
    }
    if (u < 0.82) {
      const arc = Math.sin(((u - 0.12) / 0.7) * Math.PI * 2.95);
      return { lift: 0.0035 + Math.abs(arc) * 0.0020, rot: 0.26 + arc * 0.28, anim: "play" };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 0.0035 * (1 - s), rot: 0.26 * (1 - s), anim: "idle" };
  }
  function densactiniaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densactinia));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * -0.0016, rot: s * 0.17, anim: "play" };
    }
    if (u < 0.83) {
      const hush = Math.sin(((u - 0.14) / 0.69) * Math.PI * 2.18);
      return { lift: -0.0016 + Math.abs(hush) * 0.0012, rot: 0.17 + hush * 0.16, anim: "play" };
    }
    const s = (u - 0.83) / 0.17;
    return { lift: -0.0016 * (1 - s), rot: 0.17 * (1 - s), anim: "idle" };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "denswreath") {
      const pose = denswreathPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "inkwreath") {
      const pose = inkwreathPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = densactiniaPose(next.t);
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
    const k = TRICKS.indexOf(kind) >= 0 ? kind : "actiniahush";
    const anim =
      k === "actiniahush"
        ? "sit"
        : k === "nematocysttuck"
          ? "play"
          : k === "retractintocolumn"
            ? "sit"
            : k === "pedaldiskwalkcreep"
              ? "sit"
              : k === "oraldiskwreathsway"
                ? "sit"
                : "sit";
    return {
      kind: k,
      phase: k === "actiniahush" ? "hold" : "go",
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

  function actiniahushPose(t) {
    const breath = Math.sin(t * 0.00037) + 0.00011 * Math.sin(t * 0.00105);
    const hush = Math.abs(Math.sin(t * 0.00021));
    return { lift: -0.00018 + hush * 0.00006, rot: 0.0014 + breath * 0.0011 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -0.00018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.0031 * (1 - u) };
  }

  function nematocysttuckPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nematocysttuck));
    const face = facing == null ? 1 : facing;
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX + face * s * -0.00004, lift: s * -0.0042, rot: s * 0.07 * face, anim: "play" };
    }
    if (u < 0.72) {
      const tuck = Math.sin(((u - 0.22) / 0.5) * Math.PI * 2.1);
      return {
        x: fromX + face * (-0.00004 + tuck * 0.00005),
        lift: -0.0042 + Math.abs(tuck) * 0.0008,
        rot: (0.07 + tuck * 0.05) * face,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { x: fromX + face * -0.00004 * (1 - s), lift: -0.0042 * (1 - s), rot: 0.07 * (1 - s) * face, anim: "idle" };
  }
  function retractintocolumnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.retractintocolumn));
    const face = facing == null ? 1 : facing;
    if (u < 0.3) {
      const s = smoothstep(u / 0.3);
      return { x: fromX + face * s * 0.00006, lift: s * -0.0074, rot: s * 0.03 * face, anim: "sit" };
    }
    if (u < 0.68) {
      const hold = Math.sin(((u - 0.3) / 0.38) * Math.PI);
      return {
        x: fromX + face * 0.00006,
        lift: -0.0074 + hold * 0.0005,
        rot: (0.03 + hold * 0.015) * face,
        anim: "sit",
      };
    }
    if (u < 0.9) {
      const c = smoothstep((u - 0.68) / 0.22);
      return {
        x: fromX + face * 0.00006 * (1 - c * 0.35),
        lift: -0.0074 * (1 - c) + 0.0018 * c,
        rot: (0.03 * (1 - c) + 0.06 * c) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return { x: fromX + face * 0.00004 * (1 - s), lift: 0.0018 * (1 - s), rot: 0.06 * (1 - s) * face, anim: "idle" };
  }
  function oraldiskwreathswayPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.oraldiskwreathsway));
    const face = facing == null ? 1 : facing;
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + face * s * 0.00009, lift: s * 0.0026, rot: s * 0.14 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const sway = Math.sin(((u - 0.14) / 0.74) * Math.PI * 2.85);
      return {
        x: fromX + face * (0.00009 + sway * 0.00022),
        lift: 0.0026 + Math.abs(sway) * 0.0019,
        rot: (0.14 + sway * 0.22) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX + face * 0.00009 * (1 - s), lift: 0.0026 * (1 - s), rot: 0.14 * (1 - s) * face, anim: "idle" };
  }
  function pedaldiskwalkcreepPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pedaldiskwalkcreep));
    const face = facing == null ? 1 : facing;
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + face * s * 0.00042, lift: s * 0.0009, rot: s * 0.05 * face, anim: "sit" };
    }
    if (u < 0.82) {
      const creep = Math.sin(((u - 0.18) / 0.64) * Math.PI * 1.8);
      return {
        x: fromX + face * (0.00042 + creep * 0.00028),
        lift: 0.0009 + Math.abs(creep) * 0.0007,
        rot: (0.05 + creep * 0.06) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return { x: fromX + face * 0.0007 * (1 - s * 0.3), lift: 0.0009 * (1 - s), rot: 0.05 * (1 - s) * face, anim: "idle" };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "nematocysttuck" && trick.kind !== "retractintocolumn" && trick.kind !== "oraldiskwreathsway" && trick.kind !== "pedaldiskwalkcreep") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "actiniahush") {
      if (next.t < ACTINIAHUSH_HOLD) {
        const pose = actiniahushPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ACTINIAHUSH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ACTINIAHUSH_HOLD);
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
    if (next.kind === "nematocysttuck") {
      const pose = nematocysttuckPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "retractintocolumn") {
      const pose = retractintocolumnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "oraldiskwreathsway") {
      const pose = oraldiskwreathswayPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pedaldiskwalkcreepPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ACTINIAHUSH_HOLD,
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
    denswreathPose,
    inkwreathPose,
    densactiniaPose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    actiniahushPose,
    releasePose,
    nematocysttuckPose,
    retractintocolumnPose,
    oraldiskwreathswayPose,
    pedaldiskwalkcreepPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAnemoneTricks = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
