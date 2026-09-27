/** Dusk ground tricks while idle — ultra-polish pass. House neighborly alien twilight-belt desk RIM life — belt / penumbra / eclipse / limb / limitor / umbra / syzygy personality (day/night line, eclipse hush, alien limb of light, Limitor cursor lamp-edge life — never named rim or edge or still or trail or terminator or dusk as trick kinds; window-play RIM + ethogram-old edge-walk/still/rim own those words; guest slug Dusk / key terminator only for isKey matching — accept "terminator" and "dusk"; do NOT name a trick "terminator" or "dusk" or "rim" or "edge") — not Shard cleavage/twinning/inclusion/grit/crescit/hopper/phantom living-crystal, not Drift waft/billow/cirrus/virga/stratus/tholin/nucleate methane-cloud, not Choir polyphony/partial/timbre/resonance/harmonia/formant/dyad chord-body, not Gleam photon/wavelength/lumen/glass/photovore/opsin/iridophore lamp-drinker, not Pulse bell/oral/lucent/trail/medusa jelly, not Pact podetium/photobiont/fruticose/stone/cladonia plaque, not Starter bud/proof/levain/ferment/saccharomyces bloom, not Flame sulfur/tier/oak/soft/laetiporus drip, not Puff ostiole/gleba/peridium/duff/lycoperdon cloud, not Mane spine/icicle/cascade/wound/hericium teeth, not Ring pore/bracket/zonate/leathery/trametes underside, not Frill lamella/imbricate/lasso/margin/pleurotus oyster, not Cap annulus/volva/flake/symbiont/amanita, not Wax tessera/hex honeycomb, not Spark firefly lantern, not Coin goldfish drift; never named rim (window-play RIM — never a trick kind) / edge (ethogram-old edge-walk — never a trick kind) / still (ethogram-old) / trail (ethogram-old) / terminator (guest key — never a trick kind) / dusk (guest name — never a trick kind) / cleavage / twinning / inclusion / grit / crescit / hopper / phantom / euhedral / vitreous / adamantine / facet / silica / shard / float / waft / billow / cirrus / virga / stratus / zephyr / fogbow / mizzle / tholin / nucleate / photon / wavelength / lumen / actinic / lux / lambert / polyphony / partial / timbre / resonance / harmonia / formant / dyad / diapason / motet / canticle / cloud / mist / fog / haze / puff / dust / rain / chord / thirst / drink / drone / pulse / gleam / shine / glint / sheen / dig / nest / bank / buzz / dance / plaque / share / bloom / loaf — Echo/Quill are birds with sound — do not copy their tricks. belt thin creep along the day/night line on the blotter, penumbra soft half-light sway, eclipse hush settle under the lamp, limb alien limb-of-light stretch, limitor long Limitor-cursor hold desk life as twilight walker (not Shard living crystal, not Drift methane floater, not Choir chord-body, not Gleam lamp-drinker) with crepuscule / gloaming / eventide cousins in the thank-yous — never named mellifera / regina / andrena / langstroth; umbra full-shadow cone settle (THE twilight-belt tell — never named rim / edge / still / trail / terminator / dusk as this new tell); syzygy lamp-body-shadow line-up (THE alignment tell — never named rim / edge / still / trail / terminator / dusk as this new tell); guest slug Dusk / key terminator only for isKey matching — accept "terminator" and "dusk"; do NOT name a trick "terminator" or "dusk"). Feed-happy thank-yous sit after eat. Card-open freeze and window-play RIM do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop terminator-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/honey_queen/Keep/honeycomb/Wax/oyster/Frill/fly_agaric/Cap/morel/Lattice/chanterelle/Horn/turkey_tail/Ring/lions_mane/Mane/puffball/Puff/chicken_of_woods/Flame/yeast/Starter/lichen/Pact/photovore/Gleam/choir/Choir/nimbus/Drift/silica/Shard/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood or *Dragon electrical clone. Window-play RIM unchanged — never names rim. Ethogram softs + freeze — never names edge or still or rim as trick kinds. Hinge owns the next seat. No cry inventing — thank-yous are silent desk motion only. Amplitudes raised toward Rui richness; denser waits/weights (LIMITOR_HOLD=11.2 RELEASE_S=1.18). Next leftover Knot / nexus. prefersHouseCry via terminator.wav. */
(function (root) {
const TRICK_KEY = "terminator";
const TRICKS = ["belt", "penumbra", "eclipse", "limb", "limitor", "umbra", "syzygy"];
const HAPPY = ["crepuscule", "gloaming", "eventide"];




const HAPPY_DUR = {
  crepuscule: 1.28,
  gloaming: 1.16,
  eventide: 1.22,
};

/** Limitor hold — Dusk parks twilight-belt calm as lamp-edge desk life. Not window-play RIM. */
const LIMITOR_HOLD = 11.2;
const RELEASE_S = 1.18;
const DUR = {
  limitor: LIMITOR_HOLD + RELEASE_S,
  belt: 1.58,
  penumbra: 1.64,
  eclipse: 1.48,
  limb: 1.56,
  umbra: 1.68,
  syzygy: 1.72,
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
    if (kind === "limitor") return 40 + roll * 26;
    if (kind === "belt" || kind === "penumbra" || kind === "eclipse" || kind === "limb" || kind === "umbra" || kind === "syzygy") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }

function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "limitor";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : TRICKS.slice();
    const weights = list.map((k) =>
      k === "limitor" ? 0.72 : k === "belt" || k === "umbra" ? 1.28 : k === "syzygy" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "belt";
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
  return key === TRICK_KEY || key === "dusk";
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
  const name = (HAPPY).indexOf(kind) >= 0 ? (kind) : "crepuscule";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "crepuscule" ? "talk" : name === "gloaming" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function crepusculePose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.crepuscule));
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

function gloamingPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gloaming));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 4.08, rot: s * -16.8, dx: s * 0.18, anim: "play" };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 2.1);
    return {
      lift: 4.08 + Math.abs(flash) * 1.92,
      rot: -16.8 + flash * 14.4,
      dx: flash * 0.22,
      anim: "play",
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.64 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "sit" };
}

function eventidePose(t) {
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
  if (next.kind === "crepuscule") {
    const pose = crepusculePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gloaming") {
    const pose = gloamingPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = eventidePose(next.t);
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
    kind === "limitor"
      ? "sit"
      : kind === "belt"
        ? "walk"
        : kind === "penumbra"
          ? "talk"
          : kind === "eclipse"
            ? "sleep"
            : kind === "limb"
              ? "play"
              : kind === "umbra"
                ? "sit"
                : kind === "syzygy"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "limitor" ? "hold" : "go",
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

/** Limitor — long layered hold as twilight walker. Not window-play RIM. */
function limitorPose(t) {
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

/** Belt — thin creep along the day/night line on the blotter. Never named rim/edge/trail. */
function beltPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.belt));
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
      anim: "walk",
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

/** Penumbra — soft half-light sway. Never named rim/edge/still. */
function penumbraPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.penumbra));
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
      anim: "play",
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

/** Eclipse — hush settle under the lamp. Never named rim/edge/still. */
function eclipsePose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.eclipse));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.88, rot: s * 16.8 * facing, anim: "sit" };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const press = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * press * 0.48,
      lift: 2.88 + Math.abs(press) * 1.68,
      rot: facing * (16.8 + press * 14.4),
      anim: "sleep",
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.6,
      lift: 3.84 - settle * 1.44,
      rot: facing * (16.8 - settle * 19.2),
      anim: "sleep",
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

/** Limb — alien limb-of-light stretch. Never named rim/edge/trail. */
function limbPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.limb));
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
      anim: "play",
    };
  }
  if (u < 0.8) {
    const s = (u - 0.55) / 0.25;
    const hold = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * hold * 0.24,
      lift: 0.96 + Math.abs(hold) * 0.72,
      rot: facing * (-4.8 + hold * 12),
      anim: "play",
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

/** Umbra — full-shadow cone settle; THE twilight-belt tell. Never named rim/edge/still/trail/terminator/dusk as this new tell. */
function umbraPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.umbra));
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

/** Syzygy — lamp-body-shadow line-up; THE alignment tell. Never named rim/edge/still/trail/terminator/dusk as this new tell. */
function syzygyPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.syzygy));
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
      anim: "play",
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
    trick.kind !== "belt" &&
    trick.kind !== "penumbra" &&
    trick.kind !== "eclipse" &&
    trick.kind !== "limb" &&
    trick.kind !== "umbra" &&
    trick.kind !== "syzygy"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "limitor") {
    if (next.t < LIMITOR_HOLD) {
      const pose = limitorPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LIMITOR_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LIMITOR_HOLD);
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
  if (next.kind === "belt") pose = beltPose(next.t, fromX, trick.facing);
  else if (next.kind === "penumbra") pose = penumbraPose(next.t, fromX, trick.facing);
  else if (next.kind === "eclipse") pose = eclipsePose(next.t, fromX, trick.facing);
  else if (next.kind === "limb") pose = limbPose(next.t, fromX, trick.facing);
  else if (next.kind === "umbra") pose = umbraPose(next.t, fromX, trick.facing);
  else pose = syzygyPose(next.t, fromX, trick.facing);
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
    LIMITOR_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    beginTrick,
    limitorPose,
    releasePose,
    beltPose,
    penumbraPose,
    eclipsePose,
    limbPose,
    umbraPose,
    syzygyPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    crepusculePose,
    gloamingPose,
    eventidePose,
    stepHappy,
    sleepHoldFrame
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetTerminatorTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
