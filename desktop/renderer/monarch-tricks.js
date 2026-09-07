/** Milk ground tricks while idle. House monarch — asclepias / oyamel / warning / chrysalis / danaus personality (asclepias milkweed-host cling on the blotter — never named weed (Milk window WEED) / milkweed-as-window / host / plant / nest (Clip) / scurry, oyamel migration-rest cluster — never named migrate (ethogram) / roost (Keel) / huddle (Peck) / rest-cmd / voyage / south, warning aposematic wing-open — never named flash (Quill) / wing (Kite) / flutter (Fan ethogram+ginkgo) / fan / blaze (Ember) / glow, chrysalis memory of the jade case — never named jade (guest) / coil / tuck / curl / unroll (Nori) / return (Ember), danaus desk life as a Danaus orange-warning migrant; not Comb / Echo / Ember / Quill / Kite / Fan / Dew / Moth / Coral milk_snake copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web monarch-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb or *Dragon electrical clone. Window-play WEED unchanged — never names weed. Ethogram flutter/migrate/still unchanged. Comb owns figure/corbicula/hex/proboscis/hive; Quill owns fan/flash; Kite owns wing; Fan owns flutter; Echo owns preen/bobble; Ember owns cinder/blaze/shed/lift/return; Coral owns rhyme/rumor/costume/frank/tile; Relay owns buzz; Rui owns dance. Danaus orange-warning desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "monarch";
  const TRICKS = ["asclepias", "oyamel", "warning", "chrysalis", "danaus"];
  const HAPPY = ["cardenolide", "orange", "tag"];
  const HAPPY_DUR = { cardenolide: 1.26, orange: 1.32, tag: 1.2 };
  const DANAUS_HOLD = 13.1;
  const RELEASE_S = 0.76;
  const DUR = { danaus: DANAUS_HOLD + RELEASE_S, asclepias: 1.36, oyamel: 1.52, warning: 1.22, chrysalis: 1.58 };

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
    if (kind === "danaus") return 54 + roll * 28;
    if (kind === "oyamel") return 19 + roll * 11;
    if (kind === "chrysalis") return 16 + roll * 10;
    return justFinished ? 11 + roll * 8 : 5.8 + roll * 6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "danaus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "danaus") {
      if (roll < 0.26) return "asclepias";
      if (roll < 0.48) return "oyamel";
      if (roll < 0.72) return "warning";
      return "chrysalis";
    }
    if (lastKind === "asclepias") {
      if (roll < 0.28) return "danaus";
      if (roll < 0.5) return "oyamel";
      if (roll < 0.72) return "warning";
      return "chrysalis";
    }
    if (lastKind === "oyamel") {
      if (roll < 0.22) return "danaus";
      if (roll < 0.44) return "asclepias";
      if (roll < 0.66) return "warning";
      return "chrysalis";
    }
    if (roll < 0.2) return "danaus";
    if (roll < 0.4) return "asclepias";
    if (roll < 0.6) return "oyamel";
    if (roll < 0.8) return "warning";
    return "chrysalis";
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
    return key === TRICK_KEY || key === "milk";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "cardenolide";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "cardenolide" ? "play" : name === "orange" ? "sit" : "talk",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function cardenolidePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cardenolide));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.09, rot: s * 3.1, dx: 0, anim: "play" };
    }
    if (u < 0.72) {
      const spark = Math.sin(t * 9.8) + 0.28 * Math.sin(t * 15.2);
      return {
        lift: 0.09 + Math.abs(spark) * 0.038,
        rot: 3.1 + spark * 3.2,
        dx: spark * 0.009,
        anim: "play",
      };
    }
    const s = (u - 0.72) / 0.28;
    return { lift: 0.055 * (1 - s), rot: 1.4 * (1 - s), dx: 0, anim: "idle" };
  }
  function orangePose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.orange));
    if (u < 0.18) {
      const s = u / 0.18;
      return { lift: s * -0.024, rot: s * -1.6, dx: 0, anim: "sit" };
    }
    if (u < 0.8) {
      const warm = Math.sin(t * 0.74);
      return {
        lift: -0.024 + Math.abs(warm) * 0.022,
        rot: -1.6 + warm * 1.7,
        dx: warm * 0.006,
        anim: "sit",
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: -0.014 * (1 - s), rot: -0.9 * (1 - s), dx: 0, anim: "sit" };
  }
  function tagPose(t) {
    return {
      lift: 0.03 + Math.abs(Math.sin(t * 0.86)) * 0.044,
      rot: Math.sin(t * 1.05) * 2.8,
      dx: Math.sin(t * 0.52) * 0.011,
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
    if (next.kind === "cardenolide") {
      const pose = cardenolidePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "orange") {
      const pose = orangePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = tagPose(next.t);
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
      kind === "danaus"
        ? "sit"
        : kind === "asclepias"
          ? "talk"
          : kind === "oyamel"
            ? "sit"
            : kind === "warning"
              ? "play"
              : kind === "chrysalis"
                ? "sit"
                : "sit";
    return {
      kind: kind,
      phase: kind === "danaus" ? "hold" : "go",
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

  function danausPose(t) {
    const breath = Math.sin(t * 0.16) + 0.02 * Math.sin(t * 0.88);
    return {
      lift: 0.018 + Math.abs(Math.sin(t * 0.24)) * 0.01,
      rot: 0.35 + breath * 0.48,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.018 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.35 * (1 - u) };
  }

  function asclepiasPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.asclepias));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * -0.045, rot: s * 2.4 * facing, anim: "talk" };
    }
    if (u < 0.76) {
      const s = (u - 0.14) / 0.62;
      const leaf = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * 0.014 * s + facing * leaf * 0.005,
        lift: -0.045 + Math.abs(leaf) * 0.028,
        rot: facing * (2.4 + s * 3.6 + leaf * 2.1),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.76) / 0.24);
    return {
      x: fromX + facing * 0.014 * (1 - s),
      lift: -0.045 * (1 - s),
      rot: facing * (2.0 * (1 - s)),
      anim: "sit",
    };
  }
  function oyamelPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.oyamel));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.055, rot: s * -3.2 * facing, anim: "sit" };
    }
    if (u < 0.8) {
      const s = (u - 0.16) / 0.64;
      const cluster = Math.sin(s * Math.PI * 2.1);
      return {
        x: fromX - facing * 0.018 * s + facing * cluster * 0.01,
        lift: 0.055 + Math.abs(cluster) * 0.04,
        rot: facing * (-3.2 + s * 4.4 + cluster * 2.6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.8) / 0.2);
    return {
      x: fromX - facing * 0.018 * (1 - s),
      lift: 0.055 * (1 - s),
      rot: facing * (-1.6 * (1 - s)),
      anim: "sit",
    };
  }
  function warningPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.warning));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 0.1, rot: s * 4.5 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const open = Math.sin(s * Math.PI * 3);
      return {
        x: fromX + facing * open * 0.012,
        lift: 0.1 + Math.abs(open) * 0.055,
        rot: facing * (4.5 + open * 6.2),
        anim: "play",
      };
    }
    if (u < 0.78) {
      const s = (u - 0.55) / 0.23;
      const hold = Math.sin(s * Math.PI * 2);
      return {
        x: fromX + facing * hold * 0.006,
        lift: 0.12 + Math.abs(hold) * 0.02,
        rot: facing * (5.8 + hold * 2.4),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 0.12 * (1 - s),
      rot: facing * (2.2 * (1 - s)),
      anim: "sit",
    };
  }
  function chrysalisPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.chrysalis));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * -0.055, rot: s * 1.6 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.2) / 0.35;
      return {
        x: fromX + facing * 0.004 * s,
        lift: -0.055 + s * 0.01,
        rot: facing * (1.6 + s * 0.8),
        anim: "sit",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const soft = Math.sin(s * Math.PI * 1.8);
      return {
        x: fromX + facing * (0.004 + soft * 0.008),
        lift: -0.045 + soft * 0.06,
        rot: facing * (2.4 + soft * 3.5),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX,
      lift: -0.02 * (1 - s),
      rot: facing * (1.5 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "asclepias" && trick.kind !== "oyamel" && trick.kind !== "warning" && trick.kind !== "chrysalis") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "danaus") {
      if (next.t < DANAUS_HOLD) {
        const pose = danausPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < DANAUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - DANAUS_HOLD);
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
    if (next.kind === "asclepias") {
      const pose = asclepiasPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "oyamel") {
      const pose = oyamelPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "warning") {
      const pose = warningPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = chrysalisPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    DANAUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    danausPose,
    releasePose,
    asclepiasPose,
    oyamelPose,
    warningPose,
    chrysalisPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    cardenolidePose,
    orangePose,
    tagPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMonarchTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
