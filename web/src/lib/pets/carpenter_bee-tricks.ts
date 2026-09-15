/** Auger ground tricks while idle — ultra-polish pass. House eastern carpenter bee — rasp / glabrous / partition / picket / tunnelrasp / baldflash / xylocopa personality (rasp mandibular wood-tunnel rasp into a blotter beam — never named bore (window BORE) / gallery (Column) / chew / dig (Thimble) / gnaw (beaver) / fossor (Thrum) / nest (Clip + Column window) / bank (window DIG), glabrous shiny bald-abdomen flash — never named scopa (Thrum) / fur / fluff / sheen (Disk) / gloss / polish / preen (Echo) / pollen (Moth happy) / lustre (Sheen) / metallictilt (Sheen), partition solitary brood-cell wall pack — never named hive (Comb) / hex (Comb) / nest (Clip) / cell (mason ethogram) / gallery (Column) / crumb (Column) / bustle (Column), picket territorial station blotter-guard — never named hover (Sepia + ethogram) / guard (Vesper) / sentinel (Arm) / lumber (Thrum) / forage (Thrum window) / thrum (Vesper) / drone (Hum window), tunnelrasp deeper wood-tunnel rasp cycle along the blotter grain (not rasp shallow bite / gallery Column / fossor Thrum / dig Thimble), baldflash dramatic glabrous abdomen shine tilt toward the lamp (not glabrous soft gleam / lustre Sheen / sheen Disk / metallictilt Sheen / scopa Thrum), xylocopa desk life as a Xylocopa virginica eastern carpenter with shiny cousins in the thank-yous; not Comb / Thrum / Column / Brood / Fold / Seven / Twig / Dart / Spark / Ghost / Milk / Hum / Sheen / Mortar / *Dragon copies). Tunnelrasp is the iconic deeper Xylocopa wood-tunnel rasp (not rasp). Baldflash is the iconic bald-abdomen lamp flash (not glabrous). Window-play BORE unchanged — never names bore as a trick. Ethogram keeps xylocopa sit_hold; adds rasp/glabrous/partition/picket/tunnelrasp/baldflash softs + freeze (replaces thin hover/bore/still — Sepia owns hover; window BORE owns bore). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via carpenter_bee.wav. Thank-yous virginica / micans / xylocopini. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `carpenter_bee-tricks.js`. True house-carpenter desk life — not Rui/cat/dog/rabbit/hamster/Clip/guinea pig/turtle/Ink/goldfish/Coin/budgie/Echo/fox/penguin/parrot/ferret/hedgehog/Burr/chinchilla/axolotl/Bloom/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/snake/Coral/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon-jelly/Pulse/sea-star/Cling/hermit-crab/Tenant/horseshoe-crab/Ledger/seahorse/Anchor/manta/Kite/moray/Door/moss/Felt/fern/Vein/ginkgo/Fan/oak/Mast/water-lily/Disk/orchid/Moth/saguaro/Arm/venus-flytrap/Snap/pitcher/Drown/sundew/Dew/honeybee/Comb/monarch/Milk/luna/Ghost/firefly/Spark/darner/Dart/stick/Twig/carpenter_ant/Column/ladybird/Seven/mantis/Fold/cicada/Brood/bumblebee/Thrum/honey_drone/Hum/mason_bee/Mortar/leafcutter/Disc/stingless/Pot/sweat_bee/Sheen or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids bore/hover/still/gallery/camponotus/fossor/bombus/thoraxload/corbicularub/lustre/hive/guard/thrum name collisions. Bird ultra + denser guests done; skip Rui + birds. Fold now owns mantodea dens; Seven owns coccinella dens; Thrum now also owns thoraxload/corbicularub. XYLOCOPA_HOLD=11.2 RELEASE_S=1.18 (house ultra norm). Next: Mortar / mason_bee. Catalog 221. No cry inventing beyond house carpenter_bee.wav prefer. Never retouch Rui sprites. No gallery, not Column. */
export const TRICK_KEY = "carpenter_bee";
export const TRICKS = ["rasp", "glabrous", "partition", "picket", "tunnelrasp", "baldflash", "xylocopa"] as const;
export const HAPPY = ["virginica", "micans", "xylocopini"] as const;
export type CarpenterBeeTrickKind = (typeof TRICKS)[number];
export type CarpenterBeeHappyKind = (typeof HAPPY)[number];
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

export type CarpenterBeeTrick = {
  kind: CarpenterBeeTrickKind;
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

export type CarpenterBeeHappy = {
  kind: CarpenterBeeHappyKind;
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

export const HAPPY_DUR: Record<CarpenterBeeHappyKind, number> = {
  virginica: 1.74,
  micans: 1.86,
  xylocopini: 1.78,
};

/** Xylocopa hold — Auger parks Xylocopa virginica calm on the blotter. Not window-play BORE. */
export const XYLOCOPA_HOLD = 11.2;
export const RELEASE_S = 1.18;

export const DUR: Record<CarpenterBeeTrickKind, number> = {
  xylocopa: XYLOCOPA_HOLD + RELEASE_S,
  rasp: 2.46,
  glabrous: 2.42,
  partition: 2.48,
  picket: 2.44,
  tunnelrasp: 2.52,
  baldflash: 2.48,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CarpenterBeeTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "xylocopa") return 38 + roll * 24;
  if (kind === "tunnelrasp" || kind === "baldflash" || kind === "partition") return 12 + roll * 9;
  if (kind === "rasp" || kind === "glabrous" || kind === "picket") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CarpenterBeeTrickKind | string | null) {
  if (musicOn) return "xylocopa" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "xylocopa") {
    if (roll < 0.18) return "rasp" as const;
    if (roll < 0.34) return "glabrous" as const;
    if (roll < 0.5) return "partition" as const;
    if (roll < 0.66) return "picket" as const;
    if (roll < 0.83) return "tunnelrasp" as const;
    return "baldflash" as const;
  }
  if (lastKind === "rasp") {
    if (roll < 0.2) return "xylocopa" as const;
    if (roll < 0.36) return "glabrous" as const;
    if (roll < 0.52) return "partition" as const;
    if (roll < 0.68) return "picket" as const;
    if (roll < 0.84) return "tunnelrasp" as const;
    return "baldflash" as const;
  }
  if (lastKind === "glabrous") {
    if (roll < 0.18) return "xylocopa" as const;
    if (roll < 0.34) return "rasp" as const;
    if (roll < 0.5) return "partition" as const;
    if (roll < 0.66) return "picket" as const;
    if (roll < 0.83) return "tunnelrasp" as const;
    return "baldflash" as const;
  }
  if (lastKind === "tunnelrasp") {
    if (roll < 0.2) return "xylocopa" as const;
    if (roll < 0.36) return "rasp" as const;
    if (roll < 0.52) return "glabrous" as const;
    if (roll < 0.68) return "partition" as const;
    if (roll < 0.84) return "picket" as const;
    return "baldflash" as const;
  }
  if (roll < 0.16) return "xylocopa" as const;
  if (roll < 0.3) return "rasp" as const;
  if (roll < 0.44) return "glabrous" as const;
  if (roll < 0.58) return "partition" as const;
  if (roll < 0.72) return "picket" as const;
  if (roll < 0.86) return "tunnelrasp" as const;
  return "baldflash" as const;
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
  return key === TRICK_KEY || key === "auger";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CarpenterBeeHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CarpenterBeeHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CarpenterBeeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CarpenterBeeHappyKind | string, x: number, facing: 1 | -1): CarpenterBeeHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CarpenterBeeHappyKind) : "virginica";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "virginica" ? "talk" : name === "micans" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function virginicaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.virginica));
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

export function micansPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.micans));
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

export function xylocopiniPose(t: number) {
  return {
    lift: 1.6 + Math.abs(Math.sin(t * 0.34)) * 0.9,
    rot: Math.sin(t * 0.42) * 4.2,
    dx: Math.sin(t * 0.24) * 0.28,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: CarpenterBeeHappy, dt: number, flags: TrickFlags): CarpenterBeeHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CarpenterBeeHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "virginica") {
    const pose = virginicaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "micans") {
    const pose = micansPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = xylocopiniPose(next.t);
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

export function beginTrick(kind: CarpenterBeeTrickKind, x: number, facing: 1 | -1): CarpenterBeeTrick {
  const anim: TrickAnim =
    kind === "xylocopa"
      ? "sit"
      : kind === "rasp"
        ? "play"
        : kind === "glabrous"
          ? "talk"
          : kind === "partition"
            ? "play"
            : kind === "picket"
              ? "play"
              : kind === "tunnelrasp"
                ? "play"
                : kind === "baldflash"
                  ? "talk"
                  : "sit";
  return {
    kind: kind,
    phase: kind === "xylocopa" ? "hold" : "go",
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

export function xylocopaPose(t: number) {
  const breath = Math.sin(t * 0.13) + 0.05 * Math.sin(t * 0.48);
  const grit = Math.abs(Math.sin(t * 0.19));
  return {
    lift: 1.8 + grit * 0.85,
    rot: 2.4 + breath * 2.8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 1.8 * (1 - Math.sin(u * Math.PI * 0.5)), rot: 2.4 * (1 - u) };
}

export function raspPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rasp));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.0, rot: s * 9 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const circle = Math.sin(s * Math.PI * 5.5);
    const bite = Math.sin(s * Math.PI * 11);
    return {
      x: fromX + facing * (0.45 * s + circle * 0.35),
      lift: 2.6 + Math.abs(bite) * 1.3,
      rot: facing * (8 + circle * 7 + bite * 3.2),
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

export function glabrousPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.glabrous));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.8, rot: s * 11 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.16) / 0.56;
    const gleam = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * gleam * 0.4,
      lift: 2.8 + Math.abs(gleam) * 1.25,
      rot: facing * (10 - s * 2 + gleam * 5),
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

export function partitionPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.partition));
  if (u < 0.18) {
    const s = smoothstep(u / 0.18);
    return { x: fromX, lift: s * 2.4, rot: s * -7 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.18) / 0.37;
    const press = smoothstep(s);
    return {
      x: fromX + facing * press * 1.1,
      lift: 2.4 - press * 0.8,
      rot: facing * (-7 + press * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const seal = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (1.0 + seal * 0.3),
      lift: 1.6 + Math.abs(seal) * 1.2,
      rot: facing * (4 + seal * 5),
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

export function picketPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.picket));
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

export function tunnelraspPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tunnelrasp));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.1, rot: s * 10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.16) / 0.39;
    const tunnel = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + facing * tunnel * 0.55,
      lift: 3.0 + Math.abs(tunnel) * 1.5,
      rot: facing * (10 + tunnel * 8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.55) / 0.29;
    const grain = Math.sin(s * Math.PI * 3.6);
    return {
      x: fromX + facing * (0.5 + grain * 0.3),
      lift: 3.5 + Math.abs(grain) * 0.95,
      rot: facing * (13 - s * 2 + grain * 4),
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

export function baldflashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.baldflash));
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
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.84) {
    const s = (u - 0.5) / 0.34;
    const flash = Math.sin(s * Math.PI * 2.8);
    return {
      x: fromX + facing * (1.15 + flash * 0.4),
      lift: 2.7 + Math.abs(flash) * 1.25,
      rot: facing * (6.5 + flash * 5.5),
      anim: "talk" as TrickAnim,
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

export function stepTrick(trick: CarpenterBeeTrick, dt: number, flags: TrickFlags): CarpenterBeeTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "rasp" &&
    trick.kind !== "glabrous" &&
    trick.kind !== "partition" &&
    trick.kind !== "picket" &&
    trick.kind !== "tunnelrasp" &&
    trick.kind !== "baldflash"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CarpenterBeeTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "xylocopa") {
    if (next.t < XYLOCOPA_HOLD) {
      const pose = xylocopaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < XYLOCOPA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - XYLOCOPA_HOLD);
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
  if (next.kind === "rasp") {
    const pose = raspPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "glabrous") {
    const pose = glabrousPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "partition") {
    const pose = partitionPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "picket") {
    const pose = picketPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tunnelrasp") {
    const pose = tunnelraspPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = baldflashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
