/** Bank ground tricks while idle. House neighborly mining bee — shaft / mass / vernal / fovea / andrena personality (shaft soil-tunnel shaft work at the sand tray — never named dig (Thimble + ethogram + window DIG) / tumulus (Sheen) / fossor (Thrum) / nest (Clip + Column window) / bank (Lula boa trick + guest slug + mining window) / furrow (Ledger) / cell (mason ethogram) / gallery (Column) / heave (Ground) / lug (Ground) / earth (Ground) / adit / mine, mass pollen-mass pack into a brood cell — never named scopa (Thrum) / corbicula (Comb) / beebread (Mortar) / parcel (Disc) / provision (Mortar comment) / loaf (Axolotl) / pollenball, vernal solitary spring emerge from the overwinter hold — never named emerge (Cicada) / egress (Cicada + Thrum) / spring (Cat + Mortar) / cast (Cicada) / harden (Cicada), fovea facial-fovea desk glance characteristic of Andrena — never named salt (Sheen) / lustre (Sheen) / shine (ethogram + Ember) / sheen (Disk) / glint (Coin) / gleam (Ground happy), andrena desk life as an Andrena vicina neighborly Andrenidae with carlini cousins in the thank-yous; not Comb / Thrum / Auger / Mortar / Disc / Pot / Sheen / Disk / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play DIG do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop mining_bee-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen or *Dragon electrical clone. Window-play DIG unchanged — never names dig. Ethogram dig/hover/still unchanged — never names dig. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Mortar owns trowel/beebread/orchard/plug/osmia and happy lignaria/cornifrons/osmiini; Disc owns circle/liner/cavity/parcel/megachile and happy rotundata/relativa/megachilini; Pot owns cerumen/spout/vessel/batumen/melipona and happy beecheii/yucatanica/meliponini; Sheen owns lustre/tumulus/salt/commune/agapostemon and happy virescens/texanus/halictini; Lula owns bank; Disk owns pad/corolla/rhizome/calyx/sheen and happy silt/nectar/dew; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Clip owns nest; Thimble owns dig; Cap owns warts; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance; Ground happy owns gleam; Coin owns glint; Ember owns shine. Andrena Andrenidae solitary ground-nest desk life only. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "mining_bee";
export const TRICKS = ["shaft", "mass", "vernal", "fovea", "andrena"] as const;
export const HAPPY = ["vicina", "carlini", "andrenini"] as const;
export type MiningBeeTrickKind = (typeof TRICKS)[number];
export type MiningBeeHappyKind = (typeof HAPPY)[number];
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

export type MiningBeeTrick = {
  kind: MiningBeeTrickKind;
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

export type MiningBeeHappy = {
  kind: MiningBeeHappyKind;
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

export const HAPPY_DUR = { vicina: 1.24, carlini: 1.3, andrenini: 1.34 } as const;
export const ANDRENA_HOLD = 14.2;
export const RELEASE_S = 0.68;
export const DUR = { andrena: ANDRENA_HOLD + RELEASE_S, shaft: 1.66, mass: 1.78, vernal: 1.52, fovea: 1.48 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MiningBeeTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "andrena") return 52 + roll * 30;
  if (kind === "shaft") return 14 + roll * 10;
  if (kind === "mass") return 18 + roll * 11;
  if (kind === "fovea") return 15 + roll * 12;
  return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MiningBeeTrickKind | string | null) {
  if (musicOn) return "andrena";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "andrena") {
    if (roll < 0.26) return "shaft";
    if (roll < 0.5) return "mass";
    if (roll < 0.74) return "vernal";
    return "fovea";
  }
  if (lastKind === "shaft") {
    if (roll < 0.26) return "andrena";
    if (roll < 0.5) return "mass";
    if (roll < 0.74) return "vernal";
    return "fovea";
  }
  if (lastKind === "mass") {
    if (roll < 0.22) return "andrena";
    if (roll < 0.44) return "shaft";
    if (roll < 0.68) return "vernal";
    return "fovea";
  }
  if (roll < 0.2) return "andrena";
  if (roll < 0.4) return "shaft";
  if (roll < 0.6) return "mass";
  if (roll < 0.8) return "vernal";
  return "fovea";
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
  return key === TRICK_KEY || key === "bank";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MiningBeeHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MiningBeeHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MiningBeeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MiningBeeHappyKind | string, x: number, facing: 1 | -1): MiningBeeHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MiningBeeHappyKind) : "vicina";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "vicina" ? "talk" : name === "carlini" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function vicinaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vicina));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.052, rot: s * 3.2, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 12.4) + 0.24 * Math.sin(t * 24.8);
      return {
        lift: 0.052 + Math.abs(tick) * 0.02,
        rot: 3.2 + tick * 2.2,
        dx: tick * 0.0024,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.022 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function carliniPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.carlini));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.068, rot: s * -4.0, dx: s * 0.003, anim: "play" as TrickAnim };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 5.4) + 0.22 * Math.sin(t * 10.8);
      return {
        lift: 0.068 + Math.abs(flash) * 0.028,
        rot: -4.0 + flash * 4.8,
        dx: flash * 0.0048,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.024 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function andreniniPose(t) {
    return {
      lift: 0.014 + Math.abs(Math.sin(t * 0.34)) * 0.012,
      rot: Math.sin(t * 0.42) * 1.05,
      dx: Math.sin(t * 0.24) * 0.002,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: MiningBeeHappy, dt: number, flags: TrickFlags): MiningBeeHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MiningBeeHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "vicina") {
    const pose = vicinaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "carlini") {
    const pose = carliniPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = andreniniPose(next.t);
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

export function beginTrick(kind: MiningBeeTrickKind, x: number, facing: 1 | -1): MiningBeeTrick {
  const anim: TrickAnim =
    kind === "andrena"
    ? "sit"
    : kind === "shaft"
      ? "play"
      : kind === "mass"
        ? "talk"
        : kind === "vernal"
          ? "talk"
          : kind === "fovea"
            ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "andrena" ? "hold" : "go",
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


  export function andrenaPose(t) {
    const breath = Math.sin(t * 0.11) + 0.04 * Math.sin(t * 0.41);
    const grit = Math.abs(Math.sin(t * 0.17));
    return {
      lift: 0.012 + grit * 0.01,
      rot: -0.35 + breath * 0.48,
    };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.012 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.35 * (1 - u) };
  }

  export function shaftPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.shaft));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.028, rot: s * 1.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const bite = Math.sin(s * Math.PI * 4.2);
      const deepen = smoothstep(s);
      return {
        x: fromX + facing * deepen * 0.014,
        lift: -0.04 - Math.abs(bite) * 0.028 - deepen * 0.02,
        rot: facing * (2.2 + bite * 3.6),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.72) / 0.28);
    return {
      x: fromX + facing * 0.01 * (1 - s),
      lift: -0.018 * (1 - s),
      rot: facing * (0.8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function massPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.mass));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.048, rot: s * -3.2 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.58) {
      const s = (u - 0.14) / 0.44;
      const pack = Math.sin(s * Math.PI * 3.8);
      return {
        x: fromX + facing * (0.02 + Math.abs(pack) * 0.012),
        lift: 0.055 + Math.abs(pack) * 0.045,
        rot: facing * (-3.4 + pack * 5.5),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.88) {
      const s = (u - 0.58) / 0.3;
      const press = smoothstep(s);
      return {
        x: fromX + facing * 0.028,
        lift: 0.035 - press * 0.04,
        rot: facing * (2.2 - press * 4.0),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.88) / 0.12);
    return {
      x: fromX + facing * 0.016 * (1 - s),
      lift: -0.008 * (1 - s),
      rot: facing * (0.6 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function vernalPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.vernal));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: -0.05 + s * 0.02, rot: s * 1.2 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const rise = smoothstep(s);
      const shake = Math.sin(s * Math.PI * 2.6);
      return {
        x: fromX + facing * shake * 0.006,
        lift: -0.03 + rise * 0.12,
        rot: facing * (1.0 + shake * 2.8 + rise * 2.0),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 0.08 * (1 - s),
      rot: facing * (1.4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
  export function foveaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.fovea));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.02, rot: s * -3.4 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const glance = Math.sin(s * Math.PI * 2.1);
      const velour = Math.sin(s * Math.PI * 5.0) * 0.28;
      return {
        x: fromX + facing * glance * 0.004,
        lift: 0.018 + Math.abs(velour) * 0.01,
        rot: facing * (-2.8 + glance * 4.6 + velour),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.84) / 0.16);
    return {
      x: fromX,
      lift: 0.01 * (1 - s),
      rot: facing * (-0.8 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: MiningBeeTrick, dt: number, flags: TrickFlags): MiningBeeTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "shaft" && trick.kind !== "mass" && trick.kind !== "vernal" && trick.kind !== "fovea") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MiningBeeTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "andrena") {
    if (next.t < ANDRENA_HOLD) {
      const pose = andrenaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ANDRENA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ANDRENA_HOLD);
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
  if (next.kind === "shaft") {
    const pose = shaftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mass") {
    const pose = massPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "vernal") {
    const pose = vernalPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = foveaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
