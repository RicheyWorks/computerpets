/** Bank ground tricks while idle — ultra-polish pass. House neighborly mining bee — shaft / mass / vernal / fovea / floccus / dufourline / andrena personality (shaft soil-tunnel shaft work at the sand tray — never named dig (Thimble + ethogram + window DIG) / tumulus (Sheen) / fossor (Thrum) / nest (Clip + Column window) / bank (Lula boa trick + guest slug + mining window) / furrow (Ledger) / cell (mason ethogram) / gallery (Column) / heave (Ground) / lug (Ground) / earth (Ground) / adit / mine / nestmound (Sheen dens), mass pollen-mass pack into a brood cell — never named scopa (Thrum) / corbicula (Comb) / beebread (Mortar) / parcel (Disc) / provision (Mortar comment) / loaf (Axolotl) / pollenball / tubeprovision (Mortar dens), vernal solitary spring emerge from the overwinter hold — never named emerge (Cicada) / egress (Cicada + Thrum) / spring (Cat + Mortar) / cast (Cicada) / harden (Cicada), fovea facial-fovea desk glance characteristic of Andrena — never named salt (Sheen) / lustre (Sheen) / shine (ethogram + Ember) / sheen (Disk) / glint (Coin) / gleam (Ground happy) / metallictilt (Sheen dens), floccus iconic Andrena hind-trochanter curled pollen-tuft load (not scopa Thrum tibial/abdominal / corbicula Comb / mass pollen-pack / thoraxload Thrum / corbicularub Thrum / pollen Moth happy / forage Thrum window), dufourline iconic Andrena Dufour's-gland waterproof brood-cell lining (not liner Disc / plug Mortar / parcel Disc / cellcup Disc / cavity Disc / batumen Pot / involucrum Pot / mudseptum Mortar / cell mason ethogram / pygidial Vinegaroon), andrena desk life as an Andrena vicina neighborly Andrenidae with carlini cousins in the thank-yous; not Comb / Thrum / Auger / Mortar / Disc / Pot / Sheen / Disk / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / Hum / Cap / Keep / *Dragon copies). Floccus is the iconic hind-trochanter pollen tuft (not mass). Dufourline is the iconic gland-lined cell (not shaft). Window-play DIG unchanged — never names dig as a trick. Ethogram keeps andrena sit_hold; adds shaft/mass/vernal/fovea/floccus/dufourline softs + freeze (replaces thin dig/hover/still — Thimble owns dig; Sepia owns hover; window DIG owns dig). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via mining_bee.wav. Thank-yous vicina / carlini / andrenini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `mining_bee-tricks.ts`. True house-mining-bee desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/honey_drone/Hum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen/honey_queen/Keep or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids dig/hover/still/bank/tumulus/fossor/scopa/corbicula/beebread/liner/plug/parcel/cellcup/pygidial/nestmound/metallictilt/potpress/involucrum/discpress/mudseptum/tubeprovision/thoraxload/corbicularub name collisions. Bird ultra + denser guests done; skip Rui + birds. Sheen/Hum already dens; skip them. Pot now owns potpress/involucrum dens; Disc owns discpress/cellcup dens; Mortar owns mudseptum/tubeprovision dens; Auger owns tunnelrasp/baldflash dens; Thrum owns thoraxload/corbicularub. ANDRENA_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Keep / honey_queen. Catalog 221. No cry inventing beyond house mining_bee.wav prefer. Never retouch Rui sprites. No dig, not window DIG. No hover, not Sepia. No still, not retired ethogram. */
(function (root) {
  const TRICK_KEY = "mining_bee";
  const TRICKS = ["shaft", "mass", "vernal", "fovea", "floccus", "dufourline", "andrena"];
  const HAPPY = ["vicina", "carlini", "andrenini"];

  const HAPPY_DUR = {
    vicina: 1.74,
    carlini: 1.86,
    andrenini: 1.78,
  };

  /** Andrena hold — Bank parks Andrena vicina calm on the blotter. Not window-play DIG. */
  const ANDRENA_HOLD = 11.2;
  const RELEASE_S = 1.18;

  const DUR = {
    andrena: ANDRENA_HOLD + RELEASE_S,
    shaft: 2.46,
    mass: 2.48,
    vernal: 2.42,
    fovea: 2.44,
    floccus: 2.52,
    dufourline: 2.48,
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
    if (kind === "andrena") return 38 + roll * 24;
    if (kind === "floccus" || kind === "dufourline" || kind === "shaft") return 12 + roll * 9;
    if (kind === "mass" || kind === "vernal" || kind === "fovea") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "andrena";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "andrena") {
      if (roll < 0.18) return "shaft";
      if (roll < 0.34) return "mass";
      if (roll < 0.5) return "vernal";
      if (roll < 0.66) return "fovea";
      if (roll < 0.83) return "floccus";
      return "dufourline";
    }
    if (lastKind === "shaft") {
      if (roll < 0.2) return "andrena";
      if (roll < 0.36) return "mass";
      if (roll < 0.52) return "vernal";
      if (roll < 0.68) return "fovea";
      if (roll < 0.84) return "floccus";
      return "dufourline";
    }
    if (lastKind === "mass") {
      if (roll < 0.18) return "andrena";
      if (roll < 0.34) return "shaft";
      if (roll < 0.5) return "vernal";
      if (roll < 0.66) return "fovea";
      if (roll < 0.83) return "floccus";
      return "dufourline";
    }
    if (lastKind === "floccus") {
      if (roll < 0.2) return "andrena";
      if (roll < 0.36) return "shaft";
      if (roll < 0.52) return "mass";
      if (roll < 0.68) return "vernal";
      if (roll < 0.84) return "fovea";
      return "dufourline";
    }
    if (roll < 0.16) return "andrena";
    if (roll < 0.3) return "shaft";
    if (roll < 0.44) return "mass";
    if (roll < 0.58) return "vernal";
    if (roll < 0.72) return "fovea";
    if (roll < 0.86) return "floccus";
    return "dufourline";
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
    return key === TRICK_KEY || key === "bank";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "vicina";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "vicina" ? "talk" : name === "carlini" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function vicinaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vicina));
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

  function carliniPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.carlini));
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

  function andreniniPose(t) {
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
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "vicina") {
      const pose = vicinaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "carlini") {
      const pose = carliniPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = andreniniPose(next.t);
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
    const anim = kind === "andrena"
        ? "sit"
        : kind === "shaft"
          ? "play"
          : kind === "mass"
            ? "talk"
            : kind === "vernal"
              ? "talk"
              : kind === "fovea"
                ? "sit"
                : kind === "floccus"
                  ? "play"
                  : kind === "dufourline"
                    ? "talk"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "andrena" ? "hold" : "go",
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

  function andrenaPose(t) {
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

  function shaftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.shaft));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -1.2, rot: s * 8 * facing, anim: "sit" };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const bite = Math.sin(s * Math.PI * 4.2);
      const deepen = smoothstep(s);
      return {
        x: fromX + facing * deepen * 1.05,
        lift: -0.8 + Math.abs(bite) * 2.4 + deepen * 2.2,
        rot: facing * (8 + bite * 6.5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.7 * (1 - s),
      lift: 1.4 * (1 - s),
      rot: facing * (3.2 * (1 - s)),
      anim: "sit",
    };
  }

  function massPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mass));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 2.9, rot: s * -8 * facing, anim: "talk" };
    }
    if (u < 0.58) {
      const s = (u - 0.14) / 0.44;
      const pack = Math.sin(s * Math.PI * 3.8);
      return {
        x: fromX + facing * (0.55 + Math.abs(pack) * 0.4),
        lift: 2.9 + Math.abs(pack) * 1.4,
        rot: facing * (-8 + pack * 10),
        anim: "play",
      };
    }
    if (u < 0.88) {
      const s = (u - 0.58) / 0.3;
      const press = smoothstep(s);
      return {
        x: fromX + facing * 0.85,
        lift: 3.1 - press * 0.6,
        rot: facing * (6 - press * 3),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 0.45 * (1 - s),
      lift: 1.3 * (1 - s),
      rot: facing * (2.2 * (1 - s)),
      anim: "sit",
    };
  }

  function vernalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.vernal));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: -1.3 + s * 1.1, rot: s * 6 * facing, anim: "sit" };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const rise = smoothstep(s);
      const shake = Math.sin(s * Math.PI * 2.6);
      return {
        x: fromX + facing * shake * 0.45,
        lift: -0.2 + rise * 3.6,
        rot: facing * (5.5 + shake * 6.5 + rise * 3.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 2.4 * (1 - s),
      rot: facing * (3.4 * (1 - s)),
      anim: "sit",
    };
  }

  function foveaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fovea));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.4, rot: s * -9 * facing, anim: "talk" };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const glance = Math.sin(s * Math.PI * 2.1);
      const velour = Math.sin(s * Math.PI * 5.0) * 0.28;
      return {
        x: fromX + facing * glance * 0.35,
        lift: 2.4 + Math.abs(velour) * 1.15,
        rot: facing * (-8 + glance * 11 + velour * 4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 1.1 * (1 - s),
      rot: facing * (-2.4 * (1 - s)),
      anim: "sit",
    };
  }

  function floccusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.floccus));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.1, rot: s * 10 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const tuft = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * tuft * 0.55,
        lift: 3.0 + Math.abs(tuft) * 1.5,
        rot: facing * (10 + tuft * 8),
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const comb = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * (0.5 + comb * 0.3),
        lift: 3.5 + Math.abs(comb) * 0.95,
        rot: facing * (13 - s * 2 + comb * 4),
        anim: "play",
      };
    }
    {
      const s = (u - 0.84) / 0.16;
      return {
        x: fromX,
        lift: 2.8 * (1 - s),
        rot: facing * (5.5 * (1 - s)),
        anim: "sit",
      };
    }
  }

  function dufourlinePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.dufourline));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * -1.3, rot: s * -6 * facing, anim: "sit" };
    }
    if (u < 0.5) {
      const s = smoothstep((u - 0.14) / 0.36);
      return {
        x: fromX + facing * s * 1.15,
        lift: -0.9 + s * 3.5,
        rot: facing * (-6 + s * 13),
        anim: "talk",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.5) / 0.34;
      const line = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * (1.15 + line * 0.4),
        lift: 2.7 + Math.abs(line) * 1.25,
        rot: facing * (6.5 + line * 5.5),
        anim: "talk",
      };
    }
    {
      const s = (u - 0.84) / 0.16;
      return {
        x: fromX + facing * (1.0 * (1 - s * 0.35)),
        lift: 1.2 * (1 - s),
        rot: facing * (2.5 * (1 - s)),
        anim: "sit",
      };
    }
  }

  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "shaft" &&
      trick.kind !== "mass" &&
      trick.kind !== "vernal" &&
      trick.kind !== "fovea" &&
      trick.kind !== "floccus" &&
      trick.kind !== "dufourline"
    ) {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "andrena") {
      if (next.t < ANDRENA_HOLD) {
        const pose = andrenaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < ANDRENA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - ANDRENA_HOLD);
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "shaft") {
      const pose = shaftPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mass") {
      const pose = massPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "vernal") {
      const pose = vernalPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fovea") {
      const pose = foveaPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "floccus") {
      const pose = floccusPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = dufourlinePose(next.t, fromX, trick.facing);
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
    ANDRENA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    andrenaPose,
    releasePose,
    shaftPose,
    massPose,
    vernalPose,
    foveaPose,
    floccusPose,
    dufourlinePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    vicinaPose,
    carliniPose,
    andreniniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMiningBeeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
