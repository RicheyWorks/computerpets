/** Jewel ground tricks while idle — ultra-polish pass. House neighborly Calopterygidae / Calopteryx maculata Ebony Jewelwing desk life (jewelwing / Jewel) — jewelflick / creekpatrol / perchfan / ovipositdip / metallicwing / damselflick / calopteryxhush personality (jewelflick metallic wing-flick territorial flash without naming flash or glow or wing alone as wait, creekpatrol slow creek-territory hover patrol without naming hawking or hover or creek alone as wait, perchfan perched wing-fan open display without naming flutter or fan alone as wait, ovipositdip desk-safe abdomen dip cue without naming oviposit or tandem or dip alone as wait, metallicwing metallic wing sheen pulse without naming metal or wing alone as wait, damselflick damselfly body flick without naming damsel or flick alone as wait, long calopteryxhush Calopteryx jewelwing hush hold (THE calopteryxhush sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or asclepias or oyamel or plumose or lunule or densmilk or inkmilk or densdanaus or densghost or inkghost or densactias or hopskip or hindleap or deskbask or mandiblegraze or femurrasp or tympanal or saltatory or caeliferahush or densvault or inkvault or denscaelifera or leafstill or antennatick or tegminasong or leafwalk or tegminlift or greenmimic or tettigonihush or densblade or inkblade or denstettigonia or stridulate or antennasweep or burrowmouth or cerciflick or tegmenraise or gryllushush or denschirp or inkchirp or densgryllus or wingbanner or puddlesip or flutterhop or tailglidesettle or tornusflash or tigerband or papiliohush or densbanner or inkbanner or denspapilio or bury or flat or still or sit or walk or hop or spring or vault or jewel or jewelwing as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Banner swallowtail owns wingbanner/puddlesip/flutterhop/tailglidesettle/tornusflash/tigerband/papiliohush — do NOT reuse (Jewel owns jewelflick/creekpatrol/perchfan/ovipositdip/metallicwing/damselflick/calopteryxhush, not Banner); Milk monarch owns asclepias/oyamel — do NOT reuse; Ghost luna owns plumose/lunule — do NOT reuse; Comb honeybee owns proboscis/figure — do NOT reuse; Dart darner owns hawking/tandem — do NOT reuse; Spark firefly owns flash/glow — do NOT reuse; Stick owns oviposit — do NOT reuse (ovipositdip is fine, distinct); Fan flutter / Quill fan — do NOT reuse bare fan/flutter; Chirp owns hopskip/stridulate/gryllushush — do NOT reuse; Vault owns hindleap/deskbask/mandiblegraze/femurrasp/tympanal/saltatory/caeliferahush — do NOT reuse; Blade owns leafstill/tettigonihush — do NOT reuse; Lace lacewing next — do NOT reuse bare jewel/jewelwing; header forbids bare bury/flat/still/sit/wait and bare jewelwing/jewel as trick kinds; guest slug Jewel / key jewelwing only for wantsThankYou matching — accept "jewelwing" and "jewel"; do NOT accept bare "jewel" as a trick id; do NOT name a trick "jewelwing" or "jewel" or "swallowtail" or "banner" or "monarch" or "milk" or "luna" or "ghost" or "honeybee" or "comb" or "darner" or "dart" or "firefly" or "spark" or "grasshopper" or "vault" or "katydid" or "blade" or "field_cricket" or "chirp" or "lacewing" or "lace" or "wingbanner" or "puddlesip" or "flutterhop" or "tailglidesettle" or "tornusflash" or "tigerband" or "papiliohush" or "asclepias" or "oyamel" or "plumose" or "lunule" or "hopskip" or "hindleap" or "caeliferahush" or "densvault" or "densblade" or "denschirp" or "densbanner") — not Banner Papilio swallowtail life, not Milk Danaus monarch life, not Ghost Actias luna life, not Comb Apis honeybee life, not Dart Aeshnidae darner life, not Spark Lampyridae firefly life, not Vault Melanoplus grasshopper life, not Blade Tettigoniidae katydid life, not Chirp Gryllus field-cricket life, not Lace Neuroptera lacewing life (next guest), not Rui red_panda life. Jewelflick without naming flash alone, creekpatrol without naming hover alone, perchfan without naming fan alone, ovipositdip without naming oviposit alone, metallicwing without naming metal alone, damselflick without naming damsel alone, calopteryxhush long sit_hold on the Calopteryx jewelwing hush (THE calopteryxhush sit_hold tell); densjewel / inkjewel / denscalopteryx thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop jewelwing-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names hunt/sit/still/wait/walk/jewel as bare ethogram-only trick kinds. True Ebony Jewelwing Calopteryx maculata Calopterygidae desk life only — metallic wing flick, creek patrol, perch fan, oviposit dip, metallic wing sheen, damsel flick, and Calopteryx hush; distinct from Banner swallowtail wingbanner/puddlesip/flutterhop/tailglidesettle/tornusflash/tigerband/papiliohush, Milk monarch asclepias/oyamel, Ghost luna plumose/lunule, Comb honeybee, Dart darner hawking/tandem, Spark firefly flash/glow, Vault grasshopper hindleap/deskbask/mandiblegraze/femurrasp/tympanal/saltatory/caeliferahush, Blade katydid, Chirp cricket hopskip, Lace lacewing next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Lace / lacewing. No cry inventing — thank-yous are silent desk motion only; jewelwing.wav EXISTS so prefersHouseCry adds jewelwing after swallowtail. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "jewelwing";
export const TRICKS = ["jewelflick", "creekpatrol", "perchfan", "ovipositdip", "metallicwing", "damselflick", "calopteryxhush"] as const;
export const HAPPY = ["densjewel", "inkjewel", "denscalopteryx"] as const;
export type JewelwingTrickKind = (typeof TRICKS)[number];
export type JewelwingHappyKind = (typeof HAPPY)[number];
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

export type JewelwingTrick = {
  kind: JewelwingTrickKind;
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

export type JewelwingHappy = {
  kind: JewelwingHappyKind;
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

export const HAPPY_DUR = { densjewel: 1.70, inkjewel: 1.84, denscalopteryx: 1.76 } as const;
export const CALOPTERYXUSH_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  calopteryxhush: CALOPTERYXUSH_HOLD + RELEASE_S,
  jewelflick: 2.48,
  creekpatrol: 2.42,
  perchfan: 2.40,
  ovipositdip: 2.44,
  metallicwing: 2.38,
  damselflick: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: JewelwingTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "calopteryxhush") return 40 + roll * 26;
  if (kind === "metallicwing" || kind === "jewelflick" || kind === "ovipositdip") return 12.8 + roll * 9.4;
  if (kind === "perchfan" || kind === "creekpatrol" || kind === "damselflick") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: JewelwingTrickKind | string | null) {
  if (musicOn) return "calopteryxhush" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "calopteryxhush") {
    if (roll < 0.17) return "jewelflick" as const;
    if (roll < 0.33) return "creekpatrol" as const;
    if (roll < 0.49) return "perchfan" as const;
    if (roll < 0.65) return "ovipositdip" as const;
    if (roll < 0.83) return "metallicwing" as const;
    return "damselflick" as const;
  }
  if (lastKind === "jewelflick") {
    if (roll < 0.16) return "calopteryxhush" as const;
    if (roll < 0.32) return "creekpatrol" as const;
    if (roll < 0.48) return "perchfan" as const;
    if (roll < 0.64) return "ovipositdip" as const;
    if (roll < 0.82) return "metallicwing" as const;
    return "damselflick" as const;
  }
  if (lastKind === "creekpatrol") {
    if (roll < 0.14) return "calopteryxhush" as const;
    if (roll < 0.3) return "jewelflick" as const;
    if (roll < 0.46) return "perchfan" as const;
    if (roll < 0.62) return "ovipositdip" as const;
    if (roll < 0.8) return "metallicwing" as const;
    return "damselflick" as const;
  }
  if (lastKind === "perchfan") {
    if (roll < 0.15) return "calopteryxhush" as const;
    if (roll < 0.31) return "jewelflick" as const;
    if (roll < 0.47) return "creekpatrol" as const;
    if (roll < 0.63) return "ovipositdip" as const;
    if (roll < 0.81) return "metallicwing" as const;
    return "damselflick" as const;
  }
  if (lastKind === "ovipositdip") {
    if (roll < 0.16) return "calopteryxhush" as const;
    if (roll < 0.32) return "jewelflick" as const;
    if (roll < 0.48) return "creekpatrol" as const;
    if (roll < 0.64) return "perchfan" as const;
    if (roll < 0.82) return "metallicwing" as const;
    return "damselflick" as const;
  }
  if (lastKind === "metallicwing") {
    if (roll < 0.15) return "calopteryxhush" as const;
    if (roll < 0.31) return "jewelflick" as const;
    if (roll < 0.47) return "creekpatrol" as const;
    if (roll < 0.63) return "perchfan" as const;
    if (roll < 0.81) return "ovipositdip" as const;
    return "damselflick" as const;
  }
  if (lastKind === "damselflick") {
    if (roll < 0.16) return "calopteryxhush" as const;
    if (roll < 0.32) return "jewelflick" as const;
    if (roll < 0.48) return "creekpatrol" as const;
    if (roll < 0.64) return "perchfan" as const;
    if (roll < 0.82) return "ovipositdip" as const;
    return "metallicwing" as const;
  }
  if (roll < 0.14) return "calopteryxhush" as const;
  if (roll < 0.28) return "jewelflick" as const;
  if (roll < 0.42) return "creekpatrol" as const;
  if (roll < 0.56) return "perchfan" as const;
  if (roll < 0.7) return "ovipositdip" as const;
  if (roll < 0.85) return "metallicwing" as const;
  return "damselflick" as const;
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
  return key === TRICK_KEY || key === "jewel";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: JewelwingHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: JewelwingHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: JewelwingHappyKind | string, x: number, facing: 1 | -1): JewelwingHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as JewelwingHappyKind) : "densjewel";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densjewel" ? "sit" : name === "inkjewel" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densjewelPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densjewel));
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

export function inkjewelPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkjewel));
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

export function denscalopteryxPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: JewelwingHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densjewel") {
    const pose = densjewelPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkjewel") {
    const pose = inkjewelPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denscalopteryxPose(next.t);
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

export function beginTrick(kind: JewelwingTrickKind, x: number, facing: 1 | -1): JewelwingTrick {
  const anim: TrickAnim =
    kind === "calopteryxhush"
      ? "sit"
      : kind === "jewelflick"
        ? "play"
        : kind === "damselflick"
          ? "talk"
          : kind === "creekpatrol"
            ? "walk"
            : kind === "perchfan"
              ? "sit"
              : kind === "ovipositdip"
                ? "play"
                : kind === "metallicwing"
                  ? "walk"
                  : "sit";
  return {
    kind,
    phase: kind === "calopteryxhush" ? "hold" : "go",
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

export function calopteryxhushPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function jewelflickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.jewelflick));
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

export function creekpatrolPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.creekpatrol));
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

export function perchfanPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.perchfan));
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

export function ovipositdipPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.ovipositdip));
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

export function metallicwingPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.metallicwing));
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

export function damselflickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.damselflick));
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

export function stepTrick(trick: JewelwingTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "jewelflick" &&
    trick.kind !== "creekpatrol" &&
    trick.kind !== "perchfan" &&
    trick.kind !== "ovipositdip" &&
    trick.kind !== "metallicwing" &&
    trick.kind !== "damselflick"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "calopteryxhush") {
    if (next.t < CALOPTERYXUSH_HOLD) {
      const pose = calopteryxhushPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < CALOPTERYXUSH_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - CALOPTERYXUSH_HOLD);
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
  if (next.kind === "jewelflick") {
    const pose = jewelflickPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "creekpatrol") {
    const pose = creekpatrolPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "perchfan") {
    const pose = perchfanPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "ovipositdip") {
    const pose = ovipositdipPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "metallicwing") {
    const pose = metallicwingPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = damselflickPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
