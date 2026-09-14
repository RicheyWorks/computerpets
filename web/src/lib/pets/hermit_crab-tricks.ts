/** Tenant ground tricks while idle — ultra-polish pass. House hermit crab — swap / antenna / scuttle / withdraw / vacancy / chela / bailer personality (shell-swap try-on, antennal tap probes, sideways scuttle bursts, soft-abdomen withdraw into the lid, house-hunting vacancy desk life, major-claw chela display, scaphognathite gill-bailer irrigation; not Cling podia/righting/crawl/evert/penta/madre/papula, Pulse bell/oral/lucent/trail/medusa, Clip nest/cheek/scurry/pocket/reel, Burr curl/snuffle, Chamber spiral, Cup mantle, Ink soak/tuck, Coin drift, Wave clawwave, or Ghost claw). Chela rides a major cheliped wave (species-true hermit claw display — not Wave clawwave, not fiddler advertise, not window-play KNOB); bailer pumps the branchial scaphognathite (species-true hermit gill irrigation — not Pulse oral, not Bloom gill, not Ink paddle). Window-play KNOB unchanged — never names `knob`. Special Trade unchanged — never names trade as a trick. Ethogram keeps withdraw sit_hold; adds swap/antenna/scuttle/vacancy/chela/bailer softs + freeze (replaces thin inspect/shuffle). Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via hermit_crab.wav. Thank-yous scrap / fit / lease. Feed-happy after eat. Sleep, hide, leave, rest, card still win. Same map as desktop `hermit_crab-tricks.js`. True house-hermit desk life — not Rui/cat/dog/rabbit/hamster/guinea_pig/turtle/goldfish/budgie/fox/penguin/parrot/ferret/hedgehog/chinchilla/axolotl/toucan/iguana/Sol/dragon/Vesper/phoenix/Ember/ball_python/Nori/corn_snake/Saffron/kingsnake/Bandit/green_tree_python/Jade/hognose/Bluff/garter/Sash/boa/Lula/milk_snake/Coral/rosy_boa/Blush/carpet_python/Atlas/octopus/Cup/cuttlefish/Sepia/nautilus/Chamber/moon_jelly/Pulse/sea_star/Ochre or *Dragon electrical (Relay/Fuse/Ground) clones. Avoids knob/trade/podia/righting/crawl/evert/penta/madre/papula/bell/oral/lucent/trail/medusa/mantle/sucker/jet/veil/tinker/spiral/siphuncle/drift/gulp/soak/tuck/gill/amble/nest/cheek/curl/clawwave/chelate/stalkeyescan name collisions with prior guests and hermit window-play. Bird ultra (Soot→Ember) + Miso→Ochre done; Echo/budgie + Peck/penguin + Quill/parrot + Keel/toucan + Ember skip birds. Next guest ultra is Ledger / horseshoe_crab. No cry inventing beyond house hermit_crab.wav prefer. Never retouch Rui sprites. */

export const TRICK_KEY = "hermit_crab";
export const TRICKS = ["swap", "antenna", "scuttle", "withdraw", "vacancy", "chela", "bailer"] as const;
export const HAPPY = ["scrap", "fit", "lease"] as const;
export type HermitCrabTrickKind = (typeof TRICKS)[number];
export type HermitCrabHappyKind = (typeof HAPPY)[number];
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

export type HermitCrabTrick = {
  kind: HermitCrabTrickKind;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  abort?: boolean;
};

export type HermitCrabHappy = {
  kind: HermitCrabHappyKind;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: 1 | -1;
  fromX?: number;
  abort?: boolean;
};

export const HAPPY_DUR: Record<HermitCrabHappyKind, number> = {
  scrap: 1.28,
  fit: 1.18,
  lease: 1.2,
};

/** Withdraw hold — Tenant rests tucked in the borrowed lid. Not window-play KNOB. Not Cling podia. Not Burr curl. Not Ink tuck. */
export const WITHDRAW_HOLD = 10.6;
export const RELEASE_S = 0.6;

export const DUR: Record<HermitCrabTrickKind, number> = {
  withdraw: WITHDRAW_HOLD + RELEASE_S,
  swap: 1.72,
  antenna: 1.58,
  scuttle: 1.85,
  vacancy: 1.72,
  chela: 2.05,
  bailer: 2.12,
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
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return true;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return true;
  return false;
}

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HermitCrabTrickKind) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "withdraw") return 38 + roll * 24;
  if (kind === "chela" || kind === "bailer" || kind === "scuttle") return 12 + roll * 9;
  if (kind === "swap" || kind === "antenna" || kind === "vacancy") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: HermitCrabTrickKind | null): HermitCrabTrickKind {
  if (musicOn) return "withdraw";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "withdraw" ? 0.55 : k === "chela" || k === "bailer" || k === "scuttle" ? 1.15 : 1
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "withdraw";
}

export function happyCanStart(state: TrickFlags | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide") return false;
  return true;
}

export function happyShouldAbort(state: TrickFlags | undefined) {
  if (!state) return true;
  if (state.asleep || state.hidden || state.leaving) return true;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide") return true;
  return false;
}

export function wantsThankYou(key: string | undefined | null) {
  return key === TRICK_KEY || key === "tenant";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HermitCrabHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as HermitCrabHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HermitCrabHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: HermitCrabHappyKind | string, x: number, facing: 1 | -1): HermitCrabHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as HermitCrabHappyKind) : "scrap";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "scrap" ? "talk" : name === "fit" ? "sit" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function scrapPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.scrap));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 3.2, rot: s * -14, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const nibble = Math.sin(t * 2.4);
    return {
      lift: 3.2 + Math.abs(nibble) * 1.8,
      rot: -14 + nibble * 16,
      dx: nibble * 0.4,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.4 * (1 - s), rot: -8 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function fitPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.fit));
  if (u < 0.18) {
    const s = u / 0.18;
    return { lift: s * 2.8, rot: s * 16, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const settle = Math.sin(t * 1.85);
    return {
      lift: 2.8 + Math.abs(settle) * 1.4,
      rot: 16 + settle * 14,
      dx: settle * 0.35,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.2 * (1 - s), rot: 10 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function leasePose(t: number) {
  return {
    lift: Math.abs(Math.sin(t * 2.1)) * 2.2 + 2.4,
    rot: 8 + Math.sin(t * 2.6) * 14,
    dx: Math.sin(t * 1.5) * 0.4,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: HermitCrabHappy, dt: number, flags?: TrickFlags): HermitCrabHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HermitCrabHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "scrap") {
    const pose = scrapPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "fit") {
    const pose = fitPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = leasePose(next.t);
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

export function beginTrick(kind: HermitCrabTrickKind, x: number, facing: 1 | -1): HermitCrabTrick {
  const anim: TrickAnim =
    kind === "withdraw"
      ? "sit"
      : kind === "swap"
        ? "play"
        : kind === "antenna"
          ? "talk"
          : kind === "scuttle"
            ? "walk"
            : kind === "vacancy"
              ? "walk"
              : kind === "chela"
                ? "play"
                : kind === "bailer"
                  ? "talk"
                  : "sit";
  return {
    kind,
    phase: kind === "withdraw" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function withdrawPose(t: number) {
  const beat = Math.sin(t * 1.7) + 0.45 * Math.sin(t * 3.4);
  return {
    lift: 2.4 + Math.sin(t * 1.7) * 2.8 + Math.abs(Math.sin(t * 3.4)) * 1.6,
    rot: -18 + Math.sin(t * 2.4) * 16 + beat * 8,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: (2.4 + 2.8) * (1 - Math.sin(u * Math.PI * 0.5)), rot: -18 * (1 - u) };
}

export function swapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.swap));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.6, rot: s * -28 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.52) {
    const s = (u - 0.14) / 0.38;
    const tryOn = Math.sin(s * Math.PI * 2);
    return {
      x: fromX + facing * tryOn * 0.85,
      lift: 3.6 + Math.abs(tryOn) * 1.8,
      rot: facing * (-28 + tryOn * 42),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.52) / 0.26;
    return {
      x: fromX,
      lift: 3.6 * (1 - s * 0.4),
      rot: facing * (-28 * (1 - s) + 10 * s),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.2 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function antennaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.antenna));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 18 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const tap = Math.sin(s * Math.PI * 4.2);
    const lean = Math.sin(s * Math.PI * 1.3);
    return {
      x: fromX + facing * lean * 0.55,
      lift: 2.6 + Math.abs(tap) * 1.6,
      rot: facing * (18 + tap * 16 + lean * 8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function scuttlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scuttle));
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX, lift: s * 2.8, rot: s * -14 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.74) {
    const s = (u - 0.1) / 0.64;
    const burst = Math.sin(s * Math.PI * 4.6);
    const side = Math.sin(s * Math.PI * 1.2);
    return {
      x: fromX + facing * (side * 1.35 + burst * 0.35),
      lift: 2.8 + Math.abs(burst) * 1.6,
      rot: facing * (-14 + burst * 12 + side * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.74) / 0.26);
  return {
    x: fromX + facing * 1.35 * (1 - s),
    lift: 2.8 * (1 - s),
    rot: facing * (-6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function vacancyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.vacancy));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * 12 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.14) / 0.28;
    return {
      x: fromX + facing * s * 1.15,
      lift: 2.6 + Math.sin(s * Math.PI) * 1.4,
      rot: facing * (12 + Math.sin(s * Math.PI * 2) * 10),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.72) {
    const s = (u - 0.42) / 0.3;
    const measure = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + facing * 1.15,
      lift: 2.4 + Math.abs(measure) * 1.6,
      rot: facing * (measure * 22),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + facing * 1.15 * (1 - s),
    lift: 2.0 * (1 - s),
    rot: facing * (6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function chelaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chela));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * -22 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.7) {
    const s = (u - 0.14) / 0.56;
    const wave = Math.sin(s * Math.PI * 3.2);
    const brandish = Math.sin(s * Math.PI * 1.5);
    return {
      x: fromX + facing * brandish * 0.7,
      lift: 3.4 + Math.abs(wave) * 1.8,
      rot: facing * (-22 + wave * 28 + brandish * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.7) / 0.3);
  return {
    x: fromX,
    lift: 2.6 * (1 - s),
    rot: facing * (-10 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function bailerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bailer));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.8, rot: s * 14 * facing, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const pump = Math.sin(s * Math.PI * 5.2);
    const chamber = Math.sin(s * Math.PI * 1.6);
    return {
      x: fromX + facing * chamber * 0.45,
      lift: 2.8 + Math.abs(pump) * 1.6 + Math.abs(chamber) * 0.8,
      rot: facing * (14 + pump * 18 + chamber * 8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.2 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "sit" as TrickAnim,
  };
}

export function stepTrick(trick: HermitCrabTrick, dt: number, flags: TrickFlags): HermitCrabTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "swap" && trick.kind !== "scuttle" && trick.kind !== "vacancy" && trick.kind !== "chela") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HermitCrabTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "withdraw") {
    if (next.t < WITHDRAW_HOLD) {
      const pose = withdrawPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < WITHDRAW_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - WITHDRAW_HOLD);
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
  if (next.kind === "swap") {
    const pose = swapPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "antenna") {
    const pose = antennaPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "scuttle") {
    const pose = scuttlePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "vacancy") {
    const pose = vacancyPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chela") {
    const pose = chelaPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = bailerPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
