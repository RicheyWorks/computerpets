/** Wax ground tricks while idle — ultra-polish pass. House honeycomb PLACE — festoon / capped / midrib / stores / tessera / alveoli / foundation personality (festoon builder-bee festoon-chain settle — never named figure/hex/corbicula/hive (Comb) / nest (Clip+Column) / bank (Lula+Bank) / dig (Thimble) / buzz (Relay) / dance (Rui) / hover (Sepia) / waggle (Comb window) / hum (Hum), capped capped-brood hush — never named brood as trick kind (Brood guest) / hold as trick kind / cell (mason) / cerumen/batumen (Pot) / circle/liner (Disc), midrib midrib plate align — never named tooting/retinue/duel/royal (Keep) / hex (Comb) / partition (Auger) / plug (Mortar), stores honey-store settle — never named honey/mead (Comb happy) / nectar (Disk) / pollen (Moth) / vessel/spout (Pot) / mass (Bank), tessera hexagonal place hold with langstroth/topbar/warre thank-yous — never named hex/hive (Comb) / mellifera (Hum) / regina (Keep) / andrena (Bank) / wax as trick kind, alveoli hexagonal cell-cavity architecture (species-true — never named cell/hex/circle/liner/cavity/vessel/urn/cistern), foundation wax-foundation plate emboss (species-true — never named sheet (Felt) / plate/emboss/stamp/frame/panel/board/floor)); not Comb/Hum/Keep/Thrum/Auger/Mortar/Disc/Pot/Sheen/Bank/Brood/Disk peer copies. Alveoli is iconic honeycomb cell-cavity (not Disc cavity, not Comb hex). Foundation is iconic wax foundation plate (not Felt sheet, not Midrib align). Window-play DRAW unchanged. Ethogram keeps tessera sit_hold; adds festoon/capped/midrib/stores/alveoli/foundation softs + freeze (replaces thin hold/brood/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via honeycomb.wav. Thank-yous langstroth / topbar / warre. Same map as desktop \honeycomb-tricks.js\. Amplitudes raised toward Rui richness; denser waits/weights (TESSERA_HOLD=11.2 RELEASE_S=1.18). Pane now Rue-dense; Hold now Rue-dense; Spin now Rue-dense; Bell now Rue-dense; Rod now Rue-dense; Rose now Rue-dense; Brick now Rue-dense; Drake now Rue-dense; Vee now Rue-dense; Drum now Rue-dense; Sip now Rue-dense; Echo now Rue-dense; Peck now Rue-dense; Quill now Rue-dense; Brood now Rue-dense; Frill now Rue-dense; Cap now Rue-dense; Lattice now Rue-dense; Horn now Rue-dense; Ring now Rue-dense; Mane now Rue-dense; next leftover Puff / puffball. Honeycomb place desk life only. No cry inventing — thank-yous silent desk motion only. */
(function (root) {
const TRICK_KEY = "honeycomb";
const TRICKS = ["festoon", "capped", "midrib", "stores", "tessera", "alveoli", "foundation"];
const HAPPY = ["langstroth", "topbar", "warre"];




const HAPPY_DUR = { langstroth: 1.28, topbar: 1.16, warre: 1.22 };

/** Tessera hold — Disk parks hexagonal comb calm on the blotter. Not window-play DRAW. */
const TESSERA_HOLD = 11.2;
const RELEASE_S = 1.18;

const DUR = { tessera: TESSERA_HOLD + RELEASE_S, festoon: 1.58, capped: 1.64, midrib: 1.48, stores: 1.56, alveoli: 1.68, foundation: 1.72 };

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
    if (kind === "tessera") return 40 + roll * 26;
    if (kind === "alveoli" || kind === "foundation") return 12.8 + roll * 9.4;
    if (kind === "festoon" || kind === "capped" || kind === "midrib" || kind === "stores") return 12.8 + roll * 9.4;
    return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
  }
  function pickTrick(rand, musicOn, lastKind) {
    if (musicOn) return "tessera";
    const roll = rand == null ? Math.random() : rand;
    const pool = TRICKS.filter((k) => k !== lastKind);
    const list = pool.length ? pool : [...TRICKS];
    const weights = list.map((k) =>
      k === "tessera" ? 0.72 : k === "alveoli" || k === "foundation" ? 1.28 : k === "festoon" || k === "capped" || k === "midrib" ? 1.18 : 1.08
    );
    let total = 0;
    for (let i = 0; i < weights.length; i++) total += weights[i];
    let r = roll * total;
    for (let i = 0; i < list.length; i++) {
      r -= weights[i];
      if (r <= 0) return list[i];
    }
    return list[list.length - 1] || "festoon";
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
  return key === TRICK_KEY || key === "wax";
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
  const name = HAPPY.indexOf(kind) >= 0 ? (kind) : "langstroth";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "langstroth" ? "talk" : name === "topbar" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function langstrothPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.langstroth));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" };
  }
  if (u < 0.76) {
    const tick = Math.sin(t * 1.72);
    return {
      lift: 3.36 + Math.abs(tick) * 1.68,
      rot: 14.4 + tick * 12,
      dx: tick * 0.144,
      anim: "talk",
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.4 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "talk" };
}

function topbarPose(t) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.topbar));
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
  return { lift: 2.4 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" };
}

function warrePose(t) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
    rot: Math.sin(t * 0.864) * 9.6,
    dx: Math.sin(t * 0.48) * -0.144,
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
  if (next.kind === "langstroth") {
    const pose = langstrothPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "topbar") {
    const pose = topbarPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = warrePose(next.t);
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
      kind === "tessera"
        ? "sit"
        : kind === "festoon"
          ? "play"
          : kind === "capped"
            ? "talk"
            : kind === "midrib"
              ? "talk"
              : kind === "stores"
                ? "sit"
                : kind === "alveoli"
                  ? "sit"
                  : kind === "foundation"
                    ? "play"
                    : "sit";
    return {
      kind: kind,
      phase: kind === "tessera" ? "hold" : "go",
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

function tesseraPose(t) {
  const breath = Math.sin(t * 0.504) + 0.06 * Math.sin(t * 1.15);
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
function festoonPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.festoon));
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
function cappedPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.capped));
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
function midribPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.midrib));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.88, rot: s * 16.8 * facing, anim: "play" };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const press = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * press * 0.48,
      lift: 2.88 + Math.abs(press) * 1.4,
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
function storesPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.stores));
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
function alveoliPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.alveoli));
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
    lift: 2.16 * (1 - s) + s * 0.2,
    rot: facing * (4.8 * (1 - s)),
    anim: "idle",
  };
}

/** Hydropote — Nymphaeaceae mineral-sip cells. Not Anchor siphon, not Ink soak. */
function foundationPose(t, fromX, facing) {
  const u = Math.max(0, Math.min(1, t / DUR.foundation));
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
    trick.kind !== "festoon" &&
    trick.kind !== "capped" &&
    trick.kind !== "midrib" &&
    trick.kind !== "stores" &&
    trick.kind !== "alveoli" &&
    trick.kind !== "foundation"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "tessera") {
    if (next.t < TESSERA_HOLD) {
      const pose = tesseraPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < TESSERA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - TESSERA_HOLD);
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
  if (next.kind === "festoon") pose = festoonPose(next.t, fromX, trick.facing);
  else if (next.kind === "capped") pose = cappedPose(next.t, fromX, trick.facing);
  else if (next.kind === "midrib") pose = midribPose(next.t, fromX, trick.facing);
  else if (next.kind === "stores") pose = storesPose(next.t, fromX, trick.facing);
  else if (next.kind === "alveoli") pose = alveoliPose(next.t, fromX, trick.facing);
  else pose = foundationPose(next.t, fromX, trick.facing);
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
    TESSERA_HOLD,
    RELEASE_S,
    canStart,
    shouldAbort,
    nextTrickWait,
    pickTrick,
    sleepHoldFrame,
    beginTrick,
    tesseraPose,
    releasePose,
    festoonPose,
    cappedPose,
    midribPose,
    storesPose,
    alveoliPose,
    foundationPose,
    stepTrick,
    happyCanStart,
    happyShouldAbort,
    wantsThankYou,
    startThankYou,
    pickHappy,
    beginHappy,
    langstrothPose,
    topbarPose,
    warrePose,
    stepHappy
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetHoneycombTricks = api;
})(typeof window !== "undefined" ? window : globalThis);
