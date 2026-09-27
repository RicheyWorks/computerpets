/** Keep ground tricks while idle — ultra-polish pass. House neighborly Western honey bee queen — tooting / retinue / duel / royal / spermatheca / queenmark / regina personality (tooting queen piping thorax vibration on the blotter — never named figure (Comb) / waggle (Comb window) / holoptic (Hum) / buzz (Relay) / dance (Rui) / hum (Hum ethogram/guest) / sonicate (Thrum), retinue settle as if a worker court attends — never named congregation (Hum) / commune (Sheen) / gallery (Column) / nest (Clip + Column window) / hive (Comb) / circle (Disc) / bank (Lula + Bank guest) / pheromone (Column), duel rival-queen clash posture — never named brood (guest Brood/cicada) / sortie (Hum) / emerge (Cicada) / egress (Cicada + Thrum) / cast (Cicada) / harden (Cicada) / spring (Cat + Mortar) / hover (Sepia + ethogram), royal royal-jelly receive/thank motion — never named ocellus (Hum) / salt (Sheen) / lustre (Sheen) / shine (Ember) / sheen (Disk) / glint (Coin) / gleam (Ground happy) / fovea (Bank) / nectar (Disk) / pollen (Moth happy), spermatheca iconic Apis mellifera queen lifelong sperm-store settle on the blotter (not royal jelly thank / tooting / Hum sortie mating-flight / Comb hive / nuptial taken elsewhere), queenmark iconic queen mandibular pheromone (QMP) blotter mark that keeps the colony queenright (not Column pheromone trail / Comb nasonov / Hum congregation / Sheen salt / Bank fovea / Disk sheen), regina long hold desk life as Apis mellifera queen with caucasica / iberiensis cousins in the thank-yous — never named mellifera (Hum drone hold) / hive (Comb) / andrena (Bank) / keep as a trick kind; guest slug Keep only for isKey matching). Spermatheca is the iconic lifelong sperm receptacle settle (not royal). Queenmark is the iconic QMP desk mark (not Column pheromone). Window-play LAY unchanged — never names lay as a trick. Ethogram keeps regina sit_hold; adds tooting/retinue/duel/royal/spermatheca/queenmark softs + freeze (replaces thin lay/walk/still — window LAY owns lay; walk retired). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via honey_queen.wav. Thank-yous caucasica / iberiensis / apini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `honey_queen-tricks.js`. True house-queen desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen/mining_bee/Bank or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids lay/walk/still/hive/mellifera/holoptic/congregation/ocellus/figure/corbicula/nasonov/dronepatrol/eyemeet/floccus/dufourline/metallictilt/nestmound name collisions. Bird ultra + denser guests done; skip Rui + birds. Sheen/Hum already dens; skip them. Bank now owns floccus/dufourline dens; Comb owns ocelli/nasonov dens; Hum owns dronepatrol/eyemeet dens. REGINA_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: none — house-wide ultra after bees complete (Wax already dens; skip Rui). Catalog 221. No cry inventing beyond house honey_queen.wav prefer. Never retouch Rui sprites. No lay, not window LAY. No walk, not retired ethogram. No still, not retired ethogram. */

export const TRICK_KEY = "honey_queen";
export const TRICKS = ["tooting", "retinue", "duel", "royal", "spermatheca", "queenmark", "regina"] as const;
export const HAPPY = ["caucasica", "iberiensis", "apini"] as const;
export type HoneyQueenTrickKind = (typeof TRICKS)[number];
export type HoneyQueenHappyKind = (typeof HAPPY)[number];
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

export type HoneyQueenTrick = {
  kind: HoneyQueenTrickKind;
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

export type HoneyQueenHappy = {
  kind: HoneyQueenHappyKind;
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

export const HAPPY_DUR: Record<HoneyQueenHappyKind, number> = {
  caucasica: 1.74,
  iberiensis: 1.86,
  apini: 1.78,
};

/** Regina hold — Keep parks Apis mellifera queen calm on the blotter. Not window-play LAY. */
export const REGINA_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<HoneyQueenTrickKind, number> = {
  regina: REGINA_HOLD + RELEASE_S,
  tooting: 2.46,
  retinue: 2.48,
  duel: 2.42,
  royal: 2.44,
  spermatheca: 2.52,
  queenmark: 2.48,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HoneyQueenTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "regina") return 38 + roll * 24;
  if (kind === "spermatheca" || kind === "queenmark" || kind === "tooting") return 12 + roll * 9;
  if (kind === "retinue" || kind === "duel" || kind === "royal") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HoneyQueenTrickKind | string | null) {
  if (musicOn) return "regina" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "regina") {
    if (roll < 0.18) return "tooting" as const;
    if (roll < 0.34) return "retinue" as const;
    if (roll < 0.5) return "duel" as const;
    if (roll < 0.66) return "royal" as const;
    if (roll < 0.83) return "spermatheca" as const;
    return "queenmark" as const;
  }
  if (lastKind === "tooting") {
    if (roll < 0.16) return "regina" as const;
    if (roll < 0.32) return "retinue" as const;
    if (roll < 0.48) return "duel" as const;
    if (roll < 0.64) return "royal" as const;
    if (roll < 0.82) return "spermatheca" as const;
    return "queenmark" as const;
  }
  if (lastKind === "retinue") {
    if (roll < 0.16) return "regina" as const;
    if (roll < 0.32) return "tooting" as const;
    if (roll < 0.48) return "duel" as const;
    if (roll < 0.64) return "royal" as const;
    if (roll < 0.82) return "spermatheca" as const;
    return "queenmark" as const;
  }
  if (roll < 0.14) return "regina" as const;
  if (roll < 0.28) return "tooting" as const;
  if (roll < 0.42) return "retinue" as const;
  if (roll < 0.56) return "duel" as const;
  if (roll < 0.7) return "royal" as const;
  if (roll < 0.85) return "spermatheca" as const;
  return "queenmark" as const;
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
  return key === TRICK_KEY || key === "keep";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HoneyQueenHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as HoneyQueenHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HoneyQueenHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: HoneyQueenHappyKind | string, x: number, facing: 1 | -1): HoneyQueenHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as HoneyQueenHappyKind) : "caucasica";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "caucasica" ? "talk" : name === "iberiensis" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function caucasicaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.caucasica));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.4, rot: s * 9.5, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const tick = Math.sin(t * 13.1) + 0.26 * Math.sin(t * 26.4);
    return {
      lift: 2.4 + Math.abs(tick) * 1.15,
      rot: 9.5 + tick * 6.2,
      dx: tick * 0.55,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 1.1 * (1 - s), rot: 3.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function iberiensisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.iberiensis));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 3.0, rot: s * -11.5, dx: s * 0.4, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 5.7) + 0.24 * Math.sin(t * 11.4);
    return {
      lift: 3.0 + Math.abs(flash) * 1.35,
      rot: -11.5 + flash * 8.5,
      dx: flash * 0.7,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.2 * (1 - s), rot: -4.0 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function apiniPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.apini));
  const breath = Math.sin(t * 0.55) + 0.2 * Math.sin(t * 1.4);
  if (u < 0.82) {
    return {
      lift: 1.6 + Math.abs(breath) * 0.85,
      rot: breath * 4.8,
      dx: breath * 0.35,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 1.4 * (1 - s), rot: 2.0 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function stepHappy(happy: HoneyQueenHappy, dt: number, flags: TrickFlags): HoneyQueenHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HoneyQueenHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  const pose =
    next.kind === "caucasica"
      ? caucasicaPose(next.t)
      : next.kind === "iberiensis"
        ? iberiensisPose(next.t)
        : apiniPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.x = next.fromX + (pose.dx || 0) * next.facing;
  next.anim = pose.anim;
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: HoneyQueenTrickKind, x: number, facing: 1 | -1): HoneyQueenTrick {
  const anim: TrickAnim =
    kind === "regina"
      ? "sit"
      : kind === "tooting"
        ? "play"
        : kind === "retinue"
          ? "talk"
          : kind === "duel"
            ? "talk"
            : kind === "royal"
              ? "sit"
              : kind === "spermatheca"
                ? "play"
                : kind === "queenmark"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "regina" ? "hold" : "go",
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

export function reginaPose(t: number) {
  const breath = Math.sin(t * 0.22) + 0.08 * Math.sin(t * 0.71);
  const grit = Math.abs(Math.sin(t * 0.31));
  return {
    lift: 1.15 + grit * 0.55,
    rot: -1.6 + breath * 2.4,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.15 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -1.6 * (1 - u) };
}

export function tootingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tooting));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * 8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.14) / 0.58;
    const bite = Math.sin(s * Math.PI * 5.2);
    const deepen = smoothstep(s);
    return {
      x: fromX + facing * deepen * 0.7,
      lift: 2.6 + Math.abs(bite) * 1.4 + deepen * 0.6,
      rot: facing * (8 + bite * 7.5),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.35 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: facing * (3.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function retinuePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.retinue));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * -9 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.58) {
    const s = (u - 0.14) / 0.44;
    const pack = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (0.55 + Math.abs(pack) * 0.45),
      lift: 2.7 + Math.abs(pack) * 1.35,
      rot: facing * (-9 + pack * 8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.58) / 0.3;
    const press = smoothstep(s);
    return {
      x: fromX + facing * 0.85,
      lift: 2.4 - press * 0.7,
      rot: facing * (4.5 - press * 6.5),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + facing * 0.45 * (1 - s),
    lift: 1.1 * (1 - s),
    rot: facing * (1.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function duelPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.duel));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.2, rot: s * 6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.18) / 0.52;
    const rise = smoothstep(s);
    const shake = Math.sin(s * Math.PI * 4.4);
    return {
      x: fromX + facing * shake * 0.65,
      lift: 2.4 + rise * 1.6 + Math.abs(shake) * 0.9,
      rot: facing * (6 + shake * 9 + rise * 4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * (3.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function royalPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.royal));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.3, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.16) / 0.68;
    const glance = Math.sin(s * Math.PI * 2.55);
    const velour = Math.sin(s * Math.PI * 5.4) * 0.35;
    return {
      x: fromX + facing * glance * 0.5,
      lift: 2.35 + Math.abs(velour) * 1.1,
      rot: facing * (-8 + glance * 7.5 + velour * 4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 1.15 * (1 - s),
    rot: facing * (-2.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function spermathecaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spermatheca));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.1, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const store = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * store * 0.55,
      lift: 3.0 + Math.abs(store) * 1.5,
      rot: facing * (10 + store * 8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const seal = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (0.5 + seal * 0.3),
      lift: 3.5 + Math.abs(seal) * 0.95,
      rot: facing * (13 - s * 2 + seal * 4),
      anim: "play" as TrickAnim,
    };
  }
  {
    const s = (u - 0.84) / 0.16;
    return {
      x: fromX,
      lift: 2.8 * (1 - s),
      rot: facing * (5.5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
}

export function queenmarkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.queenmark));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * -1.3, rot: s * -6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.5) {
    const s = smoothstep((u - 0.14) / 0.36);
    return {
      x: fromX + facing * s * 1.15,
      lift: -0.9 + s * 3.5,
      rot: facing * (-6 + s * 13),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.5) / 0.34;
    const mark = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (1.15 + mark * 0.4),
      lift: 2.7 + Math.abs(mark) * 1.25,
      rot: facing * (6.5 + mark * 5.5),
      anim: "talk" as TrickAnim,
    };
  }
  {
    const s = (u - 0.84) / 0.16;
    return {
      x: fromX + facing * (1.0 * (1 - s * 0.35)),
      lift: 1.2 * (1 - s),
      rot: facing * (2.5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
}

export function stepTrick(trick: HoneyQueenTrick, dt: number, flags: TrickFlags): HoneyQueenTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "tooting" &&
    trick.kind !== "retinue" &&
    trick.kind !== "duel" &&
    trick.kind !== "royal" &&
    trick.kind !== "spermatheca" &&
    trick.kind !== "queenmark"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HoneyQueenTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "regina") {
    if (next.t < REGINA_HOLD) {
      const pose = reginaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < REGINA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - REGINA_HOLD);
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
  if (next.kind === "tooting") {
    const pose = tootingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "retinue") {
    const pose = retinuePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "duel") {
    const pose = duelPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "royal") {
    const pose = royalPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "spermatheca") {
    const pose = spermathecaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = queenmarkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
