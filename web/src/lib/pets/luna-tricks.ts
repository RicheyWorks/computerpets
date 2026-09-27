/** Ghost ground tricks while idle — ultra-polish pass. House luna — plumose / lunule / silk / stream / actias / aphagy / cauda personality (plumose feathered-antenna dusk sense on the blotter — never named antenna (Tenant) / nest (Clip) / scurry / week (Ghost window WEEK) / refuse (ethogram-old) / still / drift (ethogram-old+Coin), lunule eyespot crescent open — never named flash (Quill) / wing (Kite) / flutter (Fan ethogram+ginkgo) / fan / blaze (Ember) / glow / warning (Milk), silk cocoon-memory — never named chrysalis (Milk) / coil / tuck / curl / unroll (Nori) / return (Ember) / jade (guest), stream long hindwing-tail soft night flight — never named soar / hover (Sepia) / wing (Kite) / flutter / nocturne (Arm) / drift, actias desk life as an Actias pale-green tailed week, aphagy adult mouthless decline-of-the-bite (species-true Actias adult aphagy — never named refuse as ethogram-old / still / mute / hush / week / eat-cmd / nest), cauda forked hindwing-tail bat-deflection twirl (species-true Actias cauda — never named stream as flight / wing (Kite) / flutter / flash (Quill) / fan / soar / tail as vague); not Milk asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus, Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Dew mucilage/tentacle/digest/gland/rosette/lamina/circinate, Well peristome/cistern/brine/operculum/urn/ala/baffle, Snap clamp/trichome/stew/unseal/poise/cage/scape, Arm rib/branch/nocturne/areole/sentinel/pleat/boot, Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, Echo preen/bobble, Quill fan/flash, Relay buzz, Rui dance, Banner puddlesip, Spark lantern/jstroke, or snake guests Sash seam/moss/lap copies). Aphagy is the iconic adult no-mouth week (not Milk cremaster, not ethogram refuse). Cauda is the iconic forked hindwing-tail (not stream flight, not Kite wing). Window-play WEEK unchanged — never names week as a trick. Ethogram keeps actias sit_hold; adds plumose/lunule/silk/stream/aphagy/cauda softs + freeze (replaces thin still/drift/refuse). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via luna.wav. Thank-yous lime / moon / satin. Feed-happy after eat (hatchling may; adult declines the bite — thank-yous still silent desk motion). Sleep, hide, leave, rest, card still win. Same map as desktop `luna-tricks.js`. True house-luna desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Well/sundew/Dew/honeybee/Comb/monarch/Milk or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell/snap/count/cilia/teeth/fringe/latch/lure/margin/enzyme/clamp/trichome/stew/unseal/poise/cage/scape/pleat/boot/keiki/pollinia/wing/hood/bristle/peristome/cistern/brine/operculum/urn/ala/baffle/mucilage/tentacle/digest/gland/rosette/lamina/circinate/curl/glue/fiddle/waggle/dance/buzz/pollen/nectar/figure/corbicula/hex/proboscis/hive/ocelli/nasonov/asclepias/oyamel/warning/chrysalis/danaus/cremaster/tarsus/lantern/jstroke/semaphore/elytra/photinus/puddlesip/refuse/still/drift name collisions. Bird ultra (Soot→Ember) + Miso→Ghost done; skip Rui + birds. Next guest ultra is Shard / silica. No cry inventing beyond house luna.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "luna";
export const TRICKS = ["plumose", "lunule", "silk", "stream", "actias", "aphagy", "cauda"] as const;
export const HAPPY = ["lime", "moon", "satin"] as const;
export type LunaTrickKind = (typeof TRICKS)[number];
export type LunaHappyKind = (typeof HAPPY)[number];
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

export type LunaTrick = {
  kind: LunaTrickKind;
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

export type LunaHappy = {
  kind: LunaHappyKind;
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

export const HAPPY_DUR: Record<LunaHappyKind, number> = {
  lime: 1.70,
  moon: 1.84,
  satin: 1.76,
};
export const ACTIAS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR: Record<LunaTrickKind, number> = {
  actias: ACTIAS_HOLD + RELEASE_S,
  plumose: 2.48,
  lunule: 2.42,
  silk: 2.44,
  stream: 2.56,
  aphagy: 2.40,
  cauda: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LunaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "actias") return 40 + roll * 24;
  if (kind === "aphagy" || kind === "cauda" || kind === "silk") return 12 + roll * 9;
  if (kind === "plumose" || kind === "lunule" || kind === "stream") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LunaTrickKind | string | null) {
  if (musicOn) return "actias" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "actias") {
    if (roll < 0.16) return "plumose" as const;
    if (roll < 0.32) return "lunule" as const;
    if (roll < 0.48) return "silk" as const;
    if (roll < 0.64) return "stream" as const;
    if (roll < 0.82) return "aphagy" as const;
    return "cauda" as const;
  }
  if (lastKind === "plumose") {
    if (roll < 0.18) return "actias" as const;
    if (roll < 0.34) return "lunule" as const;
    if (roll < 0.5) return "silk" as const;
    if (roll < 0.66) return "stream" as const;
    if (roll < 0.83) return "aphagy" as const;
    return "cauda" as const;
  }
  if (lastKind === "lunule") {
    if (roll < 0.16) return "actias" as const;
    if (roll < 0.32) return "plumose" as const;
    if (roll < 0.48) return "silk" as const;
    if (roll < 0.64) return "stream" as const;
    if (roll < 0.82) return "aphagy" as const;
    return "cauda" as const;
  }
  if (lastKind === "aphagy" || lastKind === "cauda") {
    if (roll < 0.16) return "actias" as const;
    if (roll < 0.32) return "plumose" as const;
    if (roll < 0.48) return "lunule" as const;
    if (roll < 0.64) return "silk" as const;
    if (roll < 0.8) return "stream" as const;
    return lastKind === "aphagy" ? ("cauda" as const) : ("aphagy" as const);
  }
  if (roll < 0.14) return "actias" as const;
  if (roll < 0.28) return "plumose" as const;
  if (roll < 0.42) return "lunule" as const;
  if (roll < 0.56) return "silk" as const;
  if (roll < 0.7) return "stream" as const;
  if (roll < 0.85) return "aphagy" as const;
  return "cauda" as const;
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
  return key === TRICK_KEY || key === "ghost";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: LunaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as LunaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: LunaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: LunaHappyKind | string, x: number, facing: 1 | -1): LunaHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as LunaHappyKind) : "lime";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "lime" ? "play" : name === "moon" ? "sit" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function limePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lime));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.72) {
    const spark = Math.sin(t * 9.8) + 0.28 * Math.sin(t * 15.2);
    return {
      lift: 2.8 + Math.abs(spark) * 1.4,
      rot: 12 + spark * 10,
      dx: spark * 0.22,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.72) / 0.28;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function moonPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.moon));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * -1.1, rot: s * -6.5, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const warm = Math.sin(t * 0.74);
    return {
      lift: -1.1 + Math.abs(warm) * 0.85,
      rot: -6.5 + warm * 5.5,
      dx: warm * 0.18,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: -0.7 * (1 - s), rot: -3.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function satinPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.86)) * 1.1,
    rot: Math.sin(t * 1.05) * 9,
    dx: Math.sin(t * 0.52) * 0.28,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: LunaHappy, dt: number, flags: TrickFlags): LunaHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LunaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "lime") {
    const pose = limePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "moon") {
    const pose = moonPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = satinPose(next.t);
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

export function beginTrick(kind: LunaTrickKind, x: number, facing: 1 | -1): LunaTrick {
  const anim: TrickAnim =
    kind === "actias"
      ? "sit"
      : kind === "plumose"
        ? "talk"
        : kind === "lunule"
          ? "play"
          : kind === "silk"
            ? "sit"
            : kind === "stream"
              ? "sit"
              : kind === "aphagy"
                ? "talk"
                : kind === "cauda"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "actias" ? "hold" : "go",
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

export function actiasPose(t: number) {
  const breath = Math.sin(t * 0.16) + 0.02 * Math.sin(t * 0.88);
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.24)) * 1.2,
    rot: 4 + breath * 3.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.2 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 3.2 * (1 - u) };
}

export function plumosePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plumose));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const s = (u - 0.14) / 0.62;
    const leaf = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * 0.35 * s + facing * leaf * 0.12,
      lift: 2.6 + Math.abs(leaf) * 1.1,
      rot: facing * (-8 + leaf * 7),
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return {
    x: fromX + facing * 0.35 * (1 - s),
    lift: 2.6 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "talk" as TrickAnim,
  };
}

export function lunulePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lunule));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.5) {
    const open = Math.sin(((u - 0.14) / 0.36) * Math.PI);
    return {
      x: fromX + facing * 0.2 * open,
      lift: 3.4 + Math.abs(open) * 1.3,
      rot: facing * (10 + open * 9),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const hold = Math.sin(t * 6.2);
    return {
      x: fromX + facing * 0.18,
      lift: 4.2 + Math.abs(hold) * 0.7,
      rot: facing * (14 + hold * 3.5),
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return {
    x: fromX + facing * 0.18 * (1 - s),
    lift: 4.2 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "play" as TrickAnim,
  };
}

export function silkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.silk));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * -1.4, rot: s * 6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const wrap = Math.sin(((u - 0.16) / 0.62) * Math.PI * 1.6);
    return {
      x: fromX + facing * wrap * 0.15,
      lift: -1.4 + Math.abs(wrap) * 0.9,
      rot: facing * (6 + wrap * 5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return {
    x: fromX,
    lift: -1.4 * (1 - s),
    rot: facing * (3.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function streamPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stream));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * -7 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const glide = Math.sin(((u - 0.14) / 0.66) * Math.PI * 2);
    return {
      x: fromX + facing * (0.55 * ((u - 0.14) / 0.66) + glide * 0.12),
      lift: 2.8 + Math.abs(glide) * 1.2,
      rot: facing * (-7 + glide * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return {
    x: fromX + facing * 0.55 * (1 - s),
    lift: 2.8 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function aphagyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.aphagy));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.5, rot: s * -8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.14) / 0.31;
    return {
      x: fromX - facing * 0.25 * s,
      lift: 2.5 + s * 2.6,
      rot: facing * (-8 + s * 14),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const decline = Math.sin(t * 5.4);
    return {
      x: fromX - facing * 0.25,
      lift: 5.0 + Math.abs(decline) * 0.85,
      rot: facing * (5 + decline * 4.5),
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return {
    x: fromX - facing * 0.25 * (1 - s),
    lift: 5.0 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "talk" as TrickAnim,
  };
}

export function caudaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cauda));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.2, rot: s * 9 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const twirl = Math.sin(((u - 0.12) / 0.66) * Math.PI * 3.2);
    return {
      x: fromX + facing * twirl * 0.28,
      lift: 3.2 + Math.abs(twirl) * 1.5,
      rot: facing * (9 + twirl * 11),
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return {
    x: fromX,
    lift: 3.2 * (1 - s),
    rot: facing * (5 * (1 - s)),
    anim: "play" as TrickAnim,
  };
}

export function stepTrick(trick: LunaTrick, dt: number, flags: TrickFlags): LunaTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "plumose" && trick.kind !== "lunule" && trick.kind !== "silk" && trick.kind !== "stream" && trick.kind !== "aphagy" && trick.kind !== "cauda") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LunaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "actias") {
    if (next.t < ACTIAS_HOLD) {
      const pose = actiasPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ACTIAS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ACTIAS_HOLD);
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
  const from = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "plumose") {
    const pose = plumosePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lunule") {
    const pose = lunulePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "silk") {
    const pose = silkPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "stream") {
    const pose = streamPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "aphagy") {
    const pose = aphagyPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = caudaPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
