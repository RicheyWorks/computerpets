/** Drown ground tricks while idle. House pitcher — peristome / cistern / brine / operculum / urn personality (slippery peristome rim shine on the blotter — never named rim as vague noun-only / slip / slick / wet / flare (Coin owns flare) / sheen (Disk owns sheen) / nectar (Disk owns nectar), rain cistern pool filling the cup — never named pool as vague / rain as happy-only / fill (Drown window owns FILL) / sip (window) / drink (window) / soak (Ink owns soak) / dew (Disk owns dew), drowning brine well hush in the cup — never named hush as shared verb-only / well as roster name / drown as guest alias / stew (Snap owns stew) / digest / enzyme / liquor / flood / pitfall as vague, operculum lid nod under the lamp — never named lid as vague / nod (ethogram / Sol owns nod) / hood (Bluff owns hood) / tip (window) / lean (ethogram / Still window) / gape (Door window / Bluff) / spike (Moth owns spike) / bark (Moth owns bark), carnivorous urn desk life as a passive pitfall; not Snap clamp/trichome/stew/unseal/poise, Arm rib/branch/nocturne/areole/sentinel, Moth labellum/velamen/column/spike/bark, Disk pad/corolla/rhizome/calyx/sheen, Mast acorn/sinus/gall/taproot/bole, Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web pitcher-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, ginkgo/Fan, oak/Mast, water-lily/Disk, moth-orchid/Moth, saguaro/Arm, venus-flytrap/Snap, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play FILL unchanged — never names fill. Special / ethogram snap/lean/nod unchanged — never names snap/lean/nod as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Fan owns biloba/notch/flutter/drop/amber and ochre/gilt/linger; Mast owns acorn/sinus/gall/taproot/bole and cupule/tannin/grove; Disk owns pad/corolla/rhizome/calyx/sheen and silt/nectar/dew; Moth owns labellum/velamen/column/spike/bark and pollen/perfume/pearl; Arm owns rib/branch/nocturne/areole/sentinel and monsoon/creosote/agave; Snap owns clamp/trichome/stew/unseal/poise and gnat/peat/crimson; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root/bristle; Coin owns flare; Phoenix owns lift; Fuse owns snap/pulse as thank-yous; Chamber owns quiet as thank-you and pearl as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you and sway/heat as tricks; Parrot owns fan; Kite owns lobe; Bloom owns gill; Blush owns mesa/arroyo. Carnivorous bog pitfall desk life only — not a venus-flytrap Snap copy, saguaro Arm copy, moth-orchid Moth copy, water-lily Disk copy, oak Mast copy, ginkgo Fan copy, fern Vein copy, bryophyte Felt copy, iguana Sol copy, or rosy-boa Blush mesa copy. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "pitcher";
  const TRICKS = ["peristome", "cistern", "brine", "operculum", "urn"];
  const HAPPY = ["midge", "rain", "maroon"];
  const HAPPY_DUR = { midge: 1.2, rain: 1.34, maroon: 1.4 };
  const URN_HOLD = 13.1;
  const RELEASE_S = 0.80;
  const DUR = { urn: URN_HOLD + RELEASE_S, peristome: 1.18, cistern: 1.42, brine: 1.66, operculum: 1.54 };

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
    if (kind === "urn") return 52 + roll * 30;
    if (kind === "brine") return 18 + roll * 12;
    if (kind === "cistern") return 15 + roll * 10;
    return justFinished ? 11 + roll * 8 : 5.6 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "urn";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "urn") {
      if (roll < 0.26) return "peristome";
      if (roll < 0.48) return "brine";
      if (roll < 0.72) return "cistern";
      return "operculum";
    }
    if (lastKind === "peristome") {
      if (roll < 0.28) return "urn";
      if (roll < 0.5) return "brine";
      if (roll < 0.72) return "cistern";
      return "operculum";
    }
    if (lastKind === "brine") {
      if (roll < 0.22) return "urn";
      if (roll < 0.44) return "peristome";
      if (roll < 0.66) return "cistern";
      return "operculum";
    }
    if (roll < 0.2) return "urn";
    if (roll < 0.4) return "peristome";
    if (roll < 0.6) return "brine";
    if (roll < 0.8) return "cistern";
    return "operculum";
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
    return key === TRICK_KEY || key === "drown";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "midge";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "midge" ? "play" : name === "rain" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function midgePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.midge));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.1, rot: s * 2.6, dx: 0, anim: "play" };
    }
    if (u < 0.64) {
      const buzz = Math.sin(t * 8.4);
      return {
        lift: 0.1 + Math.abs(buzz) * 0.045,
        rot: 2.6 + buzz * 3.8,
        dx: buzz * 0.01,
        anim: "play",
      };
    }
    const s = (u - 0.64) / 0.36;
    return { lift: 0.07 * (1 - s), rot: 1.4 * (1 - s), dx: 0, anim: "idle" };
  }
  function rainPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.rain));
    if (u < 0.22) {
      const s = u / 0.22;
      return { lift: s * -0.028, rot: s * -1.1, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      const drop = Math.sin(t * 0.85);
      return {
        lift: -0.028 + Math.abs(drop) * 0.02,
        rot: -1.1 + drop * 1.1,
        dx: drop * 0.005,
        anim: "sit",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: -0.016 * (1 - s), rot: -0.7 * (1 - s), dx: 0, anim: "sit" };
  }
  function maroonPose(t) {
    return {
      lift: 0.035 + Math.abs(Math.sin(t * 0.78)) * 0.048,
      rot: Math.sin(t * 0.92) * 2.1,
      dx: Math.sin(t * 0.48) * 0.014,
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
    if (next.kind === "midge") {
      const pose = midgePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "rain") {
      const pose = rainPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = maroonPose(next.t);
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
      kind === "urn"
        ? "sit"
        : kind === "peristome"
          ? "play"
          : kind === "cistern"
            ? "sit"
            : kind === "brine"
              ? "sit"
              : kind === "operculum"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "urn" ? "hold" : "go",
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

  function urnPose(t) {
    const breath = Math.sin(t * 0.18) + 0.022 * Math.sin(t * 0.95);
    return {
      lift: 0.022 + Math.abs(Math.sin(t * 0.27)) * 0.012,
      rot: 0.4 + breath * 0.55,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.4 * (1 - u) };
  }

  function peristomePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.peristome));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.055, rot: s * 2.4 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const slick = Math.sin(t * 11.2) + 0.4 * Math.sin(t * 17.5);
      return {
        x: fromX + facing * slick * 0.005,
        lift: 0.055 + Math.abs(slick) * 0.022,
        rot: facing * (2.4 + slick * 3.0),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.055 * (1 - s),
      rot: facing * (1.0 * (1 - s)),
      anim: "sit",
    };
  }
  function cisternPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cistern));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * -0.035, rot: s * -2.2 * facing, anim: "sit" };
    }
    if (u < 0.75) {
      const s = (u - 0.2) / 0.55;
      const fill = Math.sin(s * Math.PI * 1.3);
      return {
        x: fromX - facing * 0.008 * s,
        lift: -0.035 + fill * 0.012,
        rot: facing * (-2.2 - s * 1.4 + fill * 0.7),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return {
      x: fromX - facing * 0.008 * (1 - s),
      lift: -0.035 * (1 - s),
      rot: facing * (-2.8 * (1 - s)),
      anim: "sit",
    };
  }
  function brinePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.brine));
    if (u < 0.24) {
      const s = smoothstep(u / 0.24);
      return { x: fromX, lift: s * -0.045, rot: s * -2.8 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.24) / 0.48;
      const hush = Math.sin(s * Math.PI * 1.1);
      return {
        x: fromX - facing * 0.01 * s,
        lift: -0.045 + hush * 0.008,
        rot: facing * (-2.8 - s * 1.6 + hush * 0.55),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX - facing * 0.01 * (1 - s),
      lift: -0.045 * (1 - s),
      rot: facing * (-3.4 * (1 - s)),
      anim: "sit",
    };
  }
  function operculumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.operculum));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.03, rot: s * -4.2 * facing, anim: "talk" };
    }
    if (u < 0.5) {
      const s = smoothstep((u - 0.18) / 0.32);
      return {
        x: fromX + facing * s * 0.012,
        lift: 0.03 + s * 0.08,
        rot: facing * (-4.2 + s * 10.5),
        anim: "talk",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.5) / 0.32;
      const flap = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * (0.012 + flap * 0.006),
        lift: 0.11 + Math.abs(flap) * 0.025,
        rot: facing * (6.3 + flap * 2.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.11 * (1 - s),
      rot: facing * (3.5 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "peristome" && trick.kind !== "cistern" && trick.kind !== "brine" && trick.kind !== "operculum") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "urn") {
      if (next.t < URN_HOLD) {
        const pose = urnPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < URN_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - URN_HOLD);
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
    if (next.kind === "peristome") {
      const pose = peristomePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cistern") {
      const pose = cisternPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "brine") {
      const pose = brinePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = operculumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    URN_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    urnPose,
    releasePose,
    peristomePose,
    cisternPose,
    brinePose,
    operculumPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    midgePose,
    rainPose,
    maroonPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPitcherTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
