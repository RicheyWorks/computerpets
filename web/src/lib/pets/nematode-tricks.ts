/** Thread ground tricks while idle — ultra-polish pass. House neighborly Nematoda / Rhabditida Caenorhabditis elegans desk life (nematode / Thread) — sinusoid / dauerrest / pharynxpump / thrashturn / omegaturn / vulvaseek / elegans personality (sinusoid sinusoidal undulation crawl without naming crawl or undulate or wave or swim or glide or sinus or worm alone as wait, dauerrest dauer resting tuck without naming rest or dauer or tuck or sleep or wait or freeze or crouch alone as wait, pharynxpump pharynx pump feed without naming pump or pharynx or feed or sip or suck or gulp or eat alone as wait — Half planarian owns pharynxprobe, pharynxpump ok, thrashturn thrash reverse turn without naming thrash or turn or flip or coil or reverse alone as wait, omegaturn classic C. elegans omega-turn reorient without naming omega or turn or coil or loop or reverse alone as wait — distinct from thrashturn thrash reverse, vulvaseek hermaphrodite vulva egg-lay cue desk-safe without naming vulva or egg or lay or seek or breed or mate alone as wait, long elegans Caenorhabditis elegans nematode hush hold (THE elegans sit_hold tell) — never named wait or crouch or roost or stalk or monocle or fossick or anting or corvid or ciliaryglide or lightflee or preywrap or regensplit or auriclesense or pharynxprobe or dugesia or denshalf or inkhalf or denscilia or cryptotun or clawamble or mosssip or waterbearroll or styletpierce or anhydro or eutardigrada or denstun or inktun or densclaw or furculaflick or antennawalk or moistclingsoil or foldtuck or collophore or denspring or orchesella or denshop or inkhop or densfurcula or slimejet or lobopod or antennawhip or preyharpoon or oralpapilla or onychophore or peripatus or densjet or inkjet or denslobo or peristalse or castheap or surfacerise or soilanchor or clitellum or setaebrace or terrestris or denscast or inkcast or densclit or conglobate or volvation or antennafeel or detritusnip or vulgare or densarmor or inkarmor or densball or coilcurl or detritusgrub or slowmarch or moistseek or benzoquinone or metachronal or narceus or denslink or inklink or denscoil or forcipule or wallrace or antennaflick or fleetlegs or scutigera or denshaste or inkhaste or densforcep or glasscrawl or mucuscoat or nightmigrate or gravelhide or rostrata or denssilver or inksilver or densglass or tunstate or clawgrip or mossfilm or styletprobe or hypsibius or sinusoid or dauerrest or pharynxpump or thrashturn or omegaturn or vulvaseek or elegans or densthread or inkthread or densdauer or leafhush or cast or crawl or still or roll or walk or sit or hop or spring or vault or thrash or earthworm or pillbug or armor or millipede or link or house_centipede or haste or velvet_worm or jet or springtail or tardigrade or tun or planarian or half or amphipod or scud or nematode or thread as bare ethogram-only trick kinds; ethogram softs + freeze own those words; window-play unchanged if already fine; Half owns ciliaryglide/lightflee/preywrap/regensplit/auriclesense/pharynxprobe/dugesia — do NOT reuse (pharynxprobe != pharynxpump); Tun owns cryptotun/clawamble/mosssip/waterbearroll/styletpierce/anhydro/eutardigrada — do NOT reuse; Hop owns furculaflick/antennawalk/moistclingsoil/foldtuck/collophore/denspring/orchesella — do NOT reuse; Jet owns slimejet/lobopod/antennawhip/preyharpoon/oralpapilla/onychophore/peripatus — do NOT reuse; Cast owns peristalse/castheap/surfacerise/soilanchor/clitellum/setaebrace/terrestris — do NOT reuse; Silver owns mucuscoat; header forbids bare nematode/thread/thrash/still/sit and bare amphipod/scud; guest slug Thread / key nematode only for wantsThankYou matching — accept "nematode" and "thread"; do NOT name a trick "nematode" or "thread" or "planarian" or "half" or "tardigrade" or "tun" or "springtail" or "hop" or "velvet_worm" or "jet" or "earthworm" or "cast" or "pillbug" or "armor" or "millipede" or "link" or "house_centipede" or "haste" or "amphipod" or "scud" or "thrash" or "still" or "sit" or "vault" or "spring") — not Half Dugesia planarian/Platyhelminthes life, not Tun Eutardigrada tardigrade/Tardigrada life, not Hop Orchesella springtail/Collembola life, not Jet Peripatus velvet-worm/Onychophora life, not Cast Lumbricus earthworm/Annelida life, not Scud amphipod/Amphipoda next, not Rui red_panda life. Sinusoid without naming sinus alone, dauerrest without naming dauer alone, pharynxpump without naming pharynxprobe alone, thrashturn without naming thrash alone, omegaturn without naming omega alone, vulvaseek without naming vulva alone, elegans long sit_hold on the C. elegans hush (THE elegans sit_hold tell); densthread / inkthread / densdauer thank-yous. Feed-happy thank-yous sit after eat. Card-open freeze and window-play do not swallow a thank-you. Sleep, hide, and leave still win. Same map as desktop nematode-tricks.js. Window-play unchanged. Ethogram softs + freeze — never names thread/thrash/still/wait/sit/nematode as bare ethogram-only trick kinds. True Caenorhabditis elegans nematode desk life only — sinusoidal undulation, dauer resting tuck, pharynx pump, thrash reverse, classic omega turn, hermaphrodite vulva seek cue, and elegans hush; distinct from Half planarian/Platyhelminthes ciliary/auricle/pharynxprobe, Tun water-bear/Tardigrada claw/tun, Hop springtail/Collembola furcula leap, Jet velvet worm/Onychophora slime-jet, Cast earthworm/Annelida peristalsis, Scud amphipod next, creek peers, Ink, Shift, Dash, Wink, Sol, Reed, Dapple, Eft, Slip, Soak, Coal, Whee, Spine, Burr, Grin, Stripe, Wash, Cache, Cape, Flag, Rui, ferret, Prickle, Quill, and birds. Next house-order ultra: Scud / amphipod. No cry inventing — thank-yous are silent desk motion only; nematode.wav EXISTS so prefersHouseCry adds nematode after planarian. Amplitudes raised toward Rui richness; denser waits/weights. Catalog 221. */
export const TRICK_KEY = "nematode";
export const TRICKS = ["sinusoid", "dauerrest", "pharynxpump", "thrashturn", "omegaturn", "vulvaseek", "elegans"] as const;
export const HAPPY = ["densthread", "inkthread", "densdauer"] as const;
export type NematodeTrickKind = (typeof TRICKS)[number];
export type NematodeHappyKind = (typeof HAPPY)[number];
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

export type NematodeTrick = {
  kind: NematodeTrickKind;
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

export type NematodeHappy = {
  kind: NematodeHappyKind;
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

export const HAPPY_DUR = { densthread: 1.70, inkthread: 1.84, densdauer: 1.76 } as const;
export const ELEGANS_HOLD = 11.2;
export const RELEASE_S = 1.18;
export const DUR = {
  elegans: ELEGANS_HOLD + RELEASE_S,
  sinusoid: 2.48,
  dauerrest: 2.42,
  pharynxpump: 2.40,
  thrashturn: 2.44,
  omegaturn: 2.38,
  vulvaseek: 2.56,
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

export function nextTrickWait(justFinished: boolean, rand?: number, kind?: NematodeTrickKind | string) {
  const roll = rand == null ? Math.random() : rand;
  if (kind === "elegans") return 40 + roll * 26;
  if (kind === "omegaturn" || kind === "dauerrest" || kind === "sinusoid") return 12.8 + roll * 9.4;
  if (kind === "pharynxpump" || kind === "thrashturn" || kind === "vulvaseek") return 11.6 + roll * 8.5;
  return justFinished ? 8.5 + roll * 8.4 : 4.4 + roll * 7.4;
}

export function pickTrick(rand?: number, musicOn?: boolean, lastKind?: NematodeTrickKind | string | null) {
  if (musicOn) return "elegans" as const;
  const roll = rand == null ? Math.random() : rand;
  if (lastKind === "elegans") {
    if (roll < 0.17) return "sinusoid" as const;
    if (roll < 0.33) return "dauerrest" as const;
    if (roll < 0.49) return "pharynxpump" as const;
    if (roll < 0.65) return "thrashturn" as const;
    if (roll < 0.83) return "omegaturn" as const;
    return "vulvaseek" as const;
  }
  if (lastKind === "sinusoid") {
    if (roll < 0.16) return "elegans" as const;
    if (roll < 0.32) return "dauerrest" as const;
    if (roll < 0.48) return "pharynxpump" as const;
    if (roll < 0.64) return "thrashturn" as const;
    if (roll < 0.82) return "omegaturn" as const;
    return "vulvaseek" as const;
  }
  if (lastKind === "dauerrest") {
    if (roll < 0.14) return "elegans" as const;
    if (roll < 0.3) return "sinusoid" as const;
    if (roll < 0.46) return "pharynxpump" as const;
    if (roll < 0.62) return "thrashturn" as const;
    if (roll < 0.8) return "omegaturn" as const;
    return "vulvaseek" as const;
  }
  if (lastKind === "pharynxpump") {
    if (roll < 0.15) return "elegans" as const;
    if (roll < 0.31) return "sinusoid" as const;
    if (roll < 0.47) return "dauerrest" as const;
    if (roll < 0.63) return "thrashturn" as const;
    if (roll < 0.81) return "omegaturn" as const;
    return "vulvaseek" as const;
  }
  if (lastKind === "thrashturn") {
    if (roll < 0.16) return "elegans" as const;
    if (roll < 0.32) return "sinusoid" as const;
    if (roll < 0.48) return "dauerrest" as const;
    if (roll < 0.64) return "pharynxpump" as const;
    if (roll < 0.82) return "omegaturn" as const;
    return "vulvaseek" as const;
  }
  if (lastKind === "omegaturn") {
    if (roll < 0.15) return "elegans" as const;
    if (roll < 0.31) return "sinusoid" as const;
    if (roll < 0.47) return "dauerrest" as const;
    if (roll < 0.63) return "pharynxpump" as const;
    if (roll < 0.81) return "thrashturn" as const;
    return "vulvaseek" as const;
  }
  if (lastKind === "vulvaseek") {
    if (roll < 0.16) return "elegans" as const;
    if (roll < 0.32) return "sinusoid" as const;
    if (roll < 0.48) return "dauerrest" as const;
    if (roll < 0.64) return "pharynxpump" as const;
    if (roll < 0.82) return "thrashturn" as const;
    return "omegaturn" as const;
  }
  if (roll < 0.14) return "elegans" as const;
  if (roll < 0.28) return "sinusoid" as const;
  if (roll < 0.42) return "dauerrest" as const;
  if (roll < 0.56) return "pharynxpump" as const;
  if (roll < 0.7) return "thrashturn" as const;
  if (roll < 0.85) return "omegaturn" as const;
  return "vulvaseek" as const;
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
  return key === TRICK_KEY || key === "thread";
}

export function startThankYou(
  key: string | undefined | null,
  lastKind: NematodeHappyKind | null | undefined,
  x: number,
  facing: 1 | -1,
  flags?: TrickFlags
) {
  if (!wantsThankYou(key)) return null;
  if (!happyCanStart(flags || { cmd: "idle" })) return null;
  const pick = pickHappy(lastKind);
  return { happy: beginHappy(pick, x, facing), kind: pick };
}

export function pickHappy(lastKind?: NematodeHappyKind | null, rand?: number) {
  const pool = HAPPY.filter((k) => k !== lastKind);
  const list = pool.length ? pool : [...HAPPY];
  const roll = rand == null ? Math.random() : rand;
  return list[Math.floor(roll * list.length)] || list[0];
}

export function beginHappy(kind: NematodeHappyKind | string, x: number, facing: 1 | -1): NematodeHappy {
  const name = (HAPPY as readonly string[]).includes(kind) ? (kind as NematodeHappyKind) : "densthread";
  return {
    kind: name,
    happy: true,
    phase: "go",
    t: 0,
    x,
    lift: 0,
    rot: 0,
    anim: (name === "densthread" ? "sit" : name === "inkthread" ? "play" : "play") as TrickAnim,
    facing: (facing == null ? 1 : facing) as 1 | -1,
    fromX: x,
  };
}

export function densthreadPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.densthread));
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

export function inkthreadPose(t: number) {
  const u = Math.max(0, Math.min(1, t / HAPPY_DUR.inkthread));
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

export function densdauerPose(t: number) {
  return {
    lift: 2.2 + Math.abs(Math.sin(t * 0.58)) * 1.1,
    rot: Math.sin(t * 0.58) * 8,
    dx: Math.sin(t * 0.4) * 0.06,
    anim: "play" as TrickAnim,
  };
}

export function stepHappy(happy: NematodeHappy | null | undefined, dt: number, flags?: TrickFlags) {
  if (!happy || happy.phase === "done") return happy;
  if (happyShouldAbort(flags)) {
    return { ...happy, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...happy, t: happy.t + Math.max(0, dt) };
  const hold = HAPPY_DUR[next.kind];
  if (next.kind === "densthread") {
    const pose = densthreadPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "inkthread") {
    const pose = inkthreadPose(next.t);
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = densdauerPose(next.t);
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

export function beginTrick(kind: NematodeTrickKind, x: number, facing: 1 | -1): NematodeTrick {
  const anim: TrickAnim =
    kind === "elegans"
      ? "sit"
      : kind === "sinusoid"
        ? "play"
        : kind === "vulvaseek"
          ? "talk"
          : kind === "dauerrest"
            ? "sit"
            : kind === "pharynxpump"
              ? "sit"
              : kind === "thrashturn"
                ? "play"
                : kind === "omegaturn"
                  ? "play"
                  : "sit";
  return {
    kind,
    phase: kind === "elegans" ? "hold" : "go",
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

export function elegansPose(t: number) {
  return {
    lift: 2.4 + Math.abs(Math.sin(t * 0.42)) * 1.2,
    rot: -0.18 + Math.sin(t * 0.36) * 0.35,
  };
}

export function releasePose(t: number) {
  const u = Math.max(0, Math.min(1, t / RELEASE_S));
  return { lift: 2.4 * (1 - Math.sin(u * Math.PI * 0.5)), rot: -0.18 * (1 - u) };
}

export function sinusoidPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.sinusoid));
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

export function dauerrestPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.dauerrest));
  const face = facing == null ? 1 : facing;
  if (u < 0.12) {
    const s = smoothstep(u / 0.12);
    return { x: fromX, lift: s * 2.6, rot: s * 10 * face, anim: "sit" as TrickAnim };
  }
  if (u < 0.78) {
    const bob = Math.sin(t * 2.2);
    return {
      x: fromX + face * bob * 0.12,
      lift: 2.6 + Math.abs(bob) * 1.3,
      rot: face * (10 + bob * 8),
      anim: "sit" as TrickAnim,
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

export function pharynxpumpPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.pharynxpump));
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

export function thrashturnPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.thrashturn));
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

export function omegaturnPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.omegaturn));
  const face = facing == null ? 1 : facing;
  if (u < 0.14) {
    const s = smoothstep(u / 0.14);
    return { x: fromX + face * s * 0.6, lift: s * 3.0, rot: s * 12 * face, anim: "play" as TrickAnim };
  }
  if (u < 0.8) {
    const cast = Math.sin(t * 2.8);
    return {
      x: fromX + face * (0.6 + cast * 0.16),
      lift: 2.8 + Math.abs(cast) * 1.6,
      rot: face * (12 + cast * 10),
      anim: "play" as TrickAnim,
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

export function vulvaseekPose(t: number, fromX: number, facing: 1 | -1) {
  const u = Math.max(0, Math.min(1, t / DUR.vulvaseek));
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

export function stepTrick(trick: NematodeTrick | null | undefined, dt: number, flags?: TrickFlags) {
  if (!trick || trick.phase === "done") return trick;
  if (
    shouldAbort(flags) &&
    trick.kind !== "sinusoid" &&
    trick.kind !== "dauerrest" &&
    trick.kind !== "pharynxpump" &&
    trick.kind !== "thrashturn" &&
    trick.kind !== "omegaturn" &&
    trick.kind !== "vulvaseek"
  ) {
    return { ...trick, phase: "done" as const, t: 0, lift: 0, rot: 0, anim: "idle" as TrickAnim, abort: true };
  }
  const next = { ...trick, t: trick.t + Math.max(0, dt) };
  if (next.kind === "elegans") {
    if (next.t < ELEGANS_HOLD) {
      const pose = elegansPose(next.t);
      next.phase = "hold";
      next.lift = pose.lift;
      next.rot = pose.rot;
      next.anim = "sit";
      return next;
    }
    if (next.t < ELEGANS_HOLD + RELEASE_S) {
      const pose = releasePose(next.t - ELEGANS_HOLD);
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
  if (next.kind === "sinusoid") {
    const pose = sinusoidPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "dauerrest") {
    const pose = dauerrestPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "pharynxpump") {
    const pose = pharynxpumpPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "thrashturn") {
    const pose = thrashturnPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else if (next.kind === "omegaturn") {
    const pose = omegaturnPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  } else {
    const pose = vulvaseekPose(next.t, fromX, trick.facing);
    next.x = pose.x;
    next.lift = pose.lift;
    next.rot = pose.rot;
    next.anim = pose.anim;
  }
  if (u >= 1) return { ...next, phase: "done" as const, lift: 0, rot: 0, anim: "idle" as TrickAnim };
  return next;
}
