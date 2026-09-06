/** Miso ground tricks while idle. House cat — loaf / knead / stretch / wash / pounce personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `cat-tricks.ts`. Not a Rui or dragon move clone. Window-play ledge sit is unchanged. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. */
(function (root) {
  const TRICK_KEY = "cat";
  const TRICKS = ["loaf", "knead", "stretch", "wash", "pounce"];
  const HAPPY = ["purr", "blink", "chirp"];
  const HAPPY_DUR = { purr: 1.4, blink: 1.22, chirp: 1.18 };
  const LOAF_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { loaf: LOAF_HOLD + RELEASE_S, knead: 1.45, stretch: 1.55, wash: 1.6, pounce: 1.05 };

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
    if (kind === "loaf") return 40 + roll * 20;
    if (kind === "pounce") return 14 + roll * 10;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "loaf";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "loaf") {
      if (roll < 0.3) return "knead";
      if (roll < 0.52) return "wash";
      if (roll < 0.74) return "stretch";
      return "pounce";
    }
    if (lastKind === "pounce") {
      if (roll < 0.4) return "loaf";
      if (roll < 0.65) return "wash";
      if (roll < 0.85) return "knead";
      return "stretch";
    }
    if (roll < 0.24) return "loaf";
    if (roll < 0.42) return "knead";
    if (roll < 0.6) return "stretch";
    if (roll < 0.8) return "wash";
    return "pounce";
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
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY;
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
      facing: facing || 1,
      fromX: x,
    };
  }

  function purrPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.purr));
    if (u < 0.85) {
      return {
        lift: Math.abs(Math.sin(t * 18)) * 2.2,
        rot: Math.sin(t * 12) * 3,
        dx: 0,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.85) / 0.15) * Math.PI) * 1.5, dx: 0, anim: "sit" };
  }

  function blinkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blink));
    if (u < 0.35) {
      const s = u / 0.35;
      return { lift: -s * 3, rot: s * 4, dx: 0, anim: "sit" };
    }
    if (u < 0.7) {
      return { lift: -3, rot: 4, dx: 0, anim: "sit" };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: -3 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "sit" };
  }

  function chirpPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chirp));
    return {
      lift: Math.sin(u * Math.PI) * 7,
      rot: Math.sin(u * Math.PI * 2) * 6,
      dx: Math.sin(u * Math.PI) * 1.5,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind] || HAPPY_DUR.purr;
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
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame() {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "loaf" || kind === "knead" || kind === "wash" || kind === "stretch"
        ? "sit"
        : kind === "pounce"
          ? "play"
          : "sit";
    return {
      kind,
      phase: kind === "loaf" ? "hold" : "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim,
      facing: facing || 1,
      fromX: x,
    };
  }

  function smoothstep(t) {
    const x = Math.max(0, Math.min(1, t));
    return x * x * (3 - 2 * x);
  }

  /** Tuck into a cream loaf — paws under, round sit. Not an earth lug. */
  function loafPose() {
    return { lift: -2.5, rot: 0 };
  }

  /** Soft unloaf — stand from the tuck, no hop. */
  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -2.5 + Math.sin(u * Math.PI) * 3.5, rot: Math.sin(u * Math.PI) * 3 };
  }

  /** Biscuit knead — soft rhythmic press. Not Rui's scratch. Not ethogram paw-scratch. */
  function kneadPose(t) {
    return {
      lift: -1.5 + Math.abs(Math.sin(t * 10)) * 3.2,
      rot: Math.sin(t * 9) * 5,
      dx: 0,
      anim: "sit",
    };
  }

  /** Long house-cat stretch — front long, then settle. */
  function stretchPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.stretch));
    if (u < 0.3) {
      const s = smoothstep(u / 0.3);
      return { lift: -s * 2, rot: -s * 8, dx: s * 2, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.3) / 0.4;
      return {
        lift: -2 + Math.sin(s * Math.PI) * 2,
        rot: -8 + Math.sin(s * Math.PI) * 3,
        dx: 2,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return { lift: -2 * (1 - s), rot: -8 * (1 - s), dx: 2 * (1 - s), anim: "sit" };
  }

  /** Face wash — sit and wipe. Not a dragon hum. */
  function washPose(t) {
    return {
      lift: -1 + Math.abs(Math.sin(t * 8)) * 1.5,
      rot: Math.sin(t * 11) * 9,
      dx: 0,
      anim: "sit",
    };
  }

  /** Pounce-adjacent — crouch, then a short spring. Not Rui's somersault. Not a hunt. */
  function pouncePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pounce));
    if (u < 0.28) {
      const s = smoothstep(u / 0.28);
      return { x: fromX, lift: -s * 4, rot: s * 6, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.28) / 0.42;
      return {
        x: fromX + facing * 22 * smoothstep(s),
        lift: Math.sin(s * Math.PI) * 14,
        rot: Math.sin(s * Math.PI) * -8,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + facing * 22,
      lift: 2 * (1 - s),
      rot: -3 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "pounce") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "loaf") {
      if (next.t < LOAF_HOLD) {
        const pose = loafPose();
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
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
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
    } else {
      const pose = pouncePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
