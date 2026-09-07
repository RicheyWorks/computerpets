/** Fold ground tricks while idle. House Chinese mantis — raptorial / gimbal / snatch / pendulum / mantodea personality (raptorial foreleg prayer-wait hold on the blotter — never named fold (Vesper + ethogram) / pray (window PRAY) / wait (Pip) / still (ethogram) / freeze (Twig window) / poise (Snap) / guard (Vesper), gimbal head-swivel scan — never named swivel (Anchor) / nod (Sol) / peer (Keel) / glance (Sepia happy) / look / turn, snatch raptorial strike lunge — never named strike (ethogram) / snap (Fuse happy + Snap guest) / clamp (Snap) / seize (robber fly window) / pounce (Miso) / hunt (ethogram) / mouser (Rue) / stalk (Rue), pendulum wind-sway camouflage rock — never named sway (Jade) / rocking (Twig) / catalepsy (Twig) / lean / flutter (Fan) / bob / hover, mantodea desk life as a Tenodera sinensis Chinese Mantis week; not Seven / Column / Twig / Dart / Spark / Ghost / Milk / Comb / Snap / Jade / Sol / Vesper / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play PRAY do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web mantis-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven or *Dragon electrical clone. Window-play PRAY unchanged — never names pray/fold. Ethogram fold/strike/still unchanged. Vesper owns fold; Seven owns spots/aphid/reflex/climb/coccinella and happy septempunctata/bead/coccinellid; Column owns gallery/pheromone/crumb/bustle/camponotus; Twig owns rocking/catalepsy/browse/tread/diapheromera and happy femorata/instar/crypsis; Dart owns hawking/tandem/nymph/whir/anax; Jade owns sway; Anchor owns swivel; Pip owns wait; Snap owns clamp/poise; Felt owns bead. Mantodea Tenodera desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "mantis";
  const TRICKS = ["raptorial", "gimbal", "snatch", "pendulum", "mantodea"];
  const HAPPY = ["sinensis", "tenodera", "mantidae"];
  const HAPPY_DUR = { sinensis: 1.26, tenodera: 1.34, mantidae: 1.3 };
  const MANTODEA_HOLD = 13.8;
  const RELEASE_S = 0.74;
  const DUR = { mantodea: MANTODEA_HOLD + RELEASE_S, raptorial: 1.58, gimbal: 1.52, snatch: 1.44, pendulum: 1.66 };

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
    if (kind === "mantodea") return 52 + roll * 32;
    if (kind === "raptorial") return 16 + roll * 12;
    if (kind === "pendulum") return 15 + roll * 11;
    return justFinished ? 10.6 + roll * 8 : 5.5 + roll * 6.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "mantodea";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "mantodea") {
      if (roll < 0.26) return "raptorial";
      if (roll < 0.5) return "gimbal";
      if (roll < 0.74) return "snatch";
      return "pendulum";
    }
    if (lastKind === "raptorial") {
      if (roll < 0.26) return "mantodea";
      if (roll < 0.5) return "gimbal";
      if (roll < 0.74) return "snatch";
      return "pendulum";
    }
    if (lastKind === "gimbal") {
      if (roll < 0.22) return "mantodea";
      if (roll < 0.44) return "raptorial";
      if (roll < 0.68) return "snatch";
      return "pendulum";
    }
    if (roll < 0.2) return "mantodea";
    if (roll < 0.4) return "raptorial";
    if (roll < 0.6) return "gimbal";
    if (roll < 0.8) return "snatch";
    return "pendulum";
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
    return key === TRICK_KEY || key === "fold";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "sinensis";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "sinensis" ? "play" : name === "tenodera" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function sinensisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sinensis));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.05, rot: s * 3.2, dx: 0, anim: "play" };
    }
    if (u < 0.72) {
      const rock = Math.sin(t * 3.2) + 0.22 * Math.sin(t * 6.4);
      return {
        lift: 0.05 + Math.abs(rock) * 0.022,
        rot: 3.2 + rock * 2.4,
        dx: rock * 0.003,
        anim: "play",
      };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.024 * (1 - s), rot: 1.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function tenoderaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tenodera));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * 0.055, rot: s * -2.4, dx: s * 0.004, anim: "talk" };
    }
    if (u < 0.78) {
      const scan = Math.sin(t * 4.0) + 0.26 * Math.sin(t * 7.6);
      return {
        lift: 0.055 + Math.abs(scan) * 0.028,
        rot: -2.4 + scan * 4.6,
        dx: scan * 0.005,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.026 * (1 - s), rot: -0.9 * (1 - s), dx: 0, anim: "sit" };
  }
  function mantidaePose(t) {
    return {
      lift: 0.012 + Math.abs(Math.sin(t * 0.4)) * 0.016,
      rot: Math.sin(t * 0.52) * 1.2,
      dx: Math.sin(t * 0.28) * 0.002,
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
    if (next.kind === "sinensis") {
      const pose = sinensisPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "tenodera") {
      const pose = tenoderaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = mantidaePose(next.t);
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
      kind === "mantodea"
      ? "sit"
      : kind === "raptorial"
        ? "sit"
        : kind === "gimbal"
          ? "sit"
          : kind === "snatch"
            ? "play"
            : kind === "pendulum"
              ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "mantodea" ? "hold" : "go",
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

  function mantodeaPose(t) {
    const breath = Math.sin(t * 0.16) + 0.03 * Math.sin(t * 0.72);
    const grain = Math.abs(Math.sin(t * 0.34));
    return {
      lift: 0.018 + grain * 0.014,
      rot: 0.4 + breath * 0.7,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.02 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.4 * (1 - u) };
  }

  function raptorialPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.raptorial));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.06, rot: s * 5.4 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.16) / 0.62;
      const hold = Math.sin(s * Math.PI * 2.4) * 0.18;
      return {
        x: fromX + facing * hold * 0.003,
        lift: 0.06 + Math.abs(hold) * 0.012,
        rot: facing * (5.4 + hold * 1.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.02 * (1 - s),
      rot: facing * (1.6 * (1 - s)),
      anim: "sit",
    };
  }
  function gimbalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.gimbal));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.02, rot: s * -3.8 * facing, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.12) / 0.72;
      const scan = Math.sin(s * Math.PI * 3.6) + 0.35 * Math.sin(s * Math.PI * 7.2);
      return {
        x: fromX + facing * scan * 0.006,
        lift: 0.02 + Math.abs(scan) * 0.01,
        rot: facing * (-3.8 + scan * 7.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.01 * (1 - s),
      rot: facing * (-1.2 * (1 - s)),
      anim: "sit",
    };
  }
  function snatchPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.snatch));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX + facing * 0.01 * s, lift: s * 0.03, rot: s * 2.2 * facing, anim: "sit" };
    }
    if (u < 0.42) {
      const s = (u - 0.22) / 0.2;
      const lunge = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (0.01 + lunge * 0.09),
        lift: 0.03 - lunge * 0.05,
        rot: facing * (2.2 - lunge * 6.8),
        anim: "play",
      };
    }
    if (u < 0.72) {
      const s = (u - 0.42) / 0.3;
      const grip = Math.sin(s * Math.PI * 2.2) * 0.2;
      return {
        x: fromX + facing * (0.08 + grip * 0.01),
        lift: 0.01 + Math.abs(grip) * 0.02,
        rot: facing * (-3.2 + grip * 1.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.05 * (1 - s * 0.4),
      lift: 0.016 * (1 - s),
      rot: facing * (-1.0 * (1 - s)),
      anim: "sit",
    };
  }
  function pendulumPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pendulum));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 0.025, rot: s * 2.0 * facing, anim: "sit" };
    }
    if (u < 0.86) {
      const s = (u - 0.1) / 0.76;
      const breeze = Math.sin(s * Math.PI * 4.2) + 0.28 * Math.sin(s * Math.PI * 8.4);
      return {
        x: fromX + facing * breeze * 0.018,
        lift: 0.025 + Math.abs(breeze) * 0.022,
        rot: facing * (2.0 + breeze * 4.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 0.012 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "raptorial" && trick.kind !== "gimbal" && trick.kind !== "snatch" && trick.kind !== "pendulum") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "mantodea") {
      if (next.t < MANTODEA_HOLD) {
        const pose = mantodeaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MANTODEA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MANTODEA_HOLD);
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
    if (next.kind === "raptorial") {
      const pose = raptorialPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "gimbal") {
      const pose = gimbalPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "snatch") {
      const pose = snatchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pendulumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    MANTODEA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    mantodeaPose,
    releasePose,
    raptorialPose,
    gimbalPose,
    snatchPose,
    pendulumPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    sinensisPose,
    tenoderaPose,
    mantidaePose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMantisTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
