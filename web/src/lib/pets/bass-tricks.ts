/** Lunge ground tricks while idle — ultra-polish pass. House neighborly Centrarchidae / Micropterus salmoides Largemouth Bass freshwater-ambush desk life (bass / Lunge) — coverstrike / bedfan / surboil / latline / maxilla / weedline / salmoides personality (coverstrike ambush strike from cover without naming cover or strike or ambush or lunge or hunt or prey or chase or attack or rush or dart or snap or bite or jaws or mouth or weed or log or stump or shadow alone, bedfan male nest-bed caudal fan without naming bed or fan or nest or spawn or scrape or dig or circular or circle or gravel or male or brood or guard or sit or hover or wash or sweep alone, surboil surface strike boil without naming surface or boil or splash or top or jump or leap or breach or froth or swirl or rise or burst or pop or roll or thrash alone, latline lateral-line hover sense without naming lateral or line or hover or sense or feel or vibrate or pressure or detect or scan or watch or idle or float or hang or drift or listen or quiet alone, maxilla maxilla-jaw flare set without naming maxilla or jaw or gape or mouth or flare or open or bite or tooth or lip or buccal alone, weedline weed-edge hang without naming weed or line or edge or hang or float or cover or shade or stalk or wait alone, long salmoides Micropterus salmoides freshwater Centrarchidae hush hold (THE salmoides sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or parietalgaze or nuchalrise or burrowsit or eggseize or acrodont or diapsid or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or nestscrape or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed or snap or shut or hide or show or sit or still or gape or bass or lunge as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Peak owns parietalgaze/nuchalrise/burrowsit/eggseize/acrodont/diapsid/punctatus — do NOT reuse; Beak owns ambushgape; creek fish peers own theirs; Speck brook_trout next — leave salmonid words free; guest slug Lunge / key bass only for isKey matching — accept "bass" and "lunge"; do NOT name a trick "bass" or "lunge" or "tuatara" or "peak" or "box_turtle" or "lid" or "snapper" or "beak" or "snap" or "crocodile" or "jaw" or "alligator" or "levee" or "turtle" or "ink" or "still" or "flash" or "show" or "sit" or "gape" or "weedhush") — not Peak tuatara life, not Lid box-turtle life, not Beak snapper life, not Speck brook_trout life, not creek fish clones, not Rui red_panda life. Coverstrike cover ambush without naming cover alone, bedfan nest bed without naming bed alone, surboil surface boil without naming boil alone, latline lateral line without naming lateral alone, maxilla maxilla flare without naming jaw alone, weedline weed edge without naming weed alone, salmoides long sit_hold on the freshwater weed edge (THE salmoides sit_hold tell); denslunge / inklunge / densgape thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop bass-tricks.js. Window-play FLASH unchanged. Ethogram softs + freeze — never names still/lunge/gape/bass as bare ethogram-only trick kinds. True Largemouth Bass Micropterus salmoides Centrarchidae desk life only — distinct from Peak, Lid, Beak, Jaw, Levee, Speck, creek peers, Ink, Spike, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Speck / brook_trout. No cry inventing — thank-yous are silent desk motion only; bass.wav EXISTS so prefersHouseCry adds bass after tuatara. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "bass";
export const TRICKS = ["coverstrike", "bedfan", "surboil", "latline", "maxilla", "weedline", "salmoides"] as const;
export const HAPPY = ["denslunge", "inklunge", "densgape"] as const;
export type BassTrickKind = (typeof TRICKS)[number];
export type BassHappyKind = (typeof HAPPY)[number];
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

export type BassTrick = {
  kind: BassTrickKind;
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

export type BassHappy = {
  kind: BassHappyKind;
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

export const HAPPY_DUR = { denslunge: 1.70, inklunge: 1.84, densgape: 1.76 } as const;
export const SALMOIDES_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  salmoides: SALMOIDES_HOLD + RELEASE_S,
  coverstrike: 2.48,
  bedfan: 2.42,
  surboil: 2.56,
  latline: 2.44,
  maxilla: 2.40,
  weedline: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BassTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "salmoides") return 40 + roll * 26;
  if (kind === "maxilla" || kind === "weedline" || kind === "coverstrike") return 12.8 + roll * 9.4;
  if (kind === "bedfan" || kind === "surboil" || kind === "latline") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BassTrickKind | string | null) {
  if (musicOn) return "salmoides" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "salmoides") {
    if (roll < 0.17) return "coverstrike" as const;
    if (roll < 0.33) return "bedfan" as const;
    if (roll < 0.49) return "surboil" as const;
    if (roll < 0.65) return "latline" as const;
    if (roll < 0.83) return "maxilla" as const;
    return "weedline" as const;
  }
  if (lastKind === "coverstrike") {
    if (roll < 0.16) return "salmoides" as const;
    if (roll < 0.32) return "bedfan" as const;
    if (roll < 0.48) return "surboil" as const;
    if (roll < 0.64) return "latline" as const;
    if (roll < 0.82) return "maxilla" as const;
    return "weedline" as const;
  }
  if (lastKind === "bedfan") {
    if (roll < 0.14) return "salmoides" as const;
    if (roll < 0.3) return "coverstrike" as const;
    if (roll < 0.46) return "surboil" as const;
    if (roll < 0.62) return "latline" as const;
    if (roll < 0.8) return "maxilla" as const;
    return "weedline" as const;
  }
  if (lastKind === "maxilla" || lastKind === "weedline") {
    if (roll < 0.14) return "salmoides" as const;
    if (roll < 0.3) return "coverstrike" as const;
    if (roll < 0.46) return "bedfan" as const;
    if (roll < 0.62) return "surboil" as const;
    if (roll < 0.78) return "latline" as const;
    return lastKind === "maxilla" ? ("weedline" as const) : ("maxilla" as const);
  }
  if (roll < 0.14) return "salmoides" as const;
  if (roll < 0.28) return "coverstrike" as const;
  if (roll < 0.42) return "bedfan" as const;
  if (roll < 0.56) return "surboil" as const;
  if (roll < 0.7) return "latline" as const;
  if (roll < 0.85) return "maxilla" as const;
  return "weedline" as const;
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
  return key === TRICK_KEY || key === "lunge";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: BassHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as BassHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BassHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: BassHappyKind | string, x: number, facing: 1 | -1): BassHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as BassHappyKind) : "denslunge";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "denslunge" ? "sit" : name === "inklunge" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function denslungePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslunge));
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

export function inklungePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklunge));
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

export function densgapePose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: BassHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denslunge") {
    const pose = denslungePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inklunge") {
    const pose = inklungePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densgapePose(next.t);
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

export function beginTrick(kind: BassTrickKind, x: number, facing: 1 | -1): BassTrick {
  const anim: TrickAnim =
    kind === "salmoides"
      ? "sit"
      : kind === "coverstrike"
        ? "play"
        : kind === "bedfan"
          ? "sit"
          : kind === "surboil"
            ? "play"
            : kind === "latline"
              ? "talk"
              : kind === "maxilla"
                ? "sit"
                : kind === "weedline"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "salmoides" ? "hold" : "go",
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

export function salmoidesPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function coverstrikePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.coverstrike));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + tip * 0.12),
      lift: 3.5 + Math.abs(tip) * 1.5,
      rot: face * (16 + tip * 10),
      anim: "play" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.8 * (1 - s),
    lift: 1.4 * (1 - s),
    rot: face * (4 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function bedfanPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bedfan));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.8);
    return {
      x: fromX + face * bob * 0.5,
      lift: 2.6 + Math.abs(bob) * 1.4,
      rot: face * (-10 + bob * 12),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.2 * (1 - s),
    rot: face * (-3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function surboilPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.surboil));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const cast = Math.sin(t * 2.6);
    return {
      x: fromX - face * cast * 0.16,
      lift: 3.6 + Math.abs(cast) * 1.6,
      rot: face * (14 + cast * 12),
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

export function latlinePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.latline));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + nestle * 0.1),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 8),
      anim: "talk" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX + face * 0.6 * (1 - s),
    lift: 1.2 * (1 - s),
    rot: face * (3 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function maxillaPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.maxilla));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const tip = Math.sin(t * 2.0);
    return {
      x: fromX + face * tip * 0.08,
      lift: 2.8 + tip * 1.6,
      rot: face * (-12 + tip * 10),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.9);
    return {
      x: fromX,
      lift: 4.0 + Math.abs(hush) * 0.6,
      rot: face * (-4 + hush * 3),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 2.0 * (1 - s),
    rot: face * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function weedlinePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.weedline));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.55) {
    const stretch = Math.sin(t * 2.3);
    return {
      x: fromX + face * stretch * 0.1,
      lift: 3.4 + stretch * 1.4,
      rot: face * (12 + stretch * 9),
      anim: "sit" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.85);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(hush) * 0.7,
      rot: face * (5 + hush * 3),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.78) / 0.22);
  return {
    x: fromX,
    lift: 1.8 * (1 - s),
    rot: face * (2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: BassTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "coverstrike" && trick.kind !== "bedfan" && trick.kind !== "surboil" && trick.kind !== "latline" && trick.kind !== "maxilla" && trick.kind !== "weedline") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "salmoides") {
    if (next.t < SALMOIDES_HOLD) {
      const pose = salmoidesPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < SALMOIDES_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - SALMOIDES_HOLD);
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
  if (next.kind === "coverstrike") {
    const pose = coverstrikePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bedfan") {
    const pose = bedfanPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "surboil") {
    const pose = surboilPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "latline") {
    const pose = latlinePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "maxilla") {
    const pose = maxillaPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = weedlinePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

