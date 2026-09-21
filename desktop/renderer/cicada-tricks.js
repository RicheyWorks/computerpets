/** Brood ground tricks while idle — ultra-polish pass. House periodical cicada — tymbal / cast / egress / harden / magicicada / xylem / pharaoh personality (tymbal tymbal-song vibration on the inkstone — never named buzz (Relay + Snap) / song (field cricket window SONG) / burst (ethogram-old) / flash (Quill) / semaphore (Spark) / lantern (Spark) / talk, cast molt-shell leave-behind — never named shed (Ember) / exuvia (Dart happy) / molt / peel / strip / skin, egress ground-emergence climb from the dark years — never named emerge (window EMERGE + ethogram-old) / dig (Thimble) / heave (Ground) / lug (Ground) / earth (Ground) / crawl (Cling) / climb (Seven) / rise / surface, harden sun-perch cuticle set after egress — never named perch (Echo window) / sun (Sol) / bask (Ink window) / warm (Sol happy) / heat (Jade) / press (Sol) / glare / roost (Keel), magicicada desk life as a Magicicada septendecim periodical week with annual cousins in the thank-yous, xylem xylem-sap sip settle (species-true Magicicada xylem feeding — never named sip (Sip guest) / drink / suck / forage / feed / gulp (Coin) / bask / press), pharaoh Pharaoh-cicada wing-flare identity (common-name Magicicada septendecim presence flare — never named flash (Quill) / warning (Milk) / semaphore (Spark) / elytra (Spark) / soar / rise / hover / flare (Coin) / deimatic (Fold) / wing (Kite) / alar (Seven)); not Fold raptorial/gimbal/snatch/pendulum/mantodea/ootheca/deimatic, Seven spots/aphid/reflex/climb/coccinella/pronotum/alar, Column gallery/pheromone/crumb/bustle/camponotus/trophallaxis/frass, Twig rocking/catalepsy/browse/tread/diapheromera/oviposit/filiform, Dart hawking/tandem/nymph/whir/anax/obelisk/ommatidia, Spark lantern/jstroke/semaphore/elytra/photinus, Ghost plumose/lunule/silk/stream/actias, Milk asclepias/oyamel/warning/chrysalis/danaus, Comb figure/corbicula/hex/proboscis/hive, Relay buzz, Sol sun, Echo perch, Ember shed, Vesper fold, Sip sip, Coin gulp/flare, Quill flash, Kite wing, or *Dragon copies). Xylem is the iconic Magicicada xylem-sap sip (not Sip guest, not Coin gulp). Pharaoh is the iconic Pharaoh-cicada wing-flare (not Fold deimatic, not Quill flash, not Seven alar). Window-play EMERGE unchanged — never names emerge/burst/still. Ethogram keeps magicicada sit_hold; adds tymbal/cast/egress/harden/xylem/pharaoh softs + freeze (replaces thin still/emerge/burst). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via cicada.wav. Thank-yous septendecim / cassini / cicadidae. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web cicada-tricks.ts. True house-cicada desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold or *Dragon electrical clone. Mane owns the next leftover. Amplitudes raised toward Rui richness; denser waits/weights (MAGICICADA_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names cicada/brood/emerge as bare ethogram-only trick kinds. Window-play EMERGE unchanged. Next leftover Mane / lions_mane. Catalog 221. Never retouch Rui sprites. Magicicada Periodical Cicada desk life only. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
  const TRICK_KEY = "cicada";
  const TRICKS = ["tymbal", "cast", "egress", "harden", "magicicada", "xylem", "pharaoh"];
  const HAPPY = ["septendecim", "cassini", "cicadidae"];
  const HAPPY_DUR = {
    septendecim: 1.26,
    cassini: 1.34,
    cicadidae: 1.3,
  };
  const MAGICICADA_HOLD = 11.2;
  const RELEASE_S = 1.18;
  const DUR = {
    magicicada: MAGICICADA_HOLD + RELEASE_S,
    tymbal: 1.58,
    cast: 1.52,
    egress: 1.62,
    harden: 1.54,
    xylem: 1.6,
    pharaoh: 1.56,
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
    if (kind === "magicicada") return 40 + roll * 26;
    if (kind === "tymbal" || kind === "cast" || kind === "egress" || kind === "harden" || kind === "xylem" || kind === "pharaoh") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "magicicada";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "magicicada" ? 0.72 : k === "tymbal" || k === "pharaoh" ? 1.28 : k === "xylem" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "tymbal";
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
    return key === TRICK_KEY || key === "brood";
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
    const name = HAPPY.indexOf(kind) >= 0 ? kind : "septendecim";
    return {
      kind: name,
      happy: true,
      phase: "go",
      t: 0,
      x: x,
      lift: 0,
      rot: 0,
      anim: name === "septendecim" ? "talk" : name === "cassini" ? "play" : "sit",
      facing: facing == null ? 1 : facing,
      fromX: x,
    };
  }

  function septendecimPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.septendecim));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 3.48, rot: s * 14.4, dx: 0, anim: "talk" };
    }
    if (u < 0.74) {
      const buzz = Math.sin(t * 14.5) + 0.35 * Math.sin(t * 29);
      return {
        lift: 3.48 + Math.abs(buzz) * 1.62,
        rot: 14.4 + buzz * 12,
        dx: buzz * 0.22,
        anim: "talk",
      };
    }
    const s = (u - 0.74) / 0.26;
    return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "idle" };
  }
  function cassiniPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cassini));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 3.84, rot: s * -11.4, dx: s * 0.24, anim: "play" };
    }
    if (u < 0.78) {
      const pulse = Math.sin(t * 5.2) + 0.28 * Math.sin(t * 10.4);
      return {
        lift: 3.84 + Math.abs(pulse) * 1.68,
        rot: -11.4 + pulse * 10.8,
        dx: pulse * 0.26,
        anim: "play",
      };
    }
    const s = (u - 0.78) / 0.22;
    return { lift: 2.52 * (1 - s), rot: -5.4 * (1 - s), dx: 0, anim: "sit" };
  }
  function cicadidaePose(t) {
    return {
      lift: 2.52 + Math.abs(Math.sin(t * 0.4)) * 1.02,
      rot: Math.sin(t * 0.52) * 7.8,
      dx: Math.sin(t * 0.28) * 0.1,
      anim: "sit",
    };
  }
  function stepHappy(happy, dt, flags) {
    if (!happy || happy.phase === "done") return happy;
    if (happyShouldAbort(flags)) {
      return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...happy, t: happy.t + Math.max(0, dt) };
    const hold = HAPPY_DUR[next.kind];
    if (next.kind === "septendecim") {
      const pose = septendecimPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else if (next.kind === "cassini") {
      const pose = cassiniPose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    } else {
      const pose = cicadidaePose(next.t);
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
    }
    if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  function sleepHoldFrame(_key, _frameCount) {
    return null;
  }

  function beginTrick(kind, x, facing) {
    const anim =
      kind === "magicicada"
        ? "sit"
        : kind === "tymbal"
          ? "talk"
          : kind === "cast"
            ? "sit"
            : kind === "egress"
              ? "play"
              : kind === "harden"
                ? "sit"
                : kind === "xylem"
                  ? "sit"
                  : kind === "pharaoh"
                    ? "play"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "magicicada" ? "hold" : "go",
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

  function magicicadaPose(t) {
    const breath = Math.sin(t * 0.16) + 0.03 * Math.sin(t * 0.72);
    const grain = Math.abs(Math.sin(t * 0.34));
    return {
      lift: 2.88 + grain * 1.32,
      rot: 4.56 + breath * 3.84,
    };
  }

  function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 3.6 * (1 - u) };
  }

  function tymbalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.tymbal));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.42, rot: s * 13.2 * facing, anim: "talk" };
    }
    if (u < 0.86) {
      const buzz = Math.sin(t * 16.2) + 0.4 * Math.sin(t * 32.4) + 0.15 * Math.sin(t * 48);
      return {
        x: fromX + facing * buzz * 0.24,
        lift: 3.42 + Math.abs(buzz) * 1.5,
        rot: facing * (13.2 + buzz * 9.6),
        anim: "talk",
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 2.4 * (1 - s),
      rot: facing * (5.4 * (1 - s)),
      anim: "sit",
    };
  }
  function castPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.cast));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * 3.24, rot: s * -12 * facing, anim: "sit" };
    }
    if (u < 0.45) {
      const s = (u - 0.2) / 0.25;
      const arch = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * arch * 0.42,
        lift: 3.24 + arch * 1.68,
        rot: facing * (-12 + arch * 7.2),
        anim: "play",
      };
    }
    if (u < 0.72) {
      const s = (u - 0.45) / 0.27;
      const slip = Math.sin(s * Math.PI * 1.6) * 0.22;
      return {
        x: fromX + facing * (0.54 + slip * 0.3),
        lift: 4.08 - s * 1.44,
        rot: facing * (-4.8 + slip * 6),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.3 * (1 - s),
      lift: 2.16 * (1 - s),
      rot: facing * (-2.4 * (1 - s)),
      anim: "sit",
    };
  }
  function egressPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.egress));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: -0.72 + s * 1.68, rot: s * 7.2 * facing, anim: "sit" };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const climb = smoothstep(s);
      return {
        x: fromX + facing * climb * 1.08,
        lift: 0.96 + climb * 3.12,
        rot: facing * (7.2 + climb * 9.6),
        anim: "play",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const settle = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (1.08 + settle * 0.22),
        lift: 4.08 - settle * 0.84,
        rot: facing * (16.8 - settle * 6),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.84 * (1 - s * 0.36),
      lift: 2.64 * (1 - s),
      rot: facing * (6 * (1 - s)),
      anim: "sit",
    };
  }
  function hardenPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.harden));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.3, rot: s * 12 * facing, anim: "sit" };
    }
    if (u < 0.84) {
      const s = (u - 0.14) / 0.7;
      const sun = Math.sin(s * Math.PI * 2.2) * 0.28;
      return {
        x: fromX + facing * sun * 0.24,
        lift: 3.3 + Math.abs(sun) * 1.38,
        rot: facing * (12 + sun * 8.4),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 2.28 * (1 - s),
      rot: facing * (4.8 * (1 - s)),
      anim: "sit",
    };
  }
  function xylemPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.xylem));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 3.06, rot: s * -10.2 * facing, anim: "sit" };
    }
    if (u < 0.78) {
      const s = (u - 0.14) / 0.64;
      const sip = Math.sin(s * Math.PI * 4.8) + 0.28 * Math.sin(s * Math.PI * 9.2);
      return {
        x: fromX + facing * sip * 0.17,
        lift: 3.06 + Math.abs(sip) * 1.38,
        rot: facing * (-10.2 + sip * 9.6),
        anim: "sit",
      };
    }
    const s = smoothstep((u - 0.78) / 0.22);
    return {
      x: fromX,
      lift: 2.16 * (1 - s),
      rot: facing * (-4.2 * (1 - s)),
      anim: "sit",
    };
  }
  function pharaohPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.pharaoh));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * 3.78, rot: s * 10.8 * facing, anim: "play" };
    }
    if (u < 0.55) {
      const s = (u - 0.12) / 0.43;
      const flare = Math.sin(s * Math.PI * 7.6) + 0.32 * Math.sin(s * Math.PI * 13.4);
      return {
        x: fromX + facing * (0.48 * s + flare * 0.22),
        lift: 3.78 + s * 2.04 + Math.abs(flare) * 1.14,
        rot: facing * (10.8 + flare * 12),
        anim: "play",
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const settle = Math.sin(s * Math.PI);
      return {
        x: fromX + facing * (0.6 + settle * 0.14),
        lift: 5.76 - s * 2.52 + Math.abs(settle) * 0.66,
        rot: facing * (8.4 - settle * 4.8),
        anim: "play",
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.38 * (1 - s),
      lift: 2.76 * (1 - s),
      rot: facing * (3.6 * (1 - s)),
      anim: "sit",
    };
  }
  function stepTrick(trick, dt, flags) {
    if (!trick || trick.phase === "done") return trick;
    if (
      shouldAbort(flags) &&
      trick.kind !== "tymbal" &&
      trick.kind !== "cast" &&
      trick.kind !== "egress" &&
      trick.kind !== "harden" &&
      trick.kind !== "xylem" &&
      trick.kind !== "pharaoh"
    ) {
      return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
    }
    const next = { ...trick, t: trick.t + Math.max(0, dt) };
    if (next.kind === "magicicada") {
      if (next.t < MAGICICADA_HOLD) {
        const pose = magicicadaPose(next.t);
        next.phase = "hold";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      if (next.t < MAGICICADA_HOLD + RELEASE_S) {
        const pose = releasePose(next.t - MAGICICADA_HOLD);
        next.phase = "release";
        next.lift = pose.lift;
        next.rot = pose.rot;
        next.anim = "sit";
        return next;
      }
      return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    }
    const hold = DUR[next.kind];
    const u = next.t / hold;
    let pose;
    if (next.kind === "tymbal") pose = tymbalPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else if (next.kind === "cast") pose = castPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else if (next.kind === "egress") pose = egressPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else if (next.kind === "harden") pose = hardenPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else if (next.kind === "xylem") pose = xylemPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    else pose = pharaohPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
    if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
    return next;
  }

  const api = {
    TRICK_KEY,
    TRICKS,
    HAPPY,
    HAPPY_DUR,
    MAGICICADA_HOLD,
    RELEASE_S,
    DUR,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    septendecimPose,
    cassiniPose,
    cicadidaePose,
    stepHappy,
    sleepHoldFrame,
    beginTrick,
    magicicadaPose,
    releasePose,
    tymbalPose,
    castPose,
    egressPose,
    hardenPose,
    xylemPose,
    pharaohPose,
    stepTrick,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetCicadaTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
