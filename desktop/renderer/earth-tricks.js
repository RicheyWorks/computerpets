/** Ground ground tricks while idle. Earth Dragon — lug / earth-hold / heave / bed personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `earth-tricks.ts`. Not a Rui, Relay, or Fuse move clone. Window-play `earth` is unchanged. */
(function (root) {
  const TRICK_KEY = "ground_dragon";
  const TRICKS = ["lug", "earth", "heave", "bed"];
  const HAPPY = ["hum", "bow", "gleam"];
  const HAPPY_DUR = { hum: 1.34, bow: 1.18, gleam: 1.4 };
  const EARTH_HOLD = 11;
  const RELEASE_S = 0.6;
  const DUR = { lug: 1.12, earth: EARTH_HOLD + RELEASE_S, heave: 1.15, bed: 2.4 };

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
    if (kind === "earth") return 44 + roll * 22;
    if (kind === "heave") return 15 + roll * 11;
    return justFinished ? 10 + roll * 8 : 4.5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "earth";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "earth") {
      if (roll < 0.36) return "lug";
      if (roll < 0.6) return "bed";
      return "heave";
    }
    if (lastKind === "heave") {
      if (roll < 0.52) return "bed";
      if (roll < 0.78) return "lug";
      return "earth";
    }
    if (roll < 0.3) return "lug";
    if (roll < 0.42) return "earth";
    if (roll < 0.64) return "heave";
    return "bed";
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
    return key === TRICK_KEY || key === "ground";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "hum";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "bow" ? "sit" : name === "hum" ? "talk" : "play",
      facing: facing || 1,
      fromX: x,
    };
  }

  function humPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hum));
    if (u < 0.8) {
      return {
        lift: Math.abs(Math.sin(t * 14)) * 3.5,
        rot: Math.sin(t * 16) * 4,
        dx: 0,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.8) / 0.2) * Math.PI) * 2, dx: 0, anim: "sit" };
  }

  function bowPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bow));
    if (u < 0.4) {
      const s = u / 0.4;
      return { lift: -s * 5, rot: s * 10, dx: 0, anim: "sit" };
    }
    if (u < 0.7) {
      return { lift: -5, rot: 10, dx: 0, anim: "sit" };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: -5 * (1 - s), rot: 10 * (1 - s), dx: 0, anim: "sit" };
  }

  function gleamPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gleam));
    return {
      lift: Math.sin(u * Math.PI) * 9,
      rot: Math.sin(u * Math.PI * 2) * 5,
      dx: Math.sin(u * Math.PI) * 1.2,
      anim: "play",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind] || HAPPY_DUR.hum;
    if (next.kind === "hum") {
      const pose = humPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bow") {
      const pose = bowPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = gleamPose(next.t);
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
    const anim = kind === "lug" || kind === "earth" ? "sit" : kind === "heave" ? "play" : "walk";
    return {
      kind,
      phase: kind === "earth" ? "hold" : "go",
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

  /** Drop into the earth lug — low seat, strap down. Not a cartridge clip seat. */
  function lugPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.lug));
    if (u < 0.5) {
      const s = smoothstep(u / 0.5);
      return { lift: (1 - s) * 4 - s * 3, rot: (1 - s) * 6 + s * 4, anim: "sit" };
    }
    return { lift: -3, rot: Math.sin(((u - 0.5) / 0.5) * Math.PI) * 2, anim: "sit" };
  }

  function earthPose() {
    return { lift: -2, rot: 0 };
  }

  /** Soft unearth — strap loosens, no hop, no filament pop. */
  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -2 + Math.sin(u * Math.PI) * 3, rot: Math.sin(u * Math.PI) * 4 };
  }

  /** Slow soil heave — one long pulse, not a fuse blow. */
  function heavePose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.heave));
    if (u < 0.35) {
      const s = smoothstep(u / 0.35);
      return { lift: -2 + s * 14, rot: s * 8, dx: 0, anim: "play" };
    }
    if (u < 0.7) {
      const s = (u - 0.35) / 0.35;
      return {
        lift: 12 + Math.sin(s * Math.PI) * 3,
        rot: Math.sin(s * Math.PI * 2) * 6,
        dx: Math.sin(s * Math.PI) * 1.5,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return { lift: 12 * (1 - s) - s * 2, rot: 4 * (1 - s), dx: 0, anim: "sit" };
  }

  /** Walk a short bay, then bed back into the lug. */
  function bedPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.bed));
    if (u < 0.42) {
      const s = smoothstep(u / 0.42);
      return { x: fromX + facing * 28 * s, lift: 0, rot: 0, anim: "walk" };
    }
    if (u < 0.68) {
      const s = (u - 0.42) / 0.26;
      return { x: fromX + facing * 28, lift: (1 - s) * 3 - s * 3, rot: s * 5, anim: "sit" };
    }
    return { x: fromX + facing * 28, lift: -3, rot: Math.sin(((u - 0.68) / 0.32) * Math.PI) * 2, anim: "sit" };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "heave") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "earth") {
      if (next.t < EARTH_HOLD) {
        const pose = earthPose();
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < EARTH_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - EARTH_HOLD);
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
    if (next.kind === "lug") {
      const pose = lugPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "heave") {
      const pose = heavePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bedPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    EARTH_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    lugPose,
    earthPose,
    releasePose,
    heavePose,
    bedPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    humPose,
    bowPose,
    gleamPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetEarthTricks = api;
})(typeof window !== "undefined" ? window : globalThis);