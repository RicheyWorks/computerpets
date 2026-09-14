/** Hour ground tricks while idle — ultra-polish pass. House neighborly Theridiidae / Latrodectus southern black-widow (widow / Hour) desk life — hourglass / tangle / wrap / gumfoot / combfoot / theridiid / latrodectus personality (hourglass ventral red-hourglass abdomen tip without naming flash or belly or mark or show or display or glass or red or warn, tangle messy irregular cobweb weave without naming web or silk or spin or nest or nestguard or mesh or lace or snare or radiate or stabilimentum or swathe or strum, wrap sticky prey-wrap wind without naming bite or kill or eat or prey or coil or wind alone as play or bind, gumfoot sticky gumfoot trap-line drop without naming trap or line or glue or sticky or foot or drop or hang or pendant or fall, combfoot theridiid comb-footed tarsus rake without naming comb or foot or rake or scrape or brush or tarsus alone as walk, theridiid family cobweb settle without naming family or settle or perch or crouch or still, long latrodectus Latrodectus mactans dark-corner tangle perch (THE latrodectus sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or urticate or threat or cork or ecdysis or rastellum or apophysis or aphonopelma or oil or dab or tip or drum or sip or hover or stridulate or hour or widow as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Velvet owns urticate/threat/cork/ecdysis/rastellum/apophysis/aphonopelma; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Chirp owns stridulate; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Hour / key widow only for isKey matching — accept "widow" and "hour"; do NOT name a trick "widow" or "hour" or "flash" or "silk" or "web" or "bite" or "venom" or "gaze" or "still") — not Velvet tarantula life, not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Stem harvestman life, not bird life. Hourglass abdomen tip without naming flash, tangle cobweb weave without naming web, wrap prey-wrap without naming bite, gumfoot trap-line without naming trap, combfoot tarsus rake without naming comb, theridiid family settle without naming still, latrodectus long sit_hold in the dark corner (THE latrodectus sit_hold tell); mactans / hesperus / geometricus thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop widow-tricks.js. Window-play CARRY unchanged. Ethogram softs + freeze — never names hang/still/hour/widow as bare ethogram-only trick kinds. True theridiid black-widow desk life only — distinct from Velvet, Prowl, Leap, Loom, Stem, and birds. Next house-order ultra: Barb / scorpion. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via widow.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "widow";
export const TRICKS = ["hourglass", "tangle", "wrap", "gumfoot", "combfoot", "theridiid", "latrodectus"] as const;
export const HAPPY = ["mactans", "hesperus", "geometricus"] as const;
export type WidowTrickKind = (typeof TRICKS)[number];
export type WidowHappyKind = (typeof HAPPY)[number];
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

export type WidowTrick = {
  kind: WidowTrickKind;
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

export type WidowHappy = {
  kind: WidowHappyKind;
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

export const HAPPY_DUR = { mactans: 1.70, hesperus: 1.84, geometricus: 1.76 } as const;
export const LATRODECTUS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  latrodectus: LATRODECTUS_HOLD + RELEASE_S,
  hourglass: 2.48,
  tangle: 2.42,
  wrap: 2.56,
  gumfoot: 2.44,
  combfoot: 2.40,
  theridiid: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: WidowTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "latrodectus") return 40 + roll * 26;
  if (kind === "combfoot" || kind === "theridiid" || kind === "hourglass") return 12.8 + roll * 9.4;
  if (kind === "tangle" || kind === "wrap" || kind === "gumfoot") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: WidowTrickKind | string | null) {
  if (musicOn) return "latrodectus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "latrodectus") {
    if (roll < 0.17) return "hourglass" as const;
    if (roll < 0.33) return "tangle" as const;
    if (roll < 0.49) return "wrap" as const;
    if (roll < 0.65) return "gumfoot" as const;
    if (roll < 0.83) return "combfoot" as const;
    return "theridiid" as const;
  }
  if (lastKind === "hourglass") {
    if (roll < 0.16) return "latrodectus" as const;
    if (roll < 0.32) return "tangle" as const;
    if (roll < 0.48) return "wrap" as const;
    if (roll < 0.64) return "gumfoot" as const;
    if (roll < 0.82) return "combfoot" as const;
    return "theridiid" as const;
  }
  if (lastKind === "tangle") {
    if (roll < 0.14) return "latrodectus" as const;
    if (roll < 0.3) return "hourglass" as const;
    if (roll < 0.46) return "wrap" as const;
    if (roll < 0.62) return "gumfoot" as const;
    if (roll < 0.8) return "combfoot" as const;
    return "theridiid" as const;
  }
  if (lastKind === "combfoot" || lastKind === "theridiid") {
    if (roll < 0.14) return "latrodectus" as const;
    if (roll < 0.3) return "hourglass" as const;
    if (roll < 0.46) return "tangle" as const;
    if (roll < 0.62) return "wrap" as const;
    if (roll < 0.78) return "gumfoot" as const;
    return lastKind === "combfoot" ? ("theridiid" as const) : ("combfoot" as const);
  }
  if (roll < 0.14) return "latrodectus" as const;
  if (roll < 0.28) return "hourglass" as const;
  if (roll < 0.42) return "tangle" as const;
  if (roll < 0.56) return "wrap" as const;
  if (roll < 0.7) return "gumfoot" as const;
  if (roll < 0.85) return "combfoot" as const;
  return "theridiid" as const;
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
  return key === TRICK_KEY || key === "hour";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: WidowHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as WidowHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: WidowHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: WidowHappyKind | string, x: number, facing: 1 | -1): WidowHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as WidowHappyKind) : "mactans";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "mactans" ? "sit" : name === "hesperus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function mactansPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.mactans));
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

export function hesperusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hesperus));
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

export function geometricusPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: WidowHappy, dt: number, flags: TrickFlags): WidowHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: WidowHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "mactans") {
    const pose = mactansPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hesperus") {
    const pose = hesperusPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = geometricusPose(next.t);
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

export function beginTrick(kind: WidowTrickKind | string, x: number, facing: 1 | -1): WidowTrick {
  const anim: TrickAnim =
    kind === "latrodectus"
      ? "sit"
      : kind === "hourglass"
        ? "sit"
        : kind === "tangle"
          ? "talk"
          : kind === "wrap"
            ? "play"
            : kind === "gumfoot"
              ? "play"
              : kind === "combfoot"
                ? "walk"
                : kind === "theridiid"
                  ? "play"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as WidowTrickKind) : "hourglass",
    phase: kind === "latrodectus" ? "hold" : "go",
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

export function latrodectusPose(t: number) {
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

export function hourglassPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hourglass));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.5, rot: s * 16 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin(t * 2.4);
    return {
      x: fromX + face * tip * 0.12,
      lift: 3.5 + Math.abs(tip) * 1.5,
      rot: face * (16 + tip * 10),
      anim: "sit" as TrickAnim,
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

export function tanglePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tangle));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX + face * s * 0.8, lift: s * 2.6, rot: s * 10 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const mess = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.8 + mess * 0.5),
      lift: 2.6 + Math.abs(mess) * 1.4,
      rot: face * (10 + mess * 12),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function wrapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.wrap));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: s * -14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const wind = Math.sin(t * 2.6);
    return {
      x: fromX - face * wind * 0.16,
      lift: 3.6 + Math.abs(wind) * 1.6,
      rot: face * (-14 + wind * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: face * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function gumfootPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.gumfoot));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX - face * s * 0.6, lift: s * 2.8, rot: s * -12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const drop = Math.sin(t * 2.2);
    return {
      x: fromX - face * (0.6 + Math.abs(drop) * 0.4),
      lift: 2.4 + Math.abs(drop) * 1.8,
      rot: face * (-12 + drop * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX - face * 0.6 * (1 - s),
    lift: 1.2 * (1 - s),
    rot: face * (-3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function combfootPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.combfoot));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.55) {
    const rake = Math.sin(t * 3.2);
    return {
      x: fromX + face * rake * 0.18,
      lift: 2.8 + rake * 1.6,
      rot: face * (12 + rake * 14),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const comb = Math.sin(t * 1.1);
    return {
      x: fromX + face * comb * 0.12,
      lift: 4.0 + Math.abs(comb) * 0.6,
      rot: face * (22 + comb * 4),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: face * (8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function theridiidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.theridiid));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const settle = Math.abs(Math.sin(t * 2.6));
    return {
      x: fromX + face * settle * 0.2,
      lift: 3.4 + settle * 1.4,
      rot: face * (-12 - settle * 10),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 1.4);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(hush) * 0.7,
      rot: face * (-18 + hush * 6),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: face * (-5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: WidowTrick, dt: number, flags: TrickFlags): WidowTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: WidowTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "latrodectus") {
    if (next.t < LATRODECTUS_HOLD) {
      const pose = latrodectusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < LATRODECTUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LATRODECTUS_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "hourglass") {
    const pose = hourglassPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tangle") {
    const pose = tanglePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "wrap") {
    const pose = wrapPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "gumfoot") {
    const pose = gumfootPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "combfoot") {
    const pose = combfootPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = theridiidPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
