/** Snap ground tricks while idle. House venus_flytrap — clamp / trichome / stew / unseal / poise personality (lobe clamp snap on the blotter — never named snap (special / Fuse thank-you / ethogram / snapper window) / lobe (Kite owns lobe) / shut (window phase) / count (Snap window owns COUNT) / rib (Arm owns rib) / branch (Arm owns branch), trigger-hair trichome tingle — never named trigger as vague verb-only / hair / bristle (Burr owns bristle) / tickle / probe (Saffron owns probe) / nod (ethogram / Sol owns nod), digestive stew hush on the closed trap — never named hush as shared verb-only / digest / enzyme / nectar (Disk owns nectar) / dew (Disk owns dew) / soak (Ink owns soak), unseal open-reset after the meal — never named open (Disk window owns open) / reset / gape (Door window / Bluff) / flare (Coin owns flare) / nocturne (Arm owns nocturne) / spike (Moth owns spike) / corolla (Disk owns corolla), carnivorous poise desk life under the lamp; not Arm rib/branch/nocturne/areole/sentinel, Moth labellum/velamen/column/spike/bark, Disk pad/corolla/rhizome/calyx/sheen, Mast acorn/sinus/gall/taproot/bole, Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web venus_flytrap-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, ginkgo/Fan, oak/Mast, water-lily/Disk, moth-orchid/Moth, saguaro/Arm, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play COUNT unchanged — never names count. Special snap / ethogram snap/lean/nod unchanged — never names snap/lean/nod as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Fan owns biloba/notch/flutter/drop/amber and ochre/gilt/linger; Mast owns acorn/sinus/gall/taproot/bole and cupule/tannin/grove; Disk owns pad/corolla/rhizome/calyx/sheen and silt/nectar/dew; Moth owns labellum/velamen/column/spike/bark and pollen/perfume/pearl; Arm owns rib/branch/nocturne/areole/sentinel and monsoon/creosote/agave; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root/bristle; Coin owns flare; Phoenix owns lift; Fuse owns snap/pulse as thank-yous; Chamber owns quiet as thank-you and pearl as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you and sway/heat as tricks; Parrot owns fan; Kite owns lobe; Bloom owns gill; Blush owns mesa/arroyo. Carnivorous bog desk life only — not a saguaro Arm copy, moth-orchid Moth copy, water-lily Disk copy, oak Mast copy, ginkgo Fan copy, fern Vein copy, bryophyte Felt copy, iguana Sol copy, or rosy-boa Blush mesa copy. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "venus_flytrap";
  const TRICKS = ["clamp", "trichome", "stew", "unseal", "poise"];
  const HAPPY = ["gnat", "peat", "crimson"];
  const HAPPY_DUR = { gnat: 1.18, peat: 1.3, crimson: 1.36 };
  const POISE_HOLD = 12.6;
  const RELEASE_S = 0.78;
  const DUR = { poise: POISE_HOLD + RELEASE_S, clamp: 1.12, trichome: 1.28, stew: 1.58, unseal: 1.72 };

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
    if (kind === "poise") return 50 + roll * 28;
    if (kind === "clamp") return 14 + roll * 9;
    if (kind === "stew") return 17 + roll * 11;
    return justFinished ? 10.8 + roll * 8 : 5.5 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "poise";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "poise") {
      if (roll < 0.26) return "clamp";
      if (roll < 0.48) return "stew";
      if (roll < 0.72) return "trichome";
      return "unseal";
    }
    if (lastKind === "clamp") {
      if (roll < 0.28) return "poise";
      if (roll < 0.5) return "stew";
      if (roll < 0.72) return "trichome";
      return "unseal";
    }
    if (lastKind === "stew") {
      if (roll < 0.22) return "poise";
      if (roll < 0.44) return "clamp";
      if (roll < 0.66) return "trichome";
      return "unseal";
    }
    if (roll < 0.2) return "poise";
    if (roll < 0.4) return "clamp";
    if (roll < 0.6) return "stew";
    if (roll < 0.8) return "trichome";
    return "unseal";
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
    return key === TRICK_KEY || key === "snap";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "gnat";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "gnat" ? "play" : name === "peat" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function gnatPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gnat));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.12, rot: s * 3.2, dx: 0, anim: "play" };
    }
    if (u < 0.62) {
      const buzz = Math.sin(t * 9.2);
      return {
        lift: 0.12 + Math.abs(buzz) * 0.05,
        rot: 3.2 + buzz * 4.8,
        dx: buzz * 0.012,
        anim: "play",
      };
    }
    const s = (u - 0.62) / 0.38;
    return { lift: 0.08 * (1 - s), rot: 1.6 * (1 - s), dx: 0, anim: "idle" };
  }
  function peatPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.peat));
    if (u < 0.24) {
      const s = u / 0.24;
      return { lift: s * -0.02, rot: s * -1.4, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const bog = Math.sin(t * 0.72);
      return {
        lift: -0.02 + Math.abs(bog) * 0.018,
        rot: -1.4 + bog * 0.9,
        dx: bog * 0.006,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: -0.014 * (1 - s), rot: -0.8 * (1 - s), dx: 0, anim: "sit" };
  }
  function crimsonPose(t) {
    return {
      lift: 0.04 + Math.abs(Math.sin(t * 0.9)) * 0.05,
      rot: Math.sin(t * 1.05) * 2.4,
      dx: Math.sin(t * 0.55) * 0.016,
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
    if (next.kind === "gnat") {
      const pose = gnatPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "peat") {
      const pose = peatPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = crimsonPose(next.t);
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
      kind === "poise"
        ? "sit"
        : kind === "clamp"
          ? "play"
          : kind === "trichome"
            ? "sit"
            : kind === "stew"
              ? "sit"
              : kind === "unseal"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "poise" ? "hold" : "go",
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

  function poisePose(t) {
    const breath = Math.sin(t * 0.2) + 0.025 * Math.sin(t * 1.1);
    return {
      lift: 0.028 + Math.abs(Math.sin(t * 0.31)) * 0.014,
      rot: 0.55 + breath * 0.7,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.55 * (1 - u) };
  }

  function clampPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.clamp));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.05, rot: s * 2.2 * facing, anim: "play" };
    }
    if (u < 0.38) {
      const s = smoothstep((u - 0.14) / 0.24);
      return {
        x: fromX + facing * s * 0.01,
        lift: 0.05 - s * 0.09,
        rot: facing * (2.2 - s * 11.5),
        anim: "play",
      };
    }
    if (u < 0.72) {
      const s = (u - 0.38) / 0.34;
      const hold = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * (0.01 + hold * 0.004),
        lift: -0.04 + Math.abs(hold) * 0.012,
        rot: facing * (-9.3 + hold * 1.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: -0.04 * (1 - s),
      rot: facing * (-5.0 * (1 - s)),
      anim: "sit",
    };
  }
  function trichomePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.trichome));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.035, rot: s * 1.2 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const tick = Math.sin(t * 14.5) + 0.35 * Math.sin(t * 23);
      return {
        x: fromX + facing * tick * 0.004,
        lift: 0.035 + Math.abs(tick) * 0.02,
        rot: facing * (1.2 + tick * 2.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.035 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function stewPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stew));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: s * -0.03, rot: s * -3.6 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const hush = Math.sin(s * Math.PI * 1.4);
      return {
        x: fromX - facing * 0.012 * s,
        lift: -0.03 + hush * 0.01,
        rot: facing * (-3.6 - s * 2.2 + hush * 0.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX - facing * 0.012 * (1 - s),
      lift: -0.03 * (1 - s),
      rot: facing * (-4.4 * (1 - s)),
      anim: "sit",
    };
  }
  function unsealPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.unseal));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * -0.025, rot: s * -5.5 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = smoothstep((u - 0.2) / 0.35);
      return {
        x: fromX + facing * s * 0.018,
        lift: -0.025 + s * 0.22,
        rot: facing * (-5.5 + s * 12.8),
        anim: "talk",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const open = Math.sin(s * Math.PI * 1.5);
      return {
        x: fromX + facing * (0.018 + open * 0.008),
        lift: 0.195 + Math.abs(open) * 0.03,
        rot: facing * (7.3 + open * 2.2),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.195 * (1 - s),
      rot: facing * (4.2 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "clamp" && trick.kind !== "trichome" && trick.kind !== "stew" && trick.kind !== "unseal") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "poise") {
      if (next.t < POISE_HOLD) {
        const pose = poisePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < POISE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - POISE_HOLD);
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
    if (next.kind === "clamp") {
      const pose = clampPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "trichome") {
      const pose = trichomePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "stew") {
      const pose = stewPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = unsealPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    POISE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    poisePose,
    releasePose,
    clampPose,
    trichomePose,
    stewPose,
    unsealPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    gnatPose,
    peatPose,
    crimsonPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetVenusFlytrapTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
