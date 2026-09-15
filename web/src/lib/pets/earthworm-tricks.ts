/** Cast ground tricks while idle — ultra-polish pass. House neighborly Annelida / Lumbricus terrestris Common Earthworm soil desk life (earthworm / Cast) — peristalse / castheap / surfacerise / soilanchor / clitellum / setaebrace / terrestris personality (peristalse peristaltic body-wave crawl without naming wave or crawl or wriggle or slither or undulate or coil or curl or ball or roll or spiral alone, castheap castings heap push without naming cast or heap or pile or dirt or soil or dung or fertilizer or mulch or compost or feed or eat alone, surfacerise night surface rise without naming night or surface or rise or emerge or crawl or climb or dawn or dusk or moon alone, soilanchor setae soil-anchor brace without naming setae or anchor or brace or cling or grip or hold or dirt or soil or burrow or dig alone, clitellum clitellum saddle swell tell without naming clitellum or saddle or band or swell or ring or segment or girdle or mate alone, setaebrace setae brace press tell without naming setae or brace or seta or hair or grip or cling or pad alone — Pad gecko owns bare setae, do NOT reuse bare setae, long terrestris Lumbricus terrestris Annelida common earthworm nightcrawler hush hold (THE terrestris sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or slimejet or lobopod or antennawhip or preyharpoon or peripatus or densjet or inkjet or denslobo or cast or crawl or still or roll or walk or sit or earthworm or pillbug or armor or millipede or link or house_centipede or haste or velvet_worm or jet as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play STRIKE unchanged if already fine; Armor owns conglobate/volvation/antennafeel/detritusnip/pleopods/uropodtap/vulgare — do NOT reuse; Pad owns bare setae — setaebrace ok; Round owns undulglide; Cicada owns bare cast; Octopus owns bare jet; Jet velvet_worm next — leave slimejet/lobopod/antennawhip/preyharpoon/peripatus free; header forbids cast/crawl/still/roll/walk/sit/setae/slimejet; guest slug Cast / key earthworm only for isKey matching — accept "earthworm" and "cast"; do NOT name a trick "earthworm" or "cast" or "pillbug" or "armor" or "millipede" or "link" or "house_centipede" or "haste" or "velvet_worm" or "jet" or "setae" or "crawl" or "still" or "roll" or "walk") — not Armor Armadillidium pillbug/Isopoda life, not Link Narceus millipede/Diplopoda life, not Haste Scutigera house-centipede/Chilopoda life, not Jet Peripatus velvet-worm/Onychophora next, not Pad Hemidactylus gecko setae life, not Rui red_panda life. Peristalse wave without naming crawl alone, castheap castings without naming cast alone, surfacerise night-rise without naming rise alone, soilanchor soil brace without naming setae alone, clitellum saddle without naming band alone, setaebrace setae brace without naming setae alone, terrestris long sit_hold on the Lumbricus hush (THE terrestris sit_hold tell); denscast / inkcast / densclit thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop earthworm-tricks.js. Window-play STRIKE unchanged. Ethogram softs + freeze — never names cast/crawl/still/wait/sit/earthworm as bare ethogram-only trick kinds. True Common Earthworm Lumbricus terrestris Annelida desk life only — soft peristaltic crawler that pushes castings, rises at night, braces with setae, shows a clitellum saddle, and settles in the soil hush; distinct from Armor pillbug/Isopoda ball-roll, Link millipede/Diplopoda spiral, Haste house centipede/Chilopoda predator, Jet velvet worm done, Pad gecko setae, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Jet / velvet_worm ultra done (slimejet/lobopod/antennawhip/preyharpoon/oralpapilla/onychophore/peripatus). Hop / springtail ultra done (furculaflick/antennawalk/moistclingsoil/foldtuck/collophore/denspring/orchesella). Next house-order ultra: Tun / tardigrade. No cry inventing — thank-yous are silent desk motion only; earthworm.wav EXISTS so prefersHouseCry adds earthworm after pillbug. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "earthworm";
export const TRICKS = ["peristalse", "castheap", "surfacerise", "soilanchor", "clitellum", "setaebrace", "terrestris"] as const;
export const HAPPY = ["denscast", "inkcast", "densclit"] as const;
export type EarthwormTrickKind = (typeof TRICKS)[number];
export type EarthwormHappyKind = (typeof HAPPY)[number];
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

export type EarthwormTrick = {
  kind: EarthwormTrickKind;
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

export type EarthwormHappy = {
  kind: EarthwormHappyKind;
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

export const HAPPY_DUR = { denscast: 1.70, inkcast: 1.84, densclit: 1.76 } as const;
export const TERRESTRIS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  terrestris: TERRESTRIS_HOLD + RELEASE_S,
  peristalse: 2.48,
  soilanchor: 2.56,
  castheap: 2.42,
  surfacerise: 2.38,
  clitellum: 2.40,
  setaebrace: 2.44,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: EarthwormTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "terrestris") return 40 + roll * 26;
  if (kind === "clitellum" || kind === "surfacerise" || kind === "peristalse") return 12.8 + roll * 9.4;
  if (kind === "soilanchor" || kind === "castheap" || kind === "setaebrace") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}


export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: EarthwormTrickKind | string | null) {
  if (musicOn) return "terrestris" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "terrestris") {
    if (roll < 0.17) return "peristalse" as const;
    if (roll < 0.33) return "castheap" as const;
    if (roll < 0.49) return "surfacerise" as const;
    if (roll < 0.65) return "soilanchor" as const;
    if (roll < 0.83) return "clitellum" as const;
    return "setaebrace" as const;
  }
  if (lastKind === "peristalse") {
    if (roll < 0.16) return "terrestris" as const;
    if (roll < 0.32) return "castheap" as const;
    if (roll < 0.48) return "surfacerise" as const;
    if (roll < 0.64) return "soilanchor" as const;
    if (roll < 0.82) return "clitellum" as const;
    return "setaebrace" as const;
  }
  if (lastKind === "castheap") {
    if (roll < 0.14) return "terrestris" as const;
    if (roll < 0.3) return "peristalse" as const;
    if (roll < 0.46) return "surfacerise" as const;
    if (roll < 0.62) return "soilanchor" as const;
    if (roll < 0.8) return "clitellum" as const;
    return "setaebrace" as const;
  }
  if (lastKind === "surfacerise") {
    if (roll < 0.15) return "terrestris" as const;
    if (roll < 0.31) return "peristalse" as const;
    if (roll < 0.47) return "castheap" as const;
    if (roll < 0.63) return "soilanchor" as const;
    if (roll < 0.81) return "clitellum" as const;
    return "setaebrace" as const;
  }
  if (lastKind === "soilanchor") {
    if (roll < 0.16) return "terrestris" as const;
    if (roll < 0.32) return "peristalse" as const;
    if (roll < 0.48) return "castheap" as const;
    if (roll < 0.64) return "surfacerise" as const;
    if (roll < 0.82) return "clitellum" as const;
    return "setaebrace" as const;
  }
  if (lastKind === "clitellum") {
    if (roll < 0.15) return "terrestris" as const;
    if (roll < 0.31) return "peristalse" as const;
    if (roll < 0.47) return "castheap" as const;
    if (roll < 0.63) return "surfacerise" as const;
    if (roll < 0.81) return "soilanchor" as const;
    return "setaebrace" as const;
  }
  if (lastKind === "setaebrace") {
    if (roll < 0.16) return "terrestris" as const;
    if (roll < 0.32) return "peristalse" as const;
    if (roll < 0.48) return "castheap" as const;
    if (roll < 0.64) return "surfacerise" as const;
    if (roll < 0.82) return "soilanchor" as const;
    return "clitellum" as const;
  }
  if (roll < 0.14) return "terrestris" as const;
  if (roll < 0.28) return "peristalse" as const;
  if (roll < 0.42) return "castheap" as const;
  if (roll < 0.56) return "surfacerise" as const;
  if (roll < 0.7) return "soilanchor" as const;
  if (roll < 0.85) return "clitellum" as const;
  return "setaebrace" as const;
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
  return key === TRICK_KEY || key === "cast";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: EarthwormHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: EarthwormHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: EarthwormHappyKind | string, x: number, facing: 1 | -1): EarthwormHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as EarthwormHappyKind) : "denscast";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "denscast" ? "sit" : name === "inkcast" ? "play" : "sit") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function denscastPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.denscast));
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

export function inkcastPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkcast));
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

export function densclitPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "sit" as TrickAnim,
  };
}

export function stepHappy(happy: EarthwormHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "denscast") {
    const pose = denscastPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkcast") {
    const pose = inkcastPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densclitPose(next.t);
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

export function beginTrick(kind: EarthwormTrickKind, x: number, facing: 1 | -1): EarthwormTrick {
  const anim: TrickAnim =
    kind === "terrestris"
      ? "sit"
      : kind === "peristalse"
        ? "play"
        : kind === "soilanchor"
          ? "talk"
          : kind === "castheap"
            ? "play"
            : kind === "surfacerise"
              ? "talk"
              : kind === "clitellum"
                ? "talk"
                : kind === "setaebrace"
                  ? "sit"
                  : "sit";
  return {
    kind,
    phase: kind === "terrestris" ? "hold" : "go",
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

export function terrestrisPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function peristalsePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.peristalse));
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

export function castheapPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.castheap));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "play" as TrickAnim,
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

export function soilanchorPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.soilanchor));
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

export function setaebracePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.setaebrace));
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

export function clitellumPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.clitellum));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.5, lift: s * 2.8, rot: s * 11 * face, anim: "talk" as TrickAnim };
  }
  if (u < 0.78) {
    const hang = Math.sin(t * 2.0);
    return {
      x: fromX + face * (0.5 + hang * 0.1),
      lift: 2.8 + Math.abs(hang) * 1.2,
      rot: face * (11 + hang * 8),
      anim: "talk" as TrickAnim,
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

export function surfacerisePose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.surfacerise));
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

export function stepTrick(trick: EarthwormTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "peristalse" &&
    trick.kind !== "soilanchor" &&
    trick.kind !== "castheap" &&
    trick.kind !== "surfacerise" &&
    trick.kind !== "clitellum" &&
    trick.kind !== "setaebrace"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "terrestris") {
    if (next.t < TERRESTRIS_HOLD) {
      const pose = terrestrisPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < TERRESTRIS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - TERRESTRIS_HOLD);
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
  if (next.kind === "peristalse") {
    const pose = peristalsePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "soilanchor") {
    const pose = soilanchorPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "castheap") {
    const pose = castheapPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "surfacerise") {
    const pose = surfacerisePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "clitellum") {
    const pose = clitellumPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = setaebracePose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
