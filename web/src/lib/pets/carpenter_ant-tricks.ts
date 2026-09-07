/** Column ground tricks while idle. House carpenter ant — gallery / pheromone / crumb / bustle / camponotus personality (gallery wood-tunnel mandible work on the blotter — never named column (Moth orchid owns column) / nest (window NEST + Clip) / chew / bore (carpenter bee window) / dig / gnaw (beaver) / trail (Pulse) / road / scent / carry, pheromone scent-road dab — never named trail (Pulse) / scent / road / mark / waggle (Comb window) / figure (Comb) / dance (Rui) / buzz (Relay), crumb food-haul lift — never named carry / forage (bumblebee window) / cheek (Clip) / pocket (Clip) / pollen (Moth happy) / nectar (Disk) / honey (Comb happy), bustle nest-chamber hurry — never named nest / hive (Comb) / scurry (Clip) / scuttle (Tenant) / amble (Bloom) / crawl (Cling) / tread (Twig) / walk (ethogram), camponotus desk life as a Camponotus pennsylvanicus Black Carpenter Ant week; not Twig / Dart / Spark / Ghost / Milk / Comb / Felt / Mast / Jade / Sol / Clip / Tenant / Pulse / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play NEST do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop carpenter_ant-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig or *Dragon electrical clone. Window-play NEST unchanged — never names nest. Ethogram nest/trail/still unchanged. Twig owns rocking/catalepsy/browse/tread/diapheromera and happy femorata/instar/crypsis; Dart owns hawking/tandem/nymph/whir/anax and happy junius/labium/exuvia; Spark owns lantern/jstroke/semaphore/elytra/photinus; Ghost owns plumose/lunule/silk/stream/actias; Milk owns asclepias/oyamel/warning/chrysalis/danaus; Comb owns figure/corbicula/hex/proboscis/hive; Moth owns column; Pulse owns trail; Clip owns nest/scurry; Tenant owns antenna/scuttle; Rui owns dance; Relay owns buzz. Formicidae Camponotus desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "carpenter_ant";
export const TRICKS = ["gallery", "pheromone", "crumb", "bustle", "camponotus"] as const;
export const HAPPY = ["pennsylvanicus", "honeydew", "formicine"] as const;
export type CarpenterAntTrickKind = (typeof TRICKS)[number];
export type CarpenterAntHappyKind = (typeof HAPPY)[number];
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

export type CarpenterAntTrick = {
  kind: CarpenterAntTrickKind;
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

export type CarpenterAntHappy = {
  kind: CarpenterAntHappyKind;
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

export const HAPPY_DUR = { pennsylvanicus: 1.22, honeydew: 1.34, formicine: 1.28 } as const;
export const CAMPONOTUS_HOLD = 13.6;
export const RELEASE_S = 0.76;
export const DUR = { camponotus: CAMPONOTUS_HOLD + RELEASE_S, gallery: 1.58, pheromone: 1.64, crumb: 1.52, bustle: 1.46 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CarpenterAntTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "camponotus") return 52 + roll * 32;
  if (kind === "gallery") return 16 + roll * 12;
  if (kind === "pheromone") return 15 + roll * 11;
  return justFinished ? 10.6 + roll * 8 : 5.5 + roll * 6.8;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CarpenterAntTrickKind | string | null) {
  if (musicOn) return "camponotus";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "camponotus") {
    if (roll < 0.26) return "gallery";
    if (roll < 0.5) return "pheromone";
    if (roll < 0.74) return "crumb";
    return "bustle";
  }
  if (lastKind === "gallery") {
    if (roll < 0.26) return "camponotus";
    if (roll < 0.5) return "pheromone";
    if (roll < 0.74) return "crumb";
    return "bustle";
  }
  if (lastKind === "pheromone") {
    if (roll < 0.22) return "camponotus";
    if (roll < 0.44) return "gallery";
    if (roll < 0.68) return "crumb";
    return "bustle";
  }
  if (roll < 0.2) return "camponotus";
  if (roll < 0.4) return "gallery";
  if (roll < 0.6) return "pheromone";
  if (roll < 0.8) return "crumb";
  return "bustle";
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
  return key === TRICK_KEY || key === "column";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CarpenterAntHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CarpenterAntHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CarpenterAntHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CarpenterAntHappyKind | string, x: number, facing: 1 | -1): CarpenterAntHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CarpenterAntHappyKind) : "pennsylvanicus";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "pennsylvanicus" ? "play" : name === "honeydew" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function pennsylvanicusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pennsylvanicus));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 0.04, rot: s * 2.4, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const rock = Math.sin(t * 3.4) + 0.22 * Math.sin(t * 6.8);
    return {
      lift: 0.04 + Math.abs(rock) * 0.018,
      rot: 2.4 + rock * 2.6,
      dx: rock * 0.004,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 0.02 * (1 - s), rot: 1.0 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function honeydewPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.honeydew));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 0.055, rot: s * -1.8, dx: s * 0.006, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const shed = Math.sin(t * 4.2) + 0.3 * Math.sin(t * 9.1);
    return {
      lift: 0.055 + Math.abs(shed) * 0.035,
      rot: -1.8 + shed * 3.4,
      dx: shed * 0.007,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.03 * (1 - s), rot: -0.7 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function formicinePose(t: number) {
  return {
    lift: 0.008 + Math.abs(Math.sin(t * 0.42)) * 0.012,
    rot: Math.sin(t * 0.55) * 0.9,
    dx: Math.sin(t * 0.28) * 0.002,
    anim: "sit" as TrickAnim,
  };
}
export function stepHappy(happy: CarpenterAntHappy, dt: number, flags: TrickFlags): CarpenterAntHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CarpenterAntHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "pennsylvanicus") {
    const pose = pennsylvanicusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "honeydew") {
    const pose = honeydewPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = formicinePose(next.t);
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

export function beginTrick(kind: CarpenterAntTrickKind, x: number, facing: 1 | -1): CarpenterAntTrick {
  const anim: TrickAnim =
    kind === "camponotus"
    ? "sit"
    : kind === "gallery"
      ? "sit"
      : kind === "pheromone"
        ? "walk"
        : kind === "crumb"
          ? "walk"
          : kind === "bustle"
            ? "walk"
              : "sit";
  return {
    kind: kind,
    phase: kind === "camponotus" ? "hold" : "go",
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

export function camponotusPose(t: number) {
  const breath = Math.sin(t * 0.16) + 0.03 * Math.sin(t * 0.72);
  const grain = Math.abs(Math.sin(t * 0.34));
  return {
    lift: 0.014 + grain * 0.01,
    rot: 0.22 + breath * 0.55,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.016 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.22 * (1 - u) };
}

export function galleryPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gallery));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * -0.018, rot: s * -2.8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.14) / 0.68;
    const chew = Math.sin(s * Math.PI * 7.2) + 0.28 * Math.sin(s * Math.PI * 12.4);
    return {
      x: fromX + facing * chew * 0.005,
      lift: -0.018 + Math.abs(chew) * 0.028,
      rot: facing * (-2.8 + chew * 3.6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: -0.01 * (1 - s),
    rot: facing * (-1.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function pheromonePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pheromone));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.022, rot: s * 1.6 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const s = (u - 0.12) / 0.68;
    const dab = Math.sin(s * Math.PI * 4.6);
    const step = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * (0.07 * s + step * 0.01),
      lift: 0.022 + Math.max(0, -dab) * 0.03 + Math.abs(step) * 0.012,
      rot: facing * (1.6 + dab * 2.2 + step * 1.4),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + facing * 0.055 * (1 - s * 0.3),
    lift: 0.016 * (1 - s),
    rot: facing * (0.7 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function crumbPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crumb));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.055, rot: s * -1.8 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const haul = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (0.065 * s + haul * 0.008),
      lift: 0.055 + Math.abs(haul) * 0.02,
      rot: facing * (-1.8 + haul * 2.4),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.05 * (1 - s * 0.35),
    lift: 0.03 * (1 - s),
    rot: facing * (-0.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function bustlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bustle));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 0.035, rot: s * 2.2 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.1) / 0.74;
    const zig = Math.sin(s * Math.PI * 5.4) + 0.35 * Math.sin(s * Math.PI * 9.2);
    return {
      x: fromX + facing * (0.04 * Math.sin(s * Math.PI) + zig * 0.018),
      lift: 0.035 + Math.abs(zig) * 0.025,
      rot: facing * (2.2 + zig * 3.8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * 0.012 * (1 - s),
    lift: 0.02 * (1 - s),
    rot: facing * (0.9 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function stepTrick(trick: CarpenterAntTrick, dt: number, flags: TrickFlags): CarpenterAntTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "gallery" && trick.kind !== "pheromone" && trick.kind !== "crumb" && trick.kind !== "bustle") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CarpenterAntTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "camponotus") {
    if (next.t < CAMPONOTUS_HOLD) {
      const pose = camponotusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CAMPONOTUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CAMPONOTUS_HOLD);
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
  if (next.kind === "gallery") {
    const pose = galleryPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pheromone") {
    const pose = pheromonePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "crumb") {
    const pose = crumbPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bustlePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
