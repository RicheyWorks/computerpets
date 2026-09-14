/** Disk ground tricks while idle. House water_lily — pad / corolla / rhizome / calyx / sheen personality (pad float on the ink dish — never named drift (Coin owns drift) / float as coin-collision / flutter (Fan owns flutter) / biloba (Fan owns biloba), corolla bloom open on the lamp — never named open (Disk window owns open) / bloom as axolotl-guest collision / unfurl (Vein window owns unfurl) / flare (Coin owns flare), rhizome quiet settle under the pad — never named root (Burr owns root) / dig (Rabbit owns dig) / taproot (Mast owns taproot) / crawl (Cling owns crawl), petal calyx cup on the dish — never named cup (Cup guest / Octopus) / saucer (Vein owns saucer) / pouch (Anchor owns pouch), pond-surface sheen desk life under the lamp; not Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web water_lily-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, ginkgo/Fan, oak/Mast, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play OPEN unchanged — never names open. Special open/nod/lean ethogram unchanged — never names open/nod/lean as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Fan owns biloba/notch/flutter/drop/amber and ochre/gilt/linger; Mast owns acorn/sinus/gall/taproot/bole and cupule/tannin/grove; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you and sway as trick; Parrot owns fan; Kite owns lobe; Bloom owns gill. Aquatic pad/bloom desk life only — not an oak copy, ginkgo copy, fern maidenhair copy, bryophyte moss copy, jelly Pulse copy, or goldfish Coin copy. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "water_lily";
  const TRICKS = ["pad", "corolla", "rhizome", "calyx", "sheen"];
  const HAPPY = ["silt", "nectar", "dew"];
  const HAPPY_DUR = { silt: 1.24, nectar: 1.18, dew: 1.28 };
  const SHEEN_HOLD = 12.5;
  const RELEASE_S = 0.78;
  const DUR = { sheen: SHEEN_HOLD + RELEASE_S, pad: 1.48, corolla: 1.56, rhizome: 1.34, calyx: 1.28 };

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
    if (kind === "sheen") return 50 + roll * 30;
    if (kind === "pad") return 15 + roll * 10;
    if (kind === "corolla") return 16 + roll * 11;
    return justFinished ? 10.8 + roll * 8 : 5.4 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "sheen";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "sheen") {
      if (roll < 0.26) return "pad";
      if (roll < 0.48) return "corolla";
      if (roll < 0.72) return "rhizome";
      return "calyx";
    }
    if (lastKind === "pad") {
      if (roll < 0.28) return "sheen";
      if (roll < 0.5) return "corolla";
      if (roll < 0.72) return "rhizome";
      return "calyx";
    }
    if (lastKind === "corolla") {
      if (roll < 0.22) return "sheen";
      if (roll < 0.44) return "pad";
      if (roll < 0.66) return "rhizome";
      return "calyx";
    }
    if (roll < 0.2) return "sheen";
    if (roll < 0.4) return "pad";
    if (roll < 0.6) return "corolla";
    if (roll < 0.8) return "rhizome";
    return "calyx";
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
    return key === TRICK_KEY || key === "disk";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "silt";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "silt" ? "sit" : name === "nectar" ? "play" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function siltPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.silt));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.04, rot: s * 1.6, dx: 0, anim: "sit" };
    }
    if (u < 0.76) {
      const silt = Math.sin(t * 1.15);
      return {
        lift: 0.04 + Math.abs(silt) * 0.025,
        rot: 1.6 + silt * 1.3,
        dx: silt * 0.01,
        anim: "sit",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.03 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "sit" };
  }
  function nectarPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nectar));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.16, rot: s * -2.2, dx: 0, anim: "play" };
    }
    if (u < 0.72) {
      const sweet = Math.sin(t * 1.9);
      return {
        lift: 0.16 + Math.abs(sweet) * 0.045,
        rot: -2.2 + sweet * 2.6,
        dx: sweet * 0.02,
        anim: "play",
      };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.11 * (1 - s), rot: -1.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function dewPose(t) {
    return {
      lift: 0.022 + Math.abs(Math.sin(t * 0.55)) * 0.032,
      rot: Math.sin(t * 0.7) * 1.4,
      dx: Math.sin(t * 0.4) * 0.02,
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
    if (next.kind === "silt") {
      const pose = siltPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "nectar") {
      const pose = nectarPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dewPose(next.t);
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
      kind === "sheen"
        ? "sit"
        : kind === "pad"
          ? "sit"
          : kind === "corolla"
            ? "talk"
            : kind === "rhizome"
              ? "play"
              : kind === "calyx"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "sheen" ? "hold" : "go",
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

  function sheenPose(t) {
    const breath = Math.sin(t * 0.28) + 0.04 * Math.sin(t * 1.15);
    return {
      lift: 0.03 + Math.abs(Math.sin(t * 0.35)) * 0.024,
      rot: -0.5 + breath * 0.85,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.03 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.5 * (1 - u) };
  }

  function padPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pad));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.045, rot: s * -1.8 * facing, anim: "sit" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const float = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * float * 0.045,
        lift: 0.045 + Math.abs(float) * 0.035,
        rot: facing * (-1.8 + float * 3.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.045 * (1 - s),
      rot: facing * (-1.0 * (1 - s)),
      anim: "sit",
    };
  }
  function corollaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.corolla));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.08, rot: s * -6.5 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const open = smoothstep(s);
      return {
        x: fromX + facing * open * 0.012,
        lift: 0.08 + open * 0.1,
        rot: facing * (-6.5 + open * 12.5),
        anim: "talk",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const hold = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * hold * 0.015,
        lift: 0.18 + Math.abs(hold) * 0.03,
        rot: facing * (6.0 + hold * 2.4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.18 * (1 - s),
      rot: facing * (4.0 * (1 - s)),
      anim: "sit",
    };
  }
  function rhizomePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rhizome));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.09, rot: s * 3.2 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.14) / 0.41;
      const settle = smoothstep(s);
      return {
        x: fromX + facing * settle * 0.055,
        lift: 0.09 * (1 - settle * 0.55),
        rot: facing * (3.2 - settle * 4.6),
        anim: "play",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const quiet = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + facing * (0.055 + quiet * 0.012),
        lift: 0.04 + Math.abs(quiet) * 0.02,
        rot: facing * (-1.4 + quiet * 1.8),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.055 * (1 - s),
      lift: 0.03 * (1 - s),
      rot: facing * (-0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function calyxPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.calyx));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.1, rot: s * 3.8 * facing, anim: "talk" };
    }
    if (u < 0.7) {
      const s = (u - 0.15) / 0.55;
      const cup = Math.sin(s * Math.PI * 3.4);
      return {
        x: fromX + facing * cup * 0.016,
        lift: 0.1 + Math.abs(cup) * 0.055,
        rot: facing * (3.8 + cup * 5.5),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 0.1 * (1 - s),
      rot: facing * (2.2 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "pad" && trick.kind !== "corolla" && trick.kind !== "rhizome" && trick.kind !== "calyx") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "sheen") {
      if (next.t < SHEEN_HOLD) {
        const pose = bolePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < SHEEN_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - SHEEN_HOLD);
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
    if (next.kind === "pad") {
      const pose = padPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "corolla") {
      const pose = corollaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rhizome") {
      const pose = rhizomePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = calyxPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    SHEEN_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    sheenPose,
    releasePose,
    padPose,
    corollaPose,
    rhizomePose,
    calyxPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    siltPose,
    nectarPose,
    dewPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWaterLilyTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
