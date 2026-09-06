/** Cup ground tricks while idle. House octopus — mantle / sucker / jet / veil / tinker personality (cephalopod desk life; suckers, siphon jet, ink veil, problem-solving curiosity; teacup dens, not Coin bowl-drift or Bloom gill-amble or Ink soak-tuck). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `octopus-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play LID unchanged — never names `lid`. Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; maidenhair window owns unfurl; cuttlefish window owns flush; parrot owns fan; Relay owns latch; ferret owns puff; Nori owns taste; Saffron owns probe. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "octopus";
  const TRICKS = ["mantle", "sucker", "jet", "veil", "tinker"];
  const HAPPY = ["keep", "tint", "squeeze"];
  const HAPPY_DUR = { keep: 1.24, tint: 1.3, squeeze: 1.18 };
  const MANTLE_HOLD = 10.2;
  const RELEASE_S = 0.6;
  const DUR = { mantle: MANTLE_HOLD + RELEASE_S, sucker: 1.42, jet: 1.18, veil: 1.5, tinker: 1.56 };

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
    if (kind === "mantle") return 48 + roll * 28;
    if (kind === "sucker") return 15 + roll * 11;
    if (kind === "veil") return 16 + roll * 10;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "mantle";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "mantle") {
      if (roll < 0.28) return "sucker";
      if (roll < 0.5) return "jet";
      if (roll < 0.72) return "veil";
      return "tinker";
    }
    if (lastKind === "sucker") {
      if (roll < 0.3) return "mantle";
      if (roll < 0.52) return "jet";
      if (roll < 0.74) return "veil";
      return "tinker";
    }
    if (lastKind === "veil") {
      if (roll < 0.24) return "mantle";
      if (roll < 0.46) return "sucker";
      if (roll < 0.68) return "jet";
      return "tinker";
    }
    if (roll < 0.22) return "mantle";
    if (roll < 0.42) return "sucker";
    if (roll < 0.6) return "jet";
    if (roll < 0.8) return "veil";
    return "tinker";
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
    return key === TRICK_KEY || key === "cup";
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : HAPPY.slice();
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "keep";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "keep" ? "sit" : name === "tint" ? "talk" : "sit",
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

  function keepPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.keep));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 1.15, rot: s * -5, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const wrap = Math.abs(Math.sin(t * 2.4));
      return {
        lift: 1.15 - wrap * 0.28,
        rot: -5 + wrap * 3.8,
        dx: Math.sin(t * 1.1) * 0.14,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.85 * (1 - s), rot: -2.2 * (1 - s), dx: 0, anim: "idle" };
  }

  function tintPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tint));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 1.5, rot: s * 7, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      const shimmer = Math.sin(t * 3.1);
      return {
        lift: 1.5 + Math.abs(shimmer) * 0.32,
        rot: 7 + shimmer * 6.2,
        dx: shimmer * 0.22,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 1.5 * (1 - s), rot: 7 * (1 - s), dx: 0, anim: "sit" };
  }

  function squeezePose(t) {
    return {
      lift: Math.abs(Math.sin(t * 1.85)) * 0.7 + 0.95,
      rot: -4 + Math.sin(t * 2.2) * 4.8,
      dx: Math.sin(t * 1.35) * 0.2,
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
    if (next.kind === "keep") {
      const pose = keepPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tint") {
      const pose = tintPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = squeezePose(next.t);
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
      kind === "mantle"
        ? "sit"
        : kind === "sucker"
          ? "walk"
          : kind === "jet"
            ? "walk"
            : kind === "veil"
              ? "sit"
              : kind === "tinker"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "mantle" ? "hold" : "go",
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

  function mantlePose(t) {
    const beat = Math.sin(t * 0.88) + 0.28 * Math.sin(t * 2.4);
    return {
      lift: 0.48 + Math.abs(Math.sin(t * 0.72)) * 0.14,
      rot: -2.4 + beat * 2.6,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.48 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -2.4 * (1 - u) };
  }

  function suckerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sucker));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 0.5, lift: s * 0.55, rot: s * 9 * facing, anim: "walk" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const taste = Math.sin(s * Math.PI * 3.4);
      return {
        x: fromX + facing * (0.5 + s * 2.4 + taste * 0.28),
        lift: 0.55 + Math.abs(taste) * 0.45,
        rot: facing * (9 + taste * 10),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.55) / 0.23;
      return {
        x: fromX + facing * (2.9 - s * 0.4),
        lift: 0.7 + Math.sin(s * Math.PI) * 0.25,
        rot: facing * (4 - s * 2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * (2.5 * (1 - s)),
      lift: 0.7 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "walk",
    };
  }

  function jetPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.jet));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX - facing * s * 0.55, lift: s * 0.35, rot: s * -6 * facing, anim: "sit" };
    }
    if (u < 0.45) {
      const s = smoothstep((u - 0.1) / 0.35);
      return {
        x: fromX - facing * 0.55 + facing * s * 5.2,
        lift: 0.35 + Math.sin(s * Math.PI) * 1.1,
        rot: facing * (-6 + s * 14),
        anim: "walk",
      };
    }
    if (u < 0.72) {
      const s = (u - 0.45) / 0.27;
      const coast = Math.abs(Math.sin(s * Math.PI * 1.6));
      return {
        x: fromX + facing * (4.65 + coast * 0.15),
        lift: 0.4 + coast * 0.2,
        rot: facing * (4 - s * 5),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * (4.8 * (1 - s)),
      lift: 0.45 * (1 - s),
      rot: facing * (-1 * (1 - s)),
      anim: "idle",
    };
  }

  function veilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.veil));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 1.65, rot: s * 8 * facing, anim: "sit" };
    }
    if (u < 0.48) {
      const s = (u - 0.14) / 0.34;
      const cloud = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * cloud * 0.35,
        lift: 1.65 + Math.abs(cloud) * 0.4,
        rot: facing * (8 + cloud * 7),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.48) / 0.3;
      return {
        x: fromX + facing * Math.sin(s * Math.PI) * 0.2,
        lift: 1.65 * (1 - s * 0.55),
        rot: facing * (4 - s * 6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.75 * (1 - s),
      rot: facing * (-1.5 * (1 - s)),
      anim: "sit",
    };
  }

  function tinkerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tinker));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 0.7, lift: s * 0.8, rot: s * 11 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const puzzle = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * (0.7 + puzzle * 0.55),
        lift: 0.8 + Math.abs(puzzle) * 0.65,
        rot: facing * (11 + puzzle * 9),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.55) / 0.23;
      const check = Math.abs(Math.sin(s * Math.PI * 2));
      return {
        x: fromX + facing * (0.7 - s * 0.2),
        lift: 0.9 + check * 0.25,
        rot: facing * (5 - s * 3 + check * 2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * (0.5 * (1 - s)),
      lift: 0.9 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "jet" && trick.kind !== "sucker" && trick.kind !== "tinker") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "mantle") {
      if (next.t < MANTLE_HOLD) {
        const pose = mantlePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MANTLE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MANTLE_HOLD);
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
    if (next.kind === "sucker") {
      const pose = suckerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "jet") {
      const pose = jetPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "veil") {
      const pose = veilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tinkerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    MANTLE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    mantlePose,
    releasePose,
    suckerPose,
    jetPose,
    veilPose,
    tinkerPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    keepPose,
    tintPose,
    squeezePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOctopusTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
