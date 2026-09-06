/** Dew ground tricks while idle. House sundew — mucilage / tentacle / digest / gland / rosette personality (mucilage glitter of sticky droplets on the blotter — never named glitter as happy-only / dew (Disk owns dew) / nectar (Disk owns nectar) / bead (Felt owns bead) / drop (Fan owns drop) / sheen (Disk owns sheen) / flare (Coin owns flare) / glue (special) / sticky as vague adjective-only, tentacle curl reach under the lamp — never named curl (Burr owns curl / ethogram / Dew window CURL) / uncurl (window leave) / trichome (Snap owns trichome) / bristle (Burr owns bristle) / lobe (Kite owns lobe) / clamp (Snap owns clamp) / coil (Anchor owns coil), slow digest hush after the catch — never named hush as shared verb-only / stew (Snap owns stew) / brine (Drown owns brine) / enzyme as vague / soak (Ink owns soak) / nectar (Disk) / peat (Snap happy), gland tip nod of a mucilage head — never named nod (ethogram / Sol owns nod) / tip (Drown window) / hair / spike (Moth owns spike) / bark (Moth owns bark) / areole (Arm owns areole), carnivorous rosette desk life as a Drosera peat-saucer plant; not Snap clamp/trichome/stew/unseal/poise, Drown peristome/cistern/brine/operculum/urn, Arm rib/branch/nocturne/areole/sentinel, Moth labellum/velamen/column/spike/bark, Disk pad/corolla/rhizome/calyx/sheen, Mast acorn/sinus/gall/taproot/bole, Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, Burr curl, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web sundew-tricks.ts. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, ginkgo/Fan, oak/Mast, water-lily/Disk, moth-orchid/Moth, saguaro/Arm, venus-flytrap/Snap, pitcher/Drown, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play CURL unchanged — never names curl. Special glue / ethogram curl/lean/nod unchanged — never names glue/curl/lean/nod as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Fan owns biloba/notch/flutter/drop/amber and ochre/gilt/linger; Mast owns acorn/sinus/gall/taproot/bole and cupule/tannin/grove; Disk owns pad/corolla/rhizome/calyx/sheen and silt/nectar/dew; Moth owns labellum/velamen/column/spike/bark and pollen/perfume/pearl; Arm owns rib/branch/nocturne/areole/sentinel and monsoon/creosote/agave; Snap owns clamp/trichome/stew/unseal/poise and gnat/peat/crimson; Drown owns peristome/cistern/brine/operculum/urn and midge/rain/maroon; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns curl/root/bristle; Coin owns flare; Phoenix owns lift; Fuse owns snap/pulse as thank-yous; Chamber owns quiet as thank-you and pearl as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you and sway/heat as tricks; Parrot owns fan; Kite owns lobe; Bloom owns gill; Blush owns mesa/arroyo; Ground dragon owns gleam as thank-you. Carnivorous Drosera peat-saucer desk life only — not a venus-flytrap Snap copy, pitcher Drown copy, saguaro Arm copy, moth-orchid Moth copy, water-lily Disk copy, oak Mast copy, ginkgo Fan copy, fern Vein copy, bryophyte Felt copy, iguana Sol copy, or rosy-boa Blush mesa copy. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "sundew";
  const TRICKS = ["mucilage", "tentacle", "digest", "gland", "rosette"];
  const HAPPY = ["glitter", "ruby", "syrup"];
  const HAPPY_DUR = { glitter: 1.22, ruby: 1.32, syrup: 1.38 };
  const ROSETTE_HOLD = 12.8;
  const RELEASE_S = 0.76;
  const DUR = { rosette: ROSETTE_HOLD + RELEASE_S, mucilage: 1.16, tentacle: 1.38, digest: 1.64, gland: 1.5 };

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
    if (kind === "rosette") return 52 + roll * 30;
    if (kind === "digest") return 18 + roll * 12;
    if (kind === "tentacle") return 15 + roll * 10;
    return justFinished ? 11 + roll * 8 : 5.6 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "rosette";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "rosette") {
      if (roll < 0.26) return "mucilage";
      if (roll < 0.48) return "digest";
      if (roll < 0.72) return "tentacle";
      return "gland";
    }
    if (lastKind === "mucilage") {
      if (roll < 0.28) return "rosette";
      if (roll < 0.5) return "digest";
      if (roll < 0.72) return "tentacle";
      return "gland";
    }
    if (lastKind === "digest") {
      if (roll < 0.22) return "rosette";
      if (roll < 0.44) return "mucilage";
      if (roll < 0.66) return "tentacle";
      return "gland";
    }
    if (roll < 0.2) return "rosette";
    if (roll < 0.4) return "mucilage";
    if (roll < 0.6) return "digest";
    if (roll < 0.8) return "tentacle";
    return "gland";
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
    return key === TRICK_KEY || key === "dew";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "glitter";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "glitter" ? "play" : name === "ruby" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function glitterPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.glitter));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.09, rot: s * 2.4, dx: 0, anim: "play" };
    }
    if (u < 0.7) {
      const spark = Math.sin(t * 10.2) + 0.35 * Math.sin(t * 16.8);
      return {
        lift: 0.09 + Math.abs(spark) * 0.04,
        rot: 2.4 + spark * 3.4,
        dx: spark * 0.009,
        anim: "play",
      };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: 0.06 * (1 - s), rot: 1.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function rubyPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ruby));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * -0.03, rot: s * -1.3, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const flush = Math.sin(t * 0.9);
      return {
        lift: -0.03 + Math.abs(flush) * 0.022,
        rot: -1.3 + flush * 1.4,
        dx: flush * 0.006,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: -0.018 * (1 - s), rot: -0.8 * (1 - s), dx: 0, anim: "sit" };
  }
  function syrupPose(t) {
    return {
      lift: 0.03 + Math.abs(Math.sin(t * 0.72)) * 0.05,
      rot: Math.sin(t * 0.86) * 2.3,
      dx: Math.sin(t * 0.44) * 0.013,
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
    if (next.kind === "glitter") {
      const pose = glitterPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ruby") {
      const pose = rubyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = syrupPose(next.t);
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
      kind === "rosette"
        ? "sit"
        : kind === "mucilage"
          ? "play"
          : kind === "tentacle"
            ? "talk"
            : kind === "digest"
              ? "sit"
              : kind === "gland"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "rosette" ? "hold" : "go",
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

  function rosettePose(t) {
    const breath = Math.sin(t * 0.17) + 0.02 * Math.sin(t * 0.9);
    return {
      lift: 0.02 + Math.abs(Math.sin(t * 0.25)) * 0.011,
      rot: 0.35 + breath * 0.5,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.02 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.35 * (1 - u) };
  }

  function mucilagePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mucilage));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.06, rot: s * 2.6 * facing, anim: "play" };
    }
    if (u < 0.8) {
      const spark = Math.sin(t * 12.4) + 0.45 * Math.sin(t * 19.2);
      return {
        x: fromX + facing * spark * 0.0045,
        lift: 0.06 + Math.abs(spark) * 0.024,
        rot: facing * (2.6 + spark * 3.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.06 * (1 - s),
      rot: facing * (1.1 * (1 - s)),
      anim: "sit",
    };
  }
  function tentaclePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tentacle));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.04, rot: s * 3.2 * facing, anim: "talk" };
    }
    if (u < 0.72) {
      const s = (u - 0.18) / 0.54;
      const bend = Math.sin(s * Math.PI * 1.15);
      return {
        x: fromX + facing * 0.014 * s,
        lift: 0.04 + bend * 0.055,
        rot: facing * (3.2 + s * 5.5 + bend * 1.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.014 * (1 - s),
      lift: 0.04 * (1 - s),
      rot: facing * (5.5 * (1 - s)),
      anim: "sit",
    };
  }
  function digestPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.digest));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: s * -0.048, rot: s * -2.6 * facing, anim: "sit" };
    }
    if (u < 0.74) {
      const s = (u - 0.22) / 0.52;
      const hush = Math.sin(s * Math.PI * 1.05);
      return {
        x: fromX - facing * 0.009 * s,
        lift: -0.048 + hush * 0.007,
        rot: facing * (-2.6 - s * 1.5 + hush * 0.5),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
      x: fromX - facing * 0.009 * (1 - s),
      lift: -0.048 * (1 - s),
      rot: facing * (-3.2 * (1 - s)),
      anim: "sit",
    };
  }
  function glandPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gland));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.028, rot: s * -3.6 * facing, anim: "talk" };
    }
    if (u < 0.48) {
      const s = smoothstep((u - 0.16) / 0.32);
      return {
        x: fromX + facing * s * 0.01,
        lift: 0.028 + s * 0.07,
        rot: facing * (-3.6 + s * 9.2),
        anim: "talk",
      };
    }
    if (u < 0.8) {
      const s = (u - 0.48) / 0.32;
      const tip = Math.sin(s * Math.PI * 2.0);
      return {
        x: fromX + facing * (0.01 + tip * 0.005),
        lift: 0.098 + Math.abs(tip) * 0.022,
        rot: facing * (5.6 + tip * 2.4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.098 * (1 - s),
      rot: facing * (3.0 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "mucilage" && trick.kind !== "tentacle" && trick.kind !== "digest" && trick.kind !== "gland") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "rosette") {
      if (next.t < ROSETTE_HOLD) {
        const pose = rosettePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ROSETTE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ROSETTE_HOLD);
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
    if (next.kind === "mucilage") {
      const pose = mucilagePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tentacle") {
      const pose = tentaclePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "digest") {
      const pose = digestPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = glandPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    ROSETTE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    rosettePose,
    releasePose,
    mucilagePose,
    tentaclePose,
    digestPose,
    glandPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    glitterPose,
    rubyPose,
    syrupPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSundewTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
