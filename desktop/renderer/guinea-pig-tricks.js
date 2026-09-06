/** Whee ground tricks while idle. House guinea pig — popcorn / rumble / hay / potato / zig personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `guinea-pig-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, or dragon move clone. Window-play WHEEK is unchanged — this module never names a trick `wheek`. Miso already owns loaf — potato is the round settle, not a loaf copy. Ethogram SCRATCH_KEYS still owns paw-scratch motion — this module never names a trick `scratch`. Avoids nest/cheek/scurry/pocket/reel/dig/bow/groom/flop/zoom name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "guinea_pig";
  const TRICKS = ["popcorn", "rumble", "hay", "potato", "zig"];
  const HAPPY = ["peep", "nibble", "toot"];
  const HAPPY_DUR = { peep: 1.22, nibble: 1.35, toot: 1.08 };
  const POTATO_HOLD = 10;
  const RELEASE_S = 0.55;
  const DUR = { popcorn: 1.15, rumble: 1.5, hay: 1.4, potato: POTATO_HOLD + RELEASE_S, zig: 1.05 };

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
    if (kind === "potato") return 40 + roll * 20;
    if (kind === "popcorn" || kind === "zig") return 14 + roll * 10;
    return justFinished ? 9 + roll * 8 : 4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "potato";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "potato") {
      if (roll < 0.28) return "hay";
      if (roll < 0.5) return "rumble";
      if (roll < 0.72) return "popcorn";
      return "zig";
    }
    if (lastKind === "popcorn" || lastKind === "zig") {
      if (roll < 0.38) return "potato";
      if (roll < 0.58) return "hay";
      if (roll < 0.78) return "rumble";
      return lastKind === "popcorn" ? "zig" : "popcorn";
    }
    if (roll < 0.22) return "potato";
    if (roll < 0.4) return "hay";
    if (roll < 0.58) return "rumble";
    if (roll < 0.8) return "popcorn";
    return "zig";
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
    return key === TRICK_KEY || key === "whee";
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
    const name = HAPPY.includes(kind) ? kind : "peep";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x,
      lift: 0,
      rot: 0,
      anim: name === "peep" ? "talk" : name === "nibble" ? "sit" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function peepPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.peep));
    if (u < 0.85) {
      return {
        lift: Math.abs(Math.sin(t * 20)) * 2.2,
        rot: Math.sin(t * 18) * 6,
        dx: 0,
        anim: "talk",
      };
    }
    return { lift: 0, rot: Math.sin(((u - 0.85) / 0.15) * Math.PI) * 2, dx: 0, anim: "sit" };
  }

  function nibblePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nibble));
    if (u < 0.3) {
      const s = u / 0.3;
      return { lift: -s * 2, rot: s * 5, dx: 0, anim: "sit" };
    }
    if (u < 0.85) {
      return {
        lift: -2 + Math.abs(Math.sin(t * 16)) * 1.8,
        rot: 5 + Math.sin(t * 14) * 4,
        dx: 0,
        anim: "sit",
      };
    }
    const s = (u - 0.85) / 0.15;
    return { lift: -2 * (1 - s), rot: 5 * (1 - s), dx: 0, anim: "sit" };
  }

  function tootPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.toot));
    return {
      lift: Math.sin(u * Math.PI) * 6,
      rot: Math.sin(u * Math.PI * 2) * 8,
      dx: Math.sin(u * Math.PI) * 3,
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
    if (next.kind === "peep") {
      const pose = peepPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nibble") {
      const pose = nibblePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tootPose(next.t);
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
      kind === "potato" || kind === "hay" || kind === "rumble"
        ? "sit"
        : kind === "popcorn" || kind === "zig"
          ? "play"
          : "sit";
    return {
      kind,
      phase: kind === "potato" ? "hold" : "go",
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

  function potatoPose() {
    return { lift: -3.5, rot: 4 };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: -3.5 + Math.sin(u * Math.PI) * 5, rot: 4 - Math.sin(u * Math.PI) * 6 };
  }

  function popcornPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.popcorn));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { lift: -s * 1.5, rot: s * 3, dx: 0, anim: "sit" };
    }
    if (u < 0.88) {
      const hops = Math.sin((u - 0.12) / 0.76 * Math.PI * 3);
      return {
        lift: Math.abs(hops) * 14,
        rot: hops * 10,
        dx: Math.sin((u - 0.12) / 0.76 * Math.PI * 2) * 2,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return { lift: 2 * (1 - s), rot: 3 * (1 - s), dx: 0, anim: "sit" };
  }

  function rumblePose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.rumble));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { lift: -s * 1.2, rot: -s * 8, dx: s * 3, anim: "sit" };
    }
    if (u < 0.85) {
      return {
        lift: -1.2 + Math.abs(Math.sin(t * 7)) * 1.5,
        rot: -8 + Math.sin(t * 6) * 10,
        dx: 3 + Math.sin(t * 5) * 4,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.85) / 0.15);
    return { lift: -1.2 * (1 - s), rot: -8 * (1 - s), dx: 3 * (1 - s), anim: "sit" };
  }

  function hayPose(t) {
    const u = Math.max(0, Math.min(1, t / DUR.hay));
    if (u < 0.25) {
      const s = smoothstep(u / 0.25);
      return { lift: -s * 4, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.75) {
      return {
        lift: -4 + Math.abs(Math.sin(t * 10)) * 1.6,
        rot: 12 + Math.sin(t * 9) * 5,
        dx: Math.sin(t * 7) * 1.2,
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return { lift: -4 * (1 - s), rot: 12 * (1 - s), dx: 0, anim: "sit" };
  }

  function zigPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.zig));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: -s * 1.5, rot: s * 5, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.18) / 0.64;
      const wobble = Math.sin(s * Math.PI * 4);
      return {
        x: fromX + facing * 18 * smoothstep(s) + wobble * 3,
        lift: Math.abs(Math.sin(s * Math.PI * 3)) * 4,
        rot: wobble * 12,
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 18,
      lift: 1.5 * (1 - s),
      rot: 3 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "popcorn" && trick.kind !== "zig") {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "potato") {
      if (next.t < POTATO_HOLD) {
        const pose = potatoPose();
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < POTATO_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - POTATO_HOLD);
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
    if (next.kind === "popcorn") {
      const pose = popcornPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rumble") {
      const pose = rumblePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hay") {
      const pose = hayPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = zigPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    POTATO_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    potatoPose,
    releasePose,
    popcornPose,
    rumblePose,
    hayPose,
    zigPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    peepPose,
    nibblePose,
    tootPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetGuineaPigTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
