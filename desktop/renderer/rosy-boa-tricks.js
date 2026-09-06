/** Blush ground tricks while idle. House rosy boa — pebble / crevice / rosy / mesa / arroyo personality (small desert rock / pink / tuck desk life; warm-corner hush, not Lula boa river-weight). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `rosy-boa-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle, goldfish, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play STONE unchanged — never names `stone`. Nori owns orb/taste/unroll; Sol owns flick; Ember owns settle; Saffron owns scribble/comma; Bandit owns stripe/verdict; Jade owns bracelet/jewel/bough; Bluff owns hood/gape/encore; Sash owns seam/moss/lap; Lula owns pour/oxbow/bank; Coral owns rhyme/tile; budgie owns mimic; parrot owns flash; Burr owns root; turtle owns tuck; Coin owns flare; Thimble owns dig; Fox window owns scent; rosy_boa window owns stone. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "rosy_boa";
  const TRICKS = ["pebble", "crevice", "rosy", "mesa", "arroyo"];
  const HAPPY = ["climate", "manners", "corner"];
  const HAPPY_DUR = { climate: 1.2, manners: 1.26, corner: 1.32 };
  const PEBBLE_HOLD = 10.6;
  const RELEASE_S = 0.6;
  const DUR = { pebble: PEBBLE_HOLD + RELEASE_S, crevice: 1.38, rosy: 1.42, mesa: 1.28, arroyo: 1.5 };

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
    if (kind === "pebble") return 48 + roll * 28;
    if (kind === "crevice") return 16 + roll * 11;
    if (kind === "rosy") return 15 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "pebble";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "pebble") {
      if (roll < 0.28) return "crevice";
      if (roll < 0.5) return "rosy";
      if (roll < 0.72) return "mesa";
      return "arroyo";
    }
    if (lastKind === "crevice") {
      if (roll < 0.3) return "pebble";
      if (roll < 0.52) return "rosy";
      if (roll < 0.74) return "mesa";
      return "arroyo";
    }
    if (lastKind === "rosy") {
      if (roll < 0.24) return "pebble";
      if (roll < 0.46) return "crevice";
      if (roll < 0.68) return "mesa";
      return "arroyo";
    }
    if (roll < 0.22) return "pebble";
    if (roll < 0.42) return "crevice";
    if (roll < 0.6) return "rosy";
    if (roll < 0.8) return "mesa";
    return "arroyo";
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
    return key === TRICK_KEY || key === "blush";
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "climate";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "climate" ? "sit" : name === "manners" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function climatePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.climate));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 1.15, rot: s * -5, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const warm = Math.abs(Math.sin(t * 2.8));
      return {
        lift: 1.15 - warm * 0.4,
        rot: -5 + warm * 3.5,
        dx: Math.sin(t * 1.2) * 0.14,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.85 * (1 - s), rot: -3 * (1 - s), dx: 0, anim: "idle" };
  }

  function mannersPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.manners));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 1.4, rot: s * 7, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      const nod = Math.sin(t * 2.4);
      return {
        lift: 1.4 + Math.abs(nod) * 0.28,
        rot: 7 + nod * 5.5,
        dx: nod * 0.22,
        anim: "sit",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 1.4 * (1 - s), rot: 7 * (1 - s), dx: 0, anim: "sit" };
  }

  function cornerPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 1.7)) * 0.8 + 0.95,
      rot: -4 + Math.sin(t * 2.1) * 5.2,
      dx: Math.sin(t * 1.3) * 0.24,
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
    if (next.kind === "climate") {
      const pose = climatePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "manners") {
      const pose = mannersPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cornerPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return Object.assign({}, next, { phase: "done", lift: 0, rot: 0, anim: "idle" });
    return next;
  }

  function sleepHoldFrame() {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "pebble"
        ? "sit"
        : kind === "crevice"
          ? "walk"
          : kind === "rosy"
            ? "sit"
            : kind === "mesa"
              ? "sit"
              : kind === "arroyo"
                ? "walk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "pebble" ? "hold" : "go",
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

  function pebblePose(t) {
    const beat = Math.sin(t * 0.95) + 0.35 * Math.sin(t * 2.7);
    return {
      lift: 0.48 + Math.abs(Math.sin(t * 0.7)) * 0.14,
      rot: -3 + beat * 2.8,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.48 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
  }

  function crevicePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.crevice));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + facing * s * 1.2, lift: s * 0.55, rot: s * 6 * facing, anim: "walk" };
    }
    if (u < 0.48) {
      const s = (u - 0.14) / 0.34;
      return {
        x: fromX + facing * (1.2 + smoothstep(s) * 1.6),
        lift: 0.55 - smoothstep(s) * 0.45,
        rot: facing * (6 - s * 10),
        anim: "sit",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      const hush = Math.abs(Math.sin(s * Math.PI * 1.8));
      return {
        x: fromX + facing * 2.8,
        lift: 0.12 + hush * 0.1,
        rot: facing * (-4 + hush * 2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * (2.8 * (1 - s)),
      lift: 0.2 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "idle",
    };
  }

  function rosyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rosy));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 1.5, rot: s * 10 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const shimmer = Math.sin(s * Math.PI * 3.4);
      return {
        x: fromX + facing * shimmer * 0.28,
        lift: 1.5 - s * 0.4 + Math.abs(shimmer) * 0.2,
        rot: facing * (10 - s * 14 + shimmer * 4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 1.15 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }

  function mesaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mesa));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 1.35, rot: s * 4 * facing, anim: "sit" };
    }
    if (u < 0.5) {
      const s = (u - 0.14) / 0.36;
      return {
        x: fromX + facing * s * 0.35,
        lift: 1.35 - smoothstep(s) * 1.15,
        rot: facing * (4 - s * 9),
        anim: "sit",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.5) / 0.32;
      const press = Math.abs(Math.sin(s * Math.PI * 2.0));
      return {
        x: fromX + facing * 0.35,
        lift: 0.16 + press * 0.1,
        rot: facing * (-5 + press * 2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * (0.35 * (1 - s)),
      lift: 0.16 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "idle",
    };
  }

  function arroyoPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.arroyo));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 1.0, lift: s * 0.65, rot: s * 7 * facing, anim: "walk" };
    }
    if (u < 0.45) {
      const s = (u - 0.12) / 0.33;
      const step = Math.floor(s * 3);
      const local = (s * 3) % 1;
      return {
        x: fromX + facing * (1.0 + step * 1.2 + smoothstep(local) * 1.2),
        lift: 0.65 + Math.sin(local * Math.PI) * 0.45,
        rot: facing * (7 + Math.sin(local * Math.PI) * 8),
        anim: "walk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.45) / 0.33;
      return {
        x: fromX + facing * (4.6 - smoothstep(s) * 2.0),
        lift: 0.75 + Math.abs(Math.sin(s * Math.PI * 1.6)) * 0.26,
        rot: facing * (12 - s * 16),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * (2.6 * (1 - s)),
      lift: 0.6 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "arroyo" && trick.kind !== "crevice") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "pebble") {
      if (next.t < PEBBLE_HOLD) {
        const pose = pebblePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PEBBLE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PEBBLE_HOLD);
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
    if (next.kind === "crevice") {
      const pose = crevicePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rosy") {
      const pose = rosyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mesa") {
      const pose = mesaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = arroyoPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    PEBBLE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    pebblePose,
    releasePose,
    crevicePose,
    rosyPose,
    mesaPose,
    arroyoPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    climatePose,
    mannersPose,
    cornerPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetRosyBoaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
