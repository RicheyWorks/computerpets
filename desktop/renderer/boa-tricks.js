/** Lula ground tricks while idle. House boa constrictor — pour / heft / oxbow / slack / bank personality (pour/weight/loop desk life; blotter-river desk weight). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `boa-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play LOOP unchanged — never names `loop`. Nori owns orb/taste/unroll; Sol owns flick; Ember owns settle; Saffron owns scribble/comma; Bandit owns stripe/verdict; Jade owns bracelet/jewel/bough; Bluff owns hood/gape/encore; Sash owns seam/moss/lap; Burr owns root; Coin owns flare; Thimble owns dig; Fox window owns scent; rosy_boa window owns stone. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "boa";
  const TRICKS = ["pour", "heft", "oxbow", "slack", "bank"];
  const HAPPY = ["harbor", "cradle", "stay"];
  const HAPPY_DUR = { harbor: 1.22, cradle: 1.28, stay: 1.34 };
  const POUR_HOLD = 10.4;
  const RELEASE_S = 0.62;
  const DUR = { pour: POUR_HOLD + RELEASE_S, heft: 1.4, oxbow: 1.52, slack: 1.28, bank: 1.44 };

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
    if (kind === "pour") return 46 + roll * 26;
    if (kind === "oxbow") return 16 + roll * 11;
    if (kind === "heft") return 14 + roll * 9;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "pour";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "pour") {
      if (roll < 0.28) return "heft";
      if (roll < 0.5) return "oxbow";
      if (roll < 0.72) return "slack";
      return "bank";
    }
    if (lastKind === "oxbow") {
      if (roll < 0.3) return "pour";
      if (roll < 0.52) return "heft";
      if (roll < 0.74) return "slack";
      return "bank";
    }
    if (lastKind === "heft") {
      if (roll < 0.24) return "pour";
      if (roll < 0.46) return "oxbow";
      if (roll < 0.68) return "slack";
      return "bank";
    }
    if (roll < 0.22) return "pour";
    if (roll < 0.42) return "heft";
    if (roll < 0.6) return "oxbow";
    if (roll < 0.8) return "slack";
    return "bank";
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
    return key === TRICK_KEY || key === "lula";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "harbor";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "harbor" ? "sit" : name === "cradle" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function harborPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.harbor));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 1.15, rot: s * -5, dx: 0, anim: "sit" };
  }
  if (u < 0.8) {
    return {
      lift: 1.15 + Math.abs(Math.sin(t * 2.2)) * 0.35,
      rot: -5 + Math.sin(t * 1.6) * 3.2,
      dx: Math.sin(t * 1.2) * 0.22,
      anim: "sit",
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.15 * (1 - s), rot: -5 * (1 - s), dx: 0, anim: "idle" };
}

  function cradlePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cradle));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 1.45, rot: s * 6, dx: 0, anim: "sit" };
  }
  if (u < 0.78) {
    const rock = Math.sin(t * 2.8);
    return {
      lift: 1.45 + Math.abs(rock) * 0.4,
      rot: 6 + rock * 5.5,
      dx: rock * 0.28,
      anim: "sit",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.45 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" };
}

  function stayPose(t) {
  return {
    lift: Math.abs(Math.sin(t * 1.7)) * 0.85 + 1.05,
    rot: -6 + Math.sin(t * 2.1) * 5.2,
    dx: Math.sin(t * 1.3) * 0.3,
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
    if (next.kind === "harbor") {
      const pose = harborPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cradle") {
      const pose = cradlePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = stayPose(next.t);
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
      kind === "pour"
        ? "sit"
        : kind === "heft"
          ? "sit"
          : kind === "oxbow"
            ? "walk"
            : kind === "slack"
              ? "talk"
              : kind === "bank"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "pour" ? "hold" : "go",
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

  function pourPose(t) {
  return {
    lift: 0.55 + Math.sin(t * 0.7) * 0.14,
    rot: -8 + Math.sin(t * 0.58) * 1.8 + Math.sin(t * 1.5) * 0.9,
  };
}

  function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.55 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -8 * (1 - u) };
}

  function heftPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.heft));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 1.1, rot: s * 4 * facing, anim: "sit" };
  }
  if (u < 0.55) {
    const s = (u - 0.14) / 0.41;
    return {
      x: fromX + facing * s * 0.35,
      lift: 1.1 - smoothstep(s) * 0.95,
      rot: facing * (4 - s * 10),
      anim: "sit",
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const press = Math.abs(Math.sin(s * Math.PI * 1.8));
    return {
      x: fromX + facing * 0.35,
      lift: 0.15 + press * 0.12,
      rot: facing * (-6 + press * 2),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * (0.35 * (1 - s)),
    lift: 0.15 * (1 - s),
    rot: facing * -2 * (1 - s),
    anim: "idle",
  };
}

  function oxbowPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.oxbow));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 0.8, lift: s * 0.55, rot: s * 10 * facing, anim: "walk" };
  }
  if (u < 0.48) {
    const s = (u - 0.12) / 0.36;
    return {
      x: fromX + facing * (0.8 + smoothstep(s) * 4.2),
      lift: 0.55 + Math.sin(s * Math.PI) * 0.85,
      rot: facing * (10 + Math.sin(s * Math.PI) * 14),
      anim: "walk",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    return {
      x: fromX + facing * (5.0 - smoothstep(s) * 2.4),
      lift: 0.9 + Math.abs(Math.sin(s * Math.PI * 1.5)) * 0.35,
      rot: facing * (18 - s * 22),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (2.6 * (1 - s)),
    lift: 0.7 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit",
  };
}

  function slackPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.slack));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 1.6, rot: s * 14 * facing, anim: "talk" };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const ease = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * ease * 0.25,
      lift: 1.6 - s * 0.7 + Math.abs(ease) * 0.15,
      rot: facing * (14 - s * 18 + ease * 3),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 0.9 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit",
  };
}

  function bankPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.bank));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + facing * s * 1.6, lift: s * 0.4, rot: -s * 6 * facing, anim: "sit" };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const nudge = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * (1.6 + nudge * 0.35),
      lift: 0.35 + Math.abs(nudge) * 0.18,
      rot: facing * (-6 + nudge * 3.5),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * (1.6 * (1 - s)),
    lift: 0.35 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "idle",
  };
}

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "oxbow" && trick.kind !== "bank") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "pour") {
      if (next.t < POUR_HOLD) {
        const pose = pourPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < POUR_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - POUR_HOLD);
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
    if (next.kind === "heft") {
      const pose = heftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "oxbow") {
      const pose = oxbowPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "slack") {
      const pose = slackPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bankPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    POUR_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    pourPose,
    releasePose,
    heftPose,
    oxbowPose,
    slackPose,
    bankPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    harborPose,
    cradlePose,
    stayPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBoaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
