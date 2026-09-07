/** Thrum ground tricks while idle. House common eastern bumblebee — sonicate / scopa / fossor / lumber / bombus personality (sonicate buzz-pollination vibration on a blotter bloom — never named buzz (Relay + Snap) / forage (window FORAGE) / tymbal (Brood) / song (field cricket window SONG) / burst (ethogram) / flash (Quill) / semaphore (Spark) / lantern (Spark) / talk, scopa fuzzy-thorax pollen load — never named corbicula (Comb) / pollen (Moth happy) / nest (Clip) / cheek (Clip) / pocket (Clip) / fur / fluff / preen (Echo), fossor moss-cup nest burrow — never named dig (Thimble) / hive (Comb) / nest (Clip) / bank (window DIG) / heave (Ground) / lug (Ground) / earth (Ground) / crawl (Cling) / moss (Sash), lumber heavy loaded hover — never named hover (Sepia) / thrum (Vesper) / drone (Hum window) / heft (Lula) / figure (Comb) / wing (Kite) / flutter (Fan) / sip (hummingbird window), bombus desk life as a Bombus impatiens moss-cup forager with eastern cousins in the thank-yous; not Comb / Brood / Fold / Seven / Column / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play FORAGE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web bumblebee-tricks.ts. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood or *Dragon electrical clone. Window-play FORAGE unchanged — never names forage. Ethogram unchanged. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Brood owns tymbal/cast/egress/harden/magicicada and happy septendecim/cassini/cicadidae; Relay owns buzz; Sepia owns hover; Vesper owns thrum; Sash owns moss; Clip owns nest; Thimble owns dig; Moth owns pollen; Disk owns nectar; Hum window owns drone; Lula owns heft; Rui owns dance. Bombus moss-cup desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "bumblebee";
  const TRICKS = ["sonicate", "scopa", "fossor", "lumber", "bombus"];
  const HAPPY = ["impatiens", "bimaculatus", "bombini"];
  const HAPPY_DUR = { impatiens: 1.3, bimaculatus: 1.34, bombini: 1.28 };
  const BOMBUS_HOLD = 13.4;
  const RELEASE_S = 0.7;
  const DUR = { bombus: BOMBUS_HOLD + RELEASE_S, sonicate: 1.54, scopa: 1.48, fossor: 1.66, lumber: 1.62 };

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
    if (kind === "bombus") return 50 + roll * 32;
    if (kind === "sonicate") return 14 + roll * 11;
    if (kind === "fossor") return 17 + roll * 12;
    return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "bombus";
    const roll = rand == null ? Math.random() : rand;
    if (lastKind === "bombus") {
      if (roll < 0.26) return "sonicate";
      if (roll < 0.5) return "scopa";
      if (roll < 0.74) return "fossor";
      return "lumber";
    }
    if (lastKind === "sonicate") {
      if (roll < 0.26) return "bombus";
      if (roll < 0.5) return "scopa";
      if (roll < 0.74) return "fossor";
      return "lumber";
    }
    if (lastKind === "scopa") {
      if (roll < 0.22) return "bombus";
      if (roll < 0.44) return "sonicate";
      if (roll < 0.68) return "fossor";
      return "lumber";
    }
    if (roll < 0.2) return "bombus";
    if (roll < 0.4) return "sonicate";
    if (roll < 0.6) return "scopa";
    if (roll < 0.8) return "fossor";
    return "lumber";
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
    return key === TRICK_KEY || key === "thrum";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "impatiens";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "impatiens" ? "talk" : name === "bimaculatus" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function impatiensPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.impatiens));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.055, rot: s * 3.2, dx: 0, anim: "talk" };
    }
    if (u < 0.76) {
      const buzz = Math.sin(t * 18.2) + 0.3 * Math.sin(t * 36);
      return {
        lift: 0.055 + Math.abs(buzz) * 0.022,
        rot: 3.2 + buzz * 2.4,
        dx: buzz * 0.003,
        anim: "talk",
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.024 * (1 - s), rot: 1.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function bimaculatusPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.bimaculatus));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.07, rot: s * -3.4, dx: s * 0.004, anim: "play" };
    }
    if (u < 0.78) {
      const sway = Math.sin(t * 4.6) + 0.25 * Math.sin(t * 9.2);
      return {
        lift: 0.07 + Math.abs(sway) * 0.03,
        rot: -3.4 + sway * 4.2,
        dx: sway * 0.006,
        anim: "play",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 0.03 * (1 - s), rot: -1.2 * (1 - s), dx: 0, anim: "sit" };
  }
  function bombiniPose(t) {
    return {
      lift: 0.018 + Math.abs(Math.sin(t * 0.42)) * 0.016,
      rot: Math.sin(t * 0.55) * 1.4,
      dx: Math.sin(t * 0.3) * 0.003,
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
    if (next.kind === "impatiens") {
      const pose = impatiensPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "bimaculatus") {
      const pose = bimaculatusPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = bombiniPose(next.t);
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
      kind === "bombus"
      ? "sit"
      : kind === "sonicate"
        ? "talk"
        : kind === "scopa"
          ? "talk"
          : kind === "fossor"
            ? "play"
            : kind === "lumber"
              ? "play"
                : "sit";
    return {
      kind: kind,
      phase: kind === "bombus" ? "hold" : "go",
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

  function bombusPose(t) {
    const breath = Math.sin(t * 0.16) + 0.04 * Math.sin(t * 0.72);
    const grain = Math.abs(Math.sin(t * 0.34));
    return {
      lift: 0.02 + grain * 0.014,
      rot: 0.45 + breath * 0.7,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.02 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.45 * (1 - u) };
  }

  function sonicatePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sonicate));
    if (u < 0.1) {
      const s = smoothstep(u / 0.1);
      return { x: fromX, lift: s * 0.06, rot: s * 1.8 * facing, anim: "talk" };
    }
    if (u < 0.88) {
      const buzz = Math.sin(t * 22.5) + 0.45 * Math.sin(t * 45) + 0.18 * Math.sin(t * 67);
      return {
        x: fromX + facing * buzz * 0.003,
        lift: 0.06 + Math.abs(buzz) * 0.025,
        rot: facing * (1.8 + buzz * 3.4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX,
      lift: 0.02 * (1 - s),
      rot: facing * (0.7 * (1 - s)),
      anim: "sit",
    };
  }
  function scopaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.scopa));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.04, rot: s * -5.2 * facing, anim: "talk" };
    }
    if (u < 0.72) {
      const s = (u - 0.18) / 0.54;
      const pack = Math.sin(s * Math.PI * 3.2);
      return {
        x: fromX + facing * pack * 0.01,
        lift: 0.04 + Math.abs(pack) * 0.035,
        rot: facing * (-5.2 + s * 3.6 + pack * 2.4),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX,
      lift: 0.02 * (1 - s),
      rot: facing * (-1.4 * (1 - s)),
      anim: "sit",
    };
  }
  function fossorPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fossor));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: -0.02 * s, rot: s * 2.2 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.2) / 0.35;
      const dig = smoothstep(s);
      return {
        x: fromX + facing * dig * 0.04,
        lift: -0.02 - dig * 0.06,
        rot: facing * (2.2 + dig * 1.8),
        anim: "play",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const settle = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (0.04 + settle * 0.008),
        lift: -0.08 + settle * 0.03,
        rot: facing * (4.0 - settle * 1.2),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.035 * (1 - s * 0.4),
      lift: -0.04 * (1 - s),
      rot: facing * (1.6 * (1 - s)),
      anim: "sit",
    };
  }
  function lumberPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.lumber));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.09, rot: s * -2.6 * facing, anim: "play" };
    }
    if (u < 0.84) {
      const s = (u - 0.14) / 0.7;
      const heavy = Math.sin(s * Math.PI * 1.6);
      const bob = Math.sin(s * Math.PI * 3.2) * 0.35;
      return {
        x: fromX + facing * heavy * 0.045,
        lift: 0.09 + Math.abs(bob) * 0.04,
        rot: facing * (-2.6 + heavy * 4.8 + bob * 1.6),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.04 * (1 - s),
      rot: facing * (-1.0 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (shouldAbort(flags) && trick.kind !== "sonicate" && trick.kind !== "scopa" && trick.kind !== "fossor" && trick.kind !== "lumber") {
      return Object.assign({}, trick, { phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true });
    }
    const next = Object.assign({}, trick, { t: trick.t + Math.max(0, dt) });
    if (next.kind === "bombus") {
      if (next.t < BOMBUS_HOLD) {
        const pose = bombusPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < BOMBUS_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - BOMBUS_HOLD);
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
    if (next.kind === "sonicate") {
      const pose = sonicatePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "scopa") {
      const pose = scopaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "fossor") {
      const pose = fossorPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
      next.x = pose.x;
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = lumberPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
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
    BOMBUS_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    bombusPose,
    releasePose,
    sonicatePose,
    scopaPose,
    fossorPose,
    lumberPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    impatiensPose,
    bimaculatusPose,
    bombiniPose,
    stepHappy,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetBumblebeeTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
