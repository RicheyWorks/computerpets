/** Cap ground tricks while idle — ultra-polish pass. House fly-agaric Amanita desk life — annulus / volva / flake / symbiont / amanita / pileus / bulb personality (annulus skirt-ring settle under the lamp as partial-veil remnant — never named warts (window-play WARTS) / cap as trick kind / lean / flush (ethogram-old) / dig (Thimble) / nest (Clip+Column) / bank (Lula+Bank) / buzz (Relay) / dance (Rui) / hover (Sepia) / festoon/capped/midrib/stores/tessera/alveoli/foundation (Wax) / lamella/imbricate/lasso/margin/pleurotus/sporulate/hypha (Frill), volva basal cup press into the blotter — never named shelf (Frill window) / tuft (Felt) / frond (Vein) / curl (Burr) / brood as trick kind / hold as trick kind / cell (mason) / cerumen/batumen (Pot) / circle/liner (Disc), flake universal-veil flake settle on the pileus (Amanita remnant flakes — not window WARTS) — never named tooting/retinue/duel/royal (Keep) / hex (Comb) / partition (Auger) / plug (Mortar) / fossor (Thrum) / shaft (Bank), symbiont mycorrhizal hush with the moss cup — never named frill as trick kind / fan (Fan) / sheen (Sheen+Disk) / glint (Coin) / gleam (Ground) / shine (Ember) / wax as trick kind / honey/mead (Comb happy) / nectar (Disk) / pollen (Moth) / vessel/spout (Pot) / mass (Bank), amanita long hold desk life as Amanita muscaria with muscaria / regalis / frostiana thank-yous — never named mellifera (Hum) / regina (Keep) / andrena (Bank) / langstroth/topbar/warre (Wax) / ostreatus/pulmonarius/eryngii (Frill) / hive/hex (Comb), pileus red pileus tip toward the lamp (species-true Amanita muscaria tell — never named cap as trick kind / warts / spot (Seven) / flush (Sepia) / sheen/glint/gleam/shine), bulb basal bulb settle under the volva (species-true Amanita basal bulb — never named shaft (Bank) / dig (Thimble) / hypha (Frill) / rhizoid (Felt) / stipe (Vein) / thread); not Wax/Comb/Hum/Keep/Frill/Felt/Vein/Fan peer copies. Pileus is iconic Amanita red-cap tip (not window WARTS, not guest name Cap as a trick kind). Stipe is iconic Amanita stem settle (not Frill hypha tip, not Bank shaft). Window-play WARTS unchanged — never names warts. Ethogram keeps amanita sit_hold; adds annulus/volva/flake/symbiont/pileus/bulb softs + freeze (replaces thin lean/flush/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via fly_agaric.wav. Thank-yous muscaria / regalis / frostiana. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web fly_agaric-tricks.ts. True house fly-agaric desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/honey_queen/Keep/honeycomb/Wax/oyster/Frill/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood or *Dragon electrical clone. Puff owns the next leftover. Amplitudes raised toward Rui richness; denser waits/weights (AMANITA_HOLD=11.2 RELEASE_S=1.18). Ethogram softs + freeze — never names fly_agaric/cap/warts as bare ethogram-only trick kinds. Window-play WARTS unchanged. Next leftover Puff / puffball. Mycorrhizal Amanita muscaria warning-mushroom desk life only — skirt + volva, not a bee, not a plant, not Wax honeycomb place, not Frill oyster shelf. No cry inventing — thank-yous are silent desk motion only. */
(function (root) {
const TRICK_KEY = "fly_agaric";
const TRICKS = ["annulus", "volva", "flake", "symbiont", "amanita", "pileus", "bulb"];
const HAPPY = ["muscaria", "regalis", "frostiana"];




const HAPPY_DUR = { muscaria: 1.28, regalis: 1.16, frostiana: 1.22 };

/** Amanita hold — Cap parks fly-agaric calm on the blotter. Not window-play WARTS. */
const AMANITA_HOLD = 11.2;
const RELEASE_S = 1.18;

const DUR = { amanita: AMANITA_HOLD + RELEASE_S, annulus: 1.58, volva: 1.64, flake: 1.48, symbiont: 1.56, pileus: 1.68, bulb: 1.72 };

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
    if (kind === "amanita") return 40 + roll * 26;
    if (kind === "annulus" || kind === "volva" || kind === "flake" || kind === "symbiont" || kind === "pileus" || kind === "bulb") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "amanita";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "amanita" ? 0.72 : k === "annulus" || k === "pileus" ? 1.28 : k === "bulb" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "annulus";
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
  return key === TRICK_KEY || key === "cap";
}

function startThankYou(key, lastKind, x, facing, flags) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

function pickHappy(lastKind, rand) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

function beginHappy(kind, x, facing) {
  const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "muscaria";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "muscaria" ? "talk" : name === "regalis" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function muscariaPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.muscaria));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" };
  }
  if (u < 0.76) {
    const tick = Math.sin(t * 1.72);
    return {
      lift: 3.36 + Math.abs(tick) * 1.68,
      rot: 14.4 + tick * 12,
      dx: tick * 0.14,
      anim: "talk",
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "talk" };
}

function regalisPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.regalis));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 3.6, rot: s * -12, dx: 0, anim: "play" };
  }
  if (u < 0.78) {
    const sweet = Math.sin(t * 2.05);
    return {
      lift: 3.6 + Math.abs(sweet) * 1.8,
      rot: -12 + sweet * 16.8,
      dx: sweet * 0.17,
      anim: "play",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.4 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "idle" };
}

function frostianaPose(t) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.58)) * 1.32,
    rot: Math.sin(t * 0.72) * 9.6,
    dx: Math.sin(t * 0.4) * -0.14,
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
  if (next.kind === "muscaria") {
    const pose = muscariaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "regalis") {
    const pose = regalisPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = frostianaPose(next.t);
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
      kind === "amanita"
        ? "sit"
        : kind === "annulus"
          ? "play"
          : kind === "volva"
            ? "talk"
            : kind === "flake"
              ? "talk"
              : kind === "symbiont"
                ? "sit"
                : kind === "pileus"
                  ? "sit"
                  : kind === "bulb"
                    ? "play"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "amanita" ? "hold" : "go",
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

function amanitaPose(t) {
  const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
  return {
    lift: 2.88 + Math.abs(Math.sin(t * 0.42)) * 1.44,
    rot: 4.8 + breath * 7.2,
  };
}

function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  const s = smoothstep(u);
  return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4.8 * (1 - s) };
}

/** Pad — lily pad float on the dish. Never named drift/float/flutter. */
function annulusPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.annulus));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.84, rot: s * -9.6 * facing, anim: "sit" };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const bob = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * bob * 0.42,
      lift: 3.84 - s * 0.96 + Math.abs(bob) * 0.72,
      rot: facing * (-9.6 + bob * 14.4),
      anim: "sit",
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.48,
      lift: 2.88 * (1 - settle * 1.02),
      rot: facing * (-4.8 + settle * 9.6),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 0.96 * (1 - s),
    rot: facing * (3.6 * (1 - s)),
    anim: "sit",
  };
}

/** Corolla — fragrant bloom open. Never named open/bloom/unfurl/flare. */
function volvaPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.volva));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.12, rot: s * -12 * facing, anim: "talk" };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const open = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * open * 0.48,
      lift: 3.12 + Math.abs(open) * 1.92,
      rot: facing * (-12 + open * 16.8),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.16 * (1 - s),
    rot: facing * (-7.2 * (1 - s)),
    anim: "sit",
  };
}

/** Rhizome — quiet settle under the pad. Never named root/dig/taproot. */
function flakePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.flake));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.88, rot: s * 16.8 * facing, anim: "play" };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const press = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * press * 0.48,
      lift: 2.88 + Math.abs(press) * 1.68,
      rot: facing * (16.8 + press * 14.4),
      anim: "play",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.6,
      lift: 3.84 - settle * 1.44,
      rot: facing * (16.8 - settle * 19.2),
      anim: "play",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * (-3.6 * (1 - s)),
    anim: "sit",
  };
}

/** Calyx — sepal cup on the dish. Never named cup/saucer/pouch. */
function symbiontPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.symbiont));
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "talk" };
  }
  if (u < 0.55) {
    const s = (u - 0.15) / 0.4;
    const cup = smoothstep(s);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.3,
      lift: 3.12 * (1 - cup * 0.84),
      rot: facing * (12 - cup * 16.8),
      anim: "talk",
    };
  }
  if (u < 0.8) {
    const s = (u - 0.55) / 0.25;
    const hold = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * hold * 0.24,
      lift: 0.96 + Math.abs(hold) * 0.72,
      rot: facing * (-4.8 + hold * 12),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 0.72 * (1 - s),
    rot: facing * (-2.4 * (1 - s)),
    anim: "sit",
  };
}

/** Peltate — central-stalk pad rock. Not Fan petiole, not Vein bulb. */
function pileusPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.pileus));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.16, rot: s * -9.6 * facing, anim: "sit" };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const rock = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 0.72 + rock * 0.24),
      lift: 2.16 + Math.abs(rock) * 1.92,
      rot: facing * (-9.6 + rock * 16.8),
      anim: "sit",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const spin = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * 0.72,
      lift: 3.36 + Math.abs(spin) * 0.96,
      rot: facing * (4.8 + spin * 12),
      anim: "sit",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.72 * (1 - s),
    lift: 2.16 * (1 - s) + s * 0.24,
    rot: facing * (4.8 * (1 - s)),
    anim: "idle",
  };
}

/** Hydropote — Nymphaeaceae mineral-sip cells. Not Anchor siphon, not Ink soak. */
function bulbPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.bulb));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "talk" };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const sip = smoothstep(s);
    return {
      x: fromX + facing * sip * 0.6,
      lift: 3.12 + sip * 2.88,
      rot: facing * (12 + sip * 9.6),
      anim: "talk",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const drink = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (0.6 + drink * 0.36),
      lift: 5.76 + Math.abs(drink) * 0.96,
      rot: facing * (7.2 + drink * 16.8),
      anim: "talk",
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.6 * (1 - s),
    lift: 3.12 * (1 - s),
    rot: facing * (7.2 * (1 - s)),
    anim: "idle",
  };
}

function stepTrick(trick, dt, flags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "annulus" &&
    trick.kind !== "volva" &&
    trick.kind !== "flake" &&
    trick.kind !== "symbiont" &&
    trick.kind !== "pileus" &&
    trick.kind !== "bulb"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "amanita") {
    if (next.t < AMANITA_HOLD) {
      const pose = amanitaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < AMANITA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - AMANITA_HOLD);
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
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  let pose;
  if (next.kind === "annulus") pose = annulusPose(next.t, fromX, trick.facing);
  else if (next.kind === "volva") pose = volvaPose(next.t, fromX, trick.facing);
  else if (next.kind === "flake") pose = flakePose(next.t, fromX, trick.facing);
  else if (next.kind === "symbiont") pose = symbiontPose(next.t, fromX, trick.facing);
  else if (next.kind === "pileus") pose = pileusPose(next.t, fromX, trick.facing);
  else pose = bulbPose(next.t, fromX, trick.facing);
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
    DUR,
    AMANITA_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    amanitaPose,
    releasePose,
    annulusPose,
    volvaPose,
    flakePose,
    symbiontPose,
    pileusPose,
    bulbPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    muscariaPose,
    regalisPose,
    frostianaPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetFlyAgaricTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
