/** Brick ground tricks while idle — ultra-polish pass. House neighborly Turdidae / Turdus American robin desk life — runstop / listen / carol / tug / rufous / tailcock / turdus personality (runstop run-stop-run lawn forage without naming hop or hopwalk or soar, listen head-cock worm-listen without naming monocle or parallax or softcrouch, carol dawn-carol stance without naming sing or song or cry or call or feebee or keeyer or cronk or snore, tug turf-tug worm-pull without naming fossick or mantle or cache or seedhammer, rufous brick-breast puff without naming strut or fan or capflash or flash-of-hawk, tailcock tail-cock flick without naming tumble or dihedral or softcrouch or plunge, long turdus Turdus migratorius brick-breast desk perch — never named wait or soar or hop or preen or fan or strut or roost or hopwalk or monocle or fossick or anting or scrutinize or glean or corvid or dihedral or billtap or tumble or cronk or invite or toeing or hackles or diskturn or softcrouch or parallax or snore or twist or pellet or tytonid or kettle or stoop or bind or keeyer or patagial or tower or buteo or feebee or gargle or hangup or cache or capflash or seedhammer or poecile; window-play leaves robin fly alone; Soot/Wedge/Heart/Hook/Dee own their tricks; guest slug Brick / key robin — accept "robin" and "brick"; do NOT name a trick robin or brick or hop or soar or mantle or breast or flick). Amplitudes raised toward Rui richness; denser timing; house cry preferred for talk. Thank-yous migratorius / achrusterus / caurinus. Feed-happy after eat. Sleep, hide, leave, rest, card, ribbon still win. Same map as web robin-tricks.ts. Window-play unchanged. True American robin desk life — not chickadee/hawk/owl/crow/raven clones. Drake owns the next seat. No cry inventing — thank-yous are silent desk motion only. Never retouch Rui sprites. */
export const TRICK_KEY = "robin";
export const TRICKS = ["runstop", "listen", "carol", "tug", "rufous", "tailcock", "turdus"] as const;
export const HAPPY = ["migratorius", "achrusterus", "caurinus"] as const;
export type RobinTrickKind = (typeof TRICKS)[number];
export type RobinHappyKind = (typeof HAPPY)[number];
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
export type RobinTrick = {
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
export type RobinHappy = {
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
export const HAPPY_DUR: Record<RobinHappyKind, number> = { migratorius: 1.58, achrusterus: 1.72, caurinus: 1.65 };
export const TURDUS_HOLD = 14.8;
export const RELEASE_S = 1.08;
export const DUR: Record<RobinTrickKind, number> = {
  turdus: TURDUS_HOLD + RELEASE_S,
  runstop: 2.48,
  listen: 2.36,
  carol: 2.52,
  tug: 2.42,
  rufous: 2.34,
  tailcock: 2.46,
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
  if (kind === "turdus") return 44 + roll * 30;
  if (kind === "runstop" || kind === "rufous") return 13 + roll * 9;
  if (kind === "listen" || kind === "tailcock") return 12 + roll * 9;
  if (kind === "carol" || kind === "tug") return 11 + roll * 8;
  return justFinished ? 8 + roll * 8 : 4 + roll * 7;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: string): RobinTrickKind {
  if (musicOn) return "turdus";
  const roll = rand == null ? Math.random() : rand;
  const pool = TRICKS.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...TRICKS];
  const weights = list.map((k) => (k === "turdus" ? 0.55 : k === "runstop" || k === "carol" ? 1.15 : 1));
  let total = 0;
  for (let i = 0; i < weights.length; i++) total += weights[i];
  let r = roll * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1] || "runstop";
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
  return key === TRICK_KEY || key === "brick";
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

export function pickHappy(lastKind?: string, rand?: number): RobinHappyKind {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: RobinHappyKind | string, x: number, facing?: number): RobinHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as RobinHappyKind) : "migratorius";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: name === "achrusterus" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function migratoriusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.migratorius));
  if (u < 0.16) {
    const s = u / 0.16;
    return { lift: s * 6, rot: s * 12, dx: 0, anim: "sit" as TrickAnim };
  }
  if (u < 0.82) {
    const flash = Math.sin(t * 5.8) + 0.28 * Math.sin(t * 11.6);
    return { lift: 6 + Math.abs(flash) * 5, rot: 12 + flash * 8, dx: flash * 2.2, anim: "sit" as TrickAnim };
  }
  const s = (u - 0.82) / 0.18;
  return { lift: 4 * (1 - s), rot: 4 * (1 - s), dx: 0, anim: "idle" as TrickAnim };
}

export function achrusterusPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.achrusterus));
  if (u < 0.12) {
    const s = u / 0.12;
    return { lift: s * 14, rot: s * -12, dx: s * 3, anim: "play" as TrickAnim };
  }
  if (u < 0.85) {
    const wriggle = Math.sin(t * 4.4) + 0.24 * Math.sin(t * 7.9);
    return { lift: 12 + Math.abs(wriggle) * 10, rot: -10 + wriggle * 14, dx: wriggle * 4, anim: "play" as TrickAnim };
  }
  const s = (u - 0.85) / 0.15;
  return { lift: 5 * (1 - s), rot: -4 * (1 - s), dx: 0, anim: "sit" as TrickAnim };
}

export function caurinusPose(t: number) {
  return {
    lift: 3 + Math.abs(Math.sin(t * 4.0)) * 7,
    rot: Math.sin(t * 3.4) * 9,
    dx: Math.sin(t * 2.6) * 3,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: RobinHappy, dt: number, flags?: HappyFlags): RobinHappy {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind as RobinHappyKind];
  const pose =
    next.kind === "migratorius"
      ? migratoriusPose(next.t)
      : next.kind === "achrusterus"
        ? achrusterusPose(next.t)
        : caurinusPose(next.t);
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (next.t >= hold) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}

export function sleepHoldFrame(_key?: string, _frameCount?: number) {
  return null;
}

export function beginTrick(kind: RobinTrickKind | string, x: number, facing?: number): RobinTrick {
  const name = (TRICKS as readonly string[]).indexOf(kind) >= 0 ? (kind as RobinTrickKind) : "runstop";
  const anim: TrickAnim =
    name === "turdus" || name === "listen" || name === "rufous"
      ? "sit"
      : name === "runstop" || name === "tug" || name === "tailcock"
        ? "play"
        : name === "carol"
          ? "talk"
          : "sit";
  return {
    kind: name,
    phase: name === "turdus" ? "hold" : "go",
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

export function turdusPose(t: number) {
  const breath = Math.sin(t * 0.55) + 0.18 * Math.sin(t * 1.4);
  const soft = Math.abs(Math.sin(t * 0.9));
  return { lift: 2 + soft * 4 + Math.abs(breath) * 1.5, rot: -2 + breath * 4 };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 3 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -3 * (1 - u) };
}

export function runstopPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.runstop));
  const face = facing == null ? 1 : facing;
  if (u < 0.10) {
    const s = smoothstep(u / 0.10);
    return { x: fromX, lift: s * 8, rot: s * -10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.88) {
    const s = (u - 0.10) / 0.78;
    const dash = Math.sin(s * Math.PI * 3.2);
    const plant = Math.abs(Math.sin(s * Math.PI * 6.4));
    return {
      x: fromX + face * (10 * s + dash * 6),
      lift: 4 + plant * 10 + Math.abs(dash) * 3,
      rot: (-10 + dash * 8) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX + face * 10 * (1 - s), lift: 4 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function listenPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.listen));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * -6, rot: s * 16 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.84) {
    const hush = Math.sin(t * 1.6) + 0.22 * Math.sin(t * 3.3);
    return {
      x: fromX + face * hush * 2.2,
      lift: -6 + Math.abs(hush) * 3,
      rot: (16 + hush * 5) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.84) / 0.16);
  return { x: fromX, lift: -3 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function carolPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.carol));
  const face = facing == null ? 1 : facing;
  if (u < 0.11) {
    const s = smoothstep(u / 0.11);
    return { x: fromX, lift: s * 6, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.86) {
    const s = (u - 0.11) / 0.75;
    const phrase = Math.sin(s * Math.PI * 2.4);
    const settle = Math.abs(Math.sin(s * Math.PI * 4.8));
    return {
      x: fromX + face * (4 * s + phrase * 2.4),
      lift: 5 + settle * 4,
      rot: (14 + phrase * 6) * face,
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX + face * 4 * (1 - s), lift: 3 * (1 - s), rot: 4 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function tugPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.tug));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * -8, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.88) {
    const yank = Math.sin(t * 3.1) + 0.26 * Math.sin(t * 6.2);
    return {
      x: fromX + face * (-4 + yank * 5),
      lift: -8 + Math.abs(yank) * 10,
      rot: (12 + yank * 10) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: -4 * (1 - s), rot: 3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function rufousPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.rufous));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 7, rot: s * -14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.86) {
    const flash = Math.sin(t * 5.1) + 0.3 * Math.sin(t * 10.2);
    return {
      x: fromX + face * flash * 3,
      lift: 6 + Math.abs(flash) * 6,
      rot: (-14 + flash * 10) * face,
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.86) / 0.14);
  return { x: fromX, lift: 3 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function tailcockPose(t: number, fromX: number, facing?: number) {
  const u = Math.max(0, Math.min(1, t / DUR.tailcock));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 12, rot: s * -10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.88) {
    const cock = Math.sin(t * 6.2) + 0.22 * Math.sin(t * 12.4);
    const dip = Math.abs(Math.sin(t * 3.1));
    return {
      x: fromX + face * cock * 2.5,
      lift: 4 + dip * 12 + Math.abs(cock) * 3,
      rot: (-10 + cock * 8) * face,
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.88) / 0.12);
  return { x: fromX, lift: 4 * (1 - s), rot: -3 * (1 - s) * face, anim: "idle" as TrickAnim };
}

export function stepTrick(trick: RobinTrick, dt: number, flags?: TrickFlags): RobinTrick {
  if (!trick || trick.phase === "done") return trick;
  const short =
    trick.kind === "runstop" ||
    trick.kind === "listen" ||
    trick.kind === "carol" ||
    trick.kind === "tug" ||
    trick.kind === "rufous" ||
    trick.kind === "tailcock";
  if (shouldAbort(flags) && !short) {
    return { ...trick, phase: "done", t: 0, lift: 0, rot: 0, anim: "idle", abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "turdus") {
    if (next.t < TURDUS_HOLD) {
      const pose = turdusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < TURDUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - TURDUS_HOLD);
      next.phase = "release";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  }
  const hold = DUR[next.kind as RobinTrickKind];
  const u = next.t / hold;
  const from = trick.fromX != null ? trick.fromX : trick.x;
  const poseFn: Record<string, (t: number, fromX: number, facing?: number) => { x: number; lift: number; rot: number; anim: TrickAnim }> = {
    runstop: runstopPose,
    listen: listenPose,
    carol: carolPose,
    tug: tugPose,
    rufous: rufousPose,
    tailcock: tailcockPose,
  };
  const pose = poseFn[next.kind](next.t, from, trick.facing);
  next.x = pose.x;
  next.lift = pose.lift;
  next.rot = pose.rot;
  next.anim = pose.anim;
  if (u >= 1) return { ...next, phase: "done", lift: 0, rot: 0, anim: "idle" };
  return next;
}
