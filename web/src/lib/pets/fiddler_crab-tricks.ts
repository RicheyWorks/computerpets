/** Wave ground tricks while idle — ultra-polish pass. House neighborly Ocypodidae / Uca pugilator Atlantic fiddler crab desk life (fiddler_crab / Wave) — clawwave / burrowdig / sandfeed / lateralsidestep / majorclaw / mudball / pugilator personality (clawwave major-claw wave display without naming wave or claw or display or brandish or signal or raise alone as wait, burrowdig burrow dig scrape without naming burrow or dig or scrape or scoop or tunnel or plug alone as wait, sandfeed sand-scoop mouth feed without naming sand or scoop or feed or sift or chew or eat alone as wait, lateralsidestep lateral sidestep scuttle without naming sidestep or scuttle or run or dash or crawl or side alone as wait, majorclaw major-claw brandish flex without naming major or claw or flex or brandish or raise alone as wait, mudball mud-ball roll pellet without naming mud or ball or pellet or roll or pack alone as wait — Pale ghost_crab next leave pale/ghost free, long pugilator Uca pugilator hush hold (THE pugilator sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or sideswim or gnathopod or detritusclutch or pairguard or urosome or pleopod or gammarus or densscud or inkscud or densgnath or sinusoid or dauerrest or pharynxpump or thrashturn or omegaturn or vulvaseek or elegans or densthread or inkthread or densdauer or ciliaryglide or lightflee or preywrap or regensplit or auriclesense or pharynxprobe or dugesia or denshalf or inkhalf or denscilia or cryptotun or clawamble or mosssip or waterbearroll or styletpierce or anhydro or eutardigrada or denstun or inktun or densclaw or furculaflick or antennawalk or moistclingsoil or foldtuck or collophore or denspring or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or oralpapilla or onychophore or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or clitellum or setaebrace or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or pleopods or uropodtap or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or benzoquinone or metachronal or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or chelate or caridoid or chimney or antennule or astacid or swap or antenna or scuttle or withdraw or vacancy or scrap or fit or lease or carapace or bookgill or telson or furrow or fossil or clawwave or burrowdig or sandfeed or lateralsidestep or majorclaw or mudball or pugilator or denswave or inkwave or densmajor or leafhush or cast or crawl or still or dart or roll or walk or sit or hop or spring or vault or thrash or earthworm or pillbug or armor or millipede or link or house_centipede or haste or velvet_worm or jet or springtail or tardigrade or tun or planarian or half or nematode or thread or amphipod or scud or fiddler_crab or wave or ghost_crab or pale as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Scud owns sideswim/gnathopod/detritusclutch/pairguard/urosome/pleopod/gammarus — do NOT reuse; hermit_crab owns scrap/swap/scuttle/withdraw — do NOT reuse; horseshoe_crab owns carapace/telson — do NOT reuse; crayfish owns chelate/caridoid — do NOT reuse; Tun densclaw thank-you — do NOT reuse; Pale ghost_crab next — leave pale/ghost/run free; header forbids bare fiddler_crab/wave/dart/still/sit and bare amphipod/scud; guest slug Wave / key fiddler_crab only for wantsThankYou matching — accept "fiddler_crab" and "wave"; do NOT name a trick "fiddler_crab" or "wave" or "ghost_crab" or "pale" or "amphipod" or "scud" or "hermit_crab" or "horseshoe_crab" or "densclaw" or "dart" or "still" or "sit") — not Scud Gammarus amphipod/Amphipoda life, not hermit Paguroidea life, not horseshoe Limulus life, not Pinch Astacus crayfish/Decapoda life, not Pale ghost_crab next, not Rui red_panda life. Clawwave without naming wave alone, burrowdig without naming dig alone, sandfeed without naming sand alone, lateralsidestep without naming scuttle alone, majorclaw without naming claw alone, mudball without naming mud alone, pugilator long sit_hold on the Uca pugilator hush (THE pugilator sit_hold tell); denswave / inkwave / densmajor thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop fiddler_crab-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names wave/walk/still/wait/sit/fiddler_crab as bare ethogram-only trick kinds. True Atlantic fiddler crab desk life only — major-claw wave display, burrow dig scrape, sand-scoop mouth feed, lateral sidestep scuttle, major-claw brandish, mud-ball pellet, and pugilator hush; distinct from Scud amphipod/Amphipoda sideswim/gnathopod/gammarus, hermit scrap/swap/scuttle, horseshoe carapace/telson, Pinch crayfish chelate/caridoid, Pale ghost next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Pale / ghost_crab. No cry inventing — thank-yous are silent desk motion only; fiddler_crab.wav EXISTS so prefersHouseCry adds fiddler_crab after amphipod. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "fiddler_crab";
export const TRICKS = ["clawwave", "burrowdig", "sandfeed", "lateralsidestep", "majorclaw", "mudball", "pugilator"] as const;
export const HAPPY = ["denswave", "inkwave", "densmajor"] as const;
export type FiddlerCrabTrickKind = (typeof TRICKS)[number];
export type FiddlerCrabHappyKind = (typeof HAPPY)[number];
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

export type FiddlerCrabTrick = {
  kind: FiddlerCrabTrickKind;
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

export type FiddlerCrabHappy = {
  kind: FiddlerCrabHappyKind;
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

export const HAPPY_DUR = { denswave: 1.70, inkwave: 1.84, densmajor: 1.76 } as const;
export const PUGILATOR_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  pugilator: PUGILATOR_HOLD + RELEASE_S,
  clawwave: 2.48,
  burrowdig: 2.42,
  sandfeed: 2.40,
  lateralsidestep: 2.44,
  majorclaw: 2.38,
  mudball: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: FiddlerCrabTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "pugilator") return 40 + roll * 26;
  if (kind === "majorclaw" || kind === "clawwave" || kind === "lateralsidestep") return 12.8 + roll * 9.4;
  if (kind === "sandfeed" || kind === "burrowdig" || kind === "mudball") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: FiddlerCrabTrickKind | string | null) {
  if (musicOn) return "pugilator" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "pugilator") {
    if (roll < 0.17) return "clawwave" as const;
    if (roll < 0.33) return "burrowdig" as const;
    if (roll < 0.49) return "sandfeed" as const;
    if (roll < 0.65) return "lateralsidestep" as const;
    if (roll < 0.83) return "majorclaw" as const;
    return "mudball" as const;
  }
  if (lastKind === "clawwave") {
    if (roll < 0.16) return "pugilator" as const;
    if (roll < 0.32) return "burrowdig" as const;
    if (roll < 0.48) return "sandfeed" as const;
    if (roll < 0.64) return "lateralsidestep" as const;
    if (roll < 0.82) return "majorclaw" as const;
    return "mudball" as const;
  }
  if (lastKind === "burrowdig") {
    if (roll < 0.14) return "pugilator" as const;
    if (roll < 0.3) return "clawwave" as const;
    if (roll < 0.46) return "sandfeed" as const;
    if (roll < 0.62) return "lateralsidestep" as const;
    if (roll < 0.8) return "majorclaw" as const;
    return "mudball" as const;
  }
  if (lastKind === "sandfeed") {
    if (roll < 0.15) return "pugilator" as const;
    if (roll < 0.31) return "clawwave" as const;
    if (roll < 0.47) return "burrowdig" as const;
    if (roll < 0.63) return "lateralsidestep" as const;
    if (roll < 0.81) return "majorclaw" as const;
    return "mudball" as const;
  }
  if (lastKind === "lateralsidestep") {
    if (roll < 0.16) return "pugilator" as const;
    if (roll < 0.32) return "clawwave" as const;
    if (roll < 0.48) return "burrowdig" as const;
    if (roll < 0.64) return "sandfeed" as const;
    if (roll < 0.82) return "majorclaw" as const;
    return "mudball" as const;
  }
  if (lastKind === "majorclaw") {
    if (roll < 0.15) return "pugilator" as const;
    if (roll < 0.31) return "clawwave" as const;
    if (roll < 0.47) return "burrowdig" as const;
    if (roll < 0.63) return "sandfeed" as const;
    if (roll < 0.81) return "lateralsidestep" as const;
    return "mudball" as const;
  }
  if (lastKind === "mudball") {
    if (roll < 0.16) return "pugilator" as const;
    if (roll < 0.32) return "clawwave" as const;
    if (roll < 0.48) return "burrowdig" as const;
    if (roll < 0.64) return "sandfeed" as const;
    if (roll < 0.82) return "lateralsidestep" as const;
    return "majorclaw" as const;
  }
  if (roll < 0.14) return "pugilator" as const;
  if (roll < 0.28) return "clawwave" as const;
  if (roll < 0.42) return "burrowdig" as const;
  if (roll < 0.56) return "sandfeed" as const;
  if (roll < 0.7) return "lateralsidestep" as const;
  if (roll < 0.85) return "majorclaw" as const;
  return "mudball" as const;
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
  return key === TRICK_KEY || key === "wave";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: FiddlerCrabHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: FiddlerCrabHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: FiddlerCrabHappyKind | string, x: number, facing: 1 | -1): FiddlerCrabHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as FiddlerCrabHappyKind) : "denswave";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denswave" ? "sit" : name === "inkwave" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denswavePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswave));
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

export function inkwavePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwave));
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

export function densmajorPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: FiddlerCrabHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denswave") {
    const pose = denswavePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkwave") {
    const pose = inkwavePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densmajorPose(next.t);
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

export function beginTrick(kind: FiddlerCrabTrickKind, x: number, facing: 1 | -1): FiddlerCrabTrick {
  const anim: TrickAnim =
    kind === "pugilator"
      ? "sit"
      : kind === "clawwave"
        ? "play"
        : kind === "mudball"
          ? "talk"
          : kind === "burrowdig"
            ? "play"
            : kind === "sandfeed"
              ? "sit"
              : kind === "lateralsidestep"
                ? "walk"
                : kind === "majorclaw"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "pugilator" ? "hold" : "go",
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

export function pugilatorPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function clawwavePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clawwave));
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

export function burrowdigPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.burrowdig));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "play" as TrickAnim,
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

export function sandfeedPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sandfeed));
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

export function lateralsidestepPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.lateralsidestep));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "walk" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "walk" as TrickAnim,
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

export function majorclawPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.majorclaw));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "play" as TrickAnim,
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

export function mudballPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mudball));
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

export function stepTrick(trick: FiddlerCrabTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "clawwave" &&
    trick.kind !== "burrowdig" &&
    trick.kind !== "sandfeed" &&
    trick.kind !== "lateralsidestep" &&
    trick.kind !== "majorclaw" &&
    trick.kind !== "mudball"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "pugilator") {
    if (next.t < PUGILATOR_HOLD) {
      const pose = pugilatorPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PUGILATOR_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PUGILATOR_HOLD);
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
  if (next.kind === "clawwave") {
    const pose = clawwavePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "burrowdig") {
    const pose = burrowdigPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sandfeed") {
    const pose = sandfeedPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "lateralsidestep") {
    const pose = lateralsidestepPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "majorclaw") {
    const pose = majorclawPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = mudballPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
