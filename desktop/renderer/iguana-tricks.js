/** Sol ground tricks while idle. House iguana — sun / dewlap / nod / press / flick personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `iguana-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, or dragon move clone. Window-play FLATTEN unchanged — never names `flatten`. Window-play BASK untouched — never names `bask`. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "iguana";
  const TRICKS = ["sun", "dewlap", "nod", "press", "flick"];
  const HAPPY = ["swell", "tap", "ease"];
  const HAPPY_DUR = { swell: 1.18, tap: 1.22, ease: 1.3 };
  const SUN_HOLD = 10.4;
  const RELEASE_S = 0.64;
  const DUR = { sun: SUN_HOLD + RELEASE_S, dewlap: 1.38, nod: 1.34, press: 1.4, flick: 1.24 };

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
    if (kind === "sun") return 42 + roll * 26;
    if (kind === "dewlap") return 15 + roll * 10;
    if (kind === "nod") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "sun";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "sun") {
      if (roll < 0.28) return "dewlap";
      if (roll < 0.5) return "nod";
      if (roll < 0.72) return "press";
      return "flick";
    }
    if (lastKind === "dewlap") {
      if (roll < 0.3) return "sun";
      if (roll < 0.52) return "nod";
      if (roll < 0.74) return "press";
      return "flick";
    }
    if (lastKind === "nod") {
      if (roll < 0.24) return "sun";
      if (roll < 0.46) return "dewlap";
      if (roll < 0.68) return "press";
      return "flick";
    }
    if (roll < 0.22) return "sun";
    if (roll < 0.4) return "dewlap";
    if (roll < 0.6) return "nod";
    if (roll < 0.8) return "press";
    return "flick";
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
    return key === TRICK_KEY || key === "sol";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "swell";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "swell" ? "sit" : name === "tap" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function swellPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.swell));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 1.6, rot: s * 6, dx: 0, anim: "sit" };
  }
  if (u < 0.78) {
    return {
      lift: 1.6 + Math.abs(Math.sin(t * 5)) * 0.9,
      rot: 6 + Math.sin(t * 4) * 4,
      dx: 0,
      anim: "sit",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.6 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
}

  function tapPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tap));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 2.2, rot: -s * 10, dx: 0, anim: "talk" };
  }
  if (u < 0.86) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 10)) * 1.4,
      rot: -10 + Math.sin(t * 12) * 12,
      dx: Math.sin(t * 6) * 0.4,
      anim: "talk",
    };
  }
  const s = (u - 0.86) / 0.14;
  return { lift: 2.2 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" };
}

  function easePose(t) {
  return {
    lift: Math.abs(Math.sin(t * 3.2)) * 1.4 + 0.4,
    rot: Math.sin(t * 2.8) * 5,
    dx: Math.sin(t * 2.2) * 0.5,
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
    if (next.kind === "swell") {
      const pose = swellPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tap") {
      const pose = tapPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = easePose(next.t);
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
    const anim =
      kind === "sun"
        ? "sit"
        : kind === "dewlap"
          ? "sit"
          : kind === "nod"
            ? "talk"
            : kind === "press"
              ? "play"
              : kind === "flick"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "sun" ? "hold" : "go",
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

  function sunPose(t) {
  return {
    lift: 0.2 + Math.sin(t * 1.1) * 0.45,
    rot: 8 + Math.sin(t * 1.3) * 2.5 + Math.sin(t * 2.6) * 1.2,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 8 * (1 - u) };
}

  function dewlapPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.dewlap));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.8, rot: s * 10 * facing, anim: "sit" };
  }
  if (u < 0.86) {
    const s = (u - 0.14) / 0.72;
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.5,
      lift: 1.8 + Math.abs(Math.sin(s * Math.PI * 2)) * 1.4,
      rot: facing * (10 + Math.sin(s * Math.PI * 2.4) * 6),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 1.8 * (1 - s) * 0.2,
    rot: facing * 5 * (1 - s),
    anim: "sit",
  };
}

  function nodPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.nod));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.2, rot: -s * 6 * facing, anim: "talk" };
  }
  if (u < 0.9) {
    const s = (u - 0.1) / 0.8;
    const bob = Math.sin(s * Math.PI * 5);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.4,
      lift: 1.2 + Math.abs(bob) * 2.2,
      rot: facing * (-6 + bob * 16),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * -3 * (1 - s),
    anim: "sit",
  };
}

  function pressPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.press));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 2.4, rot: -s * 4 * facing, anim: "sit" };
  }
  if (u < 0.9) {
    const s = (u - 0.1) / 0.8;
    const pump = Math.abs(Math.sin(s * Math.PI * 3.5));
    return {
      x: fromX + facing * Math.sin(s * Math.PI * 1.5) * 0.8,
      lift: 2.4 + pump * 4.8,
      rot: facing * (-4 + pump * 8),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.9) / 0.1);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit",
  };
}

  function flickPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.flick));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: -s * 1.6, rot: s * 14 * facing, anim: "sit" };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    const tick = Math.abs(Math.sin(s * Math.PI * 4));
    return {
      x: fromX + facing * (1.8 * smoothstep(s) + tick * 0.6),
      lift: -1.6 + tick * 2.0,
      rot: facing * (14 + tick * 7),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * 1.8,
    lift: -1.6 * (1 - s) * 0.2,
    rot: facing * 7 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "press" && trick.kind !== "flick") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "sun") {
      if (next.t < SUN_HOLD) {
        const pose = sunPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SUN_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SUN_HOLD);
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
    if (next.kind === "dewlap") {
      const pose = dewlapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nod") {
      const pose = nodPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "press") {
      const pose = pressPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = flickPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SUN_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    sunPose,
    releasePose,
    dewlapPose,
    nodPose,
    pressPose,
    flickPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    swellPose,
    tapPose,
    easePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetIguanaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);