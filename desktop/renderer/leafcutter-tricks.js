/** Disc ground tricks while idle — ultra-polish pass. House alfalfa leafcutter bee — circle / liner / cavity / parcel / discpress / cellcup / megachile personality (circle mandibular leaf-disc cut on the blotter leaf — never named snip (window SNIP) / cut (retired ethogram) / pad (Disk) / corolla (Disk) / rhizome (Disk) / calyx (Disk) / sheen (Disk) / trowel (Mortar) / rasp (Auger) / dig (Thimble) / gnaw (beaver) / nest (Clip + Column window), liner nest-lining pack of leaf discs into a solitary cell — never named plug (Mortar) / partition (Auger) / seal (Cap) / daub (Mortar window) / hive (Comb) / hex (Comb) / nest (Clip) / crumb (Column) / beebread (Mortar) / mudseptum (Mortar), cavity solitary cavity nest settle — never named fossor (Thrum) / gallery (Column) / bank (mining window) / dig (Thimble) / chamber (Nautilus guest) / cell (retired mason talk) / nest (Clip), parcel under-body leaf-disc carry home — never named corbicula (Comb) / scopa (Thrum) / pollen (Moth happy) / forage (Thrum window) / figure (Comb) / lumber (Thrum) / cheek (Clip) / pocket (Clip), discpress iconic Megachile leaf-disc tamp into a solitary cell wall (not liner soft pack / plug Mortar / partition Auger / mudseptum Mortar / daub window), cellcup iconic Megachile thimble-cup leaf-cell assemble from overlapping discs (not cavity settle / gallery Column / chamber Nautilus / nest Clip / hive Comb / tubeprovision Mortar), megachile desk life as a Megachile rotundata alfalfa leafcutter with relativa cousins in the thank-yous; not Comb / Thrum / Auger / Mortar / Disk / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / Hum / Sheen / Cap / Pot / *Dragon copies). Discpress is the iconic leaf-disc tamp (not liner). Cellcup is the iconic cup-cell assemble (not cavity). Window-play SNIP unchanged — never names snip as a trick. Ethogram keeps megachile sit_hold; adds circle/liner/cavity/parcel/discpress/cellcup softs + freeze (replaces thin cut/hover/still — Cap owns seal flavor; Sepia owns hover; window SNIP owns snip). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via leafcutter.wav. Thank-yous rotundata / relativa / megachilini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `leafcutter-tricks.ts`. True house-leafcutter desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/honey_drone/Hum/carpenter_bee/Auger/mason_bee/Mortar/stingless/Pot/sweat_bee/Sheen or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids snip/cut/hover/still/pad/corolla/trowel/beebread/orchard/plug/mudseptum/tubeprovision/osmia/rasp/partition/gallery/fossor/hive/guard/thrum name collisions. Bird ultra + denser guests done; skip Rui + birds. Mortar now owns mudseptum/tubeprovision dens; Auger owns tunnelrasp/baldflash dens; Thrum owns thoraxload/corbicularub. MEGACHILE_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Pot / stingless. Catalog 221. No cry inventing beyond house leafcutter.wav prefer. Never retouch Rui sprites. No snip, not window SNIP. No cut, not retired ethogram. */
(function (root) {
  const TRICK_KEY = "leafcutter";
  const TRICKS = ["circle", "liner", "cavity", "parcel", "discpress", "cellcup", "megachile"];
  const HAPPY = ["rotundata", "relativa", "megachilini"];

  const HAPPY_DUR = {
    rotundata: 1.74,
    relativa: 1.86,
    megachilini: 1.78,
  };

  /** Megachile hold — Disc parks Megachile rotundata calm on the blotter. Not window-play SNIP. */
  const MEGACHILE_HOLD = 11.2;
  const RELEASE_S = 1.18;

  const DUR = {
    megachile: MEGACHILE_HOLD + RELEASE_S,
    circle: 2.46,
    liner: 2.48,
    cavity: 2.42,
    parcel: 2.44,
    discpress: 2.52,
    cellcup: 2.48,
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
    if (kind === "megachile") return 38 + roll * 24;
    if (kind === "discpress" || kind === "cellcup" || kind === "liner") return 12 + roll * 9;
    if (kind === "circle" || kind === "cavity" || kind === "parcel") return 11 + roll * 8;
    return justFinished ? 8 + roll * 8 : 4 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "megachile";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "megachile") {
      if (roll < 0.18) return "circle";
      if (roll < 0.34) return "liner";
      if (roll < 0.5) return "cavity";
      if (roll < 0.66) return "parcel";
      if (roll < 0.83) return "discpress";
      return "cellcup";
    }
    if (lastKind === "circle") {
      if (roll < 0.2) return "megachile";
      if (roll < 0.36) return "liner";
      if (roll < 0.52) return "cavity";
      if (roll < 0.68) return "parcel";
      if (roll < 0.84) return "discpress";
      return "cellcup";
    }
    if (lastKind === "liner") {
      if (roll < 0.18) return "megachile";
      if (roll < 0.34) return "circle";
      if (roll < 0.5) return "cavity";
      if (roll < 0.66) return "parcel";
      if (roll < 0.83) return "discpress";
      return "cellcup";
    }
    if (lastKind === "discpress") {
      if (roll < 0.2) return "megachile";
      if (roll < 0.36) return "circle";
      if (roll < 0.52) return "liner";
      if (roll < 0.68) return "cavity";
      if (roll < 0.84) return "parcel";
      return "cellcup";
    }
    if (roll < 0.16) return "megachile";
    if (roll < 0.3) return "circle";
    if (roll < 0.44) return "liner";
    if (roll < 0.58) return "cavity";
    if (roll < 0.72) return "parcel";
    if (roll < 0.86) return "discpress";
    return "cellcup";
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
    const list = pool.length ? pool : [...HAPPY];
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

  function relativaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.relativa));
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

  function megachiliniPose(t) {
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
    const anim = kind === "megachile"
        ? "sit"
        : kind === "circle"
          ? "play"
          : kind === "liner"
            ? "play"
            : kind === "cavity"
              ? "talk"
              : kind === "parcel"
                ? "talk"
                : kind === "discpress"
                  ? "play"
                  : kind === "cellcup"
                    ? "play"
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
    const breath = Math.sin(t * 0.13) + 0.05 * Math.sin(t * 0.48);
    const metal = Math.abs(Math.sin(t * 0.19));
    return {
      lift: 1.8 + metal * 0.85,
      rot: 2.4 + breath * 2.8,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 1.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 2.4 * (1 - u) };
  }

  function circlePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.circle));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.0, rot: s * -9 * facing, anim: "play" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const arc = Math.sin(s * Math.PI * 2);
      const bite = Math.sin(s * Math.PI * 6.5);
      return {
        x: fromX + facing * (Math.cos(s * Math.PI * 2) * 0.55),
        lift: 2.8 + Math.abs(arc) * 1.35 + Math.abs(bite) * 0.55,
        rot: facing * (-9 + s * 12 + bite * 4.5),
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

  function linerPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.liner));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.4, rot: s * -7 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.16) / 0.39;
      const pack = smoothstep(s);
      return {
        x: fromX + facing * pack * 1.1,
        lift: 2.4 - pack * 0.8,
        rot: facing * (-7 + pack * 12),
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const tamp = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * (1.0 + tamp * 0.3),
        lift: 1.6 + Math.abs(tamp) * 1.2,
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

  function cavityPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cavity));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 2.8, rot: s * 11 * facing, anim: "talk" };
    }
    if (u < 0.72) {
      const s = (u - 0.16) / 0.56;
      const bloom = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * bloom * 0.4,
        lift: 2.8 + Math.abs(bloom) * 1.25,
        rot: facing * (10 - s * 2 + bloom * 5),
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

  function parcelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.parcel));
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

  function discpressPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.discpress));
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

  function cellcupPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cellcup));
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
      const cup = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * (1.15 + cup * 0.4),
        lift: 2.7 + Math.abs(cup) * 1.25,
        rot: facing * (6.5 + cup * 5.5),
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
      trick.kind !== "circle" &&
      trick.kind !== "liner" &&
      trick.kind !== "cavity" &&
      trick.kind !== "parcel" &&
      trick.kind !== "discpress" &&
      trick.kind !== "cellcup"
    ) {
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
    const fromX = trick.fromX != null ? trick.fromX : trick.x;
    if (next.kind === "circle") {
      const pose = circlePose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "liner") {
      const pose = linerPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cavity") {
      const pose = cavityPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "parcel") {
      const pose = parcelPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "discpress") {
      const pose = discpressPose(next.t, fromX, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cellcupPose(next.t, fromX, trick.facing);
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
    discpressPose,
    cellcupPose,
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
