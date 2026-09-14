/** Eft ground tricks while idle — ultra-polish pass. House neighborly Salamandridae Crested/smooth-newt desk life — crest / caudal / filament / costal / caudate / hedonic / aposematic personality (dorsal crest raise, caudal aquatic undulation, palmate filament tip, costal-groove land crawl, long caudate metabolic hold, hedonic-gland courtship press, aposematic TTX warning flash — never named wait or wake or still or wiggle or dart or trail or paddle or newt or eft or frog or toad or reed or pebble or gular or nictitate or tympanum or iliac or lentic or toepad or webbing or verruca or burrow or parotoid or tubercle or bufonid or unken or cranial or gill or amble or mend or smile or plume or hop or puff or dig or soak or tuck or crane or plod or warning or cirrus as trick kinds; window-play TRAIL owns trail; ethogram softs + freeze own those words; Ink turtle owns paddle; Bloom owns gill/amble/mend/smile/plume; Reed owns gular/nictitate/tympanum/iliac/lentic/toepad/webbing; Pebble owns verruca/burrow/parotoid/tubercle/bufonid/unken/cranial; Milk owns warning; Drift owns cirrus; guest slug Eft / key newt only for isKey matching — accept "newt" and "eft"; do NOT name a trick "newt" or "eft" or "wait" or "wake" or "still" or "wiggle" or "dart" or "trail" or "paddle" or "frog" or "toad" or "reed" or "pebble" or "gular" or "lentic" or "verruca" or "bufonid" or "gill" or "hop" or "puff" or "dig" or "warning" or "cirrus") — not Pebble Bufonidae American-toad, not Reed Anura green-frog, not Arca sealed-vault, not Bloom axolotl, not Ink turtle, not Hush shade-umbra, not Beacon field-magnet, not Brine salt-brine, not Knot junction-weave, not Dusk twilight-belt, not Shard living-crystal, not Drift methane-cloud, not Choir chord-body, not Gleam lamp-drinker, not Blush rosy-boa; never named wait / wake / still / wiggle / dart / trail / paddle / newt / eft / frog / toad / reed / pebble / gular / nictitate / tympanum / iliac / lentic / toepad / webbing / verruca / burrow / parotoid / tubercle / bufonid / unken / cranial / loam / knurl / plump / chorus / rivulet / spring / gill / amble / mend / smile / plume / warning / cirrus / hop / puff / dig / freeze — Echo/Quill birds — do not copy. crest dorsal crest raise without naming trail, caudal caudal-fin aquatic undulation without naming paddle or wiggle or dart, filament palmate filament tip sway without naming trail, costal costal-groove land crawl without naming dig, caudate long Caudata metabolic hold, hedonic hedonic-gland courtship press (THE salamandrid courtship tell), aposematic aposematic TTX orange-warning flash (THE Notophthalmus toxicity tell); vermilion / eftish / palmate thank-yous. Feed-happy after eat. Card-open freeze and window-play TRAIL do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop newt-tricks.js. Window-play TRAIL unchanged. Ethogram softs + freeze — never names wiggle/dart/still as trick kinds. Slip owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via newt.wav. */
export const TRICK_KEY = "newt";
export const TRICKS = ["crest", "caudal", "filament", "costal", "caudate", "hedonic", "aposematic"] as const;
export const HAPPY = ["vermilion", "eftish", "palmate"] as const;
export type NewtTrickKind = (typeof TRICKS)[number];
export type NewtHappyKind = (typeof HAPPY)[number];
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

export type NewtTrick = {
  kind: NewtTrickKind;
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

export type NewtHappy = {
  kind: NewtHappyKind;
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

export const HAPPY_DUR = { vermilion: 1.62, eftish: 1.74, palmate: 1.69 } as const;
export const CAUDATE_HOLD = 10.8;
export const RELEASE_S = 1.14;
export const DUR = {
  caudate: CAUDATE_HOLD + RELEASE_S,
  crest: 2.28,
  caudal: 2.42,
  filament: 2.34,
  costal: 2.38,
  hedonic: 2.36,
  aposematic: 2.31,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: NewtTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "caudate") return 38 + roll * 24;
  if (kind === "hedonic" || kind === "aposematic" || kind === "crest") return 12 + roll * 9;
  if (kind === "caudal" || kind === "filament" || kind === "costal") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: NewtTrickKind | string | null) {
  if (musicOn) return "caudate" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "caudate") {
    if (roll < 0.16) return "crest" as const;
    if (roll < 0.32) return "caudal" as const;
    if (roll < 0.48) return "filament" as const;
    if (roll < 0.64) return "costal" as const;
    if (roll < 0.82) return "hedonic" as const;
    return "aposematic" as const;
  }
  if (lastKind === "crest") {
    if (roll < 0.16) return "caudate" as const;
    if (roll < 0.32) return "caudal" as const;
    if (roll < 0.48) return "filament" as const;
    if (roll < 0.64) return "costal" as const;
    if (roll < 0.82) return "hedonic" as const;
    return "aposematic" as const;
  }
  if (lastKind === "caudal") {
    if (roll < 0.14) return "caudate" as const;
    if (roll < 0.3) return "crest" as const;
    if (roll < 0.46) return "filament" as const;
    if (roll < 0.62) return "costal" as const;
    if (roll < 0.8) return "hedonic" as const;
    return "aposematic" as const;
  }
  if (lastKind === "hedonic" || lastKind === "aposematic") {
    if (roll < 0.14) return "caudate" as const;
    if (roll < 0.3) return "crest" as const;
    if (roll < 0.46) return "caudal" as const;
    if (roll < 0.62) return "filament" as const;
    if (roll < 0.78) return "costal" as const;
    return lastKind === "hedonic" ? ("aposematic" as const) : ("hedonic" as const);
  }
  if (roll < 0.14) return "caudate" as const;
  if (roll < 0.28) return "crest" as const;
  if (roll < 0.42) return "caudal" as const;
  if (roll < 0.56) return "filament" as const;
  if (roll < 0.7) return "costal" as const;
  if (roll < 0.85) return "hedonic" as const;
  return "aposematic" as const;
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
  return key === TRICK_KEY || key === "eft";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: NewtHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as NewtHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: NewtHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: NewtHappyKind | string, x: number, facing: 1 | -1): NewtHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as NewtHappyKind) : "vermilion";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "vermilion" ? "sit" : name === "eftish" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function vermilionPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.vermilion));
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

export function eftishPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.eftish));
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

export function palmatePose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: NewtHappy, dt: number, flags: TrickFlags): NewtHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NewtHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "vermilion") {
    const pose = vermilionPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "eftish") {
    const pose = eftishPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = palmatePose(next.t);
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

export function beginTrick(kind: NewtTrickKind | string, x: number, facing: 1 | -1): NewtTrick {
  const anim: TrickAnim =
    kind === "caudate"
      ? "sit"
      : kind === "crest"
        ? "play"
        : kind === "caudal"
          ? "walk"
          : kind === "filament"
            ? "sit"
            : kind === "costal"
              ? "walk"
              : kind === "hedonic"
                ? "sit"
                : kind === "aposematic"
                  ? "play"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as NewtTrickKind) : "crest",
    phase: kind === "caudate" ? "hold" : "go",
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

export function caudatePose(t: number) {
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

export function crestPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.crest));
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 3.2, rot: s * -8 * facing, anim: "play" as TrickAnim };
  }
  if (u < 0.48) {
    const s = (u - 0.16) / 0.32;
    const crest = Math.sin(s * Math.PI);
    return {
      x: fromX + facing * crest * 0.12,
      lift: 3.2 + Math.abs(crest) * 1.4,
      rot: facing * (-8 + crest * 14),
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

export function caudalPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.caudal));
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

export function filamentPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.filament));
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

export function costalPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.costal));
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

export function hedonicPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hedonic));
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

export function aposematicPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.aposematic));
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

export function stepTrick(trick: NewtTrick, dt: number, flags: TrickFlags): NewtTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: NewtTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "caudate") {
    if (next.t < CAUDATE_HOLD) {
      const pose = caudatePose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < CAUDATE_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CAUDATE_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "crest") {
    const pose = crestPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "caudal") {
    const pose = caudalPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "filament") {
    const pose = filamentPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "costal") {
    const pose = costalPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hedonic") {
    const pose = hedonicPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = aposematicPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
