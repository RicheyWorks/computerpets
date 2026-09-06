/** Comb ground tricks while idle. House honeybee — figure / corbicula / hex / proboscis / hive personality (figure-eight recruit dance on the blotter — never named waggle (Comb window WAGGLE) / dance (Rui owns dance) / buzz (Relay owns buzz) / bobble (Echo owns bobble) / preen / mimic / sidle / dangle (Echo) / fan / flash (Quill) / wing (Kite) / flutter (Fan), corbicula pollen-basket pack — never named pollen (Moth happy) / nest / cheek / pocket / scurry (Clip), hex wax-cell build — never named wax / draw (honeycomb window) / comb as guest-name-only, proboscis hover-sip — never named hover (Sepia) / sip (hummingbird window) / nectar (Disk) / drink / taste / probe / lap / gulp (Coin), hive desk life as an Apis wax-heart worker; not Moth / Dew / Drown / Snap / Echo / Quill / Sepia / Disk copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web honeybee-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew or *Dragon electrical clone. Window-play WAGGLE unchanged — never names waggle. Ethogram waggle/dart/still unchanged. Moth owns pollen; Disk owns nectar/dew; Dew owns glitter/ruby/syrup; Sepia owns hover; Relay owns buzz; Rui owns dance; Clip owns nest; Coin owns dart/flare; Quill owns fan/flash; Echo owns preen/bobble; Kite owns wing. Apis wax-heart desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "honeybee";
  const TRICKS = ["figure", "corbicula", "hex", "proboscis", "hive"];
  const HAPPY = ["honey", "mead", "propolis"];
  const HAPPY_DUR = { honey: 1.24, mead: 1.3, propolis: 1.36 };
  const HIVE_HOLD = 12.6;
  const RELEASE_S = 0.74;
  const DUR = { hive: HIVE_HOLD + RELEASE_S, figure: 1.28, corbicula: 1.42, hex: 1.56, proboscis: 1.48 };

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
    if (kind === "hive") return 52 + roll * 30;
    if (kind === "hex") return 18 + roll * 12;
    if (kind === "corbicula") return 15 + roll * 10;
    return justFinished ? 11 + roll * 8 : 5.6 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "hive";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "hive") {
      if (roll < 0.26) return "figure";
      if (roll < 0.48) return "hex";
      if (roll < 0.72) return "corbicula";
      return "proboscis";
    }
    if (lastKind === "figure") {
      if (roll < 0.28) return "hive";
      if (roll < 0.5) return "hex";
      if (roll < 0.72) return "corbicula";
      return "proboscis";
    }
    if (lastKind === "hex") {
      if (roll < 0.22) return "hive";
      if (roll < 0.44) return "figure";
      if (roll < 0.66) return "corbicula";
      return "proboscis";
    }
    if (roll < 0.2) return "hive";
    if (roll < 0.4) return "figure";
    if (roll < 0.6) return "hex";
    if (roll < 0.8) return "corbicula";
    return "proboscis";
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
    return key === TRICK_KEY || key === "comb";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "honey";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "honey" ? "play" : name === "mead" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function honeyPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.honey));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.1, rot: s * 2.8, dx: 0, anim: "play" };
    }
    if (u < 0.7) {
      const spark = Math.sin(t * 11.4) + 0.32 * Math.sin(t * 17.6);
      return {
        lift: 0.1 + Math.abs(spark) * 0.042,
        rot: 2.8 + spark * 3.6,
        dx: spark * 0.01,
        anim: "play",
      };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: 0.065 * (1 - s), rot: 1.3 * (1 - s), dx: 0, anim: "idle" };
  }
  function meadPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mead));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * -0.028, rot: s * -1.4, dx: 0, anim: "sit" };
    }
    if (u < 0.78) {
      const warm = Math.sin(t * 0.88);
      return {
        lift: -0.028 + Math.abs(warm) * 0.024,
        rot: -1.4 + warm * 1.5,
        dx: warm * 0.007,
        anim: "sit",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: -0.016 * (1 - s), rot: -0.85 * (1 - s), dx: 0, anim: "sit" };
  }
  function propolisPose(t) {
    return {
      lift: 0.028 + Math.abs(Math.sin(t * 0.78)) * 0.048,
      rot: Math.sin(t * 0.92) * 2.5,
      dx: Math.sin(t * 0.48) * 0.012,
      anim: "talk",
    };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return Object.assign({}, happy, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, happy, { t: happy.t + Math.max(0, dt) });
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "honey") {
      const pose = honeyPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "mead") {
      const pose = meadPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = propolisPose(next.t);
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
      kind === "hive"
        ? "sit"
        : kind === "figure"
          ? "play"
          : kind === "corbicula"
            ? "talk"
            : kind === "hex"
              ? "sit"
              : kind === "proboscis"
                ? "talk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "hive" ? "hold" : "go",
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

  function hivePose(t) {
    const breath = Math.sin(t * 0.18) + 0.02 * Math.sin(t * 0.95);
    return {
      lift: 0.022 + Math.abs(Math.sin(t * 0.28)) * 0.012,
      rot: 0.4 + breath * 0.55,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.022 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.4 * (1 - u) };
  }

  function figurePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.figure));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.08, rot: s * 3.2 * facing, anim: "play" };
    }
    if (u < 0.82) {
      const s = (u - 0.12) / 0.7;
      const eight = Math.sin(s * Math.PI * 2);
      const cross = Math.sin(s * Math.PI * 4);
      return {
        x: fromX + facing * eight * 0.028,
        lift: 0.08 + Math.abs(cross) * 0.05,
        rot: facing * (3.2 + eight * 5.5 + cross * 2.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: 0.08 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit",
    };
  }
  function corbiculaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.corbicula));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.035, rot: s * -2.8 * facing, anim: "talk" };
    }
    if (u < 0.74) {
      const s = (u - 0.16) / 0.58;
      const pack = Math.sin(s * Math.PI * 2.4);
      return {
        x: fromX - facing * 0.012 * s + facing * pack * 0.006,
        lift: 0.035 + Math.abs(pack) * 0.04,
        rot: facing * (-2.8 + s * 4.2 + pack * 2.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.74) / 0.26);
    return {
      x: fromX - facing * 0.012 * (1 - s),
      lift: 0.035 * (1 - s),
      rot: facing * (-1.2 * (1 - s)),
      anim: "sit",
    };
  }
  function hexPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.hex));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * -0.04, rot: s * 2.2 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.18) / 0.6;
      const cell = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * 0.01 * s + facing * cell * 0.004,
        lift: -0.04 + Math.abs(cell) * 0.018,
        rot: facing * (2.2 + s * 3.4 + cell * 1.6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: -0.04 * (1 - s),
      rot: facing * (3.0 * (1 - s)),
      anim: "sit",
    };
  }
  function proboscisPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.proboscis));
    if (u < 0.15) {
      const s = smoothstep(u / 0.15);
      return { x: fromX, lift: s * 0.06, rot: s * -2.4 * facing, anim: "talk" };
    }
    if (u < 0.45) {
      const s = smoothstep((u - 0.15) / 0.3);
      return {
        x: fromX + facing * s * 0.018,
        lift: 0.06 + s * 0.08,
        rot: facing * (-2.4 + s * 7.5),
        anim: "talk",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.45) / 0.33;
      const sip = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * (0.018 + sip * 0.004),
        lift: 0.14 + Math.abs(sip) * 0.02,
        rot: facing * (5.1 + sip * 1.8),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.14 * (1 - s),
      rot: facing * (2.6 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "figure" && trick.kind !== "corbicula" && trick.kind !== "hex" && trick.kind !== "proboscis") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "hive") {
      if (next.t < HIVE_HOLD) {
        const pose = hivePose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < HIVE_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - HIVE_HOLD);
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
    if (next.kind === "figure") {
      const pose = figurePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "corbicula") {
      const pose = corbiculaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "hex") {
      const pose = hexPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = proboscisPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    HIVE_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    hivePose,
    releasePose,
    figurePose,
    corbiculaPose,
    hexPose,
    proboscisPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    honeyPose,
    meadPose,
    propolisPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHoneybeeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
