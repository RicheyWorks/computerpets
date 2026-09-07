/** Pot ground tricks while idle. House Maya stingless bee — cerumen / spout / vessel / batumen / melipona personality (cerumen mandibular wax-resin pot mold on the blotter — never named tend (window TEND) / pot (ethogram) / hive (Comb) / hex (Comb) / plug (Mortar) / trowel (Mortar) / daub (mason window) / seal (mason ethogram) / partition (Auger) / circle (Disc) / liner (Disc) / rasp (Auger) / dig (Thimble) / nest (Clip + Column window) / urn (Drown) / cistern (Drown), spout cerumen entrance-tube raise — never named tube (Wick) / funnel / tend (window) / gallery (Column) / picket (Auger) / fossor (Thrum) / bank (mining window) / nest (Clip) / chamber (Nautilus guest), vessel honey-pollen pot store fill — never named beebread (Mortar) / corbicula (Comb) / scopa (Thrum) / pollen (Moth happy) / forage (Thrum window) / crumb (Column) / store (Arm window) / fill (Drown window) / parcel (Disc) / hive (Comb), batumen resin nest-enclosure pack — never named plug (Mortar) / partition (Auger) / seal (mason ethogram) / daub (window) / propolis (Comb happy) / bustle (Column) / cavity (Disc) / nest (Clip), melipona desk life as a Melipona beecheii Maya stingless with yucatanica cousins in the thank-yous; not Comb / Thrum / Auger / Mortar / Disc / Disk / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play TEND do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web stingless-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc or *Dragon electrical clone. Window-play TEND unchanged — never names tend. Ethogram pot/hover/still unchanged. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Mortar owns trowel/beebread/orchard/plug/osmia and happy lignaria/cornifrons/osmiini; Disc owns circle/liner/cavity/parcel/megachile and happy rotundata/relativa/megachilini; Disk owns pad/corolla/rhizome/calyx/sheen and happy silt/nectar/dew; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Clip owns nest; Thimble owns dig; Cap owns warts; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance. Melipona eusocial cerumen-pot desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "stingless";
  const TRICKS = ["cerumen", "spout", "vessel", "batumen", "melipona"];
  const HAPPY = ["beecheii", "yucatanica", "meliponini"];
  const HAPPY_DUR = { beecheii: 1.24, yucatanica: 1.3, meliponini: 1.26 };
  const MELIPONA_HOLD = 13.8;
  const RELEASE_S = 0.7;
  const DUR = { melipona: MELIPONA_HOLD + RELEASE_S, cerumen: 1.62, spout: 1.68, vessel: 1.52, batumen: 1.48 };

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
    if (kind === "melipona") return 50 + roll * 32;
    if (kind === "cerumen") return 15 + roll * 11;
    if (kind === "spout") return 17 + roll * 12;
    if (kind === "batumen") return 16 + roll * 11;
    return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "melipona";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "melipona") {
      if (roll < 0.26) return "cerumen";
      if (roll < 0.5) return "spout";
      if (roll < 0.74) return "vessel";
      return "batumen";
    }
    if (lastKind === "cerumen") {
      if (roll < 0.26) return "melipona";
      if (roll < 0.5) return "spout";
      if (roll < 0.74) return "vessel";
      return "batumen";
    }
    if (lastKind === "spout") {
      if (roll < 0.22) return "melipona";
      if (roll < 0.44) return "cerumen";
      if (roll < 0.68) return "vessel";
      return "batumen";
    }
    if (roll < 0.2) return "melipona";
    if (roll < 0.4) return "cerumen";
    if (roll < 0.6) return "spout";
    if (roll < 0.8) return "vessel";
    return "batumen";
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
    return key === TRICK_KEY || key === "pot";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "beecheii";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "beecheii" ? "talk" : name === "yucatanica" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function beecheiiPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.beecheii));
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
  function yucatanicaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.yucatanica));
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
  function meliponiniPose(t) {
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
    if (next.kind === "beecheii") {
      const pose = beecheiiPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "yucatanica") {
      const pose = yucatanicaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = meliponiniPose(next.t);
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
      kind === "melipona"
      ? "sit"
      : kind === "cerumen"
        ? "play"
        : kind === "spout"
          ? "play"
          : kind === "vessel"
            ? "talk"
            : kind === "batumen"
              ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "melipona" ? "hold" : "go",
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

  function meliponaPose(t) {
    const breath = Math.sin(t * 0.11) + 0.04 * Math.sin(t * 0.55);
    const wax = Math.abs(Math.sin(t * 0.22));
    return {
      lift: 0.014 + wax * 0.01,
      rot: 0.36 + breath * 0.5,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.014 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.36 * (1 - u) };
  }

  function cerumenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cerumen));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.03, rot: s * -2.8 * facing, anim: "play" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const oval = Math.sin(s * Math.PI * 1.6);
      const knead = Math.sin(s * Math.PI * 5.2);
      return {
        x: fromX + facing * (Math.cos(s * Math.PI * 1.6) * 0.022),
        lift: 0.034 + Math.abs(oval) * 0.04 + Math.abs(knead) * 0.014,
        rot: facing * (-2.2 + s * 4.4 + knead * 1.8),
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
  function spoutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spout));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.025, rot: s * -2.8 * facing, anim: "sit" };
    }
    if (u < 0.58) {
      const s = (u - 0.16) / 0.42;
      const pack = smoothstep(s);
      return {
        x: fromX + facing * pack * 0.055,
        lift: 0.04 + pack * 0.09,
        rot: facing * (-2.4 + pack * 6.5),
        anim: "play",
      };
    }
    if (u < 0.86) {
      const s = (u - 0.58) / 0.28;
      const tamp = Math.sin(s * Math.PI * 2.6);
      return {
        x: fromX + facing * (0.04 + tamp * 0.008),
        lift: 0.06 + Math.abs(tamp) * 0.02,
        rot: facing * (2.4 + tamp * 1.4),
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
  function vesselPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.vessel));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.085, rot: s * 3.4 * facing, anim: "talk" };
    }
    if (u < 0.8) {
      const s = (u - 0.14) / 0.66;
      const fill = Math.sin(s * Math.PI * 1.8);
      const soft = Math.sin(s * Math.PI * 3.6) * 0.3;
      return {
        x: fromX + facing * fill * 0.012,
        lift: 0.07 + Math.abs(soft) * 0.028,
        rot: facing * (2.8 - s * 1.0 + fill * 1.6 + soft),
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
  function batumenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.batumen));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.06, rot: s * 2.0 * facing, anim: "talk" };
    }
    if (u < 0.78) {
      const s = (u - 0.16) / 0.62;
      const haul = Math.sin(s * Math.PI * 2.1);
      const bob = Math.sin(s * Math.PI * 4.4);
      return {
        x: fromX + facing * (0.038 * s + haul * 0.01),
        lift: 0.045 + Math.abs(bob) * 0.024,
        rot: facing * (1.6 + haul * 1.8 + bob * 1.0),
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
    if (shouldAbort(flags) && trick.kind !== "cerumen" && trick.kind !== "spout" && trick.kind !== "vessel" && trick.kind !== "batumen") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "melipona") {
      if (next.t < MELIPONA_HOLD) {
        const pose = meliponaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MELIPONA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MELIPONA_HOLD);
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
    if (next.kind === "cerumen") {
      const pose = cerumenPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spout") {
      const pose = spoutPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "vessel") {
      const pose = vesselPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = batumenPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    MELIPONA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    meliponaPose,
    releasePose,
    cerumenPose,
    spoutPose,
    vesselPose,
    batumenPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    beecheiiPose,
    yucatanicaPose,
    meliponiniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetStinglessTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
