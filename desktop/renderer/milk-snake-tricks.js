/** Coral ground tricks while idle. House Pueblo milk snake — rhyme / rumor / costume / frank / tile personality (tricolor mimic stamp-box desk life; witty false-warning costume, not venom). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `milk-snake-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play MOSAIC unchanged — never names `mosaic`. Nori owns orb/taste/unroll; Sol owns flick; Ember owns settle; Saffron owns scribble/comma; Bandit owns stripe/verdict; Jade owns bracelet/jewel/bough; Bluff owns hood/gape/encore; Sash owns seam/moss/lap; Lula owns pour/oxbow/bank; budgie owns mimic; parrot owns flash; Burr owns root; Coin owns flare; Thimble owns dig; Fox window owns scent; rosy_boa window owns stone. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "milk_snake";
  const TRICKS = ["rhyme", "rumor", "costume", "frank", "tile"];
  const HAPPY = ["postmark", "cachet", "courtesy"];
  const HAPPY_DUR = { postmark: 1.18, cachet: 1.24, courtesy: 1.3 };
  const RHYME_HOLD = 10.1;
  const RELEASE_S = 0.58;
  const DUR = { rhyme: RHYME_HOLD + RELEASE_S, rumor: 1.36, costume: 1.44, frank: 1.3, tile: 1.48 };

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
    if (kind === "rhyme") return 44 + roll * 24;
    if (kind === "costume") return 15 + roll * 10;
    if (kind === "rumor") return 14 + roll * 9;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "rhyme";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "rhyme") {
      if (roll < 0.28) return "rumor";
      if (roll < 0.5) return "costume";
      if (roll < 0.72) return "frank";
      return "tile";
    }
    if (lastKind === "costume") {
      if (roll < 0.3) return "rhyme";
      if (roll < 0.52) return "rumor";
      if (roll < 0.74) return "frank";
      return "tile";
    }
    if (lastKind === "rumor") {
      if (roll < 0.24) return "rhyme";
      if (roll < 0.46) return "costume";
      if (roll < 0.68) return "frank";
      return "tile";
    }
    if (roll < 0.22) return "rhyme";
    if (roll < 0.42) return "rumor";
    if (roll < 0.6) return "costume";
    if (roll < 0.8) return "frank";
    return "tile";
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
    return key === TRICK_KEY || key === "coral";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "postmark";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "postmark" ? "sit" : name === "cachet" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function postmarkPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.postmark));
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

  function cachetPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cachet));
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

  function courtesyPose(t) {
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
    if (next.kind === "postmark") {
      const pose = postmarkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cradle") {
      const pose = cachetPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = courtesyPose(next.t);
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
      kind === "rhyme"
        ? "sit"
        : kind === "rumor"
          ? "talk"
          : kind === "costume"
            ? "sit"
            : kind === "frank"
              ? "sit"
              : kind === "tile"
                ? "walk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "rhyme" ? "hold" : "go",
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

  function rhymePose(t) {
    const beat = Math.sin(t * 1.15) + 0.45 * Math.sin(t * 3.45);
    return {
      lift: 0.62 + Math.abs(Math.sin(t * 0.85)) * 0.18,
      rot: -4 + beat * 3.6,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.62 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -4 * (1 - u) };
  }

  function rumorPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rumor));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 1.35, rot: s * 9 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = (u - 0.14) / 0.41;
      return {
        x: fromX + facing * smoothstep(s) * 2.8,
        lift: 1.35 - s * 0.35 + Math.sin(s * Math.PI) * 0.25,
        rot: facing * (9 - s * 14),
        anim: "talk",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      return {
        x: fromX + facing * (2.8 - smoothstep(s) * 2.8),
        lift: 1.0 + Math.abs(Math.sin(s * Math.PI * 1.6)) * 0.28,
        rot: facing * (-5 + s * 3),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 1.0 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }

  function costumePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.costume));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 1.7, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const shiver = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * shiver * 0.35,
        lift: 1.7 - s * 0.45 + Math.abs(shiver) * 0.22,
        rot: facing * (12 - s * 16 + shiver * 5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 1.25 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }

  function frankPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.frank));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 1.45, rot: s * 5 * facing, anim: "sit" };
    }
    if (u < 0.5) {
      const s = (u - 0.14) / 0.36;
      return {
        x: fromX + facing * s * 0.4,
        lift: 1.45 - smoothstep(s) * 1.2,
        rot: facing * (5 - s * 11),
        anim: "sit",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.5) / 0.32;
      const press = Math.abs(Math.sin(s * Math.PI * 2.2));
      return {
        x: fromX + facing * 0.4,
        lift: 0.2 + press * 0.14,
        rot: facing * (-6 + press * 2.5),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * (0.4 * (1 - s)),
      lift: 0.2 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "idle",
    };
  }

  function tilePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tile));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 1.1, lift: s * 0.7, rot: s * 8 * facing, anim: "walk" };
    }
    if (u < 0.45) {
      const s = (u - 0.12) / 0.33;
      const stepN = Math.floor(s * 3);
      const local = (s * 3) % 1;
      return {
        x: fromX + facing * (1.1 + stepN * 1.35 + smoothstep(local) * 1.35),
        lift: 0.7 + Math.sin(local * Math.PI) * 0.55,
        rot: facing * (8 + Math.sin(local * Math.PI) * 10),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.45) / 0.33;
      return {
        x: fromX + facing * (5.15 - smoothstep(s) * 2.2),
        lift: 0.85 + Math.abs(Math.sin(s * Math.PI * 1.8)) * 0.3,
        rot: facing * (14 - s * 18),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * (2.95 * (1 - s)),
      lift: 0.7 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "tile" && trick.kind !== "rumor") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "rhyme") {
      if (next.t < RHYME_HOLD) {
        const pose = rhymePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < RHYME_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - RHYME_HOLD);
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "rumor") {
      const pose = rumorPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "costume") {
      const pose = costumePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "frank") {
      const pose = frankPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tilePose(next.t, fromX, trick.facing);
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
    RHYME_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    rhymePose,
    releasePose,
    rumorPose,
    costumePose,
    frankPose,
    tilePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    postmarkPose,
    cachetPose,
    courtesyPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMilkSnakeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
