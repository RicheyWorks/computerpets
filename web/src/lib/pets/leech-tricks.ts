/** Latch ground tricks while idle — ultra-polish pass. House neighborly Hirudinea horse-leech desk life — acetabulum / prostomium / looping / undulatory / hirudinean / botryoidal / auricle personality (acetabulum caudal-sucker plant without naming sucker or latch or attach or cling or still, prostomium oral-sucker reach without naming oral or jaw or sucker or latch or probe or bite, looping inchworm crawl without naming crawl or dig or burrow or pedal or annulate or fossorial or wiggle, undulatory damp-film wave without naming swim or still or wave or thrash or undulate, long hirudinean Haemopis desk hold under the blotter damp, botryoidal tissue pulse without naming blood or vessel or still (THE hirudinean tissue tell), auricle lateral-lobe sense without naming ear or eye or latch or probe (THE freshwater-leech sensory tell) — never named wait or wake or still or hide or cover or wiggle or swim or latch or sucker or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or ligament or glochid or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or mantle or jet or claw or snap or pinch or annulate or fossorial or tentacular or hydrostatic or gymnophion or filter or siphon or hinge or gape or click or arc or buzz or switch or clitellum as trick kinds; ethogram softs + freeze own those words; window-play DRINK unchanged; Relay owns latch as a trick kind; Cling owns cling; Cast owns clitellum; Slip owns tentacular/annulate/fossorial/hydrostatic/gymnophion; Hinge owns adductor/protractor/inhalant/ctenidium/unionid/ligament/glochid; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Chamber owns spiral/siphuncle/nacre/pinhole/fringe; Tenant owns swap/antenna/scuttle/withdraw/vacancy; Pinch owns chelate/caridoid/chimney/antennule/astacid; Cup owns mantle; Bloom owns gill; Pulse owns trail; Bluff owns gape; Pebble owns burrow; Door owns hinge; guest slug Latch / key leech only for isKey matching — accept "leech" and "latch"; do NOT name a trick "leech" or "latch" or "sucker" or "swim" or "still" or "crawl" or "dig" or "burrow" or "wiggle" or "clitellum") — not Slip caecilian life, not Cast earthworm life, not Half planarian life, not Hinge mussel life, not Whorl pond-snail life, not Cling sea-star life, not Relay latch contact. acetabulum caudal plant on the damp blotter without naming sucker or latch, prostomium anterior reach without naming oral or jaw, looping inchworm without naming crawl or dig, undulatory film wave without naming swim, hirudinean long Haemopis metabolic hold under the scrap damp, botryoidal tissue pulse (THE hirudinean tell), auricle lateral-lobe sense (THE freshwater-leech tell); sanguisuga / haemopis / erpobdella thank-yous. Feed-happy after eat. Card-open freeze and window-play DRINK do not swallow a thank-you. Sleep, hide, leave win. Same map as desktop leech-tricks.js. Window-play DRINK unchanged. Ethogram softs + freeze — never names latch/swim/still as trick kinds. Boot owns the next seat. No cry inventing. Amplitudes raised toward Rui richness; denser waits/weights; prefersHouseCry via leech.wav. */
export const TRICK_KEY = "leech";
export const TRICKS = ["acetabulum", "prostomium", "looping", "undulatory", "hirudinean", "botryoidal", "auricle"] as const;
export const HAPPY = ["sanguisuga", "haemopis", "erpobdella"] as const;
export type LeechTrickKind = (typeof TRICKS)[number];
export type LeechHappyKind = (typeof HAPPY)[number];
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

export type LeechTrick = {
  kind: LeechTrickKind;
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

export type LeechHappy = {
  kind: LeechHappyKind;
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

export const HAPPY_DUR = { sanguisuga: 1.64, haemopis: 1.76, erpobdella: 1.71 } as const;
export const HIRUDINEAN_HOLD = 10.8;
export const RELEASE_S = 1.14;
export const DUR = {
  hirudinean: HIRUDINEAN_HOLD + RELEASE_S,
  acetabulum: 2.28,
  prostomium: 2.42,
  looping: 2.48,
  undulatory: 2.34,
  botryoidal: 2.36,
  auricle: 2.31,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: LeechTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "hirudinean") return 38 + roll * 24;
  if (kind === "botryoidal" || kind === "auricle" || kind === "acetabulum") return 12 + roll * 9;
  if (kind === "prostomium" || kind === "looping" || kind === "undulatory") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LeechTrickKind | string | null) {
  if (musicOn) return "hirudinean" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "hirudinean") {
    if (roll < 0.16) return "acetabulum" as const;
    if (roll < 0.32) return "prostomium" as const;
    if (roll < 0.48) return "looping" as const;
    if (roll < 0.64) return "undulatory" as const;
    if (roll < 0.82) return "botryoidal" as const;
    return "auricle" as const;
  }
  if (lastKind === "acetabulum") {
    if (roll < 0.16) return "hirudinean" as const;
    if (roll < 0.32) return "prostomium" as const;
    if (roll < 0.48) return "looping" as const;
    if (roll < 0.64) return "undulatory" as const;
    if (roll < 0.82) return "botryoidal" as const;
    return "auricle" as const;
  }
  if (lastKind === "prostomium") {
    if (roll < 0.14) return "hirudinean" as const;
    if (roll < 0.3) return "acetabulum" as const;
    if (roll < 0.46) return "looping" as const;
    if (roll < 0.62) return "undulatory" as const;
    if (roll < 0.8) return "botryoidal" as const;
    return "auricle" as const;
  }
  if (lastKind === "botryoidal" || lastKind === "auricle") {
    if (roll < 0.14) return "hirudinean" as const;
    if (roll < 0.3) return "acetabulum" as const;
    if (roll < 0.46) return "prostomium" as const;
    if (roll < 0.62) return "looping" as const;
    if (roll < 0.78) return "undulatory" as const;
    return lastKind === "botryoidal" ? ("auricle" as const) : ("botryoidal" as const);
  }
  if (roll < 0.14) return "hirudinean" as const;
  if (roll < 0.28) return "acetabulum" as const;
  if (roll < 0.42) return "prostomium" as const;
  if (roll < 0.56) return "looping" as const;
  if (roll < 0.7) return "undulatory" as const;
  if (roll < 0.85) return "botryoidal" as const;
  return "auricle" as const;
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
  return key === TRICK_KEY || key === "latch";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: LeechHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as LeechHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: LeechHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: LeechHappyKind | string, x: number, facing: 1 | -1): LeechHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as LeechHappyKind) : "sanguisuga";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "sanguisuga" ? "sit" : name === "haemopis" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function sanguisugaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sanguisuga));
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

export function haemopisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.haemopis));
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

export function erpobdellaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.52) * 6,
    dx: 0,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: LeechHappy, dt: number, flags: TrickFlags): LeechHappy {
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LeechHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "sanguisuga") {
    const pose = sanguisugaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "haemopis") {
    const pose = haemopisPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = erpobdellaPose(next.t);
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

export function beginTrick(kind: LeechTrickKind | string, x: number, facing: 1 | -1): LeechTrick {
  const anim: TrickAnim =
    kind === "hirudinean"
      ? "sit"
      : kind === "acetabulum"
        ? "play"
        : kind === "prostomium"
          ? "walk"
          : kind === "looping"
            ? "sit"
            : kind === "undulatory"
              ? "sit"
              : kind === "botryoidal"
                ? "play"
                : kind === "auricle"
                  ? "walk"
                  : "sit";
  return {
    kind: (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as LeechTrickKind) : "acetabulum",
    phase: kind === "hirudinean" ? "hold" : "go",
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

export function hirudineanPose(t: number) {
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

export function acetabulumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.acetabulum));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.2, rot: s * 14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const snap = Math.sin(t * 2.4);
    return {
      x: fromX + face * snap * 0.12,
      lift: 3.2 + Math.abs(snap) * 1.4,
      rot: face * (14 + snap * 10),
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

export function prostomiumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.prostomium));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 3.6, rot: s * -16 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.48) {
    const s = smoothstep((u - 0.12) / 0.36);
    return {
      x: fromX - face * (2.2 + s * 4.5),
      lift: 3.6 + Math.sin(s * Math.PI) * 2.2,
      rot: face * (-16 + s * 22),
      anim: "walk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const s = (u - 0.48) / 0.3;
    const settle = Math.sin(s * Math.PI * 2.1);
    return {
      x: fromX - face * (6.7 * (1 - s)),
      lift: 2.4 + Math.abs(settle) * 1.1,
      rot: face * (6 + settle * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.4 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function loopingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.looping));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.8, lift: s * 2.2, rot: s * 8 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.72) {
    const mud = Math.sin(t * 1.6);
    return {
      x: fromX + face * (0.8 + mud * 0.4),
      lift: 2.2 + Math.abs(mud) * 1.0,
      rot: face * (8 + mud * 10),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: s > 0.6 ? ("idle" as TrickAnim) : ("sit" as TrickAnim),
  };
}

export function undulatoryPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.undulatory));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.4, rot: s * 10 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const tap = Math.sin(t * 2.8);
    return {
      x: fromX + face * tap * 0.2,
      lift: 2.4 + Math.abs(tap) * 1.1,
      rot: face * (10 + tap * 12),
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

export function botryoidalPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.botryoidal));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const pulse = Math.sin(t * 3.2);
    return {
      x: fromX,
      lift: 2.8 + pulse * 1.6,
      rot: face * (12 + pulse * 14),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const scent = Math.sin(t * 1.1);
    return {
      x: fromX + face * scent * 0.15,
      lift: 4.0 + Math.abs(scent) * 0.6,
      rot: face * (22 + scent * 4),
      anim: "play" as TrickAnim,
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

export function auriclePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.auricle));
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

export function stepTrick(trick: LeechTrick, dt: number, flags: TrickFlags): LeechTrick {
  if (shouldAbort(flags)) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LeechTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  const fromX = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "hirudinean") {
    if (next.t < HIRUDINEAN_HOLD) {
      const pose = hirudineanPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = pose.anim;
      return next;
    }
    if (next.t < HIRUDINEAN_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HIRUDINEAN_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind];
  if (next.kind === "acetabulum") {
    const pose = acetabulumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "prostomium") {
    const pose = prostomiumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "looping") {
    const pose = loopingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "undulatory") {
    const pose = undulatoryPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "botryoidal") {
    const pose = botryoidalPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = auriclePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle", x: fromX };
  return next;
}
