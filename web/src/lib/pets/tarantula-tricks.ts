/** Velvet ground tricks while idle — ultra-polish pass. House neighborly Theraphosidae / Aphonopelma desert-blonde (tarantula / Velvet) desk life — urticate / threat / cork / ecdysis / rastellum / apophysis / aphonopelma personality (urticate urticating-setae abdomen kick without naming flick or kick or brush or hair or sting or spray or defense or attack, threat threat-rear pedipalp raise without naming rear or stand or scare or display or warn or charge or rise or tower, cork burrow-mouth silk plug without naming plug or seal or burrow or nest or silk or web or door or lid or cork alone as wait, ecdysis molt soft-back posture without naming molt or shed or flip or soft or belly or roll or ecdysis alone as sleep, rastellum fossorial cheliceral rake without naming dig or burrow or rake or scrape or shovel or tunnel or litter, apophysis tibial mating-spur flash without naming spur or kick or jab or tibia or strike or fence or hook, long aphonopelma sit_hold under the scrap lamp (THE aphonopelma sit_hold tell) — never named wait or crouch or roost or leap or hop or pounce or look or stalk or monocle or fossick or anting or corvid or dihedral or billtap or tumble or cronk or hackles or diskturn or softcrouch or parallax or snore or tytonid or kettle or stoop or bind or keeyer or buteo or feebee or gargle or hangup or cache or poecile or runstop or listen or carol or tug or turdus or dabble or upend or headshake or gruntwhistle or anas or graze or hiss or nestguard or honk or branta or excavate or hitch or crestflare or kuk or dryocopus or nectary or shuttle or gorget or chip or archilochus or radiate or stabilimentum or swathe or strum or araneus or dragline or viscid or orient or saccade or palp or safetyline or ame or scopula or phidippus or cursor or eggsac or spiderling or eyeshine or spur or apron or tigrosa or oil or dab or tip or drum or sip or hover or stridulate or velvet as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play CARRY unchanged if already fine; Prowl owns cursor/eggsac/spiderling/eyeshine/spur/apron/tigrosa; Leap owns orient/saccade/palp/safetyline/ame/scopula/phidippus; Loom owns radiate/stabilimentum/swathe/strum/araneus/dragline/viscid; Chirp owns stridulate; Jet owns velvet_worm life; Soot/Wedge/Heart/Hook/Dee/Brick/Drake/Vee/Drum/Sip own bird tricks; guest slug Velvet / key tarantula only for isKey matching — accept "tarantula" and "velvet"; do NOT name a trick "tarantula" or "velvet" or "flick" or "kick" or "burrow" or "molt" or "silk" or "web" or "gaze" or "still" or "stridulate") — not Prowl wolf_spider life, not Leap jumping_spider life, not Loom orb_weaver life, not Hour widow life, not Jet velvet_worm life, not bird life. Urticate setae kick without naming flick, threat rear without naming stand, cork plug without naming burrow, ecdysis soft-back without naming molt, rastellum fossorial rake without naming dig, apophysis tibial flash without naming spur, aphonopelma long sit_hold under the scrap lamp (THE aphonopelma sit_hold tell); chalcodes / hentzi / iodius thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop tarantula-tricks.js. Window-play CARRY unchanged. Ethogram softs + freeze — never names flick/walk/still/tarantula/velvet as bare ethogram-only trick kinds. True desert-blonde theraphosid desk life only — distinct from Prowl, Leap, Loom, Hour, Jet, and birds. Next house-order ultra: Flag / deer. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry via tarantula.wav. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "tarantula";
export const TRICKS = ["urticate", "threat", "cork", "ecdysis", "rastellum", "apophysis", "aphonopelma"] as const;
export const HAPPY = ["chalcodes", "hentzi", "iodius"] as const;
export type TarantulaTrickKind = (typeof TRICKS)[number];
export type TarantulaHappyKind = (typeof HAPPY)[number];
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

export type TarantulaTrick = {
  kind: TarantulaTrickKind;
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

export type TarantulaHappy = {
  kind: TarantulaHappyKind;
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

export const HAPPY_DUR = { chalcodes: 1.70, hentzi: 1.82, iodius: 1.71 } as const;
export const APHONOPELMA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  aphonopelma: APHONOPELMA_HOLD + RELEASE_S,
  urticate: 2.36,
  threat: 2.50,
  cork: 2.56,
  ecdysis: 2.42,
  rastellum: 2.44,
  apophysis: 2.39,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TarantulaTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "aphonopelma") return 40 + roll * 26;
  if (kind === "rastellum" || kind === "apophysis" || kind === "urticate") return 12.8 + roll * 9.4;
  if (kind === "threat" || kind === "cork" || kind === "ecdysis") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TarantulaTrickKind | string | null) {
  if (musicOn) return "aphonopelma" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "aphonopelma") {
    if (roll < 0.17) return "urticate" as const;
    if (roll < 0.33) return "threat" as const;
    if (roll < 0.49) return "cork" as const;
    if (roll < 0.65) return "ecdysis" as const;
    if (roll < 0.83) return "rastellum" as const;
    return "apophysis" as const;
  }
  if (lastKind === "urticate") {
    if (roll < 0.16) return "aphonopelma" as const;
    if (roll < 0.32) return "threat" as const;
    if (roll < 0.48) return "cork" as const;
    if (roll < 0.64) return "ecdysis" as const;
    if (roll < 0.82) return "rastellum" as const;
    return "apophysis" as const;
  }
  if (lastKind === "threat") {
    if (roll < 0.14) return "aphonopelma" as const;
    if (roll < 0.3) return "urticate" as const;
    if (roll < 0.46) return "cork" as const;
    if (roll < 0.62) return "ecdysis" as const;
    if (roll < 0.8) return "rastellum" as const;
    return "apophysis" as const;
  }
  if (lastKind === "rastellum" || lastKind === "apophysis") {
    if (roll < 0.14) return "aphonopelma" as const;
    if (roll < 0.3) return "urticate" as const;
    if (roll < 0.46) return "threat" as const;
    if (roll < 0.62) return "cork" as const;
    if (roll < 0.78) return "ecdysis" as const;
    return lastKind === "rastellum" ? ("apophysis" as const) : ("rastellum" as const);
  }
  if (roll < 0.14) return "aphonopelma" as const;
  if (roll < 0.28) return "urticate" as const;
  if (roll < 0.42) return "threat" as const;
  if (roll < 0.56) return "cork" as const;
  if (roll < 0.7) return "ecdysis" as const;
  if (roll < 0.85) return "rastellum" as const;
  return "apophysis" as const;
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
  return key === TRICK_KEY || key === "velvet";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: TarantulaHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as TarantulaHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: TarantulaHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: TarantulaHappyKind | string, x: number, facing: 1 | -1): TarantulaHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as TarantulaHappyKind) : "chalcodes";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "chalcodes" ? "sit" : name === "hentzi" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function chalcodesPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.chalcodes));
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

export function hentziPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.hentzi));
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

export function iodiusPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: TarantulaHappy, dt: number, flags: TrickFlags): TarantulaHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: TarantulaHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "chalcodes") {
    const pose = chalcodesPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "hentzi") {
    const pose = hentziPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = iodiusPose(next.t);
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

export function beginTrick(kind: TarantulaTrickKind | string, x: number, facing: 1 | -1): TarantulaTrick {
  const anim: TrickAnim =
    kind === "aphonopelma"
      ? "sit"
      : kind === "urticate"
        ? "play"
        : kind === "threat"
          ? "sit"
          : kind === "cork"
            ? "talk"
            : kind === "ecdysis"
              ? "sit"
              : kind === "rastellum"
                ? "walk"
                : kind === "apophysis"
                  ? "walk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as TarantulaTrickKind) : "urticate",
    phase: kind === "aphonopelma" ? "hold" : "go",
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

export function aphonopelmaPose(t: number) {
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

export function urticatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.urticate));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.5, rot: s * -14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const snap = Math.sin(t * 2.4);
    return {
      x: fromX - face * snap * 0.14,
      lift: 3.5 + Math.abs(snap) * 1.5,
      rot: face * (-15 + snap * 11),
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

export function threatPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.threat));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.9, rot: s * -16 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.48) {
    const s = smoothstep((u - 0.12) / 0.36);
    return {
      x: fromX + face * (2.2 + s * 4.5) * 0,
      lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
      rot: face * (-16 + s * 6),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const settle = Math.sin(s * Math.PI * 2.1);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(settle) * 1.1,
      rot: face * (-18 + settle * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: face * (-3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function corkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cork));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.72) {
    const mud = Math.sin(t * 1.6);
    return {
      x: fromX + face * (0.8 + mud * 0.4),
      lift: 2.2 + Math.abs(mud) * 1.0,
      rot: face * (8 + mud * 10),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: s > 0.6 ? ("idle" as TrickAnim) : ("talk" as TrickAnim),
  };
}

export function ecdysisPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ecdysis));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.4, rot: s * 14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const tap = Math.sin(t * 2.8);
    return {
      x: fromX + face * tap * 0.2,
      lift: 2.4 + Math.abs(tap) * 1.1,
      rot: face * (14 + tap * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function rastellumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rastellum));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.55) {
    const pulse = Math.sin(t * 3.2);
    return {
      x: fromX,
      lift: 2.8 + pulse * 1.6,
      rot: face * (12 + pulse * 14),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const scent = Math.sin(t * 1.1);
    return {
      x: fromX + face * scent * 0.15,
      lift: 4.0 + Math.abs(scent) * 0.6,
      rot: face * (22 + scent * 4),
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

export function apophysisPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.apophysis));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * -12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.55) {
    const flash = Math.abs(Math.sin(t * 2.6));
    return {
      x: fromX + face * flash * 0.2,
      lift: 3.4 + flash * 1.4,
      rot: face * (-12 - flash * 10),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const warn = Math.sin(t * 1.4);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(warn) * 0.7,
      rot: face * (-18 + warn * 6),
      anim: "walk" as TrickAnim,
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

export function stepTrick(trick: TarantulaTrick, dt: number, flags: TrickFlags): TarantulaTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: TarantulaTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "aphonopelma") {
    if (next.t < APHONOPELMA_HOLD) {
      const pose = aphonopelmaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < APHONOPELMA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - APHONOPELMA_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "urticate") {
    const pose = urticatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "threat") {
    const pose = threatPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cork") {
    const pose = corkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ecdysis") {
    const pose = ecdysisPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rastellum") {
    const pose = rastellumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = apophysisPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
