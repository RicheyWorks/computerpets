/** Frill ground tricks while idle — ultra-polish pass. House oyster-mushroom SHELF life — lamella / imbricate / lasso / margin / pleurotus / sporulate / hypha personality (lamella gill-face tip toward the lamp — never named fan (Fan/ginkgo) / frill as trick kind / lean / flush (ethogram-old) / dig (Thimble) / nest (Clip+Column) / bank (Lula+Bank) / buzz (Relay) / dance (Rui) / hover (Sepia) / festoon/capped/midrib/stores/tessera/alveoli/foundation (Wax), imbricate overlapping shelf-stack settle on the blotter (desk stack — not window-play SHELF) — never named shelf as trick kind / warts (Cap owns warts; Cap is next) / tuft (Felt) / frond (Vein) / curl (Burr) / brood as trick kind / hold as trick kind / cell (mason) / cerumen/batumen (Pot) / circle/liner (Disc), lasso nematode-trap mycelium desk motion (Pleurotus carnivory — species-true) — never named pipe/retinue/duel/royal (Keep) / hex (Comb) / partition (Auger) / plug (Mortar) / fossor (Thrum) / shaft (Bank), margin wavy cap-edge settle — never named frill as trick kind / fan (Fan) / sheen (Sheen+Disk) / glint (Coin) / gleam (Ground) / shine (Ember) / wax as trick kind / honey/mead (Comb happy) / nectar (Disk) / pollen (Moth) / vessel/spout (Pot) / mass (Bank), pleurotus long hold desk life as Pleurotus ostreatus with ostreatus / pulmonarius / eryngii thank-yous — never named mellifera (Hum) / regina (Keep) / andrena (Bank) / langstroth/topbar/warre (Wax) / hive/hex (Comb), sporulate white spore-print dump (species-true Pleurotus white spores — never named print/spore (Felt moss spore) / puff (puffball) / dust/powder/cloud/haze/mist/spray), hypha exploratory mycelial tip (species-true — never named mycelium as trick kind / dig (Thimble) / shaft (Bank) / thread (Thread guest) / root/rhizoid (Felt) / lasso (own nematode trap — different motion)); not Wax/Comb/Hum/Keep/Cap/Felt/Vein/Fan peer copies. Sporulate is iconic oyster white-spore dump (not Felt spore, not puffball puff). Hypha is iconic mycelial tip explore (not lasso trap, not Thimble dig). Window-play SHELF unchanged — never names shelf. Ethogram keeps pleurotus sit_hold; adds lamella/imbricate/lasso/margin/sporulate/hypha softs + freeze (replaces thin lean/flush/still). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via oyster.wav. Thank-yous ostreatus / pulmonarius / eryngii. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `oyster-tricks.js`. True house oyster-mushroom desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/honey_drone/Hum/honey_queen/Keep/honeycomb/Wax/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood or *Dragon electrical clone. Next guest ultra is Shard / silica. Saprotroph Pleurotus shelf mushroom desk life only — not a bee, not a plant, not Wax honeycomb place, not Cap fly agaric. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "oyster";
export const TRICKS = ["lamella", "imbricate", "lasso", "margin", "pleurotus", "sporulate", "hypha"] as const;
export const HAPPY = ["ostreatus", "pulmonarius", "eryngii"] as const;
export type OysterTrickKind = (typeof TRICKS)[number];
export type OysterHappyKind = (typeof HAPPY)[number];
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

export type OysterTrick = {
  kind: OysterTrickKind;
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

export type OysterHappy = {
  kind: OysterHappyKind;
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

export const HAPPY_DUR: Record<OysterHappyKind, number> = {
  ostreatus: 1.28,
  pulmonarius: 1.16,
  eryngii: 1.22,
};

/** Pleurotus hold — Frill parks oyster-mushroom calm on the blotter. Not window-play SHELF. */
export const PLEUROTUS_HOLD = 10.8;
export const RELEASE_S = 0.62;

export const DUR: Record<OysterTrickKind, number> = {
  pleurotus: PLEUROTUS_HOLD + RELEASE_S,
  lamella: 1.58,
  imbricate: 1.64,
  lasso: 1.48,
  margin: 1.56,
  sporulate: 1.68,
  hypha: 1.72,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: OysterTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "pleurotus") return 38 + roll * 24;
  if (kind === "sporulate" || kind === "hypha" || kind === "imbricate") return 12 + roll * 9;
  if (kind === "lamella" || kind === "lasso" || kind === "margin") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: OysterTrickKind | string | null) {
  if (musicOn) return "pleurotus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "pleurotus") {
    if (roll < 0.18) return "lamella" as const;
    if (roll < 0.34) return "imbricate" as const;
    if (roll < 0.5) return "lasso" as const;
    if (roll < 0.66) return "margin" as const;
    if (roll < 0.83) return "sporulate" as const;
    return "hypha" as const;
  }
  if (lastKind === "lamella") {
    if (roll < 0.2) return "pleurotus" as const;
    if (roll < 0.36) return "imbricate" as const;
    if (roll < 0.52) return "lasso" as const;
    if (roll < 0.68) return "margin" as const;
    if (roll < 0.84) return "sporulate" as const;
    return "hypha" as const;
  }
  if (lastKind === "imbricate") {
    if (roll < 0.18) return "pleurotus" as const;
    if (roll < 0.34) return "lamella" as const;
    if (roll < 0.5) return "lasso" as const;
    if (roll < 0.66) return "margin" as const;
    if (roll < 0.83) return "sporulate" as const;
    return "hypha" as const;
  }
  if (lastKind === "sporulate" || lastKind === "hypha") {
    if (roll < 0.16) return "pleurotus" as const;
    if (roll < 0.32) return "lamella" as const;
    if (roll < 0.48) return "imbricate" as const;
    if (roll < 0.64) return "lasso" as const;
    if (roll < 0.8) return "margin" as const;
    return lastKind === "sporulate" ? ("hypha" as const) : ("sporulate" as const);
  }
  if (roll < 0.14) return "pleurotus" as const;
  if (roll < 0.28) return "lamella" as const;
  if (roll < 0.42) return "imbricate" as const;
  if (roll < 0.56) return "lasso" as const;
  if (roll < 0.7) return "margin" as const;
  if (roll < 0.85) return "sporulate" as const;
  return "hypha" as const;
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
  return key === TRICK_KEY || key === "frill";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: OysterHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as OysterHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: OysterHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: OysterHappyKind | string, x: number, facing: 1 | -1): OysterHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as OysterHappyKind) : "ostreatus";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "ostreatus" ? "talk" : name === "pulmonarius" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function ostreatusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ostreatus));
  if (u < 0.2) {
    const s = u / 0.2;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const tick = Math.sin(t * 1.72);
    return {
      lift: 2.8 + Math.abs(tick) * 1.4,
      rot: 12 + tick * 10,
      dx: tick * 0.12,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "talk" as TrickAnim };
}

export function pulmonariusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.pulmonarius));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 3.0, rot: s * -10, dx: 0, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const sweet = Math.sin(t * 2.05);
    return {
      lift: 3.0 + Math.abs(sweet) * 1.5,
      rot: -10 + sweet * 14,
      dx: sweet * 0.14,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.0 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function eryngiiPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.72) * 8,
    dx: Math.sin(t * 0.4) * -0.12,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: OysterHappy, dt: number, flags: TrickFlags): OysterHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: OysterHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "ostreatus") {
    const pose = ostreatusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pulmonarius") {
    const pose = pulmonariusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = eryngiiPose(next.t);
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

export function beginTrick(kind: OysterTrickKind, x: number, facing: 1 | -1): OysterTrick {
  const anim: TrickAnim =
    kind === "pleurotus"
      ? "sit"
      : kind === "lamella"
        ? "play"
        : kind === "imbricate"
          ? "talk"
          : kind === "lasso"
            ? "talk"
            : kind === "margin"
              ? "sit"
              : kind === "sporulate"
                ? "sit"
                : kind === "hypha"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "pleurotus" ? "hold" : "go",
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

export function pleurotusPose(t: number) {
  const breath = Math.sin(t * 0.42) + 0.06 * Math.sin(t * 1.15);
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: 4 + breath * 6,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  const s = smoothstep(u);
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 4 * (1 - s) };
}

/** Lamella — gill-face tip toward the lamp. Never named fan/frill/lean/flush. */
export function lamellaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lamella));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.16) / 0.36;
    const bob = Math.sin(s * Math.PI * 1.8);
    return {
      x: fromX + facing * bob * 0.35,
      lift: 3.2 - s * 0.8 + Math.abs(bob) * 0.6,
      rot: facing * (-8 + bob * 12),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.82) {
    const s = (u - 0.52) / 0.3;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.4,
      lift: 2.4 * (1 - settle * 0.85),
      rot: facing * (-4 + settle * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 0.8 * (1 - s),
    rot: facing * (3 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Imbricate — overlapping shelf-stack settle on the blotter. Never named shelf/warts. */
export function imbricatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.imbricate));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * -10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const open = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * open * 0.4,
      lift: 2.6 + Math.abs(open) * 1.6,
      rot: facing * (-10 + open * 14),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Lasso — nematode-trap mycelium desk motion. Never named dig/shaft/pipe. */
export function lassoPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lasso));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.4, rot: s * 14 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const press = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * press * 0.4,
      lift: 2.4 + Math.abs(press) * 1.4,
      rot: facing * (14 + press * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const settle = smoothstep(s);
    return {
      x: fromX + facing * (1 - settle) * 0.5,
      lift: 3.2 - settle * 1.2,
      rot: facing * (14 - settle * 16),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * (-3 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Margin — wavy cap-edge settle. Never named frill/fan/sheen. */
export function marginPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.margin));
  if (u < 0.15) {
    const s = smoothstep(u / 0.15);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.15) / 0.4;
    const cup = smoothstep(s);
    return {
      x: fromX + facing * Math.sin(s * Math.PI) * 0.25,
      lift: 2.6 * (1 - cup * 0.7),
      rot: facing * (10 - cup * 14),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.8) {
    const s = (u - 0.55) / 0.25;
    const hold = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * hold * 0.2,
      lift: 0.8 + Math.abs(hold) * 0.6,
      rot: facing * (-4 + hold * 10),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 0.6 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

/** Sporulate — white spore-print dump. Species-true Pleurotus spores — never named spore/print/puff. */
export function sporulatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sporulate));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 1.8, rot: s * -8 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const rock = Math.sin(s * Math.PI * 4.2);
    return {
      x: fromX + facing * (s * 0.6 + rock * 0.2),
      lift: 1.8 + Math.abs(rock) * 1.6,
      rot: facing * (-8 + rock * 14),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.55) / 0.23;
    const spin = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * 0.6,
      lift: 2.8 + Math.abs(spin) * 0.8,
      rot: facing * (4 + spin * 10),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.6 * (1 - s),
    lift: 1.8 * (1 - s) + s * 0.2,
    rot: facing * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

/** Hypha — exploratory mycelial tip. Species-true — never named dig/thread/lasso. */
export function hyphaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hypha));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const sip = smoothstep(s);
    return {
      x: fromX + facing * sip * 0.5,
      lift: 2.6 + sip * 2.4,
      rot: facing * (10 + sip * 8),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const drink = Math.sin(s * Math.PI * 3.2);
    return {
      x: fromX + facing * (0.5 + drink * 0.3),
      lift: 4.8 + Math.abs(drink) * 0.8,
      rot: facing * (6 + drink * 14),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.5 * (1 - s),
    lift: 2.6 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: OysterTrick, dt: number, flags: TrickFlags): OysterTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "lamella" &&
    trick.kind !== "imbricate" &&
    trick.kind !== "lasso" &&
    trick.kind !== "margin" &&
    trick.kind !== "sporulate" &&
    trick.kind !== "hypha"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: OysterTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "pleurotus") {
    if (next.t < PLEUROTUS_HOLD) {
      const pose = pleurotusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PLEUROTUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PLEUROTUS_HOLD);
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
  if (next.kind === "lamella") pose = lamellaPose(next.t, fromX, trick.facing);
  else if (next.kind === "imbricate") pose = imbricatePose(next.t, fromX, trick.facing);
  else if (next.kind === "lasso") pose = lassoPose(next.t, fromX, trick.facing);
  else if (next.kind === "margin") pose = marginPose(next.t, fromX, trick.facing);
  else if (next.kind === "sporulate") pose = sporulatePose(next.t, fromX, trick.facing);
  else pose = hyphaPose(next.t, fromX, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
