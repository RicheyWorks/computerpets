/** Frill ground tricks while idle. House neighborly oyster-mushroom SHELF life — lamella / imbricate / lasso / margin / pleurotus personality (lamella gill-face tip toward the lamp — never named fan (Fan/ginkgo guest) / frill as a trick kind / lean (ethogram) / flush (ethogram) / dig (Thimble) / nest (Clip + Column window) / bank (Lula + Bank guest) / buzz (Relay) / dance (Rui) / hover (Sepia) / festoon (Wax) / capped (Wax) / midrib (Wax) / stores (Wax) / tessera (Wax), imbricate overlapping shelf-stack settle on the blotter (desk stack — not window-play SHELF) — never named shelf as a trick kind / warts (Cap owns warts; Cap is next) / tuft (Felt/moss) / frond (Vein/fern) / curl (Burr/hedgehog) / brood as a trick kind (also Brood cicada guest) / hold as a trick kind / cell (mason ethogram) / cerumen (Pot) / batumen (Pot) / circle (Disc) / liner (Disc), lasso nematode-trap mycelium desk motion (Pleurotus carnivory — species-true) — never named pipe (Keep) / retinue (Keep) / duel (Keep) / royal (Keep) / hex (Comb) / partition (Auger) / plug (Mortar) / fossor (Thrum) / shaft (Bank), margin wavy cap-edge settle — never named frill as a trick kind / fan (Fan guest) / sheen (Sheen guest + Disk trick) / glint (Coin) / gleam (Ground happy) / shine (Ember) / wax as a trick kind (guest Wax) / honey (Comb happy) / mead (Comb happy) / nectar (Disk) / pollen (Moth happy) / vessel (Pot) / spout (Pot) / mass (Bank), pleurotus long hold desk life as Pleurotus ostreatus oyster mushroom with ostreatus / pulmonarius / eryngii cousins in the thank-yous — never named mellifera (Hum) / regina (Keep) / andrena (Bank) / langstroth (Wax) / topbar (Wax) / warre (Wax) / hive (Comb) / hex (Comb); guest slug Frill only for isKey matching — accept "frill" and oyster). Feed-happy thank-yous sit after eat. Card-open freeze and window-play SHELF do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web oyster-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/honey_queen/Keep/honeycomb/Wax/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen/mining_bee/Bank or *Dragon electrical clone. Window-play SHELF unchanged — never names shelf. Ethogram lean/flush/still unchanged — never names lean or flush as trick kinds. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Hum owns holoptic/congregation/sortie/ocellus/mellifera and happy ligustica/carnica/apisini; Keep owns pipe/retinue/duel/royal/regina and happy caucasica/iberiensis/apini; Wax owns festoon/capped/midrib/stores/tessera and happy langstroth/topbar/warre; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Mortar owns trowel/beebread/orchard/plug/osmia and happy lignaria/cornifrons/osmiini; Disc owns circle/liner/cavity/parcel/megachile and happy rotundata/relativa/megachilini; Pot owns cerumen/spout/vessel/batumen/melipona and happy beecheii/yucatanica/meliponini; Sheen owns lustre/tumulus/salt/commune/agapostemon and happy virescens/texanus/halictini; Bank owns shaft/mass/vernal/fovea/andrena and happy vicina/carlini/andrenini; Lula owns bank; Disk owns pad/corolla/rhizome/calyx/sheen and happy silt/nectar/dew; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Clip owns nest; Thimble owns dig; Cap owns warts (next guest); Felt is moss; Vein is fern; Fan is ginkgo; Burr is hedgehog guest; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance; Ground happy owns gleam; Coin owns glint; Ember owns shine. Saprotroph Pleurotus shelf mushroom desk life only — not a bee, not a plant, not Wax honeycomb place, not Cap fly agaric. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "oyster";
  const TRICKS = ["lamella", "imbricate", "lasso", "margin", "pleurotus"];
  const HAPPY = ["ostreatus", "pulmonarius", "eryngii"];
  const HAPPY_DUR = { ostreatus: 1.32, pulmonarius: 1.38, eryngii: 1.42 };
  const PLEUROTUS_HOLD = 15.1;
  const RELEASE_S = 0.76;
  const DUR = { pleurotus: PLEUROTUS_HOLD + RELEASE_S, lamella: 1.76, imbricate: 1.88, lasso: 1.62, margin: 1.50 };

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
    if (kind === "pleurotus") return 52 + roll * 30;
    if (kind === "lamella") return 14 + roll * 10;
    if (kind === "imbricate") return 18 + roll * 11;
    if (kind === "margin") return 15 + roll * 12;
    return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "pleurotus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "pleurotus") {
      if (roll < 0.26) return "lamella";
      if (roll < 0.5) return "imbricate";
      if (roll < 0.74) return "lasso";
      return "margin";
    }
    if (lastKind === "lamella") {
      if (roll < 0.26) return "pleurotus";
      if (roll < 0.5) return "imbricate";
      if (roll < 0.74) return "lasso";
      return "margin";
    }
    if (lastKind === "imbricate") {
      if (roll < 0.22) return "pleurotus";
      if (roll < 0.44) return "lamella";
      if (roll < 0.68) return "lasso";
      return "margin";
    }
    if (roll < 0.2) return "pleurotus";
    if (roll < 0.4) return "lamella";
    if (roll < 0.6) return "imbricate";
    if (roll < 0.8) return "lasso";
    return "margin";
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
    return key === TRICK_KEY || key === "frill";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "ostreatus";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "ostreatus" ? "talk" : name === "pulmonarius" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function ostreatusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ostreatus));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.054, rot: s * 3.4, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 12.7) + 0.26 * Math.sin(t * 25.8);
      return {
        lift: 0.054 + Math.abs(tick) * 0.022,
        rot: 3.4 + tick * 2.35,
        dx: tick * 0.0024,
        anim: "talk",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.022 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "idle" };
  }
  function pulmonariusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pulmonarius));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.07, rot: s * -4.2, dx: s * 0.003, anim: "play" };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 5.9) + 0.24 * Math.sin(t * 11.8);
      return {
        lift: 0.07 + Math.abs(flash) * 0.03,
        rot: -4.2 + flash * 5.0,
        dx: flash * 0.0048,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.024 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "sit" };
  }
  function eryngiiPose(t) {
    return {
      lift: 0.014 + Math.abs(Math.sin(t * 0.38)) * 0.012,
      rot: Math.sin(t * 0.46) * 1.1,
      dx: Math.sin(t * 0.26) * 0.002,
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
    if (next.kind === "ostreatus") {
      const pose = ostreatusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "pulmonarius") {
      const pose = pulmonariusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = eryngiiPose(next.t);
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
      kind === "pleurotus"
    ? "sit"
    : kind === "lamella"
      ? "play"
      : kind === "imbricate"
        ? "talk"
        : kind === "lasso"
          ? "talk"
          : kind === "margin"
            ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "pleurotus" ? "hold" : "go",
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


  function pleurotusPose(t) {
    const breath = Math.sin(t * 0.12) + 0.045 * Math.sin(t * 0.39);
    const grit = Math.abs(Math.sin(t * 0.19));
    return {
      lift: 0.013 + grit * 0.011,
      rot: -0.38 + breath * 0.5,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.013 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.38 * (1 - u) };
  }

  function lamellaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lamella));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.028, rot: s * 1.8 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const bite = Math.sin(s * Math.PI * 4.6);
      const deepen = smoothstep(s);
      return {
        x: fromX + facing * deepen * 0.014,
        lift: -0.04 - Math.abs(bite) * 0.028 - deepen * 0.02,
        rot: facing * (2.2 + bite * 3.6),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: -0.018 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function imbricatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.imbricate));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.048, rot: s * -3.2 * facing, anim: "talk" };
    }
    if (u < 0.58) {
      const s = (u - 0.14) / 0.44;
      const pack = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * (0.02 + Math.abs(pack) * 0.012),
        lift: 0.055 + Math.abs(pack) * 0.045,
        rot: facing * (-3.4 + pack * 5.5),
        anim: "play",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.58) / 0.3;
      const press = smoothstep(s);
      return {
        x: fromX + facing * 0.028,
        lift: 0.035 - press * 0.04,
        rot: facing * (2.2 - press * 4.0),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 0.016 * (1 - s),
      lift: -0.008 * (1 - s),
      rot: facing * (0.6 * (1 - s)),
      anim: "sit",
    };
  }
  function lassoPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lasso));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: -0.05 + s * 0.02, rot: s * 1.2 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const rise = smoothstep(s);
      const shake = Math.sin(s * Math.PI * 3.0);
      return {
        x: fromX + facing * shake * 0.006,
        lift: -0.03 + rise * 0.12,
        rot: facing * (1.0 + shake * 2.8 + rise * 2.0),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 0.08 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit",
    };
  }
  function marginPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.margin));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.02, rot: s * -3.4 * facing, anim: "talk" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const glance = Math.sin(s * Math.PI * 2.35);
      const velour = Math.sin(s * Math.PI * 5.4) * 0.3;
      return {
        x: fromX + facing * glance * 0.004,
        lift: 0.018 + Math.abs(velour) * 0.01,
        rot: facing * (-2.8 + glance * 4.6 + velour),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.01 * (1 - s),
      rot: facing * (-0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lamella" && trick.kind !== "imbricate" && trick.kind !== "lasso" && trick.kind !== "margin") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "pleurotus") {
      if (next.t < PLEUROTUS_HOLD) {
        const pose = pleurotusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PLEUROTUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PLEUROTUS_HOLD);
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
    if (next.kind === "lamella") {
      const pose = lamellaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "imbricate") {
      const pose = imbricatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "lasso") {
      const pose = lassoPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = marginPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    PLEUROTUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    pleurotusPose,
    releasePose,
    lamellaPose,
    imbricatePose,
    lassoPose,
    marginPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    ostreatusPose,
    pulmonariusPose,
    eryngiiPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetOysterTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
