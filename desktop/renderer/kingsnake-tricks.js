/** Bandit ground tricks while idle. House California kingsnake — stripe / audit / verdict / plumb / raid personality (banded ruler-drawer law; bold desk inspector). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `kingsnake-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play INSPECT unchanged — never names `inspect`. Nori owns orb/taste/unroll; Sol owns flick; Ember owns settle; Saffron owns scribble/comma. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "kingsnake";
  const TRICKS = ["stripe", "audit", "verdict", "plumb", "raid"];
  const HAPPY = ["tribute", "docket", "seal"];
  const HAPPY_DUR = { tribute: 1.16, docket: 1.2, seal: 1.28 };
  const VERDICT_HOLD = 10.2;
  const RELEASE_S = 0.58;
  const DUR = { stripe: 1.38, audit: 1.34, verdict: VERDICT_HOLD + RELEASE_S, plumb: 1.42, raid: 1.52 };

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
    if (kind === "verdict") return 42 + roll * 24;
    if (kind === "audit") return 15 + roll * 10;
    if (kind === "plumb") return 14 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "verdict";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "verdict") {
      if (roll < 0.28) return "stripe";
      if (roll < 0.5) return "audit";
      if (roll < 0.72) return "plumb";
      return "raid";
    }
    if (lastKind === "audit") {
      if (roll < 0.3) return "verdict";
      if (roll < 0.52) return "stripe";
      if (roll < 0.74) return "plumb";
      return "raid";
    }
    if (lastKind === "plumb") {
      if (roll < 0.24) return "verdict";
      if (roll < 0.46) return "stripe";
      if (roll < 0.68) return "audit";
      return "raid";
    }
    if (roll < 0.22) return "verdict";
    if (roll < 0.42) return "stripe";
    if (roll < 0.6) return "audit";
    if (roll < 0.8) return "plumb";
    return "raid";
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
    return key === TRICK_KEY || key === "bandit";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "tribute";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "tribute" ? "sit" : name === "docket" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function tributePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tribute));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.5, rot: s * 7, dx: 0, anim: "sit" };
  }
  if (u < 0.8) {
    return {
      lift: 1.5 + Math.abs(Math.sin(t * 4.6)) * 0.9,
      rot: 7 + Math.sin(t * 3.4) * 4.5,
      dx: Math.sin(t * 2.1) * 0.3,
      anim: "sit",
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.5 * (1 - s), rot: 7 * (1 - s), dx: 0, anim: "idle" };
}

  function docketPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.docket));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.7, rot: s * -8, dx: 0, anim: "talk" };
  }
  if (u < 0.78) {
    const tick = Math.sin(t * 6.4);
    return {
      lift: 1.7 + Math.abs(tick) * 0.65,
      rot: -8 + tick * 10,
      dx: tick * 0.35,
      anim: "talk",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.7 * (1 - s), rot: -8 * (1 - s), dx: 0, anim: "sit" };
}

  function sealPose(t) {
  return {
    lift: Math.abs(Math.sin(t * 2.2)) * 1.05 + 0.4,
    rot: -5 + Math.sin(t * 1.9) * 5.5,
    dx: Math.sin(t * 1.55) * 0.4,
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
    if (next.kind === "tribute") {
      const pose = tributePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "docket") {
      const pose = docketPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sealPose(next.t);
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
      kind === "verdict"
        ? "sit"
        : kind === "audit"
          ? "talk"
          : kind === "plumb"
            ? "sit"
            : kind === "stripe"
              ? "play"
              : kind === "raid"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "verdict" ? "hold" : "go",
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

  function verdictPose(t) {
  return {
    lift: 0.18 + Math.sin(t * 1.05) * 0.26,
    rot: -10 + Math.sin(t * 0.88) * 2.0 + Math.sin(t * 2.2) * 1.0,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.24 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -10 * (1 - u) };
}

  function stripePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.stripe));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.2, rot: s * 8 * facing, anim: "play" };
  }
  if (u < 0.88) {
    const s = (u - 0.12) / 0.76;
    const band = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 3.2 + band * 1.1),
      lift: 1.2 + Math.abs(band) * 1.15,
      rot: facing * (8 + band * 16),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * (3.2 * (1 - s)),
    lift: 1.2 * (1 - s),
    rot: facing * 3 * (1 - s),
    anim: "sit",
  };
}

  function auditPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.audit));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.8, lift: s * 1.6, rot: s * -6 * facing, anim: "talk" };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const sweep = Math.sin(s * Math.PI * 2.6);
    return {
      x: fromX + facing * (0.8 + sweep * 1.4),
      lift: 1.6 + Math.abs(Math.sin(s * Math.PI * 3.2)) * 0.55,
      rot: facing * (-6 + sweep * 18),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * (0.8 * (1 - s)),
    lift: 1.6 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "sit",
  };
}

  function plumbPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.plumb));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.6, rot: s * 12 * facing, anim: "sit" };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    return {
      x: fromX + facing * smoothstep(s) * 7.2,
      lift: 0.6 - s * 0.25,
      rot: facing * (12 - s * 20),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * (7.2 * (1 - s)),
    lift: 0.35 * (1 - s),
    rot: facing * (-8 * (1 - s)),
    anim: "sit",
  };
}

  function raidPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.raid));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 2.0, rot: -s * 12 * facing, anim: "play" };
  }
  if (u < 0.46) {
    const s = (u - 0.1) / 0.36;
    return {
      x: fromX + facing * smoothstep(s) * 7.0,
      lift: 2.0 + Math.sin(s * Math.PI) * 0.9,
      rot: facing * (-12 + s * 22),
      anim: "play",
    };
  }
  if (u < 0.8) {
    const s = (u - 0.46) / 0.34;
    const home = smoothstep(s);
    return {
      x: fromX + facing * (7.0 * (1 - home)),
      lift: 2.0 * (1 - home * 0.5) + Math.sin(s * Math.PI) * 0.45,
      rot: facing * (10 - home * 14),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 2.0 * 0.5 * (1 - s),
    rot: facing * -4 * (1 - s),
    anim: "sit",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "stripe" && trick.kind !== "raid") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "verdict") {
      if (next.t < VERDICT_HOLD) {
        const pose = verdictPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < VERDICT_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - VERDICT_HOLD);
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
    if (next.kind === "stripe") {
      const pose = stripePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "audit") {
      const pose = auditPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "plumb") {
      const pose = plumbPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = raidPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    VERDICT_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    verdictPose,
    releasePose,
    stripePose,
    auditPose,
    plumbPose,
    raidPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    tributePose,
    docketPose,
    sealPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetKingsnakeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);