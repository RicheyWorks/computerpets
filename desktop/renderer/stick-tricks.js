/** Twig ground tricks while idle. House stick insect — rocking / catalepsy / browse / tread / diapheromera personality (rocking camouflage breeze-sway on the blotter — never named sway (Jade) / lean / nod (Sol) / flutter (Fan+ginkgo) / still (ethogram) / freeze (ethogram+window FREEZE) / bob / hover, catalepsy tonic-immobility freeze pose as furniture — never named freeze / still / tuck / curl / coil / nest (Clip) / feign (Bluff), browse leaf-nibble mandible work — never named nibble (Whee happy) / hay / berry / crack / digest / mucilage (Dew) / munch, tread slow Phasmatodea step — never named walk (ethogram) / amble (Bloom) / inch (Nori) / crawl (Cling) / scurry (Clip) / plod, diapheromera desk life as a Diapheromera femorata Common Walkingstick week; not Dart / Spark / Ghost / Milk / Comb / Felt / Mast / Jade / Sol / Clip / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play FREEZE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web stick-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart or *Dragon electrical clone. Window-play FREEZE unchanged — never names freeze. Ethogram freeze/still/walk unchanged. Dart owns hawking/tandem/nymph/whir/anax and happy junius/labium/exuvia; Spark owns lantern/jstroke/semaphore/elytra/photinus; Ghost owns plumose/lunule/silk/stream/actias; Milk owns asclepias/oyamel/warning/chrysalis/danaus; Comb owns figure/corbicula/hex/proboscis/hive; Jade owns sway; Sol owns nod; Fan owns flutter; Felt owns tuft/bead/spore/cushion/thatch; Mast owns acorn/sinus/gall/taproot/bole; Rui owns dance; Pulse guest owns moon-jelly; Dragon happy owns glow. Phasmatodea Diapheromera desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "stick";
  const TRICKS = ["rocking", "catalepsy", "browse", "tread", "diapheromera"];
  const HAPPY = ["femorata", "instar", "crypsis"];
  const HAPPY_DUR = { femorata: 1.24, instar: 1.32, crypsis: 1.28 };
  const DIAPHEROMERA_HOLD = 14.2;
  const RELEASE_S = 0.78;
  const DUR = { diapheromera: DIAPHEROMERA_HOLD + RELEASE_S, rocking: 1.56, catalepsy: 1.68, browse: 1.52, tread: 1.64 };

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
    if (kind === "diapheromera") return 52 + roll * 34;
    if (kind === "catalepsy") return 16 + roll * 12;
    if (kind === "rocking") return 14 + roll * 11;
    return justFinished ? 10.8 + roll * 8.2 : 5.6 + roll * 7;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "diapheromera";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "diapheromera") {
      if (roll < 0.26) return "rocking";
      if (roll < 0.5) return "catalepsy";
      if (roll < 0.74) return "browse";
      return "tread";
    }
    if (lastKind === "rocking") {
      if (roll < 0.26) return "diapheromera";
      if (roll < 0.5) return "catalepsy";
      if (roll < 0.74) return "browse";
      return "tread";
    }
    if (lastKind === "catalepsy") {
      if (roll < 0.22) return "diapheromera";
      if (roll < 0.44) return "rocking";
      if (roll < 0.68) return "browse";
      return "tread";
    }
    if (roll < 0.2) return "diapheromera";
    if (roll < 0.4) return "rocking";
    if (roll < 0.6) return "catalepsy";
    if (roll < 0.8) return "browse";
    return "tread";
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
    return key === TRICK_KEY || key === "twig";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "femorata";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "femorata" ? "play" : name === "instar" ? "talk" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function femorataPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.femorata));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.04, rot: s * 2.4, dx: 0, anim: "play" };
    }
    if (u < 0.72) {
      const rock = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
      return {
        lift: 0.04 + Math.abs(rock) * 0.018,
        rot: 2.4 + rock * 2.6,
        dx: rock * 0.004,
        anim: "play",
      };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.02 * (1 - s), rot: 1.0 * (1 - s), dx: 0, anim: "idle" };
  }
  function instarPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.instar));
    if (u < 0.2) {
      const s = u / 0.2;
      return { lift: s * 0.055, rot: s * -1.8, dx: s * 0.006, anim: "talk" };
    }
    if (u < 0.78) {
      const shed = Math.sin(t * 4.2) + 0.3 * Math.sin(t * 9.1);
      return {
        lift: 0.055 + Math.abs(shed) * 0.035,
        rot: -1.8 + shed * 3.4,
        dx: shed * 0.007,
        anim: "talk",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.03 * (1 - s), rot: -0.7 * (1 - s), dx: 0, anim: "sit" };
  }
  function crypsisPose(t) {
    return {
      lift: 0.008 + Math.abs(Math.sin(t * 0.42)) * 0.012,
      rot: Math.sin(t * 0.55) * 0.9,
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
    if (next.kind === "femorata") {
      const pose = femorataPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "instar") {
      const pose = instarPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = crypsisPose(next.t);
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
      kind === "diapheromera"
      ? "sit"
      : kind === "rocking"
        ? "sit"
        : kind === "catalepsy"
          ? "sit"
          : kind === "browse"
            ? "sit"
            : kind === "tread"
              ? "walk"
                : "sit";
    return {
      kind: kind,
      phase: kind === "diapheromera" ? "hold" : "go",
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

  function diapheromeraPose(t) {
    const breath = Math.sin(t * 0.16) + 0.03 * Math.sin(t * 0.72);
    const twig = Math.abs(Math.sin(t * 0.28));
    return {
      lift: 0.012 + twig * 0.008,
      rot: 0.18 + breath * 0.42,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.016 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.22 * (1 - u) };
  }

  function rockingPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.rocking));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.02, rot: s * 3.6 * facing, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.12) / 0.72;
      const breeze = Math.sin(s * Math.PI * 3.2) + 0.35 * Math.sin(s * Math.PI * 5.6);
      return {
        x: fromX + facing * breeze * 0.006,
        lift: 0.02 + Math.abs(breeze) * 0.014,
        rot: facing * (3.6 + breeze * 4.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.02 * (1 - s),
      rot: facing * (1.6 * (1 - s)),
      anim: "sit",
    };
  }
  function catalepsyPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.catalepsy));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * -0.008, rot: s * 1.8 * facing, anim: "sit" };
    }
    if (u < 0.82) {
      const hold = Math.sin(t * 0.18) * 0.35;
      return {
        x: fromX,
        lift: -0.008 + Math.abs(hold) * 0.006,
        rot: facing * (1.8 + hold * 0.55),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: -0.006 * (1 - s),
      rot: facing * (0.9 * (1 - s)),
      anim: "sit",
    };
  }
  function browsePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.browse));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX + facing * 0.01 * s, lift: s * -0.02, rot: s * -2.2 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const chew = Math.sin(s * Math.PI * 6.4) + 0.25 * Math.sin(s * Math.PI * 11);
      return {
        x: fromX + facing * (0.01 + 0.012 * s) + facing * chew * 0.004,
        lift: -0.02 + Math.abs(chew) * 0.022,
        rot: facing * (-2.2 + chew * 2.8),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX + facing * 0.008 * (1 - s),
      lift: -0.012 * (1 - s),
      rot: facing * (-1.0 * (1 - s)),
      anim: "sit",
    };
  }
  function treadPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tread));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.03, rot: s * 1.4 * facing, anim: "walk" };
    }
    if (u < 0.78) {
      const s = (u - 0.12) / 0.66;
      const step = Math.sin(s * Math.PI * 2.2);
      const pause = Math.max(0, Math.sin(s * Math.PI * 1.1));
      return {
        x: fromX + facing * (0.055 * s + step * 0.012),
        lift: 0.03 + Math.abs(step) * 0.028 * pause,
        rot: facing * (1.4 + step * 2.6),
        anim: "walk",
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
    if (shouldAbort(flags) && trick.kind !== "rocking" && trick.kind !== "catalepsy" && trick.kind !== "browse" && trick.kind !== "tread") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "diapheromera") {
      if (next.t < DIAPHEROMERA_HOLD) {
        const pose = diapheromeraPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DIAPHEROMERA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DIAPHEROMERA_HOLD);
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
    if (next.kind === "rocking") {
      const pose = rockingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "catalepsy") {
      const pose = catalepsyPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "browse") {
      const pose = browsePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = treadPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DIAPHEROMERA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    diapheromeraPose,
    releasePose,
    rockingPose,
    catalepsyPose,
    browsePose,
    treadPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    femorataPose,
    instarPose,
    crypsisPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetStickTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
