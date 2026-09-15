/** Hop ground tricks while idle — ultra-polish pass. House neighborly Collembola / Orchesella Springtail furcula desk life (springtail / Hop) — furculaflick / antennawalk / moistclingsoil / foldtuck / collophore / denspring / orchesella personality (furculaflick furcula jump launch without naming jump or leap or spring or hop or bounce or flick or launch or vault alone as wait, antennawalk feeler walk without naming walk or crawl or march or feel or antenna or tap or probe or scan or sniff — Haste owns antennaflick, antennawalk ok, moistclingsoil damp litter soil cling without naming cling or moist or damp or soil or litter or grip or stick or hold or wet, foldtuck furcula tuck rest without naming tuck or fold or rest or crouch or curl or sit or hush or wait alone, collophore ventral tube drink-cling tell without naming tube or drink or wet or cling or ventral or suck or sip alone — Sip hummingbird owns bare sip, collophore ok, denspring dens furcula spring coil tell without naming dens or spring or coil or vault or hop or bounce alone, long orchesella Orchesella Collembola springtail hush hold (THE orchesella sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or slimejet or lobopod or antennawhip or preyharpoon or oralpapilla or onychophore or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or clitellum or setaebrace or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or leafhush or cast or crawl or still or roll or walk or sit or hop or spring or vault or earthworm or pillbug or armor or millipede or link or house_centipede or haste or velvet_worm or jet or springtail as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Jet owns slimejet/lobopod/antennawhip/preyharpoon/oralpapilla/onychophore/peripatus — do NOT reuse; Cast owns peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris — do NOT reuse; Vault grasshopper later owns vault — do NOT reuse bare hop/spring/vault; Haste owns antennaflick — antennawalk ok; Sip owns bare sip — collophore ok; header forbids springtail/hop/vault/spring/jet/cast/crawl/still/roll/walk/sit; guest slug Hop / key springtail only for isKey matching — accept "springtail" and "hop"; do NOT name a trick "springtail" or "hop" or "velvet_worm" or "jet" or "earthworm" or "cast" or "pillbug" or "armor" or "millipede" or "link" or "house_centipede" or "haste" or "vault" or "spring") — not Jet Peripatus velvet-worm/Onychophora life, not Cast Lumbricus earthworm/Annelida life, not Armor Armadillidium pillbug/Isopoda life, not Link Narceus millipede/Diplopoda life, not Haste Scutigera house-centipede/Chilopoda life, not Vault grasshopper Orthoptera life later, not Tun tardigrade (cryptotun/clawamble/mosssip/waterbearroll/styletpierce/anhydro/eutardigrada), not Rui red_panda life. Furculaflick without naming hop alone, antennawalk without naming antennaflick alone, moistclingsoil without naming cling alone, foldtuck without naming tuck alone, collophore without naming sip alone, denspring without naming spring alone, orchesella long sit_hold on the Orchesella hush (THE orchesella sit_hold tell); denshop / inkhop / densfurcula thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop springtail-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names hop/walk/still/wait/sit/springtail as bare ethogram-only trick kinds. True Springtail Orchesella Collembola desk life only — furcula jump launch with feeler walk, damp litter cling, furcula tuck, ventral collophore drink-cling, dens spring coil, and Orchesella hush; distinct from Jet velvet worm/Onychophora slime-jet, Cast earthworm/Annelida peristalsis, Armor pillbug/Isopoda ball-roll, Link millipede/Diplopoda spiral, Haste house centipede/Chilopoda predator, Vault grasshopper later, Tun tardigrade next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Half / planarian. No cry inventing — thank-yous are silent desk motion only; springtail.wav EXISTS so prefersHouseCry adds springtail after velvet_worm. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "springtail";
export const TRICKS = ["furculaflick", "antennawalk", "moistclingsoil", "foldtuck", "collophore", "denspring", "orchesella"] as const;
export const HAPPY = ["denshop", "inkhop", "densfurcula"] as const;
export type SpringtailTrickKind = (typeof TRICKS)[number];
export type SpringtailHappyKind = (typeof HAPPY)[number];
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

export type SpringtailTrick = {
  kind: SpringtailTrickKind;
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

export type SpringtailHappy = {
  kind: SpringtailHappyKind;
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

export const HAPPY_DUR = { denshop: 1.70, inkhop: 1.84, densfurcula: 1.76 } as const;
export const ORCHESELLA_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  orchesella: ORCHESELLA_HOLD + RELEASE_S,
  furculaflick: 2.48,
  antennawalk: 2.42,
  moistclingsoil: 2.40,
  foldtuck: 2.44,
  collophore: 2.38,
  denspring: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: SpringtailTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "orchesella") return 40 + roll * 26;
  if (kind === "collophore" || kind === "antennawalk" || kind === "furculaflick") return 12.8 + roll * 9.4;
  if (kind === "moistclingsoil" || kind === "foldtuck" || kind === "denspring") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: SpringtailTrickKind | string | null) {
  if (musicOn) return "orchesella" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "orchesella") {
    if (roll < 0.17) return "furculaflick" as const;
    if (roll < 0.33) return "antennawalk" as const;
    if (roll < 0.49) return "moistclingsoil" as const;
    if (roll < 0.65) return "foldtuck" as const;
    if (roll < 0.83) return "collophore" as const;
    return "denspring" as const;
  }
  if (lastKind === "furculaflick") {
    if (roll < 0.16) return "orchesella" as const;
    if (roll < 0.32) return "antennawalk" as const;
    if (roll < 0.48) return "moistclingsoil" as const;
    if (roll < 0.64) return "foldtuck" as const;
    if (roll < 0.82) return "collophore" as const;
    return "denspring" as const;
  }
  if (lastKind === "antennawalk") {
    if (roll < 0.14) return "orchesella" as const;
    if (roll < 0.3) return "furculaflick" as const;
    if (roll < 0.46) return "moistclingsoil" as const;
    if (roll < 0.62) return "foldtuck" as const;
    if (roll < 0.8) return "collophore" as const;
    return "denspring" as const;
  }
  if (lastKind === "moistclingsoil") {
    if (roll < 0.15) return "orchesella" as const;
    if (roll < 0.31) return "furculaflick" as const;
    if (roll < 0.47) return "antennawalk" as const;
    if (roll < 0.63) return "foldtuck" as const;
    if (roll < 0.81) return "collophore" as const;
    return "denspring" as const;
  }
  if (lastKind === "foldtuck") {
    if (roll < 0.16) return "orchesella" as const;
    if (roll < 0.32) return "furculaflick" as const;
    if (roll < 0.48) return "antennawalk" as const;
    if (roll < 0.64) return "moistclingsoil" as const;
    if (roll < 0.82) return "collophore" as const;
    return "denspring" as const;
  }
  if (lastKind === "collophore") {
    if (roll < 0.15) return "orchesella" as const;
    if (roll < 0.31) return "furculaflick" as const;
    if (roll < 0.47) return "antennawalk" as const;
    if (roll < 0.63) return "moistclingsoil" as const;
    if (roll < 0.81) return "foldtuck" as const;
    return "denspring" as const;
  }
  if (lastKind === "denspring") {
    if (roll < 0.16) return "orchesella" as const;
    if (roll < 0.32) return "furculaflick" as const;
    if (roll < 0.48) return "antennawalk" as const;
    if (roll < 0.64) return "moistclingsoil" as const;
    if (roll < 0.82) return "foldtuck" as const;
    return "collophore" as const;
  }
  if (roll < 0.14) return "orchesella" as const;
  if (roll < 0.28) return "furculaflick" as const;
  if (roll < 0.42) return "antennawalk" as const;
  if (roll < 0.56) return "moistclingsoil" as const;
  if (roll < 0.7) return "foldtuck" as const;
  if (roll < 0.85) return "collophore" as const;
  return "denspring" as const;
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
  return key === TRICK_KEY || key === "hop";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: SpringtailHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: SpringtailHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: SpringtailHappyKind | string, x: number, facing: 1 | -1): SpringtailHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as SpringtailHappyKind) : "denshop";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denshop" ? "sit" : name === "inkhop" ? "play" : "sit") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denshopPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denshop));
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

export function inkhopPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkhop));
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

export function densfurculaPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: SpringtailHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denshop") {
    const pose = denshopPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkhop") {
    const pose = inkhopPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densfurculaPose(next.t);
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

export function beginTrick(kind: SpringtailTrickKind, x: number, facing: 1 | -1): SpringtailTrick {
  const anim: TrickAnim =
    kind === "orchesella"
      ? "sit"
      : kind === "furculaflick"
        ? "play"
        : kind === "denspring"
          ? "play"
          : kind === "antennawalk"
            ? "talk"
            : kind === "moistclingsoil"
              ? "sit"
              : kind === "foldtuck"
                ? "sit"
                : kind === "collophore"
                  ? "talk"
                  : "sit";
  return {
    kind,
    phase: kind === "orchesella" ? "hold" : "go",
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

export function orchesellaPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function furculaflickPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.furculaflick));
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

export function antennawalkPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.antennawalk));
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

export function moistclingsoilPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.moistclingsoil));
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

export function foldtuckPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.foldtuck));
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

export function collophorePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.collophore));
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

export function denspringPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.denspring));
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

export function stepTrick(trick: SpringtailTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "furculaflick" &&
    trick.kind !== "antennawalk" &&
    trick.kind !== "moistclingsoil" &&
    trick.kind !== "foldtuck" &&
    trick.kind !== "collophore" &&
    trick.kind !== "denspring"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "orchesella") {
    if (next.t < ORCHESELLA_HOLD) {
      const pose = orchesellaPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ORCHESELLA_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ORCHESELLA_HOLD);
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
  if (next.kind === "furculaflick") {
    const pose = furculaflickPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "antennawalk") {
    const pose = antennawalkPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "moistclingsoil") {
    const pose = moistclingsoilPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "foldtuck") {
    const pose = foldtuckPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "collophore") {
    const pose = collophorePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = denspringPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
