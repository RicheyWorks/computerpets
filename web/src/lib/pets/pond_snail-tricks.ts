/** Whorl ground tricks while idle — ultra-polish pass. House neighborly Lymnaea/Physa great-pond-snail desk life — radula / pedal / pneumostome / ommatophore / lymnaeid / odontophore / neuston personality (radula biofilm scrape without naming rasp or scrape or grind, pedal muscular-foot glide without naming crawl or trail or mucus, pneumostome air-lung surface rise without naming breath or surfacing or float, ommatophore eye-stalk tip probe without naming antenna or tentacular or fringe or tap, long lymnaeid Lymnaea desk hold under the film grain, odontophore odontophore cartilage pulse without naming radula or buccal or grind, neuston inverted surface-film cling without naming crawl or float or trail — never named wait or wake or still or hide or cover or wiggle or rasp or crawl or trail or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or scaph or meral or mantle or sucker or jet or burrow or dig or flip or claw or snap or pinch or adductor or protractor or inhalant or ctenidium or unionid or annulate or fossorial or tentacular or hydrostatic or gymnophion or stegos or dualjaw as trick kinds; window-play Rasp owns rasp; ethogram softs + freeze own those words; special Whorl owns whorl; Chamber owns spiral/siphuncle/nacre/pinhole/fringe/aperture; Tenant owns swap/antenna/scuttle/withdraw/vacancy; Pinch owns chelate/caridoid/chimney/antennule/astacid/scaph/meral; Hinge owns adductor/protractor/inhalant/ctenidium/unionid/ligament/glochid; Cup owns mantle; Pulse owns trail; Auger owns rasp; Slip owns tentacular/annulate/fossorial/hydrostatic/gymnophion/stegos/dualjaw; Pebble owns burrow; guest slug Whorl / key pond_snail only for isKey matching — accept "pond_snail" and "whorl"; do NOT name a trick "pond_snail" or "whorl" or "rasp" or "spiral" or "antenna" or "mantle" or "trail" or "crawl" or "chelate" or "chimney" or "astacid" or "scaph" or "meral" or "adductor" or "unionid") — not Chamber nautilus shell life, not Tenant hermit shell life, not Pinch crayfish claw life, not Hinge mussel valve life. radula radular scrape on the tray film without naming rasp, pedal foot-glide without naming crawl or trail, pneumostome pulmonate air-lung rise without naming breath, ommatophore eye-stalk probe without naming antenna, lymnaeid long Lymnaea metabolic hold under the scrap film, odontophore odontophore cartilage pulse (THE molluscan buccal tell), neuston inverted surface-film cling (THE aquarium-glass / pond-film tell); stagnalis / physa / radix thank-yous. Feed-happy after eat. Card-open freeze and window-play Rasp do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop pond_snail-tricks.js. Window-play Rasp unchanged. Ethogram softs + freeze — never names rasp/still/wiggle as trick kinds. Hinge owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights (LYMNAEID_HOLD=11.2 RELEASE_S=1.18). Pane now Rue-dense; Hold now Rue-dense; Spin now Rue-dense; Bell now Rue-dense; Rod now Rue-dense; Rose now Rue-dense; Brick now Rue-dense; next leftover Drake / mallard. prefersHouseCry via pond_snail.wav. */
export const TRICK_KEY = "pond_snail";
export const TRICKS = ["radula", "pedal", "pneumostome", "ommatophore", "lymnaeid", "odontophore", "neuston"] as const;
export const HAPPY = ["stagnalis", "physa", "radix"] as const;
export type PondSnailTrickKind = (typeof TRICKS)[number];
export type PondSnailHappyKind = (typeof HAPPY)[number];
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

export type PondSnailTrick = {
  kind: PondSnailTrickKind;
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

export type PondSnailHappy = {
  kind: PondSnailHappyKind;
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

export const HAPPY_DUR = { stagnalis: 1.64, physa: 1.76, radix: 1.71 } as const;
export const LYMNAEID_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  lymnaeid: LYMNAEID_HOLD + RELEASE_S,
  radula: 2.28,
  pedal: 2.42,
  pneumostome: 2.48,
  ommatophore: 2.34,
  odontophore: 2.36,
  neuston: 2.31,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: PondSnailTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "lymnaeid") return 40 + roll * 26;
  if (kind === "odontophore" || kind === "neuston" || kind === "radula" || kind === "pedal" || kind === "pneumostome" || kind === "ommatophore") return 12.8 + roll * 9.4;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn = false, lastKind?: PondSnailTrickKind | string | null): PondSnailTrickKind {
  if (musicOn) return "lymnaeid";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) =>
    k === "lymnaeid" ? 0.72 : k === "odontophore" || k === "neuston" ? 1.28 : k === "radula" || k === "pedal" || k === "pneumostome" ? 1.18 : 1.08
  );
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i]!;
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return list[i]!;
  }
  return list[list.length - 1] || "radula";
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
  return key === TRICK_KEY || key === "whorl";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: PondSnailHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as PondSnailHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: PondSnailHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: PondSnailHappyKind | string, x: number, facing: 1 | -1): PondSnailHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as PondSnailHappyKind) : "stagnalis";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "stagnalis" ? "sit" : name === "physa" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function stagnalisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.stagnalis));
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

export function physaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.physa));
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

export function radixPose(t: number) {
  return {
    lift: 2.64 + Math.abs(Math.sin(t * 0.696)) * 1.32,
    rot: Math.sin(t * 0.624) * 7.2,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: PondSnailHappy, dt: number, flags: TrickFlags): PondSnailHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: PondSnailHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "stagnalis") {
    const pose = stagnalisPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "physa") {
    const pose = physaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = radixPose(next.t);
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

export function beginTrick(kind: PondSnailTrickKind | string, x: number, facing: 1 | -1): PondSnailTrick {
  const anim: TrickAnim =
    kind === "lymnaeid"
      ? "sit"
      : kind === "radula"
        ? "play"
        : kind === "pedal"
          ? "walk"
          : kind === "pneumostome"
            ? "sit"
            : kind === "ommatophore"
              ? "sit"
              : kind === "odontophore"
                ? "play"
                : kind === "neuston"
                  ? "walk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as PondSnailTrickKind) : "radula",
    phase: kind === "lymnaeid" ? "hold" : "go",
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

export function lymnaeidPose(t: number) {
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

export function radulaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.radula));
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

export function pedalPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pedal));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4.32, rot: s * -19.2 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.48) {
    const s = smoothstep((u - 0.12) / 0.36);
    return {
      x: fromX - face * (2.64 + s * 5.4),
      lift: 4.32 + Math.sin(s * Math.PI) * 2.64,
      rot: face * (-19.2 + s * 26.4),
      anim: "walk" as TrickAnim,
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

export function pneumostomePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pneumostome));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.96, lift: s * 2.64, rot: s * 9.6 * face, anim: "sit" as TrickAnim };
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

export function ommatophorePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ommatophore));
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

export function odontophorePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.odontophore));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.36, rot: s * 14.4 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const pulse = Math.sin(t * 3.2);
    return {
      x: fromX,
      lift: 3.36 + pulse * 1.92,
      rot: face * (14.4 + pulse * 16.8),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const scent = Math.sin(t * 1.1);
    return {
      x: fromX + face * scent * 0.18,
      lift: 4.8 + Math.abs(scent) * 0.72,
      rot: face * (26.4 + scent * 4.8),
      anim: "play" as TrickAnim,
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

export function neustonPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.neuston));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4.08, rot: s * -14.4 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.55) {
    const flash = Math.abs(Math.sin(t * 2.6));
    return {
      x: fromX + face * flash * 0.24,
      lift: 4.08 + flash * 1.68,
      rot: face * (-14.4 - flash * 12),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const warn = Math.sin(t * 1.4);
    return {
      x: fromX,
      lift: 5.28 + Math.abs(warn) * 0.84,
      rot: face * (-21.6 + warn * 7.2),
      anim: "walk" as TrickAnim,
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

export function stepTrick(trick: PondSnailTrick, dt: number, flags: TrickFlags): PondSnailTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: PondSnailTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "lymnaeid") {
    if (next.t < LYMNAEID_HOLD) {
      const pose = lymnaeidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < LYMNAEID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - LYMNAEID_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "radula") {
    const pose = radulaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pedal") {
    const pose = pedalPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pneumostome") {
    const pose = pneumostomePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ommatophore") {
    const pose = ommatophorePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "odontophore") {
    const pose = odontophorePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = neustonPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
