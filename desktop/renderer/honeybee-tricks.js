/** Comb ground tricks while idle — ultra-polish pass. House honeybee — figure / corbicula / hex / proboscis / hive / ocelli / nasonov personality (figure-eight recruit dance on the blotter — never named waggle (Comb window WAGGLE) / dance (Rui owns dance) / buzz (Relay owns buzz) / bobble (Echo owns bobble) / preen / mimic / sidle / dangle (Echo) / fan / flash (Quill) / wing (Kite) / flutter (Fan), corbicula pollen-basket pack — never named pollen (Moth happy) / nest (Clip) / cheek / pocket / scurry (Clip) / seed (Clip), hex wax-cell build — never named wax / draw (honeycomb window) / comb as guest-name-only / cell as vague, proboscis hover-sip — never named hover (Sepia) / sip (hummingbird window) / nectar (Disk) / drink / taste / probe / lap / gulp (Coin), hive desk life as an Apis wax-heart worker, ocelli three-simple-eye light-compass tilt toward the lamp (species-true Apis ocelli sun-compass — never named eye / gaze / stare / compass as vague / sun (Sol owns sun) / lamp as noun-only / look / track), nasonov scent-gland expose at the hive mouth (species-true Nasonov pheromone call — never named fan (Quill/Fan/parrot) / scent as vague / pheromone as jargon-only / gland (Dew owns gland) / call as vague / lure (Snap) / perfume (Moth happy)); not Dew mucilage/tentacle/digest/gland/rosette/lamina/circinate, Well peristome/cistern/brine/operculum/urn/ala/baffle, Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, Echo preen/bobble, Quill fan/flash, Relay buzz, Rui dance, Milk asclepias/oyamel, or snake guests Sash seam/moss/lap copies). Ocelli is the iconic three-simple-eye light compass (not Sol sun). Nasonov is the iconic scent-gland call (not Quill/Fan fan, not Dew gland). Window-play WAGGLE unchanged — never names waggle as a trick. Ethogram keeps hive sit_hold; adds figure/corbicula/hex/proboscis/ocelli/nasonov softs + freeze (replaces thin waggle/dart/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via honeybee.wav. Thank-yous honey / mead / propolis. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `honeybee-tricks.ts`. True house-honeybee desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Well/sundew/Dew or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell/snap/count/cilia/teeth/fringe/latch/lure/margin/enzyme/clamp/trichome/stew/unseal/poise/cage/scape/pleat/boot/keiki/pollinia/wing/hood/bristle/peristome/cistern/brine/operculum/urn/ala/baffle/mucilage/tentacle/digest/gland/rosette/lamina/circinate/curl/glue/fiddle/waggle/dance/buzz/pollen/nectar name collisions. Bird ultra (Soot→Ember) + Miso→Ghost done; skip Rui + birds. HIVE_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Hum / honey_drone. Catalog 221. Catalog 221. No cry inventing beyond house honeybee.wav prefer. Never retouch Rui sprites. */

(function (root) {
  const TRICK_KEY = "honeybee";
  const TRICKS = ["figure", "corbicula", "hex", "proboscis", "hive", "ocelli", "nasonov"];
  const HAPPY = ["honey", "mead", "propolis"];

  const HAPPY_DUR = {
    honey: 1.70,
    mead: 1.84,
    propolis: 1.76,
  };

  /** Hive hold — Comb parks wax-heart calm on the blotter. Not window-play WAGGLE. */
  const HIVE_HOLD = 11.2;
  const RELEASE_S = 1.18;

  const DUR = {
    hive: HIVE_HOLD + RELEASE_S,
    figure: 2.48,
    corbicula: 2.42,
    hex: 2.40,
    proboscis: 2.44,
    ocelli: 2.38,
    nasonov: 2.56,
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
    if (kind === "hive") return 38 + roll * 24;
    if (kind === "ocelli" || kind === "nasonov" || kind === "proboscis") return 12 + roll * 9;
    if (kind === "figure" || kind === "corbicula" || kind === "hex") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "hive";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "hive") {
      if (roll < 0.18) return "figure";
      if (roll < 0.34) return "corbicula";
      if (roll < 0.5) return "hex";
      if (roll < 0.66) return "proboscis";
      if (roll < 0.83) return "ocelli";
      return "nasonov";
    }
    if (lastKind === "figure") {
      if (roll < 0.2) return "hive";
      if (roll < 0.36) return "corbicula";
      if (roll < 0.52) return "hex";
      if (roll < 0.68) return "proboscis";
      if (roll < 0.84) return "ocelli";
      return "nasonov";
    }
    if (lastKind === "hex") {
      if (roll < 0.18) return "hive";
      if (roll < 0.34) return "figure";
      if (roll < 0.5) return "corbicula";
      if (roll < 0.66) return "proboscis";
      if (roll < 0.83) return "ocelli";
      return "nasonov";
    }
    if (lastKind === "ocelli" || lastKind === "nasonov") {
      if (roll < 0.16) return "hive";
      if (roll < 0.32) return "figure";
      if (roll < 0.48) return "corbicula";
      if (roll < 0.64) return "hex";
      if (roll < 0.8) return "proboscis";
      return lastKind === "ocelli" ? ("nasonov") : ("ocelli");
    }
    if (roll < 0.14) return "hive";
    if (roll < 0.28) return "figure";
    if (roll < 0.42) return "corbicula";
    if (roll < 0.56) return "hex";
    if (roll < 0.7) return "proboscis";
    if (roll < 0.85) return "ocelli";
    return "nasonov";
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
    return key === TRICK_KEY || key === "comb";
  }

  function startThankYou(key, lastKind, x, facing, flags) {
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
    const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "honey";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "honey" ? "play" : name === "mead" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function honeyPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.honey));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "play" };
    }
    if (u < 0.62) {
      const buzz = Math.sin(t * 9.2);
      return {
        lift: 2.8 + Math.abs(buzz) * 1.4,
        rot: 12 + buzz * 10,
        dx: buzz * 0.8,
        anim: "play",
      };
    }
    const s = (u - 0.62) / 0.38;
    return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" };
  }

  function meadPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mead));
    if (u < 0.24) {
      const s = u / 0.24;
      return { lift: s * 2.4, rot: s * -8, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const drop = Math.sin(t * 0.72);
      return {
        lift: 2.4 + Math.abs(drop) * 1.1,
        rot: -8 + drop * 6,
        dx: drop * 0.7,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 1.6 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" };
  }

  function propolisPose(t) {
    return {
      lift: 2.2 + Math.abs(Math.sin(t * 0.9)) * 1.1,
      rot: Math.sin(t * 1.05) * 9,
      dx: Math.sin(t * 0.55) * 0.85,
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
    if (next.kind === "honey") {
      const pose = honeyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mead") {
      const pose = meadPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = propolisPose(next.t);
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
      kind === "hive"
        ? "sit"
        : kind === "figure"
          ? "play"
          : kind === "corbicula"
            ? "talk"
            : kind === "hex"
              ? "sit"
              : kind === "proboscis"
                ? "talk"
                : kind === "ocelli"
                  ? "play"
                  : kind === "nasonov"
                    ? "talk"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "hive" ? "hold" : "go",
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

  function hivePose(t) {
    const breath = Math.sin(t * 0.2) + 0.025 * Math.sin(t * 1.1);
    return {
      lift: 2.4 + Math.abs(Math.sin(t * 0.31)) * 1.2,
      rot: 4 + breath * 3.2,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - u) };
  }

  function figurePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.figure));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.2, rot: s * 8 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const eight = Math.sin(t * 11.2) + 0.4 * Math.sin(t * 17.5);
      return {
        x: fromX + facing * eight * 0.55,
        lift: 3.2 + Math.abs(eight) * 1.2,
        rot: facing * (8 + eight * 8),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 3.2 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function corbiculaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.corbicula));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * 2.6, rot: s * -8 * facing, anim: "sit" };
    }
    if (u < 0.75) {
      const s = (u - 0.2) / 0.55;
      const fill = Math.sin(s * Math.PI * 1.3);
      return {
        x: fromX - facing * 1.2 * s,
        lift: 2.6 + fill * 0.9,
        rot: facing * (-8 - s * 4 + fill * 2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.75) / 0.25);
    return {
      x: fromX - facing * 1.2 * (1 - s),
      lift: 2.6 * (1 - s),
      rot: facing * (-8 * (1 - s)),
      anim: "sit",
    };
  }

  function hexPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hex));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: s * 2.2, rot: s * -10 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const hush = Math.sin(s * Math.PI * 1.4);
      return {
        x: fromX - facing * 1.4 * s,
        lift: 2.2 + hush * 0.8,
        rot: facing * (-10 - s * 6 + hush * 2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX - facing * 1.4 * (1 - s),
      lift: 2.2 * (1 - s),
      rot: facing * (-8 * (1 - s)),
      anim: "sit",
    };
  }

  function proboscisPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.proboscis));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * 2.4, rot: s * -8 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = smoothstep((u - 0.2) / 0.35);
      return {
        x: fromX + facing * s * 1.6,
        lift: 2.4 + s * 2.0,
        rot: facing * (-8 + s * 18),
        anim: "talk",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const flap = Math.sin(s * Math.PI * 1.5);
      return {
        x: fromX + facing * (1.6 + flap * 0.5),
        lift: 4.2 + Math.abs(flap) * 0.8,
        rot: facing * (10 + flap * 4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 4.2 * (1 - s),
      rot: facing * (6 * (1 - s)),
      anim: "sit",
    };
  }

  function ocelliPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ocelli));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.0, rot: s * 9 * facing, anim: "play" };
    }
    if (u < 0.52) {
      const s = (u - 0.16) / 0.36;
      const compass = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * compass * 0.9,
        lift: 3.0 + Math.abs(compass) * 1.4,
        rot: facing * (9 + compass * 11),
        anim: "play",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.52) / 0.3;
      const lamp = Math.sin(s * Math.PI * 1.6);
      return {
        x: fromX + facing * (0.7 + lamp * 0.35),
        lift: 3.6 - s * 0.35 + Math.abs(lamp) * 0.7,
        rot: facing * (14 - s * 3 + lamp * 2.8),
        anim: "play",
      };
    }
    {
      const s = (u - 0.82) / 0.18;
      return {
        x: fromX + facing * (0.7 * (1 - s)),
        lift: 3.6 * (1 - s),
        rot: facing * (11 * (1 - s)),
        anim: "idle",
      };
    }
  }

  function nasonovPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.nasonov));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 2.5, rot: s * -8 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = smoothstep((u - 0.18) / 0.37);
      return {
        x: fromX - facing * s * 0.55,
        lift: 2.5 + s * 2.6,
        rot: facing * (-8 + s * 14),
        anim: "talk",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const scent = Math.sin(s * Math.PI * 1.7);
      return {
        x: fromX - facing * (0.55 + scent * 0.28),
        lift: 5.0 + Math.abs(scent) * 0.85,
        rot: facing * (5 + scent * 4.5),
        anim: "talk",
      };
    }
    {
      const s = (u - 0.84) / 0.16;
      return {
        x: fromX - facing * (0.55 * (1 - s)),
        lift: 5.0 * (1 - s),
        rot: facing * (5 * (1 - s)),
        anim: "idle",
      };
    }
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "figure" &&
      trick.kind !== "corbicula" &&
      trick.kind !== "hex" &&
      trick.kind !== "proboscis" &&
      trick.kind !== "ocelli" &&
      trick.kind !== "nasonov"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "hive") {
      if (next.t < HIVE_HOLD) {
        const pose = hivePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HIVE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HIVE_HOLD);
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
    if (next.kind === "figure") {
      const pose = figurePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "corbicula") {
      const pose = corbiculaPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hex") {
      const pose = hexPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "proboscis") {
      const pose = proboscisPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ocelli") {
      const pose = ocelliPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = nasonovPose(next.t, fromX, trick.facing);
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
    HIVE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    hivePose,
    releasePose,
    figurePose,
    corbiculaPose,
    hexPose,
    proboscisPose,
    ocelliPose,
    nasonovPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    honeyPose,
    meadPose,
    propolisPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHoneybeeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
