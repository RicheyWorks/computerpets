/** Wash ground tricks while idle — ultra-polish pass. House neighborly Procyonidae / Procyon lotor raccoon ink-dish desk life (raccoon / Wash) — pawdouse / litterdig / rearstand / maskpeer / dexterous / ringtail / procyon personality (pawdouse dish-rinse douse without naming wash or rinse or soak or douse or dip or wet or bowl or water or scrub or laundry or soap, litterdig litter-rake fossick without naming dig or bury or scratch or scrape or rake or fossick or litter or dirt or soil or hole, rearstand bipedal peer without naming stand or rear or upright or biped or rise or stretch or tall or look or scan or monocle, maskpeer bandit-mask gaze without naming mask or peer or gaze or stare or bandit or face or eye or hunt or stalk or monocle or fossick, dexterous five-finger forepaw tell without naming hand or finger or grasp or grab or hold or manipulate or open or jar or latch or clever or smart, ringtail ringed-tail curl without naming tail or ring or curl or flick or brush or fluff or stripe alone as Stripe skunk, long procyon Procyon lotor freeze-alert ink hold (THE procyon sit_hold tell) — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or bellyglide or corkroll or shellcrunch or whiskernudge or denslide or spraint or lontra or nutbury or tailflick or cheekpouch or branchleap or barkscramble or scold or sciurus or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or tube or romp or steal or puff or noodle or corkscrew or slink or hang or roost or flutter or still or rinse or rummage or ferret or weasel or mink or otter or red_panda or wash as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play RUN unchanged if already fine; Slick owns bellyglide/corkroll/shellcrunch/whiskernudge/denslide/spraint/lontra; Cache owns nutbury/tailflick/cheekpouch/branchleap/barkscramble/scold/sciurus; Cape owns wingwrap/traguscup/thumbcrawl/duskhang/echolocate/calcar/eptesicus; Flag owns flagtail/edgebrowse/earswivel/forestamp/stotbound/snortblow/odocoileus; Stripe / skunk later owns stripe — leave stripe free as skunk tell; Rui is red_panda — never name a trick red_panda or wash or raccoon; ferret owns tube/romp/steal/puff/noodle/corkscrew/slink; Rue fox / Pip dog / Miso cat / Thimble rabbit stay distinct mammal peers; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum own bird tricks; guest slug Wash / key raccoon only for isKey matching — accept "raccoon" and "wash"; do NOT name a trick "raccoon" or "wash" or "rinse" or "rummage" or "coati" or "kinkajou" or "red_panda" or "otter" or "weasel" or "mink" or "ferret" or "skunk" or "stripe" or "slick") — not Slick otter life, not Cache squirrel life, not Cape bat life, not Flag deer life, not Stripe skunk life, not Rui red_panda life, not ferret clone, not bird life. Pawdouse dish-rinse without naming wash, litterdig litter-rake without naming dig, rearstand bipedal peer without naming stand, maskpeer bandit-mask without naming mask, dexterous five-finger forepaw without naming hand, ringtail ringed-tail curl without naming Stripe stripe, procyon long sit_hold in the ink dish (THE procyon sit_hold tell); ringden / inkmask / denscrub thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop raccoon-tricks.js. Window-play RUN unchanged. Ethogram softs + freeze — never names rinse/rummage/still/raccoon as bare ethogram-only trick kinds. True raccoon Procyonidae desk life only — distinct from Slick, Cache, Cape, Flag, Stripe, Rui, ferret, and birds. Next house-order ultra: Stripe / skunk. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via raccoon.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "raccoon";
export const TRICKS = ["pawdouse", "litterdig", "rearstand", "maskpeer", "dexterous", "ringtail", "procyon"] as const;
export const HAPPY = ["ringden", "inkmask", "denscrub"] as const;
export type RaccoonTrickKind = (typeof TRICKS)[number];
export type RaccoonHappyKind = (typeof HAPPY)[number];
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

export type RaccoonTrick = {
  kind: RaccoonTrickKind;
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

export type RaccoonHappy = {
  kind: RaccoonHappyKind;
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

export const HAPPY_DUR = { ringden: 1.70, inkmask: 1.84, denscrub: 1.76 } as const;
export const PROCYON_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  procyon: PROCYON_HOLD + RELEASE_S,
  pawdouse: 2.48,
  litterdig: 2.42,
  rearstand: 2.56,
  maskpeer: 2.44,
  dexterous: 2.40,
  ringtail: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: RaccoonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "procyon") return 40 + roll * 26;
  if (kind === "dexterous" || kind === "ringtail" || kind === "pawdouse") return 12.8 + roll * 9.4;
  if (kind === "litterdig" || kind === "rearstand" || kind === "maskpeer") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: RaccoonTrickKind | string | null) {
  if (musicOn) return "procyon" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "procyon") {
    if (roll < 0.17) return "pawdouse" as const;
    if (roll < 0.33) return "litterdig" as const;
    if (roll < 0.49) return "rearstand" as const;
    if (roll < 0.65) return "maskpeer" as const;
    if (roll < 0.83) return "dexterous" as const;
    return "ringtail" as const;
  }
  if (lastKind === "pawdouse") {
    if (roll < 0.16) return "procyon" as const;
    if (roll < 0.32) return "litterdig" as const;
    if (roll < 0.48) return "rearstand" as const;
    if (roll < 0.64) return "maskpeer" as const;
    if (roll < 0.82) return "dexterous" as const;
    return "ringtail" as const;
  }
  if (lastKind === "litterdig") {
    if (roll < 0.14) return "procyon" as const;
    if (roll < 0.3) return "pawdouse" as const;
    if (roll < 0.46) return "rearstand" as const;
    if (roll < 0.62) return "maskpeer" as const;
    if (roll < 0.8) return "dexterous" as const;
    return "ringtail" as const;
  }
  if (lastKind === "dexterous" || lastKind === "ringtail") {
    if (roll < 0.14) return "procyon" as const;
    if (roll < 0.3) return "pawdouse" as const;
    if (roll < 0.46) return "litterdig" as const;
    if (roll < 0.62) return "rearstand" as const;
    if (roll < 0.78) return "maskpeer" as const;
    return lastKind === "dexterous" ? ("ringtail" as const) : ("dexterous" as const);
  }
  if (roll < 0.14) return "procyon" as const;
  if (roll < 0.28) return "pawdouse" as const;
  if (roll < 0.42) return "litterdig" as const;
  if (roll < 0.56) return "rearstand" as const;
  if (roll < 0.7) return "maskpeer" as const;
  if (roll < 0.85) return "dexterous" as const;
  return "ringtail" as const;
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
  return key === TRICK_KEY || key === "wash";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: RaccoonHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as RaccoonHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: RaccoonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: RaccoonHappyKind | string, x: number, facing: 1 | -1): RaccoonHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as RaccoonHappyKind) : "ringden";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "ringden" ? "sit" : name === "inkmask" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function ringdenPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.ringden));
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

export function inkmaskPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkmask));
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

export function denscrubPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: RaccoonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "ringden") {
    const pose = ringdenPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkmask") {
    const pose = inkmaskPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denscrubPose(next.t);
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

export function beginTrick(kind: RaccoonTrickKind, x: number, facing: 1 | -1): RaccoonTrick {
  const anim: TrickAnim =
    kind === "procyon"
      ? "sit"
      : kind === "pawdouse"
        ? "play"
        : kind === "litterdig"
          ? "talk"
          : kind === "rearstand"
            ? "play"
            : kind === "maskpeer"
              ? "play"
              : kind === "dexterous"
                ? "talk"
                : kind === "ringtail"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "procyon" ? "hold" : "go",
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

export function procyonPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function pawdousePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pawdouse));
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

export function litterdigPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.litterdig));
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

export function rearstandPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rearstand));
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

export function maskpeerPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.maskpeer));
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

export function dexterousPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dexterous));
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

export function ringtailPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ringtail));
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

export function stepTrick(trick: RaccoonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "pawdouse" && trick.kind !== "litterdig" && trick.kind !== "rearstand" && trick.kind !== "maskpeer" && trick.kind !== "dexterous" && trick.kind !== "ringtail") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "procyon") {
    if (next.t < PROCYON_HOLD) {
      const pose = procyonPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PROCYON_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PROCYON_HOLD);
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
  if (next.kind === "pawdouse") {
    const pose = pawdousePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "litterdig") {
    const pose = litterdigPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rearstand") {
    const pose = rearstandPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "maskpeer") {
    const pose = maskpeerPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dexterous") {
    const pose = dexterousPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = ringtailPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
