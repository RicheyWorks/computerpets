/** Tun ground tricks while idle — ultra-polish pass. House neighborly Eutardigrada / Tardigrada Water Bear cryptobiosis desk life (tardigrade / Tun) — cryptotun / clawamble / mosssip / waterbearroll / styletpierce / anhydro / eutardigrada personality (cryptotun tun-ball cryptobiosis settle without naming tun or barrel or dry or curl or ball or roll or crypt or sleep alone as wait, clawamble stub claw walk on moss film without naming claw or walk or moss or amble or march or grip or cling or latch, mosssip stylet moss suck without naming sip or suck or stylet or moss or pierce or feed or drink or probe alone — Sip hummingbird owns bare sip, mosssip ok, waterbearroll plump roll amble without naming roll or plump or amble or tumble or ball or barrel or curl alone as wait, styletpierce buccal stylet pierce tell without naming pierce or stylet or buccal or spear or stab or feed alone — header bans styletprobe, styletpierce ok, anhydro anhydrobiosis dry-down settle without naming dry or anhydrobiosis or desiccate or dormant or sleep or hush alone as wait, long eutardigrada Eutardigrada Tardigrada water bear hush hold (THE eutardigrada sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or furculaflick or antennawalk or moistclingsoil or foldtuck or collophore or denspring or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or oralpapilla or onychophore or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or clitellum or setaebrace or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or benzoquinone or metachronal or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or leafhush or cast or crawl or still or roll or walk or sit or hop or spring or vault or earthworm or pillbug or armor or millipede or link or house_centipede or haste or velvet_worm or jet or springtail or tardigrade or tun as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Hop owns furculaflick/antennawalk/moistclingsoil/foldtuck/collophore/denspring/orchesella — do NOT reuse; Jet owns slimejet/lobopod/antennawhip/preyharpoon/oralpapilla/onychophore/peripatus — do NOT reuse; Cast owns peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris — do NOT reuse; header forbids tunstate/clawgrip/mossfilm/styletprobe/hypsibius and bare tardigrade/tun; guest slug Tun / key tardigrade only for isKey matching — accept "tardigrade" and "tun"; do NOT name a trick "tardigrade" or "tun" or "springtail" or "hop" or "velvet_worm" or "jet" or "earthworm" or "cast" or "pillbug" or "armor" or "millipede" or "link" or "house_centipede" or "haste" or "vault" or "spring") — not Hop Orchesella springtail/Collembola life, not Jet Peripatus velvet-worm/Onychophora life, not Cast Lumbricus earthworm/Annelida life, not Armor Armadillidium pillbug/Isopoda life, not Link Narceus millipede/Diplopoda life, not Haste Scutigera house-centipede/Chilopoda life, not Half Dugesia planarian next, not Rui red_panda life. Cryptotun without naming tun alone, clawamble without naming claw alone, mosssip without naming sip alone, waterbearroll without naming roll alone, styletpierce without naming styletprobe alone, anhydro without naming dry alone, eutardigrada long sit_hold on the Eutardigrada hush (THE eutardigrada sit_hold tell); denstun / inktun / densclaw thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop tardigrade-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names tun/walk/still/wait/sit/tardigrade as bare ethogram-only trick kinds. True Water Bear Eutardigrada Tardigrada desk life only — tun cryptobiosis barrel with stub claw walk, stylet moss suck, plump roll, stylet pierce, anhydrobiosis dry-down, and Eutardigrada hush; distinct from Hop springtail/Collembola furcula leap, Jet velvet worm/Onychophora slime-jet, Cast earthworm/Annelida peristalsis, Armor pillbug/Isopoda ball-roll, Link millipede/Diplopoda spiral, Haste house centipede/Chilopoda predator, Half planarian next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Half / planarian. No cry inventing — thank-yous are silent desk motion only; tardigrade.wav EXISTS so prefersHouseCry adds tardigrade after springtail. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "tardigrade";
export const TRICKS = ["cryptotun", "clawamble", "mosssip", "waterbearroll", "styletpierce", "anhydro", "eutardigrada"] as const;
export const HAPPY = ["denstun", "inktun", "densclaw"] as const;
export type TardigradeTrickKind = (typeof TRICKS)[number];
export type TardigradeHappyKind = (typeof HAPPY)[number];
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

export type TardigradeTrick = {
  kind: TardigradeTrickKind;
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

export type TardigradeHappy = {
  kind: TardigradeHappyKind;
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

export const HAPPY_DUR = { denstun: 1.70, inktun: 1.84, densclaw: 1.76 } as const;
export const EUTARDIGRADA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  eutardigrada: EUTARDIGRADA_HOLD + RELEASE_S,
  cryptotun: 2.48,
  clawamble: 2.42,
  mosssip: 2.40,
  waterbearroll: 2.44,
  styletpierce: 2.38,
  anhydro: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: TardigradeTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "eutardigrada") return 40 + roll * 26;
  if (kind === "styletpierce" || kind === "clawamble" || kind === "cryptotun") return 12.8 + roll * 9.4;
  if (kind === "mosssip" || kind === "waterbearroll" || kind === "anhydro") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: TardigradeTrickKind | string | null) {
  if (musicOn) return "eutardigrada" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "eutardigrada") {
    if (roll < 0.17) return "cryptotun" as const;
    if (roll < 0.33) return "clawamble" as const;
    if (roll < 0.49) return "mosssip" as const;
    if (roll < 0.65) return "waterbearroll" as const;
    if (roll < 0.83) return "styletpierce" as const;
    return "anhydro" as const;
  }
  if (lastKind === "cryptotun") {
    if (roll < 0.16) return "eutardigrada" as const;
    if (roll < 0.32) return "clawamble" as const;
    if (roll < 0.48) return "mosssip" as const;
    if (roll < 0.64) return "waterbearroll" as const;
    if (roll < 0.82) return "styletpierce" as const;
    return "anhydro" as const;
  }
  if (lastKind === "clawamble") {
    if (roll < 0.14) return "eutardigrada" as const;
    if (roll < 0.3) return "cryptotun" as const;
    if (roll < 0.46) return "mosssip" as const;
    if (roll < 0.62) return "waterbearroll" as const;
    if (roll < 0.8) return "styletpierce" as const;
    return "anhydro" as const;
  }
  if (lastKind === "mosssip") {
    if (roll < 0.15) return "eutardigrada" as const;
    if (roll < 0.31) return "cryptotun" as const;
    if (roll < 0.47) return "clawamble" as const;
    if (roll < 0.63) return "waterbearroll" as const;
    if (roll < 0.81) return "styletpierce" as const;
    return "anhydro" as const;
  }
  if (lastKind === "waterbearroll") {
    if (roll < 0.16) return "eutardigrada" as const;
    if (roll < 0.32) return "cryptotun" as const;
    if (roll < 0.48) return "clawamble" as const;
    if (roll < 0.64) return "mosssip" as const;
    if (roll < 0.82) return "styletpierce" as const;
    return "anhydro" as const;
  }
  if (lastKind === "styletpierce") {
    if (roll < 0.15) return "eutardigrada" as const;
    if (roll < 0.31) return "cryptotun" as const;
    if (roll < 0.47) return "clawamble" as const;
    if (roll < 0.63) return "mosssip" as const;
    if (roll < 0.81) return "waterbearroll" as const;
    return "anhydro" as const;
  }
  if (lastKind === "anhydro") {
    if (roll < 0.16) return "eutardigrada" as const;
    if (roll < 0.32) return "cryptotun" as const;
    if (roll < 0.48) return "clawamble" as const;
    if (roll < 0.64) return "mosssip" as const;
    if (roll < 0.82) return "waterbearroll" as const;
    return "styletpierce" as const;
  }
  if (roll < 0.14) return "eutardigrada" as const;
  if (roll < 0.28) return "cryptotun" as const;
  if (roll < 0.42) return "clawamble" as const;
  if (roll < 0.56) return "mosssip" as const;
  if (roll < 0.7) return "waterbearroll" as const;
  if (roll < 0.85) return "styletpierce" as const;
  return "anhydro" as const;
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
  return key === TRICK_KEY || key === "tun";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: TardigradeHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: TardigradeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: TardigradeHappyKind | string, x: number, facing: 1 | -1): TardigradeHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as TardigradeHappyKind) : "denstun";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denstun" ? "sit" : name === "inktun" ? "play" : "sit") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denstunPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denstun));
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

export function inktunPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inktun));
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

export function densclawPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: TardigradeHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denstun") {
    const pose = denstunPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inktun") {
    const pose = inktunPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densclawPose(next.t);
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

export function beginTrick(kind: TardigradeTrickKind, x: number, facing: 1 | -1): TardigradeTrick {
  const anim: TrickAnim =
    kind === "eutardigrada"
      ? "sit"
      : kind === "cryptotun"
        ? "sit"
        : kind === "anhydro"
          ? "play"
          : kind === "clawamble"
            ? "talk"
            : kind === "mosssip"
              ? "sit"
              : kind === "waterbearroll"
                ? "sit"
                : kind === "styletpierce"
                  ? "talk"
                  : "sit";
  return {
    kind,
    phase: kind === "eutardigrada" ? "hold" : "go",
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

export function eutardigradaPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function cryptotunPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.cryptotun));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.8, lift: s * 3.0, rot: s * -12 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const bar = Math.sin(t * 2.4);
    return {
      x: fromX + face * (0.8 + bar * 0.16),
      lift: 2.8 + Math.abs(bar) * 1.5,
      rot: face * (-12 + bar * 10),
      anim: "sit" as TrickAnim,
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

export function clawamblePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clawamble));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "talk" as TrickAnim,
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

export function mosssipPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.mosssip));
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

export function waterbearrollPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.waterbearroll));
  const face = facing == null ? 1 : facing;
  if (u < 0.1) {
    const s = smoothstep(u / 0.1);
    return { x: fromX + face * s * 1.0, lift: s * 4.0, rot: s * 18 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.8) {
    const thrash = Math.sin(t * 3.6);
    return {
      x: fromX + face * (1.0 + thrash * 0.22),
      lift: 3.6 + Math.abs(thrash) * 2.0,
      rot: face * (18 + thrash * 14),
      anim: "sit" as TrickAnim,
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

export function styletpiercePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.styletpierce));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "talk" as TrickAnim,
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

export function anhydroPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.anhydro));
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

export function stepTrick(trick: TardigradeTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "cryptotun" &&
    trick.kind !== "clawamble" &&
    trick.kind !== "mosssip" &&
    trick.kind !== "waterbearroll" &&
    trick.kind !== "styletpierce" &&
    trick.kind !== "anhydro"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "eutardigrada") {
    if (next.t < EUTARDIGRADA_HOLD) {
      const pose = eutardigradaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < EUTARDIGRADA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - EUTARDIGRADA_HOLD);
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
  if (next.kind === "cryptotun") {
    const pose = cryptotunPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "clawamble") {
    const pose = clawamblePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "mosssip") {
    const pose = mosssipPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "waterbearroll") {
    const pose = waterbearrollPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "styletpierce") {
    const pose = styletpiercePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = anhydroPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
