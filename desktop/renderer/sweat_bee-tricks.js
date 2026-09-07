/** Sheen ground tricks while idle. House bicolored sweat bee — lustre / tumulus / salt / commune / agapostemon personality (lustre metallic green-and-black body tilt that catches the lamp — never named sheen (Disk) / glint (Coin) / gleam (Ground happy) / shine (ethogram + Ember) / gloss / polish / glabrous (Auger) / flash (Quill) / glitter (Dew) / nacre (Chamber), tumulus soil nest-mound tamp at the burrow mouth — never named dig (Thimble) / fossor (Thrum) / nest (Clip + Column window) / bank (mining window) / furrow (Ledger) / cell (mason ethogram) / gallery (Column) / heave (Ground) / lug (Ground) / earth (Ground), salt salt-mineral tongue dab on the blotter — never named lick (window LICK) / nectar (Disk happy) / sip (hummingbird window) / gulp (Coin) / taste (Nori) / probe (Saffron) / lap (Sash) / proboscis (Comb) / brine (Brine guest), commune solitary-to-communal nest aggregation settle — never named hive (Comb) / bustle (Column) / huddle (Penguin) / column / cluster / nest (Clip) / forage (Thrum window), agapostemon desk life as an Agapostemon virescens bicolored Halictidae with texanus cousins in the thank-yous; not Comb / Thrum / Auger / Mortar / Disc / Pot / Disk / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play LICK do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web sweat_bee-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot or *Dragon electrical clone. Window-play LICK unchanged — never names lick. Ethogram shine/hover/still unchanged — never names shine. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Mortar owns trowel/beebread/orchard/plug/osmia and happy lignaria/cornifrons/osmiini; Disc owns circle/liner/cavity/parcel/megachile and happy rotundata/relativa/megachilini; Pot owns cerumen/spout/vessel/batumen/melipona and happy beecheii/yucatanica/meliponini; Disk owns pad/corolla/rhizome/calyx/sheen and happy silt/nectar/dew; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Clip owns nest; Thimble owns dig; Cap owns warts; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance; Ground happy owns gleam; Coin owns glint; Ember owns shine. Agapostemon Halictidae metallic ground-nest desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "sweat_bee";
  const TRICKS = ["lustre", "tumulus", "salt", "commune", "agapostemon"];
  const HAPPY = ["virescens", "texanus", "halictini"];
  const HAPPY_DUR = { virescens: 1.22, texanus: 1.28, halictini: 1.3 };
  const AGAPOSTEMON_HOLD = 14.2;
  const RELEASE_S = 0.68;
  const DUR = { agapostemon: AGAPOSTEMON_HOLD + RELEASE_S, lustre: 1.58, tumulus: 1.72, salt: 1.46, commune: 1.54 };

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
    if (kind === "agapostemon") return 52 + roll * 30;
    if (kind === "lustre") return 14 + roll * 10;
    if (kind === "tumulus") return 18 + roll * 11;
    if (kind === "commune") return 15 + roll * 12;
    return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "agapostemon";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "agapostemon") {
      if (roll < 0.26) return "lustre";
      if (roll < 0.5) return "tumulus";
      if (roll < 0.74) return "salt";
      return "commune";
    }
    if (lastKind === "lustre") {
      if (roll < 0.26) return "agapostemon";
      if (roll < 0.5) return "tumulus";
      if (roll < 0.74) return "salt";
      return "commune";
    }
    if (lastKind === "tumulus") {
      if (roll < 0.22) return "agapostemon";
      if (roll < 0.44) return "lustre";
      if (roll < 0.68) return "salt";
      return "commune";
    }
    if (roll < 0.2) return "agapostemon";
    if (roll < 0.4) return "lustre";
    if (roll < 0.6) return "tumulus";
    if (roll < 0.8) return "salt";
    return "commune";
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
    return key === TRICK_KEY || key === "sheen";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "virescens";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "virescens" ? "talk" : name === "texanus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function virescensPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.virescens));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.052, rot: s * 3.2, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 12.4) + 0.24 * Math.sin(t * 24.8);
      return {
        lift: 0.052 + Math.abs(tick) * 0.02,
        rot: 3.2 + tick * 2.2,
        dx: tick * 0.0024,
        anim: "talk",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.022 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "idle" };
  }
  function texanusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.texanus));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.068, rot: s * -4.0, dx: s * 0.003, anim: "play" };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 5.4) + 0.22 * Math.sin(t * 10.8);
      return {
        lift: 0.068 + Math.abs(flash) * 0.028,
        rot: -4.0 + flash * 4.8,
        dx: flash * 0.0048,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.024 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "sit" };
  }
  function halictiniPose(t) {
    return {
      lift: 0.014 + Math.abs(Math.sin(t * 0.34)) * 0.012,
      rot: Math.sin(t * 0.42) * 1.05,
      dx: Math.sin(t * 0.24) * 0.002,
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
    if (next.kind === "virescens") {
      const pose = virescensPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "texanus") {
      const pose = texanusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = halictiniPose(next.t);
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
      kind === "agapostemon"
    ? "sit"
    : kind === "lustre"
      ? "play"
      : kind === "tumulus"
        ? "talk"
        : kind === "salt"
          ? "talk"
          : kind === "commune"
            ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "agapostemon" ? "hold" : "go",
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

  function agapostemonPose(t) {
    const breath = Math.sin(t * 0.13) + 0.05 * Math.sin(t * 0.48);
    const metal = Math.abs(Math.sin(t * 0.19));
    return {
      lift: 0.016 + metal * 0.012,
      rot: 0.42 + breath * 0.55,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.016 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.42 * (1 - u) };
  }

  function lustrePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lustre));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.055, rot: s * 4.2 * facing, anim: "play" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const tilt = Math.sin(s * Math.PI * 2.2);
      const catchLamp = Math.sin(s * Math.PI * 4.8);
      return {
        x: fromX + facing * tilt * 0.008,
        lift: 0.05 + Math.abs(catchLamp) * 0.032,
        rot: facing * (3.6 + tilt * 5.5 + catchLamp * 2.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.022 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit",
    };
  }
  function tumulusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tumulus));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.018, rot: s * -1.6 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const push = smoothstep(s);
      return {
        x: fromX + facing * (0.02 + push * 0.08),
        lift: 0.045 + push * 0.08,
        rot: facing * (-3.2 + push * 8.5),
        anim: "talk",
      };
    }
    if (u < 0.86) {
      const s = (u - 0.55) / 0.31;
      const tamp = Math.sin(s * Math.PI * 3.4);
      return {
        x: fromX + facing * (0.05 + tamp * 0.01),
        lift: 0.035 + Math.abs(tamp) * 0.04,
        rot: facing * (2.4 + tamp * 3.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 0.028 * (1 - s * 0.4),
      lift: -0.008 * (1 - s),
      rot: facing * (0.7 * (1 - s)),
      anim: "sit",
    };
  }
  function saltPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.salt));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.04, rot: s * -2.2 * facing, anim: "talk" };
    }
    if (u < 0.82) {
      const s = (u - 0.16) / 0.66;
      const dab = Math.sin(s * Math.PI * 5.6);
      const lean = Math.sin(s * Math.PI * 1.4);
      return {
        x: fromX + facing * lean * 0.01,
        lift: 0.032 + Math.abs(dab) * 0.022,
        rot: facing * (-1.6 + dab * 3.2 + lean * 1.2),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.016 * (1 - s),
      rot: facing * (-0.6 * (1 - s)),
      anim: "sit",
    };
  }
  function communePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.commune));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.028, rot: s * 1.5 * facing, anim: "sit" };
    }
    if (u < 0.8) {
      const s = (u - 0.18) / 0.62;
      const settle = Math.sin(s * Math.PI * 1.6);
      const neighbor = Math.sin(s * Math.PI * 3.2) * 0.35;
      return {
        x: fromX + facing * (0.024 * s + settle * 0.008),
        lift: 0.022 + Math.abs(neighbor) * 0.016,
        rot: facing * (1.1 + settle * 1.4 + neighbor),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX + facing * 0.022 * (1 - s * 0.3),
      lift: 0.012 * (1 - s),
      rot: facing * (0.5 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lustre" && trick.kind !== "tumulus" && trick.kind !== "salt" && trick.kind !== "commune") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "agapostemon") {
      if (next.t < AGAPOSTEMON_HOLD) {
        const pose = agapostemonPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < AGAPOSTEMON_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - AGAPOSTEMON_HOLD);
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
    if (next.kind === "lustre") {
      const pose = lustrePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tumulus") {
      const pose = tumulusPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "salt") {
      const pose = saltPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = communePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    AGAPOSTEMON_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    agapostemonPose,
    releasePose,
    lustrePose,
    tumulusPose,
    saltPose,
    communePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    virescensPose,
    texanusPose,
    halictiniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetSweatBeeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
