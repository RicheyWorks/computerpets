/** Fold ground tricks while idle — ultra-polish pass. House Chinese mantis — raptorial / gimbal / snatch / pendulum / mantodea / ootheca / deimatic personality (raptorial foreleg prayer-wait hold on the blotter — never named fold (Vesper + ethogram-old) / pray (window PRAY) / wait (Pip) / still (ethogram-old) / freeze (Twig window) / poise (Snap) / guard (Vesper), gimbal head-swivel scan — never named swivel (Anchor) / nod (Sol) / peer (Keel) / glance (Sepia happy) / look / turn, snatch raptorial strike lunge — never named strike (ethogram-old) / snap (Fuse happy + Snap guest) / clamp (Snap) / seize (robber fly window) / pounce (Miso) / hunt (ethogram-old + Haste window) / mouser (Rue) / stalk (Rue), pendulum wind-sway camouflage rock — never named sway (Jade) / rocking (Twig) / catalepsy (Twig) / lean / flutter (Fan) / bob / hover, mantodea desk life as a Tenodera sinensis Chinese Mantis week, ootheca foam egg-case press settle (species-true Tenodera ootheca — never named nest (Column window + Clip) / egg / clutch / foam / case / brood (Brood guest) / deposit), deimatic deimatic startle wing-flash (species-true mantid threat display — never named flash (Quill) / warning (Milk) / semaphore (Spark) / elytra (Spark) / soar / rise / hover / flare (Coin) / startle / threat / wing (Kite)); not Seven spots/aphid/reflex/climb/coccinella/pronotum/alar, Column gallery/pheromone/crumb/bustle/camponotus/trophallaxis/frass, Twig rocking/catalepsy/browse/tread/diapheromera, Dart hawking/tandem/nymph/whir/anax, Spark lantern/jstroke/semaphore/elytra/photinus, Ghost plumose/lunule/silk/stream/actias, Milk asclepias/oyamel/warning/chrysalis/danaus, Comb figure/corbicula/hex/proboscis/hive, Snap clamp/poise, Jade sway, Anchor swivel, Pip wait, Vesper fold/guard, Quill flash, Kite wing, or *Dragon copies). Ootheca is the iconic Tenodera foam egg-case press (not Column nest, not Brood). Deimatic is the iconic startle wing-flash (not Quill flash, not Milk warning, not Spark semaphore). Window-play PRAY unchanged — never names pray/fold. Ethogram keeps mantodea sit_hold; adds raptorial/gimbal/snatch/pendulum/ootheca/deimatic softs + freeze (replaces thin fold/strike/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via mantis.wav. Thank-yous sinensis / tenodera / mantidae. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `mantis-tricks.js`. True house-mantis desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven or *Dragon electrical clone. Next guest ultra is Choir / choir. Mantodea Tenodera desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "mantis";
export const TRICKS = ["raptorial", "gimbal", "snatch", "pendulum", "mantodea", "ootheca", "deimatic"] as const;
export const HAPPY = ["sinensis", "tenodera", "mantidae"] as const;
export type MantisTrickKind = (typeof TRICKS)[number];
export type MantisHappyKind = (typeof HAPPY)[number];
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

export type MantisTrick = {
  kind: MantisTrickKind;
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

export type MantisHappy = {
  kind: MantisHappyKind;
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

export const HAPPY_DUR: Record<MantisHappyKind, number> = {
  sinensis: 1.26,
  tenodera: 1.34,
  mantidae: 1.3,
};
export const MANTODEA_HOLD = 11.4;
export const RELEASE_S = 0.64;
export const DUR: Record<MantisTrickKind, number> = {
  mantodea: MANTODEA_HOLD + RELEASE_S,
  raptorial: 1.58,
  gimbal: 1.52,
  snatch: 1.48,
  pendulum: 1.62,
  ootheca: 1.6,
  deimatic: 1.54,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MantisTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "mantodea") return 40 + roll * 24;
  if (kind === "ootheca" || kind === "deimatic" || kind === "raptorial") return 12 + roll * 9;
  if (kind === "gimbal" || kind === "snatch" || kind === "pendulum") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MantisTrickKind | string | null) {
  if (musicOn) return "mantodea" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "mantodea") {
    if (roll < 0.16) return "raptorial" as const;
    if (roll < 0.32) return "gimbal" as const;
    if (roll < 0.48) return "snatch" as const;
    if (roll < 0.64) return "pendulum" as const;
    if (roll < 0.82) return "ootheca" as const;
    return "deimatic" as const;
  }
  if (lastKind === "raptorial") {
    if (roll < 0.18) return "mantodea" as const;
    if (roll < 0.34) return "gimbal" as const;
    if (roll < 0.5) return "snatch" as const;
    if (roll < 0.66) return "pendulum" as const;
    if (roll < 0.83) return "ootheca" as const;
    return "deimatic" as const;
  }
  if (lastKind === "gimbal") {
    if (roll < 0.16) return "mantodea" as const;
    if (roll < 0.32) return "raptorial" as const;
    if (roll < 0.48) return "snatch" as const;
    if (roll < 0.64) return "pendulum" as const;
    if (roll < 0.82) return "ootheca" as const;
    return "deimatic" as const;
  }
  if (lastKind === "ootheca" || lastKind === "deimatic") {
    if (roll < 0.16) return "mantodea" as const;
    if (roll < 0.32) return "raptorial" as const;
    if (roll < 0.48) return "gimbal" as const;
    if (roll < 0.64) return "snatch" as const;
    if (roll < 0.8) return "pendulum" as const;
    return lastKind === "ootheca" ? ("deimatic" as const) : ("ootheca" as const);
  }
  if (roll < 0.14) return "mantodea" as const;
  if (roll < 0.28) return "raptorial" as const;
  if (roll < 0.42) return "gimbal" as const;
  if (roll < 0.56) return "snatch" as const;
  if (roll < 0.7) return "pendulum" as const;
  if (roll < 0.85) return "ootheca" as const;
  return "deimatic" as const;
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
  return key === TRICK_KEY || key === "fold";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MantisHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MantisHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MantisHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MantisHappyKind | string, x: number, facing: 1 | -1): MantisHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MantisHappyKind) : "sinensis";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "sinensis" ? "play" : name === "tenodera" ? "talk" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function sinensisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sinensis));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.9, rot: s * 12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const rock = Math.sin(t * 3.2) + 0.22 * Math.sin(t * 6.4);
    return {
      lift: 2.9 + Math.abs(rock) * 1.35,
      rot: 12 + rock * 10,
      dx: rock * 0.18,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function tenoderaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tenodera));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 3.2, rot: s * -9.5, dx: s * 0.2, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const scan = Math.sin(t * 4.0) + 0.26 * Math.sin(t * 7.6);
    return {
      lift: 3.2 + Math.abs(scan) * 1.4,
      rot: -9.5 + scan * 9,
      dx: scan * 0.22,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.1 * (1 - s), rot: -4.5 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function mantidaePose(t: number) {
  return {
    lift: 2.1 + Math.abs(Math.sin(t * 0.4)) * 0.85,
    rot: Math.sin(t * 0.52) * 6.5,
    dx: Math.sin(t * 0.28) * 0.08,
    anim: "sit" as TrickAnim,
  };
}
export function stepHappy(happy: MantisHappy, dt: number, flags: TrickFlags): MantisHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MantisHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "sinensis") {
    const pose = sinensisPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tenodera") {
    const pose = tenoderaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = mantidaePose(next.t);
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

export function beginTrick(kind: MantisTrickKind, x: number, facing: 1 | -1): MantisTrick {
  const anim: TrickAnim =
    kind === "mantodea"
      ? "sit"
      : kind === "raptorial"
        ? "sit"
        : kind === "gimbal"
          ? "sit"
          : kind === "snatch"
            ? "play"
            : kind === "pendulum"
              ? "sit"
              : kind === "ootheca"
                ? "sit"
                : kind === "deimatic"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "mantodea" ? "hold" : "go",
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

export function mantodeaPose(t: number) {
  const breath = Math.sin(t * 0.16) + 0.03 * Math.sin(t * 0.72);
  const grain = Math.abs(Math.sin(t * 0.34));
  return {
    lift: 2.4 + grain * 1.1,
    rot: 3.8 + breath * 3.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 3.0 * (1 - u) };
}

export function raptorialPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.raptorial));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.85, rot: s * 11 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    const hold = Math.sin(s * Math.PI * 2.4) * 0.18;
    return {
      x: fromX + facing * hold * 0.2,
      lift: 2.85 + Math.abs(hold) * 1.2,
      rot: facing * (11 + hold * 6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * (4.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function gimbalPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gimbal));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.4, rot: s * -10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const s = (u - 0.12) / 0.72;
    const scan = Math.sin(s * Math.PI * 3.6) + 0.35 * Math.sin(s * Math.PI * 7.2);
    return {
      x: fromX + facing * scan * 0.22,
      lift: 2.4 + Math.abs(scan) * 1.15,
      rot: facing * (-10 + scan * 12),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 1.6 * (1 - s),
    rot: facing * (-4.0 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function snatchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.snatch));
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX + facing * 0.15 * s, lift: s * 2.6, rot: s * 8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.22) / 0.2;
    const lunge = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (0.15 + lunge * 1.4),
      lift: 2.6 - lunge * 1.1,
      rot: facing * (8 - lunge * 14),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.42) / 0.3;
    const grip = Math.sin(s * Math.PI * 2.2) * 0.2;
    return {
      x: fromX + facing * (1.2 + grip * 0.25),
      lift: 1.4 + Math.abs(grip) * 0.9,
      rot: facing * (-6 + grip * 5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.7 * (1 - s * 0.4),
    lift: 1.6 * (1 - s),
    rot: facing * (-2.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function pendulumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pendulum));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 2.55, rot: s * 8.5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.1) / 0.76;
    const breeze = Math.sin(s * Math.PI * 4.2) + 0.28 * Math.sin(s * Math.PI * 8.4);
    return {
      x: fromX + facing * breeze * 0.55,
      lift: 2.55 + Math.abs(breeze) * 1.3,
      rot: facing * (8.5 + breeze * 9),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: facing * (3.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function oothecaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ootheca));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.7, rot: s * -8.5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const press = Math.sin(s * Math.PI * 4.8) + 0.28 * Math.sin(s * Math.PI * 9.2);
    return {
      x: fromX + facing * press * 0.14,
      lift: 2.7 + Math.abs(press) * 1.2,
      rot: facing * (-8.5 + press * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * (-3.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function deimaticPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.deimatic));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.15, rot: s * 9 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.12) / 0.43;
    const flash = Math.sin(s * Math.PI * 7.6) + 0.32 * Math.sin(s * Math.PI * 13.4);
    return {
      x: fromX + facing * (0.4 * s + flash * 0.18),
      lift: 3.15 + s * 1.7 + Math.abs(flash) * 0.95,
      rot: facing * (9 + flash * 10),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const settle = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (0.5 + settle * 0.12),
      lift: 4.8 - s * 2.1 + Math.abs(settle) * 0.55,
      rot: facing * (7 - settle * 4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 0.32 * (1 - s),
    lift: 2.3 * (1 - s),
    rot: facing * (3 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function stepTrick(trick: MantisTrick, dt: number, flags: TrickFlags): MantisTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "raptorial" &&
    trick.kind !== "gimbal" &&
    trick.kind !== "snatch" &&
    trick.kind !== "pendulum" &&
    trick.kind !== "ootheca" &&
    trick.kind !== "deimatic"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MantisTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "mantodea") {
    if (next.t < MANTODEA_HOLD) {
      const pose = mantodeaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < MANTODEA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - MANTODEA_HOLD);
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
  if (next.kind === "raptorial") {
    const pose = raptorialPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gimbal") {
    const pose = gimbalPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "snatch") {
    const pose = snatchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pendulum") {
    const pose = pendulumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ootheca") {
    const pose = oothecaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = deimaticPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
