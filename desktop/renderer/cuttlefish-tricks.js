/** Sepia ground tricks while idle. House cuttlefish — bone / pupil / chroma / hover / blot personality (cuttlebone buoyancy, W-pupil regard, chromatophore rewrite, water-column hover, sepia ink blot; not Cup mantle dens, Coin bowl-drift, or Bloom gill-amble). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web `cuttlefish-tricks.ts`. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play FLUSH unchanged — never names `flush`. Parrot owns flash — chroma is the chromatophore rewrite. Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Cup owns mantle/sucker/jet/veil/tinker and keep/tint/squeeze; maidenhair window owns unfurl; parrot owns fan/flash; Relay owns latch; ferret owns puff; Nori owns taste; Saffron owns probe. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "cuttlefish";
  const TRICKS = ["bone", "pupil", "chroma", "hover", "blot"];
  const HAPPY = ["ripple", "glance", "dab"];
  const HAPPY_DUR = { ripple: 1.26, glance: 1.22, dab: 1.14 };
  const BONE_HOLD = 10.6;
  const RELEASE_S = 0.6;
  const DUR = { bone: BONE_HOLD + RELEASE_S, pupil: 1.36, chroma: 1.48, hover: 1.52, blot: 1.4 };

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
    if (kind === "bone") return 46 + roll * 26;
    if (kind === "chroma") return 14 + roll * 10;
    if (kind === "blot") return 16 + roll * 11;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "bone";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "bone") {
      if (roll < 0.26) return "pupil";
      if (roll < 0.48) return "chroma";
      if (roll < 0.72) return "hover";
      return "blot";
    }
    if (lastKind === "pupil") {
      if (roll < 0.28) return "bone";
      if (roll < 0.5) return "chroma";
      if (roll < 0.72) return "hover";
      return "blot";
    }
    if (lastKind === "chroma") {
      if (roll < 0.22) return "bone";
      if (roll < 0.44) return "pupil";
      if (roll < 0.66) return "hover";
      return "blot";
    }
    if (roll < 0.2) return "bone";
    if (roll < 0.4) return "pupil";
    if (roll < 0.6) return "chroma";
    if (roll < 0.8) return "hover";
    return "blot";
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
    return key === TRICK_KEY || key === "sepia";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "ripple";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "ripple" ? "sit" : name === "glance" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function ripplePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ripple));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 1.35, rot: s * 4.5, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const fin = Math.sin(t * 3.4);
      return {
        lift: 1.35 + Math.abs(fin) * 0.28,
        rot: 4.5 + fin * 5.2,
        dx: fin * 0.18,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 1.0 * (1 - s), rot: 2.5 * (1 - s), dx: 0, anim: "idle" };
  }

  function glancePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glance));
    if (u < 0.12) {
      const s = u / 0.12;
      return { lift: s * 0.85, rot: s * -9, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      const w = Math.sin(t * 2.6);
      return {
        lift: 0.85 + Math.abs(w) * 0.2,
        rot: -9 + w * 11,
        dx: w * 0.12,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.85 * (1 - s), rot: -9 * (1 - s), dx: 0, anim: "sit" };
  }

  function dabPose(t) {
    return {
      lift: Math.abs(Math.sin(t * 2.1)) * 0.55 + 1.05,
      rot: 3 + Math.sin(t * 2.8) * 5.5,
      dx: Math.sin(t * 1.6) * 0.16,
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
    if (next.kind === "ripple") {
      const pose = ripplePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "glance") {
      const pose = glancePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dabPose(next.t);
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
      kind === "bone"
        ? "sit"
        : kind === "pupil"
          ? "talk"
          : kind === "chroma"
            ? "play"
            : kind === "hover"
              ? "walk"
              : kind === "blot"
                ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "bone" ? "hold" : "go",
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

  function bonePose(t) {
    const beat = Math.sin(t * 0.95) + 0.22 * Math.sin(t * 2.7);
    return {
      lift: 1.15 + Math.abs(Math.sin(t * 0.68)) * 0.22,
      rot: 1.8 + beat * 2.4,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 1.15 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 1.8 * (1 - u) };
  }

  function pupilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pupil));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.7, rot: s * -12 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = (u - 0.14) / 0.41;
      const w = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * w * 0.22,
        lift: 0.7 + Math.abs(w) * 0.18,
        rot: facing * (-12 + w * 16),
        anim: "talk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.55) / 0.23;
      return {
        x: fromX,
        lift: 0.7 - s * 0.15,
        rot: facing * (-4 + s * 2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.55 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "idle",
    };
  }

  function chromaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chroma));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 1.4, rot: s * 6 * facing, anim: "play" };
    }
    if (u < 0.72) {
      const s = (u - 0.1) / 0.62;
      const flash = Math.sin(s * Math.PI * 5.6);
      const band = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX + facing * band * 0.3,
        lift: 1.4 + Math.abs(flash) * 0.55,
        rot: facing * (6 + flash * 12 + band * 4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function hoverPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hover));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * s * 0.4, lift: s * 1.8, rot: s * 3 * facing, anim: "walk" };
    }
    if (u < 0.75) {
      const s = (u - 0.12) / 0.63;
      const bob = Math.sin(s * Math.PI * 3.2);
      const fin = Math.sin(s * Math.PI * 6.4);
      return {
        x: fromX + facing * (0.4 + s * 1.6 + fin * 0.25),
        lift: 1.8 + bob * 0.35,
        rot: facing * (3 + fin * 5 + bob * 2),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return {
      x: fromX + facing * (2.0 * (1 - s)),
      lift: 1.8 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "idle",
    };
  }

  function blotPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.blot));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 1.55, rot: s * -5 * facing, anim: "sit" };
    }
    if (u < 0.42) {
      const s = (u - 0.12) / 0.3;
      const cloud = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * cloud * 0.45,
        lift: 1.55 + Math.abs(cloud) * 0.5,
        rot: facing * (-5 + cloud * 9),
        anim: "play",
      };
    }
    if (u < 0.72) {
      const s = (u - 0.42) / 0.3;
      return {
        x: fromX - facing * s * 0.8,
        lift: 1.55 * (1 - s * 0.45),
        rot: facing * (2 - s * 4),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX - facing * (0.8 * (1 - s)),
      lift: 0.85 * (1 - s),
      rot: facing * (-1.5 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "chroma" && trick.kind !== "hover" && trick.kind !== "blot") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "bone") {
      if (next.t < BONE_HOLD) {
        const pose = bonePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BONE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BONE_HOLD);
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
    if (next.kind === "pupil") {
      const pose = pupilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "chroma") {
      const pose = chromaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hover") {
      const pose = hoverPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = blotPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    BONE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    bonePose,
    releasePose,
    pupilPose,
    chromaPose,
    hoverPose,
    blotPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    ripplePose,
    glancePose,
    dabPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCuttlefishTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
