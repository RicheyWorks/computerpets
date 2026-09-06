/** Cling ground tricks while idle. House sea star — podia / righting / crawl / evert / penta personality (tube-feet ampulla waves, overturn righting twist, arm-lead crawl, stomach-eversion curiosity, pentaradial desk life; not Pulse bell/oral/lucent/trail/medusa, Cup mantle dens, Sepia chromatophores, Chamber spiral, Coin bowl-drift, Ink soak/tuck, or Bloom gill/amble). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web sea_star-tricks.ts. Not a Rui, cat, dog, rabbit, hamster, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog, chinchilla, axolotl/Bloom, toucan, iguana, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play REEF unchanged — never names eef. Special cling unchanged — never names cling as a trick. Cup owns jet/mantle/sucker/veil/tinker and keep/tint/squeeze; Sepia owns bone/pupil/chroma/hover/blot and ripple/glance/dab; Chamber owns spiral/siphuncle/nacre/pinhole/fringe and chamber/pearl/quiet; Pulse owns bell/oral/lucent/trail/medusa and halo/lumen/gel; Coin owns drift/gulp/flare/glint/dart and bubble/lip/swish; Ink owns soak/tuck/crane/plod/paddle and munch/bob/huff; Bloom owns gill/amble/mend/smile/plume and wink/blip/grin; Fuse owns pulse as thank-you; ferret owns tube; Bluff owns hood; Bandit owns tribute; Phoenix owns lift; hedgehog owns curl. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "sea_star";
  const TRICKS = ["podia", "righting", "crawl", "evert", "penta"];
  const HAPPY = ["damp", "press", "tide"];
  const HAPPY_DUR = { damp: 1.28, press: 1.16, tide: 1.2 };
  const PODIA_HOLD = 12.0;
  const RELEASE_S = 0.7;
  const DUR = { podia: PODIA_HOLD + RELEASE_S, righting: 1.55, crawl: 1.62, evert: 1.38, penta: 1.44 };

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
    if (kind === "bell") return 46 + roll * 26;
    if (kind === "oral") return 15 + roll * 10;
    if (kind === "trail") return 16 + roll * 11;
    return justFinished ? 10 + roll * 8 : 5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "bell";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "bell") {
      if (roll < 0.26) return "oral";
      if (roll < 0.48) return "lucent";
      if (roll < 0.72) return "trail";
      return "medusa";
    }
    if (lastKind === "oral") {
      if (roll < 0.28) return "bell";
      if (roll < 0.5) return "lucent";
      if (roll < 0.72) return "trail";
      return "medusa";
    }
    if (lastKind === "lucent") {
      if (roll < 0.22) return "bell";
      if (roll < 0.44) return "oral";
      if (roll < 0.66) return "trail";
      return "medusa";
    }
    if (roll < 0.2) return "bell";
    if (roll < 0.4) return "oral";
    if (roll < 0.6) return "lucent";
    if (roll < 0.8) return "trail";
    return "medusa";
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
    return key === TRICK_KEY || key === "cling";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "damp";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "damp" ? "sit" : name === "press" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function dampPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.damp));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.55, rot: s * 1.6, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const wave = Math.sin(t * 1.7);
      return {
        lift: 0.55 + Math.abs(wave) * 0.14,
        rot: 1.6 + wave * 2.2,
        dx: wave * 0.05,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.45 * (1 - s), rot: 1.2 * (1 - s), dx: 0, anim: "idle" };
  }

  function pressPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.press));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.35, rot: s * -4.5, dx: 0, anim: "talk" };
    }
    if (u < 0.8) {
      const w = Math.sin(t * 2.1);
      return {
        lift: 0.35 + Math.abs(w) * 0.12,
        rot: -4.5 + w * 5.5,
        dx: w * 0.06,
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.35 * (1 - s), rot: -4.5 * (1 - s), dx: 0, anim: "sit" };
  }

  function tidePose(t) {
    return {
      lift: Math.abs(Math.sin(t * 1.25)) * 0.22 + 0.42,
      rot: 0.8 + Math.sin(t * 1.55) * 2.4,
      dx: Math.sin(t * 0.95) * 0.08,
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
    if (next.kind === "damp") {
      const pose = dampPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "press") {
      const pose = pressPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tidePose(next.t);
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
      kind === "bell"
        ? "sit"
        : kind === "oral"
          ? "talk"
          : kind === "lucent"
            ? "sit"
            : kind === "trail"
              ? "play"
              : kind === "medusa"
                ? "walk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "podia" ? "hold" : "go",
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

  function podiaPose(t) {
    const beat = Math.sin(t * 0.72) + 0.12 * Math.sin(t * 2.1);
    return {
      lift: 0.35 + Math.abs(Math.sin(t * 0.72)) * 0.18,
      rot: 0.9 + beat * 1.6,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.35 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.9 * (1 - u) };
  }

  function rightingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.righting));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.85, rot: s * 28 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.14) / 0.41;
      const twist = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * twist * 0.18,
        lift: 0.85 + Math.abs(twist) * 0.35,
        rot: facing * (28 + twist * 42),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.55) / 0.23;
      return {
        x: fromX,
        lift: 0.85 * (1 - s * 0.4),
        rot: facing * (28 * (1 - s) - 8 * s),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.5 * (1 - s),
      rot: facing * (-4 * (1 - s)),
      anim: "sit",
    };
  }

  function crawlPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.crawl));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 0.28, rot: s * 6 * facing, anim: "walk" };
    }
    if (u < 0.75) {
      const s = (u - 0.1) / 0.65;
      const step = Math.sin(s * Math.PI * 3.4);
      const lead = Math.sin(s * Math.PI * 1.1);
      return {
        x: fromX + facing * (lead * 1.15 + step * 0.12),
        lift: 0.28 + Math.abs(step) * 0.16,
        rot: facing * (6 + step * 5 + lead * 3),
        anim: "walk",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return {
      x: fromX + facing * 1.15 * (1 - s),
      lift: 0.28 * (1 - s),
      rot: facing * (3 * (1 - s)),
      anim: "idle",
    };
  }

  function evertPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.evert));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.15, rot: s * -5 * facing, anim: "talk" };
    }
    if (u < 0.72) {
      const s = (u - 0.16) / 0.56;
      const probe = Math.sin(s * Math.PI * 2.8);
      const flatten = Math.sin(s * Math.PI * 1.4);
      return {
        x: fromX + facing * flatten * 0.1,
        lift: 0.15 - Math.abs(flatten) * 0.08 + Math.abs(probe) * 0.06,
        rot: facing * (-5 + probe * 7 + flatten * 2),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.12 * (1 - s),
      rot: facing * (-2.5 * (1 - s)),
      anim: "sit",
    };
  }

  function pentaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.penta));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.4, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.12) / 0.58;
      const spoke = Math.sin(s * Math.PI * 5);
      const turn = Math.sin(s * Math.PI * 2);
      return {
        x: fromX + facing * turn * 0.14,
        lift: 0.4 + Math.abs(spoke) * 0.12,
        rot: facing * (12 + spoke * 8 + turn * 4),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 0.4 * (1 - s),
      rot: facing * (6 * (1 - s)),
      anim: "idle",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "righting" && trick.kind !== "crawl" && trick.kind !== "evert") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "podia") {
      if (next.t < PODIA_HOLD) {
        const pose = podiaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PODIA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PODIA_HOLD);
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
    if (next.kind === "righting") {
      const pose = rightingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "crawl") {
      const pose = crawlPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "evert") {
      const pose = evertPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pentaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    PODIA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    podiaPose,
    releasePose,
    rightingPose,
    crawlPose,
    evertPose,
    pentaPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    dampPose,
    pressPose,
    tidePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSeaStarTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
