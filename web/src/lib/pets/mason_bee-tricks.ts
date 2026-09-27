/** Mortar ground tricks while idle — ultra-polish pass. House blue orchard mason bee — trowel / beebread / orchard / plug / mudseptum / tubeprovision / osmia personality (trowel mandibular mud-mortar pack into an inkstone cell wall — never named daub (window DAUB) / seal (retired ethogram + special) / partition (Auger) / rasp (Auger) / gallery (Column) / chew / dig (Thimble) / gnaw (beaver) / fossor (Thrum) / nest (Clip + Column window) / bank (window DIG) / cell (ethogram talk), beebread pollen-nectar provision loaf pack into a solitary tube cell — never named corbicula (Comb) / scopa (Thrum) / pollen (Moth happy) / hive (Comb) / hex (Comb) / crumb (Column) / loaf (Whee ethogram talk), orchard gentle spring bloom visit — never named forage (Thrum window) / figure (Comb) / sonicate (Thrum) / picket (Auger) / hover (Sepia + retired ethogram) / lumber (Thrum) / thrum (Vesper) / drone (Hum window), plug mud entrance finish — never named seal / daub (window) / partition (Auger) / cap (Cap guest) / nest (Clip) / hive (Comb), mudseptum iconic Osmia mud partition-wall tamp between reed-tube cells (renamed from mudseptum, which Dam the beaver owns; not trowel shallow mortar / partition Auger / gallery Column / daub window), tubeprovision iconic Osmia solitary tube provision loaf shove (not beebread soft pack / corbicula Comb / scopa Thrum / hive Comb), osmia desk life as an Osmia lignaria blue orchard mason with hornfaced cousins in the thank-yous; not Comb / Thrum / Auger / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / Hum / Sheen / Cap / Disc / *Dragon copies). Mudseptum is the iconic Osmia mud-septum tamp (not trowel). Tubeprovision is the iconic tube provision shove (not beebread). Window-play DAUB unchanged — never names daub as a trick. Ethogram keeps osmia sit_hold; adds trowel/beebread/orchard/plug/mudseptum/tubeprovision softs + freeze (replaces thin seal/hover/still — Cap owns seal flavor; Sepia owns hover; window DAUB owns daub). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via mason_bee.wav. Thank-yous lignaria / cornifrons / osmiini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `mason_bee-tricks.js`. True house-mason desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/honey_drone/Hum/carpenter_bee/Auger/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids daub/seal/hover/still/partition/rasp/gallery/camponotus/fossor/bombus/hive/guard/thrum/circle/liner/cavity/parcel/megachile name collisions. Bird ultra + denser guests done; skip Rui + birds. Auger now owns tunnelrasp/baldflash dens; Thrum owns thoraxload/corbicularub. OSMIA_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Disc / leafcutter. Catalog 221. No cry inventing beyond house mason_bee.wav prefer. Never retouch Rui sprites. No gallery, not Column. No daub, not window DAUB. */
export const TRICK_KEY = "mason_bee";
export const TRICKS = ["trowel", "beebread", "orchard", "plug", "mudseptum", "tubeprovision", "osmia"] as const;
export const HAPPY = ["lignaria", "cornifrons", "osmiini"] as const;
export type MasonBeeTrickKind = (typeof TRICKS)[number];
export type MasonBeeHappyKind = (typeof HAPPY)[number];
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

export type MasonBeeTrick = {
  kind: MasonBeeTrickKind;
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

export type MasonBeeHappy = {
  kind: MasonBeeHappyKind;
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

export const HAPPY_DUR: Record<MasonBeeHappyKind, number> = {
  lignaria: 1.74,
  cornifrons: 1.86,
  osmiini: 1.78,
};

/** Osmia hold — Mortar parks Osmia lignaria calm on the blotter. Not window-play DAUB. */
export const OSMIA_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<MasonBeeTrickKind, number> = {
  osmia: OSMIA_HOLD + RELEASE_S,
  trowel: 2.46,
  beebread: 2.48,
  orchard: 2.42,
  plug: 2.44,
  mudseptum: 2.52,
  tubeprovision: 2.48,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: MasonBeeTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "osmia") return 38 + roll * 24;
  if (kind === "mudseptum" || kind === "tubeprovision" || kind === "beebread") return 12 + roll * 9;
  if (kind === "trowel" || kind === "orchard" || kind === "plug") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: MasonBeeTrickKind | string | null) {
  if (musicOn) return "osmia" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "osmia") {
    if (roll < 0.18) return "trowel" as const;
    if (roll < 0.34) return "beebread" as const;
    if (roll < 0.5) return "orchard" as const;
    if (roll < 0.66) return "plug" as const;
    if (roll < 0.83) return "mudseptum" as const;
    return "tubeprovision" as const;
  }
  if (lastKind === "trowel") {
    if (roll < 0.2) return "osmia" as const;
    if (roll < 0.36) return "beebread" as const;
    if (roll < 0.52) return "orchard" as const;
    if (roll < 0.68) return "plug" as const;
    if (roll < 0.84) return "mudseptum" as const;
    return "tubeprovision" as const;
  }
  if (lastKind === "beebread") {
    if (roll < 0.18) return "osmia" as const;
    if (roll < 0.34) return "trowel" as const;
    if (roll < 0.5) return "orchard" as const;
    if (roll < 0.66) return "plug" as const;
    if (roll < 0.83) return "mudseptum" as const;
    return "tubeprovision" as const;
  }
  if (lastKind === "mudseptum") {
    if (roll < 0.2) return "osmia" as const;
    if (roll < 0.36) return "trowel" as const;
    if (roll < 0.52) return "beebread" as const;
    if (roll < 0.68) return "orchard" as const;
    if (roll < 0.84) return "plug" as const;
    return "tubeprovision" as const;
  }
  if (roll < 0.16) return "osmia" as const;
  if (roll < 0.3) return "trowel" as const;
  if (roll < 0.44) return "beebread" as const;
  if (roll < 0.58) return "orchard" as const;
  if (roll < 0.72) return "plug" as const;
  if (roll < 0.86) return "mudseptum" as const;
  return "tubeprovision" as const;
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
  return key === TRICK_KEY || key === "mortar";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: MasonBeeHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as MasonBeeHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: MasonBeeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: MasonBeeHappyKind | string, x: number, facing: 1 | -1): MasonBeeHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as MasonBeeHappyKind) : "lignaria";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "lignaria" ? "talk" : name === "cornifrons" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function lignariaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.lignaria));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.8, rot: s * 8.5, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.76) {
    const tick = Math.sin(t * 12.4) + 0.24 * Math.sin(t * 24.8);
    return {
      lift: 2.8 + Math.abs(tick) * 1.1,
      rot: 8.5 + tick * 6.2,
      dx: tick * 0.35,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.76) / 0.24;
  return { lift: 1.2 * (1 - s), rot: 3.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function cornifronsPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.cornifrons));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 3.2, rot: s * -9.5, dx: s * 0.4, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const flash = Math.sin(t * 5.4) + 0.22 * Math.sin(t * 10.8);
    return {
      lift: 3.2 + Math.abs(flash) * 1.35,
      rot: -9.5 + flash * 11,
      dx: flash * 0.55,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 1.4 * (1 - s), rot: -3.6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function osmiiniPose(t: number) {
  return {
    lift: 1.6 + Math.abs(Math.sin(t * 0.34)) * 0.9,
    rot: Math.sin(t * 0.42) * 4.2,
    dx: Math.sin(t * 0.24) * 0.28,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: MasonBeeHappy, dt: number, flags: TrickFlags): MasonBeeHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MasonBeeHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "lignaria") {
    const pose = lignariaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cornifrons") {
    const pose = cornifronsPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = osmiiniPose(next.t);
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

export function beginTrick(kind: MasonBeeTrickKind, x: number, facing: 1 | -1): MasonBeeTrick {
  const anim: TrickAnim =
    kind === "osmia"
      ? "sit"
      : kind === "trowel"
        ? "play"
        : kind === "beebread"
          ? "play"
          : kind === "orchard"
            ? "talk"
            : kind === "plug"
              ? "play"
              : kind === "mudseptum"
                ? "play"
                : kind === "tubeprovision"
                  ? "play"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "osmia" ? "hold" : "go",
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

export function osmiaPose(t: number) {
  const breath = Math.sin(t * 0.13) + 0.05 * Math.sin(t * 0.48);
  const metal = Math.abs(Math.sin(t * 0.19));
  return {
    lift: 1.8 + metal * 0.85,
    rot: 2.4 + breath * 2.8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 2.4 * (1 - u) };
}

export function trowelPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.trowel));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.0, rot: s * 9 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const pack = Math.sin(s * Math.PI * 4.2);
    const press = Math.sin(s * Math.PI * 8.4);
    return {
      x: fromX + facing * (0.45 * s + pack * 0.35),
      lift: 2.6 + Math.abs(press) * 1.3,
      rot: facing * (8 + pack * 7 + press * 3.2),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + facing * 0.5 * (1 - s * 0.35),
    lift: 1.3 * (1 - s),
    rot: facing * (3.5 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function beebreadPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.beebread));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.4, rot: s * -7 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const pack = smoothstep(s);
    return {
      x: fromX + facing * pack * 1.1,
      lift: 2.4 - pack * 0.8,
      rot: facing * (-7 + pack * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const tamp = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (1.0 + tamp * 0.3),
      lift: 1.6 + Math.abs(tamp) * 1.2,
      rot: facing * (4 + tamp * 5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + facing * 0.7 * (1 - s * 0.4),
    lift: 0.9 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function orchardPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.orchard));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.8, rot: s * 11 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.16) / 0.56;
    const bloom = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * bloom * 0.4,
      lift: 2.8 + Math.abs(bloom) * 1.25,
      rot: facing * (10 - s * 2 + bloom * 5),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function plugPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plug));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.2, rot: s * -6 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.12) / 0.74;
    const station = Math.sin(s * Math.PI * 1.3);
    const drift = Math.sin(s * Math.PI * 2.6) * 0.4;
    return {
      x: fromX + facing * station * 0.55,
      lift: 3.0 + Math.abs(drift) * 1.2,
      rot: facing * (-5 + station * 8 + drift * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX,
    lift: 1.3 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function mudseptumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mudseptum));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.1, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const pack = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * pack * 0.55,
      lift: 3.0 + Math.abs(pack) * 1.5,
      rot: facing * (10 + pack * 8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const tamp = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (0.5 + tamp * 0.3),
      lift: 3.5 + Math.abs(tamp) * 0.95,
      rot: facing * (13 - s * 2 + tamp * 4),
      anim: "play" as TrickAnim,
    };
  }
  {
    const s = (u - 0.84) / 0.16;
    return {
      x: fromX,
      lift: 2.8 * (1 - s),
      rot: facing * (5.5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
}

export function tubeprovisionPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tubeprovision));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * -1.3, rot: s * -6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.5) {
    const s = smoothstep((u - 0.14) / 0.36);
    return {
      x: fromX + facing * s * 1.15,
      lift: -0.9 + s * 3.5,
      rot: facing * (-6 + s * 13),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.5) / 0.34;
    const shove = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (1.15 + shove * 0.4),
      lift: 2.7 + Math.abs(shove) * 1.25,
      rot: facing * (6.5 + shove * 5.5),
      anim: "play" as TrickAnim,
    };
  }
  {
    const s = (u - 0.84) / 0.16;
    return {
      x: fromX + facing * (1.0 * (1 - s * 0.35)),
      lift: 1.2 * (1 - s),
      rot: facing * (2.5 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
}

export function stepTrick(trick: MasonBeeTrick, dt: number, flags: TrickFlags): MasonBeeTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "trowel" &&
    trick.kind !== "beebread" &&
    trick.kind !== "orchard" &&
    trick.kind !== "plug" &&
    trick.kind !== "mudseptum" &&
    trick.kind !== "tubeprovision"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: MasonBeeTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "osmia") {
    if (next.t < OSMIA_HOLD) {
      const pose = osmiaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < OSMIA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - OSMIA_HOLD);
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
  if (next.kind === "trowel") {
    const pose = trowelPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "beebread") {
    const pose = beebreadPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "orchard") {
    const pose = orchardPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "plug") {
    const pose = plugPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mudseptum") {
    const pose = mudseptumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = tubeprovisionPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
