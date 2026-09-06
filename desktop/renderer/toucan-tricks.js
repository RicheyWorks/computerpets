/** Keel ground tricks while idle. House toucan — roost / berry / juggle / peer / skip personality. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `toucan-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, or dragon move clone. Window-play TOSS is unchanged — this module never names a trick `toss`. Pike window-play BILL, raven CROAK, and mallard TIP stay untouched — never names `bill`, `croak`, or `tip`. Quill already owns flash/fan/quote/strut/crack and squawk/bravo/scissor. Echo already owns preen/bobble/mimic/sidle/dangle. Peck already owns beak. Pip already owns tilt as thank-you. Bloom already owns gill/amble/mend/smile/plume. Avoids soak/tuck/crane/plod/paddle/potato/loaf/nest/bow/dig/flop/zoom/popcorn/hay/rumble/zig/scurry/drift/gulp/flare/glint/dart/circle/loop/preen/bobble/mimic/sidle/dangle/perch/den/mouser/stalk/trot/prance/huddle/toboggan/waddle/porpoise/trumpet/quote/strut/fan/crack/flash/tube/romp/steal/puff/noodle/thread/ball/curl/snuffle/anoint/bristle/root/dust/ash/bound/fluff/chin/sift/gill/amble/mend/smile/plume/float/wall/bloom/toss/bill/hook name collisions with prior guests. */
(function (root) {
  const TRICK_KEY = "toucan";
  const TRICKS = ["roost", "berry", "juggle", "peer", "skip"];
  const HAPPY = ["clack", "yelp", "tok"];
  const HAPPY_DUR = { clack: 1.14, yelp: 1.2, tok: 1.28 };
  const ROOST_HOLD = 10.2;
  const RELEASE_S = 0.62;
  const DUR = { roost: ROOST_HOLD + RELEASE_S, berry: 1.42, juggle: 1.36, peer: 1.26, skip: 1.32 };

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
    if (kind === "roost") return 40 + roll * 24;
    if (kind === "berry") return 14 + roll * 10;
    if (kind === "juggle") return 15 + roll * 11;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "roost";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "roost") {
      if (roll < 0.28) return "berry";
      if (roll < 0.5) return "juggle";
      if (roll < 0.72) return "peer";
      return "skip";
    }
    if (lastKind === "berry") {
      if (roll < 0.3) return "roost";
      if (roll < 0.52) return "juggle";
      if (roll < 0.74) return "peer";
      return "skip";
    }
    if (lastKind === "juggle") {
      if (roll < 0.24) return "roost";
      if (roll < 0.46) return "berry";
      if (roll < 0.68) return "peer";
      return "skip";
    }
    if (roll < 0.22) return "roost";
    if (roll < 0.4) return "berry";
    if (roll < 0.6) return "juggle";
    if (roll < 0.8) return "peer";
    return "skip";
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
    return key === TRICK_KEY || key === "keel";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "clack";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "clack" ? "sit" : name === "yelp" ? "talk" : "play",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function clackPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clack));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 2.0, rot: s * 8, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      return {
        lift: 2.0 + Math.abs(Math.sin(t * 14)) * 1.2,
        rot: 8 + Math.sin(t * 16) * 10,
        dx: Math.sin(t * 10) * 0.5,
        anim: "sit",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 2.0 * (1 - s), rot: 8 * (1 - s), dx: 0, anim: "idle" };
  }

  function yelpPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.yelp));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 3.0, rot: -s * 9, dx: 0, anim: "talk" };
    }
    if (u < 0.84) {
      return {
        lift: 3.0 + Math.abs(Math.sin(t * 9)) * 1.6,
        rot: -9 + Math.sin(t * 11) * 7,
        dx: Math.sin(t * 7) * 0.9,
        anim: "talk",
      };
    }
    const s = (u - 0.84) / 0.16;
    return { lift: 3.0 * (1 - s), rot: -9 * (1 - s), dx: 0, anim: "sit" };
  }

  function tokPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 7)) * 2.8 + 0.8,
      rot: Math.sin(t * 9) * 11,
      dx: Math.sin(t * 6) * 1.1,
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
    if (next.kind === "clack") {
      const pose = clackPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "yelp") {
      const pose = yelpPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tokPose(next.t);
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
      kind === "roost"
        ? "sit"
        : kind === "berry"
          ? "sit"
          : kind === "juggle"
            ? "play"
            : kind === "peer"
              ? "sit"
              : kind === "skip"
                ? "walk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "roost" ? "hold" : "go",
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

  function roostPose(t) {
    return {
      lift: 0.4 + Math.sin(t * 1.4) * 0.6,
      rot: 18 + Math.sin(t * 1.7) * 4 + Math.sin(t * 3.2) * 2,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 18 * (1 - u) };
  }

  function berryPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.berry));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: -s * 2.2, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.14) / 0.72;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 1.4,
        lift: -2.2 + Math.abs(Math.sin(s * Math.PI * 2.4)) * 2.6,
        rot: facing * (12 + Math.sin(s * Math.PI * 3) * 8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: -2.2 * (1 - s) * 0.15,
      rot: facing * 6 * (1 - s),
      anim: "sit",
    };
  }

  function jugglePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.juggle));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 1.6, rot: -s * 8 * facing, anim: "sit" };
    }
    if (u < 0.9) {
      const s = (u - 0.1) / 0.8;
      const toss = Math.abs(Math.sin(s * Math.PI * 4));
      return {
        x: fromX + facing * Math.sin(s * Math.PI * 2) * 1.8,
        lift: 1.6 + toss * 5.5,
        rot: facing * (-8 + toss * 18),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return {
      x: fromX,
      lift: 1.6 * (1 - s),
      rot: facing * -4 * (1 - s),
      anim: "sit",
    };
  }

  function peerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.peer));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 1.4, rot: s * 22 * facing, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 0.6,
        lift: 1.4 + Math.sin(s * Math.PI * 1.6) * 0.8,
        rot: facing * (22 + Math.sin(s * Math.PI * 2) * 6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: facing * 11 * (1 - s),
      anim: "sit",
    };
  }

  function skipPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.skip));
    if (u < 0.08) {
      const s = smoothstep(u / 0.08);
      return { x: fromX, lift: s * 1.2, rot: -s * 5 * facing, anim: "sit" };
    }
    if (u < 0.9) {
      const s = (u - 0.08) / 0.82;
      const hop = Math.abs(Math.sin(s * Math.PI * 3));
      return {
        x: fromX + facing * (20 * smoothstep(s) + Math.sin(s * Math.PI * 2) * 1.2),
        lift: 1.2 + hop * 6.5,
        rot: facing * (-5 + hop * 14),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.9) / 0.1);
    return {
      x: fromX + facing * 20,
      lift: 1.2 * (1 - s),
      rot: facing * -2 * (1 - s),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "skip" && trick.kind !== "juggle") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "roost") {
      if (next.t < ROOST_HOLD) {
        const pose = roostPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ROOST_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ROOST_HOLD);
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
    if (next.kind === "berry") {
      const pose = berryPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "juggle") {
      const pose = jugglePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "peer") {
      const pose = peerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = skipPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ROOST_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    roostPose,
    releasePose,
    berryPose,
    jugglePose,
    peerPose,
    skipPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    clackPose,
    yelpPose,
    tokPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetToucanTricks = api;
})(typeof window !== "undefined" ? window : globalThis);