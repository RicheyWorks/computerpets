/** Arm ground tricks while idle. House saguaro — rib / branch / nocturne / areole / sentinel personality (ribbed-column rain swell on the sand tray — never named column (Moth owns column) / bole (Mast owns bole) / press (Sol owns press) / swell as thank-you (Sol owns swell), budding arm branch reach — never named arm as window-collision / labellum (Moth owns labellum) / lobe (Kite owns lobe) / bough (Jade owns bough), nocturne night-bloom crown open — never named bloom as axolotl-guest collision / spike (Moth owns spike) / corolla (Disk owns corolla) / open (Disk window owns open) / flare (Coin owns flare) / nod (orchid ethogram / Sol owns nod), areole spine hush on the ribs — never named bristle (Burr / porcupine ethogram) / hush as shared verb-only / curl (Burr owns curl) / tuck (Ink owns tuck), desert-sentinel desk life under the lamp; not Moth labellum/velamen/column/spike/bark, Disk pad/corolla/rhizome/calyx/sheen, Mast acorn/sinus/gall/taproot/bole, Fan biloba/notch/flutter/drop/amber, Vein frond/rachis/fiddle/pinna/saucer, Felt tuft/bead/spore/cushion/thatch, Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, parrot fan/flash, Blush mesa/arroyo, Sol sun/dewlap/nod/press/flick, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop saguaro-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, sheet-moss/Felt, maidenhair/Vein, ginkgo/Fan, oak/Mast, water-lily/Disk, moth-orchid/Moth, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play STORE unchanged — never names store. Special still/lean/nod ethogram unchanged — never names still/lean/nod as tricks. Sash owns moss; Felt owns tuft/bead/spore/cushion/thatch and humid/velvet/meadow; Vein owns frond/rachis/fiddle/pinna/saucer and mist/filigree/shade; Fan owns biloba/notch/flutter/drop/amber and ochre/gilt/linger; Mast owns acorn/sinus/gall/taproot/bole and cupule/tannin/grove; Disk owns pad/corolla/rhizome/calyx/sheen and silt/nectar/dew; Moth owns labellum/velamen/column/spike/bark and pollen/perfume/pearl; Sol owns swell as thank-you, press/nod as tricks; Ember owns lift; Cling owns crawl/damp/press/tide; Still/Felt window owns lean/creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you and pearl as thank-you; Ledger owns page as thank-you and fossil as trick; Jade owns treaty as thank-you and sway/heat as tricks; Parrot owns fan; Kite owns lobe; Bloom owns gill; Blush owns mesa/arroyo. Sonoran saguaro desk life only — not a moth-orchid Moth copy, water-lily Disk copy, oak Mast copy, ginkgo Fan copy, fern Vein copy, bryophyte Felt copy, iguana Sol copy, or rosy-boa Blush mesa copy. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "saguaro";
export const TRICKS = ["rib", "branch", "nocturne", "areole", "sentinel"] as const;
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

export const HAPPY_DUR = { monsoon: 1.28, creosote: 1.22, agave: 1.34 } as const;
export const SENTINEL_HOLD = 13.1;
export const RELEASE_S = 0.82;
export const DUR = { sentinel: SENTINEL_HOLD + RELEASE_S, rib: 1.48, branch: 1.55, nocturne: 1.68, areole: 1.35 } as const;

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
  if (kind === "sentinel") return 54 + roll * 28;
  if (kind === "rib") return 15 + roll * 10;
  if (kind === "nocturne") return 18 + roll * 12;
  return justFinished ? 11.2 + roll * 8 : 5.8 + roll * 6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SaguaroTrickKind | string | null) {
  if (musicOn) return "sentinel" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "sentinel") {
    if (roll < 0.26) return "rib" as const;
    if (roll < 0.48) return "nocturne" as const;
    if (roll < 0.72) return "branch" as const;
    return "areole" as const;
  }
  if (lastKind === "rib") {
    if (roll < 0.28) return "sentinel" as const;
    if (roll < 0.5) return "nocturne" as const;
    if (roll < 0.72) return "branch" as const;
    return "areole" as const;
  }
  if (lastKind === "nocturne") {
    if (roll < 0.22) return "sentinel" as const;
    if (roll < 0.44) return "rib" as const;
    if (roll < 0.66) return "branch" as const;
    return "areole" as const;
  }
  if (roll < 0.2) return "sentinel" as const;
  if (roll < 0.4) return "rib" as const;
  if (roll < 0.6) return "nocturne" as const;
  if (roll < 0.8) return "branch" as const;
  return "areole" as const;
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
    if (u < 0.22) {
      const s = u / 0.22;
      return { lift: s * 0.045, rot: s * -1.1, dx: 0, anim: "sit" as TrickAnim };
    }
    if (u < 0.76) {
      const rain = Math.sin(t * 0.95);
      return {
        lift: 0.045 + Math.abs(rain) * 0.028,
        rot: -1.1 + rain * 1.2,
        dx: rain * 0.008,
        anim: "sit" as TrickAnim,
      };
    }
    const s = (u - 0.76) / 0.24;
    return { lift: 0.032 * (1 - s), rot: -0.7 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
  }
export function creosotePose(t: number) {
    const u = Math.max(0, Math.min(1, t / HAPPY_DUR.creosote));
    if (u < 0.16) {
      const s = u / 0.16;
      return { lift: s * 0.16, rot: s * 2.1, dx: 0, anim: "play" as TrickAnim };
    }
    if (u < 0.68) {
      const scent = Math.sin(t * 1.55);
      return {
        lift: 0.16 + Math.abs(scent) * 0.045,
        rot: 2.1 + scent * 2.4,
        dx: scent * 0.014,
        anim: "play" as TrickAnim,
      };
    }
    const s = (u - 0.68) / 0.32;
    return { lift: 0.1 * (1 - s), rot: 1.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
  }
export function agavePose(t: number) {
    return {
      lift: 0.032 + Math.abs(Math.sin(t * 0.58)) * 0.034,
      rot: Math.sin(t * 0.72) * 1.45,
      dx: Math.sin(t * 0.4) * 0.014,
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
    const breath = Math.sin(t * 0.22) + 0.03 * Math.sin(t * 0.9);
    return {
      lift: 0.04 + Math.abs(Math.sin(t * 0.28)) * 0.018,
      rot: 0.35 + breath * 0.55,
    };
  }
export function releasePose(t: number) {
    const u = Math.max(0, Math.min(1, t / RELEASE_S));
    return { lift: 0.04 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 0.35 * (1 - u) };
  }
export function ribPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.rib));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * 0.085, rot: s * -1.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.7) {
      const s = (u - 0.2) / 0.5;
      const swell = Math.sin(s * Math.PI * 2.2);
      return {
        x: fromX + facing * swell * 0.008,
        lift: 0.085 + Math.abs(swell) * 0.035,
        rot: facing * (-1.8 + swell * 2.4),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.7) / 0.3);
    return {
      x: fromX,
      lift: 0.085 * (1 - s),
      rot: facing * (-1.1 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function branchPose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.branch));
    if (u < 0.18) {
      const s = smoothstep(u / 0.18);
      return { x: fromX, lift: s * 0.07, rot: s * 6.5 * facing, anim: "play" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.18) / 0.37;
      const reach = smoothstep(s);
      return {
        x: fromX + facing * reach * 0.095,
        lift: 0.07 + reach * 0.06,
        rot: facing * (6.5 + reach * 4.2),
        anim: "play" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const hold = Math.sin(s * Math.PI * 1.5);
      return {
        x: fromX + facing * (0.095 + hold * 0.012),
        lift: 0.13 + Math.abs(hold) * 0.02,
        rot: facing * (10.7 + hold * 1.5),
        anim: "play" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX + facing * 0.095 * (1 - s),
      lift: 0.13 * (1 - s),
      rot: facing * (6.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function nocturnePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.nocturne));
    if (u < 0.24) {
      const s = smoothstep(u / 0.24);
      return { x: fromX, lift: s * 0.06, rot: s * 1.5 * facing, anim: "talk" as TrickAnim };
    }
    if (u < 0.6) {
      const s = (u - 0.24) / 0.36;
      const open = smoothstep(s);
      return {
        x: fromX + facing * open * 0.012,
        lift: 0.06 + open * 0.2,
        rot: facing * (1.5 + open * 7.8),
        anim: "talk" as TrickAnim,
      };
    }
    if (u < 0.86) {
      const s = (u - 0.6) / 0.26;
      const bloom = Math.sin(s * Math.PI * 1.7);
      return {
        x: fromX + facing * (0.012 + bloom * 0.01),
        lift: 0.26 + Math.abs(bloom) * 0.028,
        rot: facing * (9.3 + bloom * 2.0),
        anim: "talk" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.86) / 0.14);
    return {
      x: fromX,
      lift: 0.26 * (1 - s),
      rot: facing * (5.2 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function areolePose(t: number, fromX: number, facing: 1 | -1) {
    const u = Math.max(0, Math.min(1, t / DUR.areole));
    if (u < 0.2) {
      const s = smoothstep(u / 0.2);
      return { x: fromX, lift: s * 0.025, rot: s * -4.8 * facing, anim: "sit" as TrickAnim };
    }
    if (u < 0.55) {
      const s = (u - 0.2) / 0.35;
      const hush = smoothstep(s);
      return {
        x: fromX - facing * hush * 0.022,
        lift: 0.025 + hush * 0.015,
        rot: facing * (-4.8 - hush * 2.6),
        anim: "sit" as TrickAnim,
      };
    }
    if (u < 0.82) {
      const s = (u - 0.55) / 0.27;
      const tick = Math.sin(s * Math.PI * 2.6);
      return {
        x: fromX - facing * (0.022 + tick * 0.006),
        lift: 0.04 + Math.abs(tick) * 0.012,
        rot: facing * (-7.4 + tick * 1.8),
        anim: "sit" as TrickAnim,
      };
    }
    const s = smoothstep((u - 0.82) / 0.18);
    return {
      x: fromX - facing * 0.022 * (1 - s),
      lift: 0.04 * (1 - s),
      rot: facing * (-4.0 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
export function stepTrick(trick: SaguaroTrick, dt: number, flags: TrickFlags): SaguaroTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "rib" && trick.kind !== "branch" && trick.kind !== "nocturne" && trick.kind !== "areole") {
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
  if (next.kind === "rib") {
    const pose = ribPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "branch") {
    const pose = branchPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nocturne") {
    const pose = nocturnePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = areolePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
