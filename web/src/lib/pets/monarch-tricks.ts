/** Milk ground tricks while idle — ultra-polish pass. House monarch — asclepias / oyamel / warning / chrysalis / danaus / cremaster / tarsus personality (asclepias milkweed-host cling on the blotter — never named weed (Milk window WEED) / milkweed-as-window / host / plant / nest (Clip) / scurry, oyamel migration-rest cluster — never named migrate (ethogram-old) / roost (Keel) / huddle (Peck) / rest-cmd / voyage / south, warning aposematic wing-open — never named flash (Quill) / wing (Kite) / flutter (Fan ethogram+ginkgo) / fan / blaze (Ember) / glow, chrysalis memory of the jade case — never named jade (guest) / coil / tuck / curl / unroll (Nori) / return (Ember), danaus desk life as a Danaus orange-warning migrant, cremaster chrysalis-hook hang grip (species-true Danaus cremaster attachment — never named hook (Hook guest) / hang as vague / clasp / latch (Snap) / coil (Anchor) / tuck / curl), tarsus foot-taste chemoreception dab on the blotter (species-true butterfly tarsal host-taste — never named taste as vague / foot / probe (Comb owns proboscis) / sip (Banner puddlesip / Sip) / nectar (Disk) / weed (window) / scurry); not Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Dew mucilage/tentacle/digest/gland/rosette/lamina/circinate, Well peristome/cistern/brine/operculum/urn/ala/baffle, Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, Echo preen/bobble, Quill fan/flash, Relay buzz, Rui dance, Banner puddlesip, or snake guests Sash seam/moss/lap copies). Cremaster is the iconic chrysalis hang-hook (not Hook guest, not Snap latch). Tarsus is the iconic foot-taste (not Comb proboscis, not Banner puddlesip). Window-play WEED unchanged — never names weed as a trick. Ethogram keeps danaus sit_hold; adds asclepias/oyamel/warning/chrysalis/cremaster/tarsus softs + freeze (replaces thin flutter/migrate/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via monarch.wav. Thank-yous cardenolide / orange / tag. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `monarch-tricks.js`. True house-monarch desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Well/sundew/Dew/honeybee/Comb or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell/snap/count/cilia/teeth/fringe/latch/lure/margin/enzyme/clamp/trichome/stew/unseal/poise/cage/scape/pleat/boot/keiki/pollinia/wing/hood/bristle/peristome/cistern/brine/operculum/urn/ala/baffle/mucilage/tentacle/digest/gland/rosette/lamina/circinate/curl/glue/fiddle/waggle/dance/buzz/pollen/nectar/figure/corbicula/hex/proboscis/hive/ocelli/nasonov/puddlesip name collisions. Bird ultra (Soot→Ember) + Miso→Ghost done; skip Rui + birds. DANAUS_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Hum / honey_drone. Catalog 221. Catalog 221. No cry inventing beyond house monarch.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "monarch";
export const TRICKS = ["asclepias", "oyamel", "warning", "chrysalis", "danaus", "cremaster", "tarsus"] as const;
export const HAPPY = ["cardenolide", "orange", "tag"] as const;
export type MonarchTrickKind = (typeof TRICKS)[number];
export type MonarchHappyKind = (typeof HAPPY)[number];
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

export type MonarchTrick = {
  kind: MonarchTrickKind;
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

export type MonarchHappy = {
  kind: MonarchHappyKind;
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

export const HAPPY_DUR: Record<MonarchHappyKind, number> = {
  cardenolide: 1.70,
  orange: 1.84,
  tag: 1.76,
};

/** Danaus hold — Milk parks orange-warning calm on the blotter. Not window-play WEED. */
export const DANAUS_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<MonarchTrickKind, number> = {
  danaus: DANAUS_HOLD + RELEASE_S,
  asclepias: 2.48,
  oyamel: 2.42,
  warning: 2.40,
  chrysalis: 2.44,
  cremaster: 2.38,
  tarsus: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MonarchTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "danaus") return 40 + roll * 24;
  if (kind === "cremaster" || kind === "tarsus" || kind === "chrysalis") return 12 + roll * 9;
  if (kind === "asclepias" || kind === "oyamel" || kind === "warning") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MonarchTrickKind | string | null) {
  if (musicOn) return "danaus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "danaus") {
    if (roll < 0.16) return "asclepias" as const;
    if (roll < 0.32) return "warning" as const;
    if (roll < 0.48) return "oyamel" as const;
    if (roll < 0.64) return "chrysalis" as const;
    if (roll < 0.82) return "cremaster" as const;
    return "tarsus" as const;
  }
  if (lastKind === "asclepias") {
    if (roll < 0.18) return "danaus" as const;
    if (roll < 0.34) return "warning" as const;
    if (roll < 0.5) return "oyamel" as const;
    if (roll < 0.66) return "chrysalis" as const;
    if (roll < 0.83) return "cremaster" as const;
    return "tarsus" as const;
  }
  if (lastKind === "warning") {
    if (roll < 0.16) return "danaus" as const;
    if (roll < 0.32) return "asclepias" as const;
    if (roll < 0.48) return "oyamel" as const;
    if (roll < 0.64) return "chrysalis" as const;
    if (roll < 0.82) return "cremaster" as const;
    return "tarsus" as const;
  }
  if (lastKind === "cremaster" || lastKind === "tarsus") {
    if (roll < 0.16) return "danaus" as const;
    if (roll < 0.32) return "asclepias" as const;
    if (roll < 0.48) return "warning" as const;
    if (roll < 0.64) return "oyamel" as const;
    if (roll < 0.8) return "chrysalis" as const;
    return lastKind === "cremaster" ? ("tarsus" as const) : ("cremaster" as const);
  }
  if (roll < 0.14) return "danaus" as const;
  if (roll < 0.28) return "asclepias" as const;
  if (roll < 0.42) return "warning" as const;
  if (roll < 0.56) return "oyamel" as const;
  if (roll < 0.7) return "chrysalis" as const;
  if (roll < 0.85) return "cremaster" as const;
  return "tarsus" as const;
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
  return cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest" || cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter";
}

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "milk";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MonarchHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MonarchHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MonarchHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length) % list.length];
}

export function beginHappy(kind: MonarchHappyKind | string, x: number, facing: 1 | -1): MonarchHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MonarchHappyKind) : "cardenolide";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "cardenolide" ? "play" : name === "orange" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function cardenolidePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cardenolide));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const spark = Math.sin(t * 9.8) + 0.28 * Math.sin(t * 15.2);
    return {
      lift: 2.8 + Math.abs(spark) * 1.4,
      rot: 12 + spark * 10,
      dx: spark * 0.35,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function orangePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.orange));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 2.4, rot: s * -8, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const warm = Math.sin(t * 0.74);
    return {
      lift: 2.4 + Math.abs(warm) * 1.1,
      rot: -8 + warm * 6,
      dx: warm * 0.28,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.6 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function tagPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.86)) * 1.1,
    rot: Math.sin(t * 1.05) * 9,
    dx: Math.sin(t * 0.52) * 0.4,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: MonarchHappy, dt: number, flags: TrickFlags): MonarchHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MonarchHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "cardenolide") {
    const pose = cardenolidePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "orange") {
    const pose = orangePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tagPose(next.t);
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

export function beginTrick(kind: MonarchTrickKind, x: number, facing: 1 | -1): MonarchTrick {
  const anim: TrickAnim =
    kind === "danaus"
      ? "sit"
      : kind === "asclepias"
        ? "talk"
        : kind === "oyamel"
          ? "sit"
          : kind === "warning"
            ? "play"
            : kind === "chrysalis"
              ? "sit"
              : kind === "cremaster"
                ? "talk"
                : kind === "tarsus"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "danaus" ? "hold" : "go",
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

export function danausPose(t: number) {
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

export function asclepiasPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.asclepias));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const leaf = Math.sin(t * 7.4) + 0.3 * Math.sin(t * 12.1);
    return {
      x: fromX + facing * leaf * 0.45,
      lift: 2.6 + Math.abs(leaf) * 1.1,
      rot: facing * (-8 + leaf * 7),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.76) / 0.24);
  return {
    x: fromX,
    lift: 2.6 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function oyamelPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oyamel));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 3.0, rot: s * -10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const cluster = Math.sin(t * 5.2) + 0.35 * Math.sin(t * 9.8);
    return {
      x: fromX - facing * 1.1 * ((u - 0.18) / 0.6),
      lift: 3.0 + Math.abs(cluster) * 1.2,
      rot: facing * (-10 + cluster * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX - facing * 1.1 * (1 - s),
    lift: 3.0 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function warningPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.warning));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.4, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const open = Math.sin(t * 10.5) + 0.35 * Math.sin(t * 16.2);
    return {
      x: fromX + facing * open * 0.55,
      lift: 3.4 + Math.abs(open) * 1.3,
      rot: facing * (10 + open * 9),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const hold = Math.sin(t * 4.8);
    return {
      x: fromX + facing * 0.7,
      lift: 4.2 + Math.abs(hold) * 0.7,
      rot: facing * (14 + hold * 3.5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 4.2 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function chrysalisPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chrysalis));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 2.2, rot: s * 6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.75) {
    const soft = Math.sin(((u - 0.2) / 0.55) * Math.PI * 1.8);
    return {
      x: fromX + facing * (0.4 + soft * 0.35),
      lift: 2.2 + soft * 1.4,
      rot: facing * (6 + soft * 7),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.75) / 0.25);
  return {
    x: fromX,
    lift: 2.2 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function cremasterPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cremaster));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.5, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = smoothstep((u - 0.18) / 0.37);
    return {
      x: fromX - facing * s * 0.55,
      lift: 2.5 + s * 2.6,
      rot: facing * (-8 + s * 14),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const hook = Math.sin(s * Math.PI * 1.7);
    return {
      x: fromX - facing * (0.55 + hook * 0.28),
      lift: 5.0 + Math.abs(hook) * 0.85,
      rot: facing * (5 + hook * 4.5),
      anim: "talk" as TrickAnim,
    };
  }
  {
    const s = (u - 0.84) / 0.16;
    return {
      x: fromX - facing * (0.55 * (1 - s)),
      lift: 5.0 * (1 - s),
      rot: facing * (5 * (1 - s)),
      anim: "idle" as TrickAnim,
    };
  }
}

export function tarsusPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tarsus));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.0, rot: s * 9 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const dab = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * dab * 0.9,
      lift: 3.0 + Math.abs(dab) * 1.4,
      rot: facing * (9 + dab * 11),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const taste = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX + facing * (0.7 + taste * 0.35),
      lift: 3.6 - s * 0.35 + Math.abs(taste) * 0.7,
      rot: facing * (14 - s * 3 + taste * 2.8),
      anim: "play" as TrickAnim,
    };
  }
  {
    const s = (u - 0.82) / 0.18;
    return {
      x: fromX + facing * (0.7 * (1 - s)),
      lift: 3.6 * (1 - s),
      rot: facing * (11 * (1 - s)),
      anim: "idle" as TrickAnim,
    };
  }
}

export function stepTrick(trick: MonarchTrick, dt: number, flags: TrickFlags): MonarchTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "asclepias" &&
    trick.kind !== "oyamel" &&
    trick.kind !== "warning" &&
    trick.kind !== "chrysalis" &&
    trick.kind !== "cremaster" &&
    trick.kind !== "tarsus"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MonarchTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "danaus") {
    if (next.t < DANAUS_HOLD) {
      const pose = danausPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < DANAUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - DANAUS_HOLD);
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
  if (next.kind === "asclepias") {
    const pose = asclepiasPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "oyamel") {
    const pose = oyamelPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "warning") {
    const pose = warningPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chrysalis") {
    const pose = chrysalisPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cremaster") {
    const pose = cremasterPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tarsusPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
