/** Pip ground tricks while idle. House dog — wait / wag / sniff / bow / zoom personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `dog-tricks.ts`. Not a Rui, cat, or dragon move clone. Window-play floor watch is unchanged. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. */
(function (root) {
  const TRICK_KEY = "dog";
  const TRICKS = ["wait", "wag", "sniff", "bow", "zoom"];
  const HAPPY = ["tail", "tilt", "woof"];
  const HAPPY_DUR = { tail: 1.35, tilt: 1.25, woof: 1.12 };
  const WAIT_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { wait: WAIT_HOLD + RELEASE_S, wag: 1.4, sniff: 1.55, bow: 1.35, zoom: 1.1 };

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
    if (kind === "wait") return 40 + roll * 20;
    if (kind === "zoom") return 14 + roll * 10;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "wait";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "wait") {
      if (roll < 0.3) return "wag";
      if (roll < 0.52) return "sniff";
      if (roll < 0.74) return "bow";
      return "zoom";
    }
    if (lastKind === "zoom") {
      if (roll < 0.4) return "wait";
      if (roll < 0.65) return "wag";
      if (roll < 0.85) return "sniff";
      return "bow";
    }
    if (roll < 0.24) return "wait";
    if (roll < 0.42) return "wag";
    if (roll < 0.6) return "sniff";
    if (roll < 0.8) return "bow";
    return "zoom";
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
    return key === TRICK_KEY || key === "pip";
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
    const name = HAPPY.includes(kind) ? kind : "tail";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "tilt" ? "sit" : name === "tail" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function tailPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tail));
    if (u < 0.85) {
      return {
        lift: Math.abs(Math.sin(t * 16)) * 3.2,
        rot: Math.sin(t * 14) * 7,
        dx: 0,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.85) / 0.15) * Math.PI) * 2, dx: 0, anim: "sit" };
  }

  function tiltPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tilt));
    if (u < 0.3) {
      const s = u / 0.3;
      return { lift: -s * 1.5, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.7) {
      return { lift: -1.5, rot: 12, dx: 0, anim: "sit" };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: -1.5 * (1 - s), rot: 12 * (1 - s), dx: 0, anim: "sit" };
  }

  function woofPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.woof));
    return {
      lift: Math.sin(u * Math.PI) * 9,
      rot: Math.sin(u * Math.PI * 2) * 5,
      dx: Math.sin(u * Math.PI) * 2,
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
    if (next.kind === "tail") {
      const pose = tailPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tilt") {
      const pose = tiltPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = woofPose(next.t);
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
      kind === "wait" || kind === "wag" || kind === "sniff" || kind === "bow"
        ? "sit"
        : kind === "zoom"
          ? "play"
          : "sit";
    return {
      kind,
      phase: kind === "wait" ? "hold" : "go",
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

  function waitPose() {
    return { lift: -1.5, rot: 0 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -1.5 + Math.sin(u * Math.PI) * 4, rot: Math.sin(u * Math.PI) * 4 };
  }

  function wagPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 12)) * 3.5,
      rot: Math.sin(t * 14) * 8,
      dx: 0,
      anim: "sit",
    };
  }

  function sniffPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.sniff));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: -s * 4, rot: s * 6, dx: s * 3, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: -4 + Math.sin(t * 9) * 1.2,
        rot: 6 + Math.sin(t * 7) * 3,
        dx: 3 + Math.sin(t * 5) * 1.5,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: -4 * (1 - s), rot: 6 * (1 - s), dx: 3 * (1 - s), anim: "sit" };
  }

  function bowPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.bow));
    if (u < 0.28) {
      const s = smoothstep(u / 0.28);
      return { lift: -s * 5, rot: -s * 14, dx: s * 2, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.28) / 0.44;
      return {
        lift: -5 + Math.sin(s * Math.PI) * 1.5,
        rot: -14 + Math.sin(s * Math.PI) * 2,
        dx: 2,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return { lift: -5 * (1 - s), rot: -14 * (1 - s), dx: 2 * (1 - s), anim: "sit" };
  }

  function zoomPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.zoom));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: -s * 2, rot: s * 4, anim: "sit" };
    }
    if (u < 0.85) {
      const s = (u - 0.2) / 0.65;
      return {
        x: fromX + facing * 28 * smoothstep(s),
        lift: Math.abs(Math.sin(s * Math.PI * 2.5)) * 10,
        rot: Math.sin(s * Math.PI * 2.5) * 6,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return {
      x: fromX + facing * 28,
      lift: 2 * (1 - s),
      rot: 2 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "zoom") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "wait") {
      if (next.t < WAIT_HOLD) {
        const pose = waitPose();
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < WAIT_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - WAIT_HOLD);
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
    if (next.kind === "wag") {
      const pose = wagPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sniff") {
      const pose = sniffPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bow") {
      const pose = bowPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = zoomPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    WAIT_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    waitPose,
    releasePose,
    wagPose,
    sniffPose,
    bowPose,
    zoomPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    tailPose,
    tiltPose,
    woofPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDogTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
