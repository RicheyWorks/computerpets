/** Disk ground tricks while idle — ultra-polish pass. House water_lily — pad / corolla / rhizome / calyx / sheen / peltate / hydropote personality (pad float on the ink dish — never named drift (Coin owns drift) / float as coin-collision / flutter (Fan owns flutter) / biloba (Fan owns biloba), corolla bloom open on the lamp — never named open (Disk window owns open) / bloom as axolotl-guest collision / unfurl (Vein window owns unfurl) / flare (Coin owns flare) / labellum (Moth owns labellum), rhizome quiet settle under the pad — never named root (Burr owns root) / dig (Rabbit owns dig) / taproot (Mast owns taproot) / crawl (Cling owns crawl) / velamen (Moth owns velamen), petal calyx cup on the dish — never named cup (Cup guest / Octopus) / saucer (Vein owns saucer) / pouch (Anchor owns pouch), pond-surface sheen desk life under the lamp, peltate pad rocking on its central stalk (species-true Nymphaea peltate lamina — never named petiole (Fan owns petiole) / stipe (Vein owns stipe) / disk as guest-name / pad as the float trick), hydropote epidermal sip of pond minerals (species-true Nymphaeaceae hydropote cells — never named siphon (Anchor owns siphon) / soak (Ink owns soak) / bead (Felt owns bead) / dew as thank-you / pollen (Moth owns pollen)); not Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Peltate is the species-true central-stalk pad rock (not Fan petiole, not Vein stipe, not the pad float trick). Hydropote is the iconic Nymphaeaceae mineral-sip cells (not Anchor siphon, not Ink soak, not Felt bead). Window-play OPEN unchanged — never names open as a trick. Ethogram keeps sheen sit_hold; adds pad/corolla/rhizome/calyx/peltate/hydropote softs + freeze (replaces thin open/nod/lean). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via water_lily.wav. Thank-yous silt / nectar / dew. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as web `water_lily-tricks.ts`. True house-water-lily desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/labellum/velamen/column/spike/bark/pollen/mount/drift/float/bloom/cup/siphon/soak name collisions. Bird ultra (Soot→Ember) + Miso→Mast done; skip Rui + birds. Amplitudes raised toward Rui richness; denser waits/weights (SHEEN_HOLD=11.2 RELEASE_S=1.18). Pane now Rue-dense; Hold now Rue-dense; Spin now Rue-dense; Bell now Rue-dense; Rod now Rue-dense; Rose now Rue-dense; Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; Cap now Rue-dense; Lattice now Rue-dense; Horn now Rue-dense; Ring now Rue-dense; Mane now Rue-dense; next leftover Puff / puffball. No cry inventing beyond house water_lily.wav prefer. Never retouch Rui sprites. */
(function (root) {
const TRICK_KEY = "water_lily";
const TRICKS = ["pad", "corolla", "rhizome", "calyx", "sheen", "peltate", "hydropote"];
const HAPPY = ["silt", "nectar", "dew"];




const HAPPY_DUR = {
  silt: 1.28,
  nectar: 1.16,
  dew: 1.22,
};

/** Sheen hold — Disk parks pond-surface calm on the blotter. Not window-play OPEN. */
const SHEEN_HOLD = 11.2;
const RELEASE_S = 1.18;

const DUR = {
  sheen: SHEEN_HOLD + RELEASE_S,
  pad: 1.58,
  corolla: 1.64,
  rhizome: 1.48,
  calyx: 1.56,
  peltate: 1.68,
  hydropote: 1.72,
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
    if (kind === "sheen")
        return 40 + roll * 26;
    if (kind === "peltate" || kind === "hydropote")
        return 12.8 + roll * 9.4;
    if (kind === "pad" || kind === "corolla" || kind === "rhizome" || kind === "calyx")
        return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}
function pickTrick(rand, musicOn, lastKind) {
    if (musicOn)
        return "sheen";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) =>
        k === "sheen" ? 0.72 : k === "peltate" || k === "hydropote" ? 1.28 : k === "pad" || k === "corolla" || k === "rhizome" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
        r -= weights[i];
        if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "pad";
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
  return key === TRICK_KEY || key === "disk";
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
  const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "silt";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "silt" ? "sit" : name === "nectar" ? "play" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function siltPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.silt));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "sit" };
  }
  if (u < 0.76) {
    const silt = Math.sin(t * 1.72);
    return {
      lift: 3.36 + Math.abs(silt) * 1.68,
      rot: 14.4 + silt * 12,
      dx: silt * 0.144,
      anim: "sit",
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "sit" };
}

function nectarPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.nectar));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 3.6, rot: s * -12, dx: 0, anim: "play" };
  }
  if (u < 0.78) {
    const sweet = Math.sin(t * 2.05);
    return {
      lift: 3.6 + Math.abs(sweet) * 1.8,
      rot: -12 + sweet * 16.8,
      dx: sweet * 0.168,
      anim: "play",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.4 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "idle" };
}

function dewPose(t) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
    rot: Math.sin(t * 0.864) * 9.6,
    dx: Math.sin(t * 0.48) * -0.144,
    anim: "talk",
  };
}

function stepHappy(happy, dt, flags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "silt") {
    const pose = siltPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nectar") {
    const pose = nectarPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = dewPose(next.t);
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
    kind === "sheen"
      ? "sit"
      : kind === "pad"
        ? "sit"
        : kind === "corolla"
          ? "talk"
          : kind === "rhizome"
            ? "play"
            : kind === "calyx"
              ? "talk"
              : kind === "peltate"
                ? "play"
                : kind === "hydropote"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "sheen" ? "hold" : "go",
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

function sheenPose(t) {
  const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
  return {
    lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
    rot: 4.8 + breath * 7.2,
  };
}

function releasePose(t) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  const s = smoothstep(u);
  return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4.8 * (1 - s) };
}

/** Pad — lily pad float on the dish. Never named drift/float/flutter. */
function padPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.pad));
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
function corollaPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.corolla));
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
function rhizomePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.rhizome));
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
function calyxPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.calyx));
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

/** Peltate — central-stalk pad rock. Not Fan petiole, not Vein stipe. */
function peltatePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.peltate));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.16, rot: s * -9.6 * facing, anim: "play" };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const rock = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 0.72 + rock * 0.24),
      lift: 2.16 + Math.abs(rock) * 1.92,
      rot: facing * (-9.6 + rock * 16.8),
      anim: "play",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const spin = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * 0.72,
      lift: 3.36 + Math.abs(spin) * 0.96,
      rot: facing * (4.8 + spin * 12),
      anim: "play",
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
function hydropotePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.hydropote));
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
    trick.kind !== "pad" &&
    trick.kind !== "corolla" &&
    trick.kind !== "rhizome" &&
    trick.kind !== "calyx" &&
    trick.kind !== "peltate" &&
    trick.kind !== "hydropote"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "sheen") {
    if (next.t < SHEEN_HOLD) {
      const pose = sheenPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SHEEN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SHEEN_HOLD);
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
  if (next.kind === "pad") pose = padPose(next.t, fromX, trick.facing);
  else if (next.kind === "corolla") pose = corollaPose(next.t, fromX, trick.facing);
  else if (next.kind === "rhizome") pose = rhizomePose(next.t, fromX, trick.facing);
  else if (next.kind === "calyx") pose = calyxPose(next.t, fromX, trick.facing);
  else if (next.kind === "peltate") pose = peltatePose(next.t, fromX, trick.facing);
  else pose = hydropotePose(next.t, fromX, trick.facing);
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
    SHEEN_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    sheenPose,
    releasePose,
    padPose,
    corollaPose,
    rhizomePose,
    calyxPose,
    peltatePose,
    hydropotePose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    siltPose,
    nectarPose,
    dewPose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetWaterLilyTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
