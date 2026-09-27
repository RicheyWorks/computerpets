/** Well ground tricks while idle — ultra-polish pass. House pitcher — peristome / cistern / brine / operculum / urn / ala / baffle personality (slippery peristome rim shine on the blotter — never named rim as vague noun-only / slip / slick / wet / flare (Coin owns flare) / sheen (Disk owns sheen) / nectar (Disk owns nectar), rain cistern pool filling the cup — never named pool as vague / rain as happy-only / fill (Drown window owns FILL) / sip (window) / drink (window) / soak (Ink owns soak) / dew (Disk owns dew), drowning brine well hush in the cup — never named hush as shared verb-only / well as roster name / drown as guest alias / stew (Snap owns stew) / digest (Dew owns digest) / enzyme as vague / liquor / flood / pitfall as vague, operculum lid nod under the lamp — never named lid as vague / nod (ethogram-old / Sol owns nod) / hood (Bluff owns hood) / tip (window) / lean (ethogram-old / Still window) / gape (Door window / Bluff) / spike (Moth owns spike) / epiphyte (Moth owns epiphyte), carnivorous urn desk life as a passive pitfall, ala Sarracenia wing-flange sway along the pitcher (species-true purple-pitcher ala — never named wing (Kite owns wing) / lobe (Kite owns lobe) / fringe (Chamber) / keel as toucan-roster collision / flap / sail), baffle downward-hair prey-guide hush inside the tube (species-true retrograde pitcher baffle hairs — never named hair / bristle (Burr owns bristle) / seta (Felt owns seta) / trichome (Snap owns trichome) / guide as vague / lure (snapper) / teeth / fringe); not Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, Dew mucilage/tentacle/digest/gland/rosette, or snake guests Sash seam/moss/lap copies). Ala is the iconic Sarracenia wing flange (not Kite wing/lobe). Baffle is the iconic downward-hair prey guide (not Snap trichome, not Burr bristle). Window-play FILL unchanged — never names fill as a trick. Ethogram keeps urn sit_hold; adds peristome/cistern/brine/operculum/ala/baffle softs + freeze (replaces thin still/lean/nod). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via pitcher.wav. Thank-yous midge / rain / maroon. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `pitcher-tricks.js`. True house-pitcher desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth/saguaro/Arm/venus-flytrap/Snap or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell/snap/count/cilia/teeth/fringe/latch/lure/margin/enzyme/digest/mucilage/tentacle/gland/rosette/clamp/trichome/stew/unseal/poise/cage/scape/pleat/boot/keiki/pollinia/wing/hood/bristle name collisions. Bird ultra (Soot→Ember) + Miso→Snap done; skip Rui + birds. Next guest ultra is Shard / silica. No cry inventing beyond house pitcher.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "pitcher";
export const TRICKS = ["peristome", "cistern", "brine", "operculum", "urn", "ala", "baffle"] as const;
export const HAPPY = ["midge", "rain", "maroon"] as const;
export type PitcherTrickKind = (typeof TRICKS)[number];
export type PitcherHappyKind = (typeof HAPPY)[number];
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

export type PitcherTrick = {
  kind: PitcherTrickKind;
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

export type PitcherHappy = {
  kind: PitcherHappyKind;
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

export const HAPPY_DUR: Record<PitcherHappyKind, number> = {
  midge: 1.70,
  rain: 1.84,
  maroon: 1.76,
};

/** Urn hold — Well parks carnivorous calm on the blotter. Not window-play FILL. */
export const URN_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<PitcherTrickKind, number> = {
  urn: URN_HOLD + RELEASE_S,
  peristome: 2.48,
  cistern: 2.42,
  brine: 2.44,
  operculum: 2.56,
  ala: 2.40,
  baffle: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PitcherTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "urn") return 38 + roll * 24;
  if (kind === "ala" || kind === "baffle" || kind === "operculum") return 12 + roll * 9;
  if (kind === "peristome" || kind === "cistern" || kind === "brine") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: PitcherTrickKind | string | null) {
  if (musicOn) return "urn" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "urn") {
    if (roll < 0.18) return "peristome" as const;
    if (roll < 0.34) return "cistern" as const;
    if (roll < 0.5) return "brine" as const;
    if (roll < 0.66) return "operculum" as const;
    if (roll < 0.83) return "ala" as const;
    return "baffle" as const;
  }
  if (lastKind === "peristome") {
    if (roll < 0.2) return "urn" as const;
    if (roll < 0.36) return "cistern" as const;
    if (roll < 0.52) return "brine" as const;
    if (roll < 0.68) return "operculum" as const;
    if (roll < 0.84) return "ala" as const;
    return "baffle" as const;
  }
  if (lastKind === "brine") {
    if (roll < 0.18) return "urn" as const;
    if (roll < 0.34) return "peristome" as const;
    if (roll < 0.5) return "cistern" as const;
    if (roll < 0.66) return "operculum" as const;
    if (roll < 0.83) return "ala" as const;
    return "baffle" as const;
  }
  if (lastKind === "ala" || lastKind === "baffle") {
    if (roll < 0.16) return "urn" as const;
    if (roll < 0.32) return "peristome" as const;
    if (roll < 0.48) return "cistern" as const;
    if (roll < 0.64) return "brine" as const;
    if (roll < 0.8) return "operculum" as const;
    return lastKind === "ala" ? ("baffle" as const) : ("ala" as const);
  }
  if (roll < 0.14) return "urn" as const;
  if (roll < 0.28) return "peristome" as const;
  if (roll < 0.42) return "cistern" as const;
  if (roll < 0.56) return "brine" as const;
  if (roll < 0.7) return "operculum" as const;
  if (roll < 0.85) return "ala" as const;
  return "baffle" as const;
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
  return key === TRICK_KEY || key === "drown";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: PitcherHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as PitcherHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: PitcherHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: PitcherHappyKind | string, x: number, facing: 1 | -1): PitcherHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as PitcherHappyKind) : "midge";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "midge" ? "play" : name === "rain" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function midgePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.midge));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.62) {
    const buzz = Math.sin(t * 9.2);
    return {
      lift: 2.8 + Math.abs(buzz) * 1.4,
      rot: 12 + buzz * 10,
      dx: buzz * 0.8,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.62) / 0.38;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function rainPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.rain));
  if (u < 0.24) {
    const s = u / 0.24;
    return { lift: s * 2.4, rot: s * -8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const drop = Math.sin(t * 0.72);
    return {
      lift: 2.4 + Math.abs(drop) * 1.1,
      rot: -8 + drop * 6,
      dx: drop * 0.7,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 1.6 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function maroonPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.9)) * 1.1,
    rot: Math.sin(t * 1.05) * 9,
    dx: Math.sin(t * 0.55) * 0.85,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: PitcherHappy, dt: number, flags: TrickFlags): PitcherHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: PitcherHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "midge") {
    const pose = midgePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rain") {
    const pose = rainPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = maroonPose(next.t);
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

export function beginTrick(kind: PitcherTrickKind, x: number, facing: 1 | -1): PitcherTrick {
  const anim: TrickAnim =
    kind === "urn"
      ? "sit"
      : kind === "peristome"
        ? "play"
        : kind === "cistern"
          ? "sit"
          : kind === "brine"
            ? "sit"
            : kind === "operculum"
              ? "talk"
              : kind === "ala"
                ? "play"
                : kind === "baffle"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "urn" ? "hold" : "go",
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

export function urnPose(t: number) {
  const breath = Math.sin(t * 0.2) + 0.025 * Math.sin(t * 1.1);
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.31)) * 1.2,
    rot: 4 + breath * 3.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - u) };
}

export function peristomePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.peristome));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.2, rot: s * 8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const slick = Math.sin(t * 11.2) + 0.4 * Math.sin(t * 17.5);
    return {
      x: fromX + facing * slick * 0.55,
      lift: 3.2 + Math.abs(slick) * 1.2,
      rot: facing * (8 + slick * 8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 3.2 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function cisternPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cistern));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 2.6, rot: s * -8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.75) {
    const s = (u - 0.2) / 0.55;
    const fill = Math.sin(s * Math.PI * 1.3);
    return {
      x: fromX - facing * 1.2 * s,
      lift: 2.6 + fill * 0.9,
      rot: facing * (-8 - s * 4 + fill * 2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return {
    x: fromX - facing * 1.2 * (1 - s),
    lift: 2.6 * (1 - s),
    rot: facing * (-8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function brinePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.brine));
  if (u < 0.22) {
    const s = smoothstep(u / 0.22);
    return { x: fromX, lift: s * 2.2, rot: s * -10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.22) / 0.48;
    const hush = Math.sin(s * Math.PI * 1.4);
    return {
      x: fromX - facing * 1.4 * s,
      lift: 2.2 + hush * 0.8,
      rot: facing * (-10 - s * 6 + hush * 2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX - facing * 1.4 * (1 - s),
    lift: 2.2 * (1 - s),
    rot: facing * (-8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function operculumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.operculum));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 2.4, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = smoothstep((u - 0.2) / 0.35);
    return {
      x: fromX + facing * s * 1.6,
      lift: 2.4 + s * 2.0,
      rot: facing * (-8 + s * 18),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const flap = Math.sin(s * Math.PI * 1.5);
    return {
      x: fromX + facing * (1.6 + flap * 0.5),
      lift: 4.2 + Math.abs(flap) * 0.8,
      rot: facing * (10 + flap * 4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 4.2 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function alaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ala));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.8, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const wing = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * wing * 1.1,
      lift: 2.8 + Math.abs(wing) * 1.5,
      rot: facing * (10 + wing * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const sway = Math.sin(s * Math.PI * 1.7);
    return {
      x: fromX + facing * (0.8 + sway * 0.4),
      lift: 3.4 - s * 0.5 + Math.abs(sway) * 0.7,
      rot: facing * (14 - s * 4 + sway * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 2.6 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function bafflePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.baffle));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.6, rot: s * -6 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = smoothstep((u - 0.18) / 0.37);
    return {
      x: fromX - facing * s * 0.8,
      lift: 2.6 + s * 2.4,
      rot: facing * (-6 + s * 4),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const hush = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX - facing * (0.8 + hush * 0.3),
      lift: 5.0 + Math.abs(hush) * 0.7,
      rot: facing * (-2 + hush * 5),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 5.0 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: PitcherTrick, dt: number, flags: TrickFlags): PitcherTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "peristome" &&
    trick.kind !== "cistern" &&
    trick.kind !== "brine" &&
    trick.kind !== "operculum" &&
    trick.kind !== "ala" &&
    trick.kind !== "baffle"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: PitcherTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "urn") {
    if (next.t < URN_HOLD) {
      const pose = urnPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < URN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - URN_HOLD);
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
  if (next.kind === "peristome") {
    const pose = peristomePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cistern") {
    const pose = cisternPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "brine") {
    const pose = brinePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "operculum") {
    const pose = operculumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ala") {
    const pose = alaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bafflePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
