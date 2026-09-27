/** Arm ground tricks while idle — ultra-polish pass. House saguaro — rib / branch / nocturne / areole / sentinel / pleat / boot personality (ribbed-column rain swell on the sand tray — never named column (Moth owns column) / bole (Mast owns bole) / press (Sol owns press) / swell as thank-you (Sol owns swell), budding arm branch reach — never named arm as window-collision / labellum (Moth owns labellum) / lobe (Kite owns lobe) / bough (Jade owns bough), nocturne night-bloom crown open — never named bloom as axolotl-guest collision / spike (Moth owns spike) / corolla (Disk owns corolla) / open (Disk window owns open) / flare (Coin owns flare) / nod (orchid ethogram-old / Sol owns nod), areole spine hush on the ribs — never named bristle (Burr / porcupine ethogram) / hush as shared verb-only / curl (Burr owns curl) / tuck (Ink owns tuck), desert-sentinel desk life under the lamp, pleat accordion stem-fold monsoon swell (species-true Carnegiea gigantea pleated column — never named swell as Sol thank-you / pad (Disk owns pad) / accordion as copy / cork (owned) / vessel (owned)), boot woodpecker-nest cavity settle (species-true saguaro boot callus hole — never named nest (Clip owns nest) / nook (Nori owns nook) / cavity as copy / hole / den (Rue owns den)); not Moth labellum/velamen/column/spike/epiphyte/keiki/pollinia, Disk pad/corolla/rhizome/calyx/sheen/peltate/hydropote, Mast acorn/sinus/gall/taproot/bole/catkin/tyloses, Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, or snake guests Sash seam/moss/lap copies). Pleat is the iconic accordion rain-store fold (not Sol swell thank-you). Boot is the iconic nest-cavity callus (not Clip nest, not Rue den). Window-play STORE unchanged — never names store as a trick. Ethogram keeps sentinel sit_hold; adds rib/branch/nocturne/areole/pleat/boot softs + freeze (replaces thin still/lean/nod). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via saguaro.wav. Thank-yous monsoon / creosote / agave. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `saguaro-tricks.js`. True house-saguaro desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/moth-orchid/Moth or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids open/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/pad/corolla/rhizome/calyx/sheen/peltate/hydropote/mount/store/drift/float/bloom/cup/siphon/soak/sprout/nectary/nest/den/nook/column/bole/press/swell name collisions. Bird ultra (Soot→Ember) + Miso→Moth done; skip Rui + birds. Next guest ultra is Snap / venus_flytrap. No cry inventing beyond house saguaro.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "saguaro";
export const TRICKS = ["rib", "branch", "nocturne", "areole", "sentinel", "pleat", "boot"] as const;
export const HAPPY = ["monsoon", "creosote", "agave"] as const;
export type SaguaroTrickKind = (typeof TRICKS)[number];
export type SaguaroHappyKind = (typeof HAPPY)[number];
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

export type SaguaroTrick = {
  kind: SaguaroTrickKind;
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

export type SaguaroHappy = {
  kind: SaguaroHappyKind;
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

export const HAPPY_DUR: Record<SaguaroHappyKind, number> = {
  monsoon: 1.70,
  creosote: 1.84,
  agave: 1.76,
};

/** Sentinel hold — Arm parks desert-column calm on the blotter. Not window-play STORE. */
export const SENTINEL_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<SaguaroTrickKind, number> = {
  sentinel: SENTINEL_HOLD + RELEASE_S,
  rib: 2.48,
  branch: 2.42,
  nocturne: 2.44,
  areole: 2.40,
  pleat: 2.38,
  boot: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SaguaroTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "sentinel") return 38 + roll * 24;
  if (kind === "pleat" || kind === "boot" || kind === "nocturne") return 12 + roll * 9;
  if (kind === "rib" || kind === "branch" || kind === "areole") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SaguaroTrickKind | string | null) {
  if (musicOn) return "sentinel" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "sentinel") {
    if (roll < 0.18) return "rib" as const;
    if (roll < 0.34) return "branch" as const;
    if (roll < 0.5) return "nocturne" as const;
    if (roll < 0.66) return "areole" as const;
    if (roll < 0.83) return "pleat" as const;
    return "boot" as const;
  }
  if (lastKind === "rib") {
    if (roll < 0.2) return "sentinel" as const;
    if (roll < 0.36) return "branch" as const;
    if (roll < 0.52) return "nocturne" as const;
    if (roll < 0.68) return "areole" as const;
    if (roll < 0.84) return "pleat" as const;
    return "boot" as const;
  }
  if (lastKind === "nocturne") {
    if (roll < 0.18) return "sentinel" as const;
    if (roll < 0.34) return "rib" as const;
    if (roll < 0.5) return "branch" as const;
    if (roll < 0.66) return "areole" as const;
    if (roll < 0.83) return "pleat" as const;
    return "boot" as const;
  }
  if (lastKind === "pleat" || lastKind === "boot") {
    if (roll < 0.16) return "sentinel" as const;
    if (roll < 0.32) return "rib" as const;
    if (roll < 0.48) return "branch" as const;
    if (roll < 0.64) return "nocturne" as const;
    if (roll < 0.8) return "areole" as const;
    return lastKind === "pleat" ? ("boot" as const) : ("pleat" as const);
  }
  if (roll < 0.14) return "sentinel" as const;
  if (roll < 0.28) return "rib" as const;
  if (roll < 0.42) return "branch" as const;
  if (roll < 0.56) return "nocturne" as const;
  if (roll < 0.7) return "areole" as const;
  if (roll < 0.85) return "pleat" as const;
  return "boot" as const;
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
  return key === TRICK_KEY || key === "arm";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SaguaroHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as SaguaroHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SaguaroHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SaguaroHappyKind | string, x: number, facing: 1 | -1): SaguaroHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SaguaroHappyKind) : "monsoon";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "monsoon" ? "sit" : name === "creosote" ? "play" : "talk",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function monsoonPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.monsoon));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.76) {
    const rain = Math.sin(t * 1.72);
    return {
      lift: 2.8 + Math.abs(rain) * 1.4,
      rot: 12 + rain * 10,
      dx: rain * 0.8,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function creosotePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.creosote));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 3.0, rot: s * -10, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.68) {
    const scent = Math.sin(t * 1.55);
    return {
      lift: 3.0 + Math.abs(scent) * 1.5,
      rot: -10 + scent * 14,
      dx: scent * 1.1,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.68) / 0.32;
  return { lift: 2.0 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function agavePose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.72) * 8,
    dx: Math.sin(t * 0.4) * 0.9,
    anim: "talk" as TrickAnim,
  };
}

export function stepHappy(happy: SaguaroHappy, dt: number, flags: TrickFlags): SaguaroHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SaguaroHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "monsoon") {
    const pose = monsoonPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "creosote") {
    const pose = creosotePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = agavePose(next.t);
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

export function beginTrick(kind: SaguaroTrickKind, x: number, facing: 1 | -1): SaguaroTrick {
  const anim: TrickAnim =
    kind === "sentinel"
      ? "sit"
      : kind === "rib"
        ? "sit"
        : kind === "nocturne"
          ? "talk"
          : kind === "branch"
            ? "play"
            : kind === "areole"
              ? "sit"
              : kind === "pleat"
                ? "play"
                : kind === "boot"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "sentinel" ? "hold" : "go",
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

export function sentinelPose(t: number) {
  const breath = Math.sin(t * 0.42) + 0.12 * Math.sin(t * 1.1);
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: 4 + breath * 3.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - u) };
}

export function ribPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rib));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const swell = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX + facing * swell * 0.8,
      lift: 3.2 - s * 0.6 + Math.abs(swell) * 0.8,
      rot: facing * (-8 + swell * 12),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const rib = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * (0.8 + rib * 0.6),
      lift: 2.4 * (1 - s * 0.35) + Math.abs(rib) * 0.5,
      rot: facing * (4 + rib * 5),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 0.8 * (1 - s),
    rot: facing * (-2.0 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function branchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.branch));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const reach = smoothstep(s);
    return {
      x: fromX + facing * reach * 3.2,
      lift: 2.6 + reach * 1.4,
      rot: facing * (10 + reach * 8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const hold = Math.sin(s * Math.PI * 1.5);
    return {
      x: fromX + facing * (3.2 + hold * 0.6),
      lift: 3.6 + Math.abs(hold) * 0.6,
      rot: facing * (18 + hold * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX + facing * 3.2 * (1 - s),
    lift: 3.6 * (1 - s),
    rot: facing * (10 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function nocturnePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nocturne));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 2.6, rot: s * 6 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.58) {
    const s = (u - 0.2) / 0.38;
    const open = smoothstep(s);
    return {
      x: fromX + facing * open * 1.2,
      lift: 2.6 + open * 2.0,
      rot: facing * (6 + open * 12),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.86) {
    const s = (u - 0.58) / 0.28;
    const bloom = Math.sin(s * Math.PI * 1.7);
    return {
      x: fromX + facing * (1.2 + bloom * 0.5),
      lift: 4.2 + Math.abs(bloom) * 0.7,
      rot: facing * (18 + bloom * 4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 4.2 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function areolePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.areole));
  if (u < 0.2) {
    const s = smoothstep(u / 0.2);
    return { x: fromX, lift: s * 2.4, rot: s * -10 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.2) / 0.35;
    const hush = smoothstep(s);
    return {
      x: fromX - facing * hush * 1.6,
      lift: 2.4 + hush * 0.8,
      rot: facing * (-10 - hush * 6),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.55) / 0.27;
    const tick = Math.sin(s * Math.PI * 2.6);
    return {
      x: fromX - facing * (1.6 + tick * 0.4),
      lift: 3.0 + Math.abs(tick) * 0.5,
      rot: facing * (-16 + tick * 4),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX - facing * 1.6 * (1 - s),
    lift: 3.0 * (1 - s),
    rot: facing * (-8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function pleatPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pleat));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.8, rot: s * 8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const fold = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * fold * 1.4,
      lift: 2.8 + Math.abs(fold) * 1.6,
      rot: facing * (8 + fold * 10),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.52) / 0.32;
    const rain = smoothstep(s);
    return {
      x: fromX + facing * rain * 2.2,
      lift: 3.6 - rain * 0.6 + Math.sin(s * Math.PI * 1.6) * 0.7,
      rot: facing * (4 + rain * 8),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * 2.2 * (1 - s),
    lift: 2.4 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function bootPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.boot));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.4, rot: s * -6 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const cave = smoothstep(s);
    return {
      x: fromX - facing * cave * 1.8,
      lift: 2.4 * (1 - cave * 0.35) + Math.abs(Math.sin(s * Math.PI * 1.4)) * 0.8,
      rot: facing * (-6 - cave * 8),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const nest = Math.sin(s * Math.PI * 1.9);
    return {
      x: fromX - facing * (1.8 + nest * 0.4),
      lift: 1.8 + Math.abs(nest) * 1.0,
      rot: facing * (-14 + nest * 3),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX - facing * 1.8 * (1 - s),
    lift: 1.8 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: SaguaroTrick, dt: number, flags: TrickFlags): SaguaroTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "rib" &&
    trick.kind !== "branch" &&
    trick.kind !== "nocturne" &&
    trick.kind !== "areole" &&
    trick.kind !== "pleat" &&
    trick.kind !== "boot"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SaguaroTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "sentinel") {
    if (next.t < SENTINEL_HOLD) {
      const pose = sentinelPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SENTINEL_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SENTINEL_HOLD);
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
  if (next.kind === "rib") {
    const pose = ribPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "branch") {
    const pose = branchPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nocturne") {
    const pose = nocturnePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "areole") {
    const pose = areolePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pleat") {
    const pose = pleatPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bootPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
