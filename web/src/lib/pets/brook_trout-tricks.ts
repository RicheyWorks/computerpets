/** Speck ground tricks while idle — ultra-polish pass. House neighborly Salmonidae / Salvelinus fontinalis Brook Trout cold-stream char desk life (brook_trout / Speck) — driftfeed / insectrise / reddscrape / vermicflash / adipose / coldriffle / fontinalis personality (driftfeed cold-stream drift feed without naming drift or feed or stream or cold or current or sip or gulp or nibble or mouth or prey or insect or worm or float or hang or idle or quiet or cruise or glide or swim alone, insectrise worm/insect surface rise without naming insect or worm or rise or surface or jump or leap or boil or splash or snap or bite or fly or mayfly or caddis or hatch or top or burst or breach alone, reddscrape redd spawn scrape dig without naming redd or scrape or dig or spawn or nest or bed or gravel or fan or sweep or circle or male or brood or guard or sit or hover or wash alone, vermicflash vermiculate flank flash without naming vermic or vermiculate or flash or flank or spot or mark or stripe or glow or shimmer or turn or twist or roll or show or color or pattern or marble alone, adipose adipose-fin set without naming adipose or fin or soft or ray or dorsal or tip or lift or raise or show or mark alone, coldriffle cold-riffle hang without naming cold or riffle or hang or float or current or shade or wait or hover or idle or quiet alone, long fontinalis Salvelinus fontinalis Salmonidae char hush hold (THE fontinalis sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or coverstrike or bedfan or surboil or latline or maxilla or weedline or salmoides or denslunge or inklunge or densgape or nestscrape or carolinae or denslid or inklid or densdome or barbel or whisker or catfish or whisk or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed or snap or shut or hide or show or sit or still or gape or brook_trout or speck or char as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Lunge owns coverstrike/bedfan/surboil/latline/maxilla/weedline/salmoides — do NOT reuse; Lid owns nestscrape; Whisk catfish next — leave barbel words free; guest slug Speck / key brook_trout only for isKey matching — accept "brook_trout" and "speck"; do NOT name a trick "brook_trout" or "speck" or "bass" or "lunge" or "tuatara" or "peak" or "box_turtle" or "lid" or "snapper" or "beak" or "snap" or "crocodile" or "jaw" or "alligator" or "levee" or "turtle" or "ink" or "still" or "flash" or "show" or "sit" or "gape" or "char" or "rifflehush") — not Lunge bass life, not Lid box-turtle life, not Whisk catfish life, not creek fish clones, not Rui red_panda life. Driftfeed cold-stream drift without naming drift alone, insectrise surface rise without naming rise alone, reddscrape redd scrape without naming scrape alone, vermicflash vermiculate flash without naming flash alone, adipose adipose fin without naming fin alone, coldriffle cold riffle without naming riffle alone, fontinalis long sit_hold on the cold char riffle (THE fontinalis sit_hold tell); densspeck / inkspeck / densredd thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop brook_trout-tricks.js. Window-play FLASH unchanged. Ethogram softs + freeze — never names still/dart/rise/brook_trout/speck as bare ethogram-only trick kinds. True Brook Trout Salvelinus fontinalis Salmonidae char desk life only — distinct from Lunge, Lid, Beak, Jaw, Levee, Peak, Whisk, creek peers, Ink, Spike, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Whisk / catfish. No cry inventing — thank-yous are silent desk motion only; brook_trout.wav EXISTS so prefersHouseCry adds brook_trout after bass. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "brook_trout";
export const TRICKS = ["driftfeed", "insectrise", "reddscrape", "vermicflash", "adipose", "coldriffle", "fontinalis"] as const;
export const HAPPY = ["densspeck", "inkspeck", "densredd"] as const;
export type BrookTroutTrickKind = (typeof TRICKS)[number];
export type BrookTroutHappyKind = (typeof HAPPY)[number];
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

export type BrookTroutTrick = {
  kind: BrookTroutTrickKind;
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

export type BrookTroutHappy = {
  kind: BrookTroutHappyKind;
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

export const HAPPY_DUR = { densspeck: 1.70, inkspeck: 1.84, densredd: 1.76 } as const;
export const FONTINALIS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  fontinalis: FONTINALIS_HOLD + RELEASE_S,
  driftfeed: 2.48,
  insectrise: 2.42,
  reddscrape: 2.56,
  vermicflash: 2.44,
  adipose: 2.40,
  coldriffle: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: BrookTroutTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "fontinalis") return 40 + roll * 26;
  if (kind === "adipose" || kind === "coldriffle" || kind === "driftfeed") return 12.8 + roll * 9.4;
  if (kind === "insectrise" || kind === "reddscrape" || kind === "vermicflash") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: BrookTroutTrickKind | string | null) {
  if (musicOn) return "fontinalis" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "fontinalis") {
    if (roll < 0.17) return "driftfeed" as const;
    if (roll < 0.33) return "insectrise" as const;
    if (roll < 0.49) return "reddscrape" as const;
    if (roll < 0.65) return "vermicflash" as const;
    if (roll < 0.83) return "adipose" as const;
    return "coldriffle" as const;
  }
  if (lastKind === "driftfeed") {
    if (roll < 0.16) return "fontinalis" as const;
    if (roll < 0.32) return "insectrise" as const;
    if (roll < 0.48) return "reddscrape" as const;
    if (roll < 0.64) return "vermicflash" as const;
    if (roll < 0.82) return "adipose" as const;
    return "coldriffle" as const;
  }
  if (lastKind === "insectrise") {
    if (roll < 0.14) return "fontinalis" as const;
    if (roll < 0.3) return "driftfeed" as const;
    if (roll < 0.46) return "reddscrape" as const;
    if (roll < 0.62) return "vermicflash" as const;
    if (roll < 0.8) return "adipose" as const;
    return "coldriffle" as const;
  }
  if (lastKind === "adipose" || lastKind === "coldriffle") {
    if (roll < 0.14) return "fontinalis" as const;
    if (roll < 0.3) return "driftfeed" as const;
    if (roll < 0.46) return "insectrise" as const;
    if (roll < 0.62) return "reddscrape" as const;
    if (roll < 0.78) return "vermicflash" as const;
    return lastKind === "adipose" ? ("coldriffle" as const) : ("adipose" as const);
  }
  if (roll < 0.14) return "fontinalis" as const;
  if (roll < 0.28) return "driftfeed" as const;
  if (roll < 0.42) return "insectrise" as const;
  if (roll < 0.56) return "reddscrape" as const;
  if (roll < 0.7) return "vermicflash" as const;
  if (roll < 0.85) return "adipose" as const;
  return "coldriffle" as const;
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
  return key === TRICK_KEY || key === "speck";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: BrookTroutHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as BrookTroutHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: BrookTroutHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: BrookTroutHappyKind | string, x: number, facing: 1 | -1): BrookTroutHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as BrookTroutHappyKind) : "densspeck";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densspeck" ? "sit" : name === "inkspeck" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densspeckPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densspeck));
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

export function inkspeckPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkspeck));
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

export function densreddPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: BrookTroutHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densspeck") {
    const pose = densspeckPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkspeck") {
    const pose = inkspeckPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densreddPose(next.t);
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

export function beginTrick(kind: BrookTroutTrickKind, x: number, facing: 1 | -1): BrookTroutTrick {
  const anim: TrickAnim =
    kind === "fontinalis"
      ? "sit"
      : kind === "driftfeed"
        ? "talk"
        : kind === "insectrise"
          ? "play"
          : kind === "reddscrape"
            ? "sit"
            : kind === "vermicflash"
              ? "play"
              : kind === "adipose"
                ? "sit"
                : kind === "coldriffle"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "fontinalis" ? "hold" : "go",
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

export function fontinalisPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function driftfeedPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.driftfeed));
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

export function insectrisePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.insectrise));
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

export function reddscrapePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.reddscrape));
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

export function vermicflashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.vermicflash));
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

export function adiposePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.adipose));
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

export function coldrifflePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.coldriffle));
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

export function stepTrick(trick: BrookTroutTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "driftfeed" && trick.kind !== "insectrise" && trick.kind !== "reddscrape" && trick.kind !== "vermicflash" && trick.kind !== "adipose" && trick.kind !== "coldriffle") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "fontinalis") {
    if (next.t < FONTINALIS_HOLD) {
      const pose = fontinalisPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < FONTINALIS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - FONTINALIS_HOLD);
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
  if (next.kind === "driftfeed") {
    const pose = driftfeedPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "insectrise") {
    const pose = insectrisePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "reddscrape") {
    const pose = reddscrapePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "vermicflash") {
    const pose = vermicflashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "adipose") {
    const pose = adiposePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = coldrifflePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

