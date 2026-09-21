/** Felt ground tricks while idle — ultra-polish pass. House sheet moss — tuft / bead / spore / cushion / thatch / rhizoid / seta personality (soft carpet swell as tuft — never named swell (Sol owns swell as thank-you), dew bead, spore puff as spore — never named lift (Ember owns lift) / puff (Puff guest), cushion creep as cushion — never named creep (Still window owns creep) / crawl (Cling owns crawl) / moss (Sash owns moss), quiet green thatch desk life on the blotter felt, rhizoid grip anchoring into the blotter (bryophyte holdfast filaments — never named root (Burr) / holdfast (ethogram) / cling), seta sporophyte stalk stretch + capsule nod (never named peristome/operculum — other guests; never named lift); not Door hinge/pharynx/knot/lurk/jamb/mucus/sentry, Kite wing/lobe/gyre/vault/span/breach/ram, Anchor coil/buoy/siphon/swivel/pouch, Ledger carapace/bookgill/telson/furrow/fossil, Tenant swap/antenna/scuttle/withdraw/vacancy, Ochre/Cling podia/righting/crawl/evert/penta, Pulse bell/oral/lucent/trail/medusa, Coin drift/gulp/flare/glint/dart, Ink soak/tuck, Clip nest, Bloom gill, or snake guests Sash seam/moss/lap copies). Rhizoid is the species-true sheet-moss anchor polish (not Burr root, not Cling crawl, not Door knot). Seta is the iconic sporophyte stalk stretch (not Ember lift, not spore puff alone, not window-play LEAN). Window-play LEAN unchanged — never names lean. Never names carpet as a trick. Ethogram keeps thatch sit_hold; adds tuft/bead/spore/cushion/rhizoid/seta softs + freeze (replaces thin lean/nod/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via moss.wav. Thank-yous humid / velvet / meadow. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `moss-tricks.js`. True house-moss desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre/hermit_crab/Tenant/horseshoe_crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids lean/swell/lift/creep/crawl/moss/root/holdfast/peristome/operculum/hinge/mucus/sentry/podia/bell/drift/gulp/flare name collisions. Bird ultra (Soot→Ember) + Miso→Door done; skip Rui + birds. Amplitudes raised toward Rui richness; denser waits/weights (THATCH_HOLD=11.2 RELEASE_S=1.18). Vein densified. Fan densified. Next leftover Mast / oak. No cry inventing beyond house moss.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "moss";
export const TRICKS = ["tuft", "bead", "spore", "cushion", "thatch", "rhizoid", "seta"] as const;
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

export const HAPPY_DUR: Record<MossHappyKind, number> = {
  humid: 1.28,
  velvet: 1.16,
  meadow: 1.22,
};

/** Thatch hold — Felt parks the soft green carpet on the blotter. Not window-play LEAN. */
export const THATCH_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<MossTrickKind, number> = {
  thatch: THATCH_HOLD + RELEASE_S,
  tuft: 1.58,
  bead: 1.48,
  spore: 1.56,
  cushion: 1.64,
  rhizoid: 1.68,
  seta: 1.72,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MossTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "thatch") return 40 + roll * 26;
  if (kind === "rhizoid" || kind === "seta") return 12.8 + roll * 9.4;
  if (kind === "tuft" || kind === "bead" || kind === "spore" || kind === "cushion") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: MossTrickKind | string | null): MossTrickKind {
  if (musicOn) return "thatch";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "thatch" ? 0.72 : k === "rhizoid" || k === "seta" ? 1.28 : k === "tuft" || k === "bead" || k === "spore" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "tuft";
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
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const bead = Math.sin(t * 1.55);
    return {
      lift: 3.36 + Math.abs(bead) * 1.68,
      rot: 14.4 + bead * 12,
      dx: bead * 0.096,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function velvetPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.velvet));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 3.6, rot: s * -12, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.76) {
    const nap = Math.sin(t * 1.7);
    return {
      lift: 3.6 + Math.abs(nap) * 1.8,
      rot: -12 + nap * 16.8,
      dx: nap * 0.12,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.4 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function meadowPose(t: number) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
    rot: Math.sin(t * 0.864) * 9.6,
    dx: Math.sin(t * 0.48) * -0.144,
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
              : kind === "rhizoid"
                ? "sit"
                : kind === "seta"
                  ? "play"
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
    lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
    rot: 4.8 + breath * 7.2,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  const s = smoothstep(u);
  return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4.8 * (1 - s) };
}

/** Tuft — soft carpet swell / gametophore tip rise. Not Sol swell thank-you. */
export function tuftPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tuft));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.12, rot: s * 12 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.16) / 0.62;
    const swell = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * Math.abs(swell) * 0.42,
      lift: 3.12 + Math.abs(swell) * 1.92,
      rot: facing * (12 + swell * 14.4),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.16 * (1 - s),
    rot: facing * (7.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Bead — dew bead roll across the phyllid tip. Not Coin flare. */
export function beadPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bead));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.88, rot: s * 16.8 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const drop = smoothstep(s);
    return {
      x: fromX + facing * drop * 1.68,
      lift: 2.88 + drop * 2.16,
      rot: facing * (16.8 - drop * 21.6),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const roll = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * (1.68 + s * 0.72),
      lift: 4.8 - s * 1.68 + roll * 0.6,
      rot: facing * (-4.8 + roll * 9.6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 2.16 * (1 - s),
    lift: 2.4 * (1 - s),
    rot: facing * (-3.6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Spore — capsule puff / spore release loft. Not Ember lift. Not Puff guest. */
export function sporePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spore));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.64, rot: s * -7.2 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.14) / 0.28;
    const loft = smoothstep(s);
    return {
      x: fromX + facing * loft * 0.96,
      lift: 2.64 + loft * 3.84,
      rot: facing * (-7.2 + loft * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.42) / 0.3;
    const drift = Math.sin(s * Math.PI * 2.6);
    return {
      x: fromX + facing * (0.96 + drift * 0.54),
      lift: 6.24 - s * 2.16 + Math.abs(drift) * 0.72,
      rot: facing * (9.6 + drift * 14.4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 0.96 * (1 - s),
    lift: 2.88 * (1 - s),
    rot: facing * (7.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Cushion — mat creep across the blotter. Not Still creep. Not Cling crawl. */
export function cushionPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cushion));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.64, rot: s * 7.2 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.16) / 0.54;
    const pulse = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (s * 2.88 + pulse * 0.3),
      lift: 2.64 + Math.abs(pulse) * 1.44,
      rot: facing * (7.2 + pulse * 12),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX + facing * 2.88 * (1 - s * 0.24),
    lift: 1.92 * (1 - s),
    rot: facing * (4.8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Rhizoid — filament grip into the blotter. Not Burr root. Not Cling crawl. Not holdfast ethogram. */
export function rhizoidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rhizoid));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.16, rot: s * 9.6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const dig = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (s * 0.72 + dig * 0.24),
      lift: 2.16 - s * 1.08 + Math.abs(dig) * 0.6,
      rot: facing * (9.6 + dig * 16.8),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const hold = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * 0.72,
      lift: 1.08 + Math.abs(hold) * 0.54,
      rot: facing * (7.2 + hold * 9.6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.72 * (1 - s),
    lift: 1.08 * (1 - s) + s * 0.24,
    rot: facing * (4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Seta — sporophyte stalk stretch + capsule nod. Not Ember lift. Not spore puff alone. */
export function setaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.seta));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.12, rot: s * -9.6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const rise = smoothstep(s);
    return {
      x: fromX + facing * rise * 0.6,
      lift: 3.12 + rise * 3.36,
      rot: facing * (-9.6 + rise * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const nod = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (0.6 + nod * 0.36),
      lift: 6.24 + Math.abs(nod) * 0.96,
      rot: facing * (4.8 + nod * 19.2),
      anim: "play" as TrickAnim,
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

export function stepTrick(trick: MossTrick, dt: number, flags: TrickFlags): MossTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "tuft" &&
    trick.kind !== "bead" &&
    trick.kind !== "spore" &&
    trick.kind !== "cushion" &&
    trick.kind !== "rhizoid" &&
    trick.kind !== "seta"
  ) {
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
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  let pose;
  if (next.kind === "tuft") pose = tuftPose(next.t, fromX, trick.facing);
  else if (next.kind === "bead") pose = beadPose(next.t, fromX, trick.facing);
  else if (next.kind === "spore") pose = sporePose(next.t, fromX, trick.facing);
  else if (next.kind === "cushion") pose = cushionPose(next.t, fromX, trick.facing);
  else if (next.kind === "rhizoid") pose = rhizoidPose(next.t, fromX, trick.facing);
  else pose = setaPose(next.t, fromX, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
