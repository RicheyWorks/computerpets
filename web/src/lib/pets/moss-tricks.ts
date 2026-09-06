/** Felt ground tricks while idle. House sheet moss — tuft / bead / spore / cushion / thatch personality (soft carpet swell as tuft — never named swell (Sol owns swell as thank-you), dew bead, spore lift as spore — never named lift (Ember owns lift), cushion creep as cushion — never named creep (Still window owns creep) / crawl (Cling owns crawl) / moss (Sash owns moss), quiet green thatch desk life on the blotter felt; not Door hinge/pharynx/knot/lurk/jamb, Kite wing/lobe/gyre/vault/span, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, or snake guests Sash seam/moss/lap copies). Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop moss-tricks.js. Not a Rui, cat, dog, rabbit, hamster/Clip, guinea pig, turtle/Ink, goldfish/Coin, budgie, fox, penguin, parrot, ferret, hedgehog/Burr, chinchilla, axolotl/Bloom, toucan, iguana/Sol, dragon/Vesper, phoenix/Ember, ball-python/Nori, corn-snake/Saffron, kingsnake/Bandit, green-tree-python/Jade, hognose/Bluff, garter/Sash, boa/Lula, milk-snake/Coral, rosy-boa/Blush, carpet-python/Atlas, octopus/Cup, cuttlefish/Sepia, nautilus/Chamber, moon-jelly/Pulse, sea-star/Cling, hermit-crab/Tenant, horseshoe-crab/Ledger, seahorse/Anchor, manta/Kite, moray/Door, or *Dragon electrical (Relay/Fuse/Ground) move clone. Window-play LEAN unchanged — never names lean. Special carpet ethogram unchanged — never names carpet as a trick. Sash owns moss; Sol owns swell as thank-you and press as a trick; Ember owns lift; Cling owns crawl/damp/press/tide; Still window owns creep; Burr owns root; Coin owns flare; Phoenix owns lift; Fuse owns pulse as thank-you; Chamber owns quiet as thank-you; Ledger owns page as thank-you; Jade owns treaty as thank-you. Plant/bryophyte desk life only — not an animal or moray copy. No cry inventing — thank-yous are silent desk motion only. */

export const TRICK_KEY = "moss";
export const TRICKS = ["tuft", "bead", "spore", "cushion", "thatch"] as const;
export const HAPPY = ["humid", "velvet", "meadow"] as const;
export type MossTrickKind = (typeof TRICKS)[number];
export type MossHappyKind = (typeof HAPPY)[number];
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

export type MossTrick = {
  kind: MossTrickKind;
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

export type MossHappy = {
  kind: MossHappyKind;
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

export const HAPPY_DUR = { humid: 1.28, velvet: 1.16, meadow: 1.22 } as const;
export const THATCH_HOLD = 12.4;
export const RELEASE_S = 0.72;
export const DUR = { thatch: THATCH_HOLD + RELEASE_S, tuft: 1.46, bead: 1.22, spore: 1.38, cushion: 1.52 } as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MossTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "thatch") return 50 + roll * 30;
  if (kind === "tuft") return 15 + roll * 11;
  if (kind === "cushion") return 16 + roll * 12;
  return justFinished ? 10.8 + roll * 8 : 5.4 + roll * 6;
}
export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MossTrickKind | string | null) {
  if (musicOn) return "thatch" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "thatch") {
    if (roll < 0.26) return "tuft" as const;
    if (roll < 0.48) return "bead" as const;
    if (roll < 0.72) return "spore" as const;
    return "cushion" as const;
  }
  if (lastKind === "tuft") {
    if (roll < 0.28) return "thatch" as const;
    if (roll < 0.5) return "bead" as const;
    if (roll < 0.72) return "spore" as const;
    return "cushion" as const;
  }
  if (lastKind === "bead") {
    if (roll < 0.22) return "thatch" as const;
    if (roll < 0.44) return "tuft" as const;
    if (roll < 0.66) return "spore" as const;
    return "cushion" as const;
  }
  if (roll < 0.2) return "thatch" as const;
  if (roll < 0.4) return "tuft" as const;
  if (roll < 0.6) return "bead" as const;
  if (roll < 0.8) return "spore" as const;
  return "cushion" as const;
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
  return key === TRICK_KEY || key === "felt";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MossHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MossHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MossHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MossHappyKind | string, x: number, facing: 1 | -1): MossHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MossHappyKind) : "humid";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "humid" ? "talk" : name === "velvet" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function humidPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.humid));
  if (u < 0.22) {
    const s = u / 0.22;
    return { lift: s * 0.08, rot: s * 3.2, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const bead = Math.sin(t * 1.55);
    return {
      lift: 0.08 + Math.abs(bead) * 0.04,
      rot: 3.2 + bead * 2.1,
      dx: bead * 0.02,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 0.06 * (1 - s), rot: 2.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function velvetPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.velvet));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 0.14, rot: s * -2.4, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.76) {
    const nap = Math.sin(t * 1.7);
    return {
      lift: 0.14 + Math.abs(nap) * 0.05,
      rot: -2.4 + nap * 2.2,
      dx: nap * 0.03,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 0.1 * (1 - s), rot: -1.4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function meadowPose(t: number) {
  return {
    lift: 0.03 + Math.abs(Math.sin(t * 0.58)) * 0.04,
    rot: Math.sin(t * 0.72) * 1.1,
    dx: Math.sin(t * 0.4) * -0.04,
    anim: "sit" as TrickAnim,
  };
}
export function stepHappy(happy: MossHappy, dt: number, flags: TrickFlags): MossHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MossHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "humid") {
    const pose = humidPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "velvet") {
    const pose = velvetPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = meadowPose(next.t);
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

export function beginTrick(kind: MossTrickKind, x: number, facing: 1 | -1): MossTrick {
  const anim: TrickAnim =
    kind === "thatch"
      ? "sit"
      : kind === "tuft"
        ? "sit"
        : kind === "bead"
          ? "talk"
          : kind === "spore"
            ? "play"
            : kind === "cushion"
              ? "sit"
              : "sit";
  return {
    kind: kind,
    phase: kind === "thatch" ? "hold" : "go",
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

export function thatchPose(t: number) {
  const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
  return {
    lift: 0.04 + Math.abs(Math.sin(t * 0.42)) * 0.035,
    rot: 1.6 + breath * 1.5,
  };
}
export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.04 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 1.4 * (1 - u) };
}
export function tuftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tuft));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 0.1, rot: s * 2.5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    const swell = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * Math.abs(swell) * 0.02,
      lift: 0.1 + Math.abs(swell) * 0.14,
      rot: facing * (2.5 + swell * 3.2),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 0.1 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function beadPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bead));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 0.06, rot: s * 6 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const drop = smoothstep(s);
    return {
      x: fromX + facing * drop * 0.1,
      lift: 0.06 + drop * 0.08,
      rot: facing * (6 - drop * 10),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const roll = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (0.1 + s * 0.06),
      lift: 0.14 - s * 0.06 + roll * 0.03,
      rot: facing * (-4 + roll * 3),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.16 * (1 - s),
    lift: 0.08 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function sporePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spore));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.08, rot: s * -1.5 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.14) / 0.28;
    const loft = smoothstep(s);
    return {
      x: fromX + facing * loft * 0.04,
      lift: 0.08 + loft * 0.32,
      rot: facing * (-1.5 + loft * 4),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.42) / 0.3;
    const drift = Math.sin(s * Math.PI * 2.6);
    return {
      x: fromX + facing * (0.04 + drift * 0.05),
      lift: 0.4 - s * 0.18 + Math.abs(drift) * 0.04,
      rot: facing * (2.5 + drift * 3.5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.04 * (1 - s),
    lift: 0.2 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function cushionPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cushion));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 0.05, rot: s * 1.2 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.16) / 0.54;
    const pulse = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (s * 0.28 + pulse * 0.02),
      lift: 0.05 + Math.abs(pulse) * 0.04,
      rot: facing * (1.2 + pulse * 1.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX + facing * 0.28 * (1 - s * 0.15),
    lift: 0.05 * (1 - s),
    rot: facing * (1 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}
export function stepTrick(trick: MossTrick, dt: number, flags: TrickFlags): MossTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "bead" && trick.kind !== "spore" && trick.kind !== "cushion") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MossTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "thatch") {
    if (next.t < THATCH_HOLD) {
      const pose = thatchPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < THATCH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - THATCH_HOLD);
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
  if (next.kind === "tuft") {
    const pose = tuftPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bead") {
    const pose = beadPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "spore") {
    const pose = sporePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = cushionPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
