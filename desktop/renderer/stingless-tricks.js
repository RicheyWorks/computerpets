/** Pot ground tricks while idle — ultra-polish pass. House Maya stingless bee — cerumen / spout / vessel / batumen / potpress / involucrum / melipona personality (cerumen mandibular wax-resin pot mold on the blotter — never named tend (window TEND) / pot (retired ethogram) / hive (Comb) / hex (Comb) / plug (Mortar) / trowel (Mortar) / daub (mason window) / seal (Cap) / partition (Auger) / circle (Disc) / liner (Disc) / rasp (Auger) / dig (Thimble) / nest (Clip + Column window) / urn (Drown) / cistern (Drown), spout cerumen entrance-tube raise — never named tube (Wick) / funnel / tend (window) / gallery (Column) / picket (Auger) / fossor (Thrum) / bank (mining window) / nest (Clip) / chamber (Nautilus guest), vessel honey-pollen pot store fill — never named beebread (Mortar) / corbicula (Comb) / scopa (Thrum) / pollen (Moth happy) / forage (Thrum window) / crumb (Column) / store (Arm window) / fill (Drown window) / parcel (Disc) / hive (Comb), batumen resin nest-enclosure pack — never named plug (Mortar) / partition (Auger) / seal (Cap) / daub (window) / propolis (Comb happy) / bustle (Column) / cavity (Disc) / nest (Clip), potpress iconic Melipona cerumen honey-pot lid tamp (not vessel soft fill / batumen enclosure / plug Mortar / discpress Disc / mudseptum Mortar / daub window), involucrum iconic Melipona soft cerumen involucrum sheet wrap around brood (not batumen hard enclosure / liner Disc / cavity Disc / hive Comb / cellcup Disc / gallery Column), melipona desk life as a Melipona beecheii Maya stingless with yucatanica cousins in the thank-yous; not Comb / Thrum / Auger / Mortar / Disc / Disk / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / Hum / Sheen / Cap / Bank / Keep / *Dragon copies). Potpress is the iconic honey-pot tamp (not vessel). Involucrum is the iconic brood-sheet wrap (not batumen). Window-play TEND unchanged — never names tend as a trick. Ethogram keeps melipona sit_hold; adds cerumen/spout/vessel/batumen/potpress/involucrum softs + freeze (replaces thin pot/hover/still — Cap owns seal flavor; Sepia owns hover; window TEND owns tend). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via stingless.wav. Thank-yous beecheii / yucatanica / meliponini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `stingless-tricks.ts`. True house-stingless desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/honey_drone/Hum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/sweat_bee/Sheen/mining_bee/Bank/honey_queen/Keep or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids tend/pot/hover/still/pad/corolla/trowel/beebread/orchard/plug/mudseptum/tubeprovision/osmia/rasp/partition/gallery/fossor/hive/guard/thrum/circle/liner/cavity/parcel/discpress/cellcup/megachile name collisions. Bird ultra + denser guests done; skip Rui + birds. Disc now owns discpress/cellcup dens; Mortar owns mudseptum/tubeprovision dens; Auger owns tunnelrasp/baldflash dens; Thrum owns thoraxload/corbicularub. MELIPONA_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Bank / mining_bee. Catalog 221. No cry inventing beyond house stingless.wav prefer. Never retouch Rui sprites. No tend, not window TEND. No pot, not retired ethogram. */
(function (root) {
  const TRICK_KEY = "stingless";
  const TRICKS = ["cerumen", "spout", "vessel", "batumen", "potpress", "involucrum", "melipona"];
  const HAPPY = ["beecheii", "yucatanica", "meliponini"];

  const HAPPY_DUR = {
    beecheii: 1.74,
    yucatanica: 1.86,
    meliponini: 1.78,
  };

  /** Melipona hold — Pot parks Melipona beecheii calm on the blotter. Not window-play TEND. */
  const MELIPONA_HOLD = 11.2;
  const RELEASE_S = 1.18;

  const DUR = {
    melipona: MELIPONA_HOLD + RELEASE_S,
    cerumen: 2.46,
    spout: 2.48,
    vessel: 2.42,
    batumen: 2.44,
    potpress: 2.52,
    involucrum: 2.48,
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
    if (kind === "melipona") return 38 + roll * 24;
    if (kind === "potpress" || kind === "involucrum" || kind === "spout") return 12 + roll * 9;
    if (kind === "cerumen" || kind === "vessel" || kind === "batumen") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "melipona";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "melipona") {
      if (roll < 0.18) return "cerumen";
      if (roll < 0.34) return "spout";
      if (roll < 0.5) return "vessel";
      if (roll < 0.66) return "batumen";
      if (roll < 0.83) return "potpress";
      return "involucrum";
    }
    if (lastKind === "cerumen") {
      if (roll < 0.2) return "melipona";
      if (roll < 0.36) return "spout";
      if (roll < 0.52) return "vessel";
      if (roll < 0.68) return "batumen";
      if (roll < 0.84) return "potpress";
      return "involucrum";
    }
    if (lastKind === "spout") {
      if (roll < 0.18) return "melipona";
      if (roll < 0.34) return "cerumen";
      if (roll < 0.5) return "vessel";
      if (roll < 0.66) return "batumen";
      if (roll < 0.83) return "potpress";
      return "involucrum";
    }
    if (lastKind === "potpress") {
      if (roll < 0.2) return "melipona";
      if (roll < 0.36) return "cerumen";
      if (roll < 0.52) return "spout";
      if (roll < 0.68) return "vessel";
      if (roll < 0.84) return "batumen";
      return "involucrum";
    }
    if (roll < 0.16) return "melipona";
    if (roll < 0.3) return "cerumen";
    if (roll < 0.44) return "spout";
    if (roll < 0.58) return "vessel";
    if (roll < 0.72) return "batumen";
    if (roll < 0.86) return "potpress";
    return "involucrum";
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
    const list = pool.length ? pool : [...HAPPY];
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

  function yucatanicaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.yucatanica));
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

  function meliponiniPose(t) {
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
    const anim = kind === "melipona"
        ? "sit"
        : kind === "cerumen"
          ? "play"
          : kind === "spout"
            ? "play"
            : kind === "vessel"
              ? "talk"
              : kind === "batumen"
                ? "talk"
                : kind === "potpress"
                  ? "play"
                  : kind === "involucrum"
                    ? "play"
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
    const breath = Math.sin(t * 0.13) + 0.05 * Math.sin(t * 0.48);
    const wax = Math.abs(Math.sin(t * 0.19));
    return {
      lift: 1.8 + wax * 0.85,
      rot: 2.4 + breath * 2.8,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 1.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 2.4 * (1 - u) };
  }

  function cerumenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cerumen));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.0, rot: s * -9 * facing, anim: "play" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const oval = Math.sin(s * Math.PI * 1.6);
      const knead = Math.sin(s * Math.PI * 5.2);
      return {
        x: fromX + facing * (Math.cos(s * Math.PI * 1.6) * 0.55),
        lift: 2.8 + Math.abs(oval) * 1.35 + Math.abs(knead) * 0.55,
        rot: facing * (-9 + s * 12 + knead * 4.5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.35 * (1 - s),
      lift: 1.3 * (1 - s),
      rot: facing * (3.5 * (1 - s)),
      anim: "sit",
    };
  }

  function spoutPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.spout));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.4, rot: s * -7 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const pack = smoothstep(s);
      return {
        x: fromX + facing * pack * 1.1,
        lift: 2.4 + pack * 1.6,
        rot: facing * (-7 + pack * 12),
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const tamp = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * (1.0 + tamp * 0.3),
        lift: 3.2 + Math.abs(tamp) * 1.0,
        rot: facing * (4 + tamp * 5),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 0.7 * (1 - s * 0.4),
      lift: 0.9 * (1 - s),
      rot: facing * (2 * (1 - s)),
      anim: "sit",
    };
  }

  function vesselPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.vessel));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.8, rot: s * 11 * facing, anim: "talk" };
    }
    if (u < 0.72) {
      const s = (u - 0.16) / 0.56;
      const fill = Math.sin(s * Math.PI * 1.8);
      const soft = Math.sin(s * Math.PI * 3.6) * 0.3;
      return {
        x: fromX + facing * fill * 0.4,
        lift: 2.8 + Math.abs(fill) * 1.25 + Math.abs(soft) * 0.6,
        rot: facing * (10 - s * 2 + fill * 5 + soft * 3),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 1.2 * (1 - s),
      rot: facing * (4 * (1 - s)),
      anim: "sit",
    };
  }

  function batumenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.batumen));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.2, rot: s * -6 * facing, anim: "talk" };
    }
    if (u < 0.86) {
      const s = (u - 0.12) / 0.74;
      const haul = Math.sin(s * Math.PI * 1.3);
      const bob = Math.sin(s * Math.PI * 2.6) * 0.4;
      return {
        x: fromX + facing * (0.55 * s + haul * 0.35),
        lift: 3.0 + Math.abs(bob) * 1.2,
        rot: facing * (-5 + haul * 8 + bob * 3),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX + facing * 0.5 * (1 - s * 0.35),
      lift: 1.3 * (1 - s),
      rot: facing * (-2 * (1 - s)),
      anim: "sit",
    };
  }

  function potpressPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.potpress));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 3.1, rot: s * 10 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const pack = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * pack * 0.55,
        lift: 3.0 + Math.abs(pack) * 1.5,
        rot: facing * (10 + pack * 8),
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const tamp = Math.sin(s * Math.PI * 3.6);
      return {
        x: fromX + facing * (0.5 + tamp * 0.3),
        lift: 3.5 + Math.abs(tamp) * 0.95,
        rot: facing * (13 - s * 2 + tamp * 4),
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

  function involucrumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.involucrum));
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
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.5) / 0.34;
      const wrap = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * (1.15 + wrap * 0.4),
        lift: 2.7 + Math.abs(wrap) * 1.25,
        rot: facing * (6.5 + wrap * 5.5),
        anim: "play",
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
      trick.kind !== "cerumen" &&
      trick.kind !== "spout" &&
      trick.kind !== "vessel" &&
      trick.kind !== "batumen" &&
      trick.kind !== "potpress" &&
      trick.kind !== "involucrum"
    ) {
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "cerumen") {
      const pose = cerumenPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "spout") {
      const pose = spoutPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "vessel") {
      const pose = vesselPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "batumen") {
      const pose = batumenPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "potpress") {
      const pose = potpressPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = involucrumPose(next.t, fromX, trick.facing);
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
    potpressPose,
    involucrumPose,
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
