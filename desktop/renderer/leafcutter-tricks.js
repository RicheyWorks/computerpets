/** Disc ground tricks while idle. House leafcutter bee — circle / liner / cavity / parcel / megachile personality (circle mandibular leaf-disc cut on the blotter leaf — never named snip (window SNIP) / cut (ethogram) / pad (Disk) / corolla (Disk) / rhizome (Disk) / calyx (Disk) / sheen (Disk) / trowel (Mortar) / rasp (Auger) / dig (Thimble) / gnaw (beaver) / nest (Clip + Column window), liner nest-lining pack of leaf discs into a solitary cell — never named plug (Mortar) / partition (Auger) / seal (mason ethogram) / daub (mason window) / hive (Comb) / hex (Comb) / nest (Clip) / crumb (Column) / beebread (Mortar), cavity solitary cavity nest settle — never named fossor (Thrum) / gallery (Column) / bank (mining window) / dig (Thimble) / chamber (Nautilus guest) / cell (mason ethogram talk) / nest (Clip), parcel under-body leaf-disc carry home — never named corbicula (Comb) / scopa (Thrum) / pollen (Moth happy) / forage (Thrum window) / figure (Comb) / lumber (Thrum) / cheek (Clip) / pocket (Clip), megachile desk life as a Megachile rotundata alfalfa leafcutter with relativa cousins in the thank-yous; not Comb / Thrum / Auger / Mortar / Disk / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play SNIP do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web leafcutter-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar or *Dragon electrical clone. Window-play SNIP unchanged — never names snip. Ethogram cut/hover/still unchanged. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Mortar owns trowel/beebread/orchard/plug/osmia and happy lignaria/cornifrons/osmiini; Disk owns pad/corolla/rhizome/calyx/sheen and happy silt/nectar/dew; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Clip owns nest; Thimble owns dig; Cap owns warts; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance. Megachile solitary leaf-disc desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "leafcutter";
  const TRICKS = ["circle", "liner", "cavity", "parcel", "megachile"];
  const HAPPY = ["rotundata", "relativa", "megachilini"];
  const HAPPY_DUR = { rotundata: 1.24, relativa: 1.3, megachilini: 1.26 };
  const MEGACHILE_HOLD = 13.8;
  const RELEASE_S = 0.7;
  const DUR = { megachile: MEGACHILE_HOLD + RELEASE_S, circle: 1.62, liner: 1.68, cavity: 1.52, parcel: 1.48 };

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
    if (kind === "megachile") return 50 + roll * 32;
    if (kind === "circle") return 15 + roll * 11;
    if (kind === "liner") return 17 + roll * 12;
    if (kind === "parcel") return 16 + roll * 11;
    return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "megachile";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "megachile") {
      if (roll < 0.26) return "circle";
      if (roll < 0.5) return "liner";
      if (roll < 0.74) return "cavity";
      return "parcel";
    }
    if (lastKind === "circle") {
      if (roll < 0.26) return "megachile";
      if (roll < 0.5) return "liner";
      if (roll < 0.74) return "cavity";
      return "parcel";
    }
    if (lastKind === "liner") {
      if (roll < 0.22) return "megachile";
      if (roll < 0.44) return "circle";
      if (roll < 0.68) return "cavity";
      return "parcel";
    }
    if (roll < 0.2) return "megachile";
    if (roll < 0.4) return "circle";
    if (roll < 0.6) return "liner";
    if (roll < 0.8) return "cavity";
    return "parcel";
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
    return key === TRICK_KEY || key === "disc";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "rotundata";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "rotundata" ? "talk" : name === "relativa" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function rotundataPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.rotundata));
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
  function relativaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.relativa));
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
  function megachiliniPose(t) {
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
    if (next.kind === "rotundata") {
      const pose = rotundataPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "relativa") {
      const pose = relativaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = megachiliniPose(next.t);
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
      kind === "megachile"
      ? "sit"
      : kind === "circle"
        ? "play"
        : kind === "liner"
          ? "play"
          : kind === "cavity"
            ? "talk"
            : kind === "parcel"
              ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "megachile" ? "hold" : "go",
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

  function megachilePose(t) {
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

  function circlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.circle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.03, rot: s * -2.8 * facing, anim: "play" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const arc = Math.sin(s * Math.PI * 2);
      const bite = Math.sin(s * Math.PI * 6.5);
      return {
        x: fromX + facing * (Math.cos(s * Math.PI * 2) * 0.028),
        lift: 0.03 + Math.abs(arc) * 0.035 + Math.abs(bite) * 0.012,
        rot: facing * (-2.8 + s * 5.6 + bite * 2.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: 0.02 * (1 - s),
      rot: facing * (1.2 * (1 - s)),
      anim: "sit",
    };
  }
  function linerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.liner));
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
  function cavityPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cavity));
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
  function parcelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.parcel));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.06, rot: s * 2.0 * facing, anim: "talk" };
    }
    if (u < 0.78) {
      const s = (u - 0.16) / 0.62;
      const haul = Math.sin(s * Math.PI * 1.8);
      const bob = Math.sin(s * Math.PI * 5.2);
      return {
        x: fromX + facing * (0.05 * s + haul * 0.012),
        lift: 0.06 + Math.abs(bob) * 0.028,
        rot: facing * (2.0 + haul * 1.6 + bob * 1.1),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.04 * (1 - s * 0.35),
      lift: 0.02 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "circle" && trick.kind !== "liner" && trick.kind !== "cavity" && trick.kind !== "parcel") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "megachile") {
      if (next.t < MEGACHILE_HOLD) {
        const pose = megachilePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MEGACHILE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MEGACHILE_HOLD);
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
    if (next.kind === "circle") {
      const pose = circlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "liner") {
      const pose = linerPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cavity") {
      const pose = cavityPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = parcelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    MEGACHILE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    megachilePose,
    releasePose,
    circlePose,
    linerPose,
    cavityPose,
    parcelPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    rotundataPose,
    relativaPose,
    megachiliniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetLeafcutterTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
