/** Auger ground tricks while idle. House eastern carpenter bee — rasp / glabrous / partition / picket / xylocopa personality (rasp mandibular wood-tunnel rasp into a blotter beam — never named bore (window BORE) / gallery (Column) / chew / dig (Thimble) / gnaw (beaver) / fossor (Thrum) / nest (Clip + Column window) / bank (window DIG), glabrous shiny bald-abdomen flash — never named scopa (Thrum) / fur / fluff / sheen (Disk) / gloss / polish / preen (Echo) / pollen (Moth happy), partition solitary brood-cell wall pack — never named hive (Comb) / hex (Comb) / nest (Clip) / cell (mason ethogram) / gallery (Column) / crumb (Column) / bustle (Column), picket territorial station hover-guard — never named hover (Sepia + ethogram) / guard (Vesper) / sentinel (Arm) / lumber (Thrum) / forage (Thrum window) / thrum (Vesper) / drone (Hum window), xylocopa desk life as a Xylocopa virginica eastern carpenter with shiny cousins in the thank-yous; not Comb / Thrum / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play BORE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web carpenter_bee-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum or *Dragon electrical clone. Window-play BORE unchanged — never names bore. Ethogram hover/bore/still unchanged. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Column owns gallery/pheromone/crumb/bustle/camponotus and happy pennsylvanicus/honeydew/formicine; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Disk owns sheen; Clip owns nest; Thimble owns dig; Relay owns buzz; Rui owns dance. Xylocopa solitary wood desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "carpenter_bee";
  const TRICKS = ["rasp", "glabrous", "partition", "picket", "xylocopa"];
  const HAPPY = ["virginica", "micans", "xylocopini"];
  const HAPPY_DUR = { virginica: 1.26, micans: 1.32, xylocopini: 1.28 };
  const XYLOCOPA_HOLD = 13.6;
  const RELEASE_S = 0.7;
  const DUR = { xylocopa: XYLOCOPA_HOLD + RELEASE_S, rasp: 1.58, glabrous: 1.44, partition: 1.7, picket: 1.56 };

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
    if (kind === "xylocopa") return 50 + roll * 32;
    if (kind === "rasp") return 15 + roll * 11;
    if (kind === "partition") return 17 + roll * 12;
    return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "xylocopa";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "xylocopa") {
      if (roll < 0.26) return "rasp";
      if (roll < 0.5) return "glabrous";
      if (roll < 0.74) return "partition";
      return "picket";
    }
    if (lastKind === "rasp") {
      if (roll < 0.26) return "xylocopa";
      if (roll < 0.5) return "glabrous";
      if (roll < 0.74) return "partition";
      return "picket";
    }
    if (lastKind === "glabrous") {
      if (roll < 0.22) return "xylocopa";
      if (roll < 0.44) return "rasp";
      if (roll < 0.68) return "partition";
      return "picket";
    }
    if (roll < 0.2) return "xylocopa";
    if (roll < 0.4) return "rasp";
    if (roll < 0.6) return "glabrous";
    if (roll < 0.8) return "partition";
    return "picket";
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
    return key === TRICK_KEY || key === "auger";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "virginica";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "virginica" ? "talk" : name === "micans" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function virginicaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.virginica));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.05, rot: s * 2.8, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 14.5) + 0.28 * Math.sin(t * 29);
      return {
        lift: 0.05 + Math.abs(tick) * 0.02,
        rot: 2.8 + tick * 2.1,
        dx: tick * 0.0025,
        anim: "talk",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.022 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "idle" };
  }
  function micansPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.micans));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.075, rot: s * -4.2, dx: s * 0.003, anim: "play" };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 5.2) + 0.22 * Math.sin(t * 10.4);
      return {
        lift: 0.075 + Math.abs(flash) * 0.028,
        rot: -4.2 + flash * 5.0,
        dx: flash * 0.005,
        anim: "play",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.028 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "sit" };
  }
  function xylocopiniPose(t) {
    return {
      lift: 0.016 + Math.abs(Math.sin(t * 0.38)) * 0.014,
      rot: Math.sin(t * 0.48) * 1.25,
      dx: Math.sin(t * 0.28) * 0.0025,
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
    if (next.kind === "virginica") {
      const pose = virginicaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "micans") {
      const pose = micansPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = xylocopiniPose(next.t);
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
      kind === "xylocopa"
      ? "sit"
      : kind === "rasp"
        ? "play"
        : kind === "glabrous"
          ? "talk"
          : kind === "partition"
            ? "play"
            : kind === "picket"
              ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "xylocopa" ? "hold" : "go",
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

  function xylocopaPose(t) {
    const breath = Math.sin(t * 0.14) + 0.05 * Math.sin(t * 0.66);
    const grain = Math.abs(Math.sin(t * 0.3));
    return {
      lift: 0.018 + grain * 0.012,
      rot: 0.55 + breath * 0.65,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.55 * (1 - u) };
  }

  function raspPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rasp));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: -0.015 * s, rot: s * 1.6 * facing, anim: "play" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const circle = Math.sin(s * Math.PI * 5.5);
      const bite = Math.sin(s * Math.PI * 11);
      return {
        x: fromX + facing * (0.025 * s + circle * 0.012),
        lift: -0.015 - s * 0.045 + Math.abs(bite) * 0.012,
        rot: facing * (1.6 + circle * 2.8 + bite * 1.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.03 * (1 - s * 0.35),
      lift: -0.035 * (1 - s),
      rot: facing * (1.2 * (1 - s)),
      anim: "sit",
    };
  }
  function glabrousPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.glabrous));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.045, rot: s * 8.5 * facing, anim: "talk" };
    }
    if (u < 0.72) {
      const s = (u - 0.16) / 0.56;
      const gleam = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX + facing * gleam * 0.006,
        lift: 0.045 + Math.abs(gleam) * 0.02,
        rot: facing * (8.5 - s * 2.5 + gleam * 1.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.02 * (1 - s),
      rot: facing * (3.2 * (1 - s)),
      anim: "sit",
    };
  }
  function partitionPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.partition));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.03, rot: s * -3.6 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const press = smoothstep(s);
      return {
        x: fromX + facing * press * 0.035,
        lift: 0.03 - press * 0.05,
        rot: facing * (-3.6 + press * 5.2),
        anim: "play",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.55) / 0.29;
      const seal = Math.sin(s * Math.PI * 2.8);
      return {
        x: fromX + facing * (0.035 + seal * 0.01),
        lift: -0.02 + Math.abs(seal) * 0.025,
        rot: facing * (1.6 + seal * 2.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX + facing * 0.028 * (1 - s * 0.4),
      lift: -0.01 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function picketPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.picket));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.1, rot: s * -1.8 * facing, anim: "play" };
    }
    if (u < 0.86) {
      const s = (u - 0.12) / 0.74;
      const station = Math.sin(s * Math.PI * 1.3);
      const drift = Math.sin(s * Math.PI * 2.6) * 0.4;
      return {
        x: fromX + facing * station * 0.02,
        lift: 0.1 + Math.abs(drift) * 0.035,
        rot: facing * (-1.8 + station * 3.2 + drift * 1.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 0.04 * (1 - s),
      rot: facing * (-0.7 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "rasp" && trick.kind !== "glabrous" && trick.kind !== "partition" && trick.kind !== "picket") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "xylocopa") {
      if (next.t < XYLOCOPA_HOLD) {
        const pose = xylocopaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < XYLOCOPA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - XYLOCOPA_HOLD);
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
    if (next.kind === "rasp") {
      const pose = raspPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "glabrous") {
      const pose = glabrousPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "partition") {
      const pose = partitionPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = picketPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    XYLOCOPA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    xylocopaPose,
    releasePose,
    raspPose,
    glabrousPose,
    partitionPose,
    picketPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    virginicaPose,
    micansPose,
    xylocopiniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCarpenterBeeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
