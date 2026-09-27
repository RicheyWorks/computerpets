/** Moth ground tricks while idle — ultra-polish pass. House orchid — labellum / velamen / column / spike / bark / keiki / pollinia personality (labellum landing on the bark mount — never named pad (Disk owns pad) / corolla (Disk owns corolla) / flutter (Fan owns flutter) / drop (Fan owns drop), velamen aerial-root sip on the mist — never named root (Burr owns root) / rhizome (Disk owns rhizome) / taproot (Mast owns taproot) / siphon (Anchor owns siphon) / crawl (Cling owns crawl), column pose on the stem — never named rachis (Vein owns rachis) / bole (Mast owns bole) / hinge (Door owns hinge), spike slow bloom on the lamp — never named bloom as axolotl-guest collision / open (Disk window owns open) / unfurl (Vein window owns unfurl) / corolla (Disk owns corolla) / flare (Coin owns flare) / nod as ethogram-old, bark-mount desk life under the lamp, keiki Phalaenopsis baby-plantlet sprout on the spike (species-true Phalaenopsis keiki — never named sprout (Bloom owns sprout) / seedling / pup / offset as copy), pollinia orchid pollen-packet dab (species-true Orchidaceae pollinia — never named pollen as the thank-you / nectary (Sip owns nectary) / flare (Coin owns flare) / dust); not Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Keiki is the iconic Phalaenopsis plantlet on the spent spike (not Bloom sprout). Pollinia is the orchid pollen mass (not Moth thank-you pollen, not Sip nectary). Window-play MOUNT unchanged — never names mount as a trick. Ethogram keeps bark sit_hold; adds labellum/velamen/column/spike/keiki/pollinia softs + freeze (replaces thin unfurl/lean/nod). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via orchid.wav. Thank-yous pollen / perfume / amabilis. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web orchid-tricks.ts. True house-moth-orchid desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/drift/float/bloom/cup/siphon/soak/sprout/nectary name collisions. Bird ultra (Soot→Ember) + Miso→Disk done; skip Rui + birds. Next guest ultra is Arm / saguaro. No cry inventing beyond house orchid.wav prefer. Never retouch Rui sprites. */
(function (root) {
  const TRICK_KEY = "orchid";
  const TRICKS = ["labellum", "velamen", "column", "spike", "bark", "keiki", "pollinia"];
  const HAPPY = ["pollen", "perfume", "amabilis"];

  const HAPPY_DUR = {
    pollen: 1.70,
    perfume: 1.84,
    amabilis: 1.76,
  };

  /** Bark hold — Moth parks epiphyte-mount calm on the blotter. Not window-play MOUNT. */
  const BARK_HOLD = 11.2;
  const RELEASE_S = 1.18;

  const DUR = {
    bark: BARK_HOLD + RELEASE_S,
    labellum: 2.48,
    velamen: 2.42,
    column: 2.40,
    spike: 2.44,
    keiki: 2.38,
    pollinia: 2.56,
  };

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
    if (kind === "bark") return 38 + roll * 24;
    if (kind === "keiki" || kind === "pollinia" || kind === "spike") return 12 + roll * 9;
    if (kind === "labellum" || kind === "velamen" || kind === "column") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "bark";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "bark") {
      if (roll < 0.18) return "labellum";
      if (roll < 0.34) return "velamen";
      if (roll < 0.5) return "column";
      if (roll < 0.66) return "spike";
      if (roll < 0.83) return "keiki";
      return "pollinia";
    }
    if (lastKind === "labellum") {
      if (roll < 0.2) return "bark";
      if (roll < 0.36) return "velamen";
      if (roll < 0.52) return "column";
      if (roll < 0.68) return "spike";
      if (roll < 0.84) return "keiki";
      return "pollinia";
    }
    if (lastKind === "spike") {
      if (roll < 0.18) return "bark";
      if (roll < 0.34) return "labellum";
      if (roll < 0.5) return "velamen";
      if (roll < 0.66) return "column";
      if (roll < 0.83) return "keiki";
      return "pollinia";
    }
    if (lastKind === "keiki" || lastKind === "pollinia") {
      if (roll < 0.16) return "bark";
      if (roll < 0.32) return "labellum";
      if (roll < 0.48) return "velamen";
      if (roll < 0.64) return "column";
      if (roll < 0.8) return "spike";
      return lastKind === "keiki" ? ("pollinia") : ("keiki");
    }
    if (roll < 0.14) return "bark";
    if (roll < 0.28) return "labellum";
    if (roll < 0.42) return "velamen";
    if (roll < 0.56) return "column";
    if (roll < 0.7) return "spike";
    if (roll < 0.85) return "keiki";
    return "pollinia";
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
    return key === TRICK_KEY || key === "moth";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind | null | undefined);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "pollen";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "pollen" ? "sit" : name === "perfume" ? "play" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function pollenPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pollen));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" };
    }
    if (u < 0.76) {
      const dust = Math.sin(t * 1.72);
      return {
        lift: 2.8 + Math.abs(dust) * 1.4,
        rot: 12 + dust * 10,
        dx: dust * 0.12,
        anim: "sit",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" };
  }

  function perfumePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.perfume));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 3.0, rot: s * -10, dx: 0, anim: "play" };
    }
    if (u < 0.78) {
      const scent = Math.sin(t * 2.05);
      return {
        lift: 3.0 + Math.abs(scent) * 1.5,
        rot: -10 + scent * 14,
        dx: scent * 0.14,
        anim: "play",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.0 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" };
  }

  function amabilisPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
      rot: Math.sin(t * 0.72) * 8,
      dx: Math.sin(t * 0.4) * -0.12,
      anim: "talk",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "pollen") {
      const pose = pollenPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "perfume") {
      const pose = perfumePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = amabilisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "bark"
        ? "sit"
        : kind === "labellum"
          ? "sit"
          : kind === "spike"
            ? "talk"
            : kind === "velamen"
              ? "play"
              : kind === "column"
                ? "talk"
                : kind === "keiki"
                  ? "play"
                  : kind === "pollinia"
                    ? "talk"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "bark" ? "hold" : "go",
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

  function barkPose(t) {
    const breath = Math.sin(t * 0.42) + 0.12 * Math.sin(t * 1.15);
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
      rot: 4 + breath * 3.2,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - u) };
  }

  function labellumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.labellum));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const land = smoothstep(s);
      const bob = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * land * 2.8,
        lift: 3.2 - land * 0.8 + Math.abs(bob) * 0.6,
        rot: facing * (-8 + land * 14),
        anim: "sit",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const lip = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * (2.8 + lip * 0.8),
        lift: 2.4 * (1 - s * 0.35) + Math.abs(lip) * 0.5,
        rot: facing * (6 + lip * 4),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 2.8 * (1 - s),
      lift: 0.8 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function velamenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.velamen));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.4, rot: s * 14 * facing, anim: "play" };
    }
    if (u < 0.5) {
      const s = (u - 0.14) / 0.36;
      const sip = smoothstep(s);
      const press = Math.sin(s * Math.PI * 2);
      return {
        x: fromX + facing * sip * 3.6,
        lift: 2.4 + Math.abs(press) * 1.4,
        rot: facing * (14 - sip * 8 + press * 4),
        anim: "play",
      };
    }
    if (u < 0.8) {
      const s = (u - 0.5) / 0.3;
      const drink = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * (3.6 + drink * 0.6),
        lift: 3.2 - s * 1.2 + Math.abs(drink) * 0.8,
        rot: facing * (6 + drink * 5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 3.6 * (1 - s),
      lift: 2.0 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function columnPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.column));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" };
    }
    if (u < 0.72) {
      const s = (u - 0.18) / 0.54;
      const stand = Math.sin(s * Math.PI * 1.4);
      const cup = smoothstep(s);
      return {
        x: fromX + facing * stand * 0.8,
        lift: 2.6 * (1 - cup * 0.35) + Math.abs(stand) * 1.2,
        rot: facing * (10 - cup * 4 + stand * 3),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.8 + Math.abs(Math.sin(s * Math.PI)) * 0.4 * (1 - s) + 1.6 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function spikePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spike));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: s * 2.6, rot: s * -10 * facing, anim: "talk" };
    }
    if (u < 0.58) {
      const s = (u - 0.22) / 0.36;
      const bloom = smoothstep(s);
      const open = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * bloom * 1.4,
        lift: 2.6 + Math.abs(open) * 1.6,
        rot: facing * (-10 + bloom * 18),
        anim: "talk",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.58) / 0.26;
      const hold = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + facing * (1.4 + hold * 0.6),
        lift: 3.6 + Math.abs(hold) * 0.8,
        rot: facing * (8 + hold * 4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 1.8 * (1 - s),
      rot: facing * (5 * (1 - s)),
      anim: "sit",
    };
  }

  function keikiPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.keiki));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 1.8, rot: s * -8 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const sprout = smoothstep(s);
      const rock = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * sprout * 1.2,
        lift: 1.8 + sprout * 2.6 + Math.abs(rock) * 1.0,
        rot: facing * (-8 + sprout * 12 + rock * 5),
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const spin = Math.sin(s * Math.PI * 2);
      return {
        x: fromX + facing * (1.2 + spin * 0.5),
        lift: 4.0 + Math.abs(spin) * 0.8,
        rot: facing * (4 + spin * 6),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 1.2 * (1 - s),
      lift: 1.8 * (1 - s) + s * 0.2,
      rot: facing * (3 * (1 - s)),
      anim: "sit",
    };
  }

  function polliniaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pollinia));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const dab = smoothstep(s);
      const sip = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * dab * 2.4,
        lift: 2.6 + dab * 2.0 + Math.abs(sip) * 0.8,
        rot: facing * (10 - dab * 6 + sip * 4),
        anim: "talk",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const drink = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * (2.4 + drink * 0.5),
        lift: 4.4 + Math.abs(drink) * 0.8,
        rot: facing * (4 + drink * 5),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 2.4 * (1 - s),
      lift: 2.0 * (1 - s),
      rot: facing * (3 * (1 - s)),
      anim: "sit",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "labellum" &&
      trick.kind !== "velamen" &&
      trick.kind !== "column" &&
      trick.kind !== "spike" &&
      trick.kind !== "keiki" &&
      trick.kind !== "pollinia"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "bark") {
      if (next.t < BARK_HOLD) {
        const pose = barkPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BARK_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BARK_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "labellum") {
      const pose = labellumPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "velamen") {
      const pose = velamenPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "column") {
      const pose = columnPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spike") {
      const pose = spikePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "keiki") {
      const pose = keikiPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = polliniaPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    BARK_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    barkPose,
    releasePose,
    labellumPose,
    velamenPose,
    columnPose,
    spikePose,
    keikiPose,
    polliniaPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    pollenPose,
    perfumePose,
    amabilisPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOrchidTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
