/** Ember ground tricks while idle. House phoenix — cinder / blaze / shed / lift / return personality (ash-and-return firebird desk life). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `phoenix-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play KINDLE unchanged — never names `kindle`. Floss owns ash; Vesper owns sprawl/smolder/glow; Sol owns sun. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "phoenix";
  const TRICKS = ["cinder", "blaze", "shed", "lift", "return"];
  const HAPPY = ["shine", "dip", "settle"];
  const HAPPY_DUR = { shine: 1.16, dip: 1.2, settle: 1.28 };
  const CINDER_HOLD = 10.4;
  const RELEASE_S = 0.64;
  const DUR = { cinder: CINDER_HOLD + RELEASE_S, blaze: 1.36, shed: 1.28, lift: 1.42, return: 1.3 };

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
    if (kind === "cinder") return 42 + roll * 26;
    if (kind === "blaze") return 15 + roll * 10;
    if (kind === "shed") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "cinder";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "cinder") {
      if (roll < 0.28) return "blaze";
      if (roll < 0.5) return "shed";
      if (roll < 0.72) return "lift";
      return "return";
    }
    if (lastKind === "blaze") {
      if (roll < 0.3) return "cinder";
      if (roll < 0.52) return "shed";
      if (roll < 0.74) return "lift";
      return "return";
    }
    if (lastKind === "shed") {
      if (roll < 0.24) return "cinder";
      if (roll < 0.46) return "blaze";
      if (roll < 0.68) return "lift";
      return "return";
    }
    if (roll < 0.22) return "cinder";
    if (roll < 0.4) return "blaze";
    if (roll < 0.6) return "shed";
    if (roll < 0.8) return "lift";
    return "return";
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
    return key === TRICK_KEY || key === "ember";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "shine";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "shine" ? "sit" : name === "dip" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function shinePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.shine));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 1.6, rot: s * 6, dx: 0, anim: "sit" };
  }
  if (u < 0.82) {
    return {
      lift: 1.6 + Math.abs(Math.sin(t * 4.6)) * 1.0,
      rot: 6 + Math.sin(t * 3.4) * 4,
      dx: 0,
      anim: "sit",
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 1.6 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
}

  function dipPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.dip));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 0.6, rot: s * -10, dx: 0, anim: "sit" };
  }
  if (u < 0.78) {
    return {
      lift: 0.6 + Math.abs(Math.sin(t * 3.2)) * 0.9,
      rot: -10 + Math.sin(t * 2.8) * 5,
      dx: Math.sin(t * 2.1) * 0.25,
      anim: "sit",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.6 * (1 - s), rot: -10 * (1 - s), dx: 0, anim: "sit" };
}

  function settlePose(t) {
  return {
    lift: Math.abs(Math.sin(t * 2.2)) * 1.0 + 0.4,
    rot: -5 + Math.sin(t * 1.9) * 5,
    dx: Math.sin(t * 1.5) * 0.3,
    anim: "talk",
  };
}

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "shine") {
      const pose = shinePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dip") {
      const pose = dipPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = settlePose(next.t);
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
      kind === "cinder"
        ? "sit"
        : kind === "blaze"
          ? "sit"
          : kind === "shed"
            ? "play"
            : kind === "lift"
              ? "play"
              : kind === "return"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "cinder" ? "hold" : "go",
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

  function cinderPose(t) {
  return {
    lift: 0.15 + Math.sin(t * 1.15) * 0.28,
    rot: 4 + Math.sin(t * 0.95) * 1.8 + Math.sin(t * 2.4) * 1.1,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.25 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 5 * (1 - u) };
}

  function blazePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.blaze));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.0, rot: s * 10 * facing, anim: "sit" };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const flare = Math.abs(Math.sin(s * Math.PI * 2.4));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.45,
      lift: 2.0 + flare * 1.4,
      rot: facing * (10 + flare * 8),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 2.0 * (1 - s) * 0.25,
    rot: facing * 4 * (1 - s),
    anim: "sit",
  };
}

  function shedPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.shed));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.4, rot: s * -6 * facing, anim: "play" };
  }
  if (u < 0.88) {
    const s = (u - 0.1) / 0.78;
    const shake = Math.sin(s * Math.PI * 5.5);
    return {
      x: fromX + facing * shake * 0.7,
      lift: 1.4 + Math.abs(shake) * 1.8,
      rot: facing * (-6 + shake * 14),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit",
  };
}

  function liftPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.lift));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: -s * 12 * facing, anim: "play" };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const wing = Math.abs(Math.sin(s * Math.PI * 2));
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.8,
      lift: 2.8 + wing * 1.6,
      rot: facing * (-12 + wing * 9),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.4,
    lift: 2.8 * (1 - s) * 0.3,
    rot: facing * -4 * (1 - s),
    anim: "sit",
  };
}

  function returnPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.return));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX + facing * s * 3.2, lift: s * 1.8, rot: s * 8 * facing, anim: "play" };
  }
  if (u < 0.7) {
    const s = (u - 0.2) / 0.5;
    const home = smoothstep(s);
    return {
      x: fromX + facing * (3.2 * (1 - home)),
      lift: 1.8 * (1 - home * 0.4) + Math.sin(s * Math.PI) * 0.6,
      rot: facing * (8 - home * 12),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 1.8 * 0.6 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lift" && trick.kind !== "return") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "cinder") {
      if (next.t < CINDER_HOLD) {
        const pose = cinderPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < CINDER_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - CINDER_HOLD);
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
    if (next.kind === "blaze") {
      const pose = blazePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "shed") {
      const pose = shedPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lift") {
      const pose = liftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = returnPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    CINDER_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    cinderPose,
    releasePose,
    blazePose,
    shedPose,
    liftPose,
    returnPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    shinePose,
    dipPose,
    settlePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPhoenixTricks = api;
})(typeof window !== "undefined" ? window : globalThis);