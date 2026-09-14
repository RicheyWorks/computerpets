/** Stem ground tricks while idle — ultra-polish pass. House neighborly Opiliones / Phalangium common-harvestman (harvestman / Stem) desk life — legwave / oscillate / autotomy / gregarious / ozopore / leiobunum / phalangium personality (legwave second-pair sensory-leg wave without naming antenna or feel or pat or sense or probe or bob or palp or pedipalp or dragline or saccade or orient, oscillate defensive body-bob without naming bob or jiggle or shake or bounce or rock or sway or pulse or tremble, autotomy readiness tip-cast without naming legdrop or castleg or drop or cast or shed or molt or ecdysis or cork, gregarious quiet cluster-settle without naming huddle or aggregate or clump or cluster or pile or roost or nest or nestguard, ozopore defensive scent-gland tip without naming scent or stink or spray or gland or poison or venom or smell or odor, leiobunum Leiobunum long-leg stretch without naming longleg or daddy or daddy-long-legs or stretch alone as walk, long phalangium Phalangium opilio blotter-stem walk-hold (THE phalangium sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or hourglass or tangle or wrap or gumfoot or combfoot or theridiid or latrodectus or pedipalp or metasoma or fluoresce or sanddig or centruroides or oil or dab or tip or drum or sip or hover or stridulate or stem or harvestman as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Hour owns hourglass/tangle/wrap/gumfoot/combfoot/theridiid/latrodectus; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Barb owns pedipalp/metasoma/fluoresce/sanddig/centruroides; Chirp owns stridulate; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Stem / key harvestman only for isKey matching — accept "harvestman" and "stem"; do NOT name a trick "harvestman" or "stem" or "spider" or "silk" or "web" or "bob" or "probe" or "huddle" or "venom" or "gaze" or "still" or "pedipalp") — not Hour widow life, not Velvet tarantula life, not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Barb scorpion life, not bird life. Legwave sensory wave without naming antenna, oscillate defensive bob without naming shake, autotomy tip-cast without naming molt, gregarious cluster without naming huddle, ozopore scent-gland tip without naming spray, leiobunum long-leg stretch without naming daddy, phalangium long sit_hold on the blotter (THE phalangium sit_hold tell); opilio / parietinus / vittatum thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop harvestman-tricks.js. Window-play CARRY unchanged. Ethogram softs + freeze — never names walk/stem/still/harvestman as bare ethogram-only trick kinds. True Opiliones harvestman desk life only — distinct from Hour, Velvet, Prowl, Leap, Loom, Barb, and birds. Next house-order ultra: Whip / vinegaroon. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via harvestman.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "harvestman";
export const TRICKS = ["legwave", "oscillate", "autotomy", "gregarious", "ozopore", "leiobunum", "phalangium"] as const;
export const HAPPY = ["opilio", "parietinus", "vittatum"] as const;
export type HarvestmanTrickKind = (typeof TRICKS)[number];
export type HarvestmanHappyKind = (typeof HAPPY)[number];
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

export type HarvestmanTrick = {
  kind: HarvestmanTrickKind;
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

export type HarvestmanHappy = {
  kind: HarvestmanHappyKind;
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

export const HAPPY_DUR = { opilio: 1.70, parietinus: 1.84, vittatum: 1.76 } as const;
export const PHALANGIUM_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  phalangium: PHALANGIUM_HOLD + RELEASE_S,
  legwave: 2.48,
  oscillate: 2.42,
  autotomy: 2.56,
  gregarious: 2.44,
  ozopore: 2.40,
  leiobunum: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: HarvestmanTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "phalangium") return 40 + roll * 26;
  if (kind === "ozopore" || kind === "leiobunum" || kind === "legwave") return 12.8 + roll * 9.4;
  if (kind === "oscillate" || kind === "autotomy" || kind === "gregarious") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: HarvestmanTrickKind | string | null) {
  if (musicOn) return "phalangium" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "phalangium") {
    if (roll < 0.17) return "legwave" as const;
    if (roll < 0.33) return "oscillate" as const;
    if (roll < 0.49) return "autotomy" as const;
    if (roll < 0.65) return "gregarious" as const;
    if (roll < 0.83) return "ozopore" as const;
    return "leiobunum" as const;
  }
  if (lastKind === "legwave") {
    if (roll < 0.16) return "phalangium" as const;
    if (roll < 0.32) return "oscillate" as const;
    if (roll < 0.48) return "autotomy" as const;
    if (roll < 0.64) return "gregarious" as const;
    if (roll < 0.82) return "ozopore" as const;
    return "leiobunum" as const;
  }
  if (lastKind === "oscillate") {
    if (roll < 0.14) return "phalangium" as const;
    if (roll < 0.3) return "legwave" as const;
    if (roll < 0.46) return "autotomy" as const;
    if (roll < 0.62) return "gregarious" as const;
    if (roll < 0.8) return "ozopore" as const;
    return "leiobunum" as const;
  }
  if (lastKind === "ozopore" || lastKind === "leiobunum") {
    if (roll < 0.14) return "phalangium" as const;
    if (roll < 0.3) return "legwave" as const;
    if (roll < 0.46) return "oscillate" as const;
    if (roll < 0.62) return "autotomy" as const;
    if (roll < 0.78) return "gregarious" as const;
    return lastKind === "ozopore" ? ("leiobunum" as const) : ("ozopore" as const);
  }
  if (roll < 0.14) return "phalangium" as const;
  if (roll < 0.28) return "legwave" as const;
  if (roll < 0.42) return "oscillate" as const;
  if (roll < 0.56) return "autotomy" as const;
  if (roll < 0.7) return "gregarious" as const;
  if (roll < 0.85) return "ozopore" as const;
  return "leiobunum" as const;
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
  return key === TRICK_KEY || key === "stem";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: HarvestmanHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as HarvestmanHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: HarvestmanHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: HarvestmanHappyKind | string, x: number, facing: 1 | -1): HarvestmanHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as HarvestmanHappyKind) : "opilio";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "opilio" ? "sit" : name === "parietinus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function opilioPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.opilio));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 1.72);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: 0,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function parietinusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.parietinus));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
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

export function vittatumPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: HarvestmanHappy, dt: number, flags: TrickFlags): HarvestmanHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HarvestmanHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "opilio") {
    const pose = opilioPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "parietinus") {
    const pose = parietinusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = vittatumPose(next.t);
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

export function beginTrick(kind: HarvestmanTrickKind | string, x: number, facing: 1 | -1): HarvestmanTrick {
  const anim: TrickAnim =
    kind === "phalangium"
      ? "sit"
      : kind === "legwave"
        ? "talk"
        : kind === "oscillate"
          ? "play"
          : kind === "autotomy"
            ? "play"
            : kind === "gregarious"
              ? "sit"
              : kind === "ozopore"
                ? "play"
                : kind === "leiobunum"
                  ? "walk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as HarvestmanTrickKind) : "legwave",
    phase: kind === "phalangium" ? "hold" : "go",
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

export function phalangiumPose(t: number) {
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

export function legwavePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.legwave));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + tip * 0.12),
      lift: 3.5 + Math.abs(tip) * 1.5,
      rot: face * (16 + tip * 10),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function oscillatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.oscillate));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.8);
    return {
      x: fromX + face * bob * 0.5,
      lift: 2.6 + Math.abs(bob) * 1.4,
      rot: face * (-10 + bob * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (-3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function autotomyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.autotomy));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const cast = Math.sin(t * 2.6);
    return {
      x: fromX - face * cast * 0.16,
      lift: 3.6 + Math.abs(cast) * 1.6,
      rot: face * (14 + cast * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function gregariousPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gregarious));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + Math.abs(nestle) * 0.4),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 10),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function ozoporePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ozopore));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const tip = Math.sin(t * 3.2);
    return {
      x: fromX + face * tip * 0.18,
      lift: 2.8 + tip * 1.6,
      rot: face * (-12 + tip * 14),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 1.1);
    return {
      x: fromX + face * hush * 0.12,
      lift: 4.0 + Math.abs(hush) * 0.6,
      rot: face * (-22 + hush * 4),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: face * (-8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function leiobunumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.leiobunum));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.55) {
    const stretch = Math.abs(Math.sin(t * 2.6));
    return {
      x: fromX + face * stretch * 0.2,
      lift: 3.4 + stretch * 1.4,
      rot: face * (12 + stretch * 10),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 1.4);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(hush) * 0.7,
      rot: face * (18 + hush * 6),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: face * (5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: HarvestmanTrick, dt: number, flags: TrickFlags): HarvestmanTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: HarvestmanTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "phalangium") {
    if (next.t < PHALANGIUM_HOLD) {
      const pose = phalangiumPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < PHALANGIUM_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PHALANGIUM_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "legwave") {
    const pose = legwavePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "oscillate") {
    const pose = oscillatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "autotomy") {
    const pose = autotomyPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gregarious") {
    const pose = gregariousPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ozopore") {
    const pose = ozoporePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = leiobunumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
