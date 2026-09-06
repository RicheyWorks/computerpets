/** Bloom ground tricks while idle. House axolotl — gill / amble / mend / smile / plume personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `axolotl-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, or dragon move clone. Window-play WALL is unchanged — this module never names a trick `wall`. Window-play FLOAT (Nimbus) and BLOOM (yeast) stay untouched — never names `float` or `bloom`. Goldfish already owns drift/gulp/flare/glint/dart and bubble/lip/swish. Turtle already owns soak/paddle. Rui already owns wave. Door window-play owns gape. Guinea pig already owns peep. Chinchilla already owns ash/bound/fluff/chin/sift and eep/coo/bark. Hedgehog already owns curl/snuffle/anoint/bristle/root. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/tube/romp/steal/puff/noodle/thread/ball/curl/snuffle/anoint/bristle/root/dust/ash/bound/fluff/chin/sift/float/wall/bloom name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "axolotl";
  const TRICKS = ["gill", "amble", "mend", "smile", "plume"];
  const HAPPY = ["wink", "blip", "grin"];
  const HAPPY_DUR = { wink: 1.12, blip: 1.22, grin: 1.26 };
  const GILL_HOLD = 10.1;
  const RELEASE_S = 0.66;
  const DUR = { gill: GILL_HOLD + RELEASE_S, amble: 1.48, mend: 1.38, smile: 1.24, plume: 1.34 };

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
    if (kind === "gill") return 40 + roll * 24;
    if (kind === "amble") return 13 + roll * 10;
    if (kind === "mend") return 16 + roll * 11;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "gill";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "gill") {
      if (roll < 0.28) return "amble";
      if (roll < 0.5) return "mend";
      if (roll < 0.72) return "smile";
      return "plume";
    }
    if (lastKind === "amble") {
      if (roll < 0.3) return "gill";
      if (roll < 0.52) return "mend";
      if (roll < 0.74) return "smile";
      return "plume";
    }
    if (lastKind === "mend") {
      if (roll < 0.24) return "gill";
      if (roll < 0.46) return "amble";
      if (roll < 0.68) return "smile";
      return "plume";
    }
    if (roll < 0.22) return "gill";
    if (roll < 0.4) return "amble";
    if (roll < 0.6) return "mend";
    if (roll < 0.8) return "smile";
    return "plume";
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
    return key === TRICK_KEY || key === "bloom";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "wink";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "wink" ? "sit" : name === "blip" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function winkPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.wink));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 1.8, rot: s * 5, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      return {
        lift: 1.8 + Math.sin(t * 7) * 0.7,
        rot: 5 + Math.sin(t * 9) * 4,
        dx: Math.sin(t * 6) * 0.4,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 1.8 * (1 - s), rot: 5 * (1 - s), dx: 0, anim: "idle" };
  }

  function blipPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.blip));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 2.4, rot: -s * 7, dx: 0, anim: "talk" };
    }
    if (u < 0.82) {
      return {
        lift: 2.4 + Math.abs(Math.sin(t * 10)) * 1.4,
        rot: -7 + Math.sin(t * 12) * 6,
        dx: Math.sin(t * 8) * 0.8,
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: 2.4 * (1 - s), rot: -7 * (1 - s), dx: 0, anim: "sit" };
  }

  function grinPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 8)) * 2.6 + 0.6,
      rot: Math.sin(t * 10) * 9,
      dx: Math.sin(t * 7) * 1.0,
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
    if (next.kind === "wink") {
      const pose = winkPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "blip") {
      const pose = blipPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = grinPose(next.t);
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
      kind === "gill"
        ? "sit"
        : kind === "amble"
          ? "walk"
          : kind === "mend"
            ? "sit"
            : kind === "smile"
              ? "sit"
              : kind === "plume"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "gill" ? "hold" : "go",
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

  function gillPose(t) {
    return {
      lift: 0.8 + Math.sin(t * 1.9) * 1.2 + Math.abs(Math.sin(t * 3.6)) * 0.6,
      rot: Math.sin(t * 2.6) * 14 + Math.sin(t * 4.8) * 7,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: (0.8 + 1.2) * (1 - Math.sin(u * Math.PI * 0.5)), rot: 14 * (1 - u) };
  }

  function amblePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.amble));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 1.0, rot: -s * 6 * facing, anim: "sit" };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const step = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * (16 * smoothstep(s) + Math.sin(s * Math.PI * 2) * 1.6),
        lift: 1.0 + Math.abs(step) * 3.4,
        rot: facing * (-6 + step * 11),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 16,
      lift: 1.0 * (1 - s),
      rot: facing * -3 * (1 - s),
      anim: "sit",
    };
  }

  function mendPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mend));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: -s * 1.6, rot: s * 8 * facing, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.2,
        lift: -1.6 + Math.sin(s * Math.PI * 2) * 2.8,
        rot: facing * (8 + Math.sin(s * Math.PI * 2.5) * 6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: (-1.6 + 2.8) * (1 - s) * 0.2,
      rot: facing * 4 * (1 - s),
      anim: "sit",
    };
  }

  function smilePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.smile));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.2, rot: s * 4 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 0.8,
        lift: 2.2 + Math.sin(s * Math.PI * 1.8) * 1.1,
        rot: facing * (4 + Math.sin(s * Math.PI * 2.2) * 5),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 2.2 * (1 - s),
      rot: facing * 2 * (1 - s),
      anim: "sit",
    };
  }

  function plumePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.plume));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return {
        x: fromX,
        lift: s * 2.0,
        rot: -s * 10 * facing,
        anim: "sit",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.1) / 0.78;
      const sway = Math.sin(s * Math.PI * 5.5);
      return {
        x: fromX + facing * sway * 2.2,
        lift: 2.0 + Math.abs(sway) * 2.0,
        rot: facing * (-10 + sway * 20),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 2.0 * (1 - s),
      rot: facing * -5 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "amble" && trick.kind !== "plume") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "gill") {
      if (next.t < GILL_HOLD) {
        const pose = gillPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < GILL_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - GILL_HOLD);
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
    if (next.kind === "amble") {
      const pose = amblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mend") {
      const pose = mendPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "smile") {
      const pose = smilePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = plumePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    GILL_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    gillPose,
    releasePose,
    amblePose,
    mendPose,
    smilePose,
    plumePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    winkPose,
    blipPose,
    grinPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetAxolotlTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
