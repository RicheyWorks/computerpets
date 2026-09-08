/** Miso ground tricks while idle — ultra-polish pass. House cat — loaf / knead / stretch / wash / pounce / bunting / mlem personality. Window-play LEDGE unchanged. Amplitudes raised toward Rui richness; denser timing; house cry preferred (`cat.wav`). Thank-yous purr / blink / chirp. Same map as web `cat-tricks.ts`. SCRATCH_KEYS owns paw-scratch — never names a trick `scratch`. Next ultra Pip / dog. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "cat";
  const TRICKS = ["loaf", "knead", "stretch", "wash", "pounce", "bunting", "mlem"];
  const HAPPY = ["purr", "blink", "chirp"];
  const HAPPY_DUR = { purr: 1.58, blink: 1.66, chirp: 1.72 };
  const LOAF_HOLD = 14.4;
  const RELEASE_S = 1.02;
  const DUR = {
    loaf: LOAF_HOLD + RELEASE_S,
    knead: 2.22,
    stretch: 2.28,
    wash: 2.2,
    pounce: 1.85,
    bunting: 2.1,
    mlem: 1.95,
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
    if (kind === "loaf") return 42 + roll * 28;
    if (kind === "pounce") return 12 + roll * 9;
    if (kind === "bunting" || kind === "mlem") return 11 + roll * 8;
    if (kind === "knead" || kind === "wash") return 11 + roll * 8;
    if (kind === "stretch") return 10 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "loaf";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter(function (k) { return k !== lastKind; });
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map(function (k) {
      return k === "loaf" ? 0.55 : k === "knead" || k === "wash" || k === "bunting" ? 1.15 : 1;
    });
    var total = 0;
    for (var i = 0; i < weights.length; i++) total += weights[i];
    var r = roll * total;
    for (var j = 0; j < list.length; j++) {
      r -= weights[j];
      if (r <= 0) return list[j];
    }
    return list[list.length - 1] || "knead";
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
    return key === TRICK_KEY || key === "miso";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter(function (k) { return k !== lastKind; });
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "purr";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "blink" ? "sit" : name === "purr" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function purrPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.purr));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 4.5, rot: s * 12, dx: 0, anim: "talk" };
    }
    if (u < 0.85) {
      const buzz = Math.sin(t * 18) + 0.2 * Math.sin(t * 28);
      return { lift: 4.5 + Math.abs(buzz) * 3.2, rot: 10 + buzz * 9, dx: buzz * 0.8, anim: "talk" };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: 4.5 * (1 - s), rot: Math.sin(s * Math.PI) * 4, dx: 0, anim: "sit" };
  }

  function blinkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blink));
    if (u < 0.28) {
      const s = u / 0.28;
      return { lift: -s * 5.5, rot: s * 14, dx: 0, anim: "sit" };
    }
    if (u < 0.72) {
      const soft = Math.sin(t * 6);
      return { lift: -5.5 + soft * 1.2, rot: 14 + soft * 4, dx: 0, anim: "sit" };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: -5.5 * (1 - s), rot: 14 * (1 - s), dx: 0, anim: "sit" };
  }

  function chirpPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chirp));
    return {
      lift: Math.sin(u * Math.PI) * 12,
      rot: Math.sin(u * Math.PI * 2) * 14,
      dx: Math.sin(u * Math.PI) * 3.5,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "purr") {
      const pose = purrPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "blink") {
      const pose = blinkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = chirpPose(next.t);
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
    const name = TRICKS.indexOf(kind) >= 0 ? kind : "loaf";
    const anim =
      name === "loaf" || name === "knead" || name === "wash" || name === "stretch" || name === "bunting" || name === "mlem"
        ? "sit"
        : name === "pounce"
          ? "play"
          : "sit";
    return {
      kind: name,
      phase: name === "loaf" ? "hold" : "go",
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

  function loafPose(t) {
    const soft = Math.sin(t * 1.7);
    const breath = Math.sin(t * 2.8);
    return {
      lift: -4.6 + soft * 1.6 + Math.abs(breath) * 1.1,
      rot: 14 + breath * 6 + Math.sin(t * 5.1) * 4,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return {
      lift: -4.6 * (1 - Math.sin(u * Math.PI * 0.5)) + Math.sin(u * Math.PI) * 6,
      rot: 14 * (1 - u) + Math.sin(u * Math.PI) * 8,
    };
  }

  function kneadPose(t) {
    const press = Math.abs(Math.sin(t * 10));
    return { lift: -1.2 + press * 10.5, rot: Math.sin(t * 9) * 16, dx: 0, anim: "sit" };
  }

  function stretchPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.stretch));
    if (u < 0.28) {
      const s = smoothstep(u / 0.28);
      return { lift: -s * 4, rot: -s * 18, dx: s * 4, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.28) / 0.44;
      return { lift: -4 + Math.sin(s * Math.PI) * 5, rot: -18 + Math.sin(s * Math.PI) * 8, dx: 4, anim: "sit" };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { lift: -4 * (1 - s), rot: -18 * (1 - s), dx: 4 * (1 - s), anim: "sit" };
  }

  function washPose(t) {
    return { lift: -1.5 + Math.abs(Math.sin(t * 8)) * 5.5, rot: Math.sin(t * 11) * 20, dx: 0, anim: "sit" };
  }

  function pouncePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pounce));
    const face = facing == null ? 1 : facing;
    if (u < 0.24) {
      const s = smoothstep(u / 0.24);
      return { x: fromX, lift: -s * 6, rot: s * 12, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.24) / 0.46;
      return {
        x: fromX + face * 28 * smoothstep(s),
        lift: Math.sin(s * Math.PI) * 18,
        rot: Math.sin(s * Math.PI) * -14,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return { x: fromX + face * 28, lift: 3 * (1 - s), rot: -5 * (1 - s), anim: "sit" };
  }

  function buntingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bunting));
    const face = facing == null ? 1 : facing;
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 5, rot: s * 18 * face, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const press = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + face * (3 + press * 4),
        lift: 5 + Math.abs(press) * 4.5,
        rot: (16 + press * 10) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return { x: fromX, lift: 5 * (1 - s), rot: 16 * face * (1 - s), anim: "sit" };
  }

  function mlemPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mlem));
    const face = facing == null ? 1 : facing;
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.5, rot: -s * 10 * face, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.12) / 0.76;
      const flick = Math.sin(s * Math.PI * 5);
      return {
        x: fromX + face * flick * 1.5,
        lift: 3.5 + Math.abs(flick) * 5,
        rot: (-8 + flick * 14) * face,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { x: fromX, lift: 3.5 * (1 - s), rot: -8 * face * (1 - s), anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "pounce") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "loaf") {
      if (next.t < LOAF_HOLD) {
        const pose = loafPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < LOAF_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - LOAF_HOLD);
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    const face = trick.facing;
    if (next.kind === "knead") {
      const pose = kneadPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stretch") {
      const pose = stretchPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "wash") {
      const pose = washPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bunting") {
      const pose = buntingPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mlem") {
      const pose = mlemPose(next.t, fromX, face);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pouncePose(next.t, fromX, face);
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
    DUR,
    LOAF_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    loafPose,
    releasePose,
    kneadPose,
    stretchPose,
    washPose,
    pouncePose,
    buntingPose,
    mlemPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    purrPose,
    blinkPose,
    chirpPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCatTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
