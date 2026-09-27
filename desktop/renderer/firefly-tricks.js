/** Spark ground tricks while idle — ultra-polish pass. House firefly — lantern / jstroke / semaphore / elytra / photinus / photocyte / sternite personality (lantern belly-organ soft pulse on the blotter — never named flash (Quill+ethogram-old+window Flash/GLOW) / glow (Dragon happy+window GLOW) / blaze (Ember) / lift (Ember+ethogram-old) / warning (Milk) / lunule (Ghost), jstroke Photinus J-path courtship flight — never named soar / hover (Sepia) / wing (Kite) / flutter (Fan) / stream (Ghost) / dart (Coin+ethogram still uses still), semaphore mate answer-code timing — never named flash / code / signal / buzz (Relay) / click (Relay) / spark (Relay happy), elytra soft dusk cover-wing settle — never named silk (Ghost) / plumose (Ghost) / fan / wing / nocturne (Arm), photinus desk life as a Photinus pyralis Lampyridae beetle week, photocyte lantern light-cell shimmer (species-true Photinus photocytes — never named flash / glow / blaze / luciferin-as-trick / pulse as Pulse guest / scintilla), sternite abdominal lantern-sternite flex (species-true Photinus lantern sternites — never named elytra as cover / silk / coil / tuck / seam); not Ghost plumose/lunule/silk/stream/actias/aphagy/cauda, Milk asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus, Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Dew mucilage/tentacle/digest/gland/rosette/lamina/circinate, Well peristome/cistern/brine/operculum/urn/ala/baffle, Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, Echo preen/bobble, Quill fan/flash, Relay buzz, Rui dance, Banner puddlesip, or snake guests Sash seam/moss/lap copies). Photocyte is the iconic lantern light-cell shimmer (not window Flash/GLOW, not ethogram-old flash). Sternite is the iconic abdominal lantern-plate flex (not elytra cover-wing). Window-play Flash/GLOW unchanged — never names flash or glow as tricks. Ethogram keeps photinus sit_hold; adds lantern/jstroke/semaphore/elytra/photocyte/sternite softs + freeze (replaces thin flash/lift/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via firefly.wav. Thank-yous luciferin / candela / pyralis. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web firefly-tricks.ts. True house-firefly desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Well/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell/snap/count/cilia/teeth/fringe/latch/lure/margin/enzyme/clamp/trichome/stew/unseal/poise/cage/scape/pleat/boot/keiki/pollinia/wing/hood/bristle/peristome/cistern/brine/operculum/urn/ala/baffle/mucilage/tentacle/digest/gland/rosette/lamina/circinate/curl/glue/fiddle/waggle/dance/buzz/pollen/nectar/figure/corbicula/hex/proboscis/hive/ocelli/nasonov/asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus/plumose/lunule/silk/stream/actias/aphagy/cauda/puddlesip/flash/glow/lift name collisions. Bird ultra (Soot→Ember) + Miso→Ghost done; skip Rui + birds. Next guest ultra is Shard / silica. No cry inventing beyond house firefly.wav prefer. Never retouch Rui sprites. */
(function (root) {

  const TRICK_KEY = "firefly";
  const TRICKS = ["lantern", "jstroke", "semaphore", "elytra", "photinus", "photocyte", "sternite"];
  const HAPPY = ["luciferin", "candela", "pyralis"];

  const HAPPY_DUR = {
    luciferin: 1.70,
    candela: 1.84,
    pyralis: 1.76,
  };
  const PHOTINUS_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    photinus: PHOTINUS_HOLD + RELEASE_S,
    lantern: 2.48,
    jstroke: 2.42,
    semaphore: 2.44,
    elytra: 2.56,
    photocyte: 2.40,
    sternite: 2.38,
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
    if (kind === "photinus") return 40 + roll * 24;
    if (kind === "photocyte" || kind === "sternite" || kind === "elytra") return 12 + roll * 9;
    if (kind === "lantern" || kind === "jstroke" || kind === "semaphore") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "photinus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "photinus") {
      if (roll < 0.16) return "lantern";
      if (roll < 0.32) return "jstroke";
      if (roll < 0.48) return "semaphore";
      if (roll < 0.64) return "elytra";
      if (roll < 0.82) return "photocyte";
      return "sternite";
    }
    if (lastKind === "lantern") {
      if (roll < 0.18) return "photinus";
      if (roll < 0.34) return "jstroke";
      if (roll < 0.5) return "semaphore";
      if (roll < 0.66) return "elytra";
      if (roll < 0.83) return "photocyte";
      return "sternite";
    }
    if (lastKind === "jstroke") {
      if (roll < 0.16) return "photinus";
      if (roll < 0.32) return "lantern";
      if (roll < 0.48) return "semaphore";
      if (roll < 0.64) return "elytra";
      if (roll < 0.82) return "photocyte";
      return "sternite";
    }
    if (lastKind === "photocyte" || lastKind === "sternite") {
      if (roll < 0.16) return "photinus";
      if (roll < 0.32) return "lantern";
      if (roll < 0.48) return "jstroke";
      if (roll < 0.64) return "semaphore";
      if (roll < 0.8) return "elytra";
      return lastKind === "photocyte" ? ("sternite") : ("photocyte");
    }
    if (roll < 0.14) return "photinus";
    if (roll < 0.28) return "lantern";
    if (roll < 0.42) return "jstroke";
    if (roll < 0.56) return "semaphore";
    if (roll < 0.7) return "elytra";
    if (roll < 0.85) return "photocyte";
    return "sternite";
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
    return key === TRICK_KEY || key === "spark";
  }

  function startThankYou(
    key,
    lastKind,
    x,
    facing,
    flags,
  ) {
    if (!wantsThankYou(key)) return null;
    if (!happyCanStart(flags || { cmd: "idle" })) return null;
    const pick = pickHappy(lastKind);
    return { happy: beginHappy(pick, x, facing), kind: pick };
  }

  function pickHappy(lastKind, rand) {
    const pool = HAPPY.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...HAPPY];
    const roll = rand == null ? Math.random() : rand;
    return list[Math.floor(roll * list.length)] || list[0];
  }

  function beginHappy(kind, x, facing) {
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "luciferin";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "luciferin" ? "play" : name === "candela" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function luciferinPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.luciferin));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 2.9, rot: s * 12, dx: 0, anim: "play" };
    }
    if (u < 0.7) {
      const blink = Math.sin(t * 14.5) + 0.22 * Math.sin(t * 22.1);
      return {
        lift: 2.9 + Math.abs(blink) * 1.35,
        rot: 12 + blink * 10,
        dx: blink * 0.22,
        anim: "play",
      };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function candelaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.candela));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * -1.15, rot: s * -6.8, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const warm = Math.sin(t * 0.68);
      return {
        lift: -1.15 + Math.abs(warm) * 0.9,
        rot: -6.8 + warm * 5.6,
        dx: warm * 0.18,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: -0.75 * (1 - s), rot: -3.4 * (1 - s), dx: 0, anim: "sit" };
  }

  function pyralisPose(t) {
    return {
      lift: 2.25 + Math.abs(Math.sin(t * 0.92)) * 1.15,
      rot: Math.sin(t * 1.12) * 9.2,
      dx: Math.sin(t * 0.48) * 0.28,
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
    if (next.kind === "luciferin") {
      const pose = luciferinPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "candela") {
      const pose = candelaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pyralisPose(next.t);
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
      kind === "photinus"
        ? "sit"
        : kind === "lantern"
          ? "play"
          : kind === "jstroke"
            ? "sit"
            : kind === "semaphore"
              ? "talk"
              : kind === "elytra"
                ? "sit"
                : kind === "photocyte"
                  ? "play"
                  : kind === "sternite"
                    ? "talk"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "photinus" ? "hold" : "go",
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

  function photinusPose(t) {
    const lamp = Math.abs(Math.sin(t * 0.55));
    const breath = Math.sin(t * 0.18) + 0.02 * Math.sin(t * 0.9);
    return {
      lift: 2.45 + lamp * 1.15,
      rot: 4.2 + breath * 3.4,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.25 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 3.1 * (1 - u) };
  }

  function lanternPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lantern));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.1, rot: s * 11 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const pulse = Math.sin(t * 11.2) + 0.24 * Math.sin(t * 17.6);
      return {
        x: fromX + facing * pulse * 0.08,
        lift: 3.1 + Math.abs(pulse) * 1.25,
        rot: facing * (11 + pulse * 8),
        anim: "play",
      };
    }
    const s = (u - 0.78) / 0.22;
    return {
      x: fromX,
      lift: 3.1 * (1 - s),
      rot: facing * (5 * (1 - s)),
      anim: "play",
    };
  }

  function jstrokePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.jstroke));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX + facing * 0.15 * s, lift: s * 2.4, rot: s * -7 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const arc = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (0.15 + 1.1 * s),
        lift: 2.4 + arc * 2.6,
        rot: facing * (-7 + s * 16),
        anim: "sit",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const hook = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (1.25 - 0.55 * s),
        lift: 4.2 - s * 1.4 + Math.abs(hook) * 0.9,
        rot: facing * (8 - s * 10 + hook * 4),
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return {
      x: fromX + facing * 0.7 * (1 - s),
      lift: 2.6 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "sit",
    };
  }

  function semaphorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.semaphore));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.7, rot: s * 9 * facing, anim: "talk" };
    }
    if (u < 0.8) {
      const code = Math.sin(t * 8.6) + 0.3 * Math.sin(t * 13.4);
      return {
        x: fromX + facing * code * 0.12,
        lift: 2.7 + Math.abs(code) * 1.2,
        rot: facing * (9 + code * 7.5),
        anim: "talk",
      };
    }
    const s = (u - 0.8) / 0.2;
    return {
      x: fromX,
      lift: 2.7 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "talk",
    };
  }

  function elytraPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.elytra));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * -1.25, rot: s * 6.5 * facing, anim: "sit" };
    }
    if (u < 0.45) {
      const s = (u - 0.16) / 0.29;
      return {
        x: fromX + facing * 0.18 * s,
        lift: -1.25 + s * 0.7,
        rot: facing * (6.5 - s * 3),
        anim: "sit",
      };
    }
    if (u < 0.82) {
      const soft = Math.sin(t * 3.8);
      return {
        x: fromX + facing * 0.18,
        lift: -0.55 + soft * 0.95,
        rot: facing * (3.5 + soft * 4.2),
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return {
      x: fromX + facing * 0.18 * (1 - s),
      lift: -0.45 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "sit",
    };
  }

  function photocytePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.photocyte));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.3, rot: s * 10 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const cell = Math.sin(t * 12.4) + 0.35 * Math.sin(t * 19.1);
      return {
        x: fromX + facing * cell * 0.14,
        lift: 3.3 + Math.abs(cell) * 1.45,
        rot: facing * (10 + cell * 9),
        anim: "play",
      };
    }
    const s = (u - 0.78) / 0.22;
    return {
      x: fromX,
      lift: 3.3 * (1 - s),
      rot: facing * (5 * (1 - s)),
      anim: "play",
    };
  }

  function sternitePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sternite));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.55, rot: s * -8.5 * facing, anim: "talk" };
    }
    if (u < 0.45) {
      const s = (u - 0.14) / 0.31;
      return {
        x: fromX - facing * 0.22 * s,
        lift: 2.55 + s * 2.4,
        rot: facing * (-8.5 + s * 13),
        anim: "talk",
      };
    }
    if (u < 0.82) {
      const flex = Math.sin(t * 5.8);
      return {
        x: fromX - facing * 0.22,
        lift: 4.9 + Math.abs(flex) * 0.9,
        rot: facing * (4.5 + flex * 5),
        anim: "talk",
      };
    }
    const s = (u - 0.82) / 0.18;
    return {
      x: fromX - facing * 0.22 * (1 - s),
      lift: 4.9 * (1 - s),
      rot: facing * (3.5 * (1 - s)),
      anim: "talk",
    };
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "lantern" &&
      trick.kind !== "jstroke" &&
      trick.kind !== "semaphore" &&
      trick.kind !== "elytra" &&
      trick.kind !== "photocyte" &&
      trick.kind !== "sternite"
    ) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "photinus") {
      if (next.t < PHOTINUS_HOLD) {
        const pose = photinusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PHOTINUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PHOTINUS_HOLD);
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
    const from = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "lantern") {
      const pose = lanternPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "jstroke") {
      const pose = jstrokePose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "semaphore") {
      const pose = semaphorePose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "elytra") {
      const pose = elytraPose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "photocyte") {
      const pose = photocytePose(next.t, from, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = sternitePose(next.t, from, trick.facing);
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
    PHOTINUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    photinusPose,
    releasePose,
    lanternPose,
    jstrokePose,
    semaphorePose,
    elytraPose,
    photocytePose,
    sternitePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    luciferinPose,
    candelaPose,
    pyralisPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFireflyTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
