/** Dapple ground tricks while idle — ultra-polish pass. House neighborly Ambystomatidae/Plethodontidae spotted-salamander desk life — maculate / litter / cutaneous / nasolabial / ambystomid / mental / granular personality (yellow-coin maculate spot flash, damp leaf-litter hide settle, cutaneous lung/skin breath hush, Plethodon nasolabial groove tip-scent, long Ambystoma metabolic hold under mold, mental-gland courtship press, granular-gland sticky secretion flash — never named wait or wake or still or hide or cover or wiggle or dart or trail or paddle or salamander or dapple or newt or eft or frog or toad or reed or pebble or crest or caudal or filament or costal or caudate or hedonic or aposematic or gular or nictitate or tympanum or iliac or lentic or toepad or webbing or verruca or burrow or parotoid or tubercle or bufonid or unken or cranial or gill or amble or mend or smile or plume or hop or puff or dig or soak or tuck or crane or plod or warning or cirrus or vernal as trick kinds; window-play COVER owns cover; ethogram softs + freeze own those words; Eft owns crest/caudal/filament/costal/caudate/hedonic/aposematic; Bloom owns gill/amble/mend/smile/plume; Reed owns gular/nictitate/tympanum/iliac/lentic/toepad/webbing; Pebble owns verruca/burrow/parotoid/tubercle/bufonid/unken/cranial; MiningBee owns vernal; Milk owns warning; Drift owns cirrus; guest slug Dapple / key salamander only for isKey matching — accept "salamander" and "dapple"; do NOT name a trick "salamander" or "dapple" or "wait" or "wake" or "still" or "hide" or "cover" or "wiggle" or "dart" or "trail" or "paddle" or "newt" or "eft" or "frog" or "toad" or "reed" or "pebble" or "gular" or "lentic" or "verruca" or "bufonid" or "gill" or "hop" or "puff" or "dig" or "warning" or "cirrus" or "vernal") — not Eft Salamandridae Crested/smooth-newt, not Pebble Bufonidae American-toad, not Reed Anura green-frog, not Arca sealed-vault, not Bloom axolotl, not Ink turtle, not Hush shade-umbra, not Beacon field-magnet, not Brine salt-brine, not Knot junction-weave, not Dusk twilight-belt, not Shard living-crystal, not Drift methane-cloud, not Choir chord-body, not Gleam lamp-drinker, not Blush rosy-boa; never named wait / wake / still / hide / cover / wiggle / dart / trail / paddle / salamander / dapple / newt / eft / frog / toad / reed / pebble / crest / caudal / filament / costal / caudate / hedonic / aposematic / gular / nictitate / tympanum / iliac / lentic / toepad / webbing / verruca / burrow / parotoid / tubercle / bufonid / unken / cranial / gill / amble / mend / smile / plume / warning / cirrus / vernal / hop / puff / dig / freeze — Echo/Quill birds — do not copy. maculate yellow-coin Ambystoma maculatum spot flash without naming cover or dapple, litter damp leaf-litter settle without naming hide or cover or burrow, cutaneous cutaneous lung/skin breath hush without naming gill or puff, nasolabial Plethodon nasolabial-groove tip-scent without naming trail or crest, ambystomid long Ambystoma metabolic hold, mental mental-gland courtship press (THE Plethodon courtship tell), granular granular-gland sticky secretion flash (THE Ambystoma defensive tell); mottled / speckled / blotched thank-yous. Feed-happy after eat. Card-open freeze and window-play COVER do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop salamander-tricks.js. Window-play COVER unchanged. Ethogram softs + freeze — never names hide/still/wiggle as trick kinds. Pinch owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via salamander.wav. */
export const TRICK_KEY = "salamander";
export const TRICKS = ["maculate", "litter", "cutaneous", "nasolabial", "ambystomid", "mental", "granular"] as const;
export const HAPPY = ["mottled", "speckled", "blotched"] as const;
export type SalamanderTrickKind = (typeof TRICKS)[number];
export type SalamanderHappyKind = (typeof HAPPY)[number];
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

export type SalamanderTrick = {
  kind: SalamanderTrickKind;
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

export type SalamanderHappy = {
  kind: SalamanderHappyKind;
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

export const HAPPY_DUR = { mottled: 1.64, speckled: 1.76, blotched: 1.71 } as const;
export const AMBYSTOMID_HOLD = 10.8;
export const RELEASE_S = 1.14;
export const DUR = {
  ambystomid: AMBYSTOMID_HOLD + RELEASE_S,
  maculate: 2.28,
  litter: 2.42,
  cutaneous: 2.34,
  nasolabial: 2.38,
  mental: 2.36,
  granular: 2.31,
} as const;

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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SalamanderTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "ambystomid") return 38 + roll * 24;
  if (kind === "mental" || kind === "granular" || kind === "maculate") return 12 + roll * 9;
  if (kind === "litter" || kind === "cutaneous" || kind === "nasolabial") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SalamanderTrickKind | string | null) {
  if (musicOn) return "ambystomid" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "ambystomid") {
    if (roll < 0.16) return "maculate" as const;
    if (roll < 0.32) return "litter" as const;
    if (roll < 0.48) return "cutaneous" as const;
    if (roll < 0.64) return "nasolabial" as const;
    if (roll < 0.82) return "mental" as const;
    return "granular" as const;
  }
  if (lastKind === "maculate") {
    if (roll < 0.16) return "ambystomid" as const;
    if (roll < 0.32) return "litter" as const;
    if (roll < 0.48) return "cutaneous" as const;
    if (roll < 0.64) return "nasolabial" as const;
    if (roll < 0.82) return "mental" as const;
    return "granular" as const;
  }
  if (lastKind === "litter") {
    if (roll < 0.14) return "ambystomid" as const;
    if (roll < 0.3) return "maculate" as const;
    if (roll < 0.46) return "cutaneous" as const;
    if (roll < 0.62) return "nasolabial" as const;
    if (roll < 0.8) return "mental" as const;
    return "granular" as const;
  }
  if (lastKind === "mental" || lastKind === "granular") {
    if (roll < 0.14) return "ambystomid" as const;
    if (roll < 0.3) return "maculate" as const;
    if (roll < 0.46) return "litter" as const;
    if (roll < 0.62) return "cutaneous" as const;
    if (roll < 0.78) return "nasolabial" as const;
    return lastKind === "mental" ? ("granular" as const) : ("mental" as const);
  }
  if (roll < 0.14) return "ambystomid" as const;
  if (roll < 0.28) return "maculate" as const;
  if (roll < 0.42) return "litter" as const;
  if (roll < 0.56) return "cutaneous" as const;
  if (roll < 0.7) return "nasolabial" as const;
  if (roll < 0.85) return "mental" as const;
  return "granular" as const;
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
  return key === TRICK_KEY || key === "dapple";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SalamanderHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as SalamanderHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SalamanderHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SalamanderHappyKind | string, x: number, facing: 1 | -1): SalamanderHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SalamanderHappyKind) : "mottled";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "mottled" ? "sit" : name === "speckled" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function mottledPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mottled));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 1.72);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: 0,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function speckledPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.speckled));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 3.4, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const wriggle = Math.sin(t * 2.1);
    return {
      lift: 3.4 + Math.abs(wriggle) * 1.6,
      rot: -14 + wriggle * 10,
      dx: 0.08,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function blotchedPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: SalamanderHappy, dt: number, flags: TrickFlags): SalamanderHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SalamanderHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "mottled") {
    const pose = mottledPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "speckled") {
    const pose = speckledPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = blotchedPose(next.t);
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

export function beginTrick(kind: SalamanderTrickKind | string, x: number, facing: 1 | -1): SalamanderTrick {
  const anim: TrickAnim =
    kind === "ambystomid"
      ? "sit"
      : kind === "maculate"
        ? "play"
        : kind === "litter"
          ? "walk"
          : kind === "cutaneous"
            ? "sit"
            : kind === "nasolabial"
              ? "sit"
              : kind === "mental"
                ? "sit"
                : kind === "granular"
                  ? "play"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as SalamanderTrickKind) : "maculate",
    phase: kind === "ambystomid" ? "hold" : "go",
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

export function ambystomidPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.14) * 4,
    anim: "sit" as TrickAnim,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function maculatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.maculate));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.48) {
    const s = (u - 0.16) / 0.32;
    const maculate = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * maculate * 0.12,
      lift: 3.2 + Math.abs(maculate) * 1.4,
      rot: facing * (-8 + maculate * 14),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const sway = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX,
      lift: 2.2 + Math.abs(sway) * 0.9,
      rot: facing * (4 + sway * 8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: facing * (2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function litterPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.litter));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.14) / 0.64;
    const wave = Math.sin(s * Math.PI * 3.4);
    const glide = Math.sin(s * Math.PI * 1.2);
    return {
      x: fromX + facing * wave * 0.28,
      lift: 2.6 + Math.abs(glide) * 1.3 + Math.abs(wave) * 0.7,
      rot: facing * (10 + wave * 12 + glide * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function cutaneousPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cutaneous));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.4, rot: s * -6 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.74) {
    const s = (u - 0.16) / 0.58;
    const tip = Math.sin(s * Math.PI * 4.2) + 0.22 * Math.sin(s * Math.PI * 7.1);
    const hush = smoothstep(Math.min(1, s * 1.2));
    return {
      x: fromX + facing * tip * 0.1,
      lift: 2.4 + hush * 1.2 + Math.abs(tip) * 0.7,
      rot: facing * (-6 + hush * 5 + tip * 4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.74) / 0.26);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: facing * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function nasolabialPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nasolabial));
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * facing, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const s = (u - 0.12) / 0.66;
    const groove = Math.sin(s * Math.PI * 2.55);
    const crawl = Math.sin(s * Math.PI * 1.15);
    return {
      x: fromX + facing * crawl * 0.22,
      lift: 2.6 + Math.abs(crawl) * 1.3 + Math.abs(groove) * 0.7,
      rot: facing * (10 + crawl * 12 + groove * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: facing * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function mentalPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mental));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.8, rot: s * 12 * facing, anim: "sit" as TrickAnim };
  }
  if (u < 0.42) {
    const s = (u - 0.16) / 0.26;
    const press = smoothstep(s);
    return {
      x: fromX,
      lift: 2.8 + press * 1.6,
      rot: facing * (12 + press * 16),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.42) / 0.36;
    const scent = Math.sin(s * Math.PI * 2.2);
    return {
      x: fromX,
      lift: 4.2 + Math.abs(scent) * 0.6,
      rot: facing * (24 + scent * 4),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: facing * (8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function granularPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.granular));
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.2, rot: s * -10 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.4) {
    const s = (u - 0.14) / 0.26;
    const flash = smoothstep(s);
    return {
      x: fromX,
      lift: 2.2 + flash * 1.2,
      rot: facing * (-10 - flash * 8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.4) / 0.38;
    const warn = Math.sin(s * Math.PI * 3.1);
    return {
      x: fromX + facing * warn * 0.08,
      lift: 3.2 + Math.abs(warn) * 0.7,
      rot: facing * (-16 + warn * 6),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.5 * (1 - s),
    rot: facing * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: SalamanderTrick, dt: number, flags: TrickFlags): SalamanderTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: SalamanderTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "ambystomid") {
    if (next.t < AMBYSTOMID_HOLD) {
      const pose = ambystomidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < AMBYSTOMID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - AMBYSTOMID_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "maculate") {
    const pose = maculatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "litter") {
    const pose = litterPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cutaneous") {
    const pose = cutaneousPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nasolabial") {
    const pose = nasolabialPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mental") {
    const pose = mentalPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = granularPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
