/** Jaw ground tricks while idle — ultra-polish pass. House neighborly Crocodylidae / Crocodylus acutus American Crocodile brackish-dish desk life (crocodile / Jaw) — toothlock / highwalk / salttear / nestpit / vsnout / keelridge / acutus personality (toothlock interlocking fourth-tooth show without naming tooth or lock or dent or ivy or snaggle or grin or smile or fang or bite or jaw or mouth or gape or open or close alone, highwalk high-walk gait without naming high or walk or gait or stride or stilts or pedestal or digit or erect or legs or march or trek or hike or climb alone, salttear lingual salt-gland brine tear without naming salt or tear or brine or gland or weep or cry or drip or ocean or marine or osmotic or ion or nasal alone, nestpit hole-nest scrape without naming nest or pit or hole or dig or scrape or sand or brood or egg or mound or bank or berm or pack or bury alone, vsnout V-shaped snout tip tell without naming snout or V or nose or tip or taper or pointed or narrow or muzzle alone, keelridge keeled dorsal scute ridge without naming keel or ridge or scute or dorsal or armor or plate or scale alone, long acutus Crocodylus acutus brackish-calm keel hush hold (THE acutus sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or bellowbank or deathcoil or snoutspy or baskgape or osteoderm or scutehush or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or coronal or sandhush or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or casque or zygodactyl or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or bluetail or stonehush or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or nuchal or vinehush or anolis or toepadcling or vocalclick or lickeye or mothstalk or setae or lamphush or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed or snap or shut or hide or show or sit or still as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Levee owns bellowbank/deathcoil/snoutspy/baskgape/osteoderm/scutehush/mississippi; Spike owns bloodsquirt/antfeast/freezeflat/rainharvest/coronal/sandhush/phrynosoma; Shift owns veilflush/turretgaze/tongueshot/branchrock/casque/zygodactyl/calyptratus; Dash owns tailbluff/litterdash/tongueflick/sunbask/bluetail/stonehush/plestiodon; Wink owns dewlapflash/pushupshow/hueshift/preyinch/nuchal/vinehush/anolis; Pad owns toepadcling/vocalclick/lickeye/mothstalk/setae/lamphush/hemidactylus; Reed/frog owns nictitate/gular/tympanum — do NOT reuse nictitate; Beak/snapper next — leave turtle/snap/shell words free; Door moray / Hide grouper — keep crocodile-true; guest slug Jaw / key crocodile only for isKey matching — accept "crocodile" and "jaw"; do NOT name a trick "crocodile" or "jaw" or "alligator" or "levee" or "crocodylus" or "deathroll" or "mississippi" or "horned_lizard" or "spike" or "phrynosoma" or "chameleon" or "calyptratus" or "veiled" or "skink" or "plestiodon" or "anole" or "anolis" or "gecko" or "hemidactylus" or "snapper" or "beak" or "bask" or "bank" or "close" or "still" or "flash" or "show" or "sit") — not Levee alligator life, not Spike horned-lizard life, not Beak snapper life, not Shift chameleon life, not Dash skink life, not Reed frog life, not Rui red_panda life. Toothlock fourth-tooth without naming tooth alone, highwalk high-walk without naming walk alone, salttear salt-tear without naming salt alone, nestpit nest-pit without naming nest alone, vsnout V-snout without naming snout alone, keelridge keel-ridge without naming keel alone, acutus long sit_hold on the brackish dish (THE acutus sit_hold tell); densjaw / inkjaw / denskeel thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop crocodile-tricks.js. Window-play FLASH unchanged. Ethogram softs + freeze — never names show/sit/still/crocodile as bare ethogram-only trick kinds. True Crocodylus acutus Crocodylidae American Crocodile desk life only — distinct from Levee, Spike, Beak, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Beak / snapper. No cry inventing — thank-yous are silent desk motion only; no crocodile.wav on disk so prefersHouseCry skipped. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "crocodile";
export const TRICKS = ["toothlock", "highwalk", "salttear", "nestpit", "vsnout", "keelridge", "acutus"] as const;
export const HAPPY = ["densjaw", "inkjaw", "denskeel"] as const;
export type CrocodileTrickKind = (typeof TRICKS)[number];
export type CrocodileHappyKind = (typeof HAPPY)[number];
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

export type CrocodileTrick = {
  kind: CrocodileTrickKind;
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

export type CrocodileHappy = {
  kind: CrocodileHappyKind;
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

export const HAPPY_DUR = { densjaw: 1.70, inkjaw: 1.84, denskeel: 1.76 } as const;
export const ACUTUS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  acutus: ACUTUS_HOLD + RELEASE_S,
  toothlock: 2.48,
  highwalk: 2.42,
  nestpit: 2.56,
  salttear: 2.44,
  vsnout: 2.40,
  keelridge: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CrocodileTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "acutus") return 40 + roll * 26;
  if (kind === "vsnout" || kind === "keelridge" || kind === "toothlock") return 12.8 + roll * 9.4;
  if (kind === "highwalk" || kind === "nestpit" || kind === "salttear") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CrocodileTrickKind | string | null) {
  if (musicOn) return "acutus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "acutus") {
    if (roll < 0.17) return "toothlock" as const;
    if (roll < 0.33) return "highwalk" as const;
    if (roll < 0.49) return "nestpit" as const;
    if (roll < 0.65) return "salttear" as const;
    if (roll < 0.83) return "vsnout" as const;
    return "keelridge" as const;
  }
  if (lastKind === "toothlock") {
    if (roll < 0.16) return "acutus" as const;
    if (roll < 0.32) return "highwalk" as const;
    if (roll < 0.48) return "nestpit" as const;
    if (roll < 0.64) return "salttear" as const;
    if (roll < 0.82) return "vsnout" as const;
    return "keelridge" as const;
  }
  if (lastKind === "highwalk") {
    if (roll < 0.14) return "acutus" as const;
    if (roll < 0.3) return "toothlock" as const;
    if (roll < 0.46) return "nestpit" as const;
    if (roll < 0.62) return "salttear" as const;
    if (roll < 0.8) return "vsnout" as const;
    return "keelridge" as const;
  }
  if (lastKind === "vsnout" || lastKind === "keelridge") {
    if (roll < 0.14) return "acutus" as const;
    if (roll < 0.3) return "toothlock" as const;
    if (roll < 0.46) return "highwalk" as const;
    if (roll < 0.62) return "nestpit" as const;
    if (roll < 0.78) return "salttear" as const;
    return lastKind === "vsnout" ? ("keelridge" as const) : ("vsnout" as const);
  }
  if (roll < 0.14) return "acutus" as const;
  if (roll < 0.28) return "toothlock" as const;
  if (roll < 0.42) return "highwalk" as const;
  if (roll < 0.56) return "nestpit" as const;
  if (roll < 0.7) return "salttear" as const;
  if (roll < 0.85) return "vsnout" as const;
  return "keelridge" as const;
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
  return key === TRICK_KEY || key === "jaw";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CrocodileHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as CrocodileHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CrocodileHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CrocodileHappyKind | string, x: number, facing: 1 | -1): CrocodileHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as CrocodileHappyKind) : "densjaw";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densjaw" ? "sit" : name === "inkjaw" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densjawPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densjaw));
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

export function inkjawPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkjaw));
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

export function denskeelPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: CrocodileHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densjaw") {
    const pose = densjawPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkjaw") {
    const pose = inkjawPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denskeelPose(next.t);
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

export function beginTrick(kind: CrocodileTrickKind, x: number, facing: 1 | -1): CrocodileTrick {
  const anim: TrickAnim =
    kind === "acutus"
      ? "sit"
      : kind === "toothlock"
        ? "talk"
        : kind === "highwalk"
          ? "play"
          : kind === "nestpit"
            ? "play"
            : kind === "salttear"
              ? "sit"
              : kind === "vsnout"
                ? "sit"
                : kind === "keelridge"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "acutus" ? "hold" : "go",
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

export function acutusPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function toothlockPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.toothlock));
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

export function highwalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.highwalk));
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

export function nestpitPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.nestpit));
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

export function salttearPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.salttear));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 2.8, rot: s * 12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const nestle = Math.sin(t * 2.2);
    return {
      x: fromX + face * (0.6 + nestle * 0.1),
      lift: 2.4 + Math.abs(nestle) * 1.8,
      rot: face * (12 + nestle * 8),
      anim: "sit" as TrickAnim,
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

export function vsnoutPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.vsnout));
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

export function keelridgePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.keelridge));
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

export function stepTrick(trick: CrocodileTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "toothlock" && trick.kind !== "highwalk" && trick.kind !== "nestpit" && trick.kind !== "salttear" && trick.kind !== "vsnout" && trick.kind !== "keelridge") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "acutus") {
    if (next.t < ACUTUS_HOLD) {
      const pose = acutusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ACUTUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ACUTUS_HOLD);
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
  if (next.kind === "toothlock") {
    const pose = toothlockPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "highwalk") {
    const pose = highwalkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "nestpit") {
    const pose = nestpitPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "salttear") {
    const pose = salttearPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "vsnout") {
    const pose = vsnoutPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = keelridgePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

