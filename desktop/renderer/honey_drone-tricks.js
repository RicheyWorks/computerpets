/** Hum ground tricks while idle — ultra-polish pass. House neighborly Western honey bee drone — holoptic / congregation / sortie / ocellus / mellifera / dronepatrol / eyemeet personality (holoptic big compound eyes meeting dorsally for a desk scan — never named dig (Thimble + ethogram + window DIG) / salt (Sheen) / lustre (Sheen) / shine (ethogram + Ember) / sheen (Disk) / glint (Coin) / gleam (Ground happy) / fovea (Bank) / figure (Comb) / ocelli (Comb — different from ocellus), congregation DCA-style desk circuit as a drone congregation area — never named circle (Disc) / commune (Sheen) / gallery (Column) / nest (Clip + Column window) / bank (Lula boa trick + Bank guest slug + mining window) / hive (Comb) / dance (Rui) / waggle (Comb window) / buzz (Relay), sortie short mating-flight lift off the blotter — never named hover (Sepia + ethogram) / soar / rise / emerge (Cicada) / egress (Cicada + Thrum) / cast (Cicada) / harden (Cicada) / spring (Cat + Mortar) / dance (Rui), ocellus three-ocelli head tip glance — never named salt (Sheen) / lustre (Sheen) / shine (Ember) / sheen (Disk) / glint (Coin) / gleam (Ground happy) / fovea (Bank) / ocelli (Comb) / hum (guest slug + ethogram only — never a trick kind), mellifera long hold desk life as an Apis mellifera drone neighbor with ligustica / carnica cousins in the thank-yous, dronepatrol species-true Apis mellifera drone perimeter circuit of the blotter (not Comb hive trail / Disc circle / congregation DCA / Column gallery / Rui dance), eyemeet species-true holoptic compound-eye dorsal meet flash toward the lamp (not Comb ocelli / ocellus tip glance / holoptic desk scan / Sheen lustre / Disk sheen); not Comb worker hive/figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Thrum sonicate/scopa/fossor/lumber/bombus/thoraxload/corbicularub, Auger rasp/glabrous/partition/picket/xylocopa, Mortar trowel/beebread/orchard/plug/osmia, Disc circle/liner/cavity/parcel/megachile, Pot cerumen/spout/vessel/batumen/melipona, Sheen lustre/tumulus/salt/commune/agapostemon/metallictilt/nestmound, Bank shaft/mass/vernal/fovea/andrena, Disk pad/corolla/rhizome/calyx/sheen, Column gallery/pheromone/crumb/bustle/camponotus, Sepia hover, Vesper guard/thrum, Arm sentinel, Clip nest, Thimble dig, Cap warts, Reed plop, Tube papillae, Relay buzz, Rui dance, Ground happy gleam, Coin glint, Ember shine copies). Dronepatrol is the iconic Apis mellifera drone blotter-perimeter circuit (not Comb hive). Eyemeet is the iconic holoptic dorsal eye-meet lamp flash (not Comb ocelli). Window-play DRONE unchanged — never names drone as a trick. Ethogram keeps mellifera sit_hold; adds holoptic/congregation/sortie/ocellus/dronepatrol/eyemeet softs + freeze (replaces thin hum/hover/still — guest slug owns hum; Sepia owns hover). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via honey_drone.wav. Thank-yous ligustica / carnica / apisini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `honey_drone-tricks.ts`. True house-drone desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids hum/hover/still/hive/ocelli/circle/commune/lustre/thoraxload/corbicularub/drone/buzz/dance name collisions. Bird ultra (Soot→Ember) + Miso→Ghost done; skip Rui + birds. Sheen now also owns metallictilt/nestmound; Thrum now also owns thoraxload/corbicularub. MELLIFERA_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: re-scan thin leftovers (darner / carpenter_bee spotted). Catalog 221. No cry inventing beyond house honey_drone.wav prefer. Never retouch Rui sprites. No sting, no pollen basket, not Comb worker. */

(function (root) {
  const TRICK_KEY = "honey_drone";
  const TRICKS = ["holoptic", "congregation", "sortie", "ocellus", "mellifera", "dronepatrol", "eyemeet"];
  const HAPPY = ["ligustica", "carnica", "apisini"];

  const HAPPY_DUR = {
    ligustica: 1.72,
    carnica: 1.88,
    apisini: 1.78,
  };

  /** Mellifera hold — Hum parks Apis mellifera drone calm on the blotter. Not window-play DRONE. */
  const MELLIFERA_HOLD = 11.2;
  const RELEASE_S = 1.18;

  const DUR = {
    mellifera: MELLIFERA_HOLD + RELEASE_S,
    holoptic: 2.46,
    congregation: 2.42,
    sortie: 2.38,
    ocellus: 2.44,
    dronepatrol: 2.52,
    eyemeet: 2.48,
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
    if (kind === "mellifera") return 38 + roll * 24;
    if (kind === "dronepatrol" || kind === "eyemeet" || kind === "congregation") return 12 + roll * 9;
    if (kind === "holoptic" || kind === "sortie" || kind === "ocellus") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "mellifera";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "mellifera") {
      if (roll < 0.18) return "holoptic";
      if (roll < 0.34) return "congregation";
      if (roll < 0.5) return "sortie";
      if (roll < 0.66) return "ocellus";
      if (roll < 0.83) return "dronepatrol";
      return "eyemeet";
    }
    if (lastKind === "holoptic") {
      if (roll < 0.2) return "mellifera";
      if (roll < 0.36) return "congregation";
      if (roll < 0.52) return "sortie";
      if (roll < 0.68) return "ocellus";
      if (roll < 0.84) return "dronepatrol";
      return "eyemeet";
    }
    if (lastKind === "congregation") {
      if (roll < 0.18) return "mellifera";
      if (roll < 0.34) return "holoptic";
      if (roll < 0.5) return "sortie";
      if (roll < 0.66) return "ocellus";
      if (roll < 0.83) return "dronepatrol";
      return "eyemeet";
    }
    if (lastKind === "dronepatrol") {
      if (roll < 0.2) return "mellifera";
      if (roll < 0.36) return "holoptic";
      if (roll < 0.52) return "congregation";
      if (roll < 0.68) return "sortie";
      if (roll < 0.84) return "ocellus";
      return "eyemeet";
    }
    if (roll < 0.16) return "mellifera";
    if (roll < 0.3) return "holoptic";
    if (roll < 0.44) return "congregation";
    if (roll < 0.58) return "sortie";
    if (roll < 0.72) return "ocellus";
    if (roll < 0.86) return "dronepatrol";
    return "eyemeet";
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
    return key === TRICK_KEY || key === "hum";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "ligustica";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "ligustica" ? "talk" : name === "carnica" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function ligusticaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ligustica));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 2.8, rot: s * 8.5, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 12.4) + 0.24 * Math.sin(t * 24.8);
      return {
        lift: 2.8 + Math.abs(tick) * 1.1,
        rot: 8.5 + tick * 6.2,
        dx: tick * 0.35,
        anim: "talk",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 1.2 * (1 - s), rot: 3.2 * (1 - s), dx: 0, anim: "idle" };
  }

  function carnicaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.carnica));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 3.2, rot: s * -9.5, dx: s * 0.4, anim: "play" };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 5.4) + 0.22 * Math.sin(t * 10.8);
      return {
        lift: 3.2 + Math.abs(flash) * 1.35,
        rot: -9.5 + flash * 11,
        dx: flash * 0.55,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 1.4 * (1 - s), rot: -3.6 * (1 - s), dx: 0, anim: "sit" };
  }

  function apisiniPose(t) {
    return {
      lift: 1.6 + Math.abs(Math.sin(t * 0.34)) * 0.9,
      rot: Math.sin(t * 0.42) * 4.2,
      dx: Math.sin(t * 0.24) * 0.28,
      anim: "sit",
    };
  }

  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "ligustica") {
      const pose = ligusticaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "carnica") {
      const pose = carnicaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = apisiniPose(next.t);
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
    const anim = kind === "mellifera"
        ? "sit"
        : kind === "holoptic"
          ? "play"
          : kind === "congregation"
            ? "talk"
            : kind === "sortie"
              ? "talk"
              : kind === "ocellus"
                ? "sit"
                : kind === "dronepatrol"
                  ? "play"
                  : kind === "eyemeet"
                    ? "talk"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "mellifera" ? "hold" : "go",
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

  function melliferaPose(t) {
    const breath = Math.sin(t * 0.13) + 0.05 * Math.sin(t * 0.48);
    const grit = Math.abs(Math.sin(t * 0.19));
    return {
      lift: 1.8 + grit * 0.85,
      rot: 2.4 + breath * 2.8,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 1.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 2.4 * (1 - u) };
  }

  function holopticPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.holoptic));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.1, rot: s * 10 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const scan = Math.sin(s * Math.PI * 2.2);
      const meet = Math.sin(s * Math.PI * 4.8);
      return {
        x: fromX + facing * scan * 0.55,
        lift: 3.0 + Math.abs(meet) * 1.4,
        rot: facing * (9 + scan * 8 + meet * 3.5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 1.4 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function congregationPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.congregation));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 2.4, rot: s * -6 * facing, anim: "talk" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const circuit = smoothstep(s);
      return {
        x: fromX + facing * (0.6 + circuit * 1.4),
        lift: 2.4 + circuit * 2.2,
        rot: facing * (-6 + circuit * 14),
        anim: "talk",
      };
    }
    if (u < 0.86) {
      const s = (u - 0.55) / 0.31;
      const dca = Math.sin(s * Math.PI * 3.4);
      return {
        x: fromX + facing * (1.1 + dca * 0.35),
        lift: 2.8 + Math.abs(dca) * 1.3,
        rot: facing * (5 + dca * 5.5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 0.7 * (1 - s * 0.4),
      lift: 1.0 * (1 - s),
      rot: facing * (2.2 * (1 - s)),
      anim: "sit",
    };
  }

  function sortiePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sortie));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.6, rot: s * -7 * facing, anim: "talk" };
    }
    if (u < 0.82) {
      const s = (u - 0.16) / 0.66;
      const liftOff = Math.sin(s * Math.PI * 5.6);
      const lean = Math.sin(s * Math.PI * 1.4);
      return {
        x: fromX + facing * lean * 0.45,
        lift: 2.4 + Math.abs(liftOff) * 1.15,
        rot: facing * (-5.5 + liftOff * 7 + lean * 2.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 1.1 * (1 - s),
      rot: facing * (-2.2 * (1 - s)),
      anim: "sit",
    };
  }

  function ocellusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ocellus));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 2.2, rot: s * 6 * facing, anim: "sit" };
    }
    if (u < 0.8) {
      const s = (u - 0.18) / 0.62;
      const glance = Math.sin(s * Math.PI * 1.6);
      const tip = Math.sin(s * Math.PI * 3.2) * 0.35;
      return {
        x: fromX + facing * (0.9 * s + glance * 0.35),
        lift: 2.0 + Math.abs(tip) * 1.0,
        rot: facing * (5 + glance * 4.5 + tip * 3),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 0.7 * (1 - s * 0.3),
      lift: 1.0 * (1 - s),
      rot: facing * (2.0 * (1 - s)),
      anim: "sit",
    };
  }

  function dronepatrolPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dronepatrol));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.0, rot: s * 11 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const arc = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * arc * 0.5,
        lift: 3.0 + Math.abs(arc) * 1.5,
        rot: facing * (11 + arc * 9),
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const perimeter = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * (0.45 + perimeter * 0.3),
        lift: 3.6 + Math.abs(perimeter) * 0.9,
        rot: facing * (14 - s * 2 + perimeter * 4),
        anim: "play",
      };
    }
    {
      const s = (u - 0.84) / 0.16;
      return {
        x: fromX,
        lift: 3.0 * (1 - s),
        rot: facing * (6 * (1 - s)),
        anim: "sit",
      };
    }
  }

  function eyemeetPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.eyemeet));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * -1.4, rot: s * -5 * facing, anim: "sit" };
    }
    if (u < 0.5) {
      const s = smoothstep((u - 0.14) / 0.36);
      return {
        x: fromX + facing * s * 1.2,
        lift: -1.0 + s * 3.4,
        rot: facing * (-5 + s * 12),
        anim: "talk",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.5) / 0.34;
      const flash = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * (1.2 + flash * 0.4),
        lift: 2.6 + Math.abs(flash) * 1.2,
        rot: facing * (6 + flash * 5),
        anim: "talk",
      };
    }
    {
      const s = (u - 0.84) / 0.16;
      return {
        x: fromX + facing * (1.0 * (1 - s * 0.35)),
        lift: 1.2 * (1 - s),
        rot: facing * (2.4 * (1 - s)),
        anim: "sit",
      };
    }
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "holoptic" &&
      trick.kind !== "congregation" &&
      trick.kind !== "sortie" &&
      trick.kind !== "ocellus" &&
      trick.kind !== "dronepatrol" &&
      trick.kind !== "eyemeet"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "mellifera") {
      if (next.t < MELLIFERA_HOLD) {
        const pose = melliferaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MELLIFERA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MELLIFERA_HOLD);
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
    if (next.kind === "holoptic") {
      const pose = holopticPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "congregation") {
      const pose = congregationPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "sortie") {
      const pose = sortiePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "ocellus") {
      const pose = ocellusPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "dronepatrol") {
      const pose = dronepatrolPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = eyemeetPose(next.t, fromX, trick.facing);
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
    MELLIFERA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    melliferaPose,
    releasePose,
    holopticPose,
    congregationPose,
    sortiePose,
    ocellusPose,
    dronepatrolPose,
    eyemeetPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    ligusticaPose,
    carnicaPose,
    apisiniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHoneyDroneTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
