/** Wax ground tricks while idle. House neighborly honeycomb PLACE — festoon / capped / midrib / stores / tessera personality (festoon builder-bee festoon-chain settle across the blotter as comb architecture — never named figure (Comb) / hex (Comb) / corbicula (Comb) / hive (Comb) / nest (Clip + Column window) / bank (Lula + Bank guest) / dig (Thimble) / buzz (Relay) / dance (Rui) / hover (Sepia) / waggle (Comb window) / hum (Hum ethogram/guest), capped capped-brood hush settle on the architecture surface — never named brood as a trick kind (also Brood is the cicada guest) / hold as a trick kind / cell (mason ethogram) / cerumen (Pot) / batumen (Pot) / circle (Disc) / liner (Disc), midrib midrib plate align through the comb wall — never named pipe (Keep) / retinue (Keep) / duel (Keep) / royal (Keep) / hex (Comb) / partition (Auger) / plug (Mortar), stores honey-store settle in capped cells — never named honey (Comb happy) / mead (Comb happy) / nectar (Disk) / pollen (Moth happy) / vessel (Pot) / spout (Pot) / mass (Bank), tessera long hold desk life as hexagonal honeycomb place with langstroth / topbar / warre cousins in the thank-yous — never named hex (Comb) / hive (Comb) / mellifera (Hum) / regina (Keep) / andrena (Bank) / wax as a trick kind; guest slug Wax only for isKey matching). Feed-happy thank-yous sit after eat. Card-open freeze and window-play DRAW do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web honeycomb-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/honey_queen/Keep/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen/mining_bee/Bank or *Dragon electrical clone. Window-play DRAW unchanged — never names draw. Ethogram hold/sit_hold, brood/freeze, still/freeze unchanged — never names hold or brood as trick kinds. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Hum owns holoptic/congregation/sortie/ocellus/mellifera and happy ligustica/carnica/apisini; Keep owns pipe/retinue/duel/royal/regina and happy caucasica/iberiensis/apini; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Mortar owns trowel/beebread/orchard/plug/osmia and happy lignaria/cornifrons/osmiini; Disc owns circle/liner/cavity/parcel/megachile and happy rotundata/relativa/megachilini; Pot owns cerumen/spout/vessel/batumen/melipona and happy beecheii/yucatanica/meliponini; Sheen owns lustre/tumulus/salt/commune/agapostemon and happy virescens/texanus/halictini; Bank owns shaft/mass/vernal/fovea/andrena and happy vicina/carlini/andrenini; Lula owns bank; Disk owns pad/corolla/rhizome/calyx/sheen and happy silt/nectar/dew; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Clip owns nest; Thimble owns dig; Cap owns warts; Burr is hedgehog guest; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance; Ground happy owns gleam; Coin owns glint; Ember owns shine. Honeycomb place/architecture desk life only — not Comb worker, not Hum drone, not Keep queen. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "honeycomb";
  const TRICKS = ["festoon", "capped", "midrib", "stores", "tessera"];
  const HAPPY = ["langstroth", "topbar", "warre"];
  const HAPPY_DUR = { langstroth: 1.3, topbar: 1.36, warre: 1.4 };
  const TESSERA_HOLD = 14.8;
  const RELEASE_S = 0.74;
  const DUR = { tessera: TESSERA_HOLD + RELEASE_S, festoon: 1.72, capped: 1.84, midrib: 1.58, stores: 1.54 };

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
    if (kind === "tessera") return 52 + roll * 30;
    if (kind === "festoon") return 14 + roll * 10;
    if (kind === "capped") return 18 + roll * 11;
    if (kind === "stores") return 15 + roll * 12;
    return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tessera";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "tessera") {
      if (roll < 0.26) return "festoon";
      if (roll < 0.5) return "capped";
      if (roll < 0.74) return "midrib";
      return "stores";
    }
    if (lastKind === "festoon") {
      if (roll < 0.26) return "tessera";
      if (roll < 0.5) return "capped";
      if (roll < 0.74) return "midrib";
      return "stores";
    }
    if (lastKind === "capped") {
      if (roll < 0.22) return "tessera";
      if (roll < 0.44) return "festoon";
      if (roll < 0.68) return "midrib";
      return "stores";
    }
    if (roll < 0.2) return "tessera";
    if (roll < 0.4) return "festoon";
    if (roll < 0.6) return "capped";
    if (roll < 0.8) return "midrib";
    return "stores";
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
    return key === TRICK_KEY || key === "wax";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "langstroth";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "langstroth" ? "talk" : name === "topbar" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function langstrothPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.langstroth));
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
  function topbarPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.topbar));
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
  function warrePose(t) {
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
    if (next.kind === "langstroth") {
      const pose = langstrothPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "topbar") {
      const pose = topbarPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = warrePose(next.t);
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
      kind === "tessera"
    ? "sit"
    : kind === "festoon"
      ? "play"
      : kind === "capped"
        ? "talk"
        : kind === "midrib"
          ? "talk"
          : kind === "stores"
            ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "tessera" ? "hold" : "go",
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


  function tesseraPose(t) {
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

  function festoonPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.festoon));
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
  function cappedPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.capped));
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
  function midribPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.midrib));
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
  function storesPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.stores));
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
    if (shouldAbort(flags) && trick.kind !== "festoon" && trick.kind !== "capped" && trick.kind !== "midrib" && trick.kind !== "stores") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "tessera") {
      if (next.t < TESSERA_HOLD) {
        const pose = tesseraPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < TESSERA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - TESSERA_HOLD);
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
    if (next.kind === "festoon") {
      const pose = festoonPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "capped") {
      const pose = cappedPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "midrib") {
      const pose = midribPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = storesPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    TESSERA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tesseraPose,
    releasePose,
    festoonPose,
    cappedPose,
    midribPose,
    storesPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    langstrothPose,
    topbarPose,
    warrePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHoneycombTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
