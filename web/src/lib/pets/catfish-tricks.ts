/** Whisk ground tricks while idle — ultra-polish pass. House neighborly Ictaluridae / Ictalurus punctatus Channel Catfish mud-bottom whisker desk life (catfish / Whisk) — barbelprobe / cavitynest / mudcloud / caudalthrash / channel / mudhush / ictalurus personality (barbelprobe barbel taste-probe bottom without naming barbel or whisker or probe or taste or bottom or mud or silt or sniff or sense or mouth or lip or chin or forage or crawl or idle or quiet or cruise or glide or swim alone, cavitynest cavity nest spawn without naming cavity or nest or spawn or hole or brood or guard or sit or hover or wash or dig or scrape or fan or bed or gravel or male or egg or fry or den alone, mudcloud mud-cloud settle without naming mud or cloud or silt or settle or stir or thrash or boil or splash or surge or burst or hide or bury or dust or plume or haze alone, caudalthrash caudal thrash surge without naming caudal or thrash or surge or tail or fin or bolt or dash or burst or leap or jump or sprint or power or kick or slap or whip alone, channel channel-cat river hang without naming channel or river or hang or float or current or shade or wait or hover or idle or quiet or cruise alone, mudhush mud-bottom hush settle without naming mud or hush or settle or bottom or silt or still or quiet or idle or wait alone, long ictalurus Ictalurus punctatus Ictaluridae channel hush hold (THE ictalurus sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or driftfeed or insectrise or reddscrape or vermicflash or adipose or coldriffle or fontinalis or densspeck or inkspeck or densredd or coverstrike or bedfan or surboil or latline or maxilla or weedline or salmoides or denslunge or inklunge or densgape or nestscrape or carolinae or denslid or inklid or densdome or punctatus or denspeak or inkpeak or densisle or hingeshut or berryforage or shellsoak or ambushgape or mudbury or necklunge or banksnap or serpentina or densbeak or inkbeak or densplastron or toothlock or highwalk or salttear or nestpit or acutus or densjaw or inkjaw or denskeel or bellowbank or deathcoil or snoutspy or baskgape or mississippi or denslevee or inklevee or densscute or bloodsquirt or antfeast or freezeflat or rainharvest or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or anolis or toepadcling or vocalclick or lickeye or mothstalk or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed or snap or shut or hide or show or sit or still or gape or catfish or whisk or barbel as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Speck owns driftfeed/insectrise/reddscrape/vermicflash/adipose/coldriffle/fontinalis — do NOT reuse; Lunge owns coverstrike/bedfan/surboil/latline/maxilla/weedline/salmoides — do NOT reuse; Slick otter owns whiskernudge — do NOT reuse; Peak owns punctatus as a trick kind (Sphenodon) — catfish long hush is ictalurus already (good); Penny bluegill next — leave Lepomis/gillflare/bluegill words free; guest slug Whisk / key catfish only for isKey matching — accept "catfish" and "whisk"; do NOT name a trick "catfish" or "whisk" or "barbel" or "brook_trout" or "speck" or "bass" or "lunge" or "tuatara" or "peak" or "punctatus" or "bluegill" or "penny" or "lepomis" or "box_turtle" or "lid" or "snapper" or "beak" or "snap" or "crocodile" or "jaw" or "alligator" or "levee" or "turtle" or "ink" or "still" or "flash" or "show" or "sit" or "gape" or "mudhushbare") — not Speck brook-trout life, not Lunge bass life, not Lid box-turtle life, not Penny bluegill life, not creek fish clones, not Rui red_panda life. Barbelprobe barbel taste without naming barbel alone, cavitynest cavity nest without naming nest alone, mudcloud mud cloud without naming mud alone, caudalthrash caudal thrash without naming thrash alone, channel channel hang without naming channel alone, mudhush mud hush without naming hush alone, ictalurus long sit_hold on the mud channel (THE ictalurus sit_hold tell); denswhisk / inkwhisk / densbarbel thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop catfish-tricks.js. Window-play FLASH unchanged. Ethogram softs + freeze — never names still/whisk/sit/catfish/whisk as bare ethogram-only trick kinds. True Channel Catfish Ictalurus punctatus Ictaluridae desk life only — distinct from Speck, Lunge, Lid, Beak, Jaw, Levee, Peak, Penny, creek peers, Ink, Spike, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Penny / bluegill. No cry inventing — thank-yous are silent desk motion only; catfish.wav EXISTS so prefersHouseCry adds catfish after brook_trout. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "catfish";
export const TRICKS = ["barbelprobe", "cavitynest", "mudcloud", "caudalthrash", "channel", "mudhush", "ictalurus"] as const;
export const HAPPY = ["denswhisk", "inkwhisk", "densbarbel"] as const;
export type CatfishTrickKind = (typeof TRICKS)[number];
export type CatfishHappyKind = (typeof HAPPY)[number];
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

export type CatfishTrick = {
  kind: CatfishTrickKind;
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

export type CatfishHappy = {
  kind: CatfishHappyKind;
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

export const HAPPY_DUR = { denswhisk: 1.70, inkwhisk: 1.84, densbarbel: 1.76 } as const;
export const ICTALURUS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  ictalurus: ICTALURUS_HOLD + RELEASE_S,
  barbelprobe: 2.48,
  cavitynest: 2.42,
  mudcloud: 2.56,
  caudalthrash: 2.44,
  channel: 2.40,
  mudhush: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: CatfishTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "ictalurus") return 40 + roll * 26;
  if (kind === "channel" || kind === "mudhush" || kind === "barbelprobe") return 12.8 + roll * 9.4;
  if (kind === "cavitynest" || kind === "mudcloud" || kind === "caudalthrash") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: CatfishTrickKind | string | null) {
  if (musicOn) return "ictalurus" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "ictalurus") {
    if (roll < 0.17) return "barbelprobe" as const;
    if (roll < 0.33) return "cavitynest" as const;
    if (roll < 0.49) return "mudcloud" as const;
    if (roll < 0.65) return "caudalthrash" as const;
    if (roll < 0.83) return "channel" as const;
    return "mudhush" as const;
  }
  if (lastKind === "barbelprobe") {
    if (roll < 0.16) return "ictalurus" as const;
    if (roll < 0.32) return "cavitynest" as const;
    if (roll < 0.48) return "mudcloud" as const;
    if (roll < 0.64) return "caudalthrash" as const;
    if (roll < 0.82) return "channel" as const;
    return "mudhush" as const;
  }
  if (lastKind === "cavitynest") {
    if (roll < 0.14) return "ictalurus" as const;
    if (roll < 0.3) return "barbelprobe" as const;
    if (roll < 0.46) return "mudcloud" as const;
    if (roll < 0.62) return "caudalthrash" as const;
    if (roll < 0.8) return "channel" as const;
    return "mudhush" as const;
  }
  if (lastKind === "mudcloud") {
    if (roll < 0.15) return "ictalurus" as const;
    if (roll < 0.31) return "barbelprobe" as const;
    if (roll < 0.47) return "cavitynest" as const;
    if (roll < 0.63) return "caudalthrash" as const;
    if (roll < 0.81) return "channel" as const;
    return "mudhush" as const;
  }
  if (lastKind === "caudalthrash") {
    if (roll < 0.16) return "ictalurus" as const;
    if (roll < 0.32) return "barbelprobe" as const;
    if (roll < 0.48) return "cavitynest" as const;
    if (roll < 0.64) return "mudcloud" as const;
    if (roll < 0.82) return "channel" as const;
    return "mudhush" as const;
  }
  if (lastKind === "channel") {
    if (roll < 0.15) return "ictalurus" as const;
    if (roll < 0.31) return "barbelprobe" as const;
    if (roll < 0.47) return "cavitynest" as const;
    if (roll < 0.63) return "mudcloud" as const;
    if (roll < 0.81) return "caudalthrash" as const;
    return "mudhush" as const;
  }
  if (lastKind === "mudhush") {
    if (roll < 0.16) return "ictalurus" as const;
    if (roll < 0.32) return "barbelprobe" as const;
    if (roll < 0.48) return "cavitynest" as const;
    if (roll < 0.64) return "mudcloud" as const;
    if (roll < 0.82) return "caudalthrash" as const;
    return "channel" as const;
  }
  if (roll < 0.14) return "ictalurus" as const;
  if (roll < 0.28) return "barbelprobe" as const;
  if (roll < 0.42) return "cavitynest" as const;
  if (roll < 0.56) return "mudcloud" as const;
  if (roll < 0.7) return "caudalthrash" as const;
  if (roll < 0.85) return "channel" as const;
  return "mudhush" as const;
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
  return key === TRICK_KEY || key === "whisk";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: CatfishHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: CatfishHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: CatfishHappyKind | string, x: number, facing: 1 | -1): CatfishHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as CatfishHappyKind) : "denswhisk";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denswhisk" ? "sit" : name === "inkwhisk" ? "play" : "sit") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denswhiskPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denswhisk));
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

export function inkwhiskPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkwhisk));
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

export function densbarbelPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: CatfishHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denswhisk") {
    const pose = denswhiskPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkwhisk") {
    const pose = inkwhiskPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densbarbelPose(next.t);
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

export function beginTrick(kind: CatfishTrickKind, x: number, facing: 1 | -1): CatfishTrick {
  const anim: TrickAnim =
    kind === "ictalurus"
      ? "sit"
      : kind === "barbelprobe"
        ? "talk"
        : kind === "cavitynest"
          ? "sit"
          : kind === "mudcloud"
            ? "play"
            : kind === "caudalthrash"
              ? "play"
              : kind === "channel"
                ? "sit"
                : kind === "mudhush"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "ictalurus" ? "hold" : "go",
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

export function ictalurusPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function barbelprobePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.barbelprobe));
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

export function cavitynestPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cavitynest));
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

export function mudcloudPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mudcloud));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.2, rot: s * 14 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const cloud = Math.sin(t * 3.0);
    return {
      x: fromX + face * (0.6 + cloud * 0.18),
      lift: 3.0 + Math.abs(cloud) * 1.8,
      rot: face * (14 + cloud * 12),
      anim: "play" as TrickAnim,
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

export function caudalthrashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.caudalthrash));
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

export function channelPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.channel));
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

export function mudhushPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mudhush));
  const face = facing == null ? 1 : facing;
  if (u < 0.16) {
    const s = smoothstep(u / 0.16);
    return { x: fromX, lift: s * 2.4, rot: s * -8 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const hush = Math.sin(t * 1.6);
    return {
      x: fromX + face * hush * 0.08,
      lift: 2.4 + Math.abs(hush) * 1.0,
      rot: face * (-8 + hush * 6),
      anim: "sit" as TrickAnim,
    };
  }
  const s = smoothstep((u - 0.8) / 0.2);
  return {
    x: fromX,
    lift: 1.1 * (1 - s),
    rot: face * (-2 * (1 - s)),
    anim: "idle" as TrickAnim,
  };
}

export function stepTrick(trick: CatfishTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "barbelprobe" &&
    trick.kind !== "cavitynest" &&
    trick.kind !== "mudcloud" &&
    trick.kind !== "caudalthrash" &&
    trick.kind !== "channel" &&
    trick.kind !== "mudhush"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "ictalurus") {
    if (next.t < ICTALURUS_HOLD) {
      const pose = ictalurusPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ICTALURUS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ICTALURUS_HOLD);
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
  if (next.kind === "barbelprobe") {
    const pose = barbelprobePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "cavitynest") {
    const pose = cavitynestPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mudcloud") {
    const pose = mudcloudPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "caudalthrash") {
    const pose = caudalthrashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "channel") {
    const pose = channelPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = mudhushPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
