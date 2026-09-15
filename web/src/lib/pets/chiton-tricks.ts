/** Mail ground tricks while idle — ultra-polish pass. House neighborly Polyplacophora / Tonicella lineata Lined Chiton desk life (chiton / Mail) — plateflex / radularasp / girdlesettle / rockcreep / eightvalve / aesthete / chitonhush personality (plateflex eight-plate flex curl without naming plate or flex or curl or eight or valve or segment alone as wait, radularasp radula rasping graze without naming radula or rasp or graze or film or scrape or lick alone as wait, girdlesettle girdle clamp settle without naming girdle or clamp or settle or margin or skirt or hold alone as wait, rockcreep slow rock-creep without naming rock or creep or crawl or trek or inch or home alone as wait, eightvalve eight-valve articulate tell without naming eight or valve or articulate or segment or plate or flex alone as wait, aesthete aesthete sensory pass without naming aesthete or sensory or eye or shell or pore or light alone as wait, long chitonhush lined-chiton Polyplacophora hush hold (THE chitonhush sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or cirrikick or opershut or cementhold or tidereopen or cirrisweep or plateshut or balanushush or denscement or inkcement or densbalanus or clampseal or radialgraze or circumhome or shelltilt or homescar or radulasweep or patellahush or denscone or inkcone or denspatella or sprintdash or stalkeyescan or burrowplunge or freezecamo or nightforage or sandghost or ocypodehush or denspale or inkpale or densghost or clawwave or burrowdig or sandfeed or lateralsidestep or majorclaw or mudball or pugilator or denswave or inkwave or densmajor or sideswim or gnathopod or detritusclutch or pairguard or urosome or pleopod or gammarus or densscud or inkscud or densgnath or radula or pedal or pneumostome or ommatophore or lymnaeid or stagnalis or physa or radix or odontophore or neuston or densarmor or spiralcrawl or filmgraze or opercshut or tidehuddle or adductor or protractor or inhalant or ctenidium or unionid or spiral or siphuncle or nacre or pinhole or fringe or chamber or pearl or quiet or plateflex or radularasp or girdlesettle or rockcreep or eightvalve or aesthete or chitonhush or densmail or inkmail or denspolyplaco or leafhush or cast or crawl or still or dart or roll or walk or sit or hop or spring or vault or thrash or limpet or cone or barnacle or cement or ghost_crab or pale or chiton or mail or graze or plate as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Cement owns cirrikick/opershut/cementhold/tidereopen/cirrisweep/plateshut/balanushush — do NOT reuse (plateshut ≠ plateflex — keep distinct); Cone owns clampseal/radialgraze/circumhome/shelltilt/homescar/radulasweep/patellahush — do NOT reuse (radulasweep ≠ radularasp — keep distinct); Pale owns sprintdash/stalkeyescan/burrowplunge/freezecamo/nightforage/sandghost/ocypodehush — do NOT reuse; Wave owns clawwave/burrowdig/sandfeed/lateralsidestep/majorclaw/mudball/pugilator — do NOT reuse; Scud owns sideswim/gnathopod/detritusclutch/pairguard/urosome/pleopod/gammarus — do NOT reuse; Whorl pond_snail owns radula/pedal/pneumostome/ommatophore/lymnaeid — do NOT reuse; Armor densarmor — do NOT reuse; Spire periwinkle owns spiralcrawl/filmgraze/opercshut/tidehuddle — do NOT reuse (Spire next — do not start Spire in parallel); Frill oyster / Hinge mussel own adductor etc — do NOT reuse; Chamber nautilus owns chamber — do NOT reuse; header forbids bare chiton/mail/graze/plate/still/sit/valve and bare barnacle/cement/limpet/cone/ghost_crab/pale; guest slug Mail / key chiton only for wantsThankYou matching — accept "chiton" and "mail"; do NOT accept bare "mail" as a trick id; do NOT name a trick "chiton" or "mail" or "barnacle" or "cement" or "limpet" or "cone" or "ghost_crab" or "pale" or "graze" or "still" or "sit" or "plate" or "valve" or "denscone" or "denspale" or "densclaw" or "denscement" or "densbalanus" or "chamber" or "densarmor") — not Cement Balanus barnacle life, not Cone Patella limpet life, not Pale Ocypode ghost-crab life, not Wave Uca fiddler life, not Scud Gammarus amphipod life, not Whorl Lymnaea pond-snail gape, not Spire Littorina periwinkle life, not Frill/Hinge bivalve life, not Chamber nautilus life, not Rui red_panda life. Plateflex without naming plate alone, radularasp without naming radula alone, girdlesettle without naming girdle alone, rockcreep without naming rock alone, eightvalve without naming valve alone, aesthete without naming aesthete alone, chitonhush long sit_hold on the lined-chiton hush (THE chitonhush sit_hold tell); densmail / inkmail / denspolyplaco thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop chiton-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names chiton/mail/graze/plate/still/wait/sit as bare ethogram-only trick kinds. True lined chiton desk life only — eight-plate flex, radula rasp, girdle settle, rock creep, eight-valve articulate, aesthete sensory, and chiton hush; distinct from Cement barnacle cirrikick/opershut/cementhold/tidereopen/cirrisweep/plateshut/balanushush, Cone limpet clampseal/radialgraze/circumhome/shelltilt/homescar/radulasweep/patellahush, Pale ghost-crab, Wave fiddler, Scud amphipod, Whorl pond-snail, Spire periwinkle next, Frill/Hinge bivalve, Chamber nautilus, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Spire / periwinkle. No cry inventing — thank-yous are silent desk motion only; chiton.wav EXISTS so prefersHouseCry adds chiton after barnacle. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "chiton";
export const TRICKS = ["plateflex", "radularasp", "girdlesettle", "rockcreep", "eightvalve", "aesthete", "chitonhush"] as const;
export const HAPPY = ["densmail", "inkmail", "denspolyplaco"] as const;
export type ChitonTrickKind = (typeof TRICKS)[number];
export type ChitonHappyKind = (typeof HAPPY)[number];
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

export type ChitonTrick = {
  kind: ChitonTrickKind;
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

export type ChitonHappy = {
  kind: ChitonHappyKind;
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

export const HAPPY_DUR = { densmail: 1.70, inkmail: 1.84, denspolyplaco: 1.76 } as const;
export const CHITONHUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  chitonhush: CHITONHUSH_HOLD + RELEASE_S,
  plateflex: 2.48,
  radularasp: 2.42,
  girdlesettle: 2.40,
  rockcreep: 2.44,
  eightvalve: 2.38,
  aesthete: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: ChitonTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "chitonhush") return 40 + roll * 26;
  if (kind === "eightvalve" || kind === "plateflex" || kind === "rockcreep") return 12.8 + roll * 9.4;
  if (kind === "girdlesettle" || kind === "radularasp" || kind === "aesthete") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: ChitonTrickKind | string | null) {
  if (musicOn) return "chitonhush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "chitonhush") {
    if (roll < 0.17) return "plateflex" as const;
    if (roll < 0.33) return "radularasp" as const;
    if (roll < 0.49) return "girdlesettle" as const;
    if (roll < 0.65) return "rockcreep" as const;
    if (roll < 0.83) return "eightvalve" as const;
    return "aesthete" as const;
  }
  if (lastKind === "plateflex") {
    if (roll < 0.16) return "chitonhush" as const;
    if (roll < 0.32) return "radularasp" as const;
    if (roll < 0.48) return "girdlesettle" as const;
    if (roll < 0.64) return "rockcreep" as const;
    if (roll < 0.82) return "eightvalve" as const;
    return "aesthete" as const;
  }
  if (lastKind === "radularasp") {
    if (roll < 0.14) return "chitonhush" as const;
    if (roll < 0.3) return "plateflex" as const;
    if (roll < 0.46) return "girdlesettle" as const;
    if (roll < 0.62) return "rockcreep" as const;
    if (roll < 0.8) return "eightvalve" as const;
    return "aesthete" as const;
  }
  if (lastKind === "girdlesettle") {
    if (roll < 0.15) return "chitonhush" as const;
    if (roll < 0.31) return "plateflex" as const;
    if (roll < 0.47) return "radularasp" as const;
    if (roll < 0.63) return "rockcreep" as const;
    if (roll < 0.81) return "eightvalve" as const;
    return "aesthete" as const;
  }
  if (lastKind === "rockcreep") {
    if (roll < 0.16) return "chitonhush" as const;
    if (roll < 0.32) return "plateflex" as const;
    if (roll < 0.48) return "radularasp" as const;
    if (roll < 0.64) return "girdlesettle" as const;
    if (roll < 0.82) return "eightvalve" as const;
    return "aesthete" as const;
  }
  if (lastKind === "eightvalve") {
    if (roll < 0.15) return "chitonhush" as const;
    if (roll < 0.31) return "plateflex" as const;
    if (roll < 0.47) return "radularasp" as const;
    if (roll < 0.63) return "girdlesettle" as const;
    if (roll < 0.81) return "rockcreep" as const;
    return "aesthete" as const;
  }
  if (lastKind === "aesthete") {
    if (roll < 0.16) return "chitonhush" as const;
    if (roll < 0.32) return "plateflex" as const;
    if (roll < 0.48) return "radularasp" as const;
    if (roll < 0.64) return "girdlesettle" as const;
    if (roll < 0.82) return "rockcreep" as const;
    return "eightvalve" as const;
  }
  if (roll < 0.14) return "chitonhush" as const;
  if (roll < 0.28) return "plateflex" as const;
  if (roll < 0.42) return "radularasp" as const;
  if (roll < 0.56) return "girdlesettle" as const;
  if (roll < 0.7) return "rockcreep" as const;
  if (roll < 0.85) return "eightvalve" as const;
  return "aesthete" as const;
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
  return key === TRICK_KEY || key === "mail";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: ChitonHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: ChitonHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: ChitonHappyKind | string, x: number, facing: 1 | -1): ChitonHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as ChitonHappyKind) : "densmail";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densmail" ? "sit" : name === "inkmail" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densmailPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densmail));
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

export function inkmailPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkmail));
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

export function denspolyplacoPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: ChitonHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densmail") {
    const pose = densmailPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkmail") {
    const pose = inkmailPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denspolyplacoPose(next.t);
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

export function beginTrick(kind: ChitonTrickKind, x: number, facing: 1 | -1): ChitonTrick {
  const anim: TrickAnim =
    kind === "chitonhush"
      ? "sit"
      : kind === "plateflex"
        ? "play"
        : kind === "aesthete"
          ? "talk"
          : kind === "radularasp"
            ? "sit"
            : kind === "girdlesettle"
              ? "sit"
              : kind === "rockcreep"
                ? "walk"
                : kind === "eightvalve"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "chitonhush" ? "hold" : "go",
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

export function chitonhushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function plateflexPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.plateflex));
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

export function radularaspPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.radularasp));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "sit" as TrickAnim,
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

export function girdlesettlePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.girdlesettle));
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

export function rockcreepPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.rockcreep));
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

export function eightvalvePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.eightvalve));
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

export function aesthetePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.aesthete));
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

export function stepTrick(trick: ChitonTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "plateflex" &&
    trick.kind !== "radularasp" &&
    trick.kind !== "girdlesettle" &&
    trick.kind !== "rockcreep" &&
    trick.kind !== "eightvalve" &&
    trick.kind !== "aesthete"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "chitonhush") {
    if (next.t < CHITONHUSH_HOLD) {
      const pose = chitonhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CHITONHUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CHITONHUSH_HOLD);
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
  if (next.kind === "plateflex") {
    const pose = plateflexPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "radularasp") {
    const pose = radularaspPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "girdlesettle") {
    const pose = girdlesettlePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "rockcreep") {
    const pose = rockcreepPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "eightvalve") {
    const pose = eightvalvePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = aesthetePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
