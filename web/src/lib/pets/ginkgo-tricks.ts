/** Fan ground tricks while idle — ultra-polish pass. House ginkgo — biloba / notch / flutter / drop / amber / dichotomy / petiole personality (two-lobed biloba fan leaf open — never named fan (Parrot owns fan) / lobe (Kite owns lobe) / frond (Vein owns frond), apical notch tip settle, flutter fall as flutter — never named lean (Felt window owns lean) / unfurl (Vein window owns unfurl) / nod (Sol owns nod) / gold (Fan window owns gold), soft golden drop to blotter, living-fossil amber calm desk life under the lamp, dichotomous vein-fork shimmer as dichotomy — never named fork (taken) / venation collision with Vein name / midrib (taken), slender leaf-stalk petiole flex (species-true ginkgo petiole — never named stipe (Vein owns stipe) / rachis (Vein) / root (Burr) / rhizoid (Felt)); not Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Dichotomy is the species-true forking leaf-vein polish (not Vein name, not fork token). Petiole is the iconic long slender stalk flex (not Vein stipe, not Burr root). Window-play GOLD unchanged — never names gold as a trick. Ethogram keeps amber sit_hold; adds biloba/notch/flutter/drop/dichotomy/petiole softs + freeze (replaces thin lean/nod/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via ginkgo.wav. Thank-yous ochre / gilt / linger. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `ginkgo-tricks.js`. True house-ginkgo desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids fan/gold/lean/unfurl/nod/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/fork/midrib/fossil/root name collisions. Bird ultra (Soot→Ember) + Miso→Vein done; skip Rui + birds. Amplitudes raised toward Rui richness; denser waits/weights (AMBER_HOLD=11.2 RELEASE_S=1.18). Next leftover Mast / oak. No cry inventing beyond house ginkgo.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "ginkgo";
export const TRICKS = ["biloba", "notch", "flutter", "drop", "amber", "dichotomy", "petiole"] as const;
export const HAPPY = ["ochre", "gilt", "linger"] as const;
export type GinkgoTrickKind = (typeof TRICKS)[number];
export type GinkgoHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "done";
export type HappyPhase = "go" | "done";

export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
  windowPlay?: boolean;
  card?: boolean;
};

export type GinkgoTrick = {
  kind: GinkgoTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export type GinkgoHappy = {
  kind: GinkgoHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX: number;
  abort?: boolean;
};

export const HAPPY_DUR: Record<GinkgoHappyKind, number> = {
  ochre: 1.28,
  gilt: 1.16,
  linger: 1.22,
};

/** Amber hold — Fan parks living-fossil calm on the blotter. Not window-play GOLD. */
export const AMBER_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<GinkgoTrickKind, number> = {
  amber: AMBER_HOLD + RELEASE_S,
  biloba: 1.58,
  notch: 1.48,
  flutter: 1.64,
  drop: 1.56,
  dichotomy: 1.68,
  petiole: 1.72,
};

export function canStart(state: TrickFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: TrickFlags | undefined) {
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: GinkgoTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "amber") return 40 + roll * 26;
  if (kind === "dichotomy" || kind === "petiole") return 12.8 + roll * 9.4;
  if (kind === "biloba" || kind === "notch" || kind === "flutter") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: GinkgoTrickKind | string | null): GinkgoTrickKind {
  if (musicOn) return "amber";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "amber" ? 0.72 : k === "dichotomy" || k === "petiole" ? 1.28 : k === "biloba" || k === "notch" || k === "flutter" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "biloba";
}

export function happyCanStart(state: TrickFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function happyShouldAbort(state: TrickFlags | undefined) {
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

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "fan";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: GinkgoHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as GinkgoHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: GinkgoHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: GinkgoHappyKind | string, x: number, facing: 1 | -1): GinkgoHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as GinkgoHappyKind) : "ochre";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "ochre" ? "talk" : name === "gilt" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function ochrePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ochre));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const warm = Math.sin(t * 1.72);
    return {
      lift: 3.36 + Math.abs(warm) * 1.68,
      rot: 14.4 + warm * 12,
      dx: warm * 0.144,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function giltPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.gilt));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 3.6, rot: s * -12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 2.05);
    return {
      lift: 3.6 + Math.abs(flash) * 1.8,
      rot: -12 + flash * 16.8,
      dx: flash * 0.168,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.4 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function lingerPose(t: number) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
    rot: Math.sin(t * 0.864) * 9.6,
    dx: Math.sin(t * 0.48) * -0.144,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: GinkgoHappy, dt: number, flags: TrickFlags): GinkgoHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GinkgoHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "ochre") {
    const pose = ochrePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gilt") {
    const pose = giltPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = lingerPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: GinkgoTrickKind, x: number, facing: 1 | -1): GinkgoTrick {
  const anim: TrickAnim =
    kind === "amber"
      ? "sit"
      : kind === "biloba"
        ? "sit"
        : kind === "notch"
          ? "talk"
          : kind === "flutter"
            ? "play"
            : kind === "drop"
              ? "talk"
              : kind === "dichotomy"
                ? "play"
                : kind === "petiole"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "amber" ? "hold" : "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function amberPose(t: number) {
  const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
  return {
    lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
    rot: 4.8 + breath * 7.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  const s = smoothstep(u);
  return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4.8 * (1 - s) };
}

/** Biloba — two-lobed leaf open. Not parrot fan. Not Vein frond. */
export function bilobaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.biloba));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.12, rot: s * -12 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    const split = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX + facing * Math.abs(split) * 0.42,
      lift: 3.12 + Math.abs(split) * 1.92,
      rot: facing * (-12 + split * 16.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.16 * (1 - s),
    rot: facing * (-7.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Notch — apical notch tip settle. Not Sol nod. */
export function notchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.notch));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.88, rot: s * 16.8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const tip = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * tip * 0.48,
      lift: 2.88 + Math.abs(tip) * 1.68,
      rot: facing * (16.8 + tip * 14.4),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.6,
      lift: 3.84 - settle * 1.44,
      rot: facing * (16.8 - settle * 19.2),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * (-3.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Flutter — soft flutter fall. Never named lean/unfurl/gold. */
export function flutterPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.flutter));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 5.04, rot: s * 9.6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    const fall = Math.sin(s * Math.PI * 6.4);
    const descend = s * 2.4;
    return {
      x: fromX + facing * fall * 0.54,
      lift: 5.04 - descend + Math.abs(fall) * 0.96,
      rot: facing * (9.6 + fall * 14.4 - s * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.24 * (1 - s),
    lift: 1.92 * (1 - s),
    rot: facing * (-4.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Drop — soft golden leaf drop to blotter. Never named gold. */
export function dropPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.drop));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.84, rot: s * -9.6 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const hang = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * hang * 0.42,
      lift: 3.84 - s * 0.96 + Math.abs(hang) * 0.72,
      rot: facing * (-9.6 + hang * 14.4),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const land = smoothstep(s);
    return {
      x: fromX + facing * (1 - land) * 0.48,
      lift: 2.88 * (1 - land * 1.02),
      rot: facing * (-4.8 + land * 9.6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 0.96 * (1 - s),
    rot: facing * (3.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Dichotomy — dichotomous vein-fork shimmer through the lamina. Not Vein name. Not fork token. */
export function dichotomyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dichotomy));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.16, rot: s * -9.6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const shimmer = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 0.72 + shimmer * 0.24),
      lift: 2.16 + Math.abs(shimmer) * 1.92,
      rot: facing * (-9.6 + shimmer * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const hold = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * 0.72,
      lift: 3.36 + Math.abs(hold) * 0.96,
      rot: facing * (4.8 + hold * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.72 * (1 - s),
    lift: 2.16 * (1 - s) + s * 0.24,
    rot: facing * (4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Petiole — long slender leaf-stalk flex. Not Vein stipe. Not Burr root. Not Felt rhizoid. */
export function petiolePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.petiole));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const flex = smoothstep(s);
    return {
      x: fromX + facing * flex * 0.6,
      lift: 3.12 + flex * 2.88,
      rot: facing * (12 + flex * 9.6),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const sway = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (0.6 + sway * 0.36),
      lift: 5.76 + Math.abs(sway) * 0.96,
      rot: facing * (7.2 + sway * 16.8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.6 * (1 - s),
    lift: 3.12 * (1 - s),
    rot: facing * (7.2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: GinkgoTrick, dt: number, flags: TrickFlags): GinkgoTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "biloba" &&
    trick.kind !== "notch" &&
    trick.kind !== "flutter" &&
    trick.kind !== "drop" &&
    trick.kind !== "dichotomy" &&
    trick.kind !== "petiole"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: GinkgoTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "amber") {
    if (next.t < AMBER_HOLD) {
      const pose = amberPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < AMBER_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - AMBER_HOLD);
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
  if (next.kind === "biloba") pose = bilobaPose(next.t, fromX, trick.facing);
  else if (next.kind === "notch") pose = notchPose(next.t, fromX, trick.facing);
  else if (next.kind === "flutter") pose = flutterPose(next.t, fromX, trick.facing);
  else if (next.kind === "drop") pose = dropPose(next.t, fromX, trick.facing);
  else if (next.kind === "dichotomy") pose = dichotomyPose(next.t, fromX, trick.facing);
  else pose = petiolePose(next.t, fromX, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
