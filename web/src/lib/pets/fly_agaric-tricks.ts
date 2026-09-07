/** Cap ground tricks while idle. House neighborly fly-agaric WARTS life — annulus / volva / veil / symbiont / amanita personality (annulus skirt-ring settle under the lamp as partial-veil remnant — never named warts (window-play WARTS owns that word; never a trick kind) / cap as a trick kind / lean (ethogram) / flush (ethogram) / dig (Thimble) / nest (Clip + Column window) / bank (Lula + Bank guest) / buzz (Relay) / dance (Rui) / hover (Sepia) / festoon (Wax) / capped (Wax) / midrib (Wax) / stores (Wax) / tessera (Wax) / lamella (Frill) / imbricate (Frill) / lasso (Frill) / margin (Frill) / pleurotus (Frill), volva basal cup press into the blotter — never named shelf (Frill window) / tuft (Felt/moss) / frond (Vein/fern) / curl (Burr/hedgehog) / brood as a trick kind (also Brood cicada guest) / hold as a trick kind / cell (mason ethogram) / cerumen (Pot) / batumen (Pot) / circle (Disc) / liner (Disc), veil universal-veil flake settle on the pileus (Amanita remnant flakes — not window WARTS, not octopus mantle veil as a shared kind claim beyond species desk motion) — never named warts / pipe (Keep) / retinue (Keep) / duel (Keep) / royal (Keep) / hex (Comb) / partition (Auger) / plug (Mortar) / fossor (Thrum) / shaft (Bank), symbiont mycorrhizal hush with the moss cup — never named frill as a trick kind / fan (Fan guest) / sheen (Sheen guest + Disk trick) / glint (Coin) / gleam (Ground happy) / shine (Ember) / wax as a trick kind (guest Wax) / honey (Comb happy) / mead (Comb happy) / nectar (Disk) / pollen (Moth happy) / vessel (Pot) / spout (Pot) / mass (Bank) / tuft (Felt), amanita long hold desk life as Amanita muscaria fly agaric with muscaria / regalis / frostiana cousins in the thank-yous — never named mellifera (Hum) / regina (Keep) / andrena (Bank) / langstroth (Wax) / topbar (Wax) / warre (Wax) / ostreatus (Frill) / pulmonarius (Frill) / eryngii (Frill) / hive (Comb) / hex (Comb); guest slug Cap only for isKey matching — accept "cap" and fly_agaric; do NOT name a trick "cap"). Feed-happy thank-yous sit after eat. Card-open freeze and window-play WARTS do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop fly_agaric-tricks.js. Not a Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/honey_queen/Keep/honeycomb/Wax/oyster/Frill/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen/mining_bee/Bank or *Dragon electrical clone. Window-play WARTS unchanged — never names warts. Ethogram lean/flush/still unchanged — never names lean or flush as trick kinds. Comb owns figure/corbicula/hex/proboscis/hive and happy honey/mead/propolis; Hum owns holoptic/congregation/sortie/ocellus/mellifera and happy ligustica/carnica/apisini; Keep owns pipe/retinue/duel/royal/regina and happy caucasica/iberiensis/apini; Wax owns festoon/capped/midrib/stores/tessera and happy langstroth/topbar/warre; Frill owns lamella/imbricate/lasso/margin/pleurotus and happy ostreatus/pulmonarius/eryngii; Thrum owns sonicate/scopa/fossor/lumber/bombus and happy impatiens/bimaculatus/bombini; Auger owns rasp/glabrous/partition/picket/xylocopa and happy virginica/micans/xylocopini; Mortar owns trowel/beebread/orchard/plug/osmia and happy lignaria/cornifrons/osmiini; Disc owns circle/liner/cavity/parcel/megachile and happy rotundata/relativa/megachilini; Pot owns cerumen/spout/vessel/batumen/melipona and happy beecheii/yucatanica/meliponini; Sheen owns lustre/tumulus/salt/commune/agapostemon and happy virescens/texanus/halictini; Bank owns shaft/mass/vernal/fovea/andrena and happy vicina/carlini/andrenini; Lula owns bank; Disk owns pad/corolla/rhizome/calyx/sheen and happy silt/nectar/dew; Column owns gallery/pheromone/crumb/bustle/camponotus; Sepia owns hover; Vesper owns guard/thrum; Arm owns sentinel; Clip owns nest; Thimble owns dig; Lattice owns the next morel seat; Felt is moss; Vein is fern; Fan is ginkgo; Burr is hedgehog guest; Reed owns plop; Tube owns papillae; Relay owns buzz; Rui owns dance; Ground happy owns gleam; Coin owns glint; Ember owns shine. Mycorrhizal Amanita muscaria warning-mushroom desk life only — skirt + volva, not a bee, not a plant, not Wax honeycomb place, not Frill oyster shelf. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "fly_agaric";
export const TRICKS = ["annulus", "volva", "veil", "symbiont", "amanita"] as const;
export const HAPPY = ["muscaria", "regalis", "frostiana"] as const;
export type FlyAgaricTrickKind = (typeof TRICKS)[number];
export type FlyAgaricHappyKind = (typeof HAPPY)[number];
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

export type FlyAgaricTrick = {
  kind: FlyAgaricTrickKind;
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

export type FlyAgaricHappy = {
  kind: FlyAgaricHappyKind;
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

export const HAPPY_DUR = { muscaria: 1.34, regalis: 1.40, frostiana: 1.44 } as const;
export const AMANITA_HOLD = 15.35;
export const RELEASE_S = 0.77;
export const DUR = { amanita: AMANITA_HOLD + RELEASE_S, annulus: 1.78, volva: 1.92, veil: 1.66, symbiont: 1.53 } as const;
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FlyAgaricTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
    if (kind === "amanita") return 53 + roll * 31;
  if (kind === "annulus") return 14.5 + roll * 10.5;
  if (kind === "volva") return 18.5 + roll * 11.5;
  if (kind === "symbiont") return 15.5 + roll * 12.5;
  return justFinished ? 10.8 + roll * 8.2 : 5.5 + roll * 6.8;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: FlyAgaricTrickKind | string | null) {
  if (musicOn) return "amanita";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "amanita") {
    if (roll < 0.26) return "annulus";
    if (roll < 0.5) return "volva";
    if (roll < 0.74) return "veil";
    return "symbiont";
  }
  if (lastKind === "annulus") {
    if (roll < 0.26) return "amanita";
    if (roll < 0.5) return "volva";
    if (roll < 0.74) return "veil";
    return "symbiont";
  }
  if (lastKind === "volva") {
    if (roll < 0.22) return "amanita";
    if (roll < 0.44) return "annulus";
    if (roll < 0.68) return "veil";
    return "symbiont";
  }
  if (roll < 0.2) return "amanita";
  if (roll < 0.4) return "annulus";
  if (roll < 0.6) return "volva";
  if (roll < 0.8) return "veil";
  return "symbiont";
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
  return key === TRICK_KEY || key === "cap";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: FlyAgaricHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as FlyAgaricHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FlyAgaricHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: FlyAgaricHappyKind | string, x: number, facing: 1 | -1): FlyAgaricHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as FlyAgaricHappyKind) : "muscaria";
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

export function muscariaPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.muscaria));
    if (u < 0.14) {
      const s = u / 0.14;
      return { lift: s * 0.054, rot: s * 3.4, dx: 0, anim: "talk" as TrickAnim };
    }
    if (u < 0.76) {
      const tick = Math.sin(t * 12.9) + 0.27 * Math.sin(t * 26.1);
      return {
        lift: 0.054 + Math.abs(tick) * 0.022,
        rot: 3.4 + tick * 2.35,
        dx: tick * 0.0024,
        anim: "talk" as TrickAnim,
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.022 * (1 - s), rot: 1.1 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function regalisPose(t) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.regalis));
    if (u < 0.15) {
      const s = u / 0.15;
      return { lift: s * 0.07, rot: s * -4.2, dx: s * 0.003, anim: "play" as TrickAnim };
    }
    if (u < 0.8) {
      const flash = Math.sin(t * 6.1) + 0.25 * Math.sin(t * 12.0);
      return {
        lift: 0.07 + Math.abs(flash) * 0.03,
        rot: -4.2 + flash * 5.0,
        dx: flash * 0.0048,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.8) / 0.2;
    return { lift: 0.024 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function frostianaPose(t) {
    return {
      lift: 0.014 + Math.abs(Math.sin(t * 0.40)) * 0.012,
      rot: Math.sin(t * 0.48) * 1.15,
      dx: Math.sin(t * 0.28) * 0.0021,
      anim: "sit" as TrickAnim,
    };
  }
export function stepHappy(happy: FlyAgaricHappy, dt: number, flags: TrickFlags): FlyAgaricHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: FlyAgaricHappy = { ...happy, t: happy.t + Math.max(0, dt) };
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

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: FlyAgaricTrickKind, x: number, facing: 1 | -1): FlyAgaricTrick {
  const anim: TrickAnim =
    kind === "amanita"
    ? "sit"
    : kind === "annulus"
      ? "play"
      : kind === "volva"
        ? "talk"
        : kind === "veil"
          ? "talk"
          : kind === "symbiont"
            ? "sit"
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

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}


  export function amanitaPose(t) {
    const breath = Math.sin(t * 0.11) + 0.048 * Math.sin(t * 0.41);
    const grit = Math.abs(Math.sin(t * 0.21));
    return {
      lift: 0.014 + grit * 0.012,
      rot: -0.42 + breath * 0.52,
    };
  }

  export function releasePose(t) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.014 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.42 * (1 - u) };
  }

  export function annulusPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.annulus));
    if (u < 0.12) {
      const s = smoothstep(u / 0.12);
      return { x: fromX, lift: s * -0.028, rot: s * 1.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.72) {
      const s = (u - 0.12) / 0.6;
      const bite = Math.sin(s * Math.PI * 4.8);
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
  export function volvaPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.volva));
    if (u < 0.14) {
      const s = smoothstep(u / 0.14);
      return { x: fromX, lift: s * 0.048, rot: s * -3.2 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.58) {
      const s = (u - 0.14) / 0.44;
      const pack = Math.sin(s * Math.PI * 4.4);
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
  export function veilPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.veil));
    if (u < 0.22) {
      const s = smoothstep(u / 0.22);
      return { x: fromX, lift: -0.05 + s * 0.02, rot: s * 1.2 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.7) {
      const s = (u - 0.22) / 0.48;
      const rise = smoothstep(s);
      const shake = Math.sin(s * Math.PI * 3.2);
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
  export function symbiontPose(t, fromX, facing) {
    const u = Math.max(0, Math.min(1, t / DUR.symbiont));
    if (u < 0.16) {
      const s = smoothstep(u / 0.16);
      return { x: fromX, lift: s * 0.02, rot: s * -3.4 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.84) {
      const s = (u - 0.16) / 0.68;
      const glance = Math.sin(s * Math.PI * 2.4);
      const velour = Math.sin(s * Math.PI * 5.6) * 0.3;
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
export function stepTrick(trick: FlyAgaricTrick, dt: number, flags: TrickFlags): FlyAgaricTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "annulus" && trick.kind !== "volva" && trick.kind !== "veil" && trick.kind !== "symbiont") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: FlyAgaricTrick = { ...trick, t: trick.t + Math.max(0, dt) };
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
  if (next.kind === "annulus") {
    const pose = annulusPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "volva") {
    const pose = volvaPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "veil") {
    const pose = veilPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = symbiontPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
