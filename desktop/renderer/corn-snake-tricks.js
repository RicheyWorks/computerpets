/** Saffron ground tricks while idle. House corn snake — scribble / gap / comma / probe / canyon personality (mid-sentence blotter life; curious pencil-tray explorer). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `corn-snake-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play WRITE unchanged — never names `write`. Nori owns orb/taste/unroll; Sol owns flick; Ember owns settle. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "corn_snake";
  const TRICKS = ["scribble", "gap", "comma", "probe", "canyon"];
  const HAPPY = ["clause", "spice", "cord"];
  const HAPPY_DUR = { clause: 1.14, spice: 1.22, cord: 1.26 };
  const COMMA_HOLD = 9.8;
  const RELEASE_S = 0.62;
  const DUR = { scribble: 1.44, gap: 1.32, comma: COMMA_HOLD + RELEASE_S, probe: 1.26, canyon: 1.48 };

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
    if (kind === "comma") return 40 + roll * 24;
    if (kind === "gap") return 15 + roll * 10;
    if (kind === "probe") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "comma";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "comma") {
      if (roll < 0.28) return "scribble";
      if (roll < 0.5) return "gap";
      if (roll < 0.72) return "probe";
      return "canyon";
    }
    if (lastKind === "gap") {
      if (roll < 0.3) return "comma";
      if (roll < 0.52) return "scribble";
      if (roll < 0.74) return "probe";
      return "canyon";
    }
    if (lastKind === "probe") {
      if (roll < 0.24) return "comma";
      if (roll < 0.46) return "scribble";
      if (roll < 0.68) return "gap";
      return "canyon";
    }
    if (roll < 0.22) return "comma";
    if (roll < 0.42) return "scribble";
    if (roll < 0.6) return "gap";
    if (roll < 0.8) return "probe";
    return "canyon";
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
    return key === TRICK_KEY || key === "saffron";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "clause";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "clause" ? "sit" : name === "spice" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function clausePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clause));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.4, rot: s * 8, dx: 0, anim: "sit" };
  }
  if (u < 0.8) {
    return {
      lift: 1.4 + Math.abs(Math.sin(t * 5.1)) * 1.1,
      rot: 8 + Math.sin(t * 3.8) * 5,
      dx: Math.sin(t * 2.4) * 0.35,
      anim: "sit",
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.4 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "idle" };
}

  function spicePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.spice));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.8, rot: s * -7, dx: 0, anim: "talk" };
  }
  if (u < 0.78) {
    const flick = Math.sin(t * 7.2);
    return {
      lift: 1.8 + Math.abs(flick) * 0.7,
      rot: -7 + flick * 9,
      dx: flick * 0.4,
      anim: "talk",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.8 * (1 - s), rot: -7 * (1 - s), dx: 0, anim: "sit" };
}

  function cordPose(t) {
  return {
    lift: Math.abs(Math.sin(t * 2.4)) * 1.1 + 0.35,
    rot: -6 + Math.sin(t * 2.1) * 6,
    dx: Math.sin(t * 1.7) * 0.45,
    anim: "sit",
  };
}

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "clause") {
      const pose = clausePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spice") {
      const pose = spicePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cordPose(next.t);
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
      kind === "comma"
        ? "sit"
        : kind === "gap"
          ? "sit"
          : kind === "probe"
            ? "talk"
            : kind === "scribble"
              ? "play"
              : kind === "canyon"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "comma" ? "hold" : "go",
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

  function commaPose(t) {
  return {
    lift: 0.15 + Math.sin(t * 1.15) * 0.28,
    rot: -8 + Math.sin(t * 0.95) * 2.2 + Math.sin(t * 2.4) * 1.1,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.22 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -8 * (1 - u) };
}

  function scribblePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.scribble));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.3, rot: s * 10 * facing, anim: "play" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const wave = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * (s * 6.4 + wave * 1.6),
      lift: 1.3 + Math.abs(wave) * 1.0,
      rot: facing * (10 + wave * 14),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * (6.4 * (1 - s)),
    lift: 1.3 * (1 - s),
    rot: facing * 4 * (1 - s),
    anim: "sit",
  };
}

  function gapPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.gap));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + facing * s * 1.2, lift: s * 0.5, rot: s * 14 * facing, anim: "sit" };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const dip = Math.abs(Math.sin(s * Math.PI * 1.8));
    return {
      x: fromX + facing * (1.2 + Math.sin(s * Math.PI) * 0.4),
      lift: 0.5 - dip * 0.35,
      rot: facing * (14 + dip * 6),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (1.2 * (1 - s)),
    lift: 0.5 * (1 - s),
    rot: facing * 6 * (1 - s),
    anim: "sit",
  };
}

  function probePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.probe));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 1.5, rot: s * -5 * facing, anim: "talk" };
  }
  if (u < 0.86) {
    const s = (u - 0.1) / 0.76;
    const flick = Math.sin(s * Math.PI * 7.2);
    return {
      x: fromX + facing * flick * 0.45,
      lift: 1.5 + Math.abs(flick) * 1.0,
      rot: facing * (-5 + flick * 12),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 1.5 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit",
  };
}

  function canyonPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.canyon));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.8, rot: -s * 10 * facing, anim: "play" };
  }
  if (u < 0.48) {
    const s = (u - 0.12) / 0.36;
    return {
      x: fromX + facing * smoothstep(s) * 5.6,
      lift: 1.8 + Math.sin(s * Math.PI) * 1.0,
      rot: facing * (-10 + s * 18),
      anim: "play",
    };
  }
  if (u < 0.82) {
    const s = (u - 0.48) / 0.34;
    const home = smoothstep(s);
    return {
      x: fromX + facing * (5.6 * (1 - home)),
      lift: 1.8 * (1 - home * 0.45) + Math.sin(s * Math.PI) * 0.5,
      rot: facing * (8 - home * 12),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 1.8 * 0.55 * (1 - s),
    rot: facing * -3 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "scribble" && trick.kind !== "canyon") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "comma") {
      if (next.t < COMMA_HOLD) {
        const pose = commaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < COMMA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - COMMA_HOLD);
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
    if (next.kind === "scribble") {
      const pose = scribblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gap") {
      const pose = gapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "probe") {
      const pose = probePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = canyonPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    COMMA_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    commaPose,
    releasePose,
    scribblePose,
    gapPose,
    probePose,
    canyonPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    clausePose,
    spicePose,
    cordPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCornSnakeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);