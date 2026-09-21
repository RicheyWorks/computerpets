/** Mast ground tricks while idle — ultra-polish pass. House oak — acorn / sinus / gall / taproot / bole / catkin / tyloses personality (acorn mast drop to the dish — never named drop (Fan owns drop) / dichotomy (Fan owns dichotomy) / petiole (Fan owns petiole) / seed (Mast window owns seed; Clip/hamster owns seed as a trick) / mast as fan-collision, lobed leaf sway as sinus — never named lobe (Kite owns lobe) / sway (Jade owns sway) / biloba (Fan owns biloba) / frond (Vein owns frond), gall curiosity tip inspect, deep taproot settle — never named root (Burr owns root) / dig (Rabbit owns dig), sturdy bole trunk calm desk life under the lamp, hanging male catkin tassel (species-true oak catkin — never named flutter (Fan owns flutter) / gold (Fan window owns gold) / drop (Fan owns drop)), white-oak tyloses vessel-plug (species-true Quercus alba watertight wood — never named barrel / cork (Velvet owns cork) / fossil (Ledger owns fossil) / vessel (stingless owns vessel)); not Fan biloba/notch/flutter/drop/amber/dichotomy/petiole, Vein frond/rachis/fiddle/pinna/saucer/sori/stipe, Felt tuft/bead/spore/cushion/thatch/rhizoid/seta, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest/seed, Bloom gill, parrot fan/flash, or snake guests Sash seam/moss/lap copies). Catkin is the species-true hanging male flower tassel (not Fan flutter/drop/gold). Tyloses is the iconic white-oak vessel plug that makes the wood watertight (not barrel, not Velvet cork, not Ledger fossil). Window-play SEED unchanged — never names seed as a trick. Ethogram keeps bole sit_hold; adds acorn/sinus/gall/taproot/catkin/tyloses softs + freeze (replaces thin lean/nod/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via oak.wav. Thank-yous cupule / tannin / grove. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `oak-tricks.js`. True house-oak desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/sheet-moss/Felt/maidenhair/Vein/ginkgo/Fan or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids seed/gold/lean/nod/still/unfurl/fan/drop/dichotomy/petiole/biloba/flutter/frond/rachis/fiddle/pinna/saucer/sori/stipe/tuft/bead/spore/cushion/thatch/rhizoid/seta/lobe/sway/root/dig/fossil/cork/barrel/vessel/canopy name collisions. Bird ultra (Soot→Ember) + Miso→Fan done; skip Rui + birds. Amplitudes raised toward Rui richness; denser waits/weights (BOLE_HOLD=11.2 RELEASE_S=1.18). Disk densified. Next leftover Wax / honeycomb. No cry inventing beyond house oak.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "oak";
export const TRICKS = ["acorn", "sinus", "gall", "taproot", "bole", "catkin", "tyloses"] as const;
export const HAPPY = ["cupule", "tannin", "grove"] as const;
export type OakTrickKind = (typeof TRICKS)[number];
export type OakHappyKind = (typeof HAPPY)[number];
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

export type OakTrick = {
  kind: OakTrickKind;
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

export type OakHappy = {
  kind: OakHappyKind;
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

export const HAPPY_DUR: Record<OakHappyKind, number> = {
  cupule: 1.28,
  tannin: 1.16,
  grove: 1.22,
};

/** Bole hold — Mast parks sturdy trunk calm on the blotter. Not window-play SEED. */
export const BOLE_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<OakTrickKind, number> = {
  bole: BOLE_HOLD + RELEASE_S,
  acorn: 1.58,
  sinus: 1.64,
  gall: 1.48,
  taproot: 1.56,
  catkin: 1.68,
  tyloses: 1.72,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: OakTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bole") return 40 + roll * 26;
  if (kind === "catkin" || kind === "tyloses") return 12.8 + roll * 9.4;
  if (kind === "acorn" || kind === "sinus" || kind === "gall" || kind === "taproot") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: OakTrickKind | string | null): OakTrickKind {
  if (musicOn) return "bole";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "bole" ? 0.72 : k === "catkin" || k === "tyloses" ? 1.28 : k === "acorn" || k === "sinus" || k === "gall" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "acorn";
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
  return key === TRICK_KEY || key === "mast";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: OakHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as OakHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: OakHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: OakHappyKind | string, x: number, facing: 1 | -1): OakHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as OakHappyKind) : "cupule";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "cupule" ? "talk" : name === "tannin" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function cupulePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cupule));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const cup = Math.sin(t * 1.72);
    return {
      lift: 3.36 + Math.abs(cup) * 1.68,
      rot: 14.4 + cup * 12,
      dx: cup * 0.144,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function tanninPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.tannin));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 3.6, rot: s * -12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const warm = Math.sin(t * 2.05);
    return {
      lift: 3.6 + Math.abs(warm) * 1.8,
      rot: -12 + warm * 16.8,
      dx: warm * 0.168,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.4 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function grovePose(t: number) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
    rot: Math.sin(t * 0.864) * 9.6,
    dx: Math.sin(t * 0.48) * -0.144,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: OakHappy, dt: number, flags: TrickFlags): OakHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: OakHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "cupule") {
    const pose = cupulePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tannin") {
    const pose = tanninPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = grovePose(next.t);
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

export function beginTrick(kind: OakTrickKind, x: number, facing: 1 | -1): OakTrick {
  const anim: TrickAnim =
    kind === "bole"
      ? "sit"
      : kind === "acorn"
        ? "talk"
        : kind === "sinus"
          ? "sit"
          : kind === "gall"
            ? "talk"
            : kind === "taproot"
              ? "play"
              : kind === "catkin"
                ? "play"
                : kind === "tyloses"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "bole" ? "hold" : "go",
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

export function bolePose(t: number) {
  const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
  return {
    lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
    rot: 4.8 + breath * 7.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  const s = smoothstep(u);
  return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4.8 * (1 - s) };
}

/** Acorn — mast drop to the dish. Never named drop/seed. */
export function acornPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.acorn));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.84, rot: s * -9.6 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const hang = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * hang * 0.42,
      lift: 3.84 - s * 0.96 + Math.abs(hang) * 0.72,
      rot: facing * (-9.6 + hang * 14.4),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const land = smoothstep(s);
    return {
      x: fromX + facing * (1 - land) * 0.48,
      lift: 2.88 * (1 - land * 1.02),
      rot: facing * (-4.8 + land * 9.6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 0.96 * (1 - s),
    rot: facing * (3.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Sinus — lobed leaf sway. Never named lobe/sway/frond. */
export function sinusPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sinus));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.12, rot: s * -12 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const wave = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * wave * 0.48,
      lift: 3.12 + Math.abs(wave) * 1.92,
      rot: facing * (-12 + wave * 16.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.16 * (1 - s),
    rot: facing * (-7.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Gall — curiosity tip inspect. Not Sol nod. */
export function gallPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gall));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.88, rot: s * 16.8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const tip = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * tip * 0.48,
      lift: 2.88 + Math.abs(tip) * 1.68,
      rot: facing * (16.8 + tip * 14.4),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.6,
      lift: 3.84 - settle * 1.44,
      rot: facing * (16.8 - settle * 19.2),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: facing * (-3.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Taproot — deep root settle. Never named root/dig. */
export function taprootPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.taproot));
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.15) / 0.4;
    const press = smoothstep(s);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.3,
      lift: 3.12 * (1 - press * 0.84),
      rot: facing * (12 - press * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.8) {
    const s = (u - 0.55) / 0.25;
    const dig = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * dig * 0.24,
      lift: 0.96 + Math.abs(dig) * 0.72,
      rot: facing * (-4.8 + dig * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 0.72 * (1 - s),
    rot: facing * (-2.4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Catkin — hanging male flower tassel. Not Fan flutter/drop/gold. */
export function catkinPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.catkin));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.16, rot: s * -9.6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const shimmer = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 0.72 + shimmer * 0.24),
      lift: 2.16 + Math.abs(shimmer) * 1.92,
      rot: facing * (-9.6 + shimmer * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const hang = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * 0.72,
      lift: 3.36 + Math.abs(hang) * 0.96,
      rot: facing * (4.8 + hang * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.72 * (1 - s),
    lift: 2.16 * (1 - s) + s * 0.24,
    rot: facing * (4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Tyloses — white-oak vessel plug. Not barrel, not Velvet cork, not Ledger fossil. */
export function tylosesPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tyloses));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const plug = smoothstep(s);
    return {
      x: fromX + facing * plug * 0.6,
      lift: 3.12 + plug * 2.88,
      rot: facing * (12 + plug * 9.6),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const seal = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (0.6 + seal * 0.36),
      lift: 5.76 + Math.abs(seal) * 0.96,
      rot: facing * (7.2 + seal * 16.8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.6 * (1 - s),
    lift: 3.12 * (1 - s),
    rot: facing * (7.2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: OakTrick, dt: number, flags: TrickFlags): OakTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "acorn" &&
    trick.kind !== "sinus" &&
    trick.kind !== "gall" &&
    trick.kind !== "taproot" &&
    trick.kind !== "catkin" &&
    trick.kind !== "tyloses"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: OakTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bole") {
    if (next.t < BOLE_HOLD) {
      const pose = bolePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BOLE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BOLE_HOLD);
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
  let pose;
  if (next.kind === "acorn") pose = acornPose(next.t, fromX, trick.facing);
  else if (next.kind === "sinus") pose = sinusPose(next.t, fromX, trick.facing);
  else if (next.kind === "gall") pose = gallPose(next.t, fromX, trick.facing);
  else if (next.kind === "taproot") pose = taprootPose(next.t, fromX, trick.facing);
  else if (next.kind === "catkin") pose = catkinPose(next.t, fromX, trick.facing);
  else pose = tylosesPose(next.t, fromX, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
