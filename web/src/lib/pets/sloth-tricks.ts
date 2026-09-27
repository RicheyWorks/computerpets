/** Hang ground tricks while idle — ultra-polish pass. House neighborly Choloepus / Linnaeus's two-toed sloth desk life (sloth / Hang) — hangsway / reachcrawl / algaescratch / headturnstare / clawhook / slowdrip / bradypushush personality (hangsway upside-down hang sway without naming hang or sway or roost alone as wait — distinct from Opossum hang and Bat roost; reachcrawl slow claw reach crawl without naming reach or crawl or plod alone as wait — distinct from Turtle plod and Millipede ripple; algaescratch algae-fur scratch without naming scratch or algae or groom alone as wait — distinct from Hedgehog anoint and Rui groom; headturnstare slow head-turn stare without naming stare or turn or freeze alone as wait — distinct from Deer freeze and Owl swivel; clawhook two-toed claw hook without naming claw or hook alone as wait; slowdrip canopy drip settle without naming drip or slow alone as wait; long bradypushush Bradypus/Choloepus hush hold (THE bradypushush sit_hold tell) — never named wait or crouch or roost or hang or still or sit or walk as bare ethogram-only trick kinds; Rob robber_fly owns sallyhawk/beardgroom/midsnatch/stiltsstance/mystaxwipe/perchsally/asilushush — do NOT reuse; Click click_beetle owns clickjack/eyespotflash/clickfreeze/tickwalk/feelertick/rightingclick/elaterhush — do NOT reuse; Snout owns rostrumdrill/acornroll/dropthanatosis/snoutwalk/elytraclamp/cupprobe/curculiohush — do NOT reuse; Forceps owns cercithreat/fanwing/nightscuttle/broodguard/tegminacurl/cerciwhip/forficulahush — do NOT reuse; Lace owns wingtremble/aphidstalk/eggraise/nightglint/pedicel/laceveil/chrysopahush — do NOT reuse; Jewel owns jewelflick/creekpatrol/perchfan/ovipositdip/metallicwing/damselflick/calopteryxhush — do NOT reuse; Banner owns wingbanner/puddlesip/flutterhop/tailglidesettle/tornusflash/tigerband/papiliohush — do NOT reuse; guest slug Hang / key sloth only for wantsThankYou matching — accept "sloth" and "hang"; do NOT name a trick "sloth" or "hang" or "robber_fly" or "rob" or "sallyhawk" or "asilushush" or "lemur" or "sun" or "gibbon" or "swing"; not Rob Asilidae life, not Click Elateridae life, not primate Sun/Swing life, not Rui. Hangsway / reachcrawl / algaescratch / headturnstare / clawhook / slowdrip / bradypushush; denshang / inkhang / densbradypus thank-yous. Same map as desktop sloth-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names hang/reach/still/sit/wait/walk/sloth as bare ethogram-only trick kinds. True Linnaeus's two-toed sloth Choloepus desk life only — hang sway, reach crawl, algae scratch, head-turn stare, claw hook, slow drip, Bradypus hush. Next house-order ultra: Sun / lemur. No cry inventing — sloth.wav EXISTS so prefersHouseCry adds sloth after robber_fly. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "sloth";
export const TRICKS = ["hangsway", "reachcrawl", "algaescratch", "headturnstare", "clawhook", "slowdrip", "bradypushush"] as const;
export const HAPPY = ["denshang", "inkhang", "densbradypus"] as const;
export type SlothTrickKind = (typeof TRICKS)[number];
export type SlothHappyKind = (typeof HAPPY)[number];
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

export type SlothTrick = {
  kind: SlothTrickKind;
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

export type SlothHappy = {
  kind: SlothHappyKind;
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

export const HAPPY_DUR = { denshang: 1.70, inkhang: 1.84, densbradypus: 1.76 } as const;
export const BRADYPUSHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  bradypushush: BRADYPUSHUSH_HOLD + RELEASE_S,
  hangsway: 2.48,
  reachcrawl: 2.42,
  algaescratch: 2.40,
  headturnstare: 2.44,
  clawhook: 2.38,
  slowdrip: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SlothTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "bradypushush") return 40 + roll * 26;
  if (kind === "clawhook" || kind === "hangsway" || kind === "headturnstare") return 12.8 + roll * 9.4;
  if (kind === "algaescratch" || kind === "reachcrawl" || kind === "slowdrip") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SlothTrickKind | string | null) {
  if (musicOn) return "bradypushush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "bradypushush") {
    if (roll < 0.17) return "hangsway" as const;
    if (roll < 0.33) return "reachcrawl" as const;
    if (roll < 0.49) return "algaescratch" as const;
    if (roll < 0.65) return "headturnstare" as const;
    if (roll < 0.83) return "clawhook" as const;
    return "slowdrip" as const;
  }
  if (lastKind === "hangsway") {
    if (roll < 0.16) return "bradypushush" as const;
    if (roll < 0.32) return "reachcrawl" as const;
    if (roll < 0.48) return "algaescratch" as const;
    if (roll < 0.64) return "headturnstare" as const;
    if (roll < 0.82) return "clawhook" as const;
    return "slowdrip" as const;
  }
  if (lastKind === "reachcrawl") {
    if (roll < 0.14) return "bradypushush" as const;
    if (roll < 0.3) return "hangsway" as const;
    if (roll < 0.46) return "algaescratch" as const;
    if (roll < 0.62) return "headturnstare" as const;
    if (roll < 0.8) return "clawhook" as const;
    return "slowdrip" as const;
  }
  if (lastKind === "algaescratch") {
    if (roll < 0.15) return "bradypushush" as const;
    if (roll < 0.31) return "hangsway" as const;
    if (roll < 0.47) return "reachcrawl" as const;
    if (roll < 0.63) return "headturnstare" as const;
    if (roll < 0.81) return "clawhook" as const;
    return "slowdrip" as const;
  }
  if (lastKind === "headturnstare") {
    if (roll < 0.16) return "bradypushush" as const;
    if (roll < 0.32) return "hangsway" as const;
    if (roll < 0.48) return "reachcrawl" as const;
    if (roll < 0.64) return "algaescratch" as const;
    if (roll < 0.82) return "clawhook" as const;
    return "slowdrip" as const;
  }
  if (lastKind === "clawhook") {
    if (roll < 0.15) return "bradypushush" as const;
    if (roll < 0.31) return "hangsway" as const;
    if (roll < 0.47) return "reachcrawl" as const;
    if (roll < 0.63) return "algaescratch" as const;
    if (roll < 0.81) return "headturnstare" as const;
    return "slowdrip" as const;
  }
  if (lastKind === "slowdrip") {
    if (roll < 0.16) return "bradypushush" as const;
    if (roll < 0.32) return "hangsway" as const;
    if (roll < 0.48) return "reachcrawl" as const;
    if (roll < 0.64) return "algaescratch" as const;
    if (roll < 0.82) return "headturnstare" as const;
    return "clawhook" as const;
  }
  if (roll < 0.14) return "bradypushush" as const;
  if (roll < 0.28) return "hangsway" as const;
  if (roll < 0.42) return "reachcrawl" as const;
  if (roll < 0.56) return "algaescratch" as const;
  if (roll < 0.7) return "headturnstare" as const;
  if (roll < 0.85) return "clawhook" as const;
  return "slowdrip" as const;
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
  return key === TRICK_KEY || key === "hang";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SlothHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SlothHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SlothHappyKind | string, x: number, facing: 1 | -1): SlothHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as SlothHappyKind) : "denshang";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denshang" ? "sit" : name === "inkhang" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denshangPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshang));
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

export function inkhangPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhang));
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

export function densbradypusPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: SlothHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denshang") {
    const pose = denshangPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkhang") {
    const pose = inkhangPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densbradypusPose(next.t);
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

export function beginTrick(kind: SlothTrickKind, x: number, facing: 1 | -1): SlothTrick {
  const anim: TrickAnim =
    kind === "bradypushush"
      ? "sit"
      : kind === "hangsway"
        ? "play"
        : kind === "slowdrip"
          ? "talk"
          : kind === "reachcrawl"
            ? "walk"
            : kind === "algaescratch"
              ? "sit"
              : kind === "headturnstare"
                ? "play"
                : kind === "clawhook"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "bradypushush" ? "hold" : "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function bradypushushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function hangswayPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.hangsway));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (-4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function reachcrawlPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.reachcrawl));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function algaescratchPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.algaescratch));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const hang = Math.sin(t * 2.0);
    return {
      x: fromX + face * (0.5 + hang * 0.1),
      lift: 2.8 + Math.abs(hang) * 1.2,
      rot: face * (11 + hang * 8),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.5 * (1 - s),
    lift: 1.3 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function headturnstarePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.headturnstare));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 1.0 * (1 - s),
    lift: 1.6 * (1 - s),
    rot: face * (6 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function clawhookPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clawhook));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "walk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function slowdripPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.slowdrip));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const cloud = Math.sin(t * 3.0);
    return {
      x: fromX + face * (0.6 + cloud * 0.18),
      lift: 3.0 + Math.abs(cloud) * 1.8,
      rot: face * (14 + cloud * 12),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.5 * (1 - s),
    rot: face * (5 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: SlothTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "hangsway" &&
    trick.kind !== "reachcrawl" &&
    trick.kind !== "algaescratch" &&
    trick.kind !== "headturnstare" &&
    trick.kind !== "clawhook" &&
    trick.kind !== "slowdrip"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "bradypushush") {
    if (next.t < BRADYPUSHUSH_HOLD) {
      const pose = bradypushushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < BRADYPUSHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - BRADYPUSHUSH_HOLD);
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
  if (next.kind === "hangsway") {
    const pose = hangswayPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "reachcrawl") {
    const pose = reachcrawlPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "algaescratch") {
    const pose = algaescratchPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "headturnstare") {
    const pose = headturnstarePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "clawhook") {
    const pose = clawhookPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = slowdripPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
