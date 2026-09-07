/** Mortar ground tricks while idle. House mason bee — trowel / beebread / orchard / plug / osmia personality (trowel mandibular mud-mortar pack into an inkstone cell wall — never named daub (window DAUB) / seal (ethogram + special) / partition (Auger) / rasp (Auger) / gallery (Column) / chew / dig (Thimble) / gnaw (beaver) / fossor (Thrum) / nest (Clip + Column window) / bank (window DIG) / cell (ethogram talk), beebread pollen-nectar provision loaf pack into a solitary tube cell — never named corbicula (Comb) / scopa (Thrum) / pollen (Moth happy) / hive (Comb) / hex (Comb) / crumb (Column) / loaf (Whee ethogram talk), orchard gentle spring bloom visit — never named forage (Thrum window) / figure (Comb) / sonicate (Thrum) / picket (Auger) / hover (Sepia + ethogram) / lumber (Thrum) / thrum (Vesper) / drone (Hum window), plug mud entrance finish — never named seal (ethogram) / daub (window) / partition (Auger) / cap (Cap guest) / nest (Clip) / hive (Comb), osmia desk life as an Osmia lignaria blue orchard mason with hornfaced cousins in the thank-yous; not Comb / Thrum / Auger / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play DAUB do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web mason_bee-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger or *Dragon electrical clone. Window-play DAUB unchanged — never names daub. Ethogram seal/hover/still unchanged. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Disk owns sheen; Clip owns nest; Thimble owns dig; Cap owns warts; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance. Osmia solitary mud-tube desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "mason_bee";
  const TRICKS = ["trowel", "beebread", "orchard", "plug", "osmia"];
  const HAPPY = ["lignaria", "cornifrons", "osmiini"];
  const HAPPY_DUR = { lignaria: 1.24, cornifrons: 1.3, osmiini: 1.26 };
  const OSMIA_HOLD = 13.8;
  const RELEASE_S = 0.7;
  const DUR = { osmia: OSMIA_HOLD + RELEASE_S, trowel: 1.62, beebread: 1.68, orchard: 1.52, plug: 1.48 };

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
    if (kind === "osmia") return 50 + roll * 32;
    if (kind === "trowel") return 15 + roll * 11;
    if (kind === "beebread") return 17 + roll * 12;
    if (kind === "plug") return 16 + roll * 11;
    return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "osmia";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "osmia") {
      if (roll < 0.26) return "trowel";
      if (roll < 0.5) return "beebread";
      if (roll < 0.74) return "orchard";
      return "plug";
    }
    if (lastKind === "trowel") {
      if (roll < 0.26) return "osmia";
      if (roll < 0.5) return "beebread";
      if (roll < 0.74) return "orchard";
      return "plug";
    }
    if (lastKind === "beebread") {
      if (roll < 0.22) return "osmia";
      if (roll < 0.44) return "trowel";
      if (roll < 0.68) return "orchard";
      return "plug";
    }
    if (roll < 0.2) return "osmia";
    if (roll < 0.4) return "trowel";
    if (roll < 0.6) return "beebread";
    if (roll < 0.8) return "orchard";
    return "plug";
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
    return key === TRICK_KEY || key === "mortar";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "lignaria";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "lignaria" ? "talk" : name === "cornifrons" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function lignariaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lignaria));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.048, rot: s * 2.6, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 13.8) + 0.26 * Math.sin(t * 27.6);
      return {
        lift: 0.048 + Math.abs(tick) * 0.018,
        rot: 2.6 + tick * 1.9,
        dx: tick * 0.0022,
        anim: "talk",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.02 * (1 - s), rot: 1.0 * (1 - s), dx: 0, anim: "idle" };
  }
  function cornifronsPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cornifrons));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.07, rot: s * -3.8, dx: s * 0.0028, anim: "play" };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 5.0) + 0.2 * Math.sin(t * 10);
      return {
        lift: 0.07 + Math.abs(flash) * 0.026,
        rot: -3.8 + flash * 4.6,
        dx: flash * 0.0045,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.026 * (1 - s), rot: -1.3 * (1 - s), dx: 0, anim: "sit" };
  }
  function osmiiniPose(t) {
    return {
      lift: 0.015 + Math.abs(Math.sin(t * 0.36)) * 0.013,
      rot: Math.sin(t * 0.46) * 1.15,
      dx: Math.sin(t * 0.26) * 0.0022,
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
    if (next.kind === "lignaria") {
      const pose = lignariaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cornifrons") {
      const pose = cornifronsPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = osmiiniPose(next.t);
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
      kind === "osmia"
      ? "sit"
      : kind === "trowel"
        ? "play"
        : kind === "beebread"
          ? "play"
          : kind === "orchard"
            ? "talk"
            : kind === "plug"
              ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "osmia" ? "hold" : "go",
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

  function osmiaPose(t) {
    const breath = Math.sin(t * 0.13) + 0.05 * Math.sin(t * 0.62);
    const metal = Math.abs(Math.sin(t * 0.28));
    return {
      lift: 0.016 + metal * 0.011,
      rot: 0.48 + breath * 0.58,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.016 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.48 * (1 - u) };
  }

  function trowelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.trowel));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: -0.02 * s, rot: s * 2.2 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const pack = Math.sin(s * Math.PI * 4.2);
      const press = Math.sin(s * Math.PI * 8.4);
      return {
        x: fromX + facing * (0.018 * s + pack * 0.01),
        lift: -0.02 - s * 0.04 + Math.abs(press) * 0.01,
        rot: facing * (2.2 + pack * 2.4 + press * 1.1),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.022 * (1 - s * 0.4),
      lift: -0.03 * (1 - s),
      rot: facing * (1.0 * (1 - s)),
      anim: "sit",
    };
  }
  function beebreadPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.beebread));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.025, rot: s * -2.8 * facing, anim: "sit" };
    }
    if (u < 0.58) {
      const s = (u - 0.16) / 0.42;
      const pack = smoothstep(s);
      return {
        x: fromX + facing * pack * 0.04,
        lift: 0.025 - pack * 0.055,
        rot: facing * (-2.8 + pack * 6.0),
        anim: "play",
      };
    }
    if (u < 0.86) {
      const s = (u - 0.58) / 0.28;
      const tamp = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * (0.04 + tamp * 0.008),
        lift: -0.03 + Math.abs(tamp) * 0.022,
        rot: facing * (3.2 + tamp * 1.8),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 0.032 * (1 - s * 0.35),
      lift: -0.012 * (1 - s),
      rot: facing * (1.0 * (1 - s)),
      anim: "sit",
    };
  }
  function orchardPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.orchard));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.085, rot: s * 3.4 * facing, anim: "talk" };
    }
    if (u < 0.8) {
      const s = (u - 0.14) / 0.66;
      const bloom = Math.sin(s * Math.PI * 2.2);
      const soft = Math.sin(s * Math.PI * 4.4) * 0.35;
      return {
        x: fromX + facing * bloom * 0.014,
        lift: 0.085 + Math.abs(soft) * 0.03,
        rot: facing * (3.4 - s * 1.2 + bloom * 2.0 + soft),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX,
      lift: 0.03 * (1 - s),
      rot: facing * (1.2 * (1 - s)),
      anim: "sit",
    };
  }
  function plugPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.plug));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.02, rot: s * -2.4 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.18) / 0.52;
      const seal = smoothstep(s);
      const tamp = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * seal * 0.03,
        lift: 0.02 - seal * 0.045 + Math.abs(tamp) * 0.012,
        rot: facing * (-2.4 + seal * 4.8 + tamp * 1.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX + facing * 0.024 * (1 - s * 0.45),
      lift: -0.015 * (1 - s),
      rot: facing * (1.1 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "trowel" && trick.kind !== "beebread" && trick.kind !== "orchard" && trick.kind !== "plug") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "osmia") {
      if (next.t < OSMIA_HOLD) {
        const pose = osmiaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < OSMIA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - OSMIA_HOLD);
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
    if (next.kind === "trowel") {
      const pose = trowelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "beebread") {
      const pose = beebreadPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "orchard") {
      const pose = orchardPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = plugPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    OSMIA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    osmiaPose,
    releasePose,
    trowelPose,
    beebreadPose,
    orchardPose,
    plugPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    lignariaPose,
    cornifronsPose,
    osmiiniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMasonBeeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
