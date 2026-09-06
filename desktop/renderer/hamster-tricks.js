/** Clip ground tricks while idle. House hamster — nest / cheek / scurry / pocket / reel personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `hamster-tricks.ts`. Not a Rui, cat, dog, rabbit, or dragon move clone. Window-play drawer stash is unchanged — this module never names a trick `stash`. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. Avoids dig/bow/groom/flop name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "hamster";
  const TRICKS = ["nest", "cheek", "scurry", "pocket", "reel"];
  const HAPPY = ["stuff", "chitter", "sprint"];
  const HAPPY_DUR = { stuff: 1.3, chitter: 1.18, sprint: 1.05 };
  const NEST_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { nest: NEST_HOLD + RELEASE_S, cheek: 1.45, scurry: 1.0, pocket: 1.4, reel: 1.35 };

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
    if (kind === "nest") return 40 + roll * 20;
    if (kind === "scurry") return 14 + roll * 10;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "nest";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "nest") {
      if (roll < 0.3) return "cheek";
      if (roll < 0.52) return "pocket";
      if (roll < 0.74) return "reel";
      return "scurry";
    }
    if (lastKind === "scurry") {
      if (roll < 0.4) return "nest";
      if (roll < 0.65) return "cheek";
      if (roll < 0.85) return "pocket";
      return "reel";
    }
    if (roll < 0.24) return "nest";
    if (roll < 0.42) return "cheek";
    if (roll < 0.6) return "pocket";
    if (roll < 0.8) return "reel";
    return "scurry";
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
    return key === TRICK_KEY || key === "clip";
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
    const name = HAPPY.includes(kind) ? kind : "stuff";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "chitter" ? "talk" : name === "stuff" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function stuffPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.stuff));
    if (u < 0.35) {
      const s = u / 0.35;
      return { lift: -s * 1.5, rot: s * 6, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      return {
        lift: -1.5 + Math.abs(Math.sin(t * 14)) * 2.2,
        rot: 6 + Math.sin(t * 12) * 4,
        dx: 0,
        anim: "sit",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: -1.5 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" };
  }

  function chitterPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chitter));
    if (u < 0.85) {
      return {
        lift: Math.abs(Math.sin(t * 24)) * 2,
        rot: Math.sin(t * 22) * 5,
        dx: 0,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.85) / 0.15) * Math.PI) * 2, dx: 0, anim: "sit" };
  }

  function sprintPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sprint));
    return {
      lift: Math.sin(u * Math.PI) * 5,
      rot: Math.sin(u * Math.PI * 3) * 6,
      dx: Math.sin(u * Math.PI) * 4,
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
    if (next.kind === "stuff") {
      const pose = stuffPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chitter") {
      const pose = chitterPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sprintPose(next.t);
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
      kind === "nest" || kind === "cheek" || kind === "pocket"
        ? "sit"
        : kind === "scurry" || kind === "reel"
          ? "play"
          : "sit";
    return {
      kind,
      phase: kind === "nest" ? "hold" : "go",
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

  function nestPose() {
    return { lift: -4, rot: -6 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -4 + Math.sin(u * Math.PI) * 5, rot: -6 + Math.sin(u * Math.PI) * 7 };
  }

  function cheekPose(t) {
    return {
      lift: -0.8 + Math.abs(Math.sin(t * 8)) * 2.4,
      rot: Math.sin(t * 9) * 8,
      dx: 0,
      anim: "sit",
    };
  }

  function pocketPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.pocket));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: -s * 3, rot: s * 5, dx: s * 2, anim: "sit" };
    }
    if (u < 0.7) {
      return {
        lift: -3 + Math.abs(Math.sin(t * 11)) * 2,
        rot: 5 + Math.sin(t * 10) * 4,
        dx: 2 + Math.sin(t * 8) * 1.5,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return { lift: -3 * (1 - s), rot: 5 * (1 - s), dx: 2 * (1 - s), anim: "sit" };
  }

  function reelPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.reel));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { lift: s * 2, rot: s * 10, dx: 0, anim: "play" };
    }
    if (u < 0.85) {
      return {
        lift: 2 + Math.abs(Math.sin(t * 16)) * 3,
        rot: Math.sin(t * 14) * 22,
        dx: Math.sin(t * 12) * 2,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { lift: 2 * (1 - s), rot: 10 * (1 - s), dx: 0, anim: "sit" };
  }

  function scurryPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scurry));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: -s * 2, rot: s * 4, anim: "sit" };
    }
    if (u < 0.8) {
      const s = (u - 0.2) / 0.6;
      return {
        x: fromX + facing * 22 * smoothstep(s),
        lift: Math.abs(Math.sin(s * Math.PI * 3)) * 5,
        rot: Math.sin(s * Math.PI * 4) * 10,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 22,
      lift: 2 * (1 - s),
      rot: 3 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "scurry") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "nest") {
      if (next.t < NEST_HOLD) {
        const pose = nestPose();
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < NEST_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - NEST_HOLD);
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
    if (next.kind === "cheek") {
      const pose = cheekPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pocket") {
      const pose = pocketPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "reel") {
      const pose = reelPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = scurryPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    NEST_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    nestPose,
    releasePose,
    cheekPose,
    pocketPose,
    reelPose,
    scurryPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    stuffPose,
    chitterPose,
    sprintPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHamsterTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
