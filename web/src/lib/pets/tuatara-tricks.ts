/** Peak ground tricks while idle — ultra-polish pass. House neighborly Rhynchocephalia / Sphenodon punctatus Tuatara island-crest desk life (tuatara / Peak) — parietalgaze / nuchalrise / burrowsit / eggseize / acrodont / diapsid / punctatus personality (parietalgaze parietal third-eye bask gaze without naming parietal or third or eye or gaze or bask or sun or sky or stare or watch or look or monocle or turret or loft or tip or peer or scan alone, nuchalrise spiny nuchal crest raise without naming crest or flare or spine or raise or spike or bristle or fan or display or threat or puff or lift or ridge or sail or comb or nuchal alone, burrowsit cool burrow-mouth sit without naming burrow or sit or dens or hole or tunnel or mouth or nest or cave or cool or shade or rest or lounge or crouch or wait or hide alone, eggseize bird-egg invertebrate seize without naming egg or seize or snap or bite or strike or lunge or hunt or prey or grub or insect or ambush or gape or lock or crunch or feed alone, acrodont acrodont-tooth bite set without naming tooth or bite or jaw or gum or dentition or chew or grind or crush alone, diapsid diapsid skull-arch hush without naming skull or arch or fenestra or bone or head or hush or freeze or still alone, long punctatus Sphenodon punctatus cool-island sit-and-wait hush hold (THE punctatus sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or hingeshut or berryforage or shellsoak or nestscrape or dome or leafhush or carolinae or denslid or inklid or densdome or ambushgape or mudbury or necklunge or banksnap or serrated or plastron or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or vsnout or keelridge or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or osteoderm or scutehush or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or coronal or sandhush or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or casque or zygodactyl or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or bluetail or stonehush or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or nuchal or vinehush or anolis or toepadcling or vocalclick or lickeye or mothstalk or setae or lamphush or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed or snap or shut or hide or show or sit or still as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Lid owns hingeshut/berryforage/shellsoak/nestscrape/dome/leafhush/carolinae — do NOT reuse; Wink owns nuchal — nuchalrise ok if distinct; Shift owns turretgaze — keep parietal distinct; Beak/Jaw/Levee/Spike/Dash/Pad own theirs; guest slug Peak / key tuatara only for isKey matching — accept "tuatara" and "peak"; do NOT name a trick "tuatara" or "peak" or "box_turtle" or "lid" or "snapper" or "beak" or "snap" or "crocodile" or "jaw" or "alligator" or "levee" or "turtle" or "ink" or "plastron" or "still" or "flash" or "show" or "sit" or "crest" or "watch" or "islehush") — not Lid box-turtle life, not Beak snapper life, not Jaw crocodile life, not Levee alligator life, not lizard/anole/skink/chameleon/gecko clones, not Rui red_panda life. Parietalgaze third-eye bask without naming parietal alone, nuchalrise nuchal crest without naming nuchal alone, burrowsit burrow mouth without naming burrow alone, eggseize egg seize without naming egg alone, acrodont acrodont bite without naming tooth alone, diapsid diapsid arch without naming skull alone, punctatus long sit_hold on the cool island (THE punctatus sit_hold tell); denspeak / inkpeak / densisle thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop tuatara-tricks.js. Window-play FLASH unchanged. Ethogram softs + freeze — never names still/crest/watch/tuatara as bare ethogram-only trick kinds. True Tuatara Rhynchocephalia Sphenodon punctatus desk life only — distinct from Lid, Beak, Jaw, Levee, Ink, Spike, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Lunge / bass. No cry inventing — thank-yous are silent desk motion only; tuatara.wav EXISTS so prefersHouseCry adds tuatara after alligator. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "tuatara";
export const TRICKS = ["parietalgaze", "nuchalrise", "burrowsit", "eggseize", "acrodont", "diapsid", "punctatus"] as const;
export const HAPPY = ["denspeak", "inkpeak", "densisle"] as const;
export type TuataraTrickKind = (typeof TRICKS)[number];
export type TuataraHappyKind = (typeof HAPPY)[number];
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

export type TuataraTrick = {
  kind: TuataraTrickKind;
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

export type TuataraHappy = {
  kind: TuataraHappyKind;
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

export const HAPPY_DUR = { denspeak: 1.70, inkpeak: 1.84, densisle: 1.76 } as const;
export const PUNCTATUS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  punctatus: PUNCTATUS_HOLD + RELEASE_S,
  parietalgaze: 2.48,
  nuchalrise: 2.42,
  burrowsit: 2.56,
  eggseize: 2.44,
  acrodont: 2.40,
  diapsid: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TuataraTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "punctatus") return 40 + roll * 26;
  if (kind === "acrodont" || kind === "diapsid" || kind === "parietalgaze") return 12.8 + roll * 9.4;
  if (kind === "nuchalrise" || kind === "burrowsit" || kind === "eggseize") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TuataraTrickKind | string | null) {
  if (musicOn) return "punctatus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "punctatus") {
    if (roll < 0.17) return "parietalgaze" as const;
    if (roll < 0.33) return "nuchalrise" as const;
    if (roll < 0.49) return "burrowsit" as const;
    if (roll < 0.65) return "eggseize" as const;
    if (roll < 0.83) return "acrodont" as const;
    return "diapsid" as const;
  }
  if (lastKind === "parietalgaze") {
    if (roll < 0.16) return "punctatus" as const;
    if (roll < 0.32) return "nuchalrise" as const;
    if (roll < 0.48) return "burrowsit" as const;
    if (roll < 0.64) return "eggseize" as const;
    if (roll < 0.82) return "acrodont" as const;
    return "diapsid" as const;
  }
  if (lastKind === "nuchalrise") {
    if (roll < 0.14) return "punctatus" as const;
    if (roll < 0.3) return "parietalgaze" as const;
    if (roll < 0.46) return "burrowsit" as const;
    if (roll < 0.62) return "eggseize" as const;
    if (roll < 0.8) return "acrodont" as const;
    return "diapsid" as const;
  }
  if (lastKind === "acrodont" || lastKind === "diapsid") {
    if (roll < 0.14) return "punctatus" as const;
    if (roll < 0.3) return "parietalgaze" as const;
    if (roll < 0.46) return "nuchalrise" as const;
    if (roll < 0.62) return "burrowsit" as const;
    if (roll < 0.78) return "eggseize" as const;
    return lastKind === "acrodont" ? ("diapsid" as const) : ("acrodont" as const);
  }
  if (roll < 0.14) return "punctatus" as const;
  if (roll < 0.28) return "parietalgaze" as const;
  if (roll < 0.42) return "nuchalrise" as const;
  if (roll < 0.56) return "burrowsit" as const;
  if (roll < 0.7) return "eggseize" as const;
  if (roll < 0.85) return "acrodont" as const;
  return "diapsid" as const;
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
  return key === TRICK_KEY || key === "peak";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: TuataraHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as TuataraHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: TuataraHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: TuataraHappyKind | string, x: number, facing: 1 | -1): TuataraHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as TuataraHappyKind) : "denspeak";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "denspeak" ? "sit" : name === "inkpeak" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function denspeakPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denspeak));
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

export function inkpeakPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkpeak));
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

export function densislePose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: TuataraHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denspeak") {
    const pose = denspeakPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkpeak") {
    const pose = inkpeakPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densislePose(next.t);
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

export function beginTrick(kind: TuataraTrickKind, x: number, facing: 1 | -1): TuataraTrick {
  const anim: TrickAnim =
    kind === "punctatus"
      ? "sit"
      : kind === "parietalgaze"
        ? "talk"
        : kind === "nuchalrise"
          ? "play"
          : kind === "burrowsit"
            ? "sit"
            : kind === "eggseize"
              ? "play"
              : kind === "acrodont"
                ? "sit"
                : kind === "diapsid"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "punctatus" ? "hold" : "go",
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

export function punctatusPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function parietalgazePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.parietalgaze));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + tip * 0.12),
      lift: 3.5 + Math.abs(tip) * 1.5,
      rot: face * (16 + tip * 10),
      anim: "talk" as TrickAnim,
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

export function nuchalrisePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nuchalrise));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * -10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.8);
    return {
      x: fromX + face * bob * 0.5,
      lift: 2.6 + Math.abs(bob) * 1.4,
      rot: face * (-10 + bob * 12),
      anim: "play" as TrickAnim,
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

export function burrowsitPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.burrowsit));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const cast = Math.sin(t * 2.6);
    return {
      x: fromX - face * cast * 0.16,
      lift: 3.6 + Math.abs(cast) * 1.6,
      rot: face * (14 + cast * 12),
      anim: "sit" as TrickAnim,
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

export function eggseizePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.eggseize));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + nestle * 0.1),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 8),
      anim: "play" as TrickAnim,
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

export function acrodontPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.acrodont));
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

export function diapsidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.diapsid));
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

export function stepTrick(trick: TuataraTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "parietalgaze" && trick.kind !== "nuchalrise" && trick.kind !== "burrowsit" && trick.kind !== "eggseize" && trick.kind !== "acrodont" && trick.kind !== "diapsid") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "punctatus") {
    if (next.t < PUNCTATUS_HOLD) {
      const pose = punctatusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PUNCTATUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PUNCTATUS_HOLD);
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
  if (next.kind === "parietalgaze") {
    const pose = parietalgazePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nuchalrise") {
    const pose = nuchalrisePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "burrowsit") {
    const pose = burrowsitPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "eggseize") {
    const pose = eggseizePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "acrodont") {
    const pose = acrodontPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = diapsidPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

