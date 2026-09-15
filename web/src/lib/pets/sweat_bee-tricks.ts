/** Sheen ground tricks while idle — ultra-polish pass. House bicolored sweat bee — lustre / tumulus / salt / commune / agapostemon / metallictilt / nestmound personality (lustre metallic green-and-black body tilt that catches the lamp — never named sheen (Disk) / glint (Coin) / gleam (Ground happy) / shine (ethogram + Ember) / gloss / polish / glabrous (Auger) / flash (Quill) / glitter (Dew) / nacre (Chamber), tumulus soil nest-mound tamp at the burrow mouth — never named dig (Thimble) / fossor (Thrum) / nest (Clip + Column window) / bank (mining window) / furrow (Ledger) / cell (mason ethogram) / gallery (Column) / heave (Ground) / lug (Ground) / earth (Ground), salt salt-mineral tongue dab on the blotter — never named lick (window LICK) / nectar (Disk happy) / sip (hummingbird window) / gulp (Coin) / taste (Nori) / probe (Saffron) / lap (Sash) / proboscis (Comb) / brine (Brine guest), commune solitary-to-communal nest aggregation settle — never named hive (Comb) / bustle (Column) / huddle (Penguin) / column / cluster / nest (Clip) / forage (Thrum window), agapostemon desk life as an Agapostemon virescens bicolored Halictidae with texanus cousins in the thank-yous, metallictilt species-true Agapostemon metallic thorax catch-lamp lean (not Disk sheen / Coin glint / Ground gleam / Ember shine / Quill flash), nestmound Halictidae soil nest-mound reshape at the burrow lip (not Thrum fossor / thoraxload / corbicularub / Thimble dig / Clip nest / Comb hive); not Comb figure/corbicula/hex/proboscis/hive/ocelli/nasonov, Thrum sonicate/scopa/fossor/lumber/bombus/thoraxload/corbicularub, Auger rasp/glabrous/partition/picket/xylocopa, Mortar trowel/beebread/orchard/plug/osmia, Disc circle/liner/cavity/parcel/megachile, Pot cerumen/spout/vessel/batumen/melipona, Disk pad/corolla/rhizome/calyx/sheen, Column gallery/pheromone/crumb/bustle/camponotus, Sepia hover, Vesper guard/thrum, Arm sentinel, Clip nest, Thimble dig, Cap warts, Reed plop, Tube papillae, Relay buzz, Rui dance, Ground happy gleam, Coin glint, Ember shine copies). Metallictilt is the iconic Agapostemon metallic thorax lamp-catch (not Disk sheen). Nestmound is the iconic Halictidae burrow-lip mound reshape (not Thrum fossor). Window-play LICK unchanged — never names lick as a trick. Ethogram keeps agapostemon sit_hold; adds lustre/tumulus/salt/commune/metallictilt/nestmound softs + freeze (replaces thin shine/hover/still — Ember owns shine; Sepia owns hover). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via sweat_bee.wav. Thank-yous virescens / texanus / halictini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `sweat_bee-tricks.js`. True house-sweat-bee desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/carpenter_bee/Auger/mason_bee/Mortar/leafcutter/Disc/stingless/Pot or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids sheen/glint/gleam/shine/hover/fossor/thoraxload/corbicularub/hive/proboscis/lick/nest/dig/buzz/forage name collisions. Bird ultra (Soot→Ember) + Miso→Ghost done; skip Rui + birds. Thrum now also owns thoraxload/corbicularub. AGAPOSTEMON_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Hum / honey_drone. Catalog 221. No cry inventing beyond house sweat_bee.wav prefer. Never retouch Rui sprites. */
export const TRICK_KEY = "sweat_bee";
export const TRICKS = ["lustre", "tumulus", "salt", "commune", "agapostemon", "metallictilt", "nestmound"] as const;
export const HAPPY = ["virescens", "texanus", "halictini"] as const;
export type SweatBeeTrickKind = (typeof TRICKS)[number];
export type SweatBeeHappyKind = (typeof HAPPY)[number];
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

export type SweatBeeTrick = {
  kind: SweatBeeTrickKind;
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

export type SweatBeeHappy = {
  kind: SweatBeeHappyKind;
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

export const HAPPY_DUR: Record<SweatBeeHappyKind, number> = {
  virescens: 1.72,
  texanus: 1.88,
  halictini: 1.78,
};

/** Agapostemon hold — Sheen parks metallic Halictidae calm on the blotter. Not window-play LICK. */
export const AGAPOSTEMON_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<SweatBeeTrickKind, number> = {
  agapostemon: AGAPOSTEMON_HOLD + RELEASE_S,
  lustre: 2.46,
  tumulus: 2.42,
  salt: 2.38,
  commune: 2.44,
  metallictilt: 2.52,
  nestmound: 2.48,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SweatBeeTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "agapostemon") return 38 + roll * 24;
  if (kind === "metallictilt" || kind === "nestmound" || kind === "commune") return 12 + roll * 9;
  if (kind === "lustre" || kind === "tumulus" || kind === "salt") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SweatBeeTrickKind | string | null) {
  if (musicOn) return "agapostemon" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "agapostemon") {
    if (roll < 0.18) return "lustre" as const;
    if (roll < 0.34) return "tumulus" as const;
    if (roll < 0.5) return "salt" as const;
    if (roll < 0.66) return "commune" as const;
    if (roll < 0.83) return "metallictilt" as const;
    return "nestmound" as const;
  }
  if (lastKind === "lustre") {
    if (roll < 0.2) return "agapostemon" as const;
    if (roll < 0.36) return "tumulus" as const;
    if (roll < 0.52) return "salt" as const;
    if (roll < 0.68) return "commune" as const;
    if (roll < 0.84) return "metallictilt" as const;
    return "nestmound" as const;
  }
  if (lastKind === "tumulus") {
    if (roll < 0.18) return "agapostemon" as const;
    if (roll < 0.34) return "lustre" as const;
    if (roll < 0.5) return "salt" as const;
    if (roll < 0.66) return "commune" as const;
    if (roll < 0.83) return "metallictilt" as const;
    return "nestmound" as const;
  }
  if (lastKind === "metallictilt") {
    if (roll < 0.2) return "agapostemon" as const;
    if (roll < 0.36) return "lustre" as const;
    if (roll < 0.52) return "tumulus" as const;
    if (roll < 0.68) return "salt" as const;
    if (roll < 0.84) return "commune" as const;
    return "nestmound" as const;
  }
  if (roll < 0.16) return "agapostemon" as const;
  if (roll < 0.3) return "lustre" as const;
  if (roll < 0.44) return "tumulus" as const;
  if (roll < 0.58) return "salt" as const;
  if (roll < 0.72) return "commune" as const;
  if (roll < 0.86) return "metallictilt" as const;
  return "nestmound" as const;
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
  return key === TRICK_KEY || key === "sheen";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SweatBeeHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as SweatBeeHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SweatBeeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SweatBeeHappyKind | string, x: number, facing: 1 | -1): SweatBeeHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SweatBeeHappyKind) : "virescens";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "virescens" ? "talk" : name === "texanus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function virescensPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.virescens));
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

export function texanusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.texanus));
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

export function halictiniPose(t: number) {
  return {
    lift: 1.6 + Math.abs(Math.sin(t * 0.34)) * 0.9,
    rot: Math.sin(t * 0.42) * 4.2,
    dx: Math.sin(t * 0.24) * 0.28,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: SweatBeeHappy, dt: number, flags: TrickFlags): SweatBeeHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SweatBeeHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "virescens") {
    const pose = virescensPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "texanus") {
    const pose = texanusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = halictiniPose(next.t);
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

export function beginTrick(kind: SweatBeeTrickKind, x: number, facing: 1 | -1): SweatBeeTrick {
  const anim: TrickAnim =
    kind === "agapostemon"
      ? "sit"
      : kind === "lustre"
        ? "play"
        : kind === "tumulus"
          ? "talk"
          : kind === "salt"
            ? "talk"
            : kind === "commune"
              ? "sit"
              : kind === "metallictilt"
                ? "play"
                : kind === "nestmound"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "agapostemon" ? "hold" : "go",
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

export function agapostemonPose(t: number) {
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

export function lustrePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lustre));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.1, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const tilt = Math.sin(s * Math.PI * 2.2);
    const catchLamp = Math.sin(s * Math.PI * 4.8);
    return {
      x: fromX + facing * tilt * 0.55,
      lift: 3.0 + Math.abs(catchLamp) * 1.4,
      rot: facing * (9 + tilt * 8 + catchLamp * 3.5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: facing * (4 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function tumulusPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tumulus));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * -1.2, rot: s * -6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.12) / 0.43;
    const push = smoothstep(s);
    return {
      x: fromX + facing * (0.6 + push * 1.4),
      lift: 2.4 + push * 2.2,
      rot: facing * (-6 + push * 14),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.86) {
    const s = (u - 0.55) / 0.31;
    const tamp = Math.sin(s * Math.PI * 3.4);
    return {
      x: fromX + facing * (1.1 + tamp * 0.35),
      lift: 2.8 + Math.abs(tamp) * 1.3,
      rot: facing * (5 + tamp * 5.5),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX + facing * 0.7 * (1 - s * 0.4),
    lift: -0.6 * (1 - s),
    rot: facing * (2.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function saltPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.salt));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.6, rot: s * -7 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const s = (u - 0.16) / 0.66;
    const dab = Math.sin(s * Math.PI * 5.6);
    const lean = Math.sin(s * Math.PI * 1.4);
    return {
      x: fromX + facing * lean * 0.45,
      lift: 2.4 + Math.abs(dab) * 1.15,
      rot: facing * (-5.5 + dab * 7 + lean * 2.8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.82) / 0.18);
  return {
    x: fromX,
    lift: 1.1 * (1 - s),
    rot: facing * (-2.2 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function communePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.commune));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.2, rot: s * 6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const s = (u - 0.18) / 0.62;
    const settle = Math.sin(s * Math.PI * 1.6);
    const neighbor = Math.sin(s * Math.PI * 3.2) * 0.35;
    return {
      x: fromX + facing * (0.9 * s + settle * 0.35),
      lift: 2.0 + Math.abs(neighbor) * 1.0,
      rot: facing * (5 + settle * 4.5 + neighbor * 3),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + facing * 0.7 * (1 - s * 0.3),
    lift: 1.0 * (1 - s),
    rot: facing * (2.0 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function metallictiltPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.metallictilt));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.0, rot: s * 11 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const flash = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * flash * 0.5,
      lift: 3.0 + Math.abs(flash) * 1.5,
      rot: facing * (11 + flash * 9),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const catchLamp = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (0.45 + catchLamp * 0.3),
      lift: 3.6 + Math.abs(catchLamp) * 0.9,
      rot: facing * (14 - s * 2 + catchLamp * 4),
      anim: "play" as TrickAnim,
    };
  }
  {
    const s = (u - 0.84) / 0.16;
    return {
      x: fromX,
      lift: 3.0 * (1 - s),
      rot: facing * (6 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
}

export function nestmoundPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nestmound));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * -1.4, rot: s * -5 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.5) {
    const s = smoothstep((u - 0.14) / 0.36);
    return {
      x: fromX + facing * s * 1.2,
      lift: -1.0 + s * 3.4,
      rot: facing * (-5 + s * 12),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.5) / 0.34;
    const pack = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (1.2 + pack * 0.4),
      lift: 2.6 + Math.abs(pack) * 1.2,
      rot: facing * (6 + pack * 5),
      anim: "talk" as TrickAnim,
    };
  }
  {
    const s = (u - 0.84) / 0.16;
    return {
      x: fromX + facing * (1.0 * (1 - s * 0.35)),
      lift: 1.2 * (1 - s),
      rot: facing * (2.4 * (1 - s)),
      anim: "sit" as TrickAnim,
    };
  }
}

export function stepTrick(trick: SweatBeeTrick, dt: number, flags: TrickFlags): SweatBeeTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "lustre" &&
    trick.kind !== "tumulus" &&
    trick.kind !== "salt" &&
    trick.kind !== "commune" &&
    trick.kind !== "metallictilt" &&
    trick.kind !== "nestmound"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SweatBeeTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "agapostemon") {
    if (next.t < AGAPOSTEMON_HOLD) {
      const pose = agapostemonPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < AGAPOSTEMON_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - AGAPOSTEMON_HOLD);
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
  if (next.kind === "lustre") {
    const pose = lustrePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tumulus") {
    const pose = tumulusPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "salt") {
    const pose = saltPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "commune") {
    const pose = communePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "metallictilt") {
    const pose = metallictiltPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = nestmoundPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
