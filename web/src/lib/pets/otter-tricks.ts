/** Slick ground tricks while idle — ultra-polish pass. House neighborly Mustelidae / Lontra canadensis North American river otter ink-dish desk life (otter / Slick) — bellyglide / corkroll / shellcrunch / whiskernudge / denslide / spraint / lontra personality (bellyglide bank belly-glide without naming slide or slip or swim or dive or toboggan or paddle or float or water or bank or mud or slick or otter, corkroll cork-barrel tumble without naming roll or spin or tumble or flip or twist or cartwheel or somersault or log or barrel or cork alone as Velvet cork, shellcrunch shell-crack meal without naming crunch or crack or chew or eat or feed or bite or smash or shell or clam or mussel or cray or jaw, whiskernudge vibrissa forage without naming whisker or hunt or forage or sniff or nose or probe or sweep or fossick or monocle or stalk or look, denslide den-slide bank crest without naming porpoise as bare swim/dive/surface or leap or hop or jump or glide or soar, spraint spraint-mark scent without naming spraint as bare pee or mark or scent or latrine or poop or dung or scrape, long lontra Lontra canadensis freeze-alert ink hold (THE lontra sit_hold tell) — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or nutbury or tailflick or cheekpouch or branchleap or barkscramble or scold or sciurus or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or tube or romp or steal or puff or noodle or corkscrew or slink or hang or roost or flutter or still or ferret or weasel or mink or slide or swim or groom as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Cache owns nutbury/tailflick/cheekpouch/branchleap/barkscramble/scold/sciurus; Cape owns wingwrap/traguscup/thumbcrawl/duskhang/echolocate/calcar/eptesicus; Flag owns flagtail/edgebrowse/earswivel/forestamp/stotbound/snortblow/odocoileus; Velvet owns cork; ferret owns tube/romp/steal/puff/noodle/corkscrew/slink — keep otter-true, not ferret clone; Glide flying_squirrel later owns glide — leave glide/soar free; Rue fox / Pip dog / Miso cat / Thimble rabbit stay distinct mammal peers; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own bird tricks; guest slug Slick / key otter only for isKey matching — accept "otter" and "slick"; do NOT name a trick "otter" or "slick" or "slide" or "swim" or "groom" or "weasel" or "mink" or "ferret" or "badger" or "marten" or "wolverine" or "glide" or "soar") — not Cache squirrel life, not Cape bat life, not Flag deer life, not ferret mustelid clone, not Glide flying-squirrel life, not Wash raccoon life, not bird life. Bellyglide bank belly-glide without naming slide, corkroll cork-barrel tumble without naming Velvet cork, shellcrunch shell-crack without naming crunch, whiskernudge vibrissa forage without naming whisker, denslide den-slide bank without naming swim, spraint spraint-mark without naming scent, lontra long sit_hold in the ink dish (THE lontra sit_hold tell); riverden / floatbelly / inkraft thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop otter-tricks.js. Window-play RUN unchanged. Ethogram softs + freeze — never names slide/swim/groom/otter as bare ethogram-only trick kinds. True North American river otter Mustelidae desk life only — distinct from Cache, Cape, Flag, ferret, Glide, Wash, and birds. Next house-order ultra: Wash / raccoon. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via otter.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "otter";
export const TRICKS = ["bellyglide", "corkroll", "shellcrunch", "whiskernudge", "denslide", "spraint", "lontra"] as const;
export const HAPPY = ["riverden", "floatbelly", "inkraft"] as const;
export type OtterTrickKind = (typeof TRICKS)[number];
export type OtterHappyKind = (typeof HAPPY)[number];
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

export type OtterTrick = {
  kind: OtterTrickKind;
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

export type OtterHappy = {
  kind: OtterHappyKind;
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

export const HAPPY_DUR = { riverden: 1.70, floatbelly: 1.84, inkraft: 1.76 } as const;
export const LONTRA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  lontra: LONTRA_HOLD + RELEASE_S,
  bellyglide: 2.48,
  corkroll: 2.42,
  shellcrunch: 2.56,
  whiskernudge: 2.44,
  denslide: 2.40,
  spraint: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: OtterTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "lontra") return 40 + roll * 26;
  if (kind === "denslide" || kind === "spraint" || kind === "bellyglide") return 12.8 + roll * 9.4;
  if (kind === "corkroll" || kind === "shellcrunch" || kind === "whiskernudge") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: OtterTrickKind | string | null) {
  if (musicOn) return "lontra" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "lontra") {
    if (roll < 0.17) return "bellyglide" as const;
    if (roll < 0.33) return "corkroll" as const;
    if (roll < 0.49) return "shellcrunch" as const;
    if (roll < 0.65) return "whiskernudge" as const;
    if (roll < 0.83) return "denslide" as const;
    return "spraint" as const;
  }
  if (lastKind === "bellyglide") {
    if (roll < 0.16) return "lontra" as const;
    if (roll < 0.32) return "corkroll" as const;
    if (roll < 0.48) return "shellcrunch" as const;
    if (roll < 0.64) return "whiskernudge" as const;
    if (roll < 0.82) return "denslide" as const;
    return "spraint" as const;
  }
  if (lastKind === "corkroll") {
    if (roll < 0.14) return "lontra" as const;
    if (roll < 0.3) return "bellyglide" as const;
    if (roll < 0.46) return "shellcrunch" as const;
    if (roll < 0.62) return "whiskernudge" as const;
    if (roll < 0.8) return "denslide" as const;
    return "spraint" as const;
  }
  if (lastKind === "denslide" || lastKind === "spraint") {
    if (roll < 0.14) return "lontra" as const;
    if (roll < 0.3) return "bellyglide" as const;
    if (roll < 0.46) return "corkroll" as const;
    if (roll < 0.62) return "shellcrunch" as const;
    if (roll < 0.78) return "whiskernudge" as const;
    return lastKind === "denslide" ? ("spraint" as const) : ("denslide" as const);
  }
  if (roll < 0.14) return "lontra" as const;
  if (roll < 0.28) return "bellyglide" as const;
  if (roll < 0.42) return "corkroll" as const;
  if (roll < 0.56) return "shellcrunch" as const;
  if (roll < 0.7) return "whiskernudge" as const;
  if (roll < 0.85) return "denslide" as const;
  return "spraint" as const;
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
  return key === TRICK_KEY || key === "slick";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: OtterHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as OtterHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: OtterHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: OtterHappyKind | string, x: number, facing: 1 | -1): OtterHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as OtterHappyKind) : "riverden";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "riverden" ? "sit" : name === "floatbelly" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function riverdenPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.riverden));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 2.8, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const flash = Math.sin(t * 2.2);
    return {
      lift: 2.8 + Math.abs(flash) * 1.4,
      rot: 12 + flash * 8,
      dx: flash * 0.08,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.78) / 0.22;
  return { lift: 2.0 * (1 - s), rot: 6 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function floatbellyPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.floatbelly));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 3.7, rot: s * -14, dx: s * 0.15, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const wriggle = Math.sin(t * 2.6);
    return {
      lift: 3.4 + Math.abs(wriggle) * 1.6,
      rot: -14 + wriggle * 10,
      dx: wriggle * 0.12,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.8) / 0.2;
  return { lift: 2.2 * (1 - s), rot: -6 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function inkraftPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: OtterHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "riverden") {
    const pose = riverdenPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "floatbelly") {
    const pose = floatbellyPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = inkraftPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

export function sleepHoldFrame(_key?: string | null, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: OtterTrickKind, x: number, facing: 1 | -1): OtterTrick {
  const anim: TrickAnim =
    kind === "lontra"
      ? "sit"
      : kind === "bellyglide"
        ? "play"
        : kind === "corkroll"
          ? "talk"
          : kind === "shellcrunch"
            ? "play"
            : kind === "whiskernudge"
              ? "play"
              : kind === "denslide"
                ? "talk"
                : kind === "spraint"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "lontra" ? "hold" : "go",
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

export function lontraPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function bellyglidePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bellyglide));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + tip * 0.12),
      lift: 3.5 + Math.abs(tip) * 1.5,
      rot: face * (16 + tip * 10),
      anim: "play" as TrickAnim,
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

export function corkrollPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.corkroll));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.8);
    return {
      x: fromX + face * bob * 0.5,
      lift: 2.6 + Math.abs(bob) * 1.4,
      rot: face * (-10 + bob * 12),
      anim: "talk" as TrickAnim,
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

export function shellcrunchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.shellcrunch));
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

export function whiskernudgePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.whiskernudge));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + nestle * 0.1),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 8),
      anim: "play" as TrickAnim,
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

export function denslidePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.denslide));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const tip = Math.sin(t * 2.0);
    return {
      x: fromX + face * tip * 0.08,
      lift: 2.8 + tip * 1.6,
      rot: face * (-12 + tip * 10),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.9);
    return {
      x: fromX,
      lift: 4.0 + Math.abs(hush) * 0.6,
      rot: face * (-4 + hush * 3),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: face * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function spraintPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.spraint));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const stretch = Math.sin(t * 2.3);
    return {
      x: fromX + face * stretch * 0.1,
      lift: 3.4 + stretch * 1.4,
      rot: face * (12 + stretch * 9),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.85);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(hush) * 0.7,
      rot: face * (5 + hush * 3),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: face * (2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: OtterTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "bellyglide" && trick.kind !== "corkroll" && trick.kind !== "shellcrunch" && trick.kind !== "whiskernudge" && trick.kind !== "denslide" && trick.kind !== "spraint") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "lontra") {
    if (next.t < LONTRA_HOLD) {
      const pose = lontraPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < LONTRA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LONTRA_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  }
  const hold = DUR[next.kind];
  const u = next.t / hold;
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "bellyglide") {
    const pose = bellyglidePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "corkroll") {
    const pose = corkrollPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "shellcrunch") {
    const pose = shellcrunchPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "whiskernudge") {
    const pose = whiskernudgePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "denslide") {
    const pose = denslidePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = spraintPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
