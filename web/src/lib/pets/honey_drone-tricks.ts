/** Hum ground tricks while idle. House neighborly Western honey bee drone — holoptic / congregation / sortie / ocellus / mellifera personality (holoptic big compound eyes meeting dorsally for a desk scan — never named dig (Thimble + ethogram + window DIG) / salt (Sheen) / lustre (Sheen) / shine (ethogram + Ember) / sheen (Disk) / glint (Coin) / gleam (Ground happy) / fovea (Bank) / figure (Comb), congregation DCA-style desk circuit as a drone congregation area — never named circle (Disc) / commune (Sheen) / gallery (Column) / nest (Clip + Column window) / bank (Lula boa trick + Bank guest slug + mining window) / hive (Comb) / dance (Rui) / waggle (Comb window) / buzz (Relay), sortie short mating-flight lift off the blotter — never named hover (Sepia + ethogram) / soar / rise / emerge (Cicada) / egress (Cicada + Thrum) / cast (Cicada) / harden (Cicada) / spring (Cat + Mortar) / dance (Rui), ocellus three-ocelli head tip glance — never named salt (Sheen) / lustre (Sheen) / shine (Ember) / sheen (Disk) / glint (Coin) / gleam (Ground happy) / fovea (Bank) / hum (guest slug + ethogram only — never a trick kind), mellifera long hold desk life as an Apis mellifera drone neighbor with ligustica / carnica cousins in the thank-yous; not Comb worker hive life / Thrum / Auger / Mortar / Disc / Pot / Sheen / Bank / Disk / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / *Dragon copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play DRONE do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop honey_drone-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen/mining_bee/Bank or *Dragon electrical clone. Window-play DRONE unchanged — never names drone. Ethogram hum/pulse, hover/bob, still unchanged — never names hum or hover as trick kinds. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Mortar owns trowel/beebread/orchard/plug/osmia and happy lignaria/cornifrons/osmiini; Disc owns circle/liner/cavity/parcel/megachile and happy rotundata/relativa/megachilini; Pot owns cerumen/spout/vessel/batumen/melipona and happy beecheii/yucatanica/meliponini; Sheen owns lustre/tumulus/salt/commune/agapostemon and happy virescens/texanus/halictini; Bank owns shaft/mass/vernal/fovea/andrena and happy vicina/carlini/andrenini; Lula owns bank; Disk owns pad/corolla/rhizome/calyx/sheen and happy silt/nectar/dew; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Clip owns nest; Thimble owns dig; Cap owns warts; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance; Ground happy owns gleam; Coin owns glint; Ember owns shine. Apis mellifera drone desk life only — no sting, no pollen basket, not Comb worker. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "honey_drone";
export const TRICKS = ["holoptic", "congregation", "sortie", "ocellus", "mellifera"] as const;
export const HAPPY = ["ligustica", "carnica", "apisini"] as const;
export type HoneyDroneTrickKind = (typeof TRICKS)[number];
export type HoneyDroneHappyKind = (typeof HAPPY)[number];
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

export type HoneyDroneTrick = {
  kind: HoneyDroneTrickKind;
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

export type HoneyDroneHappy = {
  kind: HoneyDroneHappyKind;
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

export const HAPPY_DUR = { ligustica: 1.26, carnica: 1.32, apisini: 1.36 } as const;
export const MELLIFERA_HOLD = 14.4;
export const RELEASE_S = 0.7;
export const DUR = { mellifera: MELLIFERA_HOLD + RELEASE_S, holoptic: 1.68, congregation: 1.8, sortie: 1.54, ocellus: 1.5 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HoneyDroneTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "mellifera") return 52 + roll * 30;
  if (kind === "holoptic") return 14 + roll * 10;
  if (kind === "congregation") return 18 + roll * 11;
  if (kind === "ocellus") return 15 + roll * 12;
  return justFinished ? 10.6 + roll * 8 : 5.4 + roll * 6.6;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HoneyDroneTrickKind | string | null) {
  if (musicOn) return "mellifera";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "mellifera") {
    if (roll < 0.26) return "holoptic";
    if (roll < 0.5) return "congregation";
    if (roll < 0.74) return "sortie";
    return "ocellus";
  }
  if (lastKind === "holoptic") {
    if (roll < 0.26) return "mellifera";
    if (roll < 0.5) return "congregation";
    if (roll < 0.74) return "sortie";
    return "ocellus";
  }
  if (lastKind === "congregation") {
    if (roll < 0.22) return "mellifera";
    if (roll < 0.44) return "holoptic";
    if (roll < 0.68) return "sortie";
    return "ocellus";
  }
  if (roll < 0.2) return "mellifera";
  if (roll < 0.4) return "holoptic";
  if (roll < 0.6) return "congregation";
  if (roll < 0.8) return "sortie";
  return "ocellus";
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
  return key === TRICK_KEY || key === "hum";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HoneyDroneHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as HoneyDroneHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HoneyDroneHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: HoneyDroneHappyKind | string, x: number, facing: 1 | -1): HoneyDroneHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as HoneyDroneHappyKind) : "ligustica";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "ligustica" ? "talk" : name === "carnica" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function ligusticaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ligustica));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.052, rot: s * 3.2, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 12.6) + 0.24 * Math.sin(t * 25.2);
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
export function carnicaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.carnica));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.068, rot: s * -4.0, dx: s * 0.003, anim: "play" as TrickAnim };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 5.55) + 0.22 * Math.sin(t * 11.1);
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
export function apisiniPose(t) {
    return {
      lift: 0.014 + Math.abs(Math.sin(t * 0.36)) * 0.012,
      rot: Math.sin(t * 0.44) * 1.05,
      dx: Math.sin(t * 0.26) * 0.002,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: HoneyDroneHappy, dt: number, flags: TrickFlags): HoneyDroneHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HoneyDroneHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "ligustica") {
    const pose = ligusticaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "carnica") {
    const pose = carnicaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = apisiniPose(next.t);
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

export function beginTrick(kind: HoneyDroneTrickKind, x: number, facing: 1 | -1): HoneyDroneTrick {
  const anim: TrickAnim =
    kind === "mellifera"
    ? "sit"
    : kind === "holoptic"
      ? "play"
      : kind === "congregation"
        ? "talk"
        : kind === "sortie"
          ? "talk"
          : kind === "ocellus"
            ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "mellifera" ? "hold" : "go",
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


  export function melliferaPose(t) {
    const breath = Math.sin(t * 0.12) + 0.04 * Math.sin(t * 0.43);
    const grit = Math.abs(Math.sin(t * 0.18));
    return {
      lift: 0.012 + grit * 0.01,
      rot: -0.35 + breath * 0.48,
    };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.012 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.35 * (1 - u) };
  }

  export function holopticPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.holoptic));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.028, rot: s * 1.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const bite = Math.sin(s * Math.PI * 4.4);
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
  export function congregationPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.congregation));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.048, rot: s * -3.2 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.58) {
      const s = (u - 0.14) / 0.44;
      const pack = Math.sin(s * Math.PI * 4.0);
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
  export function sortiePose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.sortie));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: -0.05 + s * 0.02, rot: s * 1.2 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const rise = smoothstep(s);
      const shake = Math.sin(s * Math.PI * 2.8);
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
  export function ocellusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.ocellus));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.02, rot: s * -3.4 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const glance = Math.sin(s * Math.PI * 2.2);
      const velour = Math.sin(s * Math.PI * 5.2) * 0.28;
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
export function stepTrick(trick: HoneyDroneTrick, dt: number, flags: TrickFlags): HoneyDroneTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "holoptic" && trick.kind !== "congregation" && trick.kind !== "sortie" && trick.kind !== "ocellus") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HoneyDroneTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "mellifera") {
    if (next.t < MELLIFERA_HOLD) {
      const pose = melliferaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < MELLIFERA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - MELLIFERA_HOLD);
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
  if (next.kind === "holoptic") {
    const pose = holopticPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "congregation") {
    const pose = congregationPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sortie") {
    const pose = sortiePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ocellusPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
