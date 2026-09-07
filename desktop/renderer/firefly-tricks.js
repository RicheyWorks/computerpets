/** Spark ground tricks while idle. House firefly — lantern / jstroke / semaphore / elytra / photinus personality (lantern belly-organ soft pulse on the blotter — never named flash (Quill+ethogram+window Flash) / glow (Dragon happy+window GLOW) / blaze (Ember) / lift (Ember+ethogram) / warning (Milk) / lunule (Ghost), jstroke Photinus J-path courtship flight — never named soar / hover (Sepia) / wing (Kite) / flutter (Fan) / stream (Ghost) / dart (Coin+ethogram still uses still), semaphore mate answer-code timing — never named flash / code / signal / buzz (Relay) / click (Relay) / spark (Relay happy), elytra soft dusk cover-wing settle — never named silk (Ghost) / plumose (Ghost) / fan / wing / nocturne (Arm), photinus desk life as a Photinus pyralis Lampyridae beetle week; not Ghost / Milk / Comb / Echo / Ember / Quill / Kite / Fan / Dew / Pulse / Relay copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web firefly-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost or *Dragon electrical clone. Window-play Flash/GLOW unchanged — never names flash or glow. Ethogram flash/lift/still unchanged. Ghost owns plumose/lunule/silk/stream/actias; Milk owns asclepias/oyamel/warning/chrysalis/danaus; Comb owns figure/corbicula/hex/proboscis/hive; Quill owns fan/flash; Kite owns wing; Fan owns flutter; Echo owns preen/bobble; Ember owns cinder/blaze/shed/lift/return; Sepia owns hover; Relay owns buzz/click and happy spark; Rui owns dance; Pulse guest owns moon-jelly; Dragon happy owns glow. Lampyridae Photinus desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "firefly";
  const TRICKS = ["lantern", "jstroke", "semaphore", "elytra", "photinus"];
  const HAPPY = ["luciferin", "candela", "pyralis"];
  const HAPPY_DUR = { luciferin: 1.2, candela: 1.36, pyralis: 1.24 };
  const PHOTINUS_HOLD = 12.4;
  const RELEASE_S = 0.76;
  const DUR = { photinus: PHOTINUS_HOLD + RELEASE_S, lantern: 1.32, jstroke: 1.58, semaphore: 1.44, elytra: 1.5 };

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
    if (kind === "photinus") return 48 + roll * 32;
    if (kind === "semaphore") return 16 + roll * 12;
    if (kind === "jstroke") return 14 + roll * 11;
    return justFinished ? 10.2 + roll * 8 : 5.2 + roll * 6.8;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "photinus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "photinus") {
      if (roll < 0.26) return "lantern";
      if (roll < 0.48) return "jstroke";
      if (roll < 0.72) return "semaphore";
      return "elytra";
    }
    if (lastKind === "lantern") {
      if (roll < 0.28) return "photinus";
      if (roll < 0.5) return "jstroke";
      if (roll < 0.72) return "semaphore";
      return "elytra";
    }
    if (lastKind === "jstroke") {
      if (roll < 0.22) return "photinus";
      if (roll < 0.44) return "lantern";
      if (roll < 0.66) return "semaphore";
      return "elytra";
    }
    if (roll < 0.2) return "photinus";
    if (roll < 0.4) return "lantern";
    if (roll < 0.6) return "jstroke";
    if (roll < 0.8) return "semaphore";
    return "elytra";
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
    return key === TRICK_KEY || key === "spark";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "luciferin";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "luciferin" ? "play" : name === "candela" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function luciferinPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.luciferin));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.11, rot: s * 2.6, dx: 0, anim: "play" };
    }
    if (u < 0.7) {
      const blink = Math.sin(t * 14.5) + 0.22 * Math.sin(t * 22.1);
      return {
        lift: 0.11 + Math.abs(blink) * 0.042,
        rot: 2.6 + blink * 2.8,
        dx: blink * 0.007,
        anim: "play",
      };
    }
    const s = (u - 0.7) / 0.3;
    return { lift: 0.06 * (1 - s), rot: 1.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function candelaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.candela));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * -0.02, rot: s * -1.4, dx: 0, anim: "sit" };
    }
    if (u < 0.82) {
      const warm = Math.sin(t * 0.68);
      return {
        lift: -0.02 + Math.abs(warm) * 0.026,
        rot: -1.4 + warm * 1.5,
        dx: warm * 0.005,
        anim: "sit",
      };
    }
    const s = (u - 0.82) / 0.18;
    return { lift: -0.012 * (1 - s), rot: -0.8 * (1 - s), dx: 0, anim: "sit" };
  }
  function pyralisPose(t) {
    return {
      lift: 0.028 + Math.abs(Math.sin(t * 0.92)) * 0.04,
      rot: Math.sin(t * 1.12) * 2.5,
      dx: Math.sin(t * 0.48) * 0.01,
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
    if (next.kind === "luciferin") {
      const pose = luciferinPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "candela") {
      const pose = candelaPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = pyralisPose(next.t);
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
      kind === "photinus"
      ? "sit"
      : kind === "lantern"
        ? "play"
        : kind === "jstroke"
          ? "sit"
          : kind === "semaphore"
            ? "talk"
            : kind === "elytra"
              ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "photinus" ? "hold" : "go",
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

  function photinusPose(t) {
    const breath = Math.sin(t * 0.18) + 0.03 * Math.sin(t * 1.1);
    const lamp = Math.abs(Math.sin(t * 0.55));
    return {
      lift: 0.022 + lamp * 0.014,
      rot: 0.28 + breath * 0.52,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.028 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.3 * (1 - u) };
  }

  function lanternPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lantern));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.12, rot: s * 3.4 * facing, anim: "play" };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const pulse = Math.sin(s * Math.PI * 4.2);
      return {
        x: fromX + facing * pulse * 0.006,
        lift: 0.12 + Math.abs(pulse) * 0.05,
        rot: facing * (3.4 + pulse * 4.8),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.12 * (1 - s),
      rot: facing * (1.8 * (1 - s)),
      anim: "sit",
    };
  }
  function jstrokePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.jstroke));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX + facing * 0.02 * s, lift: s * 0.04, rot: s * -2.2 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const arc = Math.sin(s * Math.PI * 0.5);
      return {
        x: fromX + facing * (0.02 + 0.04 * s),
        lift: 0.04 + arc * 0.1,
        rot: facing * (-2.2 + s * 5.5),
        anim: "sit",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const hook = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (0.06 - 0.05 * s) + facing * hook * 0.012,
        lift: 0.14 - s * 0.06 + Math.abs(hook) * 0.03,
        rot: facing * (3.3 + hook * 3.6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: 0.08 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit",
    };
  }
  function semaphorePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.semaphore));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 0.06, rot: s * 2.2 * facing, anim: "talk" };
    }
    if (u < 0.78) {
      const s = (u - 0.1) / 0.68;
      const code = Math.sin(s * Math.PI * 6.5) + 0.35 * Math.sin(s * Math.PI * 11);
      return {
        x: fromX + facing * code * 0.01,
        lift: 0.06 + Math.abs(code) * 0.045,
        rot: facing * (2.2 + code * 5.4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.06 * (1 - s),
      rot: facing * (1.2 * (1 - s)),
      anim: "sit",
    };
  }
  function elytraPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.elytra));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * -0.04, rot: s * 1.8 * facing, anim: "sit" };
    }
    if (u < 0.5) {
      const s = (u - 0.16) / 0.34;
      return {
        x: fromX + facing * 0.006 * s,
        lift: -0.04 + s * 0.02,
        rot: facing * (1.8 + s * 1.2),
        anim: "sit",
      };
    }
    if (u < 0.84) {
      const s = (u - 0.5) / 0.34;
      const soft = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * (0.006 + soft * 0.008),
        lift: -0.02 + soft * 0.055,
        rot: facing * (3.0 + soft * 3.2),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: -0.015 * (1 - s),
      rot: facing * (1.3 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "lantern" && trick.kind !== "jstroke" && trick.kind !== "semaphore" && trick.kind !== "elytra") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "photinus") {
      if (next.t < PHOTINUS_HOLD) {
        const pose = photinusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < PHOTINUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - PHOTINUS_HOLD);
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
    if (next.kind === "lantern") {
      const pose = lanternPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "jstroke") {
      const pose = jstrokePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "semaphore") {
      const pose = semaphorePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = elytraPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    PHOTINUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    photinusPose,
    releasePose,
    lanternPose,
    jstrokePose,
    semaphorePose,
    elytraPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    luciferinPose,
    candelaPose,
    pyralisPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFireflyTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
