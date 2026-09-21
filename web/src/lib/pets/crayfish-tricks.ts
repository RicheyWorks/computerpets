/** Pinch ground tricks while idle — ultra-polish pass. House neighborly Astacoidea common-crayfish desk life — chelate / caridoid / chimney / antennule / astacid / scaph / meral personality (chelate cheliped snap without naming claw or snap or pinch, caridoid tail-flip escape burst without naming flip or dart or escape, chimney mud-bank burrow settle without naming burrow or dig or fossorial, antennule tip-tap probe without naming antenna or tap, long astacid Astacoidea desk hold under the tray grain, scaph scaphognathite gill-bailer pulse without naming bailer or breath or gill, meral meral-spread threat raise without naming threat or brandish or claw — never named wait or wake or still or hide or cover or wiggle or claw or snap or pinch or antenna or burrow or dig or flip or telson or carapace or swap or scuttle or withdraw or vacancy or bookgill or furrow or fossil or annulate or fossorial or tentacular or hydrostatic or gymnophion or stegos or dualjaw or bailer or chela or radula or pedal or pneumostome or ommatophore or lymnaeid as trick kinds; window-play CLAW owns claw; ethogram softs + freeze own those words; special Pinch owns pinch; Tenant owns swap/antenna/scuttle/withdraw/vacancy/chela/bailer; Ledger owns carapace/bookgill/telson/furrow/fossil; Slip owns annulate/fossorial/tentacular/hydrostatic/gymnophion/stegos/dualjaw; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Pebble owns burrow; guest slug Pinch / key crayfish only for isKey matching — accept "crayfish" and "pinch"; do NOT name a trick "crayfish" or "pinch" or "claw" or "snap" or "antenna" or "burrow" or "flip" or "telson" or "carapace" or "annulate" or "fossorial" or "tentacular" or "hydrostatic" or "gymnophion" or "stegos" or "dualjaw" or "bailer" or "chela" or "radula" or "pedal" or "pneumostome" or "ommatophore" or "lymnaeid") — not Tenant hermit shell life, not Ledger horseshoe helmet life, not Slip caecilian silt life, not Whorl pond-snail life. chelate cheliped snap on the tray without naming claw or snap or pinch, caridoid uropod-tail flip retreat without naming flip or dart, chimney mud chimney settle without naming burrow or dig, antennule antennular tap without naming antenna, astacid long Astacoidea metabolic hold under the scrap grain, scaph scaphognathite gill-bailer pulse (THE decapod breathing tell), meral meral-spread threat raise (THE crayfish agonistic tell); clasp / marl / chitin thank-yous. Feed-happy after eat. Card-open freeze and window-play CLAW do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop crayfish-tricks.js. Window-play CLAW unchanged. Ethogram softs + freeze — never names pinch/snap/still/wiggle as trick kinds. Hinge owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights (ASTACID_HOLD=11.2 RELEASE_S=1.18). Next leftover Hinge / mussel. prefersHouseCry via crayfish.wav. */
export const TRICK_KEY = "crayfish";
export const TRICKS = ["chelate", "caridoid", "chimney", "antennule", "astacid", "scaph", "meral"] as const;
export const HAPPY = ["clasp", "marl", "chitin"] as const;
export type CrayfishTrickKind = (typeof TRICKS)[number];
export type CrayfishHappyKind = (typeof HAPPY)[number];
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

export type CrayfishTrick = {
  kind: CrayfishTrickKind;
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

export type CrayfishHappy = {
  kind: CrayfishHappyKind;
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

export const HAPPY_DUR = { clasp: 1.64, marl: 1.76, chitin: 1.71 } as const;
export const ASTACID_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  astacid: ASTACID_HOLD + RELEASE_S,
  chelate: 2.28,
  caridoid: 2.42,
  chimney: 2.48,
  antennule: 2.34,
  scaph: 2.36,
  meral: 2.31,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CrayfishTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "astacid") return 40 + roll * 26;
  if (kind === "scaph" || kind === "meral" || kind === "chelate" || kind === "caridoid" || kind === "chimney" || kind === "antennule") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: CrayfishTrickKind | string | null): CrayfishTrickKind {
  if (musicOn) return "astacid";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "astacid" ? 0.72 : k === "scaph" || k === "meral" ? 1.28 : k === "chelate" || k === "caridoid" || k === "chimney" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "chelate";
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
  return key === TRICK_KEY || key === "pinch";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CrayfishHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CrayfishHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CrayfishHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CrayfishHappyKind | string, x: number, facing: 1 | -1): CrayfishHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CrayfishHappyKind) : "clasp";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "clasp" ? "sit" : name === "marl" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function claspPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.clasp));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 3.36, rot: s * 14.4, dx: 0, anim: "talk" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 1.72);
    return {
      lift: 3.36 + Math.abs(flash) * 1.68,
      rot: 14.4 + flash * 9.6,
      dx: 0,
      anim: "talk" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 2.4 * (1 - s), rot: 7.2 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function marlPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.marl));
  if (u < 0.14) {
    const s = u / 0.14;
    return { lift: s * 4.08, rot: s * -16.8, dx: s * 0.18, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const wriggle = Math.sin(t * 2.1);
    return {
      lift: 4.08 + Math.abs(wriggle) * 1.92,
      rot: -16.8 + wriggle * 12,
      dx: 0.096,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 2.64 * (1 - s), rot: -7.2 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function chitinPose(t: number) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
    rot: Math.sin(t * 0.624) * 7.2,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: CrayfishHappy, dt: number, flags: TrickFlags): CrayfishHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CrayfishHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "clasp") {
    const pose = claspPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "marl") {
    const pose = marlPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = chitinPose(next.t);
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

export function beginTrick(kind: CrayfishTrickKind | string, x: number, facing: 1 | -1): CrayfishTrick {
  const anim: TrickAnim =
    kind === "astacid"
      ? "sit"
      : kind === "chelate"
        ? "play"
        : kind === "caridoid"
          ? "play"
          : kind === "chimney"
            ? "walk"
            : kind === "antennule"
              ? "sit"
              : kind === "scaph"
                ? "sit"
                : kind === "meral"
                  ? "play"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as CrayfishTrickKind) : "chelate",
    phase: kind === "astacid" ? "hold" : "go",
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

export function astacidPose(t: number) {
  return {
    lift: 2.88 + Math.abs(Math.sin(t * 0.504)) * 1.44,
    rot: -0.216 + Math.sin(t * 0.168) * 4.8,
    anim: "sit" as TrickAnim,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.88 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.216 * (1 - u) };
}

export function chelatePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chelate));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.84, rot: s * 16.8 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const snap = Math.sin(t * 2.4);
    return {
      x: fromX + face * snap * 0.144,
      lift: 3.84 + Math.abs(snap) * 1.68,
      rot: face * (16.8 + snap * 12),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.68 * (1 - s),
    rot: face * (4.8 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function caridoidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.caridoid));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4.32, rot: s * -19.2 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.48) {
    const s = smoothstep((u - 0.12) / 0.36);
    return {
      x: fromX - face * (2.64 + s * 5.4),
      lift: 4.32 + Math.sin(s * Math.PI) * 2.64,
      rot: face * (-19.2 + s * 26.4),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const settle = Math.sin(s * Math.PI * 2.1);
    return {
      x: fromX - face * (8.04 * (1 - s)),
      lift: 2.88 + Math.abs(settle) * 1.32,
      rot: face * (7.2 + settle * 9.6),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.68 * (1 - s),
    rot: face * (3.6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function chimneyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.chimney));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.96, lift: s * 2.64, rot: s * 9.6 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.72) {
    const mud = Math.sin(t * 1.6);
    return {
      x: fromX + face * (0.96 + mud * 0.48),
      lift: 2.64 + Math.abs(mud) * 1.0,
      rot: face * (9.6 + mud * 12),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + face * 0.96 * (1 - s),
    lift: 1.44 * (1 - s),
    rot: face * (3.6 * (1 - s)),
    anim: s > 0.6 ? ("idle" as TrickAnim) : ("sit" as TrickAnim),
  };
}

export function antennulePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.antennule));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.88, rot: s * 12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const tap = Math.sin(t * 2.8);
    return {
      x: fromX + face * tap * 0.24,
      lift: 2.88 + Math.abs(tap) * 1.32,
      rot: face * (12 + tap * 14.4),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX,
    lift: 1.44 * (1 - s),
    rot: face * (3.6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function scaphPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scaph));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.36, rot: s * 14.4 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const pulse = Math.sin(t * 3.2);
    return {
      x: fromX,
      lift: 3.36 + pulse * 1.92,
      rot: face * (14.4 + pulse * 16.8),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const scent = Math.sin(t * 1.1);
    return {
      x: fromX + face * scent * 0.18,
      lift: 4.8 + Math.abs(scent) * 0.72,
      rot: face * (26.4 + scent * 4.8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.4 * (1 - s),
    rot: face * (9.6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function meralPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.meral));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.08, rot: s * -14.4 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const flash = Math.abs(Math.sin(t * 2.6));
    return {
      x: fromX + face * flash * 0.24,
      lift: 4.08 + flash * 1.68,
      rot: face * (-14.4 - flash * 12),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const warn = Math.sin(t * 1.4);
    return {
      x: fromX,
      lift: 5.28 + Math.abs(warn) * 0.84,
      rot: face * (-21.6 + warn * 7.2),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.16 * (1 - s),
    rot: face * (-6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: CrayfishTrick, dt: number, flags: TrickFlags): CrayfishTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: CrayfishTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "astacid") {
    if (next.t < ASTACID_HOLD) {
      const pose = astacidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < ASTACID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ASTACID_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "chelate") {
    const pose = chelatePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "caridoid") {
    const pose = caridoidPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "chimney") {
    const pose = chimneyPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "antennule") {
    const pose = antennulePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "scaph") {
    const pose = scaphPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = meralPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
