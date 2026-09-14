/** Latch ground tricks while idle. House neighborly Hirudinea horse-leech desk life — acetabulum / prostomium / looping / undulatory / hirudinean personality (acetabulum caudal-sucker plant without naming sucker or latch or attach or cling or still, prostomium oral-sucker reach without naming oral or jaw or sucker or latch or probe or bite, looping inchworm crawl without naming crawl or dig or burrow or pedal or annulate or fossorial or wiggle, undulatory damp-film swim without naming swim or still or wave or thrash or undulate, long hirudinean Haemopis desk hold under the blotter damp — never named wait or wake or still or hide or cover or wiggle or swim or latch or sucker or crawl or dig or burrow or pedal or radula or pneumostome or ommatophore or lymnaeid or adductor or protractor or inhalant or ctenidium or unionid or spiral or siphuncle or nacre or pinhole or fringe or swap or antenna or scuttle or withdraw or vacancy or chelate or caridoid or chimney or antennule or astacid or mantle or jet or claw or snap or pinch or annulate or fossorial or tentacular or hydrostatic or gymnophion or filter or siphon or hinge or gape or click or arc or buzz or switch; ethogram latch/swim/still own those words; window-play leaves latch alone; Relay owns latch as a trick kind; Cling owns cling; Slip owns tentacular/annulate/fossorial/hydrostatic/gymnophion; Hinge owns adductor/protractor/inhalant/ctenidium/unionid; Whorl owns radula/pedal/pneumostome/ommatophore/lymnaeid/odontophore/neuston; Chamber owns spiral/siphuncle/nacre/pinhole/fringe; Tenant owns swap/antenna/scuttle/withdraw/vacancy; Pinch owns chelate/caridoid/chimney/antennule/astacid; Cup owns mantle; Bloom owns gill; Pulse owns trail; Bluff owns gape; Pebble owns burrow; Door owns hinge; guest slug Latch / key leech only for isKey matching — accept "leech" and "latch"; do NOT name a trick "leech" or "latch" or "sucker" or "swim" or "still" or "crawl" or "dig" or "burrow" or "wiggle") — not Slip caecilian life, not Cast earthworm life, not Half planarian life, not Hinge mussel life, not Whorl pond-snail life, not Cling sea-star life, not Relay latch contact. acetabulum caudal plant on the damp blotter without naming sucker or latch, prostomium anterior reach without naming oral or jaw, looping inchworm without naming crawl or dig, undulatory film wave without naming swim, hirudinean long Haemopis metabolic hold under the scrap damp with sanguisuga / haemopis / erpobdella cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web leech-tricks.ts. Ethogram latch/swim/still unchanged — never names latch or swim or still as trick kinds. True Hirudinea horse-leech desk life only — distinct from Slip caecilian, Cast earthworm, Half planarian, Hinge mussel, Whorl pond snail, Cling sea star, and Relay electrical latch. Prickle owns the next seat. No cry inventing — thank-yous are silent desk motion only. */
export const TRICK_KEY = "leech";
export const TRICKS = ["acetabulum", "prostomium", "looping", "undulatory", "hirudinean"] as const;
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

export const HAPPY_DUR = { sanguisuga: 1.58, haemopis: 1.72, erpobdella: 1.64 } as const;
export const HIRUDINEAN_HOLD = 18.42;
export const RELEASE_S = 1.12;
export const DUR = { hirudinean: HIRUDINEAN_HOLD + RELEASE_S, acetabulum: 2.28, prostomium: 2.36, looping: 2.62, undulatory: 2.18 } as const;
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
    if (kind === "hirudinean") return 76 + roll * 46;
  if (kind === "acetabulum") return 16.4 + roll * 12.8;
  if (kind === "prostomium") return 18.6 + roll * 13.2;
  if (kind === "undulatory") return 21.8 + roll * 14.6;
  return justFinished ? 14.6 + roll * 10.9 : 8.4 + roll * 9.7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: LeechTrickKind | string | null) {
  if (musicOn) return "hirudinean";
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "hirudinean") {
    if (roll < 0.26) return "acetabulum";
    if (roll < 0.5) return "prostomium";
    if (roll < 0.74) return "looping";
    return "undulatory";
  }
  if (lastKind === "acetabulum") {
    if (roll < 0.26) return "hirudinean";
    if (roll < 0.5) return "prostomium";
    if (roll < 0.74) return "looping";
    return "undulatory";
  }
  if (lastKind === "prostomium") {
    if (roll < 0.22) return "hirudinean";
    if (roll < 0.44) return "acetabulum";
    if (roll < 0.68) return "looping";
    return "undulatory";
  }
  if (roll < 0.2) return "hirudinean";
  if (roll < 0.4) return "acetabulum";
  if (roll < 0.6) return "prostomium";
  if (roll < 0.8) return "looping";
  return "undulatory";
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
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 0.024, rot: s * 1.25, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.80) {
    const flash = Math.sin(t * 7.6) + 0.30 * Math.sin(t * 15.2);
    return {
      lift: 0.024 + Math.abs(flash) * 0.016,
      rot: 1.25 + flash * 1.35,
      dx: flash * 0.0012,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.80) / 0.20;
  return { lift: 0.009 * (1 - s), rot: 0.42 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}
export function haemopisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.haemopis));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 0.032, rot: s * -1.55, dx: s * 0.0016, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const wriggle = Math.sin(t * 5.4) + 0.22 * Math.sin(t * 9.8);
    return {
      lift: 0.032 + Math.abs(wriggle) * 0.022,
      rot: -1.55 + wriggle * 2.85,
      dx: wriggle * 0.0026,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 0.011 * (1 - s), rot: -0.42 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}
export function erpobdellaPose(t: number) {
  return {
    lift: 0.008 + Math.abs(Math.sin(t * 0.38)) * 0.017,
    rot: Math.sin(t * 0.42) * 1.05,
    dx: Math.sin(t * 0.30) * 0.0013,
    anim: "sit" as TrickAnim,
  };
}
export function stepHappy(happy: LeechHappy, dt: number, flags: TrickFlags): LeechHappy {
  if (!happy || happy.phase === "done") return happy;
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

export function beginTrick(kind: LeechTrickKind, x: number, facing: 1 | -1): LeechTrick {
  const anim: TrickAnim =
    kind === "hirudinean"
      ? "sit"
      : kind === "acetabulum"
        ? "sit"
        : kind === "prostomium"
          ? "play"
          : kind === "looping"
            ? "walk"
            : kind === "undulatory"
              ? "play"
              : "sit";
  return {
    kind: kind,
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
  const breath = Math.sin(t * 0.14) + 0.07 * Math.sin(t * 0.37);
  const soft = Math.abs(Math.sin(t * 0.19));
  return {
    lift: 0.004 + soft * 0.013,
    rot: -0.28 + breath * 0.55,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 0.005 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.20 * (1 - u) };
}

export function acetabulumPose(t: number, fromX: number, facing: 1 | -1 | null | undefined) {
  const u = Math.max(0, Math.min(1, t / DUR.acetabulum));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 0.006, rot: s * -1.35 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.80) {
    const grip = Math.sin(t * 7.1) + 0.26 * Math.sin(t * 14.2);
    const bite = grip > 0.4 ? 0.85 : grip < -0.4 ? -0.45 : grip * 0.35;
    return {
      x: fromX + face * bite * 0.0035,
      lift: 0.006 + Math.abs(grip) * 0.010,
      rot: (-1.35 + bite * 1.9) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.80) / 0.20);
  return { x: fromX, lift: 0.004 * (1 - s), rot: -0.30 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function prostomiumPose(t: number, fromX: number, facing: 1 | -1 | null | undefined) {
  const u = Math.max(0, Math.min(1, t / DUR.prostomium));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 0.034, rot: s * 1.55 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.76) {
    const s = smoothstep((u - 0.12) / 0.64);
    const wave = Math.sin(s * Math.PI * 3.4) + 0.18 * Math.sin(s * Math.PI * 6.8);
    return {
      x: fromX + face * (0.018 + s * 0.095),
      lift: 0.034 + Math.abs(wave) * 0.016,
      rot: (1.55 + wave * 1.15) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.76) / 0.24);
  return {
    x: fromX + face * 0.113 * (1 - s),
    lift: 0.012 * (1 - s),
    rot: 0.35 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}
export function loopingPose(t: number, fromX: number, facing: 1 | -1 | null | undefined) {
  const u = Math.max(0, Math.min(1, t / DUR.looping));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX + face * s * 0.012, lift: s * 0.078, rot: s * -0.85 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.72) {
    const s = (u - 0.16) / 0.56;
    const loop = Math.sin(s * Math.PI * 2.0);
    const arch = Math.abs(Math.sin(s * Math.PI));
    return {
      x: fromX + face * (0.012 + s * 0.14 + loop * 0.018),
      lift: 0.028 + arch * 0.062,
      rot: (-0.85 + loop * 1.35) * face,
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.72) / 0.28);
  return {
    x: fromX + face * 0.152 * (1 - s * 0.15),
    lift: 0.028 * (1 - s),
    rot: -0.25 * (1 - s) * face,
    anim: (s > 0.55 ? "idle" : "walk") as TrickAnim,
  };
}
export function undulatoryPose(t: number, fromX: number, facing: 1 | -1 | null | undefined) {
  const u = Math.max(0, Math.min(1, t / DUR.undulatory));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 0.018, rot: s * 0.65 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const wave = Math.sin(t * 5.6) + 0.24 * Math.sin(t * 11.2);
    return {
      x: fromX + face * (0.01 + Math.sin(t * 2.8) * 0.055),
      lift: 0.018 + Math.abs(wave) * 0.022,
      rot: (0.65 + wave * 2.1) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 0.01 * (1 - s), lift: 0.006 * (1 - s), rot: 0.20 * (1 - s) * face, anim: "idle" as TrickAnim };
}
export function stepTrick(trick: LeechTrick, dt: number, flags: TrickFlags): LeechTrick {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "acetabulum" && trick.kind !== "prostomium" && trick.kind !== "looping" && trick.kind !== "undulatory") {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: LeechTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "hirudinean") {
    if (next.t < HIRUDINEAN_HOLD) {
      const pose = hirudineanPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
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
  const u = next.t / hold;
  if (next.kind === "acetabulum") {
    const pose = acetabulumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "prostomium") {
    const pose = prostomiumPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "looping") {
    const pose = loopingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = undulatoryPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
