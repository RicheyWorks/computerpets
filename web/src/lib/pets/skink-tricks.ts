/** Dash ground tricks while idle — ultra-polish pass. House neighborly Scincidae / Plestiodon fasciatus Five-lined Skink stone-crack desk life (skink / Dash) — tailbluff / litterdash / tongueflick / sunbask / bluetail / stonehush / plestiodon personality (tailbluff tail autotomy bluff without naming tail or auto or bluff or drop or thrash or wiggle or break or lose or blue or threat or warn or signal alone, litterdash litter leaf dash without naming litter or leaf or dash or zip or bolt or run or sprint or hide or crack or rush or flee or dart alone, tongueflick tongue chem flick without naming tongue or flick or chem or taste or scent or smell or sense or tip or lick or sample or probe alone, sunbask sun bask warm without naming sun or bask or warm or heat or flat or stone or soak or rest or nap or loaf or idle or settle alone, bluetail blue-tail juvenile flash without naming blue or tail or flash or warn or signal or bright or stripe alone, stonehush stone-crack hush settle without naming stone or hush or crack or sit or rest or lounge or nap alone, long plestiodon Plestiodon fasciatus surface-calm stripe hush hold (THE plestiodon sit_hold tell) — never named wait or crouch or roost or look or stalk or monocle or fossick or anting or corvid or dewlapflash or pushupshow or hueshift or preyinch or nuchal or vinehush or anolis or toepadcling or vocalclick or lickeye or mothstalk or setae or lamphush or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or scentgland or socialpile or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or bluffhuff or mastforage or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or guardhair or pinehush or erethizon or woodfell or paddleclap or lodgehaul or mudpack or aspen or divehush or castor or stillfeign or scrapnose or gapegrin or raftergrip or pouchcarry or prehensile or didelphis or footstomp or duffgrub or handwarn or plumeaim or scentraise or plantigrade or mephitis or pawdouse or litterdig or rearstand or maskpeer or dexterous or ringtail or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or denslide or spraint or lontra or nutbury or tailflick or cheekpouch or branchleap or barkscramble or scold or sciurus or wingwrap or traguscup or thumbcrawl or duskhang or eptesicus or flagtail or edgebrowse or earswivel or forestamp or odocoileus or curl or snuffle or anoint or bristle or root or trundle or wheel or tube or romp or steal or puff or noodle or corkscrew or slink or hang or flutter or still or stamp or raise or spray or skunk or stripe or playdead or grin or opossum or ferret or weasel or mink or otter or red_panda or wash or beaver or dam or porcupine or spine or quill or popcorn or rumble or hay or potato or zig or lookout or teeth or soak or graze or nuzzle or capybara or bankhush or climb or chirp or cling or gecko or pad or dewlap or sun or nod or press or flick or sneeze or lash or maculate or litter or cutaneous or nasolabial or ambystomid or mental or granular or crest or caudal or filament or costal or caudate or lamella or imbricate or lasso or margin or pleurotus or gular or nictitate or tympanum or iliac or lentic or toepad or webbing or verruca or burrow or parotoid or tubercle or bufonid or flash or brown or hue or shift or chameleon or aim or catch or dash or skink or tail as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Wink/anole owns dewlapflash/pushupshow/hueshift/preyinch/nuchal/vinehush/anolis; Pad owns toepadcling/vocalclick/lickeye/mothstalk/setae/lamphush/hemidactylus; Grin owns stillfeign; Wash owns litterdig; Shift/chameleon owns hueshift-adjacent aim/catch — leave chameleon words free; guest slug Dash / key skink only for isKey matching — accept "skink" and "dash"; do NOT name a trick "skink" or "dash" or "tail" or "still" or "flash" or "anole" or "wink" or "gecko" or "pad" or "climb" or "chirp" or "cling" or "lamella" or "dewlap" or "salamander" or "dapple" or "iguana" or "sol" or "newt" or "eft" or "caecilian" or "slip" or "frog" or "reed" or "toad" or "pebble" or "gular" or "chameleon" or "shift" or "hue") — not Wink anole life, not Pad gecko life, not Sol iguana life, not Shift chameleon life, not Reed frog life, not Dapple salamander life, not Rui red_panda life. Tailbluff tail bluff without naming tail alone, litterdash litter-dash without naming dash alone, tongueflick tongue-flick without naming flick alone, sunbask sun-bask without naming bask alone, bluetail blue-tail without naming blue alone, stonehush stone-hush without naming hush alone, plestiodon long sit_hold on the stone crack (THE plestiodon sit_hold tell); densdash / inkdash / densbluff thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop skink-tricks.js. Window-play FLASH unchanged. Ethogram softs + freeze — never names dash/tail/still/skink as bare ethogram-only trick kinds. True Plestiodon fasciatus Scincidae Five-lined Skink desk life only — distinct from Wink, Pad, Sol, Shift, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Shift / chameleon. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry skink (skink.wav on disk). Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "skink";
export const TRICKS = ["tailbluff", "litterdash", "tongueflick", "sunbask", "bluetail", "stonehush", "plestiodon"] as const;
export const HAPPY = ["densdash", "inkdash", "densbluff"] as const;
export type SkinkTrickKind = (typeof TRICKS)[number];
export type SkinkHappyKind = (typeof HAPPY)[number];
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

export type SkinkTrick = {
  kind: SkinkTrickKind;
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

export type SkinkHappy = {
  kind: SkinkHappyKind;
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

export const HAPPY_DUR = { densdash: 1.70, inkdash: 1.84, densbluff: 1.76 } as const;
export const PLESTIODON_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  plestiodon: PLESTIODON_HOLD + RELEASE_S,
  tailbluff: 2.48,
  litterdash: 2.42,
  tongueflick: 2.56,
  sunbask: 2.44,
  bluetail: 2.40,
  stonehush: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SkinkTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "plestiodon") return 40 + roll * 26;
  if (kind === "bluetail" || kind === "stonehush" || kind === "tailbluff") return 12.8 + roll * 9.4;
  if (kind === "litterdash" || kind === "tongueflick" || kind === "sunbask") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SkinkTrickKind | string | null) {
  if (musicOn) return "plestiodon" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "plestiodon") {
    if (roll < 0.17) return "tailbluff" as const;
    if (roll < 0.33) return "litterdash" as const;
    if (roll < 0.49) return "tongueflick" as const;
    if (roll < 0.65) return "sunbask" as const;
    if (roll < 0.83) return "bluetail" as const;
    return "stonehush" as const;
  }
  if (lastKind === "tailbluff") {
    if (roll < 0.16) return "plestiodon" as const;
    if (roll < 0.32) return "litterdash" as const;
    if (roll < 0.48) return "tongueflick" as const;
    if (roll < 0.64) return "sunbask" as const;
    if (roll < 0.82) return "bluetail" as const;
    return "stonehush" as const;
  }
  if (lastKind === "litterdash") {
    if (roll < 0.14) return "plestiodon" as const;
    if (roll < 0.3) return "tailbluff" as const;
    if (roll < 0.46) return "tongueflick" as const;
    if (roll < 0.62) return "sunbask" as const;
    if (roll < 0.8) return "bluetail" as const;
    return "stonehush" as const;
  }
  if (lastKind === "bluetail" || lastKind === "stonehush") {
    if (roll < 0.14) return "plestiodon" as const;
    if (roll < 0.3) return "tailbluff" as const;
    if (roll < 0.46) return "litterdash" as const;
    if (roll < 0.62) return "tongueflick" as const;
    if (roll < 0.78) return "sunbask" as const;
    return lastKind === "bluetail" ? ("stonehush" as const) : ("bluetail" as const);
  }
  if (roll < 0.14) return "plestiodon" as const;
  if (roll < 0.28) return "tailbluff" as const;
  if (roll < 0.42) return "litterdash" as const;
  if (roll < 0.56) return "tongueflick" as const;
  if (roll < 0.7) return "sunbask" as const;
  if (roll < 0.85) return "bluetail" as const;
  return "stonehush" as const;
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
  return key === TRICK_KEY || key === "dash";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SkinkHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as SkinkHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SkinkHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SkinkHappyKind | string, x: number, facing: 1 | -1): SkinkHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as SkinkHappyKind) : "densdash";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "densdash" ? "sit" : name === "inkdash" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densdashPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densdash));
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

export function inkdashPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkdash));
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

export function densbluffPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: SkinkHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densdash") {
    const pose = densdashPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkdash") {
    const pose = inkdashPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densbluffPose(next.t);
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

export function beginTrick(kind: SkinkTrickKind, x: number, facing: 1 | -1): SkinkTrick {
  const anim: TrickAnim =
    kind === "plestiodon"
      ? "sit"
      : kind === "tailbluff"
        ? "sit"
        : kind === "litterdash"
          ? "play"
          : kind === "tongueflick"
            ? "talk"
            : kind === "sunbask"
              ? "talk"
              : kind === "bluetail"
                ? "talk"
                : kind === "stonehush"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "plestiodon" ? "hold" : "go",
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

export function plestiodonPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function tailbluffPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tailbluff));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.5, rot: s * 16 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const tip = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + tip * 0.12),
      lift: 3.5 + Math.abs(tip) * 1.5,
      rot: face * (16 + tip * 10),
      anim: "sit" as TrickAnim,
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

export function litterdashPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.litterdash));
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

export function tongueflickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.tongueflick));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.8, rot: s * 14 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const cast = Math.sin(t * 2.6);
    return {
      x: fromX - face * cast * 0.16,
      lift: 3.6 + Math.abs(cast) * 1.6,
      rot: face * (14 + cast * 12),
      anim: "talk" as TrickAnim,
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

export function sunbaskPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sunbask));
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

export function bluetailPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bluetail));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 2.8, rot: s * -12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.55) {
    const tip = Math.sin(t * 2.0);
    return {
      x: fromX + face * tip * 0.08,
      lift: 2.8 + tip * 1.6,
      rot: face * (-12 + tip * 10),
      anim: "talk" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.9);
    return {
      x: fromX,
      lift: 4.0 + Math.abs(hush) * 0.6,
      rot: face * (-4 + hush * 3),
      anim: "talk" as TrickAnim,
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

export function stonehushPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.stonehush));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX, lift: s * 3.4, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.55) {
    const stretch = Math.sin(t * 2.3);
    return {
      x: fromX + face * stretch * 0.1,
      lift: 3.4 + stretch * 1.4,
      rot: face * (12 + stretch * 9),
      anim: "play" as TrickAnim,
    };
  }
  if (u < 0.78) {
    const hush = Math.sin(t * 0.85);
    return {
      x: fromX,
      lift: 4.4 + Math.abs(hush) * 0.7,
      rot: face * (5 + hush * 3),
      anim: "play" as TrickAnim,
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

export function stepTrick(trick: SkinkTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "tailbluff" && trick.kind !== "litterdash" && trick.kind !== "tongueflick" && trick.kind !== "sunbask" && trick.kind !== "bluetail" && trick.kind !== "stonehush") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "plestiodon") {
    if (next.t < PLESTIODON_HOLD) {
      const pose = plestiodonPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < PLESTIODON_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - PLESTIODON_HOLD);
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
  if (next.kind === "tailbluff") {
    const pose = tailbluffPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "litterdash") {
    const pose = litterdashPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "tongueflick") {
    const pose = tongueflickPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "sunbask") {
    const pose = sunbaskPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "bluetail") {
    const pose = bluetailPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = stonehushPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

