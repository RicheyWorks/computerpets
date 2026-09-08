/** Heart ground tricks while idle — ultra-polish pass. House neighborly Tytonidae barn owl desk life — diskturn / softcrouch / parallax / snore / twist / pellet / tytonid personality (diskturn heart-face facial-disk acoustic turn without naming swivel or hiss or hoot or gaze or cock or look or peer or hop or walk or strut or fan, softcrouch silent hunt crouch without naming stoop or dive or soar or hunt or crouch-cry or cache or probe or dig or peck or bill, parallax triangulation sway without naming bob or sway or nod or bobble or sidle or hopwalk or monocle, snore snore-threat posture without naming hiss or hoot or scream or croak or caw or vocal or cronk, twist cervical extreme turn without naming swivel or gaze or cock or look or peer, pellet cast-gesture without naming cough or regurg or eat or cache or probe or dig or peck or bill, long tytonid Tytonidae metabolic perch on the beam hollow — never named wait or wake or still or hide or cover or hiss or hoot or croak or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play HISS owns hiss; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; Soot owns hopwalk/monocle/fossick/anting/scrutinize/glean/corvid; Wedge owns dihedral/billtap/tumble/cronk/invite/toeing/hackles; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean; Ghost owns luna moth life; Spark owns firefly life; guest slug Heart / key barn_owl only for isKey matching — accept "barn_owl" and "heart"; do NOT name a trick "barn_owl" or "heart" or "hiss" or "hoot" or "swivel" or "preen" or "hop" or "probe" or "fan" or "strut" or "roost" or "hopwalk" or "monocle" or "fossick" or "anting" or "scrutinize" or "glean" or "corvid" or "dihedral" or "billtap" or "tumble" or "cronk" or "invite" or "toeing" or "hackles") — not Quill macaw life, not Echo budgie life, not Soot crow life, not Wedge raven life, not Prickle stickleback life, not Latch leech life, not Ghost luna, not Spark firefly. Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. diskturn facial-disk on the blotter without naming swivel, softcrouch hunt-sit without naming stoop, parallax sway without naming bob, snore threat-posture without naming hiss, twist cervical turn without naming swivel, pellet cast without naming cough, tytonid long Tyto alba metabolic perch on the beam hollow with furcata / javanica / guttata cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play HISS do not swallow a thank-you. Sleep, hide, and leave still win. Same map as web barn_owl-tricks.ts. Window-play HISS unchanged — never names hiss. True Tytonidae barn owl desk life only — distinct from Quill macaw, Echo budgie, Soot crow, Wedge raven, Prickle stickleback, Latch leech, Ghost luna, and Spark firefly. Hook owns the next seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
export const TRICK_KEY = "barn_owl";
export const TRICKS = ["diskturn", "softcrouch", "parallax", "snore", "twist", "pellet", "tytonid"] as const;
export const HAPPY = ["furcata", "javanica", "guttata"] as const;
export type BarnOwlTrickKind = (typeof TRICKS)[number];
export type BarnOwlHappyKind = (typeof HAPPY)[number];
export type TrickAnim = "idle" | "walk" | "sit" | "sleep" | "talk" | "play";
export type TrickPhase = "go" | "hold" | "release" | "done";
export type HappyPhase = "go" | "done";
export type TrickFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  windowPlay?: boolean;
  card?: boolean;
  cmd?: string;
};
export type HappyFlags = {
  asleep?: boolean;
  hidden?: boolean;
  leaving?: boolean;
  cmd?: string;
};
export type BarnOwlTrick = {
  kind: string;
  phase: TrickPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};
export type BarnOwlHappy = {
  kind: string;
  happy: true;
  phase: HappyPhase;
  t: number;
  x: number;
  lift: number;
  rot: number;
  dx?: number;
  anim: TrickAnim;
  facing: number;
  fromX: number;
  abort?: boolean;
};
export const HAPPY_DUR: Record<BarnOwlHappyKind, number> = { furcata: 1.58, javanica: 1.72, guttata: 1.65 };
export const TYTONID_HOLD = 14.8;
export const RELEASE_S = 1.08;
export const DUR: Record<BarnOwlTrickKind, number> = {
  tytonid: TYTONID_HOLD + RELEASE_S,
  diskturn: 2.46,
  softcrouch: 2.38,
  parallax: 2.58,
  snore: 2.44,
  twist: 2.52,
  pellet: 2.36,
};

export function canStart(state: TrickFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving || state.windowPlay || state.card) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "eat" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function shouldAbort(state: TrickFlags | null | undefined) {
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "tytonid") return 44 + roll * 30;
  if (kind === "twist") return 13 + roll * 9;
  if (kind === "snore" || kind === "parallax") return 12 + roll * 9;
  if (kind === "diskturn" || kind === "softcrouch" || kind === "pellet") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: string): BarnOwlTrickKind {
  if (musicOn) return "tytonid";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) => (k === "tytonid" ? 0.55 : k === "twist" || k === "diskturn" ? 1.15 : 1));
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "diskturn";
}

export function happyCanStart(state: HappyFlags | null | undefined) {
  if (!state) return false;
  if (state.asleep || state.hidden || state.leaving) return false;
  const cmd = String(state.cmd || "");
  if (cmd === "sleep" || cmd === "leave" || cmd === "hide" || cmd === "rest") return false;
  if (cmd === "seek" || cmd === "play" || cmd === "talk" || cmd === "enter") return false;
  return true;
}

export function happyShouldAbort(state: HappyFlags | null | undefined) {
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
  return key === TRICK_KEY || key === "heart";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: string | undefined,
  x: number,
  facing: number,
  flags?: HappyFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: string, rand?: number): BarnOwlHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: BarnOwlHappyKind | string, x: number, facing?: number): BarnOwlHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as BarnOwlHappyKind) : "furcata";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "javanica" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function furcataPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.furcata));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 6, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
    return {
      lift: 6 + Math.abs(flash) * 5,
      rot: 12 + flash * 8,
      dx: flash * 2.2,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function javanicaPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.javanica));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 14, rot: s * -12, dx: s * 3, anim: "play" as TrickAnim };
  }
  if (u < 0.85) {
    const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
    return {
      lift: 12 + Math.abs(wriggle) * 10,
      rot: -10 + wriggle * 14,
      dx: wriggle * 4,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function guttataPose(t: number) {
  return {
    lift: 3 + Math.abs(Math.sin(t * 4.0)) * 7,
    rot: Math.sin(t * 3.4) * 9,
    dx: Math.sin(t * 2.6) * 3,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: BarnOwlHappy, dt: number, flags?: HappyFlags): BarnOwlHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind as BarnOwlHappyKind];
  if (next.kind === "furcata") {
    const pose = furcataPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "javanica") {
    const pose = javanicaPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = guttataPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: BarnOwlTrickKind | string, x: number, facing?: number): BarnOwlTrick {
  const name = (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as BarnOwlTrickKind) : "diskturn";
  const anim: TrickAnim =
    name === "tytonid"
      ? "sit"
      : name === "diskturn" || name === "softcrouch" || name === "twist"
        ? "sit"
        : name === "parallax" || name === "pellet"
          ? "play"
          : name === "snore"
            ? "talk"
            : "sit";
  return {
    kind: name,
    phase: name === "tytonid" ? "hold" : "go",
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

export function tytonidPose(t: number) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return {
    lift: 2 + soft * 4 + Math.abs(breath) * 1.5,
    rot: -2 + breath * 4,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
}

export function diskturnPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.diskturn));
  const face = facing == null ? 1 : facing;
  if (u < 0.11) {
    const s = smoothstep(u / 0.11);
    return { x: fromX, lift: s * 5, rot: s * 18 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.11) / 0.75;
    const scan = Math.sin(s * Math.PI * 1.35);
    const settle = Math.abs(Math.sin(s * Math.PI * 2.1));
    return {
      x: fromX + face * (4 * s + scan * 2.4),
      lift: 4 + settle * 3.5,
      rot: (18 + scan * 6) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return {
    x: fromX + face * 4 * (1 - s),
    lift: 3 * (1 - s),
    rot: 5 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}

export function softcrouchPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.softcrouch));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * -8, rot: s * -8 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.80) {
    const hush = Math.sin(t * 2.2) + 0.18 * Math.sin(t * 5.1);
    return {
      x: fromX + face * hush * 2.2,
      lift: -8 + Math.abs(hush) * 3,
      rot: (-8 + hush * 4) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.80) / 0.20);
  return {
    x: fromX,
    lift: -4 * (1 - s),
    rot: -3 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}

export function parallaxPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.parallax));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 8, rot: s * -10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.86) {
    const swing = Math.sin(t * 3.5) + 0.30 * Math.sin(t * 7.0);
    return {
      x: fromX + face * swing * 10,
      lift: 6 + Math.abs(swing) * 8,
      rot: (-6 + swing * 12) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 4 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function snorePose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.snore));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 6, rot: s * -12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.88) {
    const pulse = Math.sin(t * 2.8) + 0.24 * Math.sin(t * 5.6);
    return {
      x: fromX + face * pulse * 2.4,
      lift: 5 + Math.abs(pulse) * 6,
      rot: (-12 + pulse * 8) * face,
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3 * (1 - s), rot: -4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function twistPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.twist));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4, rot: s * 28 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.12) / 0.43;
    const hold = Math.sin(s * Math.PI * 0.5);
    return {
      x: fromX + face * hold * 2,
      lift: 4 + hold * 2,
      rot: (28 + hold * 8) * face,
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.55) / 0.33;
    return {
      x: fromX,
      lift: 4,
      rot: (36 - s * 64) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3 * (1 - s), rot: -4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function pelletPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.pellet));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 10, rot: s * -14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.45) {
    const s = (u - 0.14) / 0.31;
    const strain = Math.sin(s * Math.PI);
    return {
      x: fromX + face * strain * 3,
      lift: 8 + strain * 4,
      rot: (-14 - strain * 6) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.45) / 0.43;
    const bob = Math.sin(s * Math.PI * 3);
    return {
      x: fromX + face * bob * 2.5,
      lift: 4 + Math.abs(bob) * 10,
      rot: (-8 + bob * 10) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 4 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: BarnOwlTrick, dt: number, flags?: TrickFlags): BarnOwlTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "diskturn" &&
    trick.kind !== "softcrouch" &&
    trick.kind !== "parallax" &&
    trick.kind !== "snore" &&
    trick.kind !== "twist" &&
    trick.kind !== "pellet"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "tytonid") {
    if (next.t < TYTONID_HOLD) {
      const pose = tytonidPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < TYTONID_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - TYTONID_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind as BarnOwlTrickKind];
  const u = next.t / hold;
  const from = trick.fromX != null ? trick.fromX : trick.x;
  if (next.kind === "diskturn") {
    const pose = diskturnPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "softcrouch") {
    const pose = softcrouchPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "parallax") {
    const pose = parallaxPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "snore") {
    const pose = snorePose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "twist") {
    const pose = twistPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = pelletPose(next.t, from, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
