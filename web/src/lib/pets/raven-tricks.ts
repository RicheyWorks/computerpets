/** Wedge ground tricks while idle — ultra-polish pass. House neighborly Corvidae Common raven desk life — dihedral / billtap / tumble / cronk / invite / toeing / hackles personality (dihedral soaring wing-set posture without naming soar or glide or thermal or kettle or loft or hop or walk or strut or fan, billtap bill-tap stow gesture without naming cache or croak or caw or probe or dig or peck or bill or fossick, tumble blotter roll-play without naming barrel or roll or soar or aerobat or looping or hopwalk, cronk throat kronk gesture without naming croak or caw or call or cronk-cry or vocal, invite play-bow without naming play or bow-cry or hop or strut, toeing foot-object manipulate without naming grasp or cache or probe or dig or peck or claw, long hackles throat-ruff flare on the high rafter — never named wait or wake or still or hide or cover or croak or caw or cache or hop or walk or strut or fan or preen or probe or dig or peck or bill or roost or berry or juggle or peer or skip or quote or crack or flash or sidle or bobble or mimic or dangle or huddle or toboggan or waddle or porpoise or trumpet or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or spiggin or zigzag or spinous or fanning or gasterosteid or acetabulum or prostomium or looping or undulatory or hirudinean or lantern or jstroke or semaphore or elytra or photinus or plumose or lunule or silk or stream or actias; window-play CROAK owns croak; window-play CACHE owns cache; window-play SOAR owns soar; window-play BARREL owns barrel; Soot owns hopwalk/monocle/fossick/anting/scrutinize/glean/corvid; Budgie owns preen/sidle/bobble/mimic/dangle; Parrot owns quote/strut/fan/crack/flash; Toucan owns roost/berry/juggle/peer/skip; Penguin owns huddle/toboggan/waddle/porpoise/trumpet; Prickle owns spiggin/zigzag/spinous/fanning/gasterosteid/nuptial/pelvic; Latch owns acetabulum/prostomium/looping/undulatory/hirudinean/botryoidal/auricle; Ghost owns luna moth life; Spark owns firefly life; guest slug Wedge / key raven only for isKey matching — accept "raven" and "wedge"; do NOT name a trick "raven" or "wedge" or "croak" or "caw" or "cache" or "soar" or "barrel" or "hop" or "preen" or "probe" or "fan" or "strut" or "roost" or "hopwalk" or "monocle" or "fossick" or "anting" or "scrutinize" or "glean" or "corvid") — not Quill macaw life, not Echo budgie life, not Soot crow life, not Prickle stickleback life, not Latch leech life, not Ghost luna, not Spark firefly. Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. dihedral wing-set on the blotter without naming soar, billtap stow-tap without naming cache, tumble roll-play without naming barrel, cronk throat gesture without naming croak, invite play-bow on the blotter, toeing foot-work without naming grasp, hackles long Corvus corax metabolic perch on the high rafter with principalis / sinuatus / cryptoleucus cousins in the thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play CROAK do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop raven-tricks.js. Window-play CROAK unchanged — never names croak. Window-play CACHE/SOAR/BARREL unchanged. True Corvidae Common raven desk life only — distinct from Quill macaw, Echo budgie, Soot crow, Prickle stickleback, Latch leech, Ghost luna, and Spark firefly. Heart owns the next seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
export const TRICK_KEY = "raven";
export const TRICKS = ["dihedral", "billtap", "tumble", "cronk", "invite", "toeing", "hackles"] as const;
export const HAPPY = ["principalis", "sinuatus", "cryptoleucus"] as const;
export type RavenTrickKind = (typeof TRICKS)[number];
export type RavenHappyKind = (typeof HAPPY)[number];
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
export type RavenTrick = {
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
export type RavenHappy = {
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
export const HAPPY_DUR: Record<RavenHappyKind, number> = { principalis: 1.66, sinuatus: 1.79, cryptoleucus: 1.71 };
export const HACKLES_HOLD = 15.4;
export const RELEASE_S = 1.12;
export const DUR: Record<RavenTrickKind, number> = {
  hackles: HACKLES_HOLD + RELEASE_S,
  dihedral: 2.48,
  billtap: 2.22,
  tumble: 2.58,
  cronk: 2.36,
  invite: 2.28,
  toeing: 2.42,
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
  if (kind === "hackles") return 44 + roll * 30;
  if (kind === "cronk") return 13 + roll * 9;
  if (kind === "tumble" || kind === "invite") return 12 + roll * 9;
  if (kind === "dihedral" || kind === "toeing") return 11 + roll * 8;
  if (kind === "billtap") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: string): RavenTrickKind {
  if (musicOn) return "hackles";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : TRICKS.slice();
  const weights = list.map((k) => (k === "hackles" ? 0.55 : k === "invite" || k === "cronk" ? 1.15 : 1));
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "dihedral";
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
  return key === TRICK_KEY || key === "wedge";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: string | undefined,
  x: number,
  facing: number | undefined,
  flags?: HappyFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: string, rand?: number): RavenHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : HAPPY.slice();
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: RavenHappyKind | string, x: number, facing?: number): RavenHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as RavenHappyKind) : "principalis";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "principalis" ? "sit" : name === "sinuatus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function principalisPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.principalis));
  if (u < 0.15) {
    const s = u / 0.15;
    return { lift: s * 7, rot: s * 11, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.80) {
    const flash = Math.sin(t * 6.9) + 0.30 * Math.sin(t * 13.8);
    return {
      lift: 7 + Math.abs(flash) * 5,
      rot: 11 + flash * 9,
      dx: flash * 2.4,
      anim: "sit" as TrickAnim,
    };
  }
  const s = (u - 0.80) / 0.20;
  return { lift: 4 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function sinuatusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.sinuatus));
  if (u < 0.13) {
    const s = u / 0.13;
    return { lift: s * 15, rot: s * -13, dx: s * 3.2, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const wriggle = Math.sin(t * 4.9) + 0.22 * Math.sin(t * 8.7);
    return {
      lift: 13 + Math.abs(wriggle) * 10,
      rot: -11 + wriggle * 15,
      dx: wriggle * 4.2,
      anim: "play" as TrickAnim,
    };
  }
  const s = (u - 0.84) / 0.16;
  return { lift: 5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function cryptoleucusPose(t: number) {
  return {
    lift: 3 + Math.abs(Math.sin(t * 4.0)) * 8,
    rot: Math.sin(t * 3.4) * 9,
    dx: Math.sin(t * 2.6) * 3.2,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: RavenHappy, dt: number, flags?: HappyFlags): RavenHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, dx: 0, anim: "idle", abort: true };
  }
  const next: RavenHappy = { ...happy, t: happy.t + Math.max(0, dt) };
  const dur = HAPPY_DUR[next.kind as RavenHappyKind] || HAPPY_DUR.principalis;
  let pose;
  if (next.kind === "sinuatus") pose = sinuatusPose(next.t);
  else if (next.kind === "cryptoleucus") pose = cryptoleucusPose(next.t);
  else pose = principalisPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.dx = pose.dx || 0;
  next.x = (happy.fromX != null ? happy.fromX : happy.x) + (next.dx || 0) * (happy.facing == null ? 1 : happy.facing);
  next.anim = pose.anim;
  if (next.t >= dur) return { ...next, phase: "done", lift: 0, rot: 0, dx: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: RavenTrickKind | string, x: number, facing?: number): RavenTrick {
  const anim: TrickAnim =
    kind === "hackles"
      ? "sit"
      : kind === "dihedral" || kind === "billtap" || kind === "toeing"
        ? "sit"
        : kind === "tumble" || kind === "invite"
          ? "play"
          : kind === "cronk"
            ? "talk"
            : "sit";
  return {
    kind: kind,
    phase: kind === "hackles" ? "hold" : "go",
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

export function hacklesPose(t: number) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return {
    lift: 2 + soft * 5 + Math.abs(breath) * 1.8,
    rot: -2.5 + breath * 4.5,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
}

export function dihedralPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.dihedral));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 10, rot: s * -8 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.10) / 0.78;
    const breath = Math.sin(s * Math.PI * 1.6);
    const settle = Math.abs(Math.sin(s * Math.PI * 2.4));
    return {
      x: fromX + face * (6 * s + breath * 2.4),
      lift: 8 + settle * 8,
      rot: (-8 + breath * 10) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return {
    x: fromX + face * 6 * (1 - s),
    lift: 4 * (1 - s),
    rot: -3 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}

export function billtapPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.billtap));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 4, rot: s * -16 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const tap = Math.sin(t * 8.4) + 0.22 * Math.sin(t * 16.8);
    const bite = tap > 0.4 ? 1.0 : tap < -0.4 ? -0.6 : tap * 0.45;
    return {
      x: fromX + face * bite * 3.4,
      lift: 3 + Math.abs(tap) * 7,
      rot: (-16 + bite * 10) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2 * (1 - s),
    rot: -4 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}

export function tumblePose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.tumble));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 12, rot: s * -14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.84) {
    const spin = Math.sin(t * 4.2) + 0.28 * Math.sin(t * 8.4);
    return {
      x: fromX + face * spin * 7,
      lift: 10 + Math.abs(spin) * 12,
      rot: (-12 + spin * 18) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return {
    x: fromX + face * 2 * (1 - s),
    lift: 4 * (1 - s),
    rot: -4 * (1 - s) * face,
    anim: "idle" as TrickAnim,
  };
}

export function cronkPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.cronk));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 6, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.88) {
    const pulse = Math.sin(t * 3.6) + 0.26 * Math.sin(t * 7.2);
    return {
      x: fromX + face * pulse * 2.6,
      lift: 5 + Math.abs(pulse) * 5,
      rot: (14 + pulse * 7) * face,
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 2 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function invitePose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.invite));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 4, rot: s * 18 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const s = (u - 0.12) / 0.43;
    const dip = Math.sin(s * Math.PI);
    return {
      x: fromX + face * dip * 3,
      lift: 3 + dip * 6,
      rot: (18 + dip * 6) * face,
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.88) {
    const s = (u - 0.55) / 0.33;
    const bob = Math.sin(s * Math.PI * 2.4);
    return {
      x: fromX + face * bob * 2,
      lift: 5 + Math.abs(bob) * 4,
      rot: (12 + bob * 5) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 2 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function toeingPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.toeing));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 8, rot: s * -10 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.88) {
    const work = Math.sin(t * 5.6) + 0.28 * Math.sin(t * 11.2);
    const hop = Math.abs(Math.sin(t * 3.1));
    return {
      x: fromX + face * (work * 4 + hop * 2),
      lift: 6 + hop * 10 + Math.abs(work) * 3,
      rot: (-10 + work * 12) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 3 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: RavenTrick, dt: number, flags?: TrickFlags): RavenTrick {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "dihedral" &&
    trick.kind !== "billtap" &&
    trick.kind !== "tumble" &&
    trick.kind !== "cronk" &&
    trick.kind !== "invite" &&
    trick.kind !== "toeing"
  ) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next: RavenTrick = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "hackles") {
    if (next.t < HACKLES_HOLD) {
      const pose = hacklesPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < HACKLES_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - HACKLES_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind as RavenTrickKind];
  const u = next.t / hold;
  let pose;
  if (next.kind === "dihedral") pose = dihedralPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
  else if (next.kind === "billtap") pose = billtapPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
  else if (next.kind === "tumble") pose = tumblePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
  else if (next.kind === "invite") pose = invitePose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
  else if (next.kind === "toeing") pose = toeingPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
  else pose = cronkPose(next.t, trick.fromX != null ? trick.fromX : trick.x, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
