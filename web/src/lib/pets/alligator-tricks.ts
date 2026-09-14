/** Levee ground tricks while idle — ultra-polish pass. House neighborly Alligatoridae / Alligator mississippiensis American Alligator bank-dish desk life (alligator / Levee) — bellowbank / deathcoil / snoutspy / baskgape / osteoderm / scutehush / mississippi personality (bellowbank infrasound bank bellow without naming bellow or bank or roar or growl or vocal or throat or sound or call or rumble or infra or boom or chorus alone, deathcoil death-roll coil posture without naming death or coil or roll or spin or twist or thrash or prey or kill or shake or tumble or rotate or torque or deathroll alone, snoutspy snout spy-hop without naming snout or spy or hop or nose or nostril or surface or peek or tip or lift or float or breathe or periscope alone, baskgape bask gape without naming bask or gape or yawn or mouth or jaw or sun or heat or therm or open or tooth or grin or smile alone, osteoderm osteoderm armor plate flex without naming osteoderm or armor or plate or bone or scute or dermal or shield or ridge alone, scutehush dorsal scute hush settle without naming scute or hush or dorsal or sit or rest or lounge or nap or loaf alone, long mississippi Alligator mississippiensis bank-calm scute hush hold (THE mississippi sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or bloodsquirt or antfeast or freezeflat or rainharvest or coronal or sandhush or phrynosoma or denspike or inkspike or denscorona or veilflush or turretgaze or tongueshot or branchrock or casque or zygodactyl or calyptratus or denshift or inkshift or denscasque or tailbluff or litterdash or tongueflick or sunbask or bluetail or stonehush or plestiodon or dewlapflash or pushupshow or hueshift or preyinch or nuchal or vinehush or anolis or toepadcling or vocalclick or lickeye or mothstalk or setae or lamphush or hemidactylus or mudwallow or sedgecrop or alarmwhistle or pilelean or hydrochoerus or bipedrise or clawscar or berrypluck or denscrape or ursus or toothclack or boleclimb or cambiumchew or dorsoflare or erethizon or woodfell or paddleclap or lodgehaul or mudpack or castor or stillfeign or scrapnose or gapegrin or raftergrip or didelphis or footstomp or duffgrub or handwarn or plumeaim or mephitis or pawdouse or litterdig or rearstand or maskpeer or procyon or bellyglide or corkroll or shellcrunch or whiskernudge or lontra or nutbury or sciurus or popcorn or rumble or hay or potato or zig or soak or tuck or crane or plod or paddle or wingwrap or eptesicus or flagtail or odocoileus or promenade or oil or dab or tip or drum or sip or hover or curl or snuffle or anoint or bristle or root or quote or strut or fan or crack or flash or nictitate or gular or tympanum or frog or reed as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play FLASH unchanged if already fine; Spike owns bloodsquirt/antfeast/freezeflat/rainharvest/coronal/sandhush/phrynosoma; Shift owns veilflush/turretgaze/tongueshot/branchrock/casque/zygodactyl/calyptratus; Dash owns tailbluff/litterdash/tongueflick/sunbask/bluetail/stonehush/plestiodon; Wink owns dewlapflash/pushupshow/hueshift/preyinch/nuchal/vinehush/anolis; Pad owns toepadcling/vocalclick/lickeye/mothstalk/setae/lamphush/hemidactylus; Reed/frog owns nictitate/gular/tympanum — do NOT reuse nictitate; Jaw/crocodile next — leave crocodylus/acutus/show words free; Door moray / Hide grouper — keep alligator-true; guest slug Levee / key alligator only for isKey matching — accept "alligator" and "levee"; do NOT name a trick "alligator" or "levee" or "crocodile" or "jaw" or "crocodylus" or "acutus" or "deathroll" or "horned_lizard" or "spike" or "phrynosoma" or "chameleon" or "calyptratus" or "veiled" or "skink" or "plestiodon" or "anole" or "anolis" or "gecko" or "hemidactylus" or "bask" or "bank" or "close" or "still" or "flash") — not Spike horned-lizard life, not Jaw crocodile life, not Shift chameleon life, not Dash skink life, not Reed frog life, not Rui red_panda life. Bellowbank bank bellow without naming bellow alone, deathcoil death-coil without naming deathroll alone, snoutspy snout-spy without naming snout alone, baskgape bask-gape without naming bask alone, osteoderm osteoderm flex without naming armor alone, scutehush scute-hush without naming scute alone, mississippi long sit_hold on the bank dish (THE mississippi sit_hold tell); denslevee / inklevee / densscute thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop alligator-tricks.js. Window-play FLASH unchanged. Ethogram softs + freeze — never names bask/bank/close/alligator as bare ethogram-only trick kinds. True Alligator mississippiensis Alligatoridae American Alligator desk life only — distinct from Spike, Jaw, Shift, Dash, Wink, Pad, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Dam, Whee, Slick, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Jaw / crocodile. No cry inventing — thank-yous are silent desk motion only; prefersHouseCry alligator (alligator.wav on disk). Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "alligator";
export const TRICKS = ["bellowbank", "deathcoil", "snoutspy", "baskgape", "osteoderm", "scutehush", "mississippi"] as const;
export const HAPPY = ["denslevee", "inklevee", "densscute"] as const;
export type AlligatorTrickKind = (typeof TRICKS)[number];
export type AlligatorHappyKind = (typeof HAPPY)[number];
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

export type AlligatorTrick = {
  kind: AlligatorTrickKind;
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

export type AlligatorHappy = {
  kind: AlligatorHappyKind;
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

export const HAPPY_DUR = { denslevee: 1.70, inklevee: 1.84, densscute: 1.76 } as const;
export const MISSISSIPPI_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  mississippi: MISSISSIPPI_HOLD + RELEASE_S,
  bellowbank: 2.48,
  deathcoil: 2.42,
  snoutspy: 2.56,
  baskgape: 2.44,
  osteoderm: 2.40,
  scutehush: 2.38,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: AlligatorTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "mississippi") return 40 + roll * 26;
  if (kind === "osteoderm" || kind === "scutehush" || kind === "bellowbank") return 12.8 + roll * 9.4;
  if (kind === "deathcoil" || kind === "snoutspy" || kind === "baskgape") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: AlligatorTrickKind | string | null) {
  if (musicOn) return "mississippi" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "mississippi") {
    if (roll < 0.17) return "bellowbank" as const;
    if (roll < 0.33) return "deathcoil" as const;
    if (roll < 0.49) return "snoutspy" as const;
    if (roll < 0.65) return "baskgape" as const;
    if (roll < 0.83) return "osteoderm" as const;
    return "scutehush" as const;
  }
  if (lastKind === "bellowbank") {
    if (roll < 0.16) return "mississippi" as const;
    if (roll < 0.32) return "deathcoil" as const;
    if (roll < 0.48) return "snoutspy" as const;
    if (roll < 0.64) return "baskgape" as const;
    if (roll < 0.82) return "osteoderm" as const;
    return "scutehush" as const;
  }
  if (lastKind === "deathcoil") {
    if (roll < 0.14) return "mississippi" as const;
    if (roll < 0.3) return "bellowbank" as const;
    if (roll < 0.46) return "snoutspy" as const;
    if (roll < 0.62) return "baskgape" as const;
    if (roll < 0.8) return "osteoderm" as const;
    return "scutehush" as const;
  }
  if (lastKind === "osteoderm" || lastKind === "scutehush") {
    if (roll < 0.14) return "mississippi" as const;
    if (roll < 0.3) return "bellowbank" as const;
    if (roll < 0.46) return "deathcoil" as const;
    if (roll < 0.62) return "snoutspy" as const;
    if (roll < 0.78) return "baskgape" as const;
    return lastKind === "osteoderm" ? ("scutehush" as const) : ("osteoderm" as const);
  }
  if (roll < 0.14) return "mississippi" as const;
  if (roll < 0.28) return "bellowbank" as const;
  if (roll < 0.42) return "deathcoil" as const;
  if (roll < 0.56) return "snoutspy" as const;
  if (roll < 0.7) return "baskgape" as const;
  if (roll < 0.85) return "osteoderm" as const;
  return "scutehush" as const;
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
  return key === TRICK_KEY || key === "levee";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: AlligatorHappyKind | string | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags,
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind as AlligatorHappyKind | null | undefined);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: AlligatorHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: AlligatorHappyKind | string, x: number, facing: 1 | -1): AlligatorHappy {
  const name = (HAPPY as readonly string[]).indexOf(kind) >= 0 ? (kind as AlligatorHappyKind) : "denslevee";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x: x,
    lift: 0,
    rot: 0,
    anim: name === "denslevee" ? "sit" : name === "inklevee" ? "play" : "sit",
    facing: facing == null ? 1 : facing,
    fromX: x,
  };
}

export function densleveePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denslevee));
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

export function inkleveePose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inklevee));
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

export function densscutePose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: AlligatorHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denslevee") {
    const pose = densleveePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inklevee") {
    const pose = inkleveePose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densscutePose(next.t);
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

export function beginTrick(kind: AlligatorTrickKind, x: number, facing: 1 | -1): AlligatorTrick {
  const anim: TrickAnim =
    kind === "mississippi"
      ? "sit"
      : kind === "bellowbank"
        ? "talk"
        : kind === "deathcoil"
          ? "play"
          : kind === "snoutspy"
            ? "play"
            : kind === "baskgape"
              ? "sit"
              : kind === "osteoderm"
                ? "sit"
                : kind === "scutehush"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "mississippi" ? "hold" : "go",
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

export function mississippiPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function bellowbankPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.bellowbank));
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

export function deathcoilPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.deathcoil));
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

export function snoutspyPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.snoutspy));
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

export function baskgapePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.baskgape));
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

export function osteodermPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.osteoderm));
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

export function scutehushPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.scutehush));
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

export function stepTrick(trick: AlligatorTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (shouldAbort(flags) && trick.kind !== "bellowbank" && trick.kind !== "deathcoil" && trick.kind !== "snoutspy" && trick.kind !== "baskgape" && trick.kind !== "osteoderm" && trick.kind !== "scutehush") {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "mississippi") {
    if (next.t < MISSISSIPPI_HOLD) {
      const pose = mississippiPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < MISSISSIPPI_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - MISSISSIPPI_HOLD);
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
  if (next.kind === "bellowbank") {
    const pose = bellowbankPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "deathcoil") {
    const pose = deathcoilPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "snoutspy") {
    const pose = snoutspyPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "baskgape") {
    const pose = baskgapePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "osteoderm") {
    const pose = osteodermPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = scutehushPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}

